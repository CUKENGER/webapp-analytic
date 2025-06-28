import React, {
  isValidElement,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MyDropdownMenuProps {
  title?: string
  count?: number | string
  icon?: React.ReactNode | ((isOpen: boolean) => React.ReactNode)
  children: React.ReactNode
  content?: React.ReactNode
  containerClassName?: string
  className?: string
  onClose?: () => void
  isOpen?: boolean
  onOpenChange?: (value: boolean) => void
  placement?: 'center' | 'bottom'
  trigger?: React.ReactNode
}

function MyDropdownMenu({
  title,
  count,
  icon,
  children,
  content,
  containerClassName,
  className,
  onClose,
  isOpen: externalIsOpen,
  onOpenChange,
  placement = 'bottom',
  trigger
}: MyDropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const menuContentRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(externalIsOpen ?? false)

  // Синхронизация с внешним состоянием
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
    }
  }, [externalIsOpen])

  // Оптимизированная блокировка скролла
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty(
      '--scrollbar-width',
      `${scrollbarWidth}px`
    )

    if (isOpen) {
      document.body.classList.add('menu-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }

    return () => {
      document.body.classList.remove('menu-open')
      document.documentElement.style.setProperty('--scrollbar-width', '0px')
    }
  }, [isOpen])

  // Обработка кликов вне меню для закрытия
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Закрытие меню при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, onOpenChange])

  // Оптимизированная анимация
  const getMenuTransform = useCallback(() => {
    if (placement === 'bottom' && menuContentRef.current) {
      const rect = menuContentRef.current.getBoundingClientRect()
      return `translateY(${window.innerHeight - rect.top}px)`
    }
    return 'translateY(100%)'
  }, [placement])

  const toggleMenu = useCallback(() => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    if (onOpenChange) onOpenChange(newIsOpen)
  }, [isOpen, onOpenChange])

  // Закрытие меню
  const closeMenu = useCallback(() => {
    setIsOpen(false)
    if (onClose) onClose()
    if (onOpenChange) onOpenChange(false) // Уведомляем родителя
  }, [onClose, onOpenChange])

  const renderedIcon = typeof icon === 'function' ? icon(isOpen) : icon

  // Добавляем обработчик toggleMenu к триггеру
  const triggerWithHandler = isValidElement(trigger)
    ? React.cloneElement(trigger as ReactElement, {
      onClick: toggleMenu
    })
    : trigger

  return (
    <div className={cn('relative', containerClassName)} ref={menuRef}>
      {/* Триггер рендерится напрямую */}
      {triggerWithHandler}
      {/* Триггер */}
      <button
        className={cn(
          'flex flex-col w-full gap-0.5 p-4 bg-tg-background rounded-2xl text-tg-text',
          className
        )}
        type="button"
        onClick={toggleMenu}
      >
        {title && <p className="text-left">{title}</p>}
        <div className="flex items-center justify-between w-full gap-2">
          <div className="overflow-hidden font-bold max-w-[80%] text-ellipsis whitespace-nowrap truncate">
            {content}
          </div>
          <div className="flex items-center gap-1.5">
            {count && (
              <div className="flex items-center justify-center w-6 h-6 text-sm font-bold text-center rounded-sm text-tg-primary-text bg-tg-accent">
                {count}
              </div>
            )}
            {renderedIcon}
          </div>
        </div>
      </button>

      {placement === 'bottom' ? (
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 max-w-[480px] mx-auto bg-tg-background rounded-t-2xl shadow-lg',
            'transform-gpu', // Добавляем transition
            'transition-[transform,opacity] duration-300 modal-transition',
            isOpen ? 'translate-y-0 opacity-100' : 'opacity-0' // Состояния для transform и opacity
          )}
          style={{
            transform: isOpen ? 'translateY(0)' : getMenuTransform()
          }}
        >
          {isValidElement(children)
            ? React.cloneElement(children as ReactElement, {
              onClose: closeMenu
            })
            : children}
        </div>
      ) : (
        <div
          className={cn(
            'fixed bottom-1/2 transform-translate-1/2 left-0 right-0 z-50 max-w-xl',
            `mx-auto sm:max-w-3xl lg:max-w-7xl bg-tg-background rounded-2xl shadow-lg`,
            'transition-opacity duration-300 ease-out',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {isValidElement(children)
            ? React.cloneElement(children as ReactElement, {
              onClose: closeMenu
            })
            : children}
        </div>
      )}

      {/* Оверлей - используем портал для рендеринга вне DOM-дерева */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 custom-overlay"
          style={{
            animation: 'fadeIn 0.2s ease-out forwards',
            animationFillMode: 'forwards'
          }}
          onClick={closeMenu}
        />
      )}
    </div>
  )
}

function ChevronDropdownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <ChevronDownIcon
      className={`transition-transform text-tg-primary duration-300 chevron-transition ${isOpen ? 'rotate-180' : ''}`}
      aria-hidden
      width={20}
      height={20}
    />
  )
}

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleFadeIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes scaleFadeOut {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(0.95);
      opacity: 0;
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
  }
  .animate-fade-out {
    animation: fadeOut 0.2s ease-in forwards;
  }
  .animate-scale-fade-in {
    animation: scaleFadeIn 0.2s ease-out forwards;
  }
  .animate-scale-fade-out {
    animation: scaleFadeOut 0.2s ease-out forwards;
  }
  .transform-gpu {
    transform: translateZ(0);
  }
  .transition-[transform,opacity] {
    transition-property: transform, opacity;
  }
`

export { ChevronDropdownIcon, MyDropdownMenu }

// Добавьте стили в ваш проект (например, в глобальный CSS или через styled-components)
const styleSheet = document.createElement('style')
styleSheet.textContent = styles
document.head.appendChild(styleSheet)
