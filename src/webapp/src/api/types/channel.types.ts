
export interface IChannel {
	channel: ChannelInfo
	traffic_sources: ChannelTrafficSources
	settings: ChannelSettings
}

interface ChannelInfo {
	id: number
	type: ChannelType
	name: string
	subscription: ChannelSubscription | null
}

interface ChannelSubscription {
	active: boolean
	days_remaining: number
	end_date: string
	id: string
	is_paid: boolean
	name: ChannelTariff
	name_display: string
}

interface ChannelSettings {
	access_grant_enabled: boolean
	approve_requests_with_bot: boolean
	daily_report: boolean
	join_request_as_goal: boolean
	smart_button_exists: boolean
	welcome_bot_exists: boolean
}

interface ChannelTrafficSources {
	landing_url: string
	yandex_direct: ChannelYandexDirect
}

interface ChannelYandexDirect {
	email: string
	metric_id: string
}

type ChannelTariff = 'trial' | 'based' | 'profi' 

type ChannelType = 'private' | 'public'

