import { useEffect, useState } from 'react'
import { on, postEvent, isThemeParamsDark, isColorDark } from '@telegram-apps/sdk-react'
import { useTheme } from '@/components/theme-provider'

// Функция для преобразования HEX в RGB
function hexToRgb(hex: string): string | null {
  const cleanHex = hex.replace('#', '')
  const bigint = parseInt(cleanHex, 16)
  if (isNaN(bigint)) return null // Проверка на некорректный HEX

  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgb(${r}, ${g}, ${b})`
}

export const useTelegramTheme = (isTelegram: boolean) => {
  const { theme, setTheme } = useTheme()
  const [manualOverride, setManualOverride] = useState(false)

  useEffect(() => {
    if (isTelegram) {
      console.log('isThemeParamsDark prod', isThemeParamsDark())
      const newTheme = isThemeParamsDark() ? 'dark' : 'light'
      if (theme !== newTheme && !manualOverride) {
        setTheme(newTheme)
      }

      const unsubscribe = on('theme_changed', (payload) => {
        console.log('payload theme_changed', payload)
        const cleanColor = payload.theme_params.bg_color?.replace('#', '')
        console.log('themeChanged', payload)
        console.log('newTheme', newTheme)
        if (cleanColor) {
          const rgbColor = hexToRgb(cleanColor)
          console.log('rgbColor', rgbColor);
          const newTheme = rgbColor && isColorDark(rgbColor) ? 'dark' : 'light'
          console.log('themeChanged', payload)
          console.log('newTheme', newTheme)
          if (!manualOverride) {
            setTheme(newTheme)
          }
        }
      })

      postEvent('web_app_request_theme')

      return () => {
        unsubscribe()
      }
    } else {
      // Браузер: используем системную тему
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      console.log('system theme', systemTheme)
      if (theme !== systemTheme && !manualOverride) {
        setTheme(systemTheme)
      }
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleSystemThemeChange = () => {
        const newTheme = mediaQuery.matches ? 'dark' : 'light'
        if (!manualOverride) {
          setTheme(newTheme)
        }
      }

      handleSystemThemeChange() // Устанавливаем тему сразу
      mediaQuery.addEventListener('change', handleSystemThemeChange)

      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      }
    }
  }, [isTelegram, manualOverride, setTheme, theme])

  return {
    theme,
    setManualOverride
  }
}
