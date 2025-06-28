import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockContentChevron, BlockContentSettings } from '@/components/@common/BlockContentChevron'
import { BlockItem } from '@/components/@common/BlockItem'
import { useNavigate } from 'react-router'

interface PropTypes {
	landingUrl: string | null
	direct?: string
	metrica?: string
}

export const FreeTrafficSources = ({ landingUrl, direct, metrica }: PropTypes) => {

	const navigate = useNavigate()

	return (
		<BlockContainer
			title="Источники трафика"
			divideClassName="my-0"
			needBorder
		>
			<BlockItem className="justify-between">
				{landingUrl
					? (
						<BlockContentChevron
							param="Лендинг"
							value={landingUrl}
							needIcon
							needCursorPointer={true}
							onClick={() => navigate(`landing`)}
						/>
					)
					: (
						<BlockContentChevron
							param="Лендинг"
							needCursorPointer={false}
							disabled
						/>
					)
				}
			</BlockItem>
			<BlockItem className="justify-between">
				{direct
					? (
						<BlockContentSettings
							param="Директ"
							value={`${direct}@yandex.ru`}
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
				{metrica
					? (
						<BlockContentChevron
							param="Метрика"
							value={metrica}
							needCursorPointer={false}
							disabled={false}
						/>
					)
					: (
						<BlockContentChevron
							param="Метрика"
							needCursorPointer={false}
							needNotAvailable={false}
							disabled
						/>
					)
				}

			</BlockItem>
		</BlockContainer>
	)
}
