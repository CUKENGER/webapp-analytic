import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import './BlockItem.styles.css'

interface PropTypes {
  children: ReactNode
  className?: string
  needHover?: boolean
}

export const BlockItem = ({
  children,
  className,
  needHover = false
}: PropTypes) => {
  return (
    <div
      className={cn(
        'font-medium text-tg-text text-start h-[46px] flex items-center block-item',
        needHover && 'block-item--hover',
        className
      )}
    >
      {children}
    </div>
  )
}
