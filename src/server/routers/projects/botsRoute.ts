import type { Env } from '#root/server/environment.js'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { sql } from 'kysely'

const botsRoute = new Hono<Env>()

botsRoute.get('/:id', async (c) => {
  const logger = c.get('logger')
  const db = c.get('db')

  const tgAdminID = c.req.query('tgAdminID')
  const id = Number(c.req.param('id'))

  if (Number.isNaN(id)) {
    throw new HTTPException(400, { message: 'Invalid bot ID' })
  }

  const currentEpochTime = Math.floor(Date.now() / 1000)

  const botQuery = db
    .selectFrom('bot_entity as b')
    .leftJoin('bot_tariff_payment_epoch as btp', join =>
      join
        .onRef('btp.botId', '=', 'b.id')
        .on(sql`btp."paidFromEpoch" <= ${sql.lit(currentEpochTime)}`)
        .on(sql`btp."paidUntilEpoch" >= ${sql.lit(currentEpochTime)}`))
    .select([
      sql<string>`'bot'`.as('type'),
      sql<string>`b.id::text`.as('id'),
      sql<string>`b."tgUsername"`.as('name'),
      sql<string | null>`btp.tariff`.as('tariff'),
      sql<string | null>`CASE 
        WHEN btp.tariff = 'profi' THEN 'Профи'
        WHEN btp.tariff = 'based' THEN 'Базовый'
        WHEN btp.tariff = 'trial' THEN 'Пробный'
        ELSE NULL
      END`.as('tariff_display'),
      sql<string | null>`TO_CHAR(TO_TIMESTAMP(btp."paidUntilEpoch"), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`.as('end_date'),
      sql<string | null>`NULL`.as('landing'),
      sql<string | null>`NULL`.as('direct'),
      sql<string | null>`NULL`.as('metrica'),
      sql<string | null>`'SaleBot'`.as('type_bot'),
      sql<boolean>`b."isActive"`.as('is_active'),
    ])
    .where('b.id', '=', id)
    .where('b.isActive', '=', true)

  if (tgAdminID) {
    botQuery.where('b.tgAdminID', '=', tgAdminID)
  }

  const bot = await botQuery.executeTakeFirst()

  if (!bot) {
    throw new HTTPException(404, { message: 'Bot not found or access denied' })
  }

  logger.info({
    message: 'Bot fetched',
    botId: id,
    tgAdminID,
  })

  return c.json(bot)
})

export default botsRoute
