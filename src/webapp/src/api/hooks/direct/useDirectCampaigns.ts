import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import type { DirectReportItem } from '@/api/types/direct-report.types'
import type { InferRequestType, InferResponseType } from 'hono'

// Тип для допустимых полей сортировки
export type SortableField = FiltersType

export interface DirectCampaignsResponse {
  data: DirectReportItem[]
  totals: DirectReportItem | null
  page: number
  hasNextPage: boolean
}

// Расширяем параметры для сортировки
type DirectCampaignsParams = InferRequestType<
  typeof client.direct.campaigns.$post
>['query'] & {
  includeTotals?: boolean
  limit?: number
  page?: number
  ads?: string[]
  sortBy?: SortableField
  sortOrder?: 'asc' | 'desc'
}

/**
 * Выполняет запрос к API для получения кампаний
 * @param params Параметры запроса
 * @returns Промис с данными кампаний
 */
export async function fetchDirectReportCampaigns({
  pageParam = 1,
  ...params
}: DirectCampaignsParams & {
  pageParam?: number
}): Promise<DirectCampaignsResponse> {
  const queryParams = {
    channelUUID: params.channelUUID,
    from: params.from,
    to: params.to,
    includeTotals: params.includeTotals?.toString(),
    limit: params.limit?.toString(),
    page: pageParam.toString(),
    sortBy: params.sortBy || 'title',
    sortOrder: params.sortOrder || 'asc'
  }

  const response = await client.direct.campaigns.$post(
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
    throw new Error('Failed to fetch direct campaigns')
  }

  const jsonResponse = await response.json()

  return {
    data: jsonResponse.data || [],
    totals: jsonResponse.totals || null,
    page: jsonResponse.page || 1,
    hasNextPage: jsonResponse.hasNextPage || false
  }
}

/**
 * Хук для получения данных кампаний с серверной пагинацией и сортировкой
 * @param params Параметры запроса
 * @returns Результат бесконечной загрузки
 */
export function useDirectCampaigns(params: DirectCampaignsParams) {
  return useSuspenseInfiniteQuery({
    queryKey: ['directCampaigns', params],
    queryFn: ({ pageParam }) =>
      fetchDirectReportCampaigns({ pageParam, ...params }),
    getNextPageParam: lastPage =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000,
    refetchOnMount: false
  })
}
