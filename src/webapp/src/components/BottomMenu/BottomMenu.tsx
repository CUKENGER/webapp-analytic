import { ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { cn } from '@/lib/utils'
import { AboutIcon } from '../icons/AboutIcon'
import { HelpIcon } from '../icons/HelpIcon'
import { InstructionsIcon } from '../icons/InstructionsIcon'
import { ProjectsIcon } from '../icons/ProjectsIcon'
import styles from './BottomMenu.module.css'

interface MenuItem {
  path: string
  label: string
  icon: ReactNode
  className?: string
}

export const BottomMenu = () => {
  const location = useLocation() // Получаем текущий путь
  const navigate = useNavigate() // Для перехода по маршрутам
  const [prevPath, setPrevPath] = useState<string | null>(null) // Хранение предыдущего пути
  const [lastProjectsPath, setLastProjectsPath] = useState<string>('/') // Последний путь в "Проекты"

  // Обновляем prevPath и lastProjectsPath при смене маршрута
  useEffect(() => {
    if (location.pathname !== prevPath) {
      setPrevPath(location.pathname)
      if (
        location.pathname === '/' ||
        location.pathname.startsWith('/projects')
      ) {
        setLastProjectsPath(location.pathname) // Сохраняем последний путь в разделе "Проекты"
      }
    }
  }, [location.pathname])

  // Список путей, где меню скрывается
  const HIDDEN_PATHS = [
    { path: '/direct/days', exact: true },
    { path: '/direct/campaigns', exact: true },
    { path: '/direct/audience', exact: true },
    { path: '/direct/links/days', exact: true },
    { path: '/projects/bot/:id/direct/days', exact: true },
    { path: '/projects/bot/:id/direct/campaigns', exact: true }
  ]

  const shouldHideMenu = HIDDEN_PATHS.some(({ path, exact }) => {
    if (path.includes(':id')) {
      const regex = new RegExp(`^${path.replace(':id', '[^/]+')}$`)
      return regex.test(location.pathname)
    }
    return exact
      ? location.pathname === path
      : location.pathname.startsWith(path)
  })

  const menuItems: MenuItem[] = [
    {
      path: '/',
      label: 'Проекты',
      icon: <ProjectsIcon />,
      className: 'rounded-tl-2xl'
    },
    { path: '/instructions', label: 'Инструкции', icon: <InstructionsIcon /> },
    { path: '/help', label: 'Помощь', icon: <HelpIcon /> },
    {
      path: '/about',
      label: 'О сервисе',
      icon: <AboutIcon />,
      className: 'rounded-tr-2xl'
    }
  ]

  const handleProjectsClick = () => {
    // Если мы не в разделе "Проекты" и есть сохраненный путь, возвращаемся туда
    if (
      location.pathname !== '/' &&
      !location.pathname.startsWith('/projects') &&
      lastProjectsPath !== '/'
    ) {
      navigate(lastProjectsPath)
    } else {
      // Если уже в "Проекты" или нет сохраненного пути, идем в корень
      navigate('/')
    }
  }

  // if (shouldHideMenu) {
  //   return null
  // }

  return (
    <div className="max-h-bottom-nav border-t border-bottom-menu-border bottom-menu-shadow fixed bottom-0 inset-x-0 bg-bottom-menu text-center py-2 px-4 z-20">
      <p className={styles.text}>Бета-версия приложения Телеграфикс</p>
    </div>
  )
}

interface BottomButtonProps {
  icon: ReactNode
  children: string
  className?: string
  active?: boolean
  onClick?: () => void
}

const BottomButton = ({
  icon,
  children,
  className,
  active = false,
  onClick
}: BottomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full h-full bg-bottom-menu text-gray flex flex-col items-center justify-center gap-1 hover:bg-bottom-button-hover',
        'active:bg-bottom-button-hover',
        className,
        active && 'text-white'
      )}
      aria-label={children}
      aria-current={active ? 'page' : undefined}
    >
      {icon}
      <span className="font-bold text-[10px] leading-[140%]">{children}</span>
    </button>
  )
}

