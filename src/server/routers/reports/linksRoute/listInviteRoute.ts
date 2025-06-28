import type { Env } from '#root/server/environment.js'
import type { ExpressionBuilder } from 'kysely'
import { endOfDay, toDate } from 'date-fns'
import { Hono } from 'hono'
import { sql } from 'kysely'

export const listInviteRoute = new Hono<Env>()
listInviteRoute.get('/', async (c) => {
  const db = c.get('db')
  const channelUUID = c.req.query('channelUUID')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const includeTotals = c.req.query('includeTotals') === 'true'
  const limit = Number(c.req.query('limit') ?? 10)
  const page = Number(c.req.query('page') ?? 1)
  const sortBy = c.req.query('sortBy') || 'createdAtEpoch'
  const sortOrder = c.req.query('sortOrder') === 'asc' ? 'asc' : 'desc'
  const offset = (page - 1) * limit

  if (!channelUUID) {
    return c.json({ data: [], totals: null, page, hasNextPage: false })
  }

  // Допустимые поля для сортировки
  const allowedSortFields = [
    'url',
    'name',
    'firstSubscriberEpoch',
    'subscribed',
    'unsubscribed',
    'unsub_per',
    'pdp_total',
    'cost',
    'pdp_cost',
    'cost_total',
    'createdAtEpoch',
  ] as const

  // Проверка, что sortBy валидное
  const finalSortBy: typeof allowedSortFields[number] = allowedSortFields.includes(sortBy as any)
    ? sortBy as typeof allowedSortFields[number]
    : 'createdAtEpoch'

  // Запрос для кастомных ссылок
  const customLinksQuery = db
    .selectFrom('member')
    .leftJoin('custom_invite_link as link', 'member.tgInviteLink', 'link.url')
    .leftJoin('custom_invite_link_additional as link_add', 'link.url', 'link_add.invite_link')
    .where(eb => eb.and([
      eb('link.channelUUID', '=', channelUUID),
      eb('member.tgStatus', 'in', ['member', 'left']),
      ...(from ? [eb('link.createdAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000))] : []),
      ...(to ? [eb('link.createdAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000))] : []),
    ]))
    .select([
      'link.id',
      'link.createdAtEpoch',
      sql<boolean>`false`.as('is_revoked'),
      sql<string>`'custom'`.as('source'),
      sql<string>`REPLACE(link.url, 'https://', '')`.as('url'),
      'link.name',
      sql<number>`ROUND(MIN(member."subscribedAtEpoch")) * 1000`.as('firstSubscriberEpoch'),
      sql<number>`count(member."tgUserID")`.as('subscribed'),
      sql<number>`count(case when member."tgStatus" = 'left' then 1 end)`.as('unsubscribed'),
      sql<number>`COALESCE(link_add.cost, 0)`.as('cost'),
      sql`ROUND(COALESCE(count(member."unsubscribedAtEpoch")::numeric / NULLIF(count(member."tgUserID"), 0) * 100, 0), 2)`.as('unsub_per'),
      sql`COALESCE(count(member."tgUserID") - count(case when member."tgStatus" = 'left' then 1 end), 0)`.as('pdp_total'),
      sql`ROUND(COALESCE(COALESCE(link_add.cost, 0) / NULLIF(count(member."tgUserID"), 0), 0), 0)`.as('pdp_cost'),
      sql`ROUND(COALESCE(COALESCE(link_add.cost, 0) / NULLIF((count(member."tgUserID") - count(case when member."tgStatus" = 'left' then 1 end)), 0), 0), 0)`.as('cost_total'),
    ])
    .groupBy(['link.id', 'link.url', 'link.name', 'link_add.cost'])

  // Запрос для канальных ссылок
  const channelLinksQuery = db
    .selectFrom('channel_invite_link as cil')
    .leftJoin('member', 'member.tgInviteLink', 'cil.invite_link')
    .where(eb => eb.and([
      eb('cil.channelUuid', '=', channelUUID),
      ...(from ? [eb('cil.createdAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000))] : []),
      ...(to ? [eb('cil.createdAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000))] : []),
    ]))
    .select([
      'cil.id',
      'cil.createdAtEpoch',
      'cil.is_revoked',
      sql<string>`'channel'`.as('source'),
      sql<string>`REPLACE(cil.invite_link, 'https://', '')`.as('url'),
      'cil.name',
      sql<number>`ROUND(MIN(member."subscribedAtEpoch")) * 1000`.as('firstSubscriberEpoch'),
      sql<number>`count(member."tgUserID")`.as('subscribed'),
      sql<number>`count(case when member."tgStatus" = 'left' then 1 end)`.as('unsubscribed'),
      sql<number>`COALESCE(cil.cost, 0)`.as('cost'),
      sql`ROUND(COALESCE(count(member."unsubscribedAtEpoch")::numeric / NULLIF(count(member."tgUserID"), 0) * 100, 0), 2)`.as('unsub_per'),
      sql`COALESCE(count(member."tgUserID") - count(case when member."tgStatus" = 'left' then 1 end), 0)`.as('pdp_total'),
      sql`ROUND(COALESCE(COALESCE(cil.cost, 0) / NULLIF(count(member."tgUserID"), 0), 0), 2)`.as('pdp_cost'),
      sql`ROUND(COALESCE(COALESCE(cil.cost, 0) / NULLIF((count(member."tgUserID") - count(case when member."tgStatus" = 'left' then 1 end)), 0), 0), 0)`.as('cost_total'),
    ])
    .groupBy(['cil.id', 'cil.invite_link', 'cil.name', 'cil.cost'])

  // Объединяем запросы с помощью unionAll
  const unionQuery = db
    .with('combined_data', () => customLinksQuery.unionAll(channelLinksQuery))
    .selectFrom('combined_data')
    .selectAll()
    .orderBy(finalSortBy, sortOrder)
    .limit(limit + 1)
    .offset(offset)

  // Получение результата
  const resultWithExtra = await db.executeQuery(unionQuery as any)
  const result = resultWithExtra.rows.slice(0, limit)
  const hasNextPage = resultWithExtra.rows.length > limit

  // Обработка totals
  let totals = null
  if (includeTotals) {
    const customLinksConditions = (eb: ExpressionBuilder<any, any>) => eb.and([
      eb('link.channelUUID', '=', channelUUID),
      eb('member.tgStatus', 'in', ['member', 'left']),
      ...(from ? [eb('link.createdAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000))] : []),
      ...(to ? [eb('link.createdAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000))] : []),
    ])

    const channelLinksConditions = (eb: ExpressionBuilder<any, any>) => eb.and([
      eb('cil.channelUuid', '=', channelUUID),
      ...(from ? [eb('cil.createdAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000))] : []),
      ...(to ? [eb('cil.createdAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000))] : []),
    ])

    const customLinksTotalsQuery = db
      .selectFrom('member')
      .leftJoin('custom_invite_link as link', 'member.tgInviteLink', 'link.url')
      .leftJoin('custom_invite_link_additional as link_add', 'link.url', 'link_add.invite_link')
      .where(customLinksConditions)
      .select([
        sql<number>`count(distinct member."tgUserID")`.as('customSubscribed'),
        sql<number>`count(distinct case when member."tgStatus" = 'left' then member."tgUserID" end)`.as('customUnsubscribed'),
      ])

    const customCostQuery = db
      .selectFrom('custom_invite_link as link')
      .leftJoin('custom_invite_link_additional as link_add', 'link.url', 'link_add.invite_link')
      .where(eb => eb.and([
        eb('link.channelUUID', '=', channelUUID),
        ...(from ? [eb('link.createdAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000))] : []),
        ...(to ? [eb('link.createdAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000))] : []),
      ]))
      .select([
        sql<number>`COALESCE(sum(link_add.cost), 0)`.as('customCost'),
      ])

    const channelLinksTotalsQuery = db
      .selectFrom('channel_invite_link as cil')
      .leftJoin('member', 'member.tgInviteLink', 'cil.invite_link')
      .where(channelLinksConditions)
      .select([
        sql<number>`COALESCE(sum(cil.cost), 0)`.as('channelCost'), // Исправлено: убрано , 0 из sum
        sql<number>`count(distinct member."tgUserID")`.as('channelSubscribed'),
        sql<number>`count(distinct case when member."tgStatus" = 'left' then member."tgUserID" end)`.as('channelUnsubscribed'),
      ])

    const customTotals = await customLinksTotalsQuery.executeTakeFirst()
    const customCostTotals = await customCostQuery.executeTakeFirst()
    const channelTotals = await channelLinksTotalsQuery.executeTakeFirst()

    if (customTotals && channelTotals) {
      const totalSubscribed = Number(customTotals.customSubscribed || 0) + Number(channelTotals.channelSubscribed || 0)
      const totalUnsubscribed = Number(customTotals.customUnsubscribed || 0) + Number(channelTotals.channelUnsubscribed || 0)

      let totalUnsubPer = 0
      if (totalSubscribed > 0) {
        totalUnsubPer = (totalUnsubscribed / totalSubscribed) * 100
      }
      totals = {
        id: 'total',
        title: 'Итого',
        type: 'total',
        cost: Number(customCostTotals?.customCost || 0) + Number(channelTotals.channelCost || 0),
        subscribed: totalSubscribed,
        unsubscribed: totalUnsubscribed,
        unsub_per: Math.round(totalUnsubPer * 100) / 100,
        pdp_total: totalSubscribed - totalUnsubscribed,
        pdp_cost: totalSubscribed > 0
          ? Math.round((Number(customCostTotals?.customCost || 0) + Number(channelTotals.channelCost || 0)) / totalSubscribed * 100) / 100
          : 0,
        cost_total: Math.round(
          (Number(customCostTotals?.customCost || 0) + Number(channelTotals.channelCost || 0))
          / (totalSubscribed > totalUnsubscribed ? (totalSubscribed - totalUnsubscribed) : 1) * 100,
        ) / 100,
      }
    }
  }

  return c.json({
    data: result,
    totals,
    page,
    hasNextPage,
  })
})
