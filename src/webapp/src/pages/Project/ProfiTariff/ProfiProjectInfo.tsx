import { BlockTitle } from '@/components/@common/BlockTitle'
import { formatEpochToCountDays } from '@/components/utils/formatEpochToCountDays'
import { useNavigate } from 'react-router'
import { TariffButton } from '../TariffButton'
import { ProjectFull } from '@/api/types/projects.types'
import { ProfiTrafficSources } from './ProfiTrafficSources'
import { ProfiProjectSettings } from './ProfiProjectSettings'

interface PropTypes {
	project: ProjectFull
	isClose?: boolean
}

export const ProfiProjectInfo = ({ project, isClose }: PropTypes) => {

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
					<ProfiTrafficSources
						direct={project?.yaLoginInfo}
						landingUrl={landingUrl}
						metrica={project?.yaCounterID}
					/>
					<ProfiProjectSettings
						project={project}
						isClose={isClose}
					/>
				</>
			)}
		</div>
	)
}