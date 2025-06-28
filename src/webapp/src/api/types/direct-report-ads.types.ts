export interface DirectReportAd {
  adID: string
  adTitle: string
}

export interface DirectReportCampaign {
  campaignID: string
  campaignName: string
  ads: DirectReportAd[]
}
