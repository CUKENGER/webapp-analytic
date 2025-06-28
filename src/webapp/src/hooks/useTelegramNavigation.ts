import { backButton } from '@telegram-apps/sdk-react'
import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'

export const useTelegramNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [navigationStack, setNavigationStack] = useState<string[]>(['/'])
  const [isBackPressed, setIsBackPressed] = useState(false)
  const [searchParams] = useSearchParams()

  // const handleBack = useCallback(() => {
  //   setIsBackPressed(true)
  //   setNavigationStack(prev => {
  //     if (prev.length <= 1) return prev
  //     const newStack = prev.slice(0, -1)
  //     const previousPath = newStack[newStack.length - 1]
  //     navigate({ pathname: previousPath, search: searchParams.toString() })
  //     return newStack
  //   })
  // }, [navigate, searchParams])

  const handleBack = useCallback(() => {
    if (navigationStack.length > 1) {
      window.history.back() // Передаем управление браузеру
    }
  }, [navigationStack]);

  useEffect(() => {

    const currentPath = location.pathname;

    if (navigationStack[navigationStack.length - 1] !== currentPath) {
      setNavigationStack(prev => [...prev.filter(p => p !== currentPath), currentPath])
    }

    // if (
    //   !isBackPressed &&
    //   navigationStack[navigationStack.length - 1] !== currentPath
    // ) {
    //   setNavigationStack(prev => {
    //     return [...prev.filter(p => p !== currentPath), currentPath]
    //   })
    // }

    if (backButton) {
      backButton.offClick(handleBack)
      if (currentPath === '/' || navigationStack.length <= 1) {
        backButton.hide()
      } else {
        backButton.show()
        backButton.onClick(handleBack)
      }
    }

    if (isBackPressed) {
      setIsBackPressed(false)
    }

    // if (backButton) {
    //   backButton.offClick(handleBack)
    //   if (currentPath === '/' || navigationStack.length <= 1) {
    //     backButton.hide()
    //   } else {
    //     backButton.show()
    //     backButton.onClick(handleBack)
    //   }
    // }

    return () => {
      if (backButton) {
        backButton.offClick(handleBack)
        backButton.hide()
      }
    }
  }, [location, navigationStack, handleBack, isBackPressed])

  return { navigationStack }
}

