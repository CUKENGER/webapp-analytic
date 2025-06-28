import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { SUBSCRIBERS_SCROLL_CONSTANTS } from './SubscribersChartConstants'

interface ChartScrollProps {
  containerRef: React.RefObject<HTMLDivElement>
  data: any[]
	mainContainerRef: RefObject<HTMLDivElement>
}

export const useChartScroll = ({ containerRef, data, mainContainerRef }: ChartScrollProps) => {
  const [isWideScreen, setIsWideScreen] = useState(false)
  const [chartWidth, setChartWidth] = useState(320)
  const previousWidth = useRef<number | null>(null)

  const updateChartWidth = () => {
    const container = containerRef.current
    if (container && data.length > 0) {
      const containerWidth = container.getBoundingClientRect().width - 5
      const minChartWidth = data.length * SUBSCRIBERS_SCROLL_CONSTANTS.MIN_CELL_WIDTH
      const currentWidth = previousWidth.current
      const padding = isWideScreen ? 0 : SUBSCRIBERS_SCROLL_CONSTANTS.DECORATIVE_WIDTH
      const minusPadding = isWideScreen ? 0 : 16

      let availableWidth: number
      // Если ширина увеличивается, убираем DECORATIVE_WIDTH
      if (currentWidth !== null && containerWidth > currentWidth) {
        availableWidth = containerWidth - SUBSCRIBERS_SCROLL_CONSTANTS.PADDING + 16
      } else {
        // При уменьшении или первоначальной загрузке учитываем DECORATIVE_WIDTH
        availableWidth =
          containerWidth - SUBSCRIBERS_SCROLL_CONSTANTS.PADDING - padding + minusPadding
      }

      setChartWidth(Math.max(minChartWidth, availableWidth))
      previousWidth.current = containerWidth // Обновляем предыдущую ширину
    }
  }

  // Пересчитываем при монтировании и изменении данных
  useLayoutEffect(() => {
    updateChartWidth()
  }, [containerRef, data.length, data]) // Добавляем data как зависимость

  // Пересчитываем при ресайзе окна
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleResize = () => {
      updateChartWidth()
      const screenWidth = window.innerWidth
      setIsWideScreen(screenWidth > SUBSCRIBERS_SCROLL_CONSTANTS.BREAKPOINT)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [containerRef, data]) // Обновляем зависимость на data

  // Управление padding-left при скролле
  useEffect(() => {
    const container = containerRef.current
    const mainContainer = mainContainerRef.current
    if (!container || !mainContainer) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      // Если isWideScreen === true, padding-left всегда 0px
      // Иначе применяем логику скролла
      mainContainer.style.paddingLeft = isWideScreen
        ? '0px'
        : scrollLeft > 0
          ? '0px'
          : '16px'
    }

    // Выполняем после полной загрузки DOM
    const initPadding = () => {
      if (isWideScreen) {
        mainContainer.style.paddingLeft = '0px' // При wide screen padding убирается
      } else if (container.scrollWidth > container.clientWidth) {
        handleScroll() // Устанавливаем padding в зависимости от текущего scrollLeft
      } else {
        mainContainer.style.paddingLeft = '16px' // Начальное значение для случая без скролла
      }
    }

    initPadding() // Инициализация
    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [chartWidth, isWideScreen]) // Добавляем isWideScreen в зависимости

  return { chartWidth, isWideScreen }
}
