import type { BotEntity, BotYandexReport, DB } from '#root/db/types/kysely.js'
import type { Env } from '#root/server/environment.js'
import { endOfDay } from 'date-fns'
import { Hono } from 'hono'
import { type ExpressionBuilder, sql } from 'kysely'

export const botDaysRoute = new Hono<Env>()

botDaysRoute.get('/', async (c) => {
  const db = c.get('db')
  const botIdRaw = c.req.query('botId')
  const from = c.req.query('from')
  let to = c.req.query('to')
  const adsRaw = c.req.query('ads') || ''
  const ads = adsRaw
    ? adsRaw.split(',').map((ad) => {
      const [campaignID, adID] = ad.split(':')
      return { campaignID, adID }
    })
    : []
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : undefined
  const page = c.req.query('page') ? Number(c.req.query('page')) : 1
  const offset = limit !== undefined ? (page - 1) * limit : 0
  const includeTotals = c.req.query('includeTotals') === 'true'
  const sortBy = c.req.query('sortBy') || 'date'
  const sortOrder = c.req.query('sortOrder') === 'asc' ? 'asc' : 'desc'

  const botId = Number(botIdRaw)
  if (!botIdRaw) {
    return c.json({ error: 'botId is missing or invalid' }, 400)
  }

  // Валидация дат
  if (from && Number.isNaN(new Date(from).getTime())) {
    return c.json({ error: 'Invalid from date' }, 400)
  }
  if (to && Number.isNaN(new Date(to).getTime())) {
    return c.json({ error: 'Invalid to date' }, 400)
  }

  // Преобразуем to к концу дня, если оно есть
  if (to) {
    const toDate = new Date(to)
    to = endOfDay(toDate).toISOString()
  }

  // Основной запрос с группировкой по дате
  let query = db
    .selectFrom('bot_yandex_report as yr')
    .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
    .select([
      sql`yr.date::DATE`.as('date'),
      sql`SUM(yr.cost)`.as('cost'),
      sql`SUM(yr.impressions)`.as('impressions'),
      sql`SUM(yr.clicks)`.as('clicks'),
      sql`SUM(yr.redirected)`.as('redirected'),
      sql`SUM(yr.subscribed)`.as('subscribed'),
      sql`ROUND(COALESCE((SUM(yr.clicks)::FLOAT / NULLIF(SUM(yr.impressions), 0) * 100)::NUMERIC, 0), 2)`.as('ctr'),
      sql`ROUND(COALESCE((SUM(yr.cost)::FLOAT / NULLIF(SUM(yr.clicks), 0))::NUMERIC, 0), 2)`.as('cpc'),
      sql`ROUND(COALESCE((SUM(yr.redirected)::FLOAT / NULLIF(SUM(yr.clicks), 0) * 100)::NUMERIC, 0), 2)`.as('cland'),
      sql`ROUND(COALESCE((SUM(yr.cost)::FLOAT / NULLIF(SUM(yr.redirected), 0))::NUMERIC, 0), 2)`.as('cpa'),
      sql`ROUND(COALESCE((SUM(yr.subscribed)::FLOAT / NULLIF(SUM(yr.redirected), 0) * 100)::NUMERIC, 0), 2)`.as('cpdp'),
      sql`ROUND(COALESCE((SUM(yr.cost)::FLOAT / NULLIF(SUM(yr.subscribed), 0))::NUMERIC, 0), 2)`.as('pdp_cost'),
    ])
    .groupBy(sql`yr.date::DATE`)
    .where('yr.campaignID', 'is not', null)
    .where('yr.campaignID', '!=', '')
    .where('yr.hidden', '=', false)
    .where('be.id', '=', botId)

  // Фильтр по датам
  if (from) {
    query = query.where('yr.date', '>=', from)
  }
  if (to) {
    query = query.where('yr.date', '<=', to)
  }

  // Фильтр по ads
  if (ads.length > 0) {
    query = query.where((eb: ExpressionBuilder<DB & { yr: BotYandexReport, be: BotEntity }, 'yr'>) =>
      eb.or(
        ads.map(({ campaignID, adID }) => eb.and([eb('yr.campaignID', '=', campaignID), eb('yr.adID', '=', adID)])),
      ),
    )
  }

  // Сортировка
  const validSortFields = [
    'date',
    'cost',
    'impressions',
    'clicks',
    'redirected',
    'subscribed',
    'ctr',
    'cpc',
    'cland',
    'cpa',
    'cpdp',
    'pdp_cost',
  ] as const
  const sortField = validSortFields.includes(sortBy as any) ? sortBy : 'date'
  query = query.orderBy(sql.raw(sortField), sortOrder)

  // Подсчет общего количества записей для hasNextPage
  let totalCount = 0
  if (limit !== undefined) {
    let countQuery = db
      .selectFrom('bot_yandex_report as yr')
      .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
      .select(sql`COUNT(DISTINCT yr.date::DATE)`.as('count'))
      .where('yr.campaignID', 'is not', null)
      .where('yr.campaignID', '!=', '')
      .where('yr.hidden', '=', false)
      .where('be.id', '=', botId)

    if (from) {
      countQuery = countQuery.where('yr.date', '>=', from)
    }
    if (to) {
      countQuery = countQuery.where('yr.date', '<=', to)
    }
    if (ads.length > 0) {
      countQuery = countQuery.where((eb: ExpressionBuilder<DB & { yr: BotYandexReport, be: BotEntity }, 'yr'>) =>
        eb.or(
          ads.map(({ campaignID, adID }) => eb.and([eb('yr.campaignID', '=', campaignID), eb('yr.adID', '=', adID)])),
        ),
      )
    }

    const countResult = await countQuery.executeTakeFirst()
    totalCount = Number(countResult?.count) || 0
  }

  // Пагинация
  if (limit !== undefined) {
    query = query.limit(limit + 1).offset(offset)
  }

  // Выполняем основной запрос
  const reports = await query.execute()

  // Определяем hasNextPage
  let hasNextPage = false
  if (limit !== undefined && reports.length > limit) {
    hasNextPage = true
    reports.pop()
  }
  else if (limit !== undefined) {
    hasNextPage = offset + reports.length < totalCount
  }

  // Запрос для тоталов
  let totals = null
  if (includeTotals) {
    let totalsQuery = db
      .selectFrom('bot_yandex_report as yr')
      .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
      .select([
        sql`SUM(yr.cost)`.as('cost'),
        sql`SUM(yr.impressions)`.as('impressions'),
        sql`SUM(yr.clicks)`.as('clicks'),
        sql`SUM(yr.visited)`.as('visited'),
        sql`SUM(yr.redirected)`.as('redirected'),
        sql`SUM(yr.subscribed)`.as('subscribed'),
        sql`ROUND(COALESCE((SUM(yr.clicks)::FLOAT / NULLIF(SUM(yr.impressions), 0) * 100)::NUMERIC, 0), 2)`.as('ctr'),
        sql`ROUND(COALESCE((SUM(yr.cost)::FLOAT / NULLIF(SUM(yr.clicks), 0))::NUMERIC, 0), 2)`.as('cpc'),
        sql`ROUND(COALESCE((SUM(yr.redirected)::FLOAT / NULLIF(SUM(yr.clicks), 0) * 100)::NUMERIC, 0), 2)`.as('cland'),
        sql`ROUND(COALESCE((SUM(yr.cost)::FLOAT / NULLIF(SUM(yr.redirected), 0))::NUMERIC, 0), 2)`.as('cpa'),
        sql`ROUND(COALESCE((SUM(yr.subscribed)::FLOAT / NULLIF(SUM(yr.redirected), 0) * 100)::NUMERIC, 0), 2)`.as('cpdp'),
        sql`ROUND(COALESCE((SUM(yr.cost)::FLOAT / NULLIF(SUM(yr.subscribed), 0))::NUMERIC, 0), 2)`.as('pdp_cost'),
      ])
      .where('yr.campaignID', 'is not', null)
      .where('yr.campaignID', '!=', '')
      .where('yr.hidden', '=', false)
      .where('be.id', '=', botId)

    if (from) {
      totalsQuery = totalsQuery.where('yr.date', '>=', from)
    }
    if (to) {
      totalsQuery = totalsQuery.where('yr.date', '<=', to)
    }
    if (ads.length > 0) {
      totalsQuery = totalsQuery.where((eb: ExpressionBuilder<DB & { yr: BotYandexReport, be: BotEntity }, 'yr'>) =>
        eb.or(
          ads.map(({ campaignID, adID }) => eb.and([eb('yr.campaignID', '=', campaignID), eb('yr.adID', '=', adID)])),
        ),
      )
    }

    totals = await totalsQuery.executeTakeFirst()
  }

  // Формируем ответ
  return c.json({
    data: reports,
    totals: includeTotals ? totals : undefined,
    page,
    hasNextPage,
  })
})
