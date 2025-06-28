import { cn } from '@/lib/utils'

export const InfoIcon = ({ className, onClick }: { className?: string, onClick?: () => void }) => {

	return (
		<svg
			className={cn(
				'cursor-pointer fill-[#0080FF]/10 hover:fill-[#0080FF] transition-colors duration-200 group', // Фон и hover
				className
			)}
			onClick={onClick}
			width="22"
			height="22"
			viewBox="0 0 22 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="11" cy="11" r="11" /> {/* Фон через класс SVG */}
			<circle
				cx="11"
				cy="16.2"
				r="1.2"
				className="fill-[#0080FF] group-hover:fill-white group-hover:stroke-white" // Цвет и обводка при hover
			/>
			<path
				d="M8 9C8 7.34315 9.34315 6 11 6C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12V13"
				className="stroke-[#0080FF] group-hover:stroke-white" // Цвет линии при hover
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}


const lightInfoIcon = () => (
	<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="11" cy="11" r="11" fill="#0080FF" fill-opacity="0.08" />
		<circle cx="11" cy="16.2" r="1.2" fill="#0080FF" />
		<path d="M8 9C8 7.34315 9.34315 6 11 6C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12V13" stroke="#0080FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
	</svg>
)

const lightHoverInfoIcon = () => {
	return (
		<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="11" cy="11" r="11" fill="#0080FF" />
			<circle cx="11" cy="16.2" r="0.6" fill="white" stroke="white" stroke-width="1.2" />
			<path d="M8 9C8 7.34315 9.34315 6 11 6C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12V13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
		</svg>

	)
}