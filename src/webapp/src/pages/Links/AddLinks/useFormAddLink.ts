import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { yupResolver } from '@hookform/resolvers/yup'
import { useCreateInviteLink } from '@/api/hooks/useCreateInviteLink'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import { AddLinkSchema } from '@/pages/Links/AddLinks/AddLinkSchema'
import { AddLinkFormState } from '@/pages/Links/AddLinks/index'

export const UseAddLinksForm = () => {
  const {id: channelUUID} = useParams<{ id: string }>()
  const { rtab } = useSearchState()
  const [searchParams] = useSearchParams()
  const { mutate, isPending, isSuccess } = useCreateInviteLink()
  const navigate = useNavigate()
  const initialValues: AddLinkFormState = {
    name: '',
    isRequest: false,
    consumption: undefined,
    period: 'period_0',
    customPeriod: 'Никогда',
    userLimit: 'user_limit_0',
    customUserLimit: 'Не ограничено'
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AddLinkFormState>({
    resolver: yupResolver(AddLinkSchema),
    defaultValues: initialValues
  })

  const period = watch('period')
  const userLimit = watch('userLimit')
  const isRequest = watch('isRequest')

  useEffect(() => {
    if (isSuccess) {
      navigate({
        pathname: '/direct',
        search: searchParams.toString()
      })
    }
  }, [isSuccess])

  const onSubmit = useCallback(
    (data: AddLinkFormState) => {
      let expire_date: number | undefined

      // Обработка периода
      if (data.period === 'custom_period' && data.customPeriod) {
        const [day, month, year] = data.customPeriod.split('.')
        const date = new Date(`${year}-${month}-${day}`)
        const now = new Date()
        if (!isNaN(date.getTime())) {
          // Проверка на валидность даты
          expire_date = Math.floor((date.getTime() - now.getTime()) / 1000)
        } else {
          console.error('Invalid date format:', data.customPeriod)
          expire_date = undefined
        }
      } else if (data.period === 'period_0') {
        expire_date = 0 // Без ограничений
      } else {
        expire_date = Number(data.period) // Фиксированное значение в секундах
      }

      // Преобразование member_limit
      let member_limit: number | undefined
      if (data.userLimit === 'user_limit_0' || data.userLimit === 'custom_limit') {
        // Используем customUserLimit для '0' или 'custom_limit'
        if (data.customUserLimit === 'Не ограничено') {
          member_limit = 0
        } else {
          member_limit = Number(data.customUserLimit) // Числовое значение из customUserLimit
        }
      } else {
        member_limit = Number(data.userLimit) // Фиксированное значение (1, 10, 100 и т.д.)
      }

      const requestData = {
        channelUUID,
        name: data.name || undefined,
        expire_date,
        member_limit,
        creates_join_request: data.isRequest,
        cost: data.consumption !== undefined ? Number(data.consumption) : undefined,
      }

      if (!channelUUID) {
        return
      }

      mutate({
        ...requestData,
        channelUUID
      }) // Отправка запроса
    },
    [channelUUID, mutate]
  )

  return {
    handleSubmit,
    onSubmit,
    register,
    setValue,
    errors,
    formValues: { period, userLimit, isRequest },
    isLoading: isPending
  }
}
