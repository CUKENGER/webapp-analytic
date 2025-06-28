import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textareaVariants = cva(
  'flex w-full bg-transparent text-base transition-all duration-200 ease-in-out border border-transparent ' +
    'placeholder:text-gray disabled:cursor-not-allowed disabled:opacity-50 ' +
    'focus-visible:outline-none resize-none',
  {
    variants: {
      variant: {
        default:
          'bg-light-gray-back text-dark-gray-stroke ' +
          'hover:border-light-gray-stroke/80 focus-visible:ring-light-gray-stroke/50',
        primary:
          'bg-tg-background text-tg-text border-tg-primary ' +
          'hover:border-light-gray-stroke/80 focus-visible:ring-light-gray-stroke/50',
        outline:
          'bg-transparent text-tg-link border-[#EAEAED] dark:border-[#363e4e] ' +
          'hover:bg-[rgba(144,158,180,0.08)] focus-visible:ring-tg-link/50'
      },
      textareaSize: {
        default: 'px-3 py-[7px] min-h-[40px] h-auto',
        sm: 'min-h-[82px] h-auto px-3 py-1 max-h-[120px]',
        lg: 'h-[150px] px-5 py-3',
        short:
          'px-3 py-1 min-h-[24px] h-auto max-h-[130px] overflow-y-auto leading-[1.4]'
      },
      fontSize: {
        default: 'text-base',
        sm: 'text-sm',
        lg: 'text-lg',
        xs: 'text-xs'
      },
      rounded: {
        default: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        none: 'rounded-none'
      },
      shadow: {
        default: 'shadow-none',
        none: 'shadow-none'
      }
    },
    defaultVariants: {
      variant: 'default',
      textareaSize: 'default',
      fontSize: 'default',
      rounded: 'default',
      shadow: 'default'
    }
  }
)

export interface UITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean | string
}

const UITextarea = React.forwardRef<HTMLTextAreaElement, UITextareaProps>(
  (
    {
      className,
      variant,
      textareaSize,
      fontSize,
      rounded,
      shadow,
      error,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = 'auto'
        const scrollHeight = textarea.scrollHeight
        const maxHeight =
          textareaSize === 'short' || textareaSize === 'sm' ? 130 : 150
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
        textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
      }
    }, [textareaSize])

    // Подстраиваем высоту при монтировании и изменении значения
    React.useEffect(() => {
      adjustHeight()
    }, [adjustHeight])

    // Подстраиваем высоту при ресайзе окна
    React.useEffect(() => {
      window.addEventListener('resize', adjustHeight)
      return () => window.removeEventListener('resize', adjustHeight)
    }, [adjustHeight])

    return (
      <textarea
        className={cn(
          textareaVariants({
            variant,
            textareaSize,
            fontSize,
            rounded,
            shadow
          }),
          error ? 'border border-tg-destructive' : '',
          className
        )}
        rows={1}
        onInput={adjustHeight}
        ref={node => {
          textareaRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        {...props}
      />
    )
  }
)

UITextarea.displayName = 'UITextarea'

export { UITextarea }
