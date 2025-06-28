import { MouseEvent } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { formatYTick } from '@/components/utils/formatYTick'
import { CustomBar } from './CustomBar'
import { CustomChangesLayer } from './CustomChangesLayer'
import SubscribersChartGrid from './SubscribersChartGrid'
import { SubscribersChartTheme } from './SubscribersChartTheme'
import { AudienceChartData } from './chartData'
import { AudienceChartColors, AudienceChartLayers } from '../../AudiencePage'

interface NivoBarProps {
  validData: AudienceChartData[]
  selectedDay: string | null
  handleHighlightClick: (
    day: string,
    x: number,
    event: MouseEvent<SVGRectElement>
  ) => void
  xTickValues: string[]
  yTickValues: number[]
  marginLeft: number
  MARGIN_TOP: number
  MARGIN_BOTTOM: number
  minYValue: number
  maxYValue: number
	colors: AudienceChartColors
  visibleLayers: AudienceChartLayers
}

export const NivoBar = ({
  validData,
  selectedDay,
  handleHighlightClick,
  xTickValues,
  yTickValues,
  marginLeft,
  MARGIN_TOP,
  MARGIN_BOTTOM,
  minYValue,
  maxYValue,
  colors,
  visibleLayers
}: NivoBarProps) => {
  const customGridLayer = (props: any) => (
    <SubscribersChartGrid
      {...props}
      yTickValues={yTickValues}
      xTickValues={xTickValues}
    />
  )

  const filteredTickValues = validData
    .map(d => d.day)
    .filter((_, i) => i % 2 === 0)

  const HighlightLayer = (props: any) => {
    const { bars, innerHeight } = props

    return bars.map((bar: any) => {
      const day = bar.data.data.day
      const centerX = Math.round(bar.x + bar.width / 2)
      const highlightWidth = 32 // Увеличенная область для удобства на мобильных
      const highlightX = centerX - highlightWidth / 2

      const isSelected = selectedDay === day

      return (
        <rect
          key={day}
          x={highlightX}
          y={0}
          width={highlightWidth}
          height={innerHeight}
          fill={isSelected ? 'rgba(144, 158, 180, 0.08)' : 'transparent'}
          onMouseDown={e => e.stopPropagation()}
          onClick={event => {
            event.stopPropagation() // Останавливаем всплытие для скролла
            handleHighlightClick(day, centerX, event)
          }}
          style={{ cursor: 'pointer' }}
        />
      )
    })
  }

  return (
    <ResponsiveBar
      data={validData}
      keys={['total']}
      indexBy="day"
      groupMode="stacked"
      barComponent={props => (
        <CustomBar {...props} visibleLayers={visibleLayers} selectedDays={selectedDay ? [selectedDay] : []} />
      )}
      margin={{
        top: MARGIN_TOP,
        right: 0,
        bottom: MARGIN_BOTTOM,
        left: marginLeft
      }}
      indexScale={{ type: 'band', round: true }}
      padding={0}
      colors={['#0080FF']}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        legendPosition: 'middle',
        legendOffset: 40,
        format: value => {
          const [year, month, day] = value.split('-')
          return `${day}.${month}.${year.slice(-2)}` // Берем последние 2 цифры года
        },
        truncateTickAt: 0,
        tickValues: filteredTickValues
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: 'middle',
        legendOffset: -35,
        truncateTickAt: 0,
        format: formatYTick,
        tickValues: yTickValues
      }}
      gridYValues={yTickValues}
      gridXValues={validData.map(d => d.day)}
      enableLabel={true}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      layers={[
        customGridLayer,
        'bars',
        props => (
          <CustomChangesLayer
            {...props}
            selectedDays={selectedDay ? [selectedDay] : []}
            colors={colors}
            visibleLayers={visibleLayers}
          />
        ),
        HighlightLayer,
        'axes',
        'legends'
      ]}
      theme={SubscribersChartTheme}
      minValue={minYValue}
      maxValue={maxYValue}
      isInteractive={true}
      role="application"
      ariaLabel="График подписчиков по дням"
      barAriaLabel={e => `${e.id}: ${e.formattedValue} на ${e.indexValue}`}
    />
  )
}
