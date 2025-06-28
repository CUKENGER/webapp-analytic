import { cn } from "@/lib/utils"
import { Children, isValidElement, ReactNode } from "react"

// Вспомогательные компоненты для разметки
export const ButtonImage = ({ children }: { children: ReactNode }) => <>{children}</>
export const ButtonIcon = ({ children }: { children: ReactNode }) => <>{children}</>
export const ButtonFooter = ({ children }: { children: ReactNode }) => <>{children}</>

interface PropTypes {
  onClick?: () => void
	children: ReactNode
  name: string
  mainContainerClassName?: string
  footerClassName?: string
}

export const ButtonCard = ({onClick, children, name, footerClassName, mainContainerClassName}: PropTypes) => {
  
	let image: ReactNode = null
	let icon: ReactNode = null
	let footer: ReactNode = null

	Children.forEach(children, (child) => {
		if (isValidElement(child)) {
			if (child.type === ButtonImage) {
				image = child.props.children
			} else if (child.type === ButtonIcon) {
				icon = child.props.children
			} else if (child.type === ButtonFooter) {
				footer = child.props.children
			}
		}
	})

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 bg-tg-background rounded-2xl card-shadow-default cursor-default"
    >
      <div className={cn("flex gap-2 w-[92%]", mainContainerClassName)}>
        {image}
        <div className={cn("flee flex-col gap-1 text-start min-w-[60%] text-tg-text", footerClassName)}>
          <p className="text-base font-bold truncate">{name}</p>
          {footer}
        </div>
      </div>
      {icon}
    </button>
  )
}
