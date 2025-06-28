import { memo, useMemo } from 'react'
import {
  formatValue,
  NEGATIVE_DIRECTION_METRICS
} from '@/components/utils/formatValue'
import { getGradientColor } from '@/components/utils/gradientColorUtil'
import { FilterValueType, MetricType } from './ReportTable.types'

export const ProgressBarValue = memo(
  ({
    value,
    maxValue,
    metricValue,
    metricType
  }: {
    value: number
    maxValue: number
    metricValue: FilterValueType
    metricType: MetricType | undefined
  }) => {
    const direction = NEGATIVE_DIRECTION_METRICS.includes(metricValue) ? -1 : 1

    const isCostTotal = metricValue === 'cost_total'
    const absValue = isCostTotal ? Math.abs(value) : value
    const percentage =
      maxValue === 0 ? 0 : Math.min((absValue / maxValue) * 100, 100)

    const color = useMemo(
      () => getGradientColor(value, maxValue, direction),
      [value, maxValue, direction]
    )

    return (
      <div className="flex items-center gap-2 w-full">
        <div className="relative h-2 min-w-[80px] max-w-[60%]">
          <div
            className="absolute inset-0 h-2 bg-tg-secondary"
            style={{ borderRadius: '2px' }}
          />
          <div
            className="absolute inset-0 h-2"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
              borderRadius: '2px'
            }}
          />
        </div>
        <div className="flex-1 text-right whitespace-nowrap overflow-hidden text-ellipsis">
          {formatValue(value, metricType)}
        </div>
      </div>
    )
  }
)
