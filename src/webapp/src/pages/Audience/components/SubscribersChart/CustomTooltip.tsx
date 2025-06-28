import { ReactNode, RefObject } from 'react'

export const CustomTooltip = ({
  tooltipPosition,
  tooltipRef,
  children
}: {
  tooltipPosition: {
    x: number
    y: number
  }
  tooltipRef: RefObject<HTMLDivElement>
  children: ReactNode
}) => {

  return (
    <div
      ref={tooltipRef}
      className="bg-tooltip-chart text-tg-text-invert rounded-lg card-shadow-default"
      style={{
        position: 'absolute',
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 20,
        minWidth: '94px'
      }}
    >
      {children}
    </div>
  )
}
