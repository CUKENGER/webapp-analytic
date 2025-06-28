import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import { useLaunchParams } from '@telegram-apps/sdk-react'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { useTheme } from '@/components/theme-provider'
import { useTelegramNavigation } from '@/hooks/useTelegramNavigation'
import { useTelegramSettings } from '@/hooks/useTelegramSettings'
import { useTelegramTheme } from '@/hooks/useTelegramTheme'
import { CustomLoader } from './@common/CustomLoader'
import { BottomMenu } from './BottomMenu/BottomMenu'
import { Toaster } from './ui/toaster'

export const App = () => {
  const launchParams = useLaunchParams()
  const isTelegram = !!launchParams

  const [isLoading, setIsLoading] = useState(true)

  const { theme, setManualOverride } = useTelegramTheme(isTelegram)
  const { initTelegram } = useTelegramSettings(isTelegram, theme)
  useTelegramNavigation()

  useEffect(() => {
    let isMounted = true

    initTelegram().then(() => {
      if (isMounted) setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [initTelegram])

  if (isLoading) return <CustomLoader />

  if (!isTelegram) {
    return (
      <div>
        Вам нужно быть авторизованным в Telegram чтобы использовать это
        приложение.
      </div>
    )
  }

  return (
    <AppRoot appearance={theme === 'dark' ? 'dark' : 'light'}>
      {/* <ThemeToggleButton setManualOverride={setManualOverride} /> */}
      <Outlet />
      <Toaster />
      <BottomMenu />
    </AppRoot>
  )
}

export const ThemeToggleButton = ({
  setManualOverride
}: {
  setManualOverride: (e: boolean) => void
}) => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setManualOverride(true)
    setTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="absolute top-10 right-10 px-4 py-2 rounded-lg transition-colors"
      style={{
        backgroundColor: theme === 'dark' ? '#333' : '#eee',
        color: theme === 'dark' ? '#fff' : '#000'
      }}
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
