import { openLink, useLaunchParams } from '@telegram-apps/sdk-react';
import knowledge from '@/assets/knowledge_base_1x.webp';
import knowledge4x from '@/assets/knowledge_base_4x.webp';
import launch from '@/assets/launch_videos_1x.webp';
import launch4x from '@/assets/launch_videos_4x.webp';
import review from '@/assets/logo_blue__1x.webp';
import review4x from '@/assets/logo_blue_4x.webp';
import workshop from '@/assets/workshop_1x.webp';
import workshop4x from '@/assets/workshop_4x.webp';
import { PageLayout } from "@/atoms/PageLayout";
import { BlockTitle } from "@/components/@common/BlockTitle";
import { HelpBlock } from "@/components/@common/HelpBlock";


const Instructions = () => {
  const launchParams = useLaunchParams()
  const isTelegram = !!launchParams

  const handleOpenWebLink = (url: string) => {
    if (isTelegram) {
      openLink(url)
    } else {
      window.open(url, "_blank")
    }
  }

  return (
    <PageLayout>
      <BlockTitle title="Инструкции по сервису" />
      <div className="flex flex-col gap-4 instructions-screen:grid instructions-screen:grid-cols-2 instructions-screen:items-stretch pb-padding-bottom-nav">
        
        <HelpBlock
          title="Обзор сервиса"
          description="Краткий обзор всех возможностей и функций сервиса."
          altImage="Обзор сервиса"
          image={review}
          image2={review4x}
          onClick={() => handleOpenWebLink('https://telegraphyx.ru/')}
        />

        <HelpBlock
          title="Запуск за 10 минут"
          description="Посмотрите 3 коротких видео и запустите продвижение в Telegram!"
          altImage="Запуск за 10 минут"
          image={launch}
          image2={launch4x}
          onClick={() => handleOpenWebLink('https://telegraphyx.ru/start')}
        />

        <HelpBlock
          title="База знаний"
          description="Посмотрите подробные инструкции по настройке сервиса."
          altImage="База знаний"
          image={knowledge}
          image2={knowledge4x}
          onClick={() =>
            handleOpenWebLink('https://mbel.notion.site/help-telegraphyx')
          }
        />
     
        <HelpBlock
          title="Воркшоп 3.0"
          description="Пройдите 6 уроков от наших лучших маркетологов и запустите свой поток подписчиков."
          altImage="Воркшоп 3.0"
          image={workshop}
          image2={workshop4x}
          onClick={() => handleOpenWebLink('https://telegraphyx.ru/workshop')}
        />
      </div>
    </PageLayout>
  )
}

export default Instructions