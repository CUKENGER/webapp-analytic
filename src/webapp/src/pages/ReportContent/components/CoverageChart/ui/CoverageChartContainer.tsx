import { MouseEvent, ReactNode, RefObject, useRef } from 'react'
import styles from '@/components/NewReportChart/ui/NewReportChartContainer.module.css'
import { cn } from '@/lib/utils'
import { useMouseMove } from '@/pages/Audience/components/SubscribersChart/useMouseMove'
import {
  CoverageChartColors,
  CoverageChartLayers
} from '@/pages/ReportContent/ReportContent'
import { CoverageTooltip } from './CoverageTooltip'

interface PropTypes {
  mainContainerRef: RefObject<HTMLDivElement>
  isWideScreen: boolean
  containerRef: RefObject<HTMLDivElement>
  chartHeight: number
  chartWidth: number
  handleContainerClick: (e: MouseEvent<HTMLDivElement>) => void
  tooltipPosition: { y: number; x: number } | null
  selectedDay: string | null
  validData: any
  tooltipMeasureRef: RefObject<HTMLDivElement>
  children: ReactNode
  dayForMeasure: string
  colors: CoverageChartColors
  visibleLayers: CoverageChartLayers
}

export const CoverageChartContainer = ({
  mainContainerRef,
  isWideScreen,
  containerRef,
  chartWidth,
  chartHeight,
  handleContainerClick,
  tooltipPosition,
  selectedDay,
  validData,
  tooltipMeasureRef,
  children,
  dayForMeasure,
  colors,
  visibleLayers
}: PropTypes) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { handleMouseMove, handleMouseDown, handleMouseUp, isDragging } =
    useMouseMove(containerRef, chartWidth)

  // Извлекаем данные для selectedDay и dayForMeasure
  const getDayData = (day: string | null) => {
    if (!day) return { er: undefined, err: undefined }
    const erData = validData
      .find((serie: any) => serie.id === 'er')
      ?.data.find((d: any) => d.x === day)
    const errData = validData
      .find((serie: any) => serie.id === 'err')
      ?.data.find((d: any) => d.x === day)
    return { er: erData?.y, err: errData?.y }
  }

  const dayData = getDayData(selectedDay)
  const measureDayData = getDayData(dayForMeasure)

  const formatValue = (value: number | undefined) => {
    if (value === undefined) return '0'
    return `${value.toFixed(1)}%`
  }

  const getTooltipContent = (
    day: string | null,
    data: { er: number | undefined; err: number | undefined },
    colors: CoverageChartColors,
    visibleLayers: CoverageChartLayers
  ) => {
    let year = ''
    let month = ''
    let dayStr = ''
    if (day) {
      ;[year, month, dayStr] = day.split('-')
    }

    return (
      <>
        <div className="text-center h-[28px] flex items-center justify-center">
          <p className="text-gray text-xs font-bold">
            {day ? `${dayStr}.${month}.${year.slice(-2)}` : '01.01.25'}
          </p>
        </div>
        <div className="border-t border-tooltip-divide font-bold flex items-center w-full">
          <div className="text-sm whitespace-nowrap pb-2 pt-1 w-full px-2 flex flex-col gap-1">
            {visibleLayers.er && (
              <p className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.er }}
                />
                <span className="text-gray font-bold">ER:</span>
                <span>{formatValue(data.er)}</span>
              </p>
            )}
            {visibleLayers.err && (
              <p className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.err }}
                />
                <span className="text-gray font-bold">ERR:</span>
                <span>{formatValue(data.err)}</span>
              </p>
            )}
          </div>
        </div>
      </>
    )
  }

  const visibleTooltipContent = getTooltipContent(
    selectedDay,
    dayData,
    colors,
    visibleLayers
  )
  const measureTooltipContent = getTooltipContent(
    dayForMeasure,
    measureDayData,
    colors,
    visibleLayers
  )

  return (
    <div
      ref={mainContainerRef}
      className={cn(
        isWideScreen
          ? styles.reportChartWideContainer
          : styles.reportChartContainer,
        'select-none'
      )}
      style={{ overflow: 'hidden' }}
    >
      <div onClick={handleContainerClick}>
        <div
          ref={containerRef}
          className={cn(
            'hide-scrollbar',
            isWideScreen ? styles.reportChartWideInner : styles.reportChartInner
          )}
          style={{
            overflowX: 'auto',
            height: `${chartHeight}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            style={{
              display: 'flex',
              width: `${chartWidth}px`,
              height: '100%'
            }}
          >
            <div
              style={{ width: '16px', flexShrink: 0 }}
              className={styles.leftWork}
            />
            <div style={{ flex: 1, minWidth: chartWidth }}>{children}</div>
            <div
              style={{ width: '21px', flexShrink: 0 }}
              className={styles.rightWork}
            />
            {!isWideScreen && <div className={cn('w-4 shrink-0')} />}
          </div>
        </div>
      </div>
      <div
        className={styles.tooltipWrapper}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 30
        }}
      >
        {tooltipPosition && selectedDay && (
          <CoverageTooltip
            tooltipRef={tooltipRef}
            tooltipPosition={tooltipPosition}
          >
            {visibleTooltipContent}
          </CoverageTooltip>
        )}
        <div
          style={{
            visibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <CoverageTooltip
            tooltipRef={tooltipMeasureRef}
            tooltipPosition={{ x: 0, y: 0 }}
          >
            {measureTooltipContent}
          </CoverageTooltip>
        </div>
      </div>
    </div>
  )
}
