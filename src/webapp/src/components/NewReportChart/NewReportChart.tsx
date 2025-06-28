import { RefObject, useRef } from 'react'
import { FilterValueType } from '../ReportTable/ReportTable.types'
import { useChartDimensions } from './model/useChartDimensions'
import { useChartScroll } from './model/useChartScroll'
import { useReportTooltipPosition } from './model/useReportTooltipPosition'
import { NewReportChartContainer } from './ui/NewReportChartContainer'
import { NivoLine } from './ui/NivoLine'
interface PropTypes {
  data: any[]
  relativeContainerRef: RefObject<HTMLDivElement>
  selectedMetric: FilterValueType
}

export const NewReportChart = ({
  data,
  relativeContainerRef,
  selectedMetric
}: PropTypes) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipMeasureRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  const {
    marginLeft,
    MARGIN_TOP,
    MARGIN_BOTTOM,
    yTickValues,
    xTickValues,
    chartHeight,
    metricType,
    chartData
  } = useChartDimensions({
    data,
    filterValue: selectedMetric
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
  } = useReportTooltipPosition({
    mainContainerRef,
    containerRef,
    tooltipMeasureRef,
    relativeContainerRef,
    tooltipY: -45,
    maxXAdjustment: 0,
    minXAdjustment: 0,
    marginLeft
  })

  return (
    <NewReportChartContainer
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
      selectedMetric={selectedMetric}
      dayForMeasure={dayForMeasure}
      metricType={metricType}
    >
      <NivoLine
        yTickValues={yTickValues}
        MARGIN_BOTTOM={MARGIN_BOTTOM}
        marginLeft={marginLeft}
        MARGIN_TOP={MARGIN_TOP}
        chartData={chartData}
        xTickValues={xTickValues}
        selectedDay={selectedDay}
        handleHighlightClick={handleHighlightClick}
        metricType={metricType}
      />
    </NewReportChartContainer>
  )
}
