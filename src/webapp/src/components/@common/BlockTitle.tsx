import { ReactNode } from 'react';
import { cn } from '@/lib/utils';


interface BlockTitleProps {
  title: string
  children?: ReactNode
  className?: string
  classNameTitle?: string
  classNameSubtitle?: string
}

export const BlockTitle = ({ title, children, className, classNameSubtitle, classNameTitle }: BlockTitleProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center w-full gap-2 mb-4 text-center',
        className
      )}
    >
      <p className={cn("text-xl font-bold text-tg-text leading-[1.2]", classNameTitle)}>{title}</p>
      <p className={cn("text-base text-tg-hint leading-[1.4]", classNameSubtitle)}>{children}</p>
    </div>
  )
}