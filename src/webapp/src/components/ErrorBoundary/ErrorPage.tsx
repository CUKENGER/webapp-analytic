import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Link, useRouteError } from 'react-router'
import { UIButton } from '../ui/UIButton'

// Тип пропсов
interface ErrorPageProps {
  error?: unknown
  reset?: () => void
}

// Получение сообщения об ошибке
function getErrorMessage(error: unknown): string {
  if (!error) return 'Неизвестная ошибка'
  if (error instanceof Error) return `${error.name}: ${error.message || 'Произошла ошибка'}`
  try {
    return String(error)
  } catch {
    return 'Не удалось обработать ошибку'
  }
}

// Форматирование ошибки для разработчиков
function formatErrorDetails(error: unknown): string {
  if (!error) return 'Нет данных об ошибке'
  if (error instanceof Error) {
    const message = `${error.name}: ${error.message}\n${error.stack || 'Нет стека вызовов'}`
    if ('componentStack' in error) {
      return `${message}\nComponent Stack:\n${(error as any).componentStack}`
    }
    return message
  }
  try {
    return JSON.stringify(error, null, 2)
  } catch {
    return 'Не удалось форматировать ошибку'
  }
}

// Очистка хранилища и перезагрузка
function handleResetStorage(reset?: () => void) {
  localStorage.clear()
  console.log('localStorage cleared by user')
  if (reset) reset()
  window.location.reload()
}

export function ErrorPage({ error: propError, reset }: ErrorPageProps) {
  const routeError = useRouteError()
  const error = propError ?? routeError // Предпочитаем propError, если передан, иначе routeError

  useEffect(() => {
    console.log('Error received in ErrorPage:', error)
    console.error('Error details:', error)
  }, [error])

  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-tg-background">
      <main className="min-h-svh bg-tg-bg-color flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-tg-secondary bg-opacity-50 p-8 rounded-2xl text-center space-y-6 border-tg-destructive border">
          <div>
            <AlertTriangle className="w-16 h-16 text-tg-destructive mx-auto" />
            <h1 className="text-3xl font-bold text-tg-text mb-2">Упс! Что-то не так</h1>
            <div className="overflow-auto max-h-96">
              <p className="text-tg-text">{getErrorMessage(error)}</p>
              {(import.meta.env.DEV) && (
                <details className="text-sm text-gray-400 mt-2">
                  <summary>Подробности ошибки</summary>
                  <pre className="mt-2 text-left overflow-x-auto whitespace-pre-wrap break-words">
                    {formatErrorDetails(error)}
                  </pre>
                </details>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Link to="/" className="text-white">
              <button className="w-full bg-tg-primary rounded-xl py-4">На главную</button>
            </Link>
            {reset && (
              <button
                className="w-full rounded-xl text-tg-text py-4"
                onClick={() => reset()}
              >
                Попробовать снова
              </button>
            )}
            <UIButton
              className="w-full rounded-xl text-tg-destructive py-4"
              onClick={() => handleResetStorage(reset)}
							variant='outline'
							colorText='red'
            >
              Перезагрузить
            </UIButton>
          </div>
        </div>
      </main>
    </div>
  )
}
