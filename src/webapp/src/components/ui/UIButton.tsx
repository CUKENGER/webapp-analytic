import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { Spinner } from '@telegram-apps/telegram-ui'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import React from 'react'

const buttonVariants = cva(
  'whitespace-nowrap ' +
  'disabled:pointer-events-none ' +
  '[&_svg]:pointer-events-none [&_svg]:shrink-0 ' +
  'disabled:bg-button-disabled ' +
  'transition-all duration-200 ease-in-out ', // Базовые стили и переходы
  {
    variants: {
      variant: {
        default:
          'bg-tg-primary text-tg-text ' +
          'hover:bg-tg-primary/80 active:bg-tg-primary/70 ' +
          'shadow-sm hover:shadow-md active:shadow-md',
        primary: 'bg-tg-primary text-white hover:bg-blue-dark active:bg-blue-dark shadow-[0_8px_40px_0_rgba(7,119,231,0.16)] ' +
          'hover:shadow-[0_8px_24px_0_rgba(7,119,231,0.24)] active:shadow-[0_8px_24px_0_rgba(7,119,231,0.24)]',
        outline: 'bg-transparent text-tg-link hover:bg-[rgba(144,158,180,0.08)] active:bg-[rgba(144,158,180,0.08)] ' +
          'border border-[#EAEAED] dark:border-[#363e4e]',
        black: [
          'bg-button-black',
          'text-tg-background',
          'shadow-[0_8px_40px_0_rgba(38,40,45,0.16)]',
          'hover:bg-dark-gray-stroke',
          'hover:shadow-[0_8px_40px_0_rgba(38,40,45,0.24)]',
          'dark:shadow-[0_8px_40px_0_rgba(255,255,255,0.16)]',
          'dark:hover:shadow-[0_8px_40px_0_rgba(255,255,255,0.24)]',
        ].join(' '),
      },
      shadow: {
        default: '',
        none: 'shadow-none hover:shadow-none'
      },
      size: {
        default: 'px-4 py-[15.8px]',
        sm: 'px-3 py-[9px]',
        forLoading: 'p-0 py-1.5'
      },
      fontSize: {
        default: 'text-base',
        sm: 'text-sm',
        lg: 'text-lg',
        xs: 'text-xs'
      },
      font: {
        default: 'font-bold',
        medium: 'font-medium',
      },
      lineHeight: {
        default: 'leading-[1.4]',
      },
      rounded: {
        default: 'rounded-2xl',
        lg: 'rounded-lg',
        md: 'rounded-md',
      },
      width: {
        default: 'w-full',
        fit: 'w-fit',
      },
      position: {
        default: '',
        center: 'flex items-center justify-center'
      },
      disabledStyle: {
        default: '',
        bg: 'border border-gray-stroke'
      },
      colorText: { // Новый вариант для управления цветом текста
        default: '',
        red: 'text-red-500', // Можно использовать ваш кастомный цвет, например, text-tg-destructive
        white: 'text-white',
        gray: 'text-gray-500'
      }
    },
    compoundVariants: [
      {
        variant: 'primary',
        className: 'disabled:text-gray disabled:shadow-none', // Стили для disabled
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fontSize: 'default',
      font: 'default',
      rounded: 'default',
      width: 'default',
      lineHeight: 'default',
      shadow: 'default',
      position: 'default',
      disabledStyle: 'default',
      colorText: 'default'
    }
  }
)

export interface UIButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

const UIButton = React.forwardRef<HTMLButtonElement, UIButtonProps>(
  ({ className, variant, size, fontSize, font, rounded, width, lineHeight, shadow, position, disabledStyle, colorText, children, isLoading = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(className, buttonVariants({ variant, size, fontSize, font, rounded, width, lineHeight, shadow, position, disabledStyle, colorText }))}
        ref={ref}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Spinner className="flex m-auto text-tg-text h-full" size="s" /> // Спиннер при загрузке
        ) : (
          children // Обычный контент, когда не загружается
        )}
      </Comp>
    )
  }
)
UIButton.displayName = 'Button'

export { UIButton }

