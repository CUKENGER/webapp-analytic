import { UIButton } from '@/components/ui/UIButton'

interface PropTypes {
	icon: string
	children: string
	onClick?: () => void
}

export const AddProjectBtn = ({ icon, children, onClick }: PropTypes) => {
	return (
		<UIButton
			className="min-w-[75px] h-[77px] flex flex-col items-center gap-2"
			variant='primary'
			fontSize='xs'
			onClick={onClick}
		>
			<img src={icon} className="w-[28px] h-[24px] object-cover" />
			<span className="font-bold text-xs text-white">{children}</span>
		</UIButton>
	)
}
