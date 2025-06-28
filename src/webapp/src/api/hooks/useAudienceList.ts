import { client } from '@/api/client'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import type { InferRequestType, InferResponseType } from 'hono'

export type AudienceListResponse = InferResponseType<typeof client.audience.$get>
type AudienceListParams = InferRequestType<typeof client.audience.$get>['query']

async function fetchAudienceList(
  params: AudienceListParams
): Promise<AudienceListResponse> {
  const response = await client.audience.$get(
    {
      query: params
    },
    {
      headers: {
        'bypass-tunnel-reminder': '1'
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch audience list')
  }
  const jsonResponse = await response.json();
  return {
    data: jsonResponse.data || [],
    totals: jsonResponse.totals || null,
    page: jsonResponse.page || 1,
    hasNextPage: jsonResponse.hasNextPage || false
  };
}

export function useAudienceList(params?: AudienceListParams) {
  const baseParams = { ...params, limit: params?.limit || 10 };

  return useSuspenseInfiniteQuery({
    queryKey: ['audienceList', baseParams],
    queryFn: ({ pageParam = 1 }) => fetchAudienceList({ ...baseParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 90000
  })
}
