import { useCallback, useEffect, useRef, useState } from 'react'
import { addMonths, startOfMonth, subMonths } from 'date-fns'

interface UseInfiniteScrollMonthOptions {
  containerRef: React.RefObject<HTMLDivElement>
  initialItemsCount: number
  observerRootMargin: string
  observerThreshold: number
  itemsToLoad: number
  initialScrollDate?: Date
}

export const useInfiniteScrollMonth = ({
  containerRef,
  initialItemsCount,
  observerRootMargin,
  observerThreshold,
  itemsToLoad,
  initialScrollDate = new Date()
}: UseInfiniteScrollMonthOptions) => {
  const [items, setItems] = useState<Date[]>(() => {
    const currentMonth = startOfMonth(initialScrollDate)
    const halfNum = Math.floor(initialItemsCount / 2)

    const newItems = Array.from({ length: initialItemsCount }, (_, index) => {
      const offset = index - halfNum
      return startOfMonth(addMonths(currentMonth, offset))
    })
    return newItems
  })

  const [isLoadingTop, setIsLoadingTop] = useState(false)
  const [isLoadingBottom, setIsLoadingBottom] = useState(false)
  const [isInitialScrollDone, setIsInitialScrollDone] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const prevScrollHeightRef = useRef<number>(0) // Для сохранения высоты перед подгрузкой вверх
  const prevTopVisibleMonthRef = useRef<Date | null>(null)
  const prevTopVisibleOffsetRef = useRef<number>(0)

  const loadPreviousMonths = useCallback(() => {
    if (isLoadingTop || isLoadingBottom) return

    setIsLoadingTop(true)
    const container = containerRef.current
    if (container) {
      prevScrollHeightRef.current = container.scrollHeight
      const visibleElements = Array.from(
        container.querySelectorAll('[data-index]')
      )
      const topVisibleElement = visibleElements.find(el => {
        const rect = el.getBoundingClientRect()
        return rect.top >= 0 && rect.top < container.clientHeight
      }) as HTMLElement | undefined
      if (topVisibleElement) {
        const index = Number(topVisibleElement.getAttribute('data-index'))
        prevTopVisibleMonthRef.current = items[index]
        prevTopVisibleOffsetRef.current =
          topVisibleElement.offsetTop - container.scrollTop
      }
    }

    setItems(prevMonths => {
      const firstMonth = prevMonths[0]
      if (!firstMonth) return prevMonths

      const newMonths = Array.from({ length: itemsToLoad }, (_, index) =>
        subMonths(firstMonth, index + 1)
      ).reverse()

      return [...newMonths, ...prevMonths]
    })
  }, [isLoadingTop, isLoadingBottom, containerRef, itemsToLoad, items])

  const loadNextMonths = useCallback(() => {
    if (isLoadingTop || isLoadingBottom) return

    setIsLoadingBottom(true)
    setItems(prevMonths => {
      const lastMonth = prevMonths[prevMonths.length - 1]
      if (!lastMonth) return prevMonths

      const newMonths = Array.from({ length: itemsToLoad }, (_, index) =>
        addMonths(lastMonth, index + 1)
      )

      return [...prevMonths, ...newMonths]
    })
  }, [isLoadingTop, isLoadingBottom, itemsToLoad])

  const getInitialMonthIndex = useCallback(() => {
    const targetDate = initialScrollDate
    const index = items.findIndex(
      item =>
        item.getFullYear() === targetDate.getFullYear() &&
        item.getMonth() === targetDate.getMonth()
    )
    return index === -1 ? Math.floor(initialItemsCount / 2) : index
  }, [initialScrollDate, items, initialItemsCount])

  // Инициализация скролла к заданному месяцу
  useEffect(() => {
    const container = containerRef.current
    if (!container || isInitialScrollDone) return

    const initialMonthIndex = getInitialMonthIndex()

    const scrollToMonth = () => {
      const middleMonthElement = container.querySelector(
        `[data-index="${initialMonthIndex}"]`
      )
      if (middleMonthElement) {
        middleMonthElement.scrollIntoView({
          block: 'center',
          behavior: 'auto'
        })
        setIsInitialScrollDone(true)
      } else {
        container.scrollTop = container.scrollHeight / 2
        setIsInitialScrollDone(true)
      }
    }

    // Задержка для рендеринга DOM
    requestAnimationFrame(() => {
      scrollToMonth()
    })
  }, [
    items,
    isInitialScrollDone,
    initialScrollDate,
    containerRef,
    getInitialMonthIndex
  ])

  // Корректировка позиции скролла после подгрузки вверх
  useEffect(() => {
    if (!isLoadingTop) return

    const container = containerRef.current
    if (
      container &&
      prevScrollHeightRef.current &&
      prevTopVisibleMonthRef.current
    ) {
      const topVisibleIndex = items.findIndex(
        item => item.getTime() === prevTopVisibleMonthRef.current!.getTime()
      )

      if (topVisibleIndex !== -1) {
        const topElement = container.querySelector(
          `[data-index="${topVisibleIndex}"]`
        ) as HTMLElement | null
        if (topElement) {
          const newOffsetTop = topElement.offsetTop
          const correctedScrollTop =
            newOffsetTop - prevTopVisibleOffsetRef.current
          container.scrollTop = correctedScrollTop
        }
      }
      setIsLoadingTop(false)
      prevTopVisibleMonthRef.current = null
    }
  }, [items, isLoadingTop, containerRef])

  // Сброс флага загрузки после подгрузки вниз
  useEffect(() => {
    if (isLoadingBottom) {
      setIsLoadingBottom(false)
    }
  }, [items, isLoadingBottom])

  // Настройка IntersectionObserver
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isInitialScrollDone) return

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return

        const monthIndex = Number(entry.target.getAttribute('data-index'))
        if (monthIndex <= 2 && !isLoadingTop) {
          // Триггер для подгрузки вверх
          loadPreviousMonths()
        } else if (monthIndex >= items.length - 3 && !isLoadingBottom) {
          // Триггер для подгрузки вниз
          loadNextMonths()
        }
      })
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: container,
      rootMargin: `${observerRootMargin} 0px ${observerRootMargin} 0px`, // Симметричный отступ сверху и снизу
      threshold: observerThreshold
    })

    observerRef.current.disconnect() // Очищаем предыдущие наблюдения

    const firstFew = container.querySelector('[data-index="2"]') // Наблюдаем за 3-м элементом сверху
    const lastFew = container.querySelector(
      `[data-index="${items.length - 3}"]`
    ) // Наблюдаем за 3-м с конца

    if (firstFew) observerRef.current.observe(firstFew)
    if (lastFew) observerRef.current.observe(lastFew)

    return () => observerRef.current?.disconnect()
  }, [
    items,
    loadPreviousMonths,
    loadNextMonths,
    isLoadingTop,
    isLoadingBottom,
    containerRef,
    observerRootMargin,
    observerThreshold,
    isInitialScrollDone
  ])

  return { items }
}
