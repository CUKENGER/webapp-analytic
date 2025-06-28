
import { client } from '@/api/client'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

interface GetChannelIdParams {
	channel_id: string
}

async function fetchTgChannelId(
	params: GetChannelIdParams
): Promise<string> {
	const response = await client.projects[':id'].$get(
		{
			param: { id: params.channel_id },
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
	return data.tgChannelID
}

export function useGetTgChannelId(params: GetChannelIdParams) {
	return useQuery({
		queryKey: ['getTgChannelId', params],
		queryFn: () => fetchTgChannelId(params),
		enabled: !!params.channel_id,
		refetchOnWindowFocus: false,
	})
}
