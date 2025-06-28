import { MouseEvent, ReactNode, RefObject, useRef } from 'react'
import { cn } from '@/lib/utils'
import { CustomTooltip } from './CustomTooltip'
import styles from './Subscription.module.css'
import { useMouseMove } from './useMouseMove'

interface PropTypes {
  mainContainerRef: RefObject<HTMLDivElement>
  isWideScreen: boolean
  containerRef: RefObject<HTMLDivElement>
  chartHeight: number
  chartWidth: number
  handleContainerClick: (e: MouseEvent<HTMLDivElement>) => void
  tooltipPosition: { y: number; x: number } | null
  selectedDay: string | null
  validData: {
    day: string
    unsubscriptions: number
    subscriptions: number
    total: number
  }[]
  tooltipMeasureRef: RefObject<HTMLDivElement>
  children: ReactNode
}

export const SubscribersChartContainer = ({
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
  children
}: PropTypes) => {
  const tooltipRef = useRef<HTMLDivElement>(null)

  const { handleMouseMove, handleMouseDown, handleMouseUp, isDragging } =
    useMouseMove(containerRef, chartWidth)

  const dayData = validData.find(d => d.day === selectedDay)

  // Безопасная деструктуризация даты
  let year = ''
  let month = ''
  let day = ''
  if (selectedDay) {
    [year, month, day] = selectedDay.split('-')
  }

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
          <CustomTooltip
            tooltipRef={tooltipRef}
            tooltipPosition={tooltipPosition}
          >
            <>
              <div className="text-center h-[28px] flex items-center justify-center">
                <p className="text-gray text-xs font-bold">
                  {`${day}.${month}.${year.slice(-2)}`}
                </p>
              </div>
              <div className="border-t border-tooltip-divide font-bold flex items-center">
                <div className="px-2 flex items-center gap-1 text-sm whitespace-nowrap pb-2 pt-1">
                  <span>{dayData?.total}</span>
                  <span className="text-green-500">
                    +{dayData?.subscriptions}
                  </span>
                  <span className="text-tg-destructive">
                    -{dayData?.unsubscriptions}
                  </span>
                </div>
              </div>
            </>
          </CustomTooltip>
        )}
        <div
          style={{
            visibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          ref={tooltipMeasureRef}
        >
          <CustomTooltip
            tooltipRef={tooltipMeasureRef}
            tooltipPosition={{ x: 0, y: 0 }}
          >
            <>
              <div className="text-center h-[28px] flex items-center justify-center">
                <p className="text-gray text-xs font-bold">
                  {`${day}.${month}.${year.slice(-2)}`}
                </p>
              </div>
              <div className="border-t border-tooltip-divide font-bold flex items-center">
                <div className="px-2 flex items-center gap-1 text-sm whitespace-nowrap pb-2 pt-1">
                  <span>{dayData?.total}</span>
                  <span className="text-green-500">
                    +{dayData?.subscriptions}
                  </span>
                  <span className="text-tg-destructive">
                    -{dayData?.unsubscriptions}
                  </span>
                </div>
              </div>
            </>
          </CustomTooltip>
        </div>
      </div>
    </div>
  )
}
