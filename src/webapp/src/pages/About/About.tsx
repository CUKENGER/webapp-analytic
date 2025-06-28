import { useNavigate } from "react-router";
import { openLink, openTelegramLink, useLaunchParams } from '@telegram-apps/sdk-react';
import logo_about2x from '@/assets/logo_about_2x.webp'
import logo_about4x from '@/assets/logo_about_4x.webp'
import { PageLayout } from "@/atoms/PageLayout";
import { BlockContainer } from "@/components/@common/BlockContainer";
import { BlockTitle } from "@/components/@common/BlockTitle";
import { MainContainerButton } from "@/components/@common/MainContainerButton";
import { NewWindowIcon } from "@/components/icons/NewWindowIcon";
import { UIButton } from "@/components/ui/UIButton";
import { SectionContainer } from "../TariffControl/TariffItem";


const About = () => {
  const launchParams = useLaunchParams()
  const isTelegram = !!launchParams

  const navigate = useNavigate()

  const handleOpenLink = (url: string) => {
    if (isTelegram) {
      openLink(url);
    } else {
      window.open(url, "_blank");
    }
  }

  const handleOpenTelegramLink = (url: string) => {
    if (isTelegram) {
      openTelegramLink(url);
    } else {
      window.open(url, "_blank");
    }
  }

  return (
    <PageLayout>
      <BlockTitle title="О сервисе" />
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
                  src={logo_about2x}
                  srcSet={`${logo_about2x} 1x, ${logo_about4x} 2x`}
                  alt="logo"
                  className="w-full h-[140px] object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="text-start flex flex-col gap-1 py-3 px-4">
              <p className="text-tg-text">
                <span className="font-bold">Телеграфикс</span> — приложение по
                продвижению и аналитике в Телеграм. Наша миссия состоит в том,
                чтобы у каждого получилось найти свой поток подписчиков!
              </p>
            </div>
          </SectionContainer>
          <SectionContainer hasBorder={false}>
            <div className="w-full py-3 px-4 h-[46px] flex items-center">
              <button
                className="flex justify-between w-full items-center"
                onClick={() => handleOpenLink('https://telegraphyx.ru')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-tg-text">Наш сайт:</span>
                  <span className="text-tg-link font-bold">telegraphyx.ru</span>
                </span>
                <NewWindowIcon className="self-center size-[22px]" />
              </button>
            </div>
          </SectionContainer>
        </BlockContainer>
      </div>
      <MainContainerButton className="flex flex-col gap-2 small-screen:flex-row">
        <UIButton
          variant="primary"
          onClick={() => handleOpenTelegramLink('https://t.me/tgraphyx')}
        >
          Наш Telegram-канал
        </UIButton>
        <UIButton variant="black" onClick={() => navigate('referral')}>
          Реферальная программа
        </UIButton>
      </MainContainerButton>
    </PageLayout>
  )
}

export default About