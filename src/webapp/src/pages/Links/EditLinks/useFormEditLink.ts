import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import { yupResolver } from '@hookform/resolvers/yup'
import { isEqual } from 'lodash'
import { useEditInviteLink } from '@/api/hooks/useEditInviteLink'
import { useGetInviteLinkById } from '@/api/hooks/useGetInviteLinkById'
import { useRevokeInviteLink } from '@/api/hooks/useRevokeInviteLink'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import { EditLinkFormState } from '@/pages/Links/EditLinks/index'
import { EditLinkSchema } from './EditLinkSchema'
import {
  getCustomPeriodValue,
  getCustomUserLimitValue,
  getPeriodValue,
  getUserLimitValue
} from './utils'

export const useFormEditLink = (linkId: string) => {
  const { rtab } = useSearchState()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { mutate, isPending, error: errorEditLink } = useEditInviteLink()
  const { data: linkData, isLoading: isLinkLoading } =
    useGetInviteLinkById(linkId)
  const { mutate: revokeInviteLink, isPending: isRevokePending } =
    useRevokeInviteLink()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues = useMemo(() => {
    if (!linkData) return {} as EditLinkFormState // Защита от undefined
    return {
      name: linkData.name || '',
      isActive: !linkData.is_revoked,
      isRequest: linkData.creates_join_request ?? false,
      consumption: linkData.cost || 0,
      period: getPeriodValue(linkData.expire_date),
      customPeriod: getCustomPeriodValue(linkData.expire_date),
      userLimit: getUserLimitValue(linkData.member_limit),
      customUserLimit: getCustomUserLimitValue(linkData.member_limit)
    }
  }, [linkData])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
    setFocus
  } = useForm<EditLinkFormState>({
    resolver: yupResolver(EditLinkSchema),
    defaultValues,
    mode: 'onChange'
  })

  useEffect(() => {
    if (linkData && !isLinkLoading) {
      reset(prev => (isEqual(prev, defaultValues) ? prev : defaultValues))
    }
  }, [linkData, isLinkLoading, reset, defaultValues])

  const formValues = watch()
  const customPeriodDate = formValues.customPeriod
    ? new Date(formValues.customPeriod * 1000)
    : null

  const onSubmit = useCallback(
    (data: EditLinkFormState) => {
      const now = Math.floor(Date.now() / 1000)
      const maxExpireDate = now + 31536000
      let expire_date =
        data.period === 'period_0'
          ? 0
          : data.period === 'other_period' && data.customPeriod
            ? Number(data.customPeriod)
            : now + Number(data.period)

      if (expire_date > maxExpireDate) {
        expire_date = maxExpireDate
      }

      const member_limit =
        data.userLimit === 'user_limit_0'
          ? 0
          : data.userLimit === 'other_users' && data.customUserLimit
            ? Number(data.customUserLimit)
            : Number(data.userLimit)

      const requestData = {
        id: linkId,
        name: data.name || undefined,
        expire_date,
        member_limit,
        creates_join_request: data.isRequest,
        cost: Number(data.consumption),
        is_revoked: !data.isActive
      }

      console.log('requestData', requestData)
      mutate(requestData, {
        onSuccess: () => {
          setIsSubmitting(true)
          navigate(
            { pathname: '/direct', search: searchParams.toString() },
            { replace: true }
          )
        },
        onError: error => {
          console.error('Mutation error:', error) // Логируем ошибки
        }
      })
    },
    [linkId, mutate, navigate, searchParams]
  )

  const handleRevokeLink = () => {
    revokeInviteLink(
      { id: linkId },
      {
        onSuccess: () => {
          navigate(
            { pathname: '/direct', search: searchParams.toString() },
            { replace: true }
          )
        }
      }
    )
  }

  return {
    handleSubmit,
    onSubmit,
    register,
    setValue,
    errors,
    formValues,
    customPeriodDate,
    isLoading: isPending || isLinkLoading || isSubmitting,
    isFormChanged: isDirty,
    errorEditLink,
    handleRevokeLink,
    isRevokePending,
    setFocus
  }
}
