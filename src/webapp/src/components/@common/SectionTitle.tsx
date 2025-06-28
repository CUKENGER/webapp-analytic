import { cn } from '@/lib/utils'
import { SectionContainer } from '@/pages/TariffControl/TariffItem'
import { ReactNode } from 'react'

export const SectionTitle = ({title, needColon=true, className}: {title: string | ReactNode, needColon?: boolean, className?: string}) => {
	return (
		<SectionContainer hasBorder={false} className=''>
			<p className={cn('text-start text-tg-text font-bold py-[11px] px-4 leading-[1.4]', className)}>{title}{needColon && `:`}</p>
		</SectionContainer>	
	)
}
