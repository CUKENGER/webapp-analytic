import { BlockContainer } from '@/components/@common/BlockContainer'
import { CustomRadioGroup } from '@/components/ui/radio-group'
import { FC, useCallback, useEffect, useState } from 'react'
import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { EditLinkFormState } from '.'
import { ErrorMessage } from '../common'
import { cn } from '@/lib/utils'
import { SingleCalendarTabs } from '@/components/CalendarTabs/SingleCalendarTabs'
import { MyDropdownMenu } from '@/components/MyDropdownMenu/MyDropdownMenu'
import { SectionContainer } from '@/pages/TariffControl/TariffItem'

const periodOptions = [
  { value: 'period_0', label: 'Без ограничения' },
  { value: '3600', label: '1 час' },
  { value: '86400', label: '1 день' },
  { value: '604800', label: '1 неделя' }
]

export const PeriodSelector: FC<{
  period: string
  onPeriodChange: (value: string) => void
  errors: FieldErrors<EditLinkFormState>
  setValue: UseFormSetValue<EditLinkFormState>
  customPeriodDate?: Date | null
}> = ({ period, onPeriodChange, errors, setValue, customPeriodDate }) => {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(customPeriodDate || today)
  const [tempDate, setTempDate] = useState<Date | undefined>(selectedDate)
  const [isOpen, setIsOpen] = useState(period === 'other_period')

  useEffect(() => {
    if (customPeriodDate && period === 'other_period') {
      setSelectedDate(customPeriodDate)
    }
  }, [customPeriodDate, period])

  const formatDate = (date: Date) =>
    date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    const epochSeconds = Math.floor(date.getTime() / 1000)
    setValue('customPeriod', epochSeconds, {
      shouldValidate: true,
      shouldDirty: true
    })
    onPeriodChange('other_period')
  }

  const resetTempDate = useCallback(() => {
    setTempDate(
      selectedDate ? selectedDate : undefined
    )
  }, [selectedDate])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetTempDate() // Сбрасываем tempRange при закрытии
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    resetTempDate()
  }

  useEffect(() => {
    setTempDate(selectedDate) // При каждом изменении selectedDate обновляем tempDate
  }, [selectedDate, setTempDate])

  return (
    <BlockContainer title="Выберите срок действия для этой ссылки." headerBg='darker' itemClassName='pl-0'>
      <div>
        <SectionContainer hasBorder={period === 'other_period' && !!errors.customPeriod?.message}>
          <CustomRadioGroup
            value={period}
            classNameOption='px-4 leading-[1.4]'
            onChange={value => {
              onPeriodChange(value)
              if (value !== 'other_period')
                setValue('customPeriod', null, { shouldValidate: true })
            }}
            showInput={period === 'other_period'}
            className={errors.customPeriod?.message && "mb-2"}
            options={[
              ...periodOptions,
              {
                value: 'other_period',
                label: 'Сброс:',
                customElement: (
                  <MyDropdownMenu
                    className="p-0"
                    containerClassName="p-0 w-full h-6"
                    isOpen={isOpen}
                    onOpenChange={handleOpenChange}
                    content={
                      <div className={cn("absolute right-0 top-0 text-tg-link text-right", period === 'other_period' && errors.customPeriod?.message && 'mb-2')}>
                        {formatDate(selectedDate)}
                      </div>
                    }
                  >
                    <SingleCalendarTabs
                      setSelectedDate={handleDateChange}
                      disabledUntil={today}
                      handleClose={handleClose}
                      setTempDate={setTempDate}
                      tempDate={tempDate}
                    />
                  </MyDropdownMenu>
                )
              }
            ]}
          />
        </SectionContainer>
        {period === 'other_period' && errors.customPeriod?.message && (
          <ErrorMessage message={errors.customPeriod.message} className='mt-2' />
        )}
      </div>
    </BlockContainer>
  )
}
