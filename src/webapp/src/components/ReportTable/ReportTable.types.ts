export type FiltersType = {
  label: string
  value: FilterValueType
  width?: number
  color?: string
  minWidth?: number
  maxWidth?: number
  style?: object
  progressBar?: boolean
  metricType?: MetricType
  sortable?: boolean // Новое поле
}

export type FilterValueType =
  | 'cost'
  | 'impressions'
  | 'clicks'
  | 'redirected'
  | 'subscribed'
  | 'unsubscribed'
  | 'ctr'
  | 'cpc'
  | 'cland'
  | 'cpa'
  | 'cpdp'
  | 'pdp_cost'
  | 'unsub_per'
  | 'pdp_total'
  | 'cost_total'
  | 'date'
  | 'title'
  | 'url'
  | 'name'
  | 'firstSubscriberEpoch'
  | 'tgUserID'
  | 'tgUsername'
  | 'subscribedAtEpoch'
  | 'unsubscribedAtEpoch'
  | string

export type MetricType = 'date' | 'cost' | 'percentage' | 'quantity'

export type FilterRangeType = { from: string; to: string }
