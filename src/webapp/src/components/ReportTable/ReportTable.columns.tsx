import { createColumnHelper } from '@tanstack/react-table'
import {
  FiltersType,
  FilterValueType
} from '@/components/ReportTable/ReportTable.types'
import { formatMaxValue, formatValue } from '../utils/formatValue'
import { ProgressBarValue } from './ProgressBarValue'
import type { DirectReportItem } from '@/api/types/direct-report.types'

const quantityColumn = (
  label: string,
  value: FilterValueType,
  width = 90,
  minWidth?: number,
  maxWidth?: number
): FiltersType => ({
  label,
  value,
  width,
  minWidth,
  maxWidth,
  metricType: 'quantity',
  sortable: true
})

const costColumn = (
  label: string,
  value: FilterValueType,
  width = 90,
  progressBar = false,
  minWidth?: number,
  maxWidth?: number
): FiltersType => ({
  label,
  value,
  width,
  minWidth,
  maxWidth,
  metricType: 'cost',
  progressBar,
  sortable: true
})

const percentageColumn = (
  label: string,
  value: FilterValueType,
  width = 180,
  progressBar = true,
  minWidth?: number,
  maxWidth?: number
): FiltersType => ({
  label,
  value,
  width,
  metricType: 'percentage',
  progressBar,
  minWidth,
  maxWidth,
  sortable: true
})

export const columnHeadersDays: FiltersType[] = [
  {
    label: 'Дата',
    value: 'date',
    width: 90,
    minWidth: 80,
    maxWidth: 110,
    metricType: 'date',
    sortable: true
  },
  costColumn('Расход, ₽', 'cost', 110, false, 100, 150),
  quantityColumn('Показы', 'impressions', 100, 80, 120),
  percentageColumn('CTR %', 'ctr', 170),
  quantityColumn('Клики', 'clicks', 90, 65, 120),
  costColumn('CPC', 'cpc', 180, true, 160, 200),
  percentageColumn('C% лендинга', 'cland'),
  quantityColumn('Переходов в канал', 'redirected', 160, 180, 170),
  costColumn('CPA посетителя', 'cpa', 180, true, 160, 200),
  percentageColumn('C% в ПДП', 'cpdp'),
  quantityColumn('ПДП', 'subscribed', 90, 70, 120),
  costColumn('Стоимость ПДП, ₽', 'pdp_cost', 180, true, 160, 200),
  quantityColumn('Отписки', 'unsubscribed', 90, 70, 120),
  percentageColumn('Отписки, %', 'unsub_per'),
  quantityColumn('Итого ПДП', 'pdp_total', 90, 70, 120),
  costColumn('Итого ПДП, ₽', 'cost_total', 200, true, 185, 220)
]

export const columnHeadersBotDays: FiltersType[] = [
  {
    label: 'Дата',
    value: 'date',
    width: 70,
    minWidth: 60,
    maxWidth: 150,
    metricType: 'date',
    sortable: true
  },
  costColumn('Расход, ₽', 'cost', 110, false, 100, 150),
  quantityColumn('Показы', 'impressions', 100, 80, 120),
  percentageColumn('CTR %', 'ctr'),
  quantityColumn('Клики', 'clicks', 90, 65, 120),
  costColumn('CPC', 'cpc', 180, true, 160, 200),
  percentageColumn('C% лендинга', 'cland'),
  quantityColumn('Переходов в бота', 'redirected', 160, 180, 170),
  costColumn('CPA посетителя', 'cpa', 180, true, 160, 200),
  percentageColumn('C% в ПДП', 'cpdp'),
  quantityColumn('ПДП', 'subscribed', 90, 70, 120),
  costColumn('Стоимость ПДП, ₽', 'pdp_cost', 180, true, 160, 200)
]

export const columnHeadersCampaigns: FiltersType[] = [
  {
    label: 'Кампания',
    value: 'title',
    width: 350,
    minWidth: 200,
    maxWidth: 500,
    sortable: true
  },
  ...columnHeadersDays.slice(1)
]

export const columnHeadersBotCampaigns: FiltersType[] = [
  {
    label: 'Кампания',
    value: 'title',
    width: 350,
    minWidth: 200,
    maxWidth: 500,
    sortable: true
  },
  ...columnHeadersBotDays.slice(1)
]

