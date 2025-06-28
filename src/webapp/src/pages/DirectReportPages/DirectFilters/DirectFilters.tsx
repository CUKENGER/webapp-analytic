import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { DirectReportCampaign } from '@/api/types/direct-report-ads.types'
import { ChevronIcon } from '@/components/icons/ChevronIcon'
import { ListIcon } from '@/components/icons/ListIcon'
import { MyDropdownMenu } from '@/components/MyDropdownMenu/MyDropdownMenu'
import { PeriodFilter } from '@/pages/Audience/components/PeriodFilter'
import { DirectMenuFilter } from '@/pages/DirectReportPages/DirectFilters/DirectMenuFilter'

interface DirectFiltersProps {
  selectedRange: { from: string; to: string }
  selectedAds: string[]
  setSelectedAds: Dispatch<SetStateAction<string[]>>
  setSelectedRange: (range: { from: string; to: string }) => void
  campaigns: DirectReportCampaign[] | undefined
}

export const DirectFilters = (props: DirectFiltersProps) => {
  const {
    selectedRange,
    selectedAds,
    setSelectedAds,
    setSelectedRange,
    campaigns
  } = props
  const [localSelectedAds, setLocalSelectedAds] =
    useState<string[]>(selectedAds)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLocalSelectedAds(selectedAds)
  }, [selectedAds])

  const handleMenuToggle = (open: boolean) => {
    setLocalSelectedAds(selectedAds)
    setIsOpen(open)
  }

  const getDisplayAdIds = (ads: string[]) => {
    if (!ads.length) return 'Не выбрано'
    // Извлекаем adID из campaignID:adID и объединяем через запятую
    const adIds = ads.map(ad => ad.split(':')[1]).filter(Boolean)
    return adIds.length > 0 ? adIds.join(', ') : 'Не выбрано'
  }

  const displaySelectedAds = () => {
    return getDisplayAdIds(selectedAds)
  }

  return (
    <div className="flex flex-col gap-2 instructions-screen:flex-row instructions-screen:gap-4">
      <div className="w-full instructions-screen:w-[calc(50%-0.5rem)]">
        <PeriodFilter
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
        />
      </div>
      <div className="w-full instructions-screen:w-[calc(50%-0.5rem)]">
        <MyDropdownMenu
          isOpen={isOpen}
          onOpenChange={handleMenuToggle}
          containerClassName="max-w-full"
          classNameContainerContent="max-w-full"
          className="py-3 h-[46px]"
          count={selectedAds.length.toString()}
          icon={isOpen => (
            <ChevronIcon
              className={`flex-shrink-0 ml-2 transition-transform duration-200 ${
                isOpen ? '-rotate-90' : 'rotate-90'
              }`}
            />
          )}
          content={
            <div className="flex gap-2 truncate">
              <ListIcon />
              <p className="truncate">{displaySelectedAds()}</p>
            </div>
          }
        >
          {campaigns && (
            <DirectMenuFilter
              campaigns={campaigns}
              selectedItems={localSelectedAds}
              setSelectedItems={setLocalSelectedAds}
              handleCancel={() => {
                setLocalSelectedAds(selectedAds)
                setIsOpen(false)
              }}
              handleConfirm={() => {
                setSelectedAds(localSelectedAds)
                setIsOpen(false)
              }}
              isOpen={isOpen}
            />
          )}
        </MyDropdownMenu>
      </div>
    </div>
  )
}
