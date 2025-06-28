import { cn } from '@/lib/utils'

export const ErrorMessage: React.FC<{
  message?: string
  className?: string
}> = ({ message, className }) =>
  message ? (
    <p className={cn('text-red-500 text-sm', className)}>{message}</p>
  ) : null

export const inputStyles =
  'font-medium border-none border-b placeholder:text-tg-hint text-tg-text placeholder:font-medium focus-visible:ring-0 p-0'
