import type { DB, YandexReport } from '#root/db/types/kysely.js'
import type { Env } from '#root/server/environment.js'
import { Hono } from 'hono'
import { type ExpressionBuilder, sql } from 'kysely'

export const daysRoute = new Hono<Env>()

daysRoute.post('/', async (c) => {
  const db = c.get('db')
  const channelUUID = c.req.query('channelUUID')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const { ads = [] } = await c.req.json()

  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : undefined
  const page = c.req.query('page') ? Number(c.req.query('page')) : 1
  const offset = limit !== undefined ? (page - 1) * limit : 0
  const includeTotals = c.req.query('includeTotals') === 'true'
  const sortBy = c.req.query('sortBy') || 'date'
  const sortOrder = c.req.query('sortOrder') === 'asc' ? 'asc' : 'desc'

  if (!channelUUID || !from || !to) {
    console.log('Missing required params, returning empty response')
    return c.json({ data: [], totals: null, page })
  }

  const parsedAds: [{ campaignID: string, adID: string }] = ads.map((ad: string) => {
    const [campaignID, adID] = ad.split(':')
    return { campaignID, adID }
  })

  // Определение переиспользуемого SQL-выражения для корректного подсчета переходов
  const validRedirects = sql<number>`
    CASE
      WHEN yr.redirected > yr.clicks THEN yr.clicks
      ELSE yr.redirected
    END
  `

  // Условия фильтрации
  const filterConditions = (eb: ExpressionBuilder<DB & { yr: YandexReport }, 'yr'>) =>
    eb.and([
      eb('yr.campaignID', 'is not', null),
      eb('yr.campaignID', '!=', ''),
      eb('yr.hidden', '=', false),
      eb('yr.date', '>=', from),
      eb('yr.date', '<=', to),
      eb('yr.channelUUID', '=', channelUUID),
      ...(parsedAds.length
        ? [eb.or(parsedAds.map(ad => eb.and([eb('yr.adID', '=', ad.adID), eb('yr.campaignID', '=', ad.campaignID)])))]
        : [
            eb.not(
              eb.exists(
                eb
                  .selectFrom('bots_companies')
                  .select('campaign_id')
                  .distinct()
                  .whereRef('campaign_id', '=', 'yr.campaignID'),
              ),
            ),
            eb.not(
              eb.exists(eb.selectFrom('bots_companies').select('ad_id').distinct().whereRef('ad_id', '=', 'yr.adID')),
            ),
          ]),
    ])

  // Основной запрос данных
  let query = db
    .selectFrom('yandex_report as yr')
    .where(filterConditions)
    .select(eb => [
      'yr.date',
      sql<number>`sum(${validRedirects})`.as('redirected'),
      sql`ROUND(sum(yr.cost)::numeric, 2)`.as('cost'),
      eb.fn.sum('yr.impressions').as('impressions'),
      eb.fn.sum('yr.clicks').as('clicks'),
      eb.fn.sum('yr.subscribed').as('subscribed'),
      eb.fn.sum('yr.unsubscribed').as('unsubscribed'),
      sql`ROUND(COALESCE(sum(clicks)::numeric / NULLIF(sum(impressions), 0) * 100, 0), 2)`.as('ctr'),
      sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(clicks), 0), 0), 2)`.as('cpc'),
      sql`ROUND(LEAST(COALESCE(sum(${validRedirects})::numeric / NULLIF(sum(clicks), 0) * 100, 0), 100), 2)`.as(
        'cland',
      ),
      sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(${validRedirects}), 0), 0), 2)`.as('cpa'),
      sql`ROUND(COALESCE(sum(subscribed)::numeric / NULLIF(sum(${validRedirects}), 0) * 100, 0), 2)`.as('cpdp'),
      sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(subscribed), 0), 0), 2)`.as('pdp_cost'),
      sql`ROUND(COALESCE(sum(unsubscribed)::numeric / NULLIF(sum(subscribed), 0) * 100, 0), 2)`.as('unsub_per'),
      sql`COALESCE(sum(subscribed) - sum(unsubscribed), 0)`.as('pdp_total'),
      sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF((sum(subscribed) - sum(unsubscribed)), 0), 0), 2)`.as(
        'cost_total',
      ),
    ])
    .groupBy('yr.date')

  // Применяем сортировку
  const validSortFields = [
    'date',
    'cost',
    'impressions',
    'clicks',
    'redirected',
    'subscribed',
    'unsubscribed',
    'ctr',
    'cpc',
    'cland',
    'cpa',
    'cpdp',
    'pdp_cost',
    'unsub_per',
    'pdp_total',
    'cost_total',
  ]
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'date'

  // Функция для получения выражения сортировки
  const getSortExpression = (field: string) => {
    switch (field) {
      case 'date':
        return 'yr.date'
      case 'cost':
        return sql`ROUND(sum(yr.cost)::numeric, 2)`
      case 'impressions':
        return sql`sum(yr.impressions)`
      case 'clicks':
        return sql`sum(yr.clicks)`
      case 'redirected':
        return sql`sum(${validRedirects})`
      case 'subscribed':
        return sql`sum(yr.subscribed)`
      case 'unsubscribed':
        return sql`sum(yr.unsubscribed)`
      case 'ctr':
        return sql`ROUND(COALESCE(sum(clicks)::numeric / NULLIF(sum(impressions), 0) * 100, 0), 2)`
      case 'cpc':
        return sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(clicks), 0), 0), 2)`
      case 'cland':
        return sql`ROUND(LEAST(COALESCE(sum(${validRedirects})::numeric / NULLIF(sum(clicks), 0) * 100, 0), 100), 2)`
      case 'cpa':
        return sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(${validRedirects}), 0), 0), 2)`
      case 'cpdp':
        return sql`ROUND(COALESCE(sum(subscribed)::numeric / NULLIF(sum(${validRedirects}), 0) * 100, 0), 2)`
      case 'pdp_cost':
        return sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(subscribed), 0), 0), 2)`
      case 'unsub_per':
        return sql`ROUND(COALESCE(sum(unsubscribed)::numeric / NULLIF(sum(subscribed), 0) * 100, 0), 2)`
      case 'pdp_total':
        return sql`COALESCE(sum(subscribed) - sum(unsubscribed), 0)`
      case 'cost_total':
        return sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF((sum(subscribed) - sum(unsubscribed)), 0), 0), 2)`
      default:
        return 'yr.date'
    }
  }

  query = query.orderBy(getSortExpression(sortField), sortOrder)

  if (limit !== undefined) {
    query = query.limit(limit).offset(offset)
  }

  // Запрос для расчета итоговых значений
  let totals = null
  if (includeTotals) {
    const totalsQuery = db
      .selectFrom('yandex_report as yr')
      .where(filterConditions)
      .select(eb => [
        sql`ROUND(sum(yr.cost)::numeric, 2)`.as('cost'),
        eb.fn.sum('yr.impressions').as('impressions'),
        eb.fn.sum('yr.clicks').as('clicks'),
        eb.fn.sum('yr.subscribed').as('subscribed'),
        eb.fn.sum('yr.unsubscribed').as('unsubscribed'),
        sql<number>`sum(${validRedirects})`.as('redirected'),
        sql`ROUND(COALESCE(sum(clicks)::numeric / NULLIF(sum(impressions), 0) * 100, 0), 2)`.as('ctr'),
        sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(clicks), 0), 0), 2)`.as('cpc'),
        sql`ROUND(LEAST(COALESCE(sum(${validRedirects})::numeric / NULLIF(sum(clicks), 0) * 100, 0), 100), 2)`.as(
          'cland',
        ),
        sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(${validRedirects}), 0), 0), 2)`.as('cpa'),
        sql`ROUND(COALESCE(sum(subscribed)::numeric / NULLIF(sum(${validRedirects}), 0) * 100, 0), 2)`.as('cpdp'),
        sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(subscribed), 0), 0), 2)`.as('pdp_cost'),
        sql`ROUND(COALESCE(sum(unsubscribed)::numeric / NULLIF(sum(subscribed), 0) * 100, 0), 2)`.as('unsub_per'),
        sql`COALESCE(sum(subscribed) - sum(unsubscribed), 0)`.as('pdp_total'),
        sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF((sum(subscribed) - sum(unsubscribed)), 0), 0), 2)`.as(
          'cost_total',
        ),
      ])

    totals = await totalsQuery.executeTakeFirst()
    totals = {
      ...totals,
      id: 'total',
      title: 'Итого',
      date: '',
      type: 'total',
    }
  }

  const result = await query.execute()

  return c.json({
    data: result,
    totals,
    page,
    hasNextPage: limit !== undefined ? result.length === limit : false,
  })
})
