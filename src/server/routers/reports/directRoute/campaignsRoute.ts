import type { DB, YandexReport } from '#root/db/types/kysely.js'
import type { Env } from '#root/server/environment.js'
import { isWithinInterval, parseISO } from 'date-fns'
import { Hono } from 'hono'
import { type ExpressionBuilder, sql } from 'kysely'
import _ from 'lodash'

export const campaignsRoute = new Hono<Env>()

campaignsRoute.post('/', async (c) => {
  const db = c.get('db')
  const logger = c.get('logger')
  const channelUUID = c.req.query('channelUUID')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const { ads = [] } = await c.req.json() // Изменено с adsRaw на ads

  logger.info('Request body parsed', { ads, channelUUID, from, to })

  const includeTotals = c.req.query('includeTotals') === 'true'
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : undefined
  const page = c.req.query('page') ? Number(c.req.query('page')) : 1
  const offset = limit !== undefined ? (page - 1) * limit : 0
  const sortBy = c.req.query('sortBy') || 'title'
  const sortOrder = c.req.query('sortOrder') === 'asc' ? 'asc' : 'desc'

  const fieldMapping: { [key: string]: string } = {
    title: 'campaignName',
    cost: 'cost',
    impressions: 'impressions',
    clicks: 'clicks',
    redirected: 'redirected',
    subscribed: 'subscribed',
    unsubscribed: 'unsubscribed',
    ctr: 'ctr',
    cpc: 'cpc',
    cland: 'cland',
    cpa: 'cpa',
    cpdp: 'cpdp',
    pdp_cost: 'pdp_cost',
    unsub_per: 'unsub_per',
    pdp_total: 'pdp_total',
    cost_total: 'cost_total',
  }

  logger.info('Processing ads', { ads })
  let parsedAds: { campaignID: string, adID: string }[] = []
  try {
    parsedAds = ads
      .filter((ad: string) => typeof ad === 'string' && ad.includes(':'))
      .map((ad: string) => {
        const [campaignID, adID] = ad.split(':')
        if (!adID) {
          logger.warn('Invalid ad format', { ad })
          console.warn('Invalid ad format', ad)
          throw new Error(`Invalid ad format: ${ad}`)
        }
        return { campaignID: campaignID || '', adID }
      })
    logger.info('Parsed ads', { parsedAds })
  }
  catch (error) {
    logger.error('Failed to parse ads', { error: (error as Error).message, ads })
    console.error('Failed to parse ads', { error: (error as Error).message, ads })
    return c.json({ error: 'Invalid ads format' }, 400)
  }

  const normalizedSortBy = fieldMapping[sortBy.toLowerCase()]
  if (!normalizedSortBy) {
    logger.warn('Invalid sort field', { sortBy })
    console.warn('Invalid sort field', sortBy)
    return c.json({ error: 'Invalid sort field' }, 400)
  }

  if (!channelUUID || !from || !to) {
    logger.warn('Missing required params', { channelUUID, from, to })
    console.warn('Missing required params', { channelUUID, from, to })
    return c.json({ data: [], totals: null, page, hasNextPage: false })
  }

  // Проверка формата дат
  try {
    parseISO(from)
    parseISO(to)
  }
  catch (error) {
    logger.error('Invalid date format', { from, to, error: (error as Error).message })
    console.error('Invalid date format', { from, to, error: (error as Error).message })
    return c.json({ error: 'Invalid date format' }, 400)
  }

  const validRedirects = sql<number>`
    CASE
      WHEN yr.redirected > yr.clicks THEN yr.clicks
      ELSE yr.redirected
    END
  `

  const filterConditions = (eb: ExpressionBuilder<DB & { yr: YandexReport }, 'yr'>) =>
    eb.and([
      eb('yr.campaignID', 'is not', null),
      eb('yr.campaignID', '!=', ''),
      eb('yr.hidden', '=', false),
      eb('yr.channelUUID', '=', channelUUID),
      eb('yr.date', '>=', from),
      eb('yr.date', '<=', to),
      ...(parsedAds.length
        ? [
            eb.or(
              parsedAds.map(ad =>
                eb.and([
                  eb('yr.adID', '=', ad.adID),
                  ...(ad.campaignID ? [eb('yr.campaignID', '=', ad.campaignID)] : []),
                ]),
              ),
            ),
          ]
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

  logger.info('Executing allCampaignsQuery', { channelUUID, from, to, adsLength: parsedAds.length })
  const allCampaignsQuery = db
    .selectFrom('yandex_report as yr')
    .where(filterConditions)
    .select('yr.campaignID')
    .distinct()

  const allCampaigns = await allCampaignsQuery.execute()
  const allCampaignIds = _.map(allCampaigns, 'campaignID')
  logger.info('All campaigns fetched', { allCampaignIds })

  if (!allCampaignIds.length) {
    logger.info('No campaigns found', { channelUUID, from, to, ads: parsedAds })
    return c.json({ data: [], totals: null, page, hasNextPage: false })
  }

  let queryCampaigns = db
    .selectFrom('yandex_report as yr')
    .where(filterConditions)
    .select([
      'yr.campaignID',
      'yr.campaignName',
      sql<number>`COALESCE(sum(${validRedirects}), 0)`.as('redirected'),
      sql<number>`COALESCE(ROUND(sum(yr.cost)::numeric, 2), 0)`.as('cost'),
      sql<number>`COALESCE(sum(yr.impressions), 0)`.as('impressions'),
      sql<number>`COALESCE(sum(yr.clicks), 0)`.as('clicks'),
      sql<number>`COALESCE(sum(yr.subscribed), 0)`.as('subscribed'),
      sql<number>`COALESCE(sum(yr.unsubscribed), 0)`.as('unsubscribed'),
      sql<number>`ROUND(COALESCE(sum(clicks)::numeric / NULLIF(sum(impressions), 0) * 100, 0), 2)`.as('ctr'),
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(clicks), 0), 0), 2)`.as('cpc'),
      sql<number>`ROUND(COALESCE(sum(${validRedirects})::numeric / NULLIF(sum(clicks), 0) * 100, 0), 2)`.as('cland'),
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(${validRedirects}), 0), 0), 2)`.as('cpa'),
      sql<number>`ROUND(COALESCE(sum(subscribed)::numeric / NULLIF(sum(${validRedirects}), 0) * 100, 0), 2)`.as('cpdp'),
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(subscribed), 0), 0), 2)`.as('pdp_cost'),
      sql<number>`ROUND(COALESCE(sum(unsubscribed)::numeric / NULLIF(sum(subscribed), 0) * 100, 0), 2)`.as('unsub_per'),
      sql<number>`COALESCE(sum(subscribed) - sum(unsubscribed), 0)`.as('pdp_total'),
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF((sum(subscribed) - sum(unsubscribed)), 0), 0), 2)`.as(
        'cost_total',
      ),
    ])
    .groupBy(['yr.campaignID', 'yr.campaignName'])
    .orderBy(sql.raw(`"${normalizedSortBy}"`), sortOrder)

  if (limit !== undefined) {
    queryCampaigns = queryCampaigns.limit(limit).offset(offset)
  }

  logger.info('Executing queryCampaigns', { limit, offset, sortBy, sortOrder })
  const resultCampaigns = await queryCampaigns.execute()
  logger.info('Campaigns fetched', {
    campaignsCount: resultCampaigns.length,
    campaignIds: _.map(resultCampaigns, 'campaignID'),
  })

  if (!resultCampaigns.length) {
    logger.info('No campaigns after filtering', { channelUUID, from, to, ads: parsedAds })
    return c.json({ data: [], totals: null, page, hasNextPage: false })
  }

  const queryAds = db
    .selectFrom('yandex_report as yr')
    .where(eb =>
      eb.and([
        eb('yr.campaignID', 'in', _.map(resultCampaigns, 'campaignID')),
        eb('yr.hidden', '=', false),
        eb('yr.channelUUID', '=', channelUUID),
        eb('yr.date', '>=', from),
        eb('yr.date', '<=', to),
        ...(parsedAds.length
          ? [
              eb.or(
                parsedAds.map(ad =>
                  eb.and([
                    eb('yr.adID', '=', ad.adID),
                    ...(ad.campaignID ? [eb('yr.campaignID', '=', ad.campaignID)] : []),
                  ]),
                ),
              ),
            ]
          : []),
      ]),
    )
    .select([
      'yr.campaignID',
      'yr.campaignName',
      sql`MIN(yr.date)`.as('date'),
      'yr.adID',
      'yr.adTitle',
      sql<number>`COALESCE(sum(${validRedirects}), 0)`.as('redirected'),
      sql<number>`COALESCE(ROUND(sum(yr.cost)::numeric, 2), 0)`.as('cost'),
      sql<number>`COALESCE(sum(yr.impressions), 0)`.as('impressions'),
      sql<number>`COALESCE(sum(yr.clicks), 0)`.as('clicks'),
      sql<number>`COALESCE(sum(yr.subscribed), 0)`.as('subscribed'),
      sql<number>`COALESCE(sum(yr.unsubscribed), 0)`.as('unsubscribed'),
      sql<number>`ROUND(COALESCE(sum(clicks)::numeric / NULLIF(sum(impressions), 0) * 100, 0), 2)`.as('ctr'),
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(clicks), 0), 0), 2)`.as('cpc'),
      sql<number>`ROUND(COALESCE(sum(${validRedirects})::numeric / NULLIF(sum(clicks), 0) * 100, 0), 2)`.as('cland'),
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(${validRedirects}), 0), 0), 2)`.as('cpa'),
      sql<number>`ROUND(COALESCE(sum(subscribed)::numeric / NULLIF(sum(${validRedirects}), 0) * 100, 0), 2)`.as('cpdp'),
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(subscribed), 0), 0), 2)`.as('pdp_cost'),
      sql<number>`ROUND(COALESCE(sum(unsubscribed)::numeric / NULLIF(sum(subscribed), 0) * 100, 0), 2)`.as('unsub_per'),
      sql<number>`COALESCE(sum(subscribed) - sum(unsubscribed), 0)`.as('pdp_total'),
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF((sum(subscribed) - sum(unsubscribed)), 0), 0), 2)`.as(
        'cost_total',
      ),
    ])
    .groupBy(['yr.campaignID', 'yr.campaignName', 'yr.adID', 'yr.adTitle'])
    .orderBy('yr.campaignID')
    .orderBy(sql.raw(`"${normalizedSortBy}"`), sortOrder)
    .orderBy('yr.adID', sortOrder)

  logger.info('Executing queryAds', { campaignIds: _.map(resultCampaigns, 'campaignID') })
  const resultAds = await queryAds.execute()
  logger.info('Ads fetched', { adsCount: resultAds.length, adIds: _.map(resultAds, 'adID') })

  const result = []
  const adsByCampaign = _.groupBy(resultAds, 'campaignID')
  for (const campaign of resultCampaigns) {
    result.push({
      type: 'campaign',
      title: campaign.campaignName,
      ...campaign,
    })

    const campaignAds = adsByCampaign[campaign.campaignID] || []
    result.push(
      ...campaignAds
        .map((ad: any) => {
          const adDate = parseISO(ad.date)
          const fromDate = parseISO(from)
          const toDate = parseISO(to)

          if (isWithinInterval(adDate, { start: fromDate, end: toDate })) {
            const { date, campaignName, ...adWithoutDate } = ad
            return {
              type: 'ad',
              title: `${ad.adTitle || ad.adID}`,
              ...adWithoutDate,
            }
          }
          return null
        })
        .filter((ad: any) => ad !== null),
    )
  }

  let totals = null
  if (includeTotals) {
    const totalsQuery = db
      .selectFrom('yandex_report as yr')
      .where(eb =>
        eb.and([
          eb('yr.campaignID', 'in', allCampaignIds),
          eb('yr.hidden', '=', false),
          eb('yr.channelUUID', '=', channelUUID),
          eb('yr.date', '>=', from),
          eb('yr.date', '<=', to),
          ...(parsedAds.length
            ? [
                eb.or(
                  parsedAds.map(ad =>
                    eb.and([
                      eb('yr.adID', '=', ad.adID),
                      ...(ad.campaignID ? [eb('yr.campaignID', '=', ad.campaignID)] : []),
                    ]),
                  ),
                ),
              ]
            : []),
        ]),
      )
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
      ])

    logger.info('Executing totalsQuery')
    totals = await totalsQuery.executeTakeFirst()
    totals = { ...totals, id: 'total', title: 'Итого', type: 'total' }
    logger.info('Totals fetched', { totals })
  }

  const totalCampaignsQuery = db
    .selectFrom('yandex_report as yr')
    .where(filterConditions)
    .select(sql<number>`COUNT(DISTINCT yr."campaignID")`.as('total'))
    .executeTakeFirst()

  logger.info('Executing totalCampaignsQuery')
  const totalCampaignsResult = await totalCampaignsQuery
  if (!totalCampaignsResult) {
    logger.error('Failed to fetch total campaigns count', { sql: totalCampaignsQuery })
    console.error('Failed to fetch total campaigns count', { sql: totalCampaignsQuery })
    return c.json({ data: [], totals: null, page, hasNextPage: false }, 500)
  }

  const totalCampaigns = totalCampaignsResult.total || 0
  const hasNextPage = limit !== undefined && offset + resultCampaigns.length < totalCampaigns
  logger.info('Response prepared', { resultCount: result.length, hasNextPage, page, campaignIds: allCampaignIds })

  return c.json({
    data: result,
    totals: includeTotals ? totals : null,
    page,
    hasNextPage,
  })
})
