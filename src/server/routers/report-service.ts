// @ts-nocheck
import type { DB } from '#root/db/types/kysely.js'
import type { Env } from '#root/server/environment.js'
import type { Kysely } from 'kysely'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sql } from 'kysely'

const reportService = new Hono<Env>()

reportService.get('/', async (c) => {
  const db = c.get('db')
  const channelUUID = c.req.query('channelUUID')
  const limit = Number(c.req.query('limit') ?? 10)
  const offset = Number(c.req.query('offset') ?? 0)

  const from = c.req.query('from')
  const to = c.req.query('to')

  // Получение общего количества уникальных campaignID для пагинации
  const totalQuery = db
    .selectFrom('yandex_report as yr')
    .where('yr.channelUUID', '=', channelUUID)
    .where('yr.campaignID', 'is not', null)
    .where('yr.campaignID', '!=', '')
    .where('yr.hidden', '=', false)
    .select([sql`count(DISTINCT yr."campaignID")`.as('total')])
    .execute()

  const totalResult = await totalQuery
  const total = totalResult[0]?.total ?? 0

  const query = db
    .selectFrom('yandex_report as yr')
    .leftJoin('channel as c', 'yr.channelUUID', 'c.uuid')
    .leftJoin('subscribes_stats_by_yandex_report as ssbyr', join =>
      join
        .on(
          sql`yr
        .
        date
        ::DATE`,
          '=',
          sql`ssbyr
        .
        date`,
        )
        .onRef('yr.campaignID', '=', 'ssbyr.campaign_id')
        .onRef('yr.adID', '=', 'ssbyr.ad_id')
        .onRef('c.tgChannelID', '=', 'ssbyr.channel_id'))
    .leftJoin('subscribes_stats_by_yandex_report_master_companies as ssbyrmc', join =>
      join
        .on(
          sql`yr
        .
        date
        ::DATE`,
          '=',
          sql`ssbyrmc
        .
        date`,
        )
        .onRef('yr.campaignID', '=', 'ssbyrmc.campaign_id')
        .onRef('c.tgChannelID', '=', 'ssbyrmc.channel_id'))
    .select([
      sql`MAX(yr.date::DATE)`.as('date'),
      'yr.campaignID',
      'yr.campaignName',
      sql`SUM(yr.cost)`.as('cost'),
      sql`SUM(yr.impressions)`.as('impressions'),
      sql`SUM(yr.clicks)`.as('clicks'),
      sql`SUM(
        CASE
          WHEN yr.redirected > yr.clicks THEN yr.clicks
          ELSE yr.redirected
        END
      )`.as('redirected'),
      sql`SUM(
        CASE
          WHEN yr."adID" = 'Мастер компаний' THEN COALESCE(ssbyrmc.subscribed, 0)
          WHEN yr."adID" = '--' THEN COALESCE(ssbyrmc.subscribed, 0)
          ELSE COALESCE(ssbyr.subscribed, 0)
        END
      )`.as('subscribed'),
      sql`SUM(
        CASE
          WHEN yr."adID" = 'Мастер компаний' THEN COALESCE(ssbyrmc.unsubscribed, 0)
          WHEN yr."adID" = '--' THEN COALESCE(ssbyrmc.unsubscribed, 0)
          ELSE COALESCE(ssbyr.unsubscribed, 0)
        END
      )`.as('unsubscribed'),
      'yr.channelUUID',
      'yr.hidden',
    ])
    .where('yr.channelUUID', '=', channelUUID)
    .where('yr.campaignID', 'is not', null)
    .where('yr.campaignID', '!=', '')
    .where('yr.hidden', '=', false)
    .groupBy(['yr.campaignID', 'yr.campaignName', 'yr.channelUUID', 'yr.hidden'])
    .orderBy(sql`MAX(yr.date::DATE)`, 'desc')
    .limit(limit)
    .offset(offset)

  const result = await query.execute()

  return c.json({
    total,
    data: result,
  })
})

reportService.use('/campaign_id/:id', cors())
reportService.get('/campaign_id/:id', async (c) => {
  const db = c.get('db') as Kysely<DB>
  const campaignID = c.req.param('id')

  // Валидация входных параметров
  if (isNaN(Number(campaignID))) {
    return c.json({ error: 'Invalid id parameter' }, 400)
  }

  const limit = Number(c.req.query('limit') ?? 10)
  const offset = Number(c.req.query('offset') ?? 0)

  const from = c.req.query('from')
  const to = c.req.query('to')

  try {
    const data = await db
      .selectFrom('yandex_report')
      .select([
        'date',
        'campaignID',
        'campaignName',
        sql`SUM(cost)`.as('cost'),
        sql`SUM(impressions)`.as('impressions'),
        sql`SUM(clicks)`.as('clicks'),
        sql`SUM(redirected)`.as('redirected'),
        sql`SUM(subscribed)`.as('subscribed'),
        sql`SUM(unsubscribed)`.as('unsubscribed'),
        'channelUUID',
        'hidden',
      ])
      .where('campaignID', '=', campaignID)
      .where('hidden', '=', false)
      .where('date', '>=', from)
      .where('date', '<=', to)
      .groupBy(['date', 'campaignID', 'campaignName', 'channelUUID', 'hidden'])
      .orderBy('date', 'desc')
      .limit(limit)
      .offset(offset)
      .execute()

    const chart = await db
      .selectFrom('yandex_report')
      .where('campaignID', '=', campaignID)
      .where('date', '>=', from)
      .where('date', '<=', to)
      .where('hidden', '=', false)
      .select(['date', db.fn.sum('cost').as('total_cost')])
      .groupBy('date')
      .orderBy('date', 'asc')
      .execute()

    return c.json({
      total: chart.length,
      chart,
      data,
    })
  }
  catch (error) {
    console.error('Ошибка при выполнении запроса:', error)
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500)
  }
})

export default reportService
