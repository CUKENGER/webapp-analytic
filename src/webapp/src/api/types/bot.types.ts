

export interface IBot {
	type: string;
	id: string
	name: string
	tariff: string;
	tariff_display: string;
	end_date: string
	landing: null | string
	direct: null | string
	metrica: null | string
	type_bot: string;
	is_active: boolean
}