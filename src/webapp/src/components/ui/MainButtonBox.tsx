import { ReactNode } from 'react'
import { UIButton, UIButtonProps } from './UIButton'
import { cn } from '@/lib/utils'

interface PropTypes extends UIButtonProps {
	onClick?: () => void
	children: ReactNode
	big?: boolean
}

export const MainButtonBox = ({ children, onClick, big = false, ...rest }: PropTypes) => {
	return (
		<div className="px-6 mt-auto pt-10">
			<div className={cn(
				"button-container pb-padding-bottom-nav",
				big ? "button-xl-container" : 'button-container'
			)}>
				<UIButton
					variant="primary"
					className='h-[56px]'
					onClick={onClick}
					{...rest}
				>
					{children}
				</UIButton>
			</div>
		</div>
	)
}