export const columnHeadersLinks: FiltersType[] = [
  {
    label: 'Ссылка',
    value: 'url',
    width: 200,
    minWidth: 150,
    maxWidth: 250,
    sortable: true
  },
  {
    label: 'Наименование',
    value: 'name',
    width: 200,
    minWidth: 100,
    maxWidth: 300,
    style: { textAlign: 'left' },
    sortable: true
  },
  {
    label: 'Первый ПДП',
    value: 'firstSubscriberEpoch',
    width: 130,
    minWidth: 100,
    maxWidth: 200,
    metricType: 'date',
    sortable: true
  },
  quantityColumn('Подписок', 'subscribed', 130, 100, 200),
  quantityColumn('Отписок', 'unsubscribed', 130, 100, 200),
  percentageColumn('Отписок, %', 'unsub_per'),
  quantityColumn('Итого ПДП', 'pdp_total', 130, 100, 200),
  costColumn('Расход', 'cost', 130, false, 100, 200),
  costColumn('ПДП, ₽', 'pdp_cost', 130, false, 100, 200),
  costColumn('Итого ПДП, ₽', 'cost_total', 130, false, 100, 200)
]

export const columnHeadersLinksDays: FiltersType[] = [
  {
    label: 'Дата',
    value: 'date',
    width: 70,
    minWidth: 60,
    maxWidth: 150,
    metricType: 'date',
    sortable: true
  },
  quantityColumn('Подписок', 'subscribed', 130, 100, 200),
  percentageColumn('Отписок, %', 'unsub_per'),
  quantityColumn('Отписок', 'unsubscribed', 130, 100, 200),
  quantityColumn('Итого ПДП', 'pdp_total', 130, 100, 200)
]

export const columnHeadersAudience: FiltersType[] = [
  {
    label: 'Источник',
    value: 'provider',
    width: 250,
    minWidth: 230,
    maxWidth: 250,
    sortable: true
  },
  quantityColumn('ID', 'tgUserID', 100, 110, 150),
  {
    label: 'Юзернэйм',
    value: 'tgUsername',
    width: 100,
    minWidth: 110,
    maxWidth: 150,
    sortable: true
  },
  {
    label: 'Подписка',
    value: 'subscribedAtEpoch',
    width: 100,
    minWidth: 60,
    maxWidth: 90,
    metricType: 'date',
    sortable: true
  },
  {
    label: 'Отписка',
    value: 'unsubscribedAtEpoch',
    width: 100,
    minWidth: 40,
    maxWidth: 90,
    metricType: 'date',
    sortable: true
  }
]

export const defaultColumnsDays = [
  'cost',
  'pdp',
  'subscribed',
  'pdp_cost',
  'unsub_per',
  'pdp_total',
  'cost_total'
]

export const defaultColumnsBotDays = [
  'cost',
  'pdp',
  'subscribed',
  'pdp_cost',
  'unsub_per',
  'pdp_total',
  'cost_total'
]

const columnHelper = createColumnHelper<DirectReportItem>()

export function reportTableColumns(
  dataProvider: any[],
  columnHeaders: FiltersType[]
) {
  const maxValues = columnHeaders.reduce(
    (acc, filter) => {
      const values = dataProvider
        .filter(row => row.id !== 'ellipsis')
        .map(row => {
          const value = row[filter.value]
          return typeof value === 'string' ? parseFloat(value) : Number(value)
        })
        .filter(value => !isNaN(value)) // Фильтруем NaN значения
      acc[filter.value] = formatMaxValue(values, filter.metricType)
      return acc
    },
    {} as Record<FilterValueType, number>
  )

  return columnHeaders.map(filter => {
    const column = columnHelper.accessor(
      filter.value as keyof DirectReportItem,
      {
        id: filter.value,
        header: filter.label,
        size: filter.width,
        minSize: filter.minWidth ?? Math.max(filter.width - 20, 50),
        maxSize: filter.maxWidth ?? filter.width + 50,
        enableSorting: filter.sortable ?? true,
        meta: { metricType: filter.metricType, style: filter.style },
        cell: info => {
          const value = info.getValue() as number | string
          const row = info.row.original
          const isTotal = row['type'] === 'total'

          if (row.id && row?.id === 'ellipsis') {
            return '...'
          }

          if (isTotal) {
            return formatValue(value, filter.metricType)
          }

          const numericValue =
            typeof value === 'string' ? parseFloat(value) : Number(value)

          return !filter.progressBar ? (
            formatValue(value, filter.metricType)
          ) : (
            <ProgressBarValue
              value={isNaN(numericValue) ? 0 : numericValue}
              maxValue={maxValues[filter.value]}
              metricValue={filter.value}
              metricType={filter.metricType}
            />
          )
        }
      }
    )

    return column
  })
}
