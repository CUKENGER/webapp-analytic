


import { client } from '@/api/client'
import { useQuery } from '@tanstack/react-query'

interface GetBotParams {
	id: string
}

async function fetchBot(
	params: GetBotParams
) {
	const response = await client.projects.bots[':id'].$get(
		{
			param: { id: params.id },
		},
		{
			headers: {
				'bypass-tunnel-reminder': 1
			}
		}
	)

	if (!response.ok) {
		throw new Error('Failed to fetch project')
	}

	const data = await response.json()

	return data
}

export function useGetBot(params: GetBotParams) {
	return useQuery({
		queryKey: ['getBot', params],
		queryFn: () => fetchBot(params),
		enabled: !!params.id,
		refetchOnWindowFocus: false
	})
}
