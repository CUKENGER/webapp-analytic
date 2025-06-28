import { useNavigate } from 'react-router';
import { openTelegramLink, useLaunchParams } from '@telegram-apps/sdk-react';
import ducks_chat from '@/assets/ducks_chat_1x.webp';
import ducks_chat2x from '@/assets/ducks_chat_2x.webp';
import duck_developer from '@/assets/duck_developer_1x.webp';
import duck_developer2x from '@/assets/duck_developer_2x.webp';
import duck_support from '@/assets/duck_support_1x.webp';
import duck_support2x from '@/assets/duck_support_2x.webp';
import { PageLayout } from '@/atoms/PageLayout';
import { BlockContainer } from '@/components/@common/BlockContainer';
import { BlockTitle } from '@/components/@common/BlockTitle';
import { HelpBlock } from '@/components/@common/HelpBlock';
import { UIButton } from '@/components/ui/UIButton';
import { SectionContainer } from '../TariffControl/TariffItem';


const Help = () => {
  const launchParams = useLaunchParams()
  const isTelegram = !!launchParams

  const navigate = useNavigate()

  const handleOpenTelegramLink = (url: string) => {
    if (isTelegram) {
      openTelegramLink(url)
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <PageLayout>
      <BlockTitle title="Помощь в сервисе" />
      <div className="pb-padding-bottom-nav flex flex-col gap-4">
        <div className="flex flex-col gap-4 instructions-screen:grid instructions-screen:grid-cols-2">
          <HelpBlock
            title="Техническая поддержка"
            description="Задайте ваш вопрос в службу технической поддержки."
            altImage="Техническая поддержка"
            image={duck_support}
            image2={duck_support2x}
            onClick={() => handleOpenTelegramLink('https://t.me/tgryx')}
          />

          <HelpBlock
            title="Чат сервиса"
            description="Задайте ваш вопрос в закрытом чате и получите поддержку нашего сообщества."
            altImage="Чат сервиса"
            image={ducks_chat}
            image2={ducks_chat2x}
            onClick={() => handleOpenTelegramLink('https://t.me/tgrx_chat')}
          />
        </div>
        <div>
          <BlockContainer
            className="mt-0 px-0 card-shadow-default"
            needBg={false}
            itemClassName="pl-0"
          >
            <SectionContainer className="pt-3" hasBorder={false}>
              <div>
                <div className="w-full h-[140px] flex justify-center items-center py-3 px-4">
                  <img
                    src={duck_developer}
                    srcSet={`${duck_developer} 1x, ${duck_developer2x} 2x`}
                    alt="Оставьте заявку"
                    className="w-full h-[140px] object-cover rounded-lg"
                  />
                </div>
              </div>
              <div className="text-start flex flex-col gap-1 py-3 px-4">
                <p className="text-tg-text text-sm">
                  Оставьте заявку на настройку рекламы под ключ у наших
                  партнеров.
                </p>
              </div>
            </SectionContainer>
            <SectionContainer hasBorder={false}>
              <div className="w-full py-3 px-4 pb-4 flex flex-col gap-3">
                <p className="text-sm text-start text-gray">
                  Примерная стоимость настройки рекламы 20-50 тысяч рублей.
                </p>
                <UIButton
                  variant="primary"
                  onClick={() => navigate('request')}
                  className="h-[56px]"
                >
                  Оставить заявку
                </UIButton>
              </div>
            </SectionContainer>
          </BlockContainer>
        </div>
      </div>
    </PageLayout>
  )
}

export default Help