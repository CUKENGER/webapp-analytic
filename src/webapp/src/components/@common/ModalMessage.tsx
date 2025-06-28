import { ReactNode } from 'react'
import { UIButton } from '../ui/UIButton'

interface PropTypes {
	children: ReactNode,
	typeButton?: "button" | "submit" | "reset",
	onClick?: () => void,
	title: string
	footer?: ReactNode
}

export const ModalMessage = ({ children, onClick, title, typeButton = 'button', footer }: PropTypes) => {
	return (
		<div>
			<div className="border-b border-gray-stroke text-start">
				<p className="text-base font-bold px-4 py-3 text-tg-text">{title}</p>
			</div>
			<div className="text-start border-b border-gray-stroke">
				<div className="px-4 py-3 text-tg-text">
					{children}
				</div>
			</div>
			<div className="px-4 py-3 bottom-bar-shadow">
				{footer ? footer : (
					<UIButton
						onClick={onClick}
						className="h-[38px]"
						variant="primary"
						shadow="none"
						fontSize="sm"
						rounded="lg"
						size="sm"
						position="center"
						type={typeButton}
					>
						Понятно
					</UIButton>
				)}
			</div>
		</div>
	)
}
