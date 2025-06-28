import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { ChevronIcon } from '@/components/icons/ChevronIcon'
import { MyDropdownMenu } from '@/components/MyDropdownMenu/MyDropdownMenu'
import { Button } from '@/components/ui/button'
import { DropdownButtons } from '@/components/ui/DropdownButtons'
import { Input } from '@/components/ui/input'

interface ItemType {
  value: string
  label: string
}

interface PropTypes {
  selectedItems: string[]
  setSelectedItems: Dispatch<SetStateAction<string[]>>
  items: ItemType[]
}

export const MenuFilter = ({
  items,
  selectedItems,
  setSelectedItems
}: PropTypes) => {
  const [localSelectedItems, setLocalSelectedItems] = useState(selectedItems)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLocalSelectedItems(selectedItems)
  }, [selectedItems])

  const selectedLabels = items
    .filter(item => selectedItems.includes(item.value))
    .map(item => item.label)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleDropdownClose = (open: boolean) => {
    setLocalSelectedItems(selectedItems)
    setIsOpen(open)
  }

  const handleConfirm = () => {
    setSelectedItems(localSelectedItems)
    handleClose()
  }

  const handleCancel = () => {
    setLocalSelectedItems(selectedItems)
    handleClose()
  }

  return (
    <MyDropdownMenu
      isOpen={isOpen}
      onOpenChange={handleDropdownClose}
      containerClassName="w-full"
      className="py-3 h-[46px]"
      count={selectedItems.length || '0'}
      icon={isOpen => (
        <ChevronIcon
          className={`flex-shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? '-rotate-90' : 'rotate-90'
          }`}
        />
      )}
      content={
        <p className="truncate">{selectedLabels.join(', ') || 'Не выбрано'}</p>
      }
    >
      {items && (
        <MenuWithSearch
          items={items}
          selectedItems={localSelectedItems}
          setSelectedItems={setLocalSelectedItems}
          handleCancel={handleCancel}
          handleConfirm={handleConfirm}
          isOpen={isOpen}
        />
      )}
    </MyDropdownMenu>
  )
}

interface MenuWithSearchProps {
  items: ItemType[]
  selectedItems: string[]
  setSelectedItems: Dispatch<SetStateAction<string[]>>
  isOpen: boolean
  handleCancel: () => void
  handleConfirm: () => void
}

const MenuWithSearch = ({
  items,
  selectedItems,
  setSelectedItems,
  isOpen,
  handleCancel,
  handleConfirm
}: MenuWithSearchProps) => {
  const [search, setSearch] = useState('')

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggleAll = () => {
    setSelectedItems(prev =>
      prev.length === items.length ? [] : items.map(item => item.value)
    )
  }

  const toggleItem = (value: string) => {
    setSelectedItems(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  useEffect(() => {
    if (!isOpen) setSearch('')
  }, [isOpen])

  return (
    <div className="relative w-full mx-auto space-y-1 rounded-md shadow-md bg-tg-bg">
      <div className="flex items-center justify-between gap-4 px-2 pt-2 pb-1">
        <Input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 text-base font-medium bg-transparent border-none outline-hidden placeholder:text-tg-hint placeholder:text-base placeholder:font-medium focus-visible:ring-0"
        />
        <Button variant="ghost" onClick={toggleAll}>
          {selectedItems.length === items.length ? 'Очистить' : 'Выбрать все'}
        </Button>
      </div>
      <div className="h-[1px] bg-gray-stroke w-full"></div>

      <div className="max-h-svh min-h-[7rem] w-full rounded-lg overflow-y-auto hide-scrollbar pb-0">
        <div className="pt-0 space-y-1 px-4">
          {filteredItems.length === 0 ? (
            <p className="p-4 text-center text-tg-hint">Ничего не найдено</p>
          ) : (
            filteredItems.map(item => (
              <div key={item.value} className="space-y-1">
                <button
                  onClick={() => toggleItem(item.value)}
                  className="flex items-center justify-between w-full p-4 py-2 text-left rounded-sm hover:bg-tg-secondary"
                >
                  <h2
                    className={`text-base font-bold text-tg-hint ${selectedItems.includes(item.value) && `text-tg-text`}`}
                  >
                    {item.label}
                  </h2>
                  {selectedItems.includes(item.value) && (
                    <Check className="w-5 h-5 text-tg-link" />
                  )}
                </button>
                <div className="h-[1px] bg-gray-stroke w-full"></div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="absolute bottom-bottom-btn w-full pointer-events-none h-14 bg-gradient-to-t from-dropdown-shadow-color to-transparent"></div>
      <DropdownButtons
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
      />
    </div>
  )
}
