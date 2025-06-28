import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { FormPageLayout } from '@/atoms/FormPageLayout'
import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { SectionTitle } from '@/components/@common/SectionTitle'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { CustomRadioGroup } from '@/components/ui/radio-group'
import { UITextFieldNotice } from '@/components/ui/UITextFieldNotice'

const options = [
  { label: 'до 50 тысяч рублей', value: '50' },
  { label: 'от 50 до 100 тысяч рублей', value: '100' },
  { label: 'от 100 тысяч рублей', value: '101' }
]

interface FormData {
  project: string
  budget: string
}

const RequestForAd = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      project: '',
      budget: '50'
    }
  })

  const onSubmit = (data: FormData) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      navigate('result')
    }, 400)
    console.log('data', data)
  }

  return (
    <FormPageLayout
      onSubmit={handleSubmit(onSubmit)}
      className="bg-tg-secondary"
    >
      <BlockTitle title="Заявка на настройку рекламы">
        Оставьте заявку на настройку рекламы под ключ у наших партнеров.
      </BlockTitle>
      <div className="flex flex-col gap-4">
        <BlockContainer className="mt-0 px-0" itemClassName="pl-0">
          <SectionTitle
            title="Что вы хотите продвинуть в Telegram?"
            needColon={false}
          />
          <div className="px-4 py-3">
            <Controller
              name="project"
              control={control}
              rules={{ required: 'Заполните, пожалуйста, поле' }}
              render={({ field }) => (
                <UITextFieldNotice
                  {...field}
                  placeholder="Ваш проект..."
                  footerLabel={
                    <span>
                      Пример ответа:{' '}
                      <span className="text-tg-text">канал t.me/tgraphyx</span>.
                    </span>
                  }
                  error={!!errors?.project?.message}
                  noticeText={errors?.project?.message}
                />
              )}
            />
          </div>
        </BlockContainer>

        <BlockContainer className="px-0 mt-0" itemClassName="pl-0">
          <SectionTitle
            title="Ваш бюджет на продвижение в месяц?"
            needColon={false}
          />
          <div className="">
            <Controller
              name="budget"
              control={control}
              render={({ field }) => (
                <CustomRadioGroup
                  classNameOption="px-4"
                  {...field}
                  options={options}
                />
              )}
            />
          </div>
        </BlockContainer>
      </div>
      <MainButtonBox isLoading={isLoading} position="center" disabledStyle="bg">
        Отправить
      </MainButtonBox>
    </FormPageLayout>
  )
}

export default RequestForAd
