import { MouseEvent, RefObject, useEffect, useState } from 'react'

export const useMouseMove = (containerRef: RefObject<HTMLDivElement>, chartWidth: number) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [dragThreshold] = useState(5) // Минимальное расстояние для начала перетаскивания
  const [dragStarted, setDragStarted] = useState(false)
  const DAMPING_FACTOR = 2

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return

    setIsDragging(true)
    setStartX(event.pageX)
    setScrollLeft(container.scrollLeft)
    setDragStarted(false)
  }

  let animationFrameId: number | null = null

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return

    if (!dragStarted) {
      const dragDistance = Math.abs(event.pageX - startX)
      if (dragDistance > dragThreshold) {
        setDragStarted(true)
      } else {
        return
      }
    }

    if (dragStarted) {
      event.preventDefault() // только когда точно перетаскиваем
      // ... остальной код прокрутки
    }

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }

    animationFrameId = requestAnimationFrame(() => {
      const container = containerRef.current!
      const deltaX = (event.pageX - startX) / DAMPING_FACTOR // Используем дельту
      let newScrollLeft = scrollLeft - deltaX
      const maxScrollLeft = chartWidth - container.clientWidth + 55
      newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft))

      if (newScrollLeft !== container.scrollLeft) {
        container.scrollLeft = newScrollLeft
        setScrollLeft(newScrollLeft)
      }
    })
  }

  // Очистка анимации при отпускании кнопки мыши
  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStarted(false) // Сбрасываем флаг начала перетаскивания
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseLeave = () => {
      if (isDragging) {
        setIsDragging(false)
      }
    }

    container.addEventListener('mouseleave', handleMouseLeave)
    return () => container.removeEventListener('mouseleave', handleMouseLeave)
  }, [isDragging])

	return {
		handleMouseUp, 
		handleMouseDown, 
		handleMouseMove,
		isDragging
	}
}
