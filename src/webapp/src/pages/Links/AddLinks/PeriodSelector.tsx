import React, { useCallback, useEffect, useState } from "react"
import { FieldErrors } from "react-hook-form"
import { BlockContainer } from "@/components/@common/BlockContainer"
import { SingleCalendarTabs } from "@/components/CalendarTabs/SingleCalendarTabs"
import { CustomRadioGroup } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { AddLinkFormState } from "."
import { ErrorMessage } from "../common"
import { MyDropdownMenu } from '@/components/MyDropdownMenu/MyDropdownMenu'
import { SectionContainer } from '@/pages/TariffControl/TariffItem'

const periodOptions = [
  { value: "period_0", label: "Без ограничений" },
  { value: "3600", label: "1 час" },
  { value: "86400", label: "1 день" },
  { value: "604800", label: "1 неделя" },
]

export const PeriodSelector: React.FC<{
  period: string
  onPeriodChange: (value: string) => void
  errors: FieldErrors<AddLinkFormState>
  setValue: (
    name: keyof AddLinkFormState,
    value: any,
    options?: { shouldValidate?: boolean },
  ) => void
}> = ({ period, onPeriodChange, errors, setValue }) => {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [tempDate, setTempDate] = useState<Date | undefined>(selectedDate)
  const [isOpen, setIsOpen] = useState(period === 'custom_period')

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    const formattedDate = date.toLocaleDateString('ru')
    setValue("customPeriod", formattedDate, { shouldValidate: true })
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
    <BlockContainer
      title="Выберите срок действия для этой ссылки."
      headerBg="darker"
      itemClassName='pl-0'
    >
      <div>
        <SectionContainer hasBorder={!!errors.customPeriod?.message}>
          <CustomRadioGroup
            className={errors.customPeriod?.message && "mb-2"}
            value={period}
            classNameOption='px-4 leading-[1.4]'
            onChange={onPeriodChange}
            options={[
              ...periodOptions,
              {
                value: "custom_period",
                label: "Сброс:",
                customElement: (
                  <MyDropdownMenu
                    onOpenChange={handleOpenChange}
                    className="p-0"
                    containerClassName="p-0 w-full h-6"
                    isOpen={isOpen}
                    trigger={
                      <div
                        className={cn(
                          "absolute right-0 transform-translate-y-1/2 text-right top-0 text-tg-link font-bold"
                        )}
                      >
                        {selectedDate.toLocaleDateString('ru')}
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
                ),
              },
            ]}
            showInput={period === "custom_period"}
            onInputChange={(value) =>
              setValue("customPeriod", value, { shouldValidate: true })
            }
          />
        </SectionContainer>
        {errors.customPeriod?.message && (
          <ErrorMessage message={errors.customPeriod.message} className="mt-2" />
        )}
      </div>
    </BlockContainer>
  )
}
