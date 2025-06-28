import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tg-button-color focus-visible:ring-opacity-50 ' +
    'disabled:pointer-events-none disabled:opacity-50 ' +
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 ' +
    'transition-all duration-200 ease-out font-bold', // Базовые стили и переходы
  {
    variants: {
      variant: {
        default:
          'bg-tg-primary text-white' +
          'hover:bg-tg-primary/80 active:bg-tg-primary/70 ' +
          'shadow-sm hover:shadow-md',
        destructive:
          'bg-tg-destructive text-tg-text' +
          'hover:bg-tg-destructive/80 active:bg-tg-destructive/70 ' +
          'shadow-sm hover:shadow-md',
        outline:
          'border border-gray-stroke text-tg-link bg-tg-background w-full rounded-2xl text-base px-0' +
          'bg-transparent' + 
          'hover:bg-tg-background ' +
          'active:bg-tg-background shadow-sm',
        secondary:
          'bg-tg-secondary text-tg-text' +
          'hover:bg-tg-secondary/80 active:bg-tg-secondary/70 ' +
          'shadow-sm hover:shadow-md',
        ghost:
          'bg-transparent text-tg-link font-bold text-sm px-4' +
          'hover:bg-tg-secondary hover:text-tg-primary dark:hover:text-tg-accent active:bg-tg-secondary active:text-tg-accent' +
          'transition-colors duration-150 ease-in-out',
        link:
          'bg-transparent text-tg-link underline-offset-4 hover:underline ' +
          'active:text-tg-link/80',
        accent:
          'bg-tg-accent text-tg-text hover:bg-tg-accent/80 active:bg-tg-accent/70 shadow-sm hover:shadow-md',
        primary: 'w-full py-7 rounded-2xl bg-tg-primary text-white text-base mb-[66px] shadow-btn',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs rounded-md',
        lg: 'h-10 px-8 rounded-md',
        icon: 'h-9 w-9 rounded-md',
        xl: 'py-4 px-10 text-base',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }

