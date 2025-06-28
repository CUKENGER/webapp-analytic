import { useSuspenseQuery } from '@tanstack/react-query'
import { client as defaultClient } from '@/api/client'
import { DirectReportCampaign } from '@/api/types/direct-report-ads.types'

interface DirectReportAdsParams {
  channelUUID?: string
  from?: string // YYYY-MM-DD
  to?: string
}

export interface DirectReportAdsResponse {
  data: DirectReportCampaign[]
  from: string
  to: string
}

export const fetchDirectReportAds = async ({
  params,
  client = defaultClient
}: {
  params: DirectReportAdsParams
  client?: typeof defaultClient
}): Promise<DirectReportAdsResponse> => {
  const response = await client.direct.ads.$get(
    {
      query: params
    },
    {
      headers: { 'bypass-tunnel-reminder': 1 }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch direct report ads')
  }

  const data = response.json()
  return data
}

export const useDirectReportAds = (
  params: DirectReportAdsParams,
  client = defaultClient
) => {
  return useSuspenseQuery({
    queryKey: ['directReportAds', params],
    queryFn: () => fetchDirectReportAds({params, client}),
		refetchOnMount: false,
		refetchOnWindowFocus: false
  })
}
