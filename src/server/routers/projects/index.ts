import type { DB } from '#root/db/types/kysely.js' // Добавлен импорт ExpressionBuilder
import type { Env } from '#root/server/environment.js'
import type { Kysely } from 'kysely'
import { formatISO } from 'date-fns'
import { Hono } from 'hono'
import { sql } from 'kysely'
import botsRoute from './botsRoute.js'

// Функция для преобразования epoch в ISO-формат
function formatEpochToISO(epoch: string | null): string | null {
  if (!epoch)
    return null
  try {
    const date = new Date(Number(epoch) * 1000) // Epoch в миллисекунды
    return formatISO(date) // Преобразуем в ISO: "YYYY-MM-DDTHH:mm:ssZ"
  }
  catch (e) {
    console.error('Error formatting epoch:', e)
    return null
  }
}

// Функция для получения последней активной оплаты (для каналов)
function getLatestPaymentSubquery(db: Kysely<DB>, currentEpochTime: number) {
  return db
    .selectFrom('channel_tariff_payment_epoch as ctp')
    .select([
      'ctp.channelUuid',
      sql<string>`ctp.tariff::text`.as('tariff'),
      sql<string>`ctp."paidUntilEpoch"::text`.as('paidUntilEpoch'),
      sql`ROW_NUMBER() OVER (PARTITION BY ctp."channelUuid" ORDER BY ctp."paidUntilEpoch" DESC)`.as('rn'),
    ])
    .where('ctp.paidFromEpoch', '<=', String(currentEpochTime))
    .where('ctp.paidUntilEpoch', '>=', String(currentEpochTime))
    .as('latest_payment')
}

// Функция для получения последней активной оплаты (для ботов)
function getLatestBotPaymentSubquery(db: Kysely<DB>, currentEpochTime: number) {
  return db
    .selectFrom('bot_tariff_payment_epoch as btp')
    .select([
      'btp.botId',
      sql<string>`btp.tariff::text`.as('tariff'),
      sql<string>`btp."paidUntilEpoch"::text`.as('paidUntilEpoch'),
      sql`ROW_NUMBER() OVER (PARTITION BY btp."botId" ORDER BY btp."paidUntilEpoch" DESC)`.as('rn'),
    ])
    .where('btp.paidFromEpoch', '<=', String(currentEpochTime))
    .where('btp.paidUntilEpoch', '>=', String(currentEpochTime))
    .as('latest_bot_payment')
}

