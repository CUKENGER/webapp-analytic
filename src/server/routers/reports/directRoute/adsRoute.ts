import type { DB, YandexReport } from '#root/db/types/kysely.js'
import type { Env } from '#root/server/environment.js'
import type { ExpressionBuilder } from 'kysely'
import { endOfDay, format, subDays } from 'date-fns'
import { Hono } from 'hono'

export const adsRoute = new Hono<Env>()
adsRoute.get('/', async (c) => {
  const db = c.get('db')
  const channelUUID = c.req.query('channelUUID')
  let from = c.req.query('from')
  let to = c.req.query('to')

  if (!channelUUID) {
    throw new Error('channelUUID is missing')
  }

  // Базовые условия фильтрации
  const baseConditions = (eb: ExpressionBuilder<DB & { yr: YandexReport }, 'yr'>) =>
    eb.and([
      eb('yr.campaignID', 'is not', null),
      eb('yr.campaignID', '!=', ''),
      eb('yr.hidden', '=', false),
      eb('yr.channelUUID', '=', channelUUID),
      eb.not(
        eb.exists(
          eb.selectFrom('bots_companies')
            .select('campaign_id')
            .distinct()
            .whereRef('campaign_id', '=', 'yr.campaignID'),
        ),
      ),
      eb.not(
        eb.exists(
          eb.selectFrom('bots_companies')
            .select('ad_id')
            .distinct()
            .whereRef('ad_id', '=', 'yr.adID'),
        ),
      ),
    ])

  // Определяем диапазон дат, если from или to не переданы
  if (!from || !to) {
    // Определяем текущую дату и последние 7 дней
    const today = endOfDay(new Date()) // Сегодня до конца дня
    const defaultTo = format(today, 'yyyy-MM-dd')
    const defaultFrom = format(subDays(today, 6), 'yyyy-MM-dd') // 7 дней назад

    // Проверяем, есть ли данные за последние 7 дней
    const hasRecentData = await db
      .selectFrom('yandex_report as yr')
      .where(eb =>
        eb.and([
          baseConditions(eb),
          eb('yr.date', '>=', defaultFrom),
          eb('yr.date', '<=', defaultTo),
        ]),
      )
      .select(eb => eb.fn.count('yr.date').as('count'))
      .executeTakeFirst()

    if (hasRecentData && Number(hasRecentData.count) > 0) {
      // Если данные за последние 7 дней есть, используем этот диапазон
      from = defaultFrom
      to = defaultTo
    }
    else {
      // Если данных за неделю нет, ищем ближайший доступный диапазон
      const lastReportDate = await db
        .selectFrom('yandex_report as yr')
        .where(baseConditions)
        .select(eb => eb.fn.max('date').as('lastDate'))
        .executeTakeFirst()

      if (lastReportDate?.lastDate) {
        to = lastReportDate.lastDate
        from = format(subDays(new Date(lastReportDate.lastDate), 30), 'yyyy-MM-dd') // Последний месяц
      }
      else {
        // Если данных вообще нет, используем дефолтный диапазон
        from = defaultFrom
        to = defaultTo
      }
    }
  }

  // Если после всех проверок from или to все еще отсутствуют, возвращаем пустой результат
  if (!from || !to) {
    return c.json({ data: [], from, to })
  }

  // Основной запрос с учетом определенного диапазона
  const query = db
    .selectFrom('yandex_report as yr')
    .where(eb =>
      eb.and([
        baseConditions(eb),
        eb('yr.date', '>=', from),
        eb('yr.date', '<=', to),
      ]),
    )
    .select([
      'yr.campaignID',
      'yr.campaignName',
      'yr.adID',
      'yr.adTitle',
    ])
    .distinctOn(['yr.campaignID', 'yr.adID'])
    .orderBy('yr.campaignID', 'desc')

  const result = await query.execute()

  const campaignsMap = new Map()

  result.forEach(({ campaignID, campaignName, adID, adTitle }) => {
    if (!campaignsMap.has(campaignID)) {
      campaignsMap.set(campaignID, {
        campaignID,
        campaignName,
        ads: [],
      })
    }

    campaignsMap.get(campaignID).ads.push({
      adID,
      adTitle: `(${adID}) ${adTitle}`,
    })
  })

  const campaignsList = Array.from(campaignsMap.values())

  return c.json({ data: campaignsList, from, to })
})
