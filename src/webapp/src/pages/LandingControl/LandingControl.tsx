import { useGetProject } from '@/api/hooks/useProject'
import { FormPageLayout } from '@/atoms/FormPageLayout'
import { BlockContainer } from '@/components/@common/BlockContainer'
import {
  BlockContentChevron,
  BlockContentCopy
} from '@/components/@common/BlockContentChevron'
import { BlockItem } from '@/components/@common/BlockItem'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { MainContainerButton } from '@/components/@common/MainContainerButton'
import { ModalMessage } from '@/components/@common/ModalMessage'
import { Notice } from '@/components/@common/Notice'
import { Modal } from '@/components/Modal/Modal'
import { CustomSwitch } from '@/components/ui/switch'
import { UIButton } from '@/components/ui/UIButton'
import { UIInput } from '@/components/ui/UIInput'
import { UIInputFile } from '@/components/ui/UIInputFile'
import { UITextarea } from '@/components/ui/UITextarea'
import { PATHS } from '@/components/utils/paths'
import { useToast } from '@/hooks/use-toast'
import { useModal } from '@/hooks/useModal'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { SectionContainer } from '../TariffControl/TariffItem'

interface FormData {
  redirect: boolean
  joinRequests: boolean
  requestsTargets: boolean
  title: string
  description: string
  keywords: string
  photo: File | null
  titleContent: string
  mainText: string
  buttonText: string
  footerInfo: string
}

interface FormDataWithBase64 extends Omit<FormData, 'photo'> {
  photo: string | null // Base64 строка или null
}

// Тип для полей формы
type FieldConfig =
  | {
    name: keyof FormData
    placeholder: string
    textarea?: never
    isFile?: never
  }
  | {
    name: keyof FormData
    placeholder: string
    textarea: true
    isFile?: never
  }
  | {
    name: keyof FormData
    placeholder?: never
    textarea?: never
    isFile: true
  }

