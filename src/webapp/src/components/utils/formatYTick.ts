// export function formatYTick(value: number): string {
//   if (value >= 1000) {
//     return `${(value / 1000).toString().padStart(2)} тыс.`
//   }
//
//   return value.toString()
// }

export function formatYTick(value: number, metricType?: string): string {
  const isNegative = value < 0
  const absValue = Math.abs(value)

  switch (metricType) {
    case 'quantity':
      if (absValue >= 1_000_000) {
        const formatted = (absValue / 1_000_000).toLocaleString('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        })
        return `${isNegative ? '-' : ''}${formatted} млн.`
      }
      if (absValue >= 1000) {
        const formatted = (absValue / 1000).toLocaleString('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        })
        return `${isNegative ? '-' : ''}${formatted} тыс.`
      }
      return value.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      })

    case 'cost':
      if (absValue >= 1_000_000) {
        const formatted = (absValue / 1_000_000).toLocaleString('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        })
        return `${isNegative ? '-' : ''}${formatted} млн.`
      }
      if (absValue >= 1000) {
        const formatted = (absValue / 1000).toLocaleString('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        })
        return `${isNegative ? '-' : ''}${formatted} тыс.`
      }
      return value.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      })

    case 'percentage':
      return `${value.toFixed(1)}%` // Например, 1.66 → "1.7%"

    default:
      if (absValue >= 1_000_000) {
        const formatted = (absValue / 1_000_000).toLocaleString('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        })
        return `${isNegative ? '-' : ''}${formatted} млн.`
      }
      if (absValue >= 1000) {
        const formatted = (absValue / 1000).toLocaleString('ru-RU', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        })
        return `${isNegative ? '-' : ''}${formatted} тыс.`
      }
      return value.toLocaleString('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      })
  }
}
