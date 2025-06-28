

export type ApiProjectType = 'channel' | 'group' | 'bot'

export interface ApiProjectSubscription {
  id: string
  name: string
  is_paid: boolean
  name_display: string
  start_date: string
  end_date: string
  active: boolean
  days_remaining: number
}

export interface ApiProject {
  id: string
  name: string
  type: ApiProjectType
  subscription: ApiProjectSubscription | null
  created_at: string
  updated_at: string
}

export interface ApiProjectsResponse {
  data: ApiProject[]
  meta: {
    total: number
    page: number
    per_page: number
  }
}

export interface Project {
  tgTitle: string
  paidUntilEpoch: string
  isActive: boolean
  tariff: string
  tgChannelID: string
  type: 'channel' | 'bot'
  id: string
}

export interface ProjectFull {
  id: string
  tgTitle: string
  paidUntilEpoch: string
  isActive: boolean
  tariff: TariffType
  yaCounterID: string
  landingFolderName: string
  yaLoginInfo: string
  tgChannelID: string
}