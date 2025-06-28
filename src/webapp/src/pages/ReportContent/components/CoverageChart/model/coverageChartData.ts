export interface CoverageChartDataType {
  day: string
  er: number
  err: number
  [key: string]: string | number
}

interface GenerateChartDataParams {
  startDate: string
  daysCount: number
  erRange?: { min: number; max: number }
  errRange?: { min: number; max: number }
}

export function generateCoverageChartData({
  startDate,
  daysCount,
  erRange = { min: 20, max: 100 },
  errRange = { min: 20, max: 100 }
}: GenerateChartDataParams): CoverageChartDataType[] {
  const data: CoverageChartDataType[] = []

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

    const day = currentDate.toISOString().split('T')[0]

    const newEr = getRandomInt(erRange.min, errRange.max)
    const newErr = getRandomInt(erRange.min, errRange.max)
    // Защита от деления на ноль и округление до 1 знака
    const unsubscriptions_per =
      newEr > 0 ? Number(((newEr / newErr) * 100).toFixed(1)) : 0

    data.push({
      day,
      err: newErr,
      er: newEr
    })
  }

  return data
}

export const CoverageChartData = generateCoverageChartData({
  startDate: '2025-04-06',
  daysCount: 30,
  errRange: { min: 20, max: 100 },
  erRange: { min: 20, max: 100 }
})