export const projectsRoute = new Hono<Env>().route('/bots', botsRoute)
projectsRoute.get('/', async (c) => {
  const db = c.get('db')
  const logger = c.get('logger')
  const tgAdminID = c.req.query('tgAdminID')

  if (!tgAdminID) {
    throw new Error('tgAdminID is missing')
  }

  const currentEpochTime = Math.floor(Date.now() / 1000)

  const accessibleChannels = db
    .selectFrom('channel as c')
    .leftJoin('accesses', 'accesses.channelUuid', 'c.uuid')
    .leftJoin('user', 'user.id', 'accesses.userId')
    .select('c.uuid')
    .where(eb =>
      eb.or([
        eb.and([eb('c.tgAdminID', '=', tgAdminID), eb('c.isActive', '=', true)]),
        eb('user.tgUserID', '=', tgAdminID),
      ]),
    )
    .distinct()
    .as('accessible_channels')

  const channelsQuery = db
    .selectFrom('channel as c')
    .leftJoin(getLatestPaymentSubquery(db, currentEpochTime), join =>
      join.onRef('c.uuid', '=', 'latest_payment.channelUuid').on('latest_payment.rn', '=', 1))
    .innerJoin(accessibleChannels, 'accessible_channels.uuid', 'c.uuid')
    .select([
      sql<string>`'channel'`.as('type'),
      sql<string>`c.uuid::text`.as('id'),
      sql<string>`c."tgAdminID"::text`.as('tgAdminID'),
      sql<string>`c."tgChannelID"::text`.as('tgChannelID'),
      sql<string>`c."tgTitle"`.as('tgTitle'),
      sql<boolean>`c."isActive"`.as('isActive'),
      sql<string>`latest_payment."paidUntilEpoch"`.as('paidUntilEpoch'),
      sql<string>`latest_payment.tariff::text`.as('tariff'),
    ])
    .where('c.isActive', '=', true)

  const botsQuery = db
    .selectFrom('bot_entity as b')
    .leftJoin(getLatestBotPaymentSubquery(db, currentEpochTime), join =>
      join.onRef('b.id', '=', 'latest_bot_payment.botId').on('latest_bot_payment.rn', '=', 1))
    .select([
      sql<string>`'bot'`.as('type'),
      sql<string>`b.id::text`.as('id'),
      sql<string>`b."tgAdminID"::text`.as('tgAdminID'),
      sql<string>`b."tgBotID"::text`.as('tgChannelID'),
      sql<string>`b."tgUsername"::text`.as('tgTitle'),
      sql<boolean>`b."isActive"`.as('isActive'),
      sql<string | null>`latest_bot_payment."paidUntilEpoch"`.as('paidUntilEpoch'),
      sql<string | null>`latest_bot_payment.tariff::text`.as('tariff'),
    ])
    .where('b.tgAdminID', '=', tgAdminID)
    .where('b.isActive', '=', true)

  const projects = await db
    .selectFrom(channelsQuery.as('channels'))
    .unionAll(botsQuery)
    .select(['type', 'id', 'tgAdminID', 'tgChannelID', 'tgTitle', 'isActive', 'paidUntilEpoch', 'tariff'])
    .orderBy('paidUntilEpoch', 'asc')
    .orderBy('type', 'asc')
    .orderBy('paidUntilEpoch', 'asc')
    .execute()

  const formattedProjects = projects.map(project => ({
    type: project.type,
    id: project.id,
    tgAdminID: project.tgAdminID,
    tgChannelID: project.tgChannelID,
    tgTitle: project.tgTitle,
    isActive: project.isActive,
    paidUntilEpoch: formatEpochToISO(project.paidUntilEpoch),
    tariff: project.tariff || 'free',
  }))

  logger.info({
    message: 'Projects fetched',
    tgAdminID,
    count: formattedProjects.length,
    data: formattedProjects,
  })

  return c.json(formattedProjects)
})

