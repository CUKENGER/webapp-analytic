import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react'
import { DirectReportCampaign } from '@/api/types/direct-report-ads.types'
import { DropdownButtons } from '@/components/ui/DropdownButtons'
import { useKeyboardOffset } from '@/hooks/useKeyboardOffset'
import { DirectMenuFilterCampaignItem } from './DirectMenuFilterCampaignItem'
import { DirectMenuFilterHeader } from './DirectMenuFilterHeader'
import { useCampaignFilter } from './useCampaignFilter'

interface PropTypes {
  campaigns: DirectReportCampaign[]
  setSelectedItems: Dispatch<SetStateAction<string[]>>
  selectedItems: string[]
  handleConfirm: () => void
  handleCancel: () => void
  isOpen: boolean
}

export const DirectMenuFilter = ({
  campaigns = [],
  setSelectedItems,
  selectedItems,
  handleCancel,
  handleConfirm,
  isOpen
}: PropTypes) => {
  const [search, setSearch] = useState('')
  const { keyBoardOffset } = useKeyboardOffset()
	const { allItems, filteredCampaigns } = useCampaignFilter(campaigns, search)

  // Переключение всех элементов
  const toggleAll = useCallback(() => {
    setSelectedItems(prev => (prev.length === allItems.length ? [] : allItems))
  }, [setSelectedItems, allItems])

  useEffect(() => {
    if (!isOpen) {
      setSearch('') // Сброс поиска при закрытии меню
    }
  }, [isOpen])

  return (
    <div
      className="relative w-full mx-auto space-y-1 rounded-md shadow-md bg-tg-bg"
      style={{ paddingBottom: keyBoardOffset }}
      data-testid="direct-menu-filter"
    >
      <DirectMenuFilterHeader
        setSearch={setSearch}
        search={search}
        toggleAll={toggleAll}
        selectedItems={selectedItems}
        allItemsLength={allItems.length}
        data-testid="filter-header"
      />
      <div
        className="max-h-[60vh] min-h-[7rem] w-full rounded-lg overflow-y-auto hide-scrollbar"
        data-testid="filter-list"
      >
        <div className="pt-0 space-y-1">
          {filteredCampaigns.length === 0 ? (
            <p data-testid="no-results" className="p-4 text-center text-tg-hint">Ничего не найдено</p>
          ) : (
            filteredCampaigns.map(campaign => (
              <DirectMenuFilterCampaignItem
                campaign={campaign}
                key={campaign.campaignID}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
								data-testid={`campaign-${campaign.campaignID}`}
              />
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
