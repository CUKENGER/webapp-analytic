import { BlockContainer } from '@/components/@common/BlockContainer'
import { BlockTitle } from '@/components/@common/BlockTitle'
import { Input } from '@/components/ui/input'
import { CustomSwitch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { ErrorMessage, inputStyles } from '../common'
import { PeriodSelector } from './PeriodSelector'
import { UseAddLinksForm } from './useFormAddLink'
import { UserLimitSelector } from './UserLimitSelector'
import { SectionContainer } from '@/pages/TariffControl/TariffItem'
import { PageLayout } from '@/atoms/PageLayout'
import { MainContainerButton } from '@/components/@common/MainContainerButton'
import { UIButton } from '@/components/ui/UIButton'

export interface AddLinkFormState {
  name: string
  isRequest: boolean
  consumption?: number
  period: string
  customPeriod?: string
  userLimit: string
  customUserLimit?: number | string
}

const AddLinks: React.FC = () => {
  const {
    handleSubmit,
    onSubmit,
    register,
    setValue,
    errors,
    formValues,
    isLoading
  } = UseAddLinksForm()

  return (
    <PageLayout className='bg-tg-secondary'>
      <div className="flex flex-col flex-grow gap-4">
        <BlockTitle title="Новая ссылка" className='mb-0'>
          Название ссылки будут видеть только администраторы.
        </BlockTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between flex-grow">
          <div className='flex flex-col gap-4'>
            <BlockContainer headerBg='darker' className='mt-0'>
              <div className='py-3'>
                <SectionContainer>
                  <Input
                    placeholder="Введите название (необязательно)"
                    {...register('name')}
                    className={cn(inputStyles, 'p-0 h-[22px] mb-2')}
                  />
                </SectionContainer>
                <SectionContainer hasBorder={false}>
                  <div className="mt-2">
                    <CustomSwitch
                      onCheckedChange={checked =>
                        setValue('isRequest', checked, { shouldValidate: true })
                      }
                      label="Заявки на вступление"
                      tooltip="Включите, если требуется подтверждение вступления"
                    />
                  </div>
                </SectionContainer>
              </div>
            </BlockContainer>
            <BlockContainer title="Расход для этой ссылки." headerBg='darker' className=''>
              <div className='py-3'>
                <SectionContainer hasBorder={!!errors.consumption?.message}>
                  <Input
                    placeholder="Сумма расхода в рублях"
                    type="number"
                    {...register('consumption')}
                    className={cn(inputStyles, 'p-0 text-base placeholder:text-base', errors.consumption?.message && "mb-2")}
                    aria-label="Сумма расхода в рублях"
                  />
                </SectionContainer>
                <SectionContainer hasBorder={false}>
                  {errors.consumption?.message && (
                    <ErrorMessage message={errors.consumption.message} className='mt-2' />
                  )}
                </SectionContainer>
              </div>
            </BlockContainer>
            <PeriodSelector
              period={formValues.period}
              onPeriodChange={value =>
                setValue('period', value, { shouldValidate: true })
              }
              errors={errors}
              setValue={setValue}
            />
            <UserLimitSelector
              userLimit={formValues.userLimit}
              onUserLimitChange={value =>
                setValue('userLimit', value, { shouldValidate: true })
              }
              isRequest={formValues.isRequest}
              errors={errors}
              setValue={setValue}
            />
          </div>
          <MainContainerButton>
            <div className="flex flex-col gap-2 mx-auto small-screen:flex-row">
              <UIButton
                variant="outline"
                type="button"
                className='h-[56px]'
                onClick={() => window.history.back()}
              >
                Отменить
              </UIButton>
              <UIButton
                type="submit"
                variant='primary'
                className='h-[56px]'
                isLoading={isLoading}
                position='center'
                disabledStyle='bg'
              >
                Добавить
              </UIButton>
            </div>
          </MainContainerButton>
        </form>
      </div>
    </PageLayout>
  )
}

export default AddLinks
