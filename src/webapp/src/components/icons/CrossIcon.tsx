import { cn } from '@/lib/utils'


export const CrossIcon = ({ className, onClick }: { className?: string, onClick?: () => void }) => {
	return (
		<svg className={cn('transition-colors stroke-[#8F9EB5] hover:stroke-[#FF4000] active:stroke-[#FF4000]', className)} onClick={onClick} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6 16L16 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M6 6L16 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>
	)
}