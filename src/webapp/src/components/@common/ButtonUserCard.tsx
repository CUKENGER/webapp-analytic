import avatar_icon from '@/assets/avatar.svg'
import { CrossIcon } from '../icons/CrossIcon'
import { ReactNode } from 'react'
import '@/pages/Projects/Projects.style.css';

interface PropTypes {
	name: string
	children: ReactNode
	onClick?: () => void
	onCrossClick: () => void
}

export const ButtonUserCard = ({ name, children, onClick, onCrossClick }: PropTypes) => {
	return (
		<button onClick={onClick} className="flex items-center justify-between w-full p-4 bg-tg-background rounded-2xl card-shadow-default cursor-default ProjectItemListButton">
			<div className="flex gap-2 w-[92%]">
				<div className="flex items-center justify-center rounded-lg size-14 aspect-square">
					<img src={avatar_icon} className="text-tg-primary-text object-cover rounded-lg" />
				</div>
				<div className="flex flex-col gap-1 text-start min-w-[60%] text-tg-text">
					<p className="text-base font-bold truncate">{name}</p>
					<p className="flex items-center gap-1 text-sm whitespace-nowrap">
						<span className="truncate text-sm font-medium">
							Доступ выдан:{' '} {children}
						</span>
					</p>
				</div>
			</div>
			<div className="flex items-center justify-center">
				<CrossIcon onClick={onCrossClick} className="flex-shrink-0 cursor-pointer" />
			</div>
		</button>
	)
}