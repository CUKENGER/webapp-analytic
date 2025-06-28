import { MouseEvent } from 'react';
import { ResponsiveLine } from '@nivo/line';
import CustomGrid from '@/components/ReportChart/CustomGrid';
import { chartTheme } from '@/components/ReportChart/ThemeReportChart';
import formatDate from '@/components/utils/formatDate';
import { formatYTick } from '@/components/utils/formatYTick';


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
  metricType?: string
}

export const NivoLine = ({
  chartData,
  MARGIN_TOP,
  marginLeft,
  MARGIN_BOTTOM,
  yTickValues,
  xTickValues,
  selectedDay,
  handleHighlightClick,
  metricType
}: PropTypes) => {
  const customGridLayer = (props: any) => {
    return <CustomGrid {...props} yTickValues={yTickValues} />
  }

  const HighlightLayer = (props: any) => {
    const { data, xScale, innerHeight, yScale } = props
    const points = data[0]?.data || []
    return points.map((point: any, index: number) => {
      const day = point.x
      const centerX = xScale(day)
      const highlightWidth = 32
      const highlightX = centerX - highlightWidth / 2
      const isSelected = selectedDay === day

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
          {isSelected && (
            <circle
              cx={centerX}
              cy={yScale(point.y)}
              r={4}
              fill="var(--tg-bg-color)"
              stroke="var(--tg-button-color)"
              strokeWidth={2}
            />
          )}
        </g>
      )
    })
  }

  const CustomAreaLayer = (props: any) => {
    const { data, xScale, yScale, innerHeight } = props
    const points = data[0]?.data || []
    if (!points.length) return null

    const baselineY = yScale(yTickValues[0])

    const areaPath = `
      M ${xScale(points[0].x)},${baselineY}
      ${points.map((p: any) => `L ${xScale(p.x)},${yScale(p.y)}`).join(' ')}
      L ${xScale(points[points.length - 1].x)},${baselineY}
      Z
    `

    return (
      <g>
        <defs>
          <linearGradient
            id="line-gradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={innerHeight}
          >
            <stop offset="0%" stopColor="#0080FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0080FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill="url(#line-gradient)"
          shapeRendering="geometricPrecision"
        />
      </g>
    )
  }

  const CustomLineLayer = (props: any) => {
    const { data, xScale, yScale } = props
    const points = data[0]?.data || []
    if (!points.length) return null

    const linePath = points
      .map((p: any, i: number) => {
        const x = xScale(p.x)
        const y = yScale(p.y)
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`
      })
      .join(' ')

    return (
      <path
        d={linePath}
        fill="none"
        stroke="var(--tg-button-color)"
        strokeWidth={2}
        shapeRendering="auto"
      />
    )
  }

  return (
    <ResponsiveLine
      data={chartData}
      margin={{
        top: MARGIN_TOP,
        right: 30,
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
        format: (value: number) => formatYTick(value, metricType),
        tickValues: yTickValues
      }}
      colors={() => 'var(--tg-button-color)'}
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
      enableArea={true}
      areaBaselineValue={yTickValues[0]}
      pointLabelYOffset={-12}
      enablePointLabel={false}
      enableGridY={false}
      enableGridX={false}
      enableCrosshair={false}
      enablePoints={true}
      layers={[
        customGridLayer,
        CustomAreaLayer,
        CustomLineLayer,
        'markers',
        'axes',
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