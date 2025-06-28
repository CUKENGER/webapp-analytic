import { Children, Fragment, ReactNode } from 'react';
import { cn } from '@/lib/utils';


interface BlockContainerProps {
  children: ReactNode
  title?: string
  className?: string
  headerBg?: 'lighter' | 'darker'
  needBorder?: boolean
  divideClassName?: string
  childrenClassName?: string
  needBg?: boolean
  itemClassName?: string
  needFlex?: boolean
}

export const BlockContainer = ({
  children,
  title,
  className,
  headerBg = 'lighter',
  divideClassName,
  childrenClassName,
  needBorder = false,
  needBg = true,
  itemClassName,
  needFlex = false
}: BlockContainerProps) => {
  const arrayChildren = Children.toArray(children)

  return (
    <div
      className={cn(
        'relative rounded-2xl text-center text-tg-hint',
        title && 'pt-2',
        needBg &&
          (headerBg === 'darker'
            ? 'bg-light-gray-stroke'
            : 'bg-light-gray-back')
      )}
    >
      {title && <p className="text-sm font-medium w-[96%] mx-auto">{title}</p>}
      <div
        className={cn(
          'flex flex-col justify-between w-full bg-tg-background rounded-2xl mt-2 overflow-hidden',
          needBorder && 'border-gray-stroke border',
          className
        )}
      >
        <div className={cn('bg-tg-background rounded-2xl pl-4', itemClassName)}>
          {arrayChildren.map((child, index) => (
            <Fragment key={index}>
              <div
                className={cn(
                  childrenClassName,
                  index === 0 && needFlex ? 'flex-1 h-full' : 'flex-none',
                )}
              >
                {child}
              </div>
              {index < arrayChildren.length - 1 && (
                <div className={cn('h-px bg-gray-stroke', divideClassName)} />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}