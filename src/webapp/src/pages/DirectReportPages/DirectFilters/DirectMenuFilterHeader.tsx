import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PropTypes {
  selectedItems: string[]
  toggleAll: () => void
  allItemsLength: number
  search: string
  setSearch: (e: string) => void
}

export const DirectMenuFilterHeader = ({
  selectedItems,
  toggleAll,
  allItemsLength,
  search,
  setSearch
}: PropTypes) => {
  return (
    <div className="flex items-center justify-between gap-4 px-2 pt-2 pb-1">
      <Input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="flex-1 text-base font-medium bg-transparent border-none outline-hidden placeholder:text-tg-hint placeholder:text-base placeholder:font-medium focus-visible:ring-0"
      />
      <Button variant="ghost" onClick={toggleAll}>
        {selectedItems.length === allItemsLength ? 'Очистить' : 'Выбрать все'}
      </Button>
    </div>
  )
}
