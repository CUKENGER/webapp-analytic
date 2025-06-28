import { ReactNode } from 'react'
import { UIInput, UIInputProps } from './UIInput'

interface PropTypes extends UIInputProps {
	footerLabel: string | ReactNode
}

export const UITextField = ({ footerLabel, ...rest }: PropTypes) => {
	return (
		<div className='w-full flex flex-col gap-2'>
			<UIInput
				{...rest}
			/>
			<p className='text-start text-sm text-gray leading-[1.4]'>
				{footerLabel}
			</p>
		</div>
	)
}
