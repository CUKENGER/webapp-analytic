import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import type { InferResponseType } from 'hono'

export type DirectReportResponse = InferResponseType<
	typeof client.links.days.$get
>

type DirectReportParams = {
	channelUUID?: string
	from?: string
	to?: string
	includeTotals?: boolean
	limit?: number
	sortBy?: string // Поле для сортировки
	sortOrder?: 'asc' | 'desc' // Направление сортировки
}

async function fetchDirectReport(
	params: DirectReportParams & { page?: number }
): Promise<DirectReportResponse> {
	const queryParams = {
		channelUUID: params.channelUUID,
		from: params.from,
		to: params.to,
		includeTotals: params.includeTotals?.toString(),
		limit: params.limit?.toString(),
		sortBy: params.sortBy,
		sortOrder: params.sortOrder,
		...params
	}

	const response = await client.links.days.$get(
		{
			query: queryParams
		},
		{ headers: { 'bypass-tunnel-reminder': '1' } }
	)

	if (!response.ok) {
		throw new Error('Failed to fetch direct report')
	}

	return await response.json()
}

export function useLinkDirectDays(params: DirectReportParams) {
	return useSuspenseInfiniteQuery({
		queryKey: ['directReportLinks', params],
		queryFn: ({ pageParam = 1 }) =>
			fetchDirectReport({ ...params, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: lastPage =>
			lastPage.hasNextPage ? lastPage.page + 1 : undefined,
		refetchOnWindowFocus: false
	})
}