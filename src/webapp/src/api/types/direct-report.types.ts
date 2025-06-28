export interface DirectReportParams {
  channelUUID?: string
  from?: string
  to?: string
  ads?: string[]
}

export interface DirectReportItem {
  date: string
  campaignID: string
  campaignName: string
  adID: string
  adTitle: string
  cost: number
  impressions: number
  clicks: number
  redirected: number
  subscribed: number
  unsubscribed: number
  hidden: boolean
  id?: string
  type?: 'campaign' | 'ad' | 'total' | 'ellipsis' | string
  title?: string
  ctr?: number
  cpc?: number
  cland?: number
  cpa?: number
  cpdp?: number
  pdp_cost?: number
  unsub_per?: number
  pdp_total?: number
  cost_total?: number
}

export interface DirectReportResponse {
  data: DirectReportItem[]
}
