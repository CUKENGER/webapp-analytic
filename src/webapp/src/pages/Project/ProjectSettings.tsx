import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IChannel } from '@/api/types/channel.types'
import { ProjectFull } from '@/api/types/projects.types'
import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockContentChevron } from '@/components/@common/BlockContentChevron'
import { BlockItem } from '@/components/@common/BlockItem'
import { ModalMessage } from '@/components/@common/ModalMessage'
import { Modal } from '@/components/Modal/Modal'
import { CustomSwitch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { TariffType } from '@/utils/projectConfig'

interface ProjectSettingsProps {
  project: ProjectFull
  isPrivate: boolean
  tariff?: TariffType
}

const tariffSettingsConfig = {
  trial: {
    restrictBot: true,
    restrictAccesses: true
  },
  free: {
    restrictBot: true,
    restrictAccesses: true
  },
  based: {
    restrictBot: true,
    restrictAccesses: true
  },
  profi: {
    restrictBot: false,
    restrictAccesses: false
  }
} as const

export const ProjectSettings = ({
  project,
  isPrivate,
  tariff
}: ProjectSettingsProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const config = tariffSettingsConfig[tariff ?? 'free']

  const handleRestrictedClick = () => {
    toast({
      description:
        'Функция доступна на тарифе «Профи». Перейдите в тариф и повысьте его.'
    })
  }

  const handleTooltipClick = () => setIsOpen(true)

  return (
    <>
      <BlockContainer title="Настройки проекта" needBorder>
        <BlockItem>
          <CustomSwitch
            label="Ежедневный отчёт"
            tooltipOnClick={handleTooltipClick}
          />
        </BlockItem>
        <BlockItem>
          {isPrivate ? (
            <BlockContentChevron
              param="Привет-бот"
              label="Выкл"
              needNotAvailable={false}
              needColon={false}
              needIcon
              disabled={config.restrictBot}
              onClick={
                config.restrictBot
                  ? handleRestrictedClick
                  : () => navigate('bot_privet')
              }
              needCursorPointer={!config.restrictBot}
            />
          ) : (
            <BlockContentChevron
              param="Умная кнопка"
              needNotAvailable={false}
              needColon={false}
              needIcon
              onClick={() => navigate(`smart_button`)}
            />
          )}
        </BlockItem>
        <BlockItem>
          <BlockContentChevron
            param="Настроить доступы"
            needNotAvailable={false}
            needColon={false}
            needIcon
            disabled={config.restrictAccesses}
            onClick={
              config.restrictAccesses
                ? handleRestrictedClick
                : () => navigate(`accesses`)
            }
            needCursorPointer={!config.restrictAccesses}
          />
        </BlockItem>
      </BlockContainer>
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom">
        <ModalMessage onClick={() => setIsOpen(false)} title="Ежедневный отчёт">
          Текст, поясняющий как работает та или иная функция. Ссылка на{' '}
          <span className="text-tg-link cursor-pointer">инструкцию</span>.
        </ModalMessage>
      </Modal>
    </>
  )
}
