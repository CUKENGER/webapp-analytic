import { RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary'
import { ErrorPage } from './ErrorBoundary/ErrorPage'
import { Suspense, useEffect, useState, type FC } from 'react'
import { isTMA } from '@telegram-apps/sdk'
import { CustomLoader } from './@common/CustomLoader'
import { NotInTelegram } from './NotInTelegram'
import { router } from './router'

const queryClient = new QueryClient()

async function checkIsTelegram() {
  const result = await isTMA()
  return result
}

export const Root: FC = () => {
  const [isTelegram, setIsTelegram] = useState<boolean | null>(null)

  useEffect(() => {
    async function verifyTelegram() {
      const result = await checkIsTelegram()
      setIsTelegram(result)
    }
    verifyTelegram()
  }, [])

  if (isTelegram === null) {
    return <CustomLoader /> // Пока проверка не завершена, показываем лоадер
  }

  if (!isTelegram) {
    return <NotInTelegram /> // Показываем окно вместо ошибки
  }

  return (
    <ErrorBoundary fallback={ErrorPage}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<CustomLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
