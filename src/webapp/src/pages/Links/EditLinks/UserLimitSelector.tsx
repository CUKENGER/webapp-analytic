import React from 'react'
import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { BlockContainer } from '@/components/@common/BlockContainer'
import { Input } from '@/components/ui/input'
import { CustomRadioGroup } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { EditLinkFormState } from '.'
import { ErrorMessage, inputStyles } from '../common'
import { SectionContainer } from '@/pages/TariffControl/TariffItem'

const userLimitOptions = [
  { value: 'user_limit_0', label: 'Без ограничения' },
  { value: '1', label: '1' },
  { value: '10', label: '10 ' },
  { value: '100', label: '100' }
]

export const UserLimitSelector: React.FC<{
  userLimit: string
  onUserLimitChange: (value: string) => void
  isRequest: boolean
  errors: FieldErrors<EditLinkFormState>
  setValue: UseFormSetValue<EditLinkFormState>
  customUserLimit?: number | null
}> = ({
  userLimit,
  onUserLimitChange,
  isRequest,
  errors,
  setValue,
  customUserLimit
}) => {
    if (isRequest) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.value === '' ? null : Number(e.target.value.replace(/\D/g, ''))
      setValue('customUserLimit', value, {
        shouldValidate: true,
        shouldDirty: true
      })
    }

    return (
      <BlockContainer title="Выберите сколько пользователей смогут присоединиться по этой ссылке." headerBg='darker' itemClassName='pl-0'>
        <div>
          <SectionContainer hasBorder={userLimit === 'other_users' && !!errors.customUserLimit?.message}>
            <CustomRadioGroup
              value={userLimit}
              classNameOption='px-4 leading-[1.4]' 
              onChange={value => {
                onUserLimitChange(value)
                if (value !== 'other_users')
                  setValue('customUserLimit', null, {
                    shouldValidate: true,
                    shouldDirty: true
                  })
              }}
              options={[
                ...userLimitOptions,
                {
                  value: 'other_users',
                  label: 'Участников:',
                  customElement: (
                    <Input
                      type="number"
                      value={customUserLimit !== null ? customUserLimit : ''}
                      onChange={handleChange}
                      placeholder="Введите число пользователей"
                      className={cn(
                        inputStyles,
                        'text-tg-link font-bold placeholder:text-tg-hint placeholder:font-normal text-end p-0 h-[24px]',
                        userLimit === 'other_users' && errors.customUserLimit?.message && 'mb-2'
                      )}
                      disabled={userLimit !== 'other_users'}
                    />
                  )
                }
              ]}
              showInput={userLimit === 'other_users'}
            />
          </SectionContainer>
          {userLimit === 'other_users' && errors.customUserLimit?.message && (
            <ErrorMessage message={errors.customUserLimit.message} className='mt-2' />
          )}
        </div>
      </BlockContainer>
    )
  }
