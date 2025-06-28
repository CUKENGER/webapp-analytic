import type { BotEntity, BotYandexReport, DB } from '#root/db/types/kysely.js'
import type { Env } from '#root/server/environment.js'
import { endOfDay, format, subDays } from 'date-fns'
import { Hono } from 'hono'
import { type ExpressionBuilder, sql } from 'kysely'

export const botAdsRoute = new Hono<Env>()

botAdsRoute.get('/', async (c) => {
  const db = c.get('db')
  const botIdRaw = c.req.query('botId')
  let from = c.req.query('from')
  let to = c.req.query('to')

  const botId = Number(botIdRaw)
  if (!botIdRaw || Number.isNaN(botId)) {
    return c.json({ error: 'botId is missing or invalid' }, 400)
  }

  // Базовые условия фильтрации
  const baseConditions = (eb: ExpressionBuilder<DB & { yr: BotYandexReport, be: BotEntity }, 'yr' | 'be'>) =>
    eb.and([
      eb('yr.campaignID', 'is not', null),
      eb('yr.campaignID', '!=', ''),
      eb('yr.hidden', '=', false),
      eb('be.id', '=', botId),
    ])

  // Определяем диапазон дат, если from или to не переданы
  if (!from || !to) {
    const today = endOfDay(new Date())
    const defaultTo = format(today, 'yyyy-MM-dd')
    const defaultFrom = format(subDays(today, 6), 'yyyy-MM-dd')

    // Проверяем, есть ли данные за последние 7 дней
    const hasRecentData = await db
      .selectFrom('bot_yandex_report as yr')
      .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
      .where(eb =>
        eb.and([
          baseConditions(eb),
          eb('yr.date', '>=', defaultFrom),
          eb('yr.date', '<=', defaultTo),
        ]),
      )
      .select(eb => eb.fn.count('yr.id').as('count'))
      .executeTakeFirst()

    if (hasRecentData && Number(hasRecentData.count) > 0) {
      from = defaultFrom
      to = defaultTo
    }
    else {
      // Ищем ближайший доступный диапазон
      const lastReportDate = await db
        .selectFrom('bot_yandex_report as yr')
        .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
        .where(baseConditions)
        .select(eb => eb.fn.max('yr.date').as('lastDate'))
        .executeTakeFirst()

      if (lastReportDate?.lastDate) {
        to = format(new Date(lastReportDate.lastDate), 'yyyy-MM-dd')
        from = format(subDays(new Date(lastReportDate.lastDate), 30), 'yyyy-MM-dd')
      }
      else {
        from = defaultFrom
        to = defaultTo
      }
    }
  }

  // Если from или to всё ещё отсутствуют, возвращаем пустой результат
  if (!from || !to) {
    return c.json({ data: [], from, to })
  }

  // Основной запрос
  const query = db
    .selectFrom('bot_yandex_report as yr')
    .leftJoin('bot_entity as be', 'yr.botID', 'be.id')
    .where(eb =>
      eb.and([
        baseConditions(eb),
        eb('yr.date', '>=', from),
        eb('yr.date', '<=', to),
      ]),
    )
    .select([
      'yr.campaignID',
      sql<string>`MIN("campaignName")`.as('campaignName'),
      'yr.adID',
      sql<string>`MIN("adTitle")`.as('adTitle'),
    ])
    .groupBy(['yr.campaignID', 'yr.adID'])
    .orderBy('yr.campaignID', 'desc')

  const result = await query.execute()

  // Формируем список кампаний
  const campaignsMap = new Map<
    string,
    { campaignID: string, campaignName: string, ads: { adID: string, adTitle: string }[] }
  >()

  result.forEach(({ campaignID, campaignName, adID, adTitle }) => {
    if (!campaignsMap.has(campaignID)) {
      campaignsMap.set(campaignID, {
        campaignID,
        campaignName,
        ads: [],
      })
    }

    campaignsMap.get(campaignID)!.ads.push({
      adID,
      adTitle: `(${adID}) ${adTitle}`,
    })
  })

  const campaignsList = Array.from(campaignsMap.values())

  return c.json({ data: campaignsList, from, to })
})
