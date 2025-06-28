import { useNavigate } from 'react-router';
import { ProjectFull } from '@/api/types/projects.types';
import { BlockContainer } from '@/components/@common/BlockContainer';
import { BlockContentChevron, BlockContentCopy, BlockContentSettings } from '@/components/@common/BlockContentChevron';
import { BlockItem } from '@/components/@common/BlockItem';
import { BlockTitle } from '@/components/@common/BlockTitle';
import { Notice } from '@/components/@common/Notice';
import { toast } from '@/hooks/use-toast';
import { copyText } from '@/utils/copyText';
import { ProjectSettings } from './ProjectSettings';
import { TariffButton } from './TariffButton';
import { TrafficSources } from './TrafficSources';


interface ProjectInfoProps {
  project: ProjectFull
  tariffSettings: {
    showNotice?: boolean
  }
  isClose: boolean
}

// Функция для форматирования тарифа
const formatTariff = (tariff: string): string => {
  const tariffMap: Record<string, string> = {
    free: 'Бесплатный',
    trial: 'Пробный',
    profi: 'Профи',
    based: 'Базовый'
    // Добавь другие тарифы, если есть
  }
  return tariffMap[tariff.toLowerCase()] || tariff
}

// Функция для рассчёта оставшихся дней
const calculateDaysRemaining = (endDate: string | null): number => {
  if (!endDate) return 0
  try {
    const end = new Date(endDate)
    const now = new Date()
    const diffInMs = end.getTime() - now.getTime()
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    return days >= 0 ? days : 0
  } catch (e) {
    console.error('Error calculating days remaining:', e)
    return 0
  }
}

export const ProjectInfo = ({
  project,
  tariffSettings,
  isClose
}: ProjectInfoProps) => {
  const navigate = useNavigate()

  const direct = project.yaLoginInfo
  const metric = project.yaCounterID
  const landingUrl = project.landingFolderName
    ? `tgryx.ru/${project.landingFolderName}`
    : null

  const paidUntil = calculateDaysRemaining(project.paidUntilEpoch)
  const formattedTariff = formatTariff(project.tariff)

  const handleCopy = (text: string) => {
    copyText(`https://${text}`)
    toast({ description: 'Ссылка скопирована' })
  }

  return (
    <div className="gap-4 flex flex-col">
      <BlockTitle title={project.tgTitle} className="mb-0">
        Канал
      </BlockTitle>
      {tariffSettings.showNotice && (
        <Notice>
          У вас бесплатный тариф. Оплатите тариф и откройте функции сервиса.
        </Notice>
      )}
      <TariffButton
        paidUntil={paidUntil}
        tariff={formattedTariff}
        onClick={() => navigate(`tariff`)}
      />
      <BlockContainer
        title="Источники трафика"
        divideClassName="my-0"
        needBorder
      >
        <BlockItem className="justify-between">
          {landingUrl ? (
            <BlockContentCopy
              param="Лендинг"
              customValue={
                <span className="text-tg-link font-bold">{landingUrl}</span>
              }
              onIconClick={() => handleCopy(landingUrl)}
              // value={landingUrl}
              // needIcon={false}
              // needCursorPointer
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
              needHover={false}
            />
          ) : (
            <BlockContentSettings param="Директ" disabled needHover={false} />
          )}
        </BlockItem>
        <BlockItem>
          {metric ? (
            <BlockContentChevron
              param="Метрика"
              value={metric}
              needCursorPointer={false}
              needHover={false}
            />
          ) : (
            <BlockContentChevron
              param="Метрика"
              needCursorPointer={false}
              disabled
              needHover={false}
            />
          )}
        </BlockItem>
      </BlockContainer>
    </div>
  )
}