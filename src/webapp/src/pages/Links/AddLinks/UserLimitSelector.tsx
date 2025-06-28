import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { BlockContainer } from '@/components/@common/BlockContainer'
import { Input } from '@/components/ui/input'
import { CustomRadioGroup } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { AddLinkFormState } from '.'
import { ErrorMessage, inputStyles } from '../common'
import { SectionContainer } from '@/pages/TariffControl/TariffItem'

const userLimitOptions = [
  { value: 'user_limit_0', label: 'Без ограничений' },
  { value: '1', label: '1' },
  { value: '10', label: '10' },
  { value: '100', label: '100' }
]

export const UserLimitSelector: React.FC<{
  userLimit: string
  onUserLimitChange: (value: string) => void
  isRequest: boolean
  errors: FieldErrors<AddLinkFormState>
  setValue: UseFormSetValue<AddLinkFormState>
}> = ({ userLimit, onUserLimitChange, isRequest, errors, setValue }) => {
  if (isRequest) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Оставляем только цифры
    setValue('customUserLimit', value, { shouldValidate: true })
  }

  return (
    <BlockContainer headerBg='darker' title="Выберите сколько пользователей смогут присоединиться по этой ссылке." itemClassName='pl-0'>
      <div>
        <SectionContainer hasBorder={userLimit === 'custom_limit' && !!errors.customUserLimit?.message}>
          <CustomRadioGroup
            value={userLimit}
            classNameOption='px-4 leading-[1.4]'
            onChange={value => {
              onUserLimitChange(value)
            }}
            className={cn(userLimit === 'custom_limit' && errors.customUserLimit?.message && 'mb-2')}
            options={[
              ...userLimitOptions,
              {
                value: 'custom_limit',
                label: 'Участников:',
                customElement: (
                  <Input
                    onChange={handleChange}
                    type="number"
                    placeholder="Введите число пользователей"
                    min={1}
                    className={cn(
                      inputStyles,
                      'text-tg-link font-bold placeholder:font-bold text-end p-0 h-[24px]'
                    )}
                  />
                )
              }
            ]}
            showInput={userLimit === 'custom_limit'}
            onInputChange={value => setValue('customUserLimit', value, { shouldValidate: true })}
          />
        </SectionContainer>
        {userLimit === 'custom_limit' && errors.customUserLimit?.message && (
          <ErrorMessage message={errors.customUserLimit.message} className='mt-2' />
        )}
      </div>
    </BlockContainer>
  )
}
