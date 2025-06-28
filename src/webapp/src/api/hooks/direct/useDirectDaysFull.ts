// useDirectDaysFull.ts
import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { DirectReportItem } from '@/api/types/direct-report.types'

export type DirectReportDaysFullResponse = {
  data: DirectReportItem[]
  totals: DirectReportItem | null
  page: number
  hasNextPage: boolean
}
type DirectReportParams = {
  channelUUID?: string
  from: string
  to: string
  ads?: string[]
  includeTotals?: boolean
}

export async function fetchDirectReportDaysFull(
  params: DirectReportParams
): Promise<DirectReportDaysFullResponse> {
  const queryParams = {
    channelUUID: params.channelUUID,
    from: params.from,
    to: params.to,
    includeTotals: params.includeTotals?.toString(),
    sortBy: 'date',
    sortOrder: 'asc'
  }

  const response = await client.direct.days.$post(
    {
      json: { ads: params.ads || [] },
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

export function useDirectDaysFull(params: DirectReportParams) {
  return useSuspenseQuery({
    queryKey: ['directReportFull', params],
    queryFn: () => fetchDirectReportDaysFull(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false
  })
}
