import { useNavigate } from 'react-router'
import { BlockContainer } from '@/components/@common/BlockContainer'
import {
  BlockContentChevron,
  BlockContentSettings
} from '@/components/@common/BlockContentChevron'
import { BlockItem } from '@/components/@common/BlockItem'

interface TrafficSourcesProps {
  landingUrl: string | null
  direct?: string
  metric?: string
  landingNavigate?: string
  directNavigate?: string
  needConnectDirect?: boolean
}

export const TrafficSources = ({
  landingUrl,
  direct,
  metric,
  landingNavigate = 'landing',
  directNavigate = 'direct',
  needConnectDirect = true
}: TrafficSourcesProps) => {
  const navigate = useNavigate()

  return (
    <BlockContainer title="Источники трафика" divideClassName="my-0" needBorder>
      <BlockItem className="justify-between">
        {landingUrl ? (
          <BlockContentChevron
            param="Лендинг"
            value={landingUrl}
            needIcon
            needCursorPointer
            onClick={() => navigate(landingNavigate)}
          />
        ) : (
          <BlockContentChevron
            param="Лендинг"
            needCursorPointer={false}
            disabled
          />
        )}
      </BlockItem>
      <BlockItem className="justify-between">
        {direct ? (
          <BlockContentSettings
            param="Директ"
            value={`${direct}@yandex.ru`}
            reloadIcon
            onClick={() => navigate(directNavigate)}
          />
        ) : (
          <BlockContentSettings
            param="Директ"
            customValue={
              needConnectDirect && (
                <span
                  className="text-tg-link font-bold cursor-pointer"
                  onClick={() => navigate(directNavigate)}
                >
                  Подключить
                </span>
              )
            }
            disabled
            needNotAvailable={!needConnectDirect}
          />
        )}
      </BlockItem>
      <BlockItem>
        {metric ? (
          <BlockContentChevron
            param="Метрика"
            value={metric}
            needCursorPointer={false}
          />
        ) : (
          <BlockContentChevron
            param="Метрика"
            needCursorPointer={false}
            disabled
          />
        )}
      </BlockItem>
    </BlockContainer>
  )
}
