import { cn } from '@/lib/utils'
import { HTMLAttributes, ReactNode } from 'react'

interface PropTypes extends HTMLAttributes<HTMLFormElement> {
	children?: ReactNode
	className?: string
}

export const FormPageLayout = ({ children, className, ...props }: PropTypes) => {
	return (
		<div className={cn('w-full bg-tg-background min-h-screen pt-10 flex flex-col justify-between', className)}>
			<form
				className="max-w-screen-main-screen flex flex-col flex-grow pb-0 w-full mx-auto px-4"
				{...props}
			>
				{children}
			</form>
		</div>
	)
}