projectsRoute.get('/get_full/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.get('db')
  const currentEpochTime = Math.floor(Date.now() / 1000)

  if (!id) {
    throw new Error('id is missing')
  }

  interface Project {
    type: string
    id: string
    tgAdminID: string
    tgChannelID: string
    tgTitle: string
    isActive: boolean
    yandexJWT: string | null
    yaCounterID: string | null
    paidUntilEpoch: string | null
    tariff: string | null
    landingId: number | null
    landingFolderName: string | null
  }

  // Проверяем, является ли ID каналом
  let project: Project | undefined = await db
    .selectFrom('channel as c')
    .leftJoin(getLatestPaymentSubquery(db, currentEpochTime), join =>
      join.onRef('c.uuid', '=', 'latest_payment.channelUuid').on('latest_payment.rn', '=', 1))
    .leftJoin('landing_page', 'landing_page.id', 'c.landingID')
    .select([
      sql<string>`'channel'`.as('type'),
      sql<string>`c.uuid::text`.as('id'),
      sql<string>`c."tgAdminID"::text`.as('tgAdminID'),
      sql<string>`c."tgChannelID"::text`.as('tgChannelID'),
      sql<string>`c."tgTitle"::text`.as('tgTitle'),
      sql<boolean>`c."isActive"`.as('isActive'),
      sql<string | null>`c."yandexJWT"`.as('yandexJWT'),
      sql<string | null>`c."yaCounterID"`.as('yaCounterID'),
      sql<string | null>`latest_payment."paidUntilEpoch"`.as('paidUntilEpoch'),
      sql<string | null>`latest_payment.tariff::text`.as('tariff'),
      sql<number | null>`landing_page.id`.as('landingId'),
      sql<string | null>`landing_page."folderName"`.as('landingFolderName'),
    ])
    .where('c.uuid', '=', id)
    .executeTakeFirst()

  // Если не канал, проверяем, является ли ID ботом
  if (!project) {
    project = await db
      .selectFrom('bot_entity as b')
      .leftJoin(getLatestBotPaymentSubquery(db, currentEpochTime), join =>
        join.onRef('b.id', '=', 'latest_bot_payment.botId').on('latest_bot_payment.rn', '=', 1))
      .select([
        sql<string>`'bot'`.as('type'),
        sql<string>`b.id::text`.as('id'),
        sql<string>`b.tgAdminID::text`.as('tgAdminID'),
        sql<string>`b."tgBotID"::text`.as('tgChannelID'),
        sql<string>`b.tgUsername::text`.as('tgTitle'),
        sql<boolean>`b.isActive`.as('isActive'),
        sql<string | null>`NULL::text`.as('yandexJWT'),
        sql<string | null>`NULL::text`.as('yaCounterID'),
        sql<string | null>`latest_bot_payment."paidUntilEpoch"`.as('paidUntilEpoch'),
        sql<string | null>`latest_bot_payment.tariff::text`.as('tariff'),
        sql<number | null>`NULL`.as('landingId'),
        sql<string | null>`NULL::text`.as('landingFolderName'),
      ])
      .where(sql`b.id::text`, '=', id)
      .executeTakeFirst()
  }

  if (!project) {
    return c.json({ error: 'Project not found' }, 404)
  }

  const yaLoginInfo = await getYaLoginInfo(project.yandexJWT)

  return c.json({
    type: project.type,
    id: project.id,
    tgAdminID: project.tgAdminID,
    tgChannelID: project.tgChannelID,
    tgTitle: project.tgTitle,
    isActive: project.isActive,
    yaCounterID: project.yaCounterID,
    paidUntilEpoch: formatEpochToISO(project.paidUntilEpoch),
    tariff: project.tariff || 'free',
    landingId: project.landingId,
    landingFolderName: project.landingFolderName,
    yaLoginInfo,
  })
})

async function getYaLoginInfo(yandexJWT: string | null) {
  if (!yandexJWT) {
    return null
  }

  try {
    const response = await fetch('https://login.yandex.ru/info', {
      method: 'GET',
      headers: {
        Authorization: `OAuth ${yandexJWT}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('getYaLoginInfo error', [errorData.code, errorData.message, errorData.errors])
      return null
    }

    const data = await response.json()

    if ('errors' in data) {
      console.error('getYaLoginInfo error', [data.code, data.message, data.errors])
      return null
    }
    if ('login' in data) {
      return data.login
    }

    return null
  }
  catch (e: unknown) {
    console.error('getYaLoginInfo error', e)
    return 'Не авторизован'
  }
}

projectsRoute.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.get('db')

  // Проверяем, является ли ID каналом
  let result = await db
    .selectFrom('channel as c')
    .select(sql<string>`c."tgChannelID"::text`.as('tgChannelID'))
    .where('c.uuid', '=', id)
    .executeTakeFirst()

  // Если не канал, проверяем, является ли ID ботом
  if (!result) {
    result = await db
      .selectFrom('bot_entity as b')
      .select(sql<string>`b."tgBotID"::text`.as('tgChannelID'))
      .where(sql`b.id::text`, '=', id)
      .executeTakeFirst()
  }

  if (!result) {
    return c.json({ error: 'Project not found' }, 404)
  }

  return c.json({ tgChannelID: result.tgChannelID })
})
