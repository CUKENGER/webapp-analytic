import type { Env } from '#root/server/environment.js'
import { endOfDay, toDate } from 'date-fns'
import { Hono } from 'hono'
import { sql } from 'kysely'

export const daysInviteRoute = new Hono<Env>()

daysInviteRoute.get('/', async (c) => {
  const db = c.get('db')
  const channelUUID = c.req.query('channelUUID')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const includeTotals = c.req.query('includeTotals') === 'true'
  const limit = Number(c.req.query('limit') ?? 10)
  const page = Number(c.req.query('page') ?? 1)
  const sortBy = c.req.query('sortBy') || 'date'
  const sortOrder = c.req.query('sortOrder') === 'asc' ? 'asc' : 'desc'
  const offset = (page - 1) * limit

  if (!channelUUID || !from || !to) {
    return c.json({ data: [], totals: null, page, hasNextPage: false })
  }

  // Допустимые поля для сортировки
  const allowedSortFields = [
    'date',
    'subscribed',
    'unsubscribed',
    'unsub_per',
    'pdp_total',
    'cost',
    'pdp_cost',
    'cost_total',
  ] as const

  // Проверка валидности sortBy
  const finalSortBy: (typeof allowedSortFields)[number] = allowedSortFields.includes(sortBy as any)
    ? (sortBy as (typeof allowedSortFields)[number])
    : 'date'

  // Запрос для кастомных ссылок
  const customLinksQuery = db
    .selectFrom('member')
    .leftJoin('custom_invite_link as link', 'member.tgInviteLink', 'link.url')
    .leftJoin('custom_invite_link_additional as link_add', 'link.url', 'link_add.invite_link')
    .where((eb) =>
      eb.and([
        eb('link.channelUUID', '=', channelUUID),
        eb('member.tgStatus', 'in', ['member', 'left']),
        eb('member.subscribedAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000)),
        eb('member.subscribedAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000)),
      ]),
    )
    .select([
      sql<string>`DATE(to_timestamp(member."subscribedAtEpoch"))`.as('date'),
      sql<number>`count(member."tgUserID")`.as('subscribed'),
      sql<number>`count(case when member."tgStatus" = 'left' then 1 end)`.as('unsubscribed'),
      sql<number>`COALESCE(sum(link_add.cost), 0)`.as('cost'),
      sql`ROUND(COALESCE(count(member."unsubscribedAtEpoch")::numeric / NULLIF(count(member."tgUserID"), 0) * 100, 0), 2)`.as(
        'unsub_per',
      ),
      sql`COALESCE(count(member."tgUserID") - count(case when member."tgStatus" = 'left' then 1 end), 0)`.as(
        'pdp_total',
      ),
      sql`ROUND(COALESCE(sum(link_add.cost)::numeric / NULLIF(count(member."tgUserID"), 0), 0), 2)`.as('pdp_cost'),
      sql`ROUND(COALESCE(sum(link_add.cost)::numeric / NULLIF((count(member."tgUserID") - count(case when member."tgStatus" = 'left' then 1 end)), 0), 0), 2)`.as(
        'cost_total',
      ),
    ])
    .groupBy(sql`DATE(to_timestamp(member."subscribedAtEpoch"))`)

  // Запрос для канальных ссылок
  const channelLinksQuery = db
    .selectFrom('channel_invite_link as cil')
    .leftJoin('member', 'member.tgInviteLink', 'cil.invite_link')
    .where((eb) =>
      eb.and([
        eb('cil.channelUuid', '=', channelUUID),
        eb('member.subscribedAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000)),
        eb('member.subscribedAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000)),
      ]),
    )
    .select([
      sql<string>`DATE(to_timestamp(member."subscribedAtEpoch"))`.as('date'),
      sql<number>`count(member."tgUserID")`.as('subscribed'),
      sql<number>`count(case when member."tgStatus" = 'left' then 1 end)`.as('unsubscribed'),
      sql<number>`COALESCE(sum(cil.cost), 0)`.as('cost'),
      sql`ROUND(COALESCE(count(member."unsubscribedAtEpoch")::numeric / NULLIF(count(member."tgUserID"), 0) * 100, 0), 2)`.as(
        'unsub_per',
      ),
      sql`COALESCE(count(member."tgUserID") - count(case when member."tgStatus" = 'left' then 1 end), 0)`.as(
        'pdp_total',
      ),
      sql`ROUND(COALESCE(sum(cil.cost)::numeric / NULLIF(count(member."tgUserID"), 0), 0), 2)`.as('pdp_cost'),
      sql`ROUND(COALESCE(sum(cil.cost)::numeric / NULLIF((count(member."tgUserID") - count(case when member."tgStatus" = 'left' then 1 end)), 0), 0), 2)`.as(
        'cost_total',
      ),
    ])
    .groupBy(sql`DATE(to_timestamp(member."subscribedAtEpoch"))`)

  // Объединяем запросы
  const unionQuery = db
    .with('combined_data', () => customLinksQuery.unionAll(channelLinksQuery))
    .selectFrom('combined_data')
    .select([
      'date',
      sql<number>`sum(subscribed)`.as('subscribed'),
      sql<number>`sum(unsubscribed)`.as('unsubscribed'),
      sql<number>`sum(cost)`.as('cost'),
      sql`ROUND(COALESCE(sum(unsubscribed)::numeric / NULLIF(sum(subscribed), 0) * 100, 0), 2)`.as('unsub_per'),
      sql`sum(pdp_total)`.as('pdp_total'),
      sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(subscribed), 0), 0), 2)`.as('pdp_cost'),
      sql`ROUND(COALESCE(sum(cost)::numeric / NULLIF(sum(pdp_total), 0), 0), 2)`.as('cost_total'),
    ])
    .groupBy('date')
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
    const customLinksTotalsQuery = db
      .selectFrom('member')
      .leftJoin('custom_invite_link as link', 'member.tgInviteLink', 'link.url')
      .leftJoin('custom_invite_link_additional as link_add', 'link.url', 'link_add.invite_link')
      .where((eb) =>
        eb.and([
          eb('link.channelUUID', '=', channelUUID),
          eb('member.tgStatus', 'in', ['member', 'left']),
          eb('member.subscribedAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000)),
          eb('member.subscribedAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000)),
        ]),
      )
      .select([
        sql<number>`count(distinct member."tgUserID")`.as('customSubscribed'),
        sql<number>`count(distinct case when member."tgStatus" = 'left' then member."tgUserID" end)`.as(
          'customUnsubscribed',
        ),
        sql<number>`COALESCE(sum(link_add.cost), 0)`.as('customCost'),
      ])

    const channelLinksTotalsQuery = db
      .selectFrom('channel_invite_link as cil')
      .leftJoin('member', 'member.tgInviteLink', 'cil.invite_link')
      .where((eb) =>
        eb.and([
          eb('cil.channelUuid', '=', channelUUID),
          eb('member.subscribedAtEpoch', '>=', Math.floor(toDate(from).getTime() / 1000)),
          eb('member.subscribedAtEpoch', '<=', Math.floor(endOfDay(toDate(to)).getTime() / 1000)),
        ]),
      )
      .select([
        sql<number>`count(distinct member."tgUserID")`.as('channelSubscribed'),
        sql<number>`count(distinct case when member."tgStatus" = 'left' then member."tgUserID" end)`.as(
          'channelUnsubscribed',
        ),
        sql<number>`COALESCE(sum(cil.cost), 0)`.as('channelCost'),
      ])

    const customTotals = await customLinksTotalsQuery.executeTakeFirst()
    const channelTotals = await channelLinksTotalsQuery.executeTakeFirst()

    if (customTotals && channelTotals) {
      const totalSubscribed = Number(customTotals.customSubscribed || 0) + Number(channelTotals.channelSubscribed || 0)
      const totalUnsubscribed =
        Number(customTotals.customUnsubscribed || 0) + Number(channelTotals.channelUnsubscribed || 0)
      const totalCost = Number(customTotals.customCost || 0) + Number(channelTotals.channelCost || 0)

      totals = {
        id: 'total',
        title: 'Итого',
        type: 'total',
        date: '',
        cost: totalCost,
        subscribed: totalSubscribed,
        unsubscribed: totalUnsubscribed,
        unsub_per: totalSubscribed > 0 ? Math.round((totalUnsubscribed / totalSubscribed) * 100 * 100) / 100 : 0,
        pdp_total: totalSubscribed - totalUnsubscribed,
        pdp_cost: totalSubscribed > 0 ? Math.round((totalCost / totalSubscribed) * 100) / 100 : 0,
        cost_total:
          totalSubscribed - totalUnsubscribed > 0
            ? Math.round((totalCost / (totalSubscribed - totalUnsubscribed)) * 100) / 100
            : 0,
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
