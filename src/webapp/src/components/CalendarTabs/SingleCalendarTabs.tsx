import { useCallback, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DropdownButtons } from '../ui/DropdownButtons'
import { CustomDayCalendar } from './RangeCalendars/CustomDayCalendar'
import { TabsContainer } from './TabsContainer/TabsContainer'

export const SingleCalendarTabs = ({
  setSelectedDate,
  disabledUntil,
  disabledAfter,
  selectedDate,
  initialScrollDate,
  handleClose,
  tempDate,
  setTempDate
}: {
  setSelectedDate: (date: Date) => void
  disabledUntil?: Date
  disabledAfter?: Date
  selectedDate?: Date // Унифицируем как range
  initialScrollDate?: Date
  handleClose?: () => void
  tempDate?: Date
  setTempDate: (date: Date | undefined) => void
}) => {
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const handleRangeSelect = useCallback(
    (range: DateRange) => {
      const to = range.from || new Date()
      to.setHours(0, 0, 0, 0)
      setTempDate(to)
      setActiveTab(null)
    },
    [setTempDate]
  )

  const handleConfirm = () => {
    if (tempDate) {
      setSelectedDate(tempDate)
    }
    handleClose?.()
  }

  const handleLocalCancel = () => {
    setTempDate(selectedDate ? selectedDate : undefined)
    handleClose?.()
  }

  const renderCalendar = () => {
    const props = {
      onRangeSelect: handleRangeSelect,
      mode: 'single' as const,
      disabledUntil,
      disabledAfter,
      selectedDate: tempDate,
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
        isSingleMode={true}
      />
      <div className="flex flex-wrap justify-center h-[60vh]">
        <div className="absolute bottom-bottom-btn w-full pointer-events-none h-14 bg-gradient-to-t from-dropdown-shadow-color to-transparent"></div>
        {renderCalendar()}
      </div>
      <DropdownButtons
        handleCancel={handleLocalCancel}
        handleConfirm={handleConfirm}
        disabled={!tempDate}
      />
    </div>
  )
}
