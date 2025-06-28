import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PropTypes {
  children: ReactNode
  color?: string
  onClick?: () => void
  active?: boolean
}

export const ChartButton = ({
  children,
  color = '#0080FF',
  active = false,
  onClick
}: PropTypes) => {
  return (
    <button
      className={`
        px-3 py-[9px] border-tooltip-divide border rounded-lg text-sm
        flex items-center gap-2 h-[38px]
        transition-all duration-200
        ${
          active
            ? 'text-tg-text bg-chart-button-active'
            : 'text-gray bg-transparent hover:bg-chart-button-hover hover:text-tg-text'
        }
      `}
      onClick={onClick}
    >
      <span
        className={cn(
          'h-[8px] w-[8px] rounded-[2px] flex-shrink-0',
          !active && 'opacity-40'
        )}
        style={{ backgroundColor: active ? color : '#8F9EB0' }}
      ></span>
      <span className='whitespace-nowrap'>{children}</span>
    </button>
  )
}
