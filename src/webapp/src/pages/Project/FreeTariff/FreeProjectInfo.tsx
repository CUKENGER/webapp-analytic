import { BlockTitle } from '@/components/@common/BlockTitle'
import { formatEpochToCountDays } from '@/components/utils/formatEpochToCountDays'
import { useNavigate } from 'react-router'
import { TariffButton } from '../TariffButton'
import { ProjectFull } from '@/api/types/projects.types'
import { Notice } from '@/components/@common/Notice'
import { FreeTrafficSources } from './FreeTrafficSources'
import { FreeProjectSettings } from './FreeProjectSettings'

interface PropTypes {
	project: ProjectFull
	isClose: boolean
}

export const FreeProjectInfo = ({ project, isClose }: PropTypes) => {

	const paidUntil = formatEpochToCountDays(project?.paidUntilEpoch)
	const navigate = useNavigate()

	const landingUrl = project?.folderName
		? `tgryx.ru/${encodeURIComponent(project.folderName)}`
		: null

	return (
		<div className="gap-4 flex flex-col">
			{project && (
				<>
					<BlockTitle title={project?.tgTitle ?? ''} className="mb-0">
						{isClose ? "Частный канал" : 'Публичный канал'}
					</BlockTitle>
					<Notice>
						У вас бесплатный тариф. Оплатите тариф и откройте функции сервиса.
					</Notice>
					<TariffButton
						paidUntil={paidUntil}
						tariff={project?.tariff ?? ''}
						onClick={() => navigate(`tariff`)}
					/>
					<FreeTrafficSources
						direct={project?.yaLoginInfo}
						landingUrl={landingUrl}
						metrica={project?.yaCounterID}
					/>
					<FreeProjectSettings
						project={project}
						isClose={isClose}
					/>
				</>
			)}
		</div>
	)
}
