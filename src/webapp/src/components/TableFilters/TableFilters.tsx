import { Dispatch, SetStateAction } from 'react'
import { MenuFilter } from '@/pages/Audience/components/MenuFilter'
import { PeriodFilter } from '@/pages/Audience/components/PeriodFilter'

interface PropTypes {
  selectedRange: { from: string; to: string }
  setSelectedRange: (range: { from: string; to: string }) => void
  selectedItems: string[]
  setSelectedItems: Dispatch<SetStateAction<string[]>>
  initialItems: { value: string; label: string }[]
  titleMenu: string
  titlePeriod?: string
}

export const TableFilters = ({
  setSelectedItems,
  selectedItems,
  setSelectedRange,
  selectedRange,
  initialItems,
}: PropTypes) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <PeriodFilter
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
      />
      <MenuFilter
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        items={initialItems}
      />
    </div>
  )
}
