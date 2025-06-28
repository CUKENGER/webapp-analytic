import { client } from '@/api/client';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';

// Обновляем интерфейс для включения новых полей для пагинации
interface LinksInviteResponseWithPagination {
  data: any[];
  totals: any | null;
  page: number;
  hasNextPage: boolean;
}

export type LinksInviteResponse = InferResponseType<typeof client.links.invite.$get>

// Расширяем параметры для запроса, добавляя флаг includeTotals и поля для пагинации
type LinksInviteParams = InferRequestType<typeof client.links.invite.$get>['query'] & {
  includeTotals?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string // Добавляем sortBy
  sortOrder?: 'asc' | 'desc' // Добавляем sortOrder
}

async function fetchLinksInvite(
  params: LinksInviteParams
): Promise<LinksInviteResponseWithPagination> {
  // Создаем копию параметров, чтобы не мутировать исходный объект
  const queryParams = { ...params };

  const response = await client.links.invite.$get(
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
    throw new Error('Failed to fetch links invite data')
  }

  const jsonResponse = await response.json();
  return {
    data: jsonResponse.data || [],
    totals: jsonResponse.totals || null,
    page: jsonResponse.page || 1,
    hasNextPage: jsonResponse.hasNextPage || false
  };
}

export function useLinksInvite(params?: LinksInviteParams) {
  const baseParams = { ...params, limit: params?.limit || 10 };

  const getParams = (pageParam: number) => ({
    ...baseParams,
    page: pageParam,
  });

  return useSuspenseInfiniteQuery({
    queryKey: ['linksInvite', baseParams],
    queryFn: ({ pageParam = 1 }) => fetchLinksInvite(getParams(pageParam)),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    refetchOnWindowFocus: false
  });
}
