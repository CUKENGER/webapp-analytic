import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Spinner } from '@telegram-apps/telegram-ui'
import { debounce } from 'lodash'
import { UIButton } from '@/components/ui/UIButton'
import { UIInput } from '@/components/ui/UIInput'
import { PATHS } from '@/components/utils/paths'
import { tariffMapping } from '@/utils/projectConfig'
import { OperationResultState } from '../OperationResult/OperationResult'
import { getEndDate } from './tariffControlUtils'
import { SectionContainer } from './TariffItem'

interface ResultState {
  tariff: string
  startDate: string
  endDate: string
}

export const PaymentConfirmation = ({
  selectedTariffData,
  handleCancel
}: {
  selectedTariffData: {
    tariff: string
    period: string
    price: string
  } | null
  handleCancel: () => void
}) => {
  const { id } = useParams()

  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const debouncedValidateEmail = debounce((value: string) => {
    setIsEmailValid(emailRegex.test(value))
  }, 300)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    debouncedValidateEmail(newEmail)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Предотвращаем перезагрузку страницы
    if (isEmailValid && email !== '' && selectedTariffData) {
      setIsLoading(true)
      const startDate = new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
      const tariffName =
        tariffMapping[
          selectedTariffData.tariff as keyof typeof tariffMapping
        ] || selectedTariffData.tariff
      const endDate = getEndDate(selectedTariffData.period)
      try {
        // Симуляция API-запроса
        await new Promise(resolve => setTimeout(resolve, 500))
        // Успешный результат
        const state: OperationResultState = {
          content: {
            text: `Тариф «${tariffName}» активирован c ${startDate} до ${endDate}.`
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
            redirectPath: PATHS.projects.project(id ?? '/')
          }
        }
        navigate(PATHS.result, { state })
        // navigate(PATHS.projects.tariff.success(uuid), {
        //   state: {
        //     type: 'tariff',
        //     uuid: uuid,
        //     tariff: `«${tariffName}»`,
        //     startDate: `${startDate}`,
        //     endDate: `${endDate}`,
        //     backPath: `${PATHS.projects.tariff.root(uuid ?? '')}`,
        //     redirectPath: `${PATHS.projects.project(uuid ?? '')}`
        //   }
        // })
      } catch (error) {
        // Ошибка
        console.log('Error submit form', error)
        navigate('/result', {
          state: {
            endDate: 'error',
            startDate: 'error',
            tariff: 'error'
          } as ResultState
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div>
      <SectionContainer>
        <div className="px-4 py-[11px]">
          <p className="font-bold">Подтверждение покупки:</p>
        </div>
      </SectionContainer>
      <SectionContainer>
        <div className="pl-4">
          <div className="border-b border-gray-stroke">
            <p className="py-[11px]">
              Выбранный тариф:{' '}
              <span className="font-bold">
                {selectedTariffData
                  ? `«${tariffMapping[selectedTariffData.tariff as keyof typeof tariffMapping] || selectedTariffData.tariff}»`
                  : 'Не выбрано'}
              </span>
            </p>
          </div>
          <div className="border-b border-gray-stroke">
            <p className="py-[11px]">
              Действует до:{' '}
              <span className="font-bold">
                {selectedTariffData
                  ? getEndDate(selectedTariffData.period)
                  : 'Не выбрано'}
              </span>
            </p>
          </div>
          <div>
            <p className="py-[11px]">
              К оплате:{' '}
              <span className="font-bold">
                {selectedTariffData ? selectedTariffData.price : 'Не выбрано'}
              </span>
            </p>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer>
        <form
          className="pt-3 flex w-full flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className='px-4 flex flex-col gap-2'>
            <UIInput
              placeholder="Ваш email..."
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              error={!isEmailValid && email !== ''}
            />
            <p className="text-sm font-medium text-gray">
              Укажите ваш email, на него мы отправим электронный чек.
            </p>
          </div>

          {/* <UIButton
            variant="primary"
            className="h-[46px]"
            position="center"
            disabled={!isEmailValid || email === '' || isLoading}
            type="submit"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner className="flex m-auto h-[20px]" size="s" />
              </div>
            ) : (
              'Добавить'
            )}
          </UIButton> */}
          <div className="w-full items-center h-bottom-btn bg-tg-bg-color border-light-gray-stroke border-t flex gap-2 px-4 py-3 bottom-bar-shadow">
            <UIButton
              className="h-[38px]"
              variant="outline"
              rounded="lg"
              fontSize="sm"
              position="center"
              size="sm"
              onClick={e => {
                e.preventDefault()
                handleCancel()
              }}
              type="button"
            >
              Отменить
            </UIButton>
            <UIButton
              className="h-[38px]"
              disabled={!isEmailValid || email === '' || isLoading}
              type="submit"
              variant="primary"
              shadow="none"
              fontSize="sm"
              rounded="lg"
              size="sm"
              position="center"
              isLoading={isLoading}
            >
              Оплатить
            </UIButton>
          </div>
        </form>
      </SectionContainer>
    </div>
  )
}
