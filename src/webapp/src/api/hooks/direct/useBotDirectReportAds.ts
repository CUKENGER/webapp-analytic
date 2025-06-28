
import { useSuspenseQuery } from '@tanstack/react-query'
import { client } from '@/api/client'
import { DirectReportCampaign } from '@/api/types/direct-report-ads.types'
// import type { DirectReportCampaign } from '../types/direct-report-ads.types'

interface DirectReportAdsParams {
  botId?: string
  from?: string // YYYY-MM-DD
  to?: string
}

export interface DirectReportAdsResponse {
  data: DirectReportCampaign[], from: string, to: string
}

async function fetchDirectReportAds(
  params: DirectReportAdsParams
): Promise<DirectReportAdsResponse> {
  const response = await client.bot.direct.ads.$get(
    {
      query: params
    },
    {
      headers: {
        'bypass-tunnel-reminder': 1
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch direct report ads')
  }

  const data = await response.json()

  return data
}

export function useBotDirectReportAds(params: DirectReportAdsParams) {
  return useSuspenseQuery({
    queryKey: ['botDirectReportAds', params],
    queryFn: () => fetchDirectReportAds(params),
    // enabled: !!params.channelUUID,
    refetchOnWindowFocus: false
  })
}
