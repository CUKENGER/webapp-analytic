
export interface TariffItemInfo {
	name: string
	featuresTitle: string
	features: string[]
	prices: { period: string; price: string }[]
	basementText: string | null
}

export const tariffs: TariffItemInfo[] = [
	{
		name: 'profi',
		featuresTitle: 'Все функции базового тарифа, плюс',
		features: [
			'Подключение своей Яндекс Метрики к сервису',
			"Подключение своего лендинга",
			"Выдача доступа к сервису другим пользователям"
		],
		prices: [
			{ period: "1 месяц", price: "2 990 ₽" },
			{ period: "3 месяца", price: "8 073 ₽ (-10%)" },
			{ period: "6 месяцев", price: "12 558 ₽ (-30%)" },
		],
		basementText: "Оставшиеся дни текущего тарифа будут пересчитаны в счёт нового тарифа."
	},
	{
		name: 'based',
		featuresTitle: 'В тариф включены',
		features: [
			"Интеграция сервиса с Яндекс Директ",
			"Автоматическое создание Яндекс Метрики с целями",
			"Передача подписок, как конверсии в Яндекс Метрику",
			"Готовый лендинг с аналитикой для продвижения",
			"Аналитика канала с рекламным отчетом",
		],
		prices: [
			{ period: "1 месяц", price: "1 490 ₽" },
			{ period: "3 месяца", price: "4 023 ₽ (-10%)" },
			{ period: "6 месяцев", price: "6 258 ₽ (-30%)" },
		],
		basementText: null
	}
]

export const tariffOrder = ["based", "profi"] as const
export type TariffType = (typeof tariffOrder)[number] | "trial"

// Расчёт даты окончания тарифа на основе периода
export const getEndDate = (period: string): string => {
	const now = new Date()
	let monthsToAdd = 0

	if (period.includes("1 месяц")) {
		monthsToAdd = 1
	} else if (period.includes("3 месяца")) {
		monthsToAdd = 3
	} else if (period.includes("6 месяцев")) {
		monthsToAdd = 6
	}

	now.setMonth(now.getMonth() + monthsToAdd)
	return now.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})
}