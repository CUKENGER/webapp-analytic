import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { SectionContainer } from '../TariffControl/TariffItem'
import { UIButton } from '@/components/ui/UIButton'
import { useNavigate, useParams } from 'react-router'
import { PageLayout } from '@/atoms/PageLayout'
import { PATHS } from '@/components/utils/paths'
import { OperationResultState } from '../OperationResult/OperationResult'

const DirectControl = () => {

	const navigate = useNavigate()
	const { id } = useParams()

	const steps = [
		'Откройте браузер и войдите в ваш аккаунт Яндекс;',
		'Нажмите «Авторизоваться»;',
		'Перейдите в браузер и подтвердите авторизацию.',
	]

	const handleRedirect = () => {
		const state: OperationResultState = {
			content: {
				text: 'Вы подключили Яндекс Директ. А мы уже создали в нем Яндекс Метрику и установили цели.'
			},
			notice: {
				text: 'Подробное руководство по настройке сервиса вы можете найти в',
				link: {
					text: 'инструкциях',
					url: 'https://mbel.notion.site/help-telegraphyx',
					suffix: '.'
				},
			},
			button: {
				text: 'Продолжить',
				redirectPath: PATHS.projects.project(id ?? '/')
			}
		}
		navigate('/result', {state})
	}

	return (
		<PageLayout className='bg-tg-secondary'>
			<BlockTitle title='Подключение Директа'>
				Авторизуйтесь в <span className='text-dark-gray-stroke'>главном аккаунте Яндекса</span>, где будет запускаться реклама.
			</BlockTitle>
			<BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
				<SectionContainer hasBorder={false}>
					<div className='py-3 px-4'>
						<p className='font-bold text-start text-tg-text leading-[1.4]'>Инструкция по подключнению:</p>
					</div>
				</SectionContainer>
				<SectionContainer hasBorder={false}>
					<div className='py-3 text-tg-text px-4'>
						<ul className='text-start text-sm leading-[1.4] list-decimal pl-4 space-y-2'>
							{steps.map((step, index) => (
								<li key={index}>{step}</li>
							))}
						</ul>
					</div>
				</SectionContainer>
				<SectionContainer hasBorder={false}>
					<div className='px-4 pb-4 py-3'>
						<UIButton
							variant="primary"
							onClick={handleRedirect}
						>
							Авторизоваться
						</UIButton>
					</div>
				</SectionContainer>
			</BlockContainer>
		</PageLayout>
	)
}

export default DirectControl
