import {
  MouseEvent,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState
} from 'react'
import { formatValue } from '@/components/utils/formatValue' // Импортируем из ReportChart
import { cn } from '@/lib/utils'
import { CustomTooltip } from '@/pages/Audience/components/SubscribersChart/CustomTooltip'
import { useMouseMove } from '@/pages/Audience/components/SubscribersChart/useMouseMove'
import styles from './NewReportChartContainer.module.css'
import { MetricType } from '@/components/ReportTable/ReportTable.types'

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
  metricType?: MetricType // Добавляем metricType
}

export const NewReportChartContainer = ({
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
  metricType
}: PropTypes) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isChartReady, setIsChartReady] = useState(false)

  const { handleMouseMove, handleMouseDown, handleMouseUp, isDragging } =
    useMouseMove(containerRef, chartWidth)

  const dayData = validData[0]?.data.find(d => d.x === selectedDay)
  const measureDayData = validData[0]?.data.find(d => d.x === dayForMeasure)

  const getTooltipContent = (day: string | null, data: any) => {
    if (!day) return null // Если day нет, не показываем тултип

    const [year, month, dayStr] = day.split('-')

    return (
      <>
        <div className="text-center h-[28px] flex items-center justify-center">
          <p className="text-gray text-xs font-bold">
            {`${dayStr}.${month}.${year.slice(-2)}`}
          </p>
        </div>
        <div className="border-t border-tooltip-divide font-bold flex items-center w-full">
          <div className="text-sm whitespace-nowrap pb-2 pt-1 w-full text-center">
            <span>{formatValue(data?.y, metricType)}</span>
          </div>
        </div>
      </>
    )
  }

  const visibleTooltipContent = getTooltipContent(selectedDay, dayData)
  const measureTooltipContent = getTooltipContent(dayForMeasure, measureDayData)

  useEffect(() => {
    if (validData.length > 0 && chartWidth > 0 && chartHeight > 0) {
      // График готов, когда данные и размеры определены
      setIsChartReady(true)
    }
  }, [validData, chartWidth, chartHeight])

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
            {isChartReady && (
              <div
                style={{ width: '16px', flexShrink: 0 }}
                className={styles.leftWork}
              />
            )}
            <div style={{ flex: 1, minWidth: chartWidth }}>{children}</div>
            {isChartReady && (
              <div
                style={{ width: '21px', flexShrink: 0 }}
                className={styles.rightWork}
              />
            )}
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
        {tooltipPosition && selectedDay && visibleTooltipContent && (
          <CustomTooltip
            tooltipRef={tooltipRef}
            tooltipPosition={tooltipPosition}
          >
            {visibleTooltipContent}
          </CustomTooltip>
        )}
        <div
          style={{
            visibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <CustomTooltip
            tooltipRef={tooltipMeasureRef}
            tooltipPosition={{ x: 0, y: 0 }}
          >
            {measureTooltipContent}
          </CustomTooltip>
        </div>
      </div>
    </div>
  )
}
