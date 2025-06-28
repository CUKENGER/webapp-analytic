import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const Notice = ({
  children,
  className,
  error = false,
  classNameBody
}: {
  children: ReactNode | string
  className?: string
  classNameBody?: string
  error?: boolean
}) => {
  return (
    <div
      className={cn(
        'rounded-sm w-full border-0 border-l-4 box-border',
        error
          ? 'border-tg-destructive bg-bg-notice-error'
          : 'bg-bg-notice border-tg-link',
        className
      )}
    >
      <p
        className={cn('text-sm font-bold p-3 text-dark-gray-stroke text-start leading-[1.4]', classNameBody)}
      >
        {children}
      </p>
    </div>
  )
}
