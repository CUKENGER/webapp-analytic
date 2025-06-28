import { RefObject, useMemo, useRef } from 'react'
import { Serie } from '@nivo/line'
import { useChartScroll } from '@/components/NewReportChart/model/useChartScroll'
import { useReportTooltipPosition } from '@/components/NewReportChart/model/useReportTooltipPosition'
import { CoverageChartColors, CoverageChartLayers } from '../../ReportContent'
import { useCoverageChartDimensions } from './model/useCoverageChartDimensions'
import { useCoverageTooltipPosition } from './model/useCoverageTooltipPosition'
import { CoverageChartContainer } from './ui/CoverageChartContainer'
import { NivoTwoLine } from './ui/NivoTwoLine'

interface PropTypes {
  data: any[] // { day: string, er: number, err: number }[]
  relativeContainerRef: RefObject<HTMLDivElement>
  colors: CoverageChartColors
  visibleLayers: CoverageChartLayers
}

export const CoverageChart = ({
  data,
  relativeContainerRef,
  colors,
  visibleLayers
}: PropTypes) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipMeasureRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  const chartData = useMemo<Serie[]>(() => {
    const series: Serie[] = []

    if (visibleLayers.er) {
      series.push({
        id: 'er',
        data: data.map(item => ({
          x: item.day,
          y: Number(item.er ?? 0)
        }))
      })
    }

    if (visibleLayers.err) {
      series.push({
        id: 'err',
        data: data.map(item => ({
          x: item.day,
          y: Number(item.err ?? 0)
        }))
      })
    }

    return series
  }, [data, visibleLayers])

  const {
    marginLeft,
    MARGIN_TOP,
    MARGIN_BOTTOM,
    yTickValues,
    xTickValues,
    chartHeight
  } = useCoverageChartDimensions({
    data: chartData
  })

  const { chartWidth, isWideScreen } = useChartScroll({
    containerRef,
    data,
    mainContainerRef
  })

  const {
    tooltipPosition,
    selectedDay,
    handleContainerClick,
    handleHighlightClick,
    dayForMeasure
  } = useCoverageTooltipPosition({
    mainContainerRef,
    containerRef,
    tooltipMeasureRef,
    relativeContainerRef,
    maxXAdjustment: 0,
    minXAdjustment: 0,
    marginLeft,
    tooltipBottomY: -120,
    chartHeight
  })

  return (
    <CoverageChartContainer
      chartWidth={chartWidth}
      chartHeight={chartHeight}
      validData={chartData}
      selectedDay={selectedDay}
      containerRef={containerRef}
      isWideScreen={isWideScreen}
      tooltipPosition={tooltipPosition}
      mainContainerRef={mainContainerRef}
      tooltipMeasureRef={tooltipMeasureRef}
      handleContainerClick={handleContainerClick}
      dayForMeasure={dayForMeasure}
      colors={colors}
      visibleLayers={visibleLayers}
    >
      <NivoTwoLine
        yTickValues={yTickValues}
        MARGIN_BOTTOM={MARGIN_BOTTOM}
        marginLeft={marginLeft}
        MARGIN_TOP={MARGIN_TOP}
        chartData={chartData}
        xTickValues={xTickValues}
        selectedDay={selectedDay}
        handleHighlightClick={handleHighlightClick}
        colors={colors}
      />
    </CoverageChartContainer>
  )
}
