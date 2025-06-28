
import { useQuery } from '@tanstack/react-query'
import { apiAxios } from '../axiosClient'
import { API_ROUTES } from '../API_ROUTES'
import { IChannel } from '../types/channel.types'

interface GetChannelParams {
	user_id: string
	channel_id: string
}

interface GetApiChannelResponse {
	data: IChannel
}

async function fetchChannel(
	params: GetChannelParams
): Promise<IChannel> {
	const response = await apiAxios.get<GetApiChannelResponse>(API_ROUTES.GET_CHANNEL,
		{
			params
		}
	)
	console.log('response', response)
	return response.data.data
}

export function useGetApiChannel(params: GetChannelParams) {
	return useQuery({
		queryKey: ['getChannel', params],
		queryFn: () => fetchChannel(params),
		enabled: !!params.user_id && !!params.channel_id && params.channel_id !== '',
		refetchOnWindowFocus: false,
	})
}
