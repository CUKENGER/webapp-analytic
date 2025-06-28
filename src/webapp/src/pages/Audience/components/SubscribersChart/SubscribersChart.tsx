import React, { RefObject, useRef } from 'react'
import { AudienceChartColors, AudienceChartLayers } from '../../AudiencePage'
import { AudienceChartData } from './chartData'
import { NivoBar } from './NivoBar'
import { SubscribersChartContainer } from './SubscribersChartContainer'
import { useChartDimensions } from './useChartDimensions'
import { useChartScroll } from './useChartScroll'
import { useTooltipPosition } from './useTooltipPosition'

interface ReportChartProps {
  data: AudienceChartData[]
  relativeContainerRef: RefObject<HTMLDivElement>
  colors: AudienceChartColors
  visibleLayers: AudienceChartLayers
}

const SubscribersChart: React.FC<ReportChartProps> = ({
  data,
  relativeContainerRef,
  visibleLayers,
  colors
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipMeasureRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  const validData = data.filter(
    d =>
      typeof d.day === 'string' &&
      !isNaN(d.unsubscriptions) &&
      !isNaN(d.subscriptions) &&
      !isNaN(d.total)
  )

  const { chartWidth, isWideScreen } = useChartScroll({
    containerRef,
    data: validData,
    mainContainerRef
  })

  const {
    marginLeft,
    MARGIN_TOP,
    MARGIN_BOTTOM,
    yTickValues,
    xTickValues,
    chartHeight,
    minYValue,
    maxYValue
  } = useChartDimensions({ data: validData })

  const {
    tooltipPosition,
    selectedDay,
    handleContainerClick,
    handleHighlightClick
  } = useTooltipPosition({
    mainContainerRef,
    containerRef,
    tooltipMeasureRef,
    relativeContainerRef,
		marginLeft
  })

  if (!validData || validData.length === 0) {
    return <div>Нет данных для отображения</div>
  }

  return (
    <SubscribersChartContainer
      selectedDay={selectedDay}
      tooltipPosition={tooltipPosition}
      handleContainerClick={handleContainerClick}
      chartHeight={chartHeight}
      chartWidth={chartWidth}
      isWideScreen={isWideScreen}
      containerRef={containerRef}
      tooltipMeasureRef={tooltipMeasureRef}
      validData={validData}
      mainContainerRef={mainContainerRef}
    >
      <NivoBar
        validData={validData}
        selectedDay={selectedDay}
        handleHighlightClick={handleHighlightClick}
        xTickValues={xTickValues}
        yTickValues={yTickValues}
        marginLeft={marginLeft}
        MARGIN_TOP={MARGIN_TOP}
        MARGIN_BOTTOM={MARGIN_BOTTOM}
        minYValue={minYValue}
        maxYValue={maxYValue}
        colors={colors} // Передаем цвета
        visibleLayers={visibleLayers} // Передаем видимость
      />
    </SubscribersChartContainer>
  )
}

export default SubscribersChart
