import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { Input } from '@/components/ui/input'
import { MyDropdownMenu } from '@/components/ui/MyDropdownMenu'
import { CustomSwitch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Spinner } from '@telegram-apps/telegram-ui'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { ErrorMessage, inputStyles } from '../common'
import { PeriodSelector } from './PeriodSelector'
import { useFormEditLink } from './useFormEditLink'
import { UserLimitSelector } from './UserLimitSelector'
import styles from './EditLinks.module.css'
import { SectionContainer } from '@/pages/TariffControl/TariffItem'
import { PageLayout } from '@/atoms/PageLayout'
import { MainContainerButton } from '@/components/@common/MainContainerButton'
import { UIButton } from '@/components/ui/UIButton'

export interface EditLinkFormState {
  name: string
  isActive: boolean
  isRequest: boolean
  consumption: number
  period: string
  customPeriod?: number | null
  userLimit: string
  customUserLimit?: number | null
}

const EditLinks: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>()
  const {
    handleSubmit,
    onSubmit,
    register,
    setValue,
    errors,
    formValues,
    customPeriodDate,
    isLoading,
    isFormChanged,
    errorEditLink,
    handleRevokeLink,
    isRevokePending,
    setFocus
  } = useFormEditLink(id)
  const [isEditConsumption, setIsEditConsumption] = useState(false)
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false)

  if (!id) return <div>Ссылка не найдена</div>
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-dvh">
        <Spinner size="m" />
      </div>
    )

  const handleRevokeConfirm = (confirmed: boolean) => {
    if (confirmed) {
      handleRevokeLink() // Выполняем сброс только при подтверждении
    }
    setIsRevokeConfirmOpen(false) // Закрываем меню
  }

  return (
    <PageLayout className='bg-tg-secondary'>
      <div className="flex flex-col gap-4 flex-1">
        <BlockTitle title="Редактирование ссылки" className='mb-0'>
          Название ссылки будут видеть только администраторы.
        </BlockTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between flex-1">
          <div className='flex flex-col gap-4'>
            <BlockContainer headerBg='darker' className='mt-0'>
              <div className='py-3'>
                <SectionContainer>
                  <div className="flex items-center justify-between h-[22px] mb-2">
                    <Input
                      placeholder="Введите название (необязательно)"
                      {...register('name')}
                      className={cn(inputStyles, 'p-0 h-[22px] font-bold')}
                    />
                  </div>
                </SectionContainer>
                <SectionContainer hasBorder={false}>
                  <div className='mt-2'>
                    <CustomSwitch
                      onCheckedChange={checked =>
                        setValue('isRequest', checked, {
                          shouldValidate: true,
                          shouldDirty: true
                        })
                      }
                      label="Заявки на вступление"
                      tooltip="Включите, если требуется подтверждение вступления"
                      checked={formValues.isRequest}
                    />
                  </div>
                </SectionContainer>
              </div>
            </BlockContainer>
            <BlockContainer title="Расход для этой ссылки." headerBg='darker'>
              <div className='py-3'>
                <SectionContainer hasBorder={!!errors.consumption?.message}>
                  {isEditConsumption ? (
                    <div className={cn(styles.consumption, "flex items-center justify-between h-[22px]", errors.consumption?.message && "mb-2")}>
                      <Input
                        placeholder="Сумма расхода в рублях"
                        type="number"
                        {...register('consumption')}
                        className={cn(inputStyles, 'p-0 text-base placeholder:text-base')}
                        aria-label="Сумма расхода в рублях"
                        onBlur={() => setIsEditConsumption(false)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-tg-text h-[22px]" onClick={() => { setIsEditConsumption(true); setFocus('consumption') }}>
                      <span className="font-bold">{formValues.consumption} ₽</span>
                    </div>
                  )}
                </SectionContainer>
                <SectionContainer hasBorder={false}>
                  {errors.consumption?.message && (
                    <ErrorMessage message={errors.consumption.message} className='mt-2' />
                  )}
                </SectionContainer>
              </div>
            </BlockContainer>
            <PeriodSelector
              {...formValues}
              errors={errors}
              setValue={setValue}
              onPeriodChange={value =>
                setValue('period', value, {
                  shouldValidate: true,
                  shouldDirty: true
                })
              }
              customPeriodDate={customPeriodDate}
            />
            <UserLimitSelector
              {...formValues}
              errors={errors}
              setValue={setValue}
              onUserLimitChange={value =>
                setValue('userLimit', value, {
                  shouldValidate: true,
                  shouldDirty: true
                })
              }
              customUserLimit={formValues.customUserLimit}
            />

          </div>
          <MainContainerButton>
            <div className='flex w-full flex-col gap-2'>
              {errorEditLink && (
                <ErrorMessage
                  message={errorEditLink.message}
                  className="text-center"
                />
              )}
              <div className="flex flex-col gap-2 small-screen:flex-row">
                <MyDropdownMenu
                  isOpen={isRevokeConfirmOpen}
                  onOpenChange={setIsRevokeConfirmOpen}
                  className="p-0 w-full"
                  containerClassName="p-0 w-full"
                  placement="center"
                  trigger={
                    <UIButton
                      variant="outline"
                      type="button"
                      colorText='red'
                      position='center'
                      isLoading={isRevokePending}
                    >
                      Сбросить
                    </UIButton>
                  }
                >
                  <div className="p-4 flex flex-col gap-2">
                    <h1 className="text-xl text-center text-tg-text">
                      Вы уверены?
                    </h1>
                    <p className="text-center text-tg-hint">
                      Вы уверены, что хотите сбросить ссылку?
                    </p>
                    <div className="flex justify-end gap-2 w-full">
                      <UIButton
                        type="button"
                        variant="outline"
                        size='sm'
                        colorText='red'
                        onClick={() => handleRevokeConfirm(true)}
                      >
                        Сбросить
                      </UIButton>
                      <UIButton
                        type="button"
                        variant="outline"
                        size='sm'
                        onClick={() => handleRevokeConfirm(false)}
                      >
                        Отмена
                      </UIButton>
                    </div>
                  </div>
                </MyDropdownMenu>
                <UIButton
                  variant="outline"
                  type="button"
                  onClick={() => window.history.back()}
                >
                  Отменить
                </UIButton>
              </div>
              <UIButton
                type="submit"
                variant='primary'
                disabled={!isFormChanged}
                isLoading={isLoading}
                disabledStyle='bg'
              >
                Сохранить
              </UIButton>
            </div>
          </MainContainerButton>
        </form>
      </div>
    </PageLayout >
  )
}

export default EditLinks
