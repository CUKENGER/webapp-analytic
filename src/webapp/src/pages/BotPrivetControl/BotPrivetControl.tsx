import { PageLayout } from '@/atoms/PageLayout'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { ButtonBotCard } from '@/components/@common/ButtonBotCard'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { useNavigate } from 'react-router'

const BotPrivetControl = () => {

  const navigate = useNavigate()

  return (
    <PageLayout>
      <BlockTitle title="Привет-бот">
        Выберите бота для настройки привета
      </BlockTitle>
      <div className="flex flex-col gap-2 w-full">
        <ButtonBotCard name="Название бота №1" onClick={() => navigate(`add/${1}`)}>
          <span>
            @bot_name_1
          </span>
        </ButtonBotCard>
        <ButtonBotCard name="Название бота №2" onClick={() => navigate(`edit/${2}`)}>
          <span>
            @bot_name_2
          </span>
        </ButtonBotCard>
      </div>
      <div className='text-gray text-sm mt-4 flex w-full flex-col gap-2'>
        <p>Если вашего бота нет в списке, то проверьте выполнение условий:</p>
        <ul className='w-full flex flex-col gap-1 pl-4 list-decimal'>
          <li>Ваш бот подключен к сервису TeleGraphyx;</li>
          <li>Канал и бот добавлены с одного Telegram-аккаунта;</li>
          <li>Ваш бот является администратором в канале с правом «Добавление подписчиков».</li>
        </ul>
      </div>
      <MainButtonBox onClick={() => navigate('/projects/add/bot')}>
        Подключить бота
      </MainButtonBox>
    </PageLayout>
  )
}

export default BotPrivetControl
