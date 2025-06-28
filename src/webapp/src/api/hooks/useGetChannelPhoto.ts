import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/client'

interface GetChannelPhotoParams {
  channelUuid: string
  tgAdminID: string
}

async function getChannelPhoto(params: GetChannelPhotoParams) {
  const { channelUuid, tgAdminID } = params
  const response = await client.channelPhoto.$get({
    query: {
      channelUuid: channelUuid.toString(),
      tgAdminID: tgAdminID.toString()
    }
  })
  if (!response.ok) {
    throw new Error('Failed to get channel photo')
  }

  return response.json()
}

export function useGetChannelPhoto({
  channelUuid,
  tgAdminID
}: GetChannelPhotoParams) {
  return useQuery({
    queryKey: ['channelPhoto', channelUuid, tgAdminID],
    queryFn: () => getChannelPhoto({ channelUuid, tgAdminID }),
    refetchOnWindowFocus: false,
    enabled: !!channelUuid || !!tgAdminID,
    retry: false,
    // staleTime: Infinity,
    // cacheTime: 24 * 60 * 60 * 1000, // 24 часа
    staleTime: 24 * 60 * 60 * 1000, // Данные считаются свежими бесконечно
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false
  })
}
