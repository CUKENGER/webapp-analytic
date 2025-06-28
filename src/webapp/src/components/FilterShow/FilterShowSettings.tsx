import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import {
  FiltersType,
  FilterValueType
} from '@/components/ReportTable/ReportTable.types'
import { Button } from '@/components/ui/button'
import { DropdownButtons } from '../ui/DropdownButtons'

export const FilterShowSettings = ({
  selectedFilters,
  columns,
  onConfirm,
  handleClose,
  handleCancel,
  setResetPendingFilters
}: {
  selectedFilters: FilterValueType[]
  columns: FiltersType[]
  onConfirm: (pending: FilterValueType[]) => void
  handleClose: () => void
  handleCancel: () => void
  setResetPendingFilters?: (reset: () => void) => void
}) => {
  const [pendingSelectedFilters, setPendingSelectedFilters] =
    useState(selectedFilters)

  const toggleItem = (value: FilterValueType, e: React.MouseEvent) => {
    e.stopPropagation()
    setPendingSelectedFilters(prev => {
      const newFilters = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
      return newFilters
    })
  }

  useEffect(() => {
    setPendingSelectedFilters(selectedFilters)
    setResetPendingFilters?.(
      () => () => setPendingSelectedFilters(selectedFilters)
    )
  }, [selectedFilters, setResetPendingFilters])

  const handleConfirm = () => {
    onConfirm(pendingSelectedFilters)
    handleClose()
  }

  const handleCancelClick = () => {
    setPendingSelectedFilters(selectedFilters) // Сбрасываем до исходного состояния
    handleCancel()
  }

  const toggleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (pendingSelectedFilters.length === columns.length) {
      // Очистить всё
      setPendingSelectedFilters([])
    } else {
      setPendingSelectedFilters(columns.map(f => f.value))
    }
  }

  // Сбрасываем pendingSelectedFilters при открытии меню
  useEffect(() => {
    setPendingSelectedFilters(selectedFilters)
  }, [selectedFilters])

  return (
    <div className="relative w-full mx-auto space-y-1 rounded-md shadow-md bg-tg-bg">
      <div className="flex items-center justify-between gap-4 px-6 pt-2 pb-1">
        <span className="font-bold">Показывать:</span>
        <Button
          variant="ghost"
          className="px-4 text-sm font-bold transition-colors duration-150 ease-in-out text-tg-link hover:bg-secondary hover:text-tg-primary dark:hover:bg-tg-secondary dark:hover:text-tg-accent active:bg-secondary active:text-tg-accent"
          onClick={toggleSelectAll}
        >
          {pendingSelectedFilters.length === columns.length
            ? 'Очистить'
            : 'Выбрать все'}{' '}
        </Button>
      </div>
      <MultiFilterList
        items={columns}
        selectedItems={pendingSelectedFilters}
        toggleItem={toggleItem}
      />
      <div className="absolute bottom-bottom-btn w-full pointer-events-none h-14 bg-gradient-to-t from-dropdown-shadow-color to-transparent"></div>
      <DropdownButtons
        handleCancel={handleCancelClick}
        handleConfirm={handleConfirm}
      />
    </div>
  )
}

const MultiFilterList = ({
  items,
  selectedItems,
  toggleItem
}: {
  items: FiltersType[]
  selectedItems: string[]
  toggleItem: (id: FilterValueType, e: React.MouseEvent) => void
}) => {
  return (
    <div className="max-h-[60vh] min-h-[7rem] w-full rounded-lg overflow-y-auto hide-scrollbar">
      <div className="pt-0 space-y-1">
        <div className="space-y-1">
          <div className="border-t border-gray-stroke w-full max-w-[calc(100%-1.5rem)] ml-3" />
          <div className="space-y-1 px-4 mt-0 pt-0 divide-y-[1px] divide-gray-stroke pb-2">
            {items.map(({ label, value }) => {
              const isSelected = selectedItems.includes(value)
              return (
                <button
                  key={value}
                  onClick={e => toggleItem(value, e)}
                  className="flex items-center justify-between w-full gap-2 p-2 font-medium text-left rounded-sm hover:bg-tg-secondary whitespace-nowrap"
                >
                  <span
                    className={`truncate w-[90%] ${isSelected ? 'text-tg-text' : 'text-tg-hint'}`}
                  >
                    {label}
                  </span>
                  {isSelected && <Check className="w-5 h-5 text-tg-link" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
