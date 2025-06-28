import { useEffect, useCallback, useState } from "react"

export const useMyDropdownMenu = ({
  externalIsOpen,
  menuRef,
  placement,
  menuContentRef,
  onOpenChange,
  onClose,
}: {
  externalIsOpen?: boolean
  menuRef: React.RefObject<HTMLDivElement>
  placement: "bottom" | "center"
  menuContentRef: React.RefObject<HTMLDivElement>
  onClose?: () => void
  onOpenChange?: (value: boolean) => void
}) => {
  const [isOpen, setIsOpen] = useState(externalIsOpen ?? false)
  const [menuHeight, setMenuHeight] = useState(0)

  // Мемоизация закрытия меню
  const closeMenu = useCallback(() => {
    setIsOpen(false)
    onClose?.()
    onOpenChange?.(false)
  }, [onClose, onOpenChange])

  // Синхронизация с externalIsOpen
  useEffect(() => {
    if (externalIsOpen !== undefined && externalIsOpen !== isOpen) {
      setIsOpen(externalIsOpen)
    }
  }, [externalIsOpen, isOpen])

  const updateMenuHeight = useCallback(() => {
    if (menuContentRef.current) {
      setMenuHeight(menuContentRef.current.getBoundingClientRect().height)
    }
  }, [menuContentRef])

  useEffect(() => {
    if (isOpen) {
      updateMenuHeight()
    }
  }, [isOpen, updateMenuHeight])

  // Управление скроллом и шириной скроллбара
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`)
      document.body.style.overflow = "hidden"
      document.body.classList.add("menu-open")
    }

    return () => {
      document.body.style.overflow = ""
      document.body.classList.remove("menu-open")
      document.documentElement.style.setProperty("--scrollbar-width", "0px")
    }
  }, [isOpen])

  // Обработчики событий (вне меню и Escape)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu()
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, closeMenu, menuRef])

  // Мемоизация трансформации
  const getMenuTransform = useCallback(() => {
    if (placement === 'bottom') {
      return `translateY(${menuHeight}px)`
    }
    return 'translateY(100%)'
  }, [placement, menuHeight])

  // Переключение меню
  const toggleMenu = useCallback(() => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    onOpenChange?.(newIsOpen)
  }, [isOpen, onOpenChange])

  return { isOpen, toggleMenu, getMenuTransform, closeMenu }
}