import { cn } from '@/lib/utils'
import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const inputVariants = cva(
	'flex w-full bg-transparent text-base transition-all duration-200 ease-in-out border border-transparent ' +
	'placeholder:text-gray disabled:cursor-not-allowed disabled:opacity-50 ' +
	'focus-visible:outline-none focus-visible:outline-gray' +
	'[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
	{
		variants: {
			variant: {
				default: 'bg-light-gray-back text-dark-gray-stroke ' +
					'hover:border-light-gray-stroke/80 focus-visible:ring-light-gray-stroke/50',
				primary: 'bg-tg-background text-tg-text border-tg-primary ' +
					'hover:border-light-gray-stroke/80 focus-visible:ring-light-gray-stroke/50',
				outline: 'bg-transparent text-tg-link border-[#EAEAED] dark:border-[#363e4e] ' +
					'hover:bg-[rgba(144,158,180,0.08)] focus-visible:ring-tg-link/50',
			},
			inputSize: { // Переименовали size на inputSize
				default: 'px-3 py-[7px]',
				sm: 'h-[32px] px-3 py-1',
				lg: 'h-[52px] px-5 py-3',
			},
			fontSize: {
				default: 'text-base',
				sm: 'text-sm',
				lg: 'text-lg',
				xs: 'text-xs',
			},
			rounded: {
				default: 'rounded-md',
				lg: 'rounded-lg',
				xl: 'rounded-xl',
				none: 'rounded-none',
			},
			shadow: {
				default: 'shadow-none',
				none: 'shadow-none',
			},
		},
		defaultVariants: {
			variant: 'default',
			inputSize: 'default', // Обновили имя варианта
			fontSize: 'default',
			rounded: 'default',
			shadow: 'default',
		},
	}
)

export interface UIInputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
	VariantProps<typeof inputVariants> {
	error?: boolean | string
}

const UIInput = React.forwardRef<HTMLInputElement, UIInputProps>(
	({ className, type, variant, inputSize, fontSize, rounded, shadow, error, ...props }, ref) => { // Обновили имя пропса
		return (
			<input
				type={type}
				className={cn(
					inputVariants({ variant, inputSize, fontSize, rounded, shadow }), // Обновили имя варианта
					error ? 'border border-tg-destructive focus-visible:ring-tg-destructive/50' : '',
					className
				)}
				ref={ref}
				{...props}
			/>
		)
	}
)

UIInput.displayName = 'UIInput'

export { UIInput }