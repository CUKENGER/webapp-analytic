import type { Env } from '#root/server/environment.js'
import { toDate } from 'date-fns'
import { Hono } from 'hono'
import { sql } from 'kysely'

type ProviderType = 'yandex' | 'other' | 'link' | 'unknown'

export const audienceRoute = new Hono<Env>()
audienceRoute.get('/', async (c) => {
  const db = c.get('db')
  const channelUUID = c.req.query('channelUUID')
  const from = c.req.query('from')
  const to = c.req.query('to')
  const limit = Number(c.req.query('limit') ?? 10)
  const page = Number(c.req.query('page') ?? 1)
  const sortBy = c.req.query('sortBy') || 'subscribedAtEpoch'
  const sortOrder = c.req.query('sortOrder') === 'asc' ? 'asc' : 'desc'
  const offset = (page - 1) * limit

  // Получаем массив провайдеров из query параметра
  const providerQueries = c.req.queries('provider')
  const providers: ProviderType[] | undefined
    = providerQueries && providerQueries.length > 0 ? (providerQueries as ProviderType[]) : undefined

  if (!channelUUID) {
    throw new Error('channelUUID is missing')
  }

  // Допустимые поля для сортировки
  const allowedSortFields = ['provider', 'tgUserID', 'tgUsername', 'subscribedAtEpoch', 'unsubscribedAtEpoch'] as const

  // Проверка, что sortBy валидное
  const finalSortBy = allowedSortFields.includes(sortBy as any) ? sortBy : 'subscribedAtEpoch'

  // Маппинг sortBy на выражения Kysely
  const sortFieldMap: Record<string, string> = {
    provider: `COALESCE(
      CASE
        WHEN c."isRedirectConversed" IS TRUE AND m."tgInviteLink" IS NULL THEN 'Яндекс '
        WHEN m."tgInviteLink" LIKE '%...' THEN 'Другое: ' || m."tgInviteLink"
        WHEN c."isRedirectConversed" IS TRUE AND m."tgInviteLink" IS NOT NULL THEN 'Ссылка: ' || m."tgInviteLink"
      END, 'Не определено')`,
    tgUserID: 'm."tgUserID"',
    tgUsername: 'm."tgUsername"',
    subscribedAtEpoch: `ROUND(m."subscribedAtEpoch"::numeric + 3600 * 3) * 1000`,
    unsubscribedAtEpoch: `ROUND(m."unsubscribedAtEpoch"::numeric + 3600 * 3) * 1000`,
  }

  const result = await db
    .selectFrom('member as m')
    .where(eb =>
      eb.and([
        eb('m.subscribedAtEpoch', 'is not', null),
        ...(from ? [eb('m.subscribedAtEpoch', '>=', Math.floor((toDate(from).getTime() + 3600 * 3) / 1000))] : []),
        ...(to ? [eb('m.subscribedAtEpoch', '<=', Math.floor((toDate(to).getTime() + 3600 * 3) / 1000))] : []),
      ]),
    )
    .leftJoin('client as c', 'm.id', 'c.memberID')
    .where((eb) => {
      if (!providers || providers.length === 0) {
        return eb.and([])
      }
      return eb.or(
        providers.map((provider) => {
          if (provider === 'yandex') {
            return eb.and([eb('c.isRedirectConversed', '=', true), eb('m.tgInviteLink', 'is', null)])
          }
          else if (provider === 'other') {
            return eb('m.tgInviteLink', 'like', '%...')
          }
          else if (provider === 'link') {
            return eb.and([
              eb('c.isRedirectConversed', '=', true),
              eb('m.tgInviteLink', 'is not', null),
              eb('m.tgInviteLink', 'not like', '%...'),
            ])
          }
          else if (provider === 'unknown') {
            return eb.and([
              eb.or([eb('c.isRedirectConversed', 'is', null), eb('c.isRedirectConversed', '=', false)]),
              eb.or([
                eb('m.tgInviteLink', 'is', null),
                eb.and([eb('m.tgInviteLink', 'is not', null), eb('m.tgInviteLink', 'not like', '%...')]),
              ]),
            ])
          }
          return eb.and([])
        }),
      )
    })
    .innerJoin('channel as ch', join =>
      join.onRef('m.tgChannelID', '=', 'ch.tgChannelID').on('ch.uuid', '=', channelUUID))
    .select([
      'm.tgUserID',
      'm.tgUsername',
      sql<number>`ROUND(m."subscribedAtEpoch"::numeric + 3600 * 3) * 1000`.as('subscribedAtEpoch'),
      sql<number>`ROUND(m."unsubscribedAtEpoch"::numeric + 3600 * 3) * 1000`.as('unsubscribedAtEpoch'),
      sql<string>`COALESCE(
        CASE
          WHEN c."isRedirectConversed" IS TRUE AND m."tgInviteLink" IS NULL THEN 'Яндекс '
          WHEN m."tgInviteLink" LIKE '%...' THEN 'Другое: ' || m."tgInviteLink"
          WHEN c."isRedirectConversed" IS TRUE AND m."tgInviteLink" IS NOT NULL THEN 'Ссылка: ' || m."tgInviteLink"
        END, 'Не определено')
      `.as('provider'),
    ])
    .orderBy(sql.raw(`${sortFieldMap[finalSortBy]} ${sortOrder} NULLS LAST`))
    .limit(limit + 1)
    .offset(offset)
    .execute()

  const hasNextPage = result.length > limit
  const data = result.slice(0, limit)

  return c.json({ data, page, hasNextPage })
})
