import { useCallback, useState } from 'react'
import { formatDate } from 'date-fns'
import { CalendarTabs } from '@/components/CalendarTabs/CalendarTabs'
import { CalendarIcon } from '@/components/icons/CalendarIcon'
import { ChevronIcon } from '@/components/icons/ChevronIcon'
import { MyDropdownMenu } from '@/components/ui/MyDropdownMenu'

type PropTypes = {
  selectedRange: { from: string; to: string }
  setSelectedRange: (range: { from: string; to: string }) => void
}

export const PeriodFilter = ({
  setSelectedRange,
  selectedRange
}: PropTypes) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempRange, setTempRange] = useState<
    { from: Date; to: Date } | undefined
  >(() =>
    selectedRange
      ? { from: new Date(selectedRange.from), to: new Date(selectedRange.to) }
      : undefined
  )

  const formatDateRange = (range: { from: string; to: string } | null) => {
    if (!range?.from || !range?.to) return 'Не выбран период'
    return `${formatDate(range.from, 'dd.MM.yy')} – ${formatDate(range.to, 'dd.MM.yy')}`
  }

  const resetTempRange = useCallback(() => {
    setTempRange(
      selectedRange
        ? { from: new Date(selectedRange.from), to: new Date(selectedRange.to) }
        : undefined
    )
  }, [selectedRange])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      resetTempRange() // Сбрасываем tempRange при закрытии
    }
  }

  return (
    <MyDropdownMenu
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      className="p-0 w-full"
      containerClassName="p-0 w-full"
      trigger={
        <button className="bg-tg-background rounded-2xl px-4 py-3 w-full h-[46px]">
          <div className="flex items-center w-full">
            <CalendarIcon />
            <span className="flex-1 text-start pl-2 font-bold">
              {formatDateRange({
                from: selectedRange.from,
                to: selectedRange.to
              })}
            </span>
            <ChevronIcon
              className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? '-rotate-90' : 'rotate-90'
                }`}
            />
          </div>
        </button>
      }
    >
      <CalendarTabs
        setSelectedRange={setSelectedRange}
        selectedDate={selectedRange}
        handleClose={() => setIsOpen(false)}
        tempRange={tempRange}
        setTempRange={setTempRange}
        disabledAfter={new Date()}
      />
    </MyDropdownMenu>
  )
}
