import { useNavigate } from 'react-router'
import duck_money2x from '@/assets/duck_money_2x.webp'
import duck_money4x from '@/assets/duck_money_4x.webp'
import { PageLayout } from '@/atoms/PageLayout'
import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { Notice } from '@/components/@common/Notice'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { useToast } from '@/hooks/use-toast'
import { copyText } from '@/utils/copyText'
import { SectionContainer } from '../TariffControl/TariffItem'

const ReferralProgram = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const url = 'https://t.me/tgraphyx_bot?start=123456789'

  const handleCopy = () => {
    copyText(url)
    toast({
      description: 'Ссылка скопирована'
    })
  }

  return (
    <PageLayout className="bg-bottom-menu">
      <BlockTitle
        title="Реферальная программа"
        classNameTitle="text-white-text"
      />
      <div>
        <BlockContainer
          className="mt-0 px-0 card-shadow-default border-[#363E4E] bg-[#363E4E]"
          needBg={false}
          itemClassName="pl-0 bg-bottom-menu"
          divideClassName="bg-[#363E4E]"
        >
          <SectionContainer className="pt-4 border-[#363E4E]" hasBorder={false}>
            <div>
              <div className="w-full h-[140px] flex justify-center items-center py-3 px-4">
                <img
                  src={duck_money2x}
                  srcSet={`${duck_money2x} 1x, ${duck_money4x} 2x`}
                  alt="Реферальная программа"
                  className="w-full h-[140px] object-cover rounded-lg"
                />
              </div>
            </div>
            <SectionContainer className="border-[#363E4E]">
              <div className="text-start flex flex-col gap-1 py-3 px-4">
                <p className="text-white-text">
                  Вы получите 20% в течение 1 года от всех платежей клиентов,
                  которые придут по вашей реферальной ссылке.
                </p>
              </div>
            </SectionContainer>
            <SectionContainer className="border-[#363E4E]" hasBorder={false}>
              <div className="px-4 py-3 flex flex-col gap-2">
                <p className="text-start text-white-text leading-[1.4]">
                  Ваша реферальная ссылка:
                </p>
                <Notice
                  className="bg-[rgba(0,128,255,0.24)]"
                  classNameBody="text-[#EAEAED]"
                >
                  {url}
                </Notice>
              </div>
            </SectionContainer>
          </SectionContainer>
          <SectionContainer className="border-[#363E4E]" hasBorder={false}>
            <div className="w-full py-3 px-4 block-item--hover">
              <button
                className="text-tg-link flex justify-between w-full items-center"
                onClick={handleCopy}
              >
                <span className="font-bold leading-[1.4]">Скопировать ссылку</span>
                <CopyIcon className="w-[20px] h-[22px]" />
              </button>
            </div>
          </SectionContainer>
        </BlockContainer>
      </div>
      <MainButtonBox onClick={() => navigate('stats')}>
        Статистика и баланс
      </MainButtonBox>
    </PageLayout>
  )
}

export default ReferralProgram
