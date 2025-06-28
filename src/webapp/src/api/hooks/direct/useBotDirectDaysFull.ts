
// useBotDirectDaysFull.ts
import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import type { InferResponseType } from 'hono'

export type DirectReportBotDaysFullResponse = InferResponseType<
  typeof client.bot.direct.days.$get
>

type DirectReportParams = {
  botId?: string
  from: string
  to: string
  ads?: string[]
  includeTotals?: boolean
}

async function fetchDirectReportFull(
  params: DirectReportParams
): Promise<DirectReportBotDaysFullResponse> {
  const queryParams = {
    ...params,
    ...(params.ads
      ? {
          ads: params.ads.join(',')
        }
      : {})
  }

  const response = await client.bot.direct.days.$get(
    {
      query: queryParams
    },
    {
      headers: {
        'bypass-tunnel-reminder': '1'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch full direct report')
  }

  return await response.json() // Возвращаем полный ответ сервера
}

export function useBotDirectDaysFull(params: DirectReportParams) {
  return useSuspenseQuery({
    queryKey: ['botDirectReportFull', params],
    queryFn: () => fetchDirectReportFull(params),
    refetchOnWindowFocus: false
  })
}
