import { Children, isValidElement, ReactNode } from 'react'

// Вспомогательные компоненты для разметки
export const ModalHeader = ({ children }: { children: ReactNode }) => <>{children}</>
export const ModalMain = ({ children }: { children: ReactNode }) => <>{children}</>
export const ModalFooter = ({ children }: { children: ReactNode }) => <>{children}</>

interface PropTypes {
	children: ReactNode
}

export const ModalContent = ({ children }: PropTypes) => {

	// Разделяем children по типам
	let header: ReactNode = null
	let main: ReactNode = null
	let footer: ReactNode = null

	Children.forEach(children, (child) => {
		if (isValidElement(child)) {
			if (child.type === ModalHeader) {
				header = child.props.children
			} else if (child.type === ModalMain) {
				main = child.props.children
			} else if (child.type === ModalFooter) {
				footer = child.props.children
			}
		}
	})

	return (
		<div>
			<div className="border-b border-gray-stroke text-start">
				<div className="text-base font-bold px-4 py-3 text-tg-text">
					{header}
				</div>
			</div>
			<div className="text-start border-b border-gray-stroke">
				<div className="px-4 py-3 text-tg-text">
					{main}
				</div>
			</div>
			<div className="px-4 py-3 flex w-full gap-2 bottom-bar-shadow">
				{footer}
			</div>
		</div>
	)
}