import { cva } from 'class-variance-authority'

export const sharedVariants = cva(
  'fixed z-50 gap-4 bg-background p-0 shadow-lg transition-opacity duration-200 ease-in-out',
  {
    variants: {
      side: {
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        center:
          'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded'
      }
    },
    defaultVariants: {
      side: 'bottom'
    }
  }
)
