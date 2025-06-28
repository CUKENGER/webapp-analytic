// src/hooks/useCampaignFilter.ts
import { useMemo } from 'react'
import { DirectReportCampaign } from '@/api/types/direct-report-ads.types'

export const useCampaignFilter = (
  campaigns: DirectReportCampaign[] = [],
  search: string
) => {
  const allItems = useMemo(
    () =>
      campaigns.flatMap(campaign =>
        campaign.ads.map(ad => `${campaign.campaignID}:${ad.adID}`)
      ),
    [campaigns]
  )

  const filteredCampaigns = useMemo(() => {
    if (!campaigns.length) return []
    return campaigns
      .map(campaign => {
        const isCampaignMatch = campaign.campaignName
          .toLowerCase()
          .includes(search.toLowerCase())
        const filteredAds = isCampaignMatch
          ? campaign.ads
          : campaign.ads.filter(ad =>
              ad.adTitle.toLowerCase().includes(search.toLowerCase())
            )
        return { ...campaign, ads: filteredAds }
      })
      .filter(campaign => campaign.ads.length > 0)
  }, [campaigns, search])

  return { allItems, filteredCampaigns }
}
