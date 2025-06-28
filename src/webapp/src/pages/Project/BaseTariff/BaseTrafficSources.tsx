import { ProjectFull } from '@/api/types/projects.types'
import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockContentChevron, BlockContentSettings } from '@/components/@common/BlockContentChevron'
import { BlockItem } from '@/components/@common/BlockItem'
import { useNavigate } from 'react-router'

interface PropTypes {
	landingUrl: string | null
	direct?: string
	metrica?: string
}

export const BaseTrafficSources = ({ landingUrl, direct, metrica }: PropTypes) => {

	const navigate = useNavigate()

	return (
		<BlockContainer
			title="Источники трафика"
			divideClassName="my-0"
			childrenClassName=""
			needBorder
		>
			<BlockItem className="justify-between">
				{landingUrl && (
					<BlockContentChevron
						param="Лендинг"
						value={landingUrl}
						needIcon
						needCursorPointer={true}
						disabled={false}
						onClick={() => navigate(`landing`)}
					/>
				)}
			</BlockItem>
			<BlockItem className="justify-between">
				{direct
					? (
						<BlockContentSettings
							param="Директ"
							value={`${direct}@yandex.ru`}
							disabled={false}
							onClick={() => navigate(`direct`)}
							reloadIcon
						/>
					)
					: (
						<BlockContentSettings
							param="Директ"
							customValue={
								<span className='text-tg-link font-bold cursor-pointer' onClick={() => navigate(`direct`)}>
									Подключить
								</span>
							}
							disabled
						/>
					)
				}
			</BlockItem>
			<BlockItem>
				<BlockContentChevron
					param="Метрика"
					value={metrica}
					needCursorPointer={false}
					disabled={false}
				/>
			</BlockItem>
		</BlockContainer>
	)
}