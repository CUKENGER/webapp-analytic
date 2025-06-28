import { BlockContainer } from '@/components/@common/BlockContainer'
import { SectionTitle } from '@/components/@common/SectionTitle'
import { UITextareaField } from '@/components/ui/UITextareaField'
import { UITextFieldNotice } from '@/components/ui/UITextFieldNotice'
import { Control, Controller, RegisterOptions } from 'react-hook-form'
import { SmartButtonFormData } from './SmartButtonControl'

interface PropTypes {
	name: keyof SmartButtonFormData
	control: Control<SmartButtonFormData>
	trigger: (name: keyof SmartButtonFormData) => Promise<boolean>
	title: string
	placeholder: string
	footerLabel: string | JSX.Element
	rules?: RegisterOptions<SmartButtonFormData, keyof SmartButtonFormData>
	isTextarea?: boolean
}

export const FormField = ({
	name,
	control,
	trigger,
	title,
	placeholder,
	footerLabel,
	rules,
	isTextarea = false,
}: PropTypes) => {

	const FieldComponent = isTextarea ? UITextareaField : UITextFieldNotice

	return (
		<BlockContainer className="mt-0 px-0" itemClassName='pl-0'>
			<SectionTitle title={title} />
			<div className="py-3 px-4">
				<Controller
					name={name}
					control={control}
					rules={rules}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<FieldComponent
							placeholder={placeholder}
							footerLabel={footerLabel}
							value={value}
							onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
								onChange(e)
								trigger(name)
							}}
							error={!!error?.message}
							noticeText={error?.message}
						/>
					)}
				/>
			</div>
		</BlockContainer>
	)
}