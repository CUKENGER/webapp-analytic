import type { BotEntity, BotYandexReport, DB } from '#root/db/types/kysely.js'
import type { Env } from '#root/server/environment.js'
import { isWithinInterval, parseISO } from 'date-fns'
import { Hono } from 'hono'
import { type ExpressionBuilder, sql } from 'kysely'
import _ from 'lodash'

export const botCampaignsRoute = new Hono<Env>()

botCampaignsRoute.get('/', async (c) => {
  const db = c.get('db')
  const botIdRaw = c.req.query('botId')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const adsRaw = c.req.query('ads') || ''
  const ads = adsRaw
    ? adsRaw.split(',').map((ad) => {
      const [campaignID, adID] = ad.split(':')
      return { campaignID: campaignID || null, adID }
    })
    : []
  const includeTotals = c.req.query('includeTotals') === 'true'
  const limit = c.req.query('limit') ? Number(c.req.query('limit')) : undefined
  const page = c.req.query('page') ? Number(c.req.query('page')) : 1
  const offset = limit !== undefined ? (page - 1) * limit : 0
  const sortBy = c.req.query('sortBy') || 'title'
  const sortOrder = c.req.query('sortOrder') === 'asc' ? 'asc' : 'desc'

  const botId = Number(botIdRaw)
  if (!botIdRaw || Number.isNaN(botId)) {
    return c.json({ error: 'botId is missing or invalid' }, 400)
  }

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

  const normalizedSortBy = fieldMapping[sortBy.toLowerCase()]
  if (!normalizedSortBy) {
    console.log('botCampaignsRoute: Invalid sort field:', sortBy)
    return c.json({ error: 'Invalid sort field' }, 400)
  }

  if (!from || !to) {
    console.log('botCampaignsRoute: Missing from or to')
    return c.json({ data: [], totals: null, page, hasNextPage: false })
  }

  const validRedirects = sql<number>`
    CASE
      WHEN yr.redirected > yr.clicks THEN yr.clicks
      ELSE yr.redirected
    END
  `

  const filterConditions = (eb: ExpressionBuilder<DB & { yr: BotYandexReport, be: BotEntity }, 'yr' | 'be'>) =>
    eb.and([
      eb('yr.campaignID', 'is not', null),
      eb('yr.campaignID', '!=', ''),
      eb('yr.hidden', '=', false),
      eb('be.id', '=', botId),
      eb('yr.date', '>=', from),
      eb('yr.date', '<=', to),
      ...(ads.length
        ? [
            eb.or(
              ads.map(ad =>
                eb.and([
                  eb('yr.adID', '=', ad.adID),
                  ad.campaignID ? eb('yr.campaignID', '=', ad.campaignID) : eb('yr.campaignID', 'is not', null),
                ]),
              ),
            ),
          ]
        : []),
    ])

  // Получаем все campaignID с уникальным campaignName
  const allCampaignsQuery = db
    .selectFrom('bot_yandex_report as yr')
    .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
    .where(filterConditions)
    .select(['yr.campaignID', sql<string>`MIN("campaignName")`.as('campaignName')])
    .groupBy('yr.campaignID')
    .distinct()

  const allCampaigns = await allCampaignsQuery.execute()
  const allCampaignIds = _.map(allCampaigns, 'campaignID')
  console.log('botCampaignsRoute allCampaignIds:', allCampaignIds)

  if (!allCampaignIds.length) {
    console.log('botCampaignsRoute: No campaigns found')
    return c.json({ data: [], totals: null, page, hasNextPage: false })
  }

  // Запрос для кампаний
  let queryCampaigns = db
    .selectFrom('bot_yandex_report as yr')
    .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
    .where(filterConditions)
    .select([
      'yr.campaignID',
      sql<string>`MIN("campaignName")`.as('campaignName'),
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
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF((sum(subscribed) - sum(unsubscribed)), 0), 0), 2)`.as('cost_total'),
    ])
    .groupBy('yr.campaignID')
    .orderBy(sql.raw(`"${normalizedSortBy}"`), sortOrder)

  if (limit !== undefined) {
    queryCampaigns = queryCampaigns.limit(limit).offset(offset)
  }

  const resultCampaigns = await queryCampaigns.execute()
  console.log('botCampaignsRoute resultCampaigns:', resultCampaigns)

  if (!resultCampaigns.length) {
    console.log('botCampaignsRoute: No campaigns after query')
    return c.json({ data: [], totals: null, page, hasNextPage: false })
  }

  // Запрос для объявлений
  const queryAds = db
    .selectFrom('bot_yandex_report as yr')
    .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
    .where(eb =>
      eb.and([
        eb('yr.campaignID', 'in', _.map(resultCampaigns, 'campaignID')),
        eb('yr.hidden', '=', false),
        eb('be.id', '=', botId),
        eb('yr.date', '>=', from),
        eb('yr.date', '<=', to),
        ...(ads.length
          ? [
              eb.or(
                ads.map(ad =>
                  eb.and([
                    eb('yr.adID', '=', ad.adID),
                    ad.campaignID ? eb('yr.campaignID', '=', ad.campaignID) : eb('yr.campaignID', 'is not', null),
                  ]),
                ),
              ),
            ]
          : []),
      ]),
    )
    .select([
      'yr.campaignID',
      sql<string>`MIN("campaignName")`.as('campaignName'),
      sql`MIN(yr.date)`.as('date'),
      'yr.adID',
      sql<string>`MIN("adTitle")`.as('adTitle'),
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
      sql<number>`ROUND(COALESCE(sum(cost)::numeric / NULLIF((sum(subscribed) - sum(unsubscribed)), 0), 0), 2)`.as('cost_total'),
    ])
    .groupBy(['yr.campaignID', 'yr.adID'])
    .orderBy('yr.campaignID')
    .orderBy(sql.raw(`"${normalizedSortBy}"`), sortOrder)
    .orderBy('yr.adID', sortOrder)

  const resultAds = await queryAds.execute()
  console.log('botCampaignsRoute resultAds:', resultAds)

  const result: { campaignID: string, campaignName: string, redirected: number, cost: number, impressions: number, clicks: number, subscribed: number, unsubscribed: number, ctr: number, cpc: number, cland: number, cpa: number, cpdp: number, pdp_cost: number, unsub_per: number, pdp_total: number, cost_total: number, type: string, title: string }[] = []
  const adsByCampaign = _.groupBy(resultAds, 'campaignID')
  const seenCampaigns = new Set<string>()
  const seenAds = new Set<string>()

  for (const campaign of resultCampaigns) {
    if (seenCampaigns.has(campaign.campaignID)) {
      console.log('botCampaignsRoute: Duplicate campaign detected:', campaign.campaignID)
      continue
    }
    seenCampaigns.add(campaign.campaignID)
    result.push({
      type: 'campaign',
      title: campaign.campaignName,
      ...campaign,
    })

    const campaignAds = adsByCampaign[campaign.campaignID] || []
    console.log('botCampaignsRoute campaignAds:', campaign.campaignID, campaignAds)

    result.push(
      ...campaignAds
        .map((ad: any) => {
          const adDate = parseISO(ad.date)
          const fromDate = parseISO(from)
          const toDate = parseISO(to)

          if (isWithinInterval(adDate, { start: fromDate, end: toDate })) {
            const adKey = `${ad.campaignID}:${ad.adID}`
            if (seenAds.has(adKey)) {
              console.log('botCampaignsRoute: Duplicate ad detected:', adKey)
              return null
            }
            seenAds.add(adKey)
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

  console.log('botCampaignsRoute result:', result)

  // Запрос для тоталов
  let totals = null
  if (includeTotals) {
    const totalsQuery = db
      .selectFrom('bot_yandex_report as yr')
      .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
      .where(eb =>
        eb.and([
          eb('yr.campaignID', 'in', allCampaignIds),
          eb('yr.hidden', '=', false),
          eb('be.id', '=', botId),
          eb('yr.date', '>=', from),
          eb('yr.date', '<=', to),
          ...(ads.length
            ? [
                eb.or(
                  ads.map(ad =>
                    eb.and([
                      eb('yr.adID', '=', ad.adID),
                      ad.campaignID ? eb('yr.campaignID', '=', ad.campaignID) : eb('yr.campaignID', 'is not', null),
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
        sql`ROUND(LEAST(COALESCE(sum(${validRedirects})::numeric / NULLIF(sum(clicks), 0) * 100, 0), 100), 2)`.as('cland'),
        sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(${validRedirects}), 0), 0), 2)`.as('cpa'),
        sql`ROUND(COALESCE(sum(subscribed)::numeric / NULLIF(sum(${validRedirects}), 0) * 100, 0), 2)`.as('cpdp'),
        sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(subscribed), 0), 0), 2)`.as('pdp_cost'),
        sql`ROUND(COALESCE(sum(unsubscribed)::numeric / NULLIF(sum(subscribed), 0) * 100, 0), 2)`.as('unsub_per'),
        sql`COALESCE(sum(subscribed) - sum(unsubscribed), 0)`.as('pdp_total'),
      ])

    totals = await totalsQuery.executeTakeFirst()
    totals = { ...totals, id: 'total', title: 'Итого', type: 'total' }
    console.log('botCampaignsRoute totals:', totals)
  }

  // Подсчёт общего количества кампаний
  const totalCampaignsQuery = db
    .selectFrom('bot_yandex_report as yr')
    .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
    .where(filterConditions)
    .select(sql<number>`COUNT(DISTINCT yr."campaignID")`.as('total'))

  const totalCampaignsResult = await totalCampaignsQuery.executeTakeFirst()
  if (!totalCampaignsResult) {
    console.error('botCampaignsRoute: Failed to fetch total campaigns count')
    return c.json({ data: [], totals: null, page, hasNextPage: false }, 500)
  }

  const totalCampaigns = totalCampaignsResult.total || 0
  const hasNextPage = limit !== undefined && offset + resultCampaigns.length < totalCampaigns
  console.log('botCampaignsRoute totalCampaigns:', totalCampaigns, 'hasNextPage:', hasNextPage)

  return c.json({
    data: result,
    totals: includeTotals ? totals : null,
    page,
    hasNextPage,
  })
})
