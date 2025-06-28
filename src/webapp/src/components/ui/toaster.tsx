import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast"
import { CrossIcon } from '../icons/CrossIcon'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className='cursor-pointer'>
            <div className="grid gap-1">
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <button
              onClick={() => dismiss(id)}
              className="cursor-pointer" // Добавляем минимальные стили для кликабельности
              aria-label="Close" // Для доступности
            >
              <CrossIcon />
            </button>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
