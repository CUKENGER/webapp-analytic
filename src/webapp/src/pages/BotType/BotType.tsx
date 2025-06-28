import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { SectionTitle } from '@/components/@common/SectionTitle'
import { CustomRadioGroup } from '@/components/ui/radio-group'
import { UITextFieldNotice } from '@/components/ui/UITextFieldNotice'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { FormPageLayout } from '@/atoms/FormPageLayout'
import { useNavigate, useParams } from 'react-router'
import { Notice } from '@/components/@common/Notice'
import { PATHS } from '@/components/utils/paths'
import { OperationResultState } from '../OperationResult/OperationResult'

interface FormData {
  service: string
  customService?: string
  saleBotLink?: string
  leadtexLink?: string
  cleverAppLink?: string
  botHelpRef?: string
  newBotToken?: string
}

const BotType = () => {

  const [isLoading, setIsLoading] = useState(false)
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      service: 'BotHelp',
      customService: '',
      saleBotLink: '',
      leadtexLink: '',
      cleverAppLink: '',
      botHelpRef: '',
      newBotToken: '',
    },
    mode: 'onSubmit'
  })
  const navigate = useNavigate()
  const { id } = useParams()

  const selectedService = useWatch({ control, name: 'service' })

  const onSubmit = (data: FormData) => {
    setIsLoading(true)
    setTimeout(() => {
      const newService = data.service === 'Other' ? data.customService : data.service
      console.log('newService', newService)
      setIsLoading(false)
      const state: OperationResultState = {
        content: {
          text: 'Вы изменили настройки бота. Обязательно проверьте его работу после изменений!'
        },
        notice: {
          text: 'Подробное руководство по настройке сервиса вы можете найти в',
          link: {
            text: 'инструкциях',
            url: 'https://mbel.notion.site/help-telegraphyx',
            suffix: '.'
          }
        },
        button: {
          text: 'Продолжить',
          redirectPath: PATHS.projects.bot.card(id ?? '/')
        },
        backPath: PATHS.projects.bot.card(id ?? '/')
      }
      navigate(PATHS.result, { state })
      reset()
    }, 400)
    console.log('data', data)
  }

  console.log('selectedService', selectedService)

  const options = [
    { label: "SaleBot", value: "SaleBot" },
    { label: "BotHelp", value: "BotHelp" },
    { label: "Leadtex", value: "Leadtex" },
    { label: "CleverApp", value: "CleverApp" },
    {
      label: "Другой",
      value: "Other"
    },
  ]

  return (
    <FormPageLayout onSubmit={handleSubmit(onSubmit)} className='bg-tg-secondary'>
      <BlockTitle title='Тип бота' />
      <div className='flex flex-col gap-4'>
        <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
          <SectionTitle title='Обновите токен бота' />
          <div className='px-4 py-3'>
            <Controller
              name="newBotToken"
              control={control}
              render={({ field }) => (
                <UITextFieldNotice
                  footerLabel="Не обязательно для заполнения."
                  placeholder='Введите текст...'
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </BlockContainer>

        <BlockContainer className='px-0 mt-0' itemClassName='pl-0'>
          <SectionTitle title='В каком сервисе сделан ваш бот?' needColon={false} />
          <div className='flex flex-col gap-4 pl-4'>
            <Controller
              name='service'
              control={control}
              render={({ field }) => (
                <CustomRadioGroup
                  value={field.value}
                  onChange={field.onChange}
                  classNameOption='pr-4 leading-[1.4]'
                  options={options}
                  showInput={selectedService === 'Other'}
                />
              )}
            />
            {selectedService === 'Other' && errors.customService && (
              <Notice error>{errors.customService.message}</Notice>
            )}
          </div>
        </BlockContainer>

        {/* Поле для BotHelp */}
        {selectedService === 'BotHelp' && (
          <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
            <SectionTitle title='Пришлите ref вашего бота' />
            <div className='px-4 py-3'>
              <Controller
                name='botHelpRef'
                control={control}
                rules={{
                  required: 'Пожалуйста, введите ref',
                  minLength: {
                    value: 7,
                    message: 'Недостаточно символов',
                  },
                }}
                render={({ field }) => (
                  <UITextFieldNotice
                    footerLabel={
                      <span>
                        Пример:{` `}
                        <span className='text-tg-text'>c12345678</span>. Как узнать Ref
                        бота в BotHelp смотрите в{` `}
                        <span
                          className='text-tg-link cursor-pointer'
                          onClick={() =>
                            window.open('https://mbel.notion.site/help-telegraphyx', '_blank')
                          }
                        >
                          инструкции
                        </span>.
                      </span>
                    }
                    placeholder='Ref...'
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.botHelpRef}
                    noticeText={errors.botHelpRef?.message}
                  />
                )}
              />
            </div>
          </BlockContainer>
        )}

        {/* Поле для Leadtex */}
        {selectedService === 'Leadtex' && (
          <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
            <SectionTitle title='Пришлите ссылку вашего бота' />
            <div className='px-4 py-3'>
              <Controller
                name='leadtexLink'
                control={control}
                rules={{
                  required: 'Пожалуйста, введите ссылку',
                  minLength: {
                    value: 7,
                    message: 'Недостаточно символов',
                  },
                }}
                render={({ field }) => (
                  <UITextFieldNotice
                    footerLabel={
                      <span>
                        Пример:{` `}
                        <span className='text-tg-text'>app.leadteh.ru/w/cHM7l</span>. Как
                        получить ссылку на бота в Leadtex смотрите в{` `}
                        <span
                          className='text-tg-link cursor-pointer'
                          onClick={() =>
                            window.open('https://mbel.notion.site/help-telegraphyx', '_blank')
                          }
                        >
                          инструкции
                        </span>.
                      </span>
                    }
                    placeholder='Ссылка...'
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.leadtexLink}
                    noticeText={errors.leadtexLink?.message}
                  />
                )}
              />
            </div>
          </BlockContainer>
        )}

        {/* Поле для CleverApp */}
        {selectedService === 'CleverApp' && (
          <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
            <SectionTitle title='Пришлите ссылку вашего бота' />
            <div className='px-4 py-3'>
              <Controller
                name='cleverAppLink'
                control={control}
                rules={{
                  required: 'Пожалуйста, введите ссылку',
                  minLength: {
                    value: 7,
                    message: 'Недостаточно символов',
                  },
                }}
                render={({ field }) => (
                  <UITextFieldNotice
                    footerLabel={
                      <span>
                        Пример:{` `}
                        <span className='text-tg-text'>app.cleverapp.pro/w/cvlm</span>. Как
                        получить ссылку на бота в CleverApp смотрите в{` `}
                        <span
                          className='text-tg-link cursor-pointer'
                          onClick={() =>
                            window.open('https://mbel.notion.site/help-telegraphyx', '_blank')
                          }
                        >
                          инструкции
                        </span>.
                      </span>
                    }
                    placeholder='Ссылка...'
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.cleverAppLink}
                    noticeText={errors.cleverAppLink?.message}
                  />
                )}
              />
            </div>
          </BlockContainer>
        )}

      </div>
      <MainButtonBox
        type='submit'
        isLoading={isLoading}
        position='center'
        disabledStyle='bg'
      >
        Отправить
      </MainButtonBox>
    </FormPageLayout>
  )
}

export default BotType
