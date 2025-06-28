import { useNavigate } from 'react-router'
import duck_phone2x from '@/assets/duck_old_phone_2x.webp'
import duck_phone4x from '@/assets/duck_old_phone_4x.webp'
import { PageLayout } from '@/atoms/PageLayout'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { MainButtonBox } from '@/components/ui/MainButtonBox'

const RequestAdResult = () => {
  const navigate = useNavigate()
  return (
    <PageLayout className="bg-tg-secondary">
      <div className="flex w-full flex-col gap-4">
        <BlockTitle title="Благодарим за заявку!" className="mb-0"></BlockTitle>
        <div className="bg-tg-background p-4 pb-3 rounded-2xl">
          <div className="w-full h-[140px] flex justify-center items-center">
            <img
              src={duck_phone2x}
              srcSet={`${duck_phone2x} 1x, ${duck_phone4x} 2x`}
              alt="Благодарим за заявку"
              className="w-full h-[140px] object-cover rounded-lg"
            />
          </div>
          <div className="pt-3">
            Ожидайте! Скоро с вами свяжутся наши партнеры.
          </div>
        </div>
      </div>
      <MainButtonBox onClick={() => navigate('/help')}>
        Продолжить
      </MainButtonBox>
    </PageLayout>
  )
}

export default RequestAdResult
