import { CustomLayerProps } from '@nivo/line'
import { ScaleLinear, ScalePoint } from 'd3-scale'

interface CustomGridProps extends CustomLayerProps {
  yTickValues: number[] // Тики оси Y из useChartDimensions
}

const CustomGrid = ({
  xScale,
  yScale,
  innerWidth,
  innerHeight,
  yTickValues
}: CustomGridProps) => {
  if (!xScale) return null

  const xScaleTyped = xScale as ScalePoint<string> | ScaleLinear<number, number>
  const yScaleTyped = yScale as ScaleLinear<number, number>

  const xValues = xScaleTyped.domain()

  return (
    <g>
      {/* Вертикальные линии с чередованием */}
      {xValues.map((value, i) => {
        const x = xScaleTyped(value as any)
        if (typeof x !== 'number' || isNaN(x)) return null

        return (
          <line
            key={`x-${value}`}
            x1={x}
            x2={x}
            y1={0}
            y2={innerHeight}
            stroke="var(--tg-border-color)"
            strokeWidth={1}
            strokeDasharray={i % 2 === 0 ? '0' : '4'} // Чередование сплошная/пунктирная
            // strokeOpacity={0.4}
          />
        )
      })}

      {/* Горизонтальные линии (всегда сплошные) */}
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
            // strokeOpacity={0.4} // Можно уменьшить, если слишком ярко
          />
        )
      })}
    </g>
  )
}
export default CustomGrid