const LandingControl = () => {
  const { openModal, isOpen, closeModal, modalType } = useModal()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project } = useGetProject({ id: id || '' })
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const isProfi = project?.tariff === 'profi'

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      buttonText: 'Перейти в Телеграм',
      description: 'Описание лендинга полностью',
      footerInfo: `ИП Иванов И. И.\nИНН 1234567890\nтел.: +7 (900) 000-00-00`,
      joinRequests: true,
      keywords:
        'ключевое слово, ключевое слово, ключевое слово, ключевое слово, ключевое слово',
      mainText: 'Основной текст лендинга на любое количество символов',
      photo: null,
      redirect: true,
      requestsTargets: true,
      title: 'Заголовок лендинга',
      titleContent: 'Заголовок лендинга'
    }
  })

  // Тексты для разных модалок
  const modalContent = {
    redirect: {
      title: 'Редирект',
      text: 'Текст, поясняющий как работает та или иная функция. Ссылка на'
    },
    joinRequests: {
      title: 'Заявки на вступление',
      text: 'Текст, поясняющий как работает та или иная функция. Ссылка на'
    },
    requestsTargets: {
      title: 'Заявки как цели',
      text: 'Текст, поясняющий как работает та или иная функция. Ссылка на'
    }
  }

  const sections: Record<string, FieldConfig[]> = {
    Метаданные: [
      { name: 'title', placeholder: 'Заголовок лендинга' },
      { name: 'description', placeholder: 'Описание лендинга', textarea: true },
      { name: 'keywords', placeholder: 'Ключевые слова', textarea: true }
    ],
    'Контент на странице': [
      { name: 'photo', isFile: true },
      { name: 'titleContent', placeholder: 'Заголовок лендинга' },
      { name: 'mainText', placeholder: 'Основной текст', textarea: true },
      { name: 'buttonText', placeholder: 'Надпись на кнопке' }
    ],
    'Информация в подвале': [
      {
        name: 'footerInfo',
        placeholder: 'Информация в подвале',
        textarea: true
      }
    ]
  } as const

  const switches = [
    { name: 'redirect', label: 'Редирект' },
    { name: 'joinRequests', label: 'Заявки на вступление' },
    { name: 'requestsTargets', label: 'Заявки как цели' }
  ] as const

  const handleCopyLandingUrl = async (url: string | null) => {
    try {
      if (url) {
        const fullUrl = `https://${url}`
        const textarea = document.createElement('textarea')
        textarea.value = fullUrl
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)

        toast({
          description: 'Ссылка скопирована'
        })
      }
    } catch (err) {
      console.error('Ошибка при копировании:', err)
    }
  }

  const photoFile = watch('photo')
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
      reader.readAsDataURL(file)
    })
  }
  const landingUrl = project?.landingFolderName
    ? `tgryx.ru/${encodeURIComponent(project.landingFolderName)}`
    : null

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const photoBase64 = data.photo ? await fileToBase64(data.photo) : null
      const dataWithBase64: FormDataWithBase64 = { ...data, photo: photoBase64 }

      // Симуляция запроса
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form data:', dataWithBase64)

      toast({ description: 'Данные успешно сохранены!' })
      navigate(PATHS.projects.project(id ?? '/'))
    } catch (error) {
      console.error('Ошибка:', error)
      toast({ variant: 'destructive', description: 'Ошибка при сохранении' })
    } finally {
      setIsLoading(false)
    }
  }

  const renderField = (field: FieldConfig, isLastInSection: boolean) => (
    <SectionContainer key={field.name} hasBorder={!isLastInSection}>
      <div className={cn("px-4 py-3 flex flex-col w-full gap-2", field.isFile && "block-item--hover")}>
        {field.isFile ? (
          <Controller
            name="photo"
            control={control}
            render={({ field: controllerField }) => (
              <>
                <UIInputFile
                  onFileChange={controllerField.onChange}
                  accept="image/*"
                  label="Выбрать изображение"
                  disabled={isLoading}
                />
                {photoFile && (
                  <img
                    src={URL.createObjectURL(photoFile)}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-md"
                  />
                )}
              </>
            )}
          />
        ) : field.textarea ? (
          <UITextarea
            textareaSize="short"
            placeholder={field.placeholder}
            {...register(field.name, {
              required: `${field.placeholder} обязателен`
            })}
          />
        ) : (
          <UIInput
            placeholder={field.placeholder}
            {...register(field.name, {
              required: `${field.placeholder} обязателен`
            })}
          />
        )}
        {errors[field.name] && (
          <Notice error>{errors[field.name]?.message}</Notice>
        )}
        <p className="text-start text-sm text-gray leading-[1.4]">
          {field.isFile
            ? 'Изображение в формате JPG или PNG с соотношением сторон 1:1'
            : `${field.placeholder}.`}
        </p>
      </div>
    </SectionContainer>
  )

  return (
    <FormPageLayout
      onSubmit={handleSubmit(onSubmit)}
      className="bg-tg-secondary"
    >
      <div className="flex w-dull gap-4 flex-col">
        <BlockTitle title="Лендинг" className="mb-0">
          Настройте параметры под свои запросы
        </BlockTitle>

        <BlockContainer className="mt-0">
          <BlockItem>
            <BlockContentCopy
              param="Адрес"
              customValue={
                <span className="text-tg-link font-bold truncate pr-[2px]">{landingUrl}</span>
              }
              onIconClick={() => handleCopyLandingUrl(landingUrl)}
            />
          </BlockItem>

          {switches.map(({ name, label }) => (
            <BlockItem key={name}>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <CustomSwitch
                    label={label}
                    tooltipOnClick={() => openModal(name)}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </BlockItem>
          ))}
        </BlockContainer>

        <BlockContainer className="mt-0">
          <BlockContentChevron
            param="Подключить свой лендинг"
            needNotAvailable={false}
            needColon={false}
            needIcon
            disabled={!isProfi}
            needCursorPointer={isProfi}
            onClick={() => isProfi && navigate('connect')}
          />
        </BlockContainer>

        {Object.entries(sections).map(([title, fields]) => (
          <BlockContainer key={title} className="px-0 mt-0" itemClassName='pl-0'>
            <div className="w-full">
              <SectionContainer>
                <p
                  className={cn("text-start text-tg-text font-bold py-3 px-4 leading-[1.4]",
                    title === 'Метаданные' && 'pb-1'
                  )}
                >
                  {title}:
                </p>
                {title === 'Метаданные' && (
                  <p className="text-start text-sm text-gray leading-[1.4] pb-3 px-4">
                    Они учитываются при индексации страниц и могут оказывать влияние на продвижение.
                  </p>
                )}
              </SectionContainer>
              {fields.map((field, index) =>
                renderField(field, index === fields.length - 1)
              )}
            </div>
          </BlockContainer>
        ))}
      </div>

      <MainContainerButton>
        <UIButton
          variant="primary"
          className="h-[56px]"
          position="center"
          isLoading={isLoading}
          disabledStyle="bg"
          type="submit"
        >
          Сохранить
        </UIButton>
      </MainContainerButton>

      <Modal isOpen={isOpen} onOpenChange={closeModal}>
        <ModalMessage
          onClick={closeModal}
          title={modalContent[modalType ?? '']?.title}
        >
          {modalContent[modalType ?? '']?.text}{' '}
          <span className="text-tg-link cursor-pointer">инструкцию</span>.
        </ModalMessage>
      </Modal>
    </FormPageLayout>
  )
}

export default LandingControl
