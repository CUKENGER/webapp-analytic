import { useCallback, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { formatDate } from 'date-fns'
import { DropdownButtons } from '../ui/DropdownButtons'
import { DateRangeType } from './common/types'
import { CustomDayCalendar } from './RangeCalendars/CustomDayCalendar'
import { TabsContainer } from './TabsContainer/TabsContainer'

export const CalendarTabs = ({
  setSelectedRange,
  disabledUntil,
  disabledAfter,
  selectedDate,
  initialScrollDate,
  handleClose,
  tempRange,
  setTempRange
}: {
  setSelectedRange: (range: { from: string; to: string }) => void
  disabledUntil?: Date
  disabledAfter?: Date
  selectedDate?: { from: string; to: string } // Унифицируем как range
  initialScrollDate?: Date
  handleClose?: () => void
  tempRange?: DateRangeType
  setTempRange: (range: { from: Date; to: Date } | undefined) => void
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const handleRangeSelect = useCallback(
    (range: DateRange) => {
      const from = range.from || new Date()
      const to = range.to || from
      from.setHours(0, 0, 0, 0)
      to.setHours(0, 0, 0, 0)
      setTempRange({
        from: from > to ? to : from, // Если from больше to, меняем местами
        to: from > to ? from : to
      })
      setActiveTab(null)
    },
    [setTempRange]
  )

  const handleConfirm = () => {
    if (tempRange?.from && tempRange?.to) {
      setSelectedRange({
        from: formatDate(tempRange.from, 'yyyy-MM-dd'),
        to: formatDate(tempRange.to, 'yyyy-MM-dd')
      })
    }
    handleClose?.()
  }

  const handleLocalCancel = () => {
    setTempRange(
      selectedDate
        ? { from: new Date(selectedDate.from), to: new Date(selectedDate.to) }
        : undefined
    )
    handleClose?.()
  }

  const renderCalendar = () => {
    const props = {
      onRangeSelect: handleRangeSelect,
      mode: 'range' as const,
      disabledUntil,
      disabledAfter,
      selectedDate: tempRange,
      initialScrollDate
    }

    return <CustomDayCalendar {...props} />
  }

  return (
    <div>
      <TabsContainer
        handleRangeSelect={handleRangeSelect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex flex-wrap justify-center h-[60vh]">
        <div className="absolute bottom-bottom-btn w-full pointer-events-none h-14 bg-gradient-to-t from-dropdown-shadow-color to-transparent"></div>
        {renderCalendar()}
      </div>
      <DropdownButtons
        handleCancel={handleLocalCancel}
        handleConfirm={handleConfirm}
        disabled={!tempRange?.from || !tempRange?.to}
      />
    </div>
  )
}
