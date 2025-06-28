export interface LinksChartDataType {
  date: string
  subscriptions: number
  unsubscriptions: number
  unsubscriptions_per: number
  total_pdp: number
  [key: string]: string | number
}

interface GenerateChartDataParams {
  startDate: string
  daysCount: number
  subscriptionsRange?: { min: number; max: number }
  unsubscriptionsRange?: { min: number; max: number }
  totalPdpRange?: { min: number; max: number }
}

export function generateLinksChartData({
  startDate,
  daysCount,
  subscriptionsRange = { min: 100, max: 160 },
  unsubscriptionsRange = { min: 10, max: 20 },
  totalPdpRange = { min: 4200, max: 5200 }
}: GenerateChartDataParams): LinksChartDataType[] {
  const data: LinksChartDataType[] = []

  const start = new Date(startDate)
  if (isNaN(start.getTime())) {
    throw new Error('Invalid startDate format. Use YYYY-MM-DD')
  }

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  for (let i = 0; i < daysCount; i++) {
    const currentDate = new Date(start)
    currentDate.setDate(start.getDate() + i)

    const date = currentDate.toISOString().split('T')[0]

    const subscriptions = getRandomInt(
      subscriptionsRange.min,
      subscriptionsRange.max
    )
    const unsubscriptions = getRandomInt(
      unsubscriptionsRange.min,
      unsubscriptionsRange.max
    )
    // Защита от деления на ноль и округление до 1 знака
    const unsubscriptions_per =
      subscriptions > 0
        ? Number(((unsubscriptions / subscriptions) * 100).toFixed(1))
        : 0
    const total_pdp = getRandomInt(totalPdpRange.min, totalPdpRange.max)

    data.push({
      date,
      subscriptions,
      unsubscriptions,
      unsubscriptions_per,
      total_pdp
    })
  }

  return data
}

export const LinksChartData = generateLinksChartData({
  startDate: '2025-04-06',
  daysCount: 30,
  subscriptionsRange: { min: 100, max: 150 },
  unsubscriptionsRange: { min: 10, max: 20 },
  totalPdpRange: { min: 4200, max: 5100 }
})
