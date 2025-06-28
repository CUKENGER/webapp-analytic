import { FormPageLayout } from '@/atoms/FormPageLayout'
import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { SectionTitle } from '@/components/@common/SectionTitle'
import { MainButtonBox } from '@/components/ui/MainButtonBox'
import { CustomRadioGroup } from '@/components/ui/radio-group'
import { UITextFieldNotice } from '@/components/ui/UITextFieldNotice'
import { PATHS } from '@/components/utils/paths'
import { useOpenLink } from '@/hooks/useOpenWebLink'
import { tariffMapping } from '@/utils/projectConfig'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { OperationResultState } from '../OperationResult/OperationResult'

const options = [
  { label: "SaleBot", value: "SaleBot" },
  { label: "BotHelp", value: "BotHelp" },
  { label: "Leadtex", value: "Leadtex" },
  { label: "CleverApp", value: "CleverApp" },
  { label: "Другой / без сервиса", value: "Other" },
]

interface FormData {
  botToken: string
  botService: string
  saleBotLink?: string
  cleverAppLink?: string
  leadtexLink?: string
  botHelpRef?: string
}

const AddBot = () => {

  const id = useParams()
  const navigate = useNavigate()
  const { handleOpenWebLink, handleOpenTelegramLink } = useOpenLink()

  const [isLoading, setIsLoading] = useState(false)
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      botToken: '',
      botService: 'SaleBot',
      saleBotLink: '',
      cleverAppLink: '',
      leadtexLink: '',
      botHelpRef: '',
    },
    mode: 'onChange'
  })

  const botService = useWatch({ control, name: 'botService' })

  const onSubmit = (data: FormData) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const state: OperationResultState = {
        content: {
          paragraphs: [
            {
              text: `Для бота «botName» подключен тариф «${tariffMapping['trial']}».`,
              boldParts: [`«botName»`, `«${tariffMapping['trial']}»`],
            },
            {
              text: 'Завтра вам придёт первый отчёт.',
            },
          ],
        },
        notice: {
          text: 'Вы можете поменять тариф в настройках проекта.'
        },
        button: {
          text: 'Продолжить',
          redirectPath: PATHS.projects.root
        },
        backPath: PATHS.projects.root
      }
      navigate(PATHS.result, { state })
    }, 400)
    console.log('data', data)
  }

  return (
    <FormPageLayout onSubmit={handleSubmit(onSubmit)} className='bg-tg-secondary'>
      <BlockTitle title='Подключение бота'>
        Подробное руководство по подключению бота вы можете найти в{` `}
        <span
          className='text-tg-link cursor-pointer'
          onClick={() => handleOpenWebLink('https://mbel.notion.site/bot-connect')}
        >
          инструкциях
        </span>.
      </BlockTitle>
      <div className='flex flex-col gap-4'>
        <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
          <SectionTitle title='Пришлите API-токен вашего бота' />
          <div className='py-3 px-4'>
            <Controller
              name="botToken"
              control={control}
              rules={{
                required: 'Пожалуйста, введите API-токен',
                minLength: {
                  value: 10,
                  message: 'Токен должен содержать минимум 10 символов',
                },
                pattern: {
                  value: /^[A-Za-z0-9:_-]+$/, // Только буквы, цифры, двоеточие, подчеркивание, дефис
                  message: 'Неверный формат токена',
                },
              }}
              render={({ field }) => (
                <UITextFieldNotice
                  {...field}
                  placeholder='API-токен...'
                  footerLabel={
                    <span>Токен можно узнать у{` `}
                      <span
                        className='text-tg-link cursor-pointer'
                        onClick={() => handleOpenTelegramLink('https://t.me/BotFather')}
                      >
                        @BotFather
                      </span>.
                    </span>
                  }
                  error={!!errors?.botToken}
                  noticeText={errors?.botToken?.message}
                />
              )}
            />
          </div>
        </BlockContainer>

        <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
          <SectionTitle needColon={false} title='В каком сервисе сделан ваш бот?' />
          <Controller
            name='botService'
            control={control}
            render={({ field }) => (
              <CustomRadioGroup
                classNameOption="px-4 leading-[1.4]"
                {...field}
                options={options}
              />
            )}
          />
        </BlockContainer>

        {/* Поле для Leadtex */}
        {botService === 'CleverApp' && (
          <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
            <SectionTitle title='Пришлите ссылку вашего бота' />
            <div className='py-3 px-4'>
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
                    {...field}
                    placeholder='Ссылка...'
                    footerLabel={
                      <span>
                        Пример:{` `}
                        <span className='text-tg-text'>app.cleverapp.pro/w/cvlm</span>. Как
                        получить ссылку на бота в CleverApp смотрите в{` `}
                        <span
                          className='text-tg-link cursor-pointer'
                          onClick={() => handleOpenWebLink('https://mbel.notion.site/bot-connect')}
                        >
                          инструкции
                        </span>.
                      </span>
                    }
                    error={!!errors?.cleverAppLink}
                    noticeText={errors?.cleverAppLink?.message}
                  />
                )}
              />
            </div>
          </BlockContainer>
        )}

        {/* Поле для Leadtex */}
        {botService === 'Leadtex' && (
          <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
            <SectionTitle title='Пришлите ссылку вашего бота' />
            <div className='py-3 px-4'>
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
                    {...field}
                    placeholder='Ссылка...'
                    footerLabel={
                      <span>
                        Пример:{` `}
                        <span className='text-tg-text'>app.leadteh.ru/w/cHM7l</span>. Как
                        получить ссылку на бота в Leadtex смотрите в{` `}
                        <span
                          className='text-tg-link cursor-pointer'
                          onClick={() => handleOpenWebLink('https://mbel.notion.site/bot-connect')}
                        >
                          инструкции
                        </span>.
                      </span>
                    }
                    error={!!errors?.leadtexLink}
                    noticeText={errors?.leadtexLink?.message}
                  />
                )}
              />
            </div>
          </BlockContainer>
        )}

        {/* Поле для BotHelp */}
        {botService === 'BotHelp' && (
          <BlockContainer className='mt-0 px-0' itemClassName='pl-0'>
            <SectionTitle title='Пришлите ref вашего бота' />
            <div className='py-3 px-4'>
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
                    {...field}
                    placeholder='Ref...'
                    footerLabel={
                      <span>
                        Пример:{` `}
                        <span className='text-tg-text'>c12345678</span>. Как узнать Ref бота в
                        BotHelp смотрите в{` `}
                        <span
                          className='text-tg-link cursor-pointer'
                          onClick={() => handleOpenWebLink('https://mbel.notion.site/bot-connect')}
                        >
                          инструкции
                        </span>.
                      </span>
                    }
                    error={!!errors?.botHelpRef}
                    noticeText={errors?.botHelpRef?.message}
                  />
                )}
              />
            </div>
          </BlockContainer>
        )}

      </div>
      <MainButtonBox
        isLoading={isLoading}
        position='center'
        disabledStyle='bg'
        type='submit'
        className='h-[56px]'
        disabled={Object.keys(errors).length > 0}
      >
        Отправить
      </MainButtonBox>
    </FormPageLayout>
  )
}

export default AddBot 
