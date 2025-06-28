import { BlockTitle } from "@/components/@common/BlockTitle"
import { Notice } from "@/components/@common/Notice"
import { UIButton } from "@/components/ui/UIButton"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate, useParams } from 'react-router'
import { FormField } from './FormField'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PageLayout } from '@/atoms/PageLayout'
import { MainContainerButton } from '@/components/@common/MainContainerButton'
import { PATHS } from '@/components/utils/paths'
import { OperationResultState } from "../OperationResult/OperationResult"

export interface SmartButtonFormData {
  postLink: string
  buttonName: string
  messageSign: string
  messageUnsign: string
}

const SmartButtonControl = () => {

  const { toast } = useToast()
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    trigger,
    formState: { isValid },
  } = useForm<SmartButtonFormData>({
    defaultValues: {
      postLink: "",
      buttonName: "🎁 Забрать подарок",
      messageUnsign: "⚠️ Подпишитесь на канал и заберите подарок.",
      messageSign: "Нажмите на эмодзи 🎁🎁🎁 в конце поста и заберите подарок!",
    },
    mode: "onChange",
  })

  const onSubmit: SubmitHandler<SmartButtonFormData> = async (data) => {
    console.log("Form submitted:", data)
    setIsLoading(true)
    try {
      // Симуляция API-запроса
      await new Promise((resolve) => setTimeout(resolve, 500))
      const state: OperationResultState = {
        content: {
          text: 'В ваш пост добавлена умная кнопка. Закрепите пост, если это необходимо. Вы можете изменить его в самом канале в любое время.'
        },
        notice: {
          text: 'Не забудьте добавить ссылку на подарок в эмодзи! Подробности в',
          link: {
            text: 'инструкции',
            url: 'https://mbel.notion.site/help-telegraphyx',
            suffix: '.'
          }
        },
        button: {
          text: 'Продолжить',
          redirectPath: PATHS.projects.project(id ?? '/')
        },
        backPath: PATHS.projects.project(id ?? '/')
      }
      navigate('/result', { state })
    } catch (error) {
      // Ошибка
      toast({
        description: "Произошла ошибка"
      })
      console.error('Error submit form', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isRights = false

  // Валидация ссылки только по t.me
  const telegramLinkPattern = /^t\.me\/.+$/i
  const commonRules = {
    required: "Это поле обязательно",
    maxLength: {
      value: 200,
      message: "Текст не должен превышать 200 символов.",
    },
  }


  const isSubmitDisabled = !isValid || isLoading

  return (
    <PageLayout className='bg-tg-secondary'>
      <BlockTitle title="Пост с умной кнопкой">
        Добавьте умную кнопку в ваш пост
      </BlockTitle>
      {isRights && (
        <Notice className="mb-4 text-sm" error>
          Добавьте в вашем канале у бота @tgraphyx_bot права на «Управление
          сообщениями».
        </Notice>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-grow"
      >
        <div className="w-full flex flex-col gap-4">
          <FormField
            name="postLink"
            control={control}
            title="Ссылка на пост"
            placeholder="Ссылка на пост..."
            footerLabel={
              <span>
                Ссылка на пост в вашем канале, где нужно добавить умную кнопку. Например:{" "}
                <span className="text-tg-text">t.me/channel/123</span>.
              </span>
            }
            rules={{
              ...commonRules,
              pattern: {
                value: telegramLinkPattern,
                message: "Некорректная ссылка.",
              },
            }}
            trigger={trigger}
          />
          <FormField
            name="buttonName"
            control={control}
            title="Название кнопки"
            placeholder="Название кнопки"
            footerLabel="Кнопка, которая будет в посте."
            rules={commonRules}
            trigger={trigger}
          />
          <FormField
            name="messageUnsign"
            control={control}
            title="Сообщение, если не подписан"
            placeholder="Сообщение, если не подписан"
            footerLabel="Сообщение для пользователя, если он не подписан на ваш канал."
            rules={commonRules}
            isTextarea
            trigger={trigger}
          />
          <FormField
            name="messageSign"
            control={control}
            title="Сообщение, если подписан"
            placeholder="Сообщение, если подписан"
            footerLabel="Сообщение для пользователя, если пользователь подписался на ваш канал."
            rules={commonRules}
            isTextarea
            trigger={trigger}
          />
        </div>
        <MainContainerButton>
          <div className="flex flex-col gap-2 small-screen:flex-row">
            <UIButton
              variant="outline"
              type="button"
              onClick={() => navigate(`/projects/${id}`)}
            >
              Отменить
            </UIButton>
            <UIButton
              variant="primary"
              type="submit"
              className={cn("h-[56px]", isSubmitDisabled && 'bg-tg-background')}
              position="center"
              disabled={isSubmitDisabled}
              isLoading={isLoading}
              disabledStyle='bg'
            >
              Добавить
            </UIButton>
          </div>
        </MainContainerButton>
      </form>
    </PageLayout>
  )
}

export default SmartButtonControl
