import { useInfiniteQuery, useQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import type { InferResponseType } from 'hono'

export type DirectReportResponse = InferResponseType<
  typeof client.bot.direct.days.$get
>

type DirectReportParams = {
  botId?: string
  from?: string
  to?: string
  ads?: string[]
  includeTotals?: boolean
  limit?: number
  sortBy?: string // Поле для сортировки
  sortOrder?: 'asc' | 'desc' // Направление сортировки
}

async function fetchDirectReport(
  params: DirectReportParams & { page?: number }
): Promise<DirectReportResponse> {
  const queryParams = {
    ...params,
    ads: params.ads?.join(','),
    includeTotals: params.includeTotals?.toString(),
    limit: params.limit?.toString(),
    sortBy: params.sortBy || 'desc', // Передаём поле сортировки
    sortOrder: params.sortOrder || 'date' // Передаём направление сортировки
  }

  const response = await client.bot.direct.days.$get(
    { query: queryParams },
    { headers: { 'bypass-tunnel-reminder': '1' } }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch direct report')
  }

  return await response.json()
}

export function useBotDirectDays(params: DirectReportParams) {
  return useInfiniteQuery({
    queryKey: ['botDirectReport', params],
    queryFn: ({ pageParam = 1 }) =>
      fetchDirectReport({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    refetchOnWindowFocus: false,
    enabled: !!params.botId
  })
}