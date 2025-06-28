import { Dispatch, MouseEvent, useState } from 'react'
import { FilterShowSettings } from '@/components/FilterShow/FilterShowSettings'
import { OptionsIcon } from '@/components/icons/OptionsIcon'
import { MyDropdownMenu } from '@/components/MyDropdownMenu/MyDropdownMenu'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import { cn } from '@/lib/utils'

interface PropTypes {
  handleClickFully: (e: MouseEvent) => void
  exportToPDF: () => void
  exportToCSV: () => void
  exportToXLSX: () => void
  options: FiltersType[]
  selectedColumns: string[]
  setColumns: Dispatch<React.SetStateAction<string[]>>
  isFully: boolean
  className?: string
}

export const DirectTableButton = ({
  handleClickFully,
  exportToPDF,
  exportToCSV,
  exportToXLSX,
  options,
  selectedColumns,
  setColumns,
  isFully,
  className
}: PropTypes) => {
  const [isOpen, setIsOpen] = useState(false)
  const [resetPendingFilters, setResetPendingFilters] = useState<
    (() => void) | undefined
  >(undefined)

  const handleClose = () => {
    resetPendingFilters?.()
    setIsOpen(false)
  }

  const handleCancel = () => {
    handleClose()
  }

  const onConfirm = (pending: string[]) => {
    setColumns(pending)
    handleClose()
  }

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Предотвращаем вызов handleClickFully
    if (!isOpen) setIsOpen(!isOpen)
  }

  return (
    <div className={cn("flex justify-between gap-2 w-full bg-tg-background rounded-b-2xl h-[70px] p-4", className)}>
      <button
        className="text-sm flex-1 text-center border rounded-lg border-table-button-border hover:bg-table-button-hover active:hover:bg-table-button-hover transition-colors duration-300 ease-in-out"
        aria-label="Развернуть таблицу"
        onClick={e => handleClickFully(e)}
        disabled={!isFully}
      >
        <span
          className={cn('font-bold', isFully ? 'text-tg-link' : 'text-gray')}
        >
          Показать всё
        </span>
      </button>
      <div
        className="flex items-center gap-2 h-full flex-shrink-0 border rounded-lg border-table-button-border hover:bg-table-button-hover active:hover:bg-table-button-hover transition-colors duration-300 ease-in-out"
        onClick={handleDropdownClick}
      >
        <MyDropdownMenu
          isOpen={isOpen}
          onOpenChange={handleClose}
          className="p-0"
          containerClassName="p-2 w-full cursor-pointer"
          trigger={
            <div>
              <OptionsIcon />
            </div>
          }
        >
          <FilterShowSettings
            columns={options}
            selectedFilters={selectedColumns}
            onConfirm={onConfirm}
            handleClose={handleClose}
            handleCancel={handleCancel}
            setResetPendingFilters={setResetPendingFilters}
          />
        </MyDropdownMenu>
      </div>
    </div>
  )
}
