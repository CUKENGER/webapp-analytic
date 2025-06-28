import { cn } from '@/lib/utils'

export const CopyIcon = ({ className, onClick }: { className?: string, onClick?: () => void }) => {
	return (
		<svg className={cn('cursor-pointer', className)} onClick={onClick} width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="6" y="2" width="12" height="12" rx="2" stroke="#0080FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M14 14V16C14 17.1046 13.1046 18 12 18H4C2.89543 18 2 17.1046 2 16V8C2 6.89543 2.89543 6 4 6H6" stroke="#0080FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
		</svg>

	)
}