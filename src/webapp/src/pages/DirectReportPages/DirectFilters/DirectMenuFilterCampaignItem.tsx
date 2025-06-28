import { Dispatch, memo, SetStateAction, useCallback } from 'react'
import { Check } from 'lucide-react'
import {
  DirectReportAd,
  DirectReportCampaign
} from '@/api/types/direct-report-ads.types'

interface PropTypes {
  campaign: DirectReportCampaign
  selectedItems: string[]
  setSelectedItems: Dispatch<SetStateAction<string[]>>
}

export const DirectMenuFilterCampaignItem = memo(
  ({ campaign, selectedItems, setSelectedItems }: PropTypes) => {
    const allCampaignAds = campaign.ads.map(
      ad => `${campaign.campaignID}:${ad.adID}`
    )
    const isCampaignFullySelected = allCampaignAds.every(ad =>
      selectedItems.includes(ad)
    )

    const toggleCampaign = () => {
      setSelectedItems(prev => {
        if (isCampaignFullySelected) {
          return prev.filter(sel => !allCampaignAds.includes(sel))
        } else {
          const newItems = allCampaignAds.filter(ad => !prev.includes(ad))
          return [...prev, ...newItems]
        }
      })
    }

    // Переключение одного элемента
    const toggleItem = useCallback(
      (adID: string) => {
        const uniqueAdID = `${campaign.campaignID}:${adID}`
        setSelectedItems(prev => {
          if (prev.includes(uniqueAdID)) {
            return prev.filter(sel => sel !== uniqueAdID)
          } else {
            return [...prev, uniqueAdID]
          }
        })
      },
      [setSelectedItems]
    )

    return (
      <div className="space-y-1">
        <div className="h-[1px] bg-gray-stroke w-full"></div>
        <button
          onClick={toggleCampaign}
          className="flex items-center justify-between w-full p-4 py-2 text-left rounded-sm hover:bg-tg-secondary pr-5"
        >
          <h2 className="text-base font-bold text-tg-text max-w-[90%] truncate">
            {campaign.campaignName}
          </h2>
          {isCampaignFullySelected && (
            <Check className="w-5 h-5 text-tg-link" />
          )}
        </button>
        <div className="border-t border-gray-stroke w-full max-w-[calc(100%-1.5rem)] ml-3" />
        <div className="space-y-1 pl-6 pr-3 mt-0 pt-0 divide-y-[1px] divide-gray-stroke">
          {campaign.ads.map(item => (
            <AdItem
              key={`${campaign.campaignID}:${item.adID}`}
              item={item}
              selectedItems={selectedItems}
              toggleItem={() => toggleItem(item.adID)}
              campaignID={campaign.campaignID}
            />
          ))}
        </div>
      </div>
    )
  }
)

const AdItem = memo(
  ({
    item,
    selectedItems,
    toggleItem,
    campaignID
  }: {
    item: DirectReportAd
    selectedItems: string[]
    toggleItem: () => void
    campaignID: string
  }) => {
    const isSelected = selectedItems.includes(`${campaignID}:${item.adID}`)

    return (
      <button
        onClick={toggleItem}
        className="flex items-center justify-between w-full gap-2 p-2 font-medium text-left rounded-sm hover:bg-tg-secondary whitespace-nowrap"
      >
        <span
          className={`truncate w-[90%] ${isSelected ? 'text-tg-text' : 'text-tg-hint'}`}
        >
          {item.adTitle}
        </span>
        {isSelected && <Check className="w-5 h-5 text-tg-link" />}
      </button>
    )
  }
)
