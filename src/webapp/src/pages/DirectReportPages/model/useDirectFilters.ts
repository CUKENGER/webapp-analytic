import {
  columnHeadersDays,
  defaultColumnsDays
} from '@/components/ReportTable/ReportTable.columns'
import { FilterRangeType, FilterValueType } from '@/components/ReportTable/ReportTable.types'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import { DIRECT_PAGE_FILTERS_PREFIX } from './consts'
import { useParams } from 'react-router'
import { useLocalStorageState } from '@/components/utils/hooks/useLocalStorageState'
import { useDirectReportAds } from '@/api/hooks/direct/useDirectReportAds'
import { useEffect } from 'react'

export const useDirectFilters = () => {
  const { id: channelUUID } = useParams<{ id: string }>()
  const { rtab } = useSearchState()
  const prefix = `${DIRECT_PAGE_FILTERS_PREFIX}-${channelUUID}-${rtab}`

  const [ads, setAds] = useLocalStorageState<string[]>('ads', [], prefix)

  const [columns, setColumns] = useSearchState<FilterValueType[]>(
    'c_day',
    columnHeadersDays
      .slice(1, columnHeadersDays.length)
      .map(({ value }) => value)
      .filter(value => defaultColumnsDays.includes(value)),
    {
      useLocalStorage: true,
      storagePrefix: prefix
    }
  )

  const { data: adsData, isLoading: isInitialAdsLoading } = useDirectReportAds({ channelUUID: channelUUID ?? '' })
  
  const [range, setRange] = useSearchState<FilterRangeType>('range', {
    from: adsData?.from ?? '',
    to: adsData?.to ?? ''
  })

  useEffect(() => {
    if (adsData.from && adsData.to) { 
      setRange({
        from: adsData.from,
        to: adsData.to
      })
    }
  }, [adsData.from, adsData.to])

  return {
    channelUUID,
    rtab,
    range,
    setRange,
    ads,
    setAds,
    columns,
    setColumns,
    prefix,
    adsData
  }
}
