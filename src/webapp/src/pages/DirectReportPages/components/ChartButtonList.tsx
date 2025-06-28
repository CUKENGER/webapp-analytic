import { useEffect, useRef, useState } from 'react';
import { FiltersType } from '@/components/ReportTable/ReportTable.types';
import { ChartButton } from '@/pages/Audience/components/ChartButton';


export const ChartButtonList = ({
  options,
  selectedOption,
  setSelectedOption,
  needPadding = true
}: {
  options: FiltersType[]
  selectedOption: string | string[]
  setSelectedOption: (value: string) => void
  needPadding?: boolean
}) => {
  const buttonsContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isCentered, setIsCentered] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isOverflow, setIsOverflow] = useState(false)

  // Обработка начала перетаскивания (ПК)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (buttonsContainerRef.current) {
      setIsDragging(true)
      setStartX(e.pageX - buttonsContainerRef.current.offsetLeft)
      setScrollLeft(buttonsContainerRef.current.scrollLeft)
    }
  }

  // Обработка движения мыши (ПК)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !buttonsContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - buttonsContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Ускорение скролла (можно настроить)
    buttonsContainerRef.current.scrollLeft = scrollLeft - walk
  }

  // Обработка окончания перетаскивания (ПК)
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Обработка начала касания (мобильные устройства)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (buttonsContainerRef.current) {
      setIsDragging(true)
      setStartX(e.touches[0].pageX - buttonsContainerRef.current.offsetLeft)
      setScrollLeft(buttonsContainerRef.current.scrollLeft)
    }
  }

  // Обработка движения касания (мобильные устройства)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !buttonsContainerRef.current) return
    const x = e.touches[0].pageX - buttonsContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Ускорение скролла
    buttonsContainerRef.current.scrollLeft = scrollLeft - walk
  }

  // Обработка окончания касания (мобильные устройства)
  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const checkOverflow = () => {
      if (buttonsContainerRef.current) {
        const containerWidth = buttonsContainerRef.current.clientWidth
        const contentWidth = buttonsContainerRef.current.scrollWidth
        setIsCentered(contentWidth <= containerWidth)
        setIsOverflow(contentWidth > containerWidth)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)

    return () => {
      window.removeEventListener('resize', checkOverflow)
    }
  }, [options]) // Перепроверяем, если меняются options

  return (
    <div
      ref={buttonsContainerRef}
      className={`flex gap-2 w-full scroll-smooth custom-scrollbar hide-scrollbar overflow-x-auto ${
        !isOverflow || needPadding && 'px-10'
      }
      ${isCentered ? 'justify-center' : 'justify-start'}
      `}
      {...(isOverflow
        ? {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd
          }
        : {})}
    >
      {options.map(metric => {
        const isActive = Array.isArray(selectedOption)
          ? selectedOption.includes(metric.value)
          : selectedOption === metric.value
        return (
          <ChartButton
            key={metric.value}
            active={isActive}
            onClick={() => setSelectedOption(metric.value)}
            color={metric.color || '#0080FF'}
          >
            <span className="whitespace-nowrap">{metric.label}</span>
          </ChartButton>
        )
      })}
    </div>
  )
}