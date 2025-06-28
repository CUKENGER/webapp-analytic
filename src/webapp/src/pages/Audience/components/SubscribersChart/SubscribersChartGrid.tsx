// SubscribersChartGrid.tsx
import React from 'react'
import { BarCustomLayerProps } from '@nivo/bar' // Используем правильный тип из @nivo/bar
import { ScaleBand, ScaleLinear } from 'd3-scale'

interface CustomGridProps extends BarCustomLayerProps<[]> {
  yTickValues: number[]
  xTickValues: string[]
}

const SubscribersChartGrid: React.FC<CustomGridProps> = ({
  innerWidth,
  innerHeight,
  xScale,
  yScale,
  yTickValues,
  xTickValues
}) => {
  const xScaleTyped = xScale as ScaleBand<string>
  const yScaleTyped = yScale as ScaleLinear<number, number>

  return (
    <g>
      {/* Вертикальные линии с шагом 32px */}
      {xTickValues.map((day, i) => {
        const x = xScaleTyped(day)
        if (typeof x !== 'number' || isNaN(x)) return null

        return (
          <line
            key={`x-${day}`}
            x1={x + xScaleTyped.bandwidth() / 2} // Центрируем линию относительно столбца
            x2={x + xScaleTyped.bandwidth() / 2}
            y1={0}
            y2={innerHeight}
            stroke="var(--tg-border-color)"
            strokeWidth={1}
            strokeDasharray={i % 2 === 0 ? '0' : '4'} // Чередование сплошная/пунктирная
          />
        )
      })}

      {/* Горизонтальные линии с шагом 32px */}
      {yTickValues.map(value => {
        const y = yScaleTyped(value)
        if (typeof y !== 'number' || isNaN(y)) return null

        return (
          <line
            key={`y-${value}`}
            x1={0}
            x2={innerWidth}
            y1={y}
            y2={y}
            stroke="var(--tg-border-color)"
            strokeWidth={1}
          />
        )
      })}
    </g>
  )
}

export default SubscribersChartGrid
