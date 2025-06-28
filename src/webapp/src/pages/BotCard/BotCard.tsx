import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useGetBot } from '@/api/hooks/useGetBot'
import { PageLayout } from '@/atoms/PageLayout'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { ModalMessage } from '@/components/@common/ModalMessage'
import { Notice } from '@/components/@common/Notice'
import { Modal } from '@/components/Modal/Modal'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { UIButton } from '@/components/ui/UIButton'
import { useToast } from '@/hooks/use-toast'
import { useModal } from '@/hooks/useModal'
import { TariffButton } from '../Project/TariffButton'
import { CustomLoader } from '@/components/@common/CustomLoader'

interface Bot {
  name: string
  tariff: 'trial' | 'profi' // Ограничьте возможные значения
  paidUntil?: number
  landing?: string
  direct?: string
  metrica?: string
  typeBot: string
}

const BotItem: Bot = {
  name: 'name profi bot',
  tariff: 'profi',
  paidUntil: 10,
  landing: 'tgryx.ru/0123456789',
  direct: 'mailbox',
  metrica: '0123456789',
  typeBot: 'SaleBot'
}

const BotCard = () => {
  const { isOpen, modalType, openModal, closeModal } = useModal()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { id: botId } = useParams()

  const { data: bot, isLoading: isBotLoading } = useGetBot({
    id: botId ?? ''
  })

  const navigate = useNavigate()

	if(isBotLoading) {
		return <CustomLoader/>
	}

  if (!bot) {
    return (
      <PageLayout>
        <BlockTitle title="Бот не найден">Бот</BlockTitle>
        <div className="flex flex-col gap-4">
          <Notice>Бот с не найден</Notice>
        </div>
      </PageLayout>
    )
  }

  const isFree = bot.tariff === 'trial'

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('Bot deleted successfully')
          navigate('/')
        }, 500)
      })
      toast({
        description: 'Бот успешно удален'
      })
      closeModal() // Закрываем модальное окно при успехе
    } catch (error) {
      console.error('Error deleting bot:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatedDaytime = bot.end_date
    ? Math.floor(
        (new Date(bot.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : 0

  return (
    <PageLayout>
      <BlockTitle title={bot.name}>Бот</BlockTitle>
      <div className="flex flex-col gap-4">
        {isFree && (
          <Notice>
            У вас бесплатный тариф. Оплатите тариф и откройте функции сервиса.
          </Notice>
        )}
        <TariffButton
          paidUntil={calculatedDaytime}
          tariff={bot.tariff_display}
        />
      </div>
      <MainButtonBox disabled={isFree} onClick={() => navigate(`direct/`)}>
        Посмотреть аналитику
      </MainButtonBox>
      <Modal isOpen={isOpen} onOpenChange={closeModal}>
        <ModalMessage
          footer={
            <div className="flex items-center gap-2">
              <UIButton
                variant="outline"
                size="sm"
                className="h-[38px]"
                rounded="lg"
                onClick={closeModal}
                fontSize="sm"
              >
                Отменить
              </UIButton>
              <UIButton
                variant="outline"
                size="forLoading"
                className="h-[38px]"
                rounded="lg"
                colorText="red"
                fontSize="sm"
                isLoading={isLoading}
                position="center"
                onClick={handleDelete}
              >
                Удалить
              </UIButton>
            </div>
          }
          title="Удаление бота:"
        >
          <div className="flex flex-col gap-2">
            <p>@{BotItem.name}</p>
            <p className="text-sm text-gray">
              Вы действительно хотите удалить этого бота из сервиса?
            </p>
          </div>
        </ModalMessage>
      </Modal>
    </PageLayout>
  )
}

export default BotCard

