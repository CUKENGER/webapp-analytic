import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { DirectReportItem } from '@/api/types/direct-report.types'

export type DirectReportDaysResponse = {
  data: DirectReportItem[]
  hasNextPage: boolean
  page: number
  totals: DirectReportItem | null
}
type DirectReportParams = {
  channelUUID?: string
  from?: string
  to?: string
  ads?: string[]
  includeTotals?: boolean
  limit?: number
  sortBy?: string // Поле для сортировки
  sortOrder?: 'asc' | 'desc' // Направление сортировки
}

export async function fetchDirectReportDays(
  params: DirectReportParams & { page?: number }
): Promise<DirectReportDaysResponse> {
  const queryParams = {
    channelUUID: params.channelUUID,
    from: params.from,
    to: params.to,
    includeTotals: params.includeTotals?.toString(),
    limit: params.limit?.toString(),
    sortBy: params.sortBy || 'date',
    sortOrder: params.sortOrder || 'desc'
  }

  const response = await client.direct.days.$post(
    {
      json: { ads: params.ads || [] },
      query: queryParams
    },
    { headers: { 'bypass-tunnel-reminder': '1' } }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch direct report')
  }

  return await response.json()
}

export function useDirectDays(params: DirectReportParams) {
  return useSuspenseInfiniteQuery({
    queryKey: ['directReport', params],
    queryFn: ({ pageParam = 1 }) =>
      fetchDirectReportDays({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })
}
