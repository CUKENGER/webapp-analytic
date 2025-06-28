import { BlockTitle } from './BlockTitle'
import duck2x from '@/assets/duck_congratulations_2x.webp'
import duck3x from '@/assets/duck_congratulations_3x.webp'
import duck4x from '@/assets/duck_congratulations_4x.webp'
import { ReactNode } from 'react'
import { Notice } from './Notice'
import { PageLayout } from '@/atoms/PageLayout'
import { MainButtonBox } from '../ui/MainButtonBox'

interface PropTypes {
	children: ReactNode
	noticeText?: ReactNode
	onClick?: () => void
	btnText?: string
}

export const SuccessPage = ({
	children,
	noticeText = "Подробное руководство по настройке сервиса вы можете найти в инструкциях.",
	onClick,
	btnText = "Продолжить"
}: PropTypes) => {
	return (
		<PageLayout className='bg-tg-secondary'>
			<div className='flex w-full flex-col gap-4'>
				<BlockTitle title='Поздравляем!' className='mb-0'>
				</BlockTitle>
				<div className='bg-tg-background p-4 pb-3 rounded-2xl'>
					<div className='w-full h-[140px] flex justify-center items-center'>
						<picture>
							<source
								srcSet={`${duck3x} 1x, ${duck4x} 2x`}
								type="image/webp"
							/>
							<img
								src={duck2x}
								alt="Поздравляем!"
								loading="lazy"
								className='w-full h-[140px] object-cover rounded-lg'
							/>
						</picture>
					</div>
					<div className='pt-3 leading-[1.4]'>
						{children}
					</div>
				</div>
				<Notice>
					{noticeText}
				</Notice>
			</div>
			<MainButtonBox onClick={onClick}>
				{btnText}
			</MainButtonBox>
		</PageLayout>
	)
}