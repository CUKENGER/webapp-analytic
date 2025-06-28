
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import type { DirectReportItem } from '@/api/types/direct-report.types'
import type { InferRequestType, InferResponseType } from 'hono'

// Тип для допустимых полей сортировки
export type SortableField = FiltersType
// Обновляем тип ответа
interface DirectCampaignsResponseWithTotals {
  data: DirectReportItem[]
  totals: DirectReportItem | null
  page: number
  hasNextPage: boolean
}
export type DirectCampaignsResponse = InferResponseType<
  typeof client.bot.direct.campaigns.$get
>

// Расширяем параметры для сортировки
type DirectCampaignsParams = InferRequestType<
  typeof client.bot.direct.campaigns.$get
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
async function fetchDirectCampaigns({
  pageParam = 1,
  ...params
}: DirectCampaignsParams & {
  pageParam?: number
}): Promise<DirectCampaignsResponseWithTotals> {
  const queryParams = {
    botId: params.botId,
    from: params.from,
    to: params.to,
    includeTotals: params.includeTotals?.toString(),
    limit: params.limit?.toString(),
    page: pageParam.toString(),
    sortBy: params.sortBy || 'title',
    sortOrder: params.sortOrder || 'desc',
    ...(params.ads ? { ads: params.ads.join(',') } : {})
  }

  const response = await client.bot.direct.campaigns.$get(
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
export function useBotDirectCampaigns(params: DirectCampaignsParams) {
  return useSuspenseInfiniteQuery({
    queryKey: ['botDirectCampaigns', params],
    queryFn: ({ pageParam }) => fetchDirectCampaigns({ pageParam, ...params }),
    getNextPageParam: lastPage =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000
  })
}