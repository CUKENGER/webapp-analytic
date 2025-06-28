import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export const MainContainerButton = ({ children, className }: { children: ReactNode, className?: string }) => {
  return (
    <div className="px-6 mt-auto pt-10">
      <div className={cn("button-container pb-padding-bottom-nav", className)}>
        {children}
      </div>
    </div>
  )
}
