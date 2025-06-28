import { MetricType } from '../ReportTable/ReportTable.types'
import formatDate from './formatDate'

export const NEGATIVE_DIRECTION_METRICS = [
  'cpc',
  'cpa',
  'pdp_cost',
  'unsub_per',
  'cost_total'
]

const formatNumberWithSpaces = (
  number: number,
  withDecimals: boolean = true
): string => {
  return number.toLocaleString('ru-RU', {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0
  })
}

export function formatMaxValue(
  values: number[],
  metricType: MetricType | undefined
): number {
  // Фильтруем NaN и undefined значения
  const validValues = values.filter(
    value => !isNaN(value) && value !== undefined
  )

  if (validValues.length === 0) {
    return 1 // Возвращаем 1 как минимальное значение для прогресс-бара
  }

  const maxValue = Math.max(...validValues)

  if (metricType === 'percentage') {
    return Math.min(maxValue, 100)
  }

  return maxValue || 1
}

export const formatValue = (
  value: string | number,
  metricType: MetricType | undefined
) => {
  const numValue = Number(value)
  const isNumeric = !Number.isNaN(numValue)

  if (!isNumeric) {
    return metricType === 'date' ? formatDate(value) : value // Для нечисловых значений
  }

  switch (metricType) {
    case 'cost':
      if (!isNumeric) {
        return ''
      }
      return `${formatNumberWithSpaces(numValue)} ₽` // 2 знака после запятой
    case 'percentage':
      if (!isNumeric) {
        return ''
      }
      return `${numValue.toFixed(2).replace('.', ',')}%` // Всегда 2 знака после запятой
    case 'date':
      return formatDate(value) // Даты без изменений
    case 'quantity':
      return isNumeric ? formatNumberWithSpaces(numValue, false) : value
    default:
      return isNumeric ? formatNumberWithSpaces(numValue) : value // 2 знака после запятой по умолчанию
  }
}
