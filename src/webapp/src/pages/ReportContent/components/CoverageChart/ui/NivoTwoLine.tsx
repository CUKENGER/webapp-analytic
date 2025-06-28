import { MouseEvent } from 'react'
import { Point, ResponsiveLine, Serie } from '@nivo/line'
import CustomGrid from '@/components/ReportChart/CustomGrid'
import { chartTheme } from '@/components/ReportChart/ThemeReportChart'
import formatDate from '@/components/utils/formatDate'
import { formatYTick } from '@/components/utils/formatYTick'
import { CoverageChartColors } from '@/pages/ReportContent/ReportContent'

interface PropTypes {
  chartData: any[]
  MARGIN_TOP: number
  MARGIN_BOTTOM: number
  marginLeft: number
  yTickValues: number[]
  xTickValues: string[]
  selectedDay: string | null
  handleHighlightClick: (
    day: string,
    x: number,
    event: MouseEvent<SVGRectElement>
  ) => void
  colors: CoverageChartColors
}

export const NivoTwoLine = ({
  chartData,
  MARGIN_TOP,
  marginLeft,
  MARGIN_BOTTOM,
  yTickValues,
  xTickValues,
  selectedDay,
  handleHighlightClick,
  colors
}: PropTypes) => {
  const customGridLayer = (props: any) => (
    <CustomGrid {...props} yTickValues={yTickValues} />
  )

  // Highlight Layer
  const HighlightLayer = (props: any) => {
    const { data, xScale, innerHeight, yScale } = props
    // Собираем все точки из всех серий
    const allPoints = data.flatMap((serie: Serie) => serie.data)
    // Типизируем uniqueDays как string[]
    const uniqueDays: string[] = Array.from(
      new Set(allPoints.map((p: Point) => p.x))
    )

    return uniqueDays.map((day: string, index: number) => {
      const centerX = xScale(day)
      const highlightWidth = 32
      const highlightX = centerX - highlightWidth / 2
      const isSelected = selectedDay === day

      // Находим точки для текущего дня
      const pointsForDay = data
        .filter((serie: any) => serie.data.some((p: any) => p.x === day))
        .map((serie: any) => ({
          id: serie.id,
          y: serie.data.find((p: any) => p.x === day).y
        }))

      return (
        <g key={`${day}-${index}`}>
          <rect
            x={highlightX}
            y={0}
            width={highlightWidth}
            height={innerHeight}
            fill={isSelected ? 'rgba(144, 158, 180, 0.08)' : 'transparent'}
            onMouseDown={e => e.stopPropagation()}
            onClick={event => {
              event.stopPropagation()
              handleHighlightClick(day, centerX, event)
            }}
            style={{ cursor: 'pointer' }}
          />
          {isSelected &&
            pointsForDay.map((point: any) => (
              <circle
                key={`${day}-${point.id}`}
                cx={centerX}
                cy={yScale(point.y)}
                r={4}
                fill="var(--tg-bg-color)"
                stroke={point.id === 'er' ? colors.er : colors.err}
                strokeWidth={2}
              />
            ))}
        </g>
      )
    })
  }

  return (
    <ResponsiveLine
      data={chartData}
      margin={{
        top: MARGIN_TOP,
        right: 4,
        bottom: MARGIN_BOTTOM,
        left: marginLeft
      }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: yTickValues[0],
        max: yTickValues[yTickValues.length - 1],
        stacked: false,
        reverse: false
      }}
      curve="linear"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        legend: '',
        legendOffset: 60,
        legendPosition: 'middle',
        format: formatDate,
        tickValues: xTickValues
      }}
      axisLeft={{
        tickSize: 12,
        tickPadding: 8,
        tickRotation: 0,
        legend: '',
        legendOffset: 16,
        legendPosition: 'middle',
				format: (value: number) => `${value}%`,
        tickValues: yTickValues
      }}
      colors={(serie: any) => (serie.id === 'er' ? colors.er : colors.err)}
      pointSize={8}
      pointBorderWidth={2}
      pointColor={{ from: 'color', modifiers: [] }}
      pointSymbol={({ size }) => (
        <circle
          r={size / 2}
          stroke={'var(--tg-button-color)'}
          strokeWidth={2}
        />
      )}
      enableArea={false}
      areaBaselineValue={yTickValues[0]}
      defs={[]}
      fill={[]}
      pointLabelYOffset={-12}
      enablePointLabel={false}
      enableGridY={false}
      enableGridX={false}
      enableCrosshair={false}
      enablePoints={false}
      layers={[
        customGridLayer,
        'markers',
        'axes',
        'lines',
        HighlightLayer,
        'crosshair',
        'slices',
        'mesh',
        'legends'
      ]}
      theme={chartTheme}
      isInteractive={true}
      role="application"
    />
  )
}
