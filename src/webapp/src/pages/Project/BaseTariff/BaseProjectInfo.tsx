import { BlockTitle } from '@/components/@common/BlockTitle'
import { formatEpochToCountDays } from '@/components/utils/formatEpochToCountDays'
import { useNavigate } from 'react-router'
import { TariffButton } from '../TariffButton'
import { ProjectFull } from '@/api/types/projects.types'
import { Notice } from '@/components/@common/Notice'
import { BaseTrafficSources } from './BaseTrafficSources'
import { BaseProjectSettings } from './BaseProjectSettings'

interface PropTypes {
	project: ProjectFull
	isClose?: boolean
}

export const BaseProjectInfo = ({ project, isClose }: PropTypes) => {

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
					<TariffButton
						paidUntil={paidUntil}
						tariff={project?.tariff ?? ''}
						onClick={() => navigate(`tariff`)}
					/>
					<BaseTrafficSources
						direct={project?.yaLoginInfo}
						landingUrl={landingUrl}
						metrica={project?.yaCounterID}
					/>
					<BaseProjectSettings
						project={project}
						isClose={isClose}
					/>
				</>
			)}
		</div>
	)
}