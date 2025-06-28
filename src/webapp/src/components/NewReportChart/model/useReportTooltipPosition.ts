import { MouseEvent, RefObject, useEffect, useState } from 'react'

interface PropTypes {
  containerRef: RefObject<HTMLDivElement>
  tooltipMeasureRef: RefObject<HTMLDivElement>
  mainContainerRef: RefObject<HTMLDivElement>
  relativeContainerRef?: RefObject<HTMLDivElement>
  padding?: number // Отступ от краев (было 16)
  minXAdjustment?: number // Корректировка при выходе за minX (было -20)
  maxXAdjustment?: number // Корректировка при выходе за maxX (было 20)
  tooltipY?: number // Позиц
  marginLeft: number
}

export const useReportTooltipPosition = ({
  containerRef,
  tooltipMeasureRef,
  mainContainerRef,
  relativeContainerRef,
  padding = 16,
  minXAdjustment = -20,
  maxXAdjustment = 20,
  tooltipY = 20,
  marginLeft = 16
}: PropTypes) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [dayForMeasure, setDayForMeasure] = useState<string>('')

  // Обработчик клика по выделению
  const handleHighlightClick = (
    day: string,
    x: number, // centerX из HighlightLayer
    event: MouseEvent<SVGRectElement>
  ) => {
    event.stopPropagation()
    setDayForMeasure(day)

    requestAnimationFrame(() => {
      const tempTooltip = tooltipMeasureRef.current
      const container = containerRef.current
      const mainContainer = mainContainerRef.current
      const relativeContainer = relativeContainerRef?.current

      if (!tempTooltip || !container || !mainContainer || !relativeContainer)
        return

      let tooltipWidth = tempTooltip.getBoundingClientRect().width

      const MIN_TOOLTIP_WIDTH = 94 // Соответствует CustomTooltip
      if (tooltipWidth < 80) {
        tooltipWidth = MIN_TOOLTIP_WIDTH
      }

      const scrollLeft = container.scrollLeft
      const containerRect = container.getBoundingClientRect()
      const relativeRect = relativeContainer.getBoundingClientRect()

      // Центр HighlightLayer
      const barCenterX = x - scrollLeft
      // Учитываем transform: translateX(-50%) в CustomTooltip
      let tooltipX =
        barCenterX + containerRect.left - relativeRect.left + 16 + marginLeft // Компенсация padding-left

      const halfTooltipWidth = Math.round(tooltipWidth / 2)

      // Границы относительно relativeContainerRef
      const minX = padding + halfTooltipWidth
      const maxX =
        relativeContainer.clientWidth -
        tooltipWidth -
        padding +
        halfTooltipWidth

      const calculatedTooltipY = tooltipY

      if (tooltipX < minX) {
        tooltipX = minX + minXAdjustment
      }

      if (tooltipX > maxX) {
        tooltipX = maxX + maxXAdjustment
      }

      setTooltipPosition({ x: tooltipX, y: calculatedTooltipY }) // y можно сделать динамическим при желании
      setSelectedDay(prev => (prev === day ? null : day))
    })
  }

  const handleContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      !(event.target as HTMLElement).closest(
        'rect[fill="rgba(144, 158, 180, 0.08)"]'
      )
    ) {
      setSelectedDay(null)
      setTooltipPosition(null)
    }
  }

  // Закрытие тултипа при клике вне relativeContainerRef
  useEffect(() => {
    if (!selectedDay || !relativeContainerRef?.current) return

    const handleClickOutside = (event: globalThis.MouseEvent) => {
      const target = event.target as Node
      const relativeContainer = relativeContainerRef.current

      if (relativeContainer && !relativeContainer.contains(target)) {
        setSelectedDay(null)
        setTooltipPosition(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [selectedDay, relativeContainerRef])

  return {
    selectedDay,
    tooltipPosition,
    dayForMeasure,
    handleHighlightClick,
    setSelectedDay,
    setTooltipPosition,
    handleContainerClick
  }
}
