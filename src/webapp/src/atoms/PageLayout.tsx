import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PropTypes {
	children?: ReactNode
	className?: string
}

export const PageLayout = ({ children, className }: PropTypes) => {
	return (
		<div className={cn('w-full bg-tg-background min-h-screen pt-10 flex flex-col justify-between', className)}>
			<div className="max-w-screen-main-screen flex flex-col flex-grow pb-0 w-full mx-auto px-4">
				{children}
			</div>
		</div>
	)
}