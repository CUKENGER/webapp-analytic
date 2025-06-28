import { Dispatch, SetStateAction, useDeferredValue, useMemo } from 'react'
import { DirectCampaignsResponse } from '@/api/hooks/direct/useDirectCampaigns'
import { DirectReportDaysResponse } from '@/api/hooks/direct/useDirectDays'
import { DirectReportDaysFullResponse } from '@/api/hooks/direct/useDirectDaysFull'
import { useDirectPageQueries } from '@/api/hooks/direct/useDirectPageQueries'
import { DirectReportAdsResponse } from '@/api/hooks/direct/useDirectReportAds'
import { FilterRangeType } from '@/components/ReportTable/ReportTable.types'

interface PropTypes {
  channelUUID?: string
  setRange: Dispatch<SetStateAction<FilterRangeType>>
  range: FilterRangeType
  ads: string[]
}

interface DirectData {
  chartData: DirectReportDaysFullResponse | null
  daysData: DirectReportDaysResponse | null
  campaignsData: DirectCampaignsResponse | null
  campaignsDataCompact: DirectCampaignsResponse['data'] | []
  campaignsDataTotals: DirectCampaignsResponse['totals'] | null
  isLoading: boolean
}

export const useDirectData = ({
  channelUUID,
  setRange,
  range,
  ads
}: PropTypes): DirectData => {
  const deferredAds = useDeferredValue(ads)
  const { campaignsData, chartData, daysResponse, isLoading } =
    useDirectPageQueries({
      channelUUID,
      range,
      ads: deferredAds,
      setRange
    })

  const daysData = daysResponse

  const campaignsDataCompact = useMemo(() => campaignsData ? campaignsData.data : [], [campaignsData])
  const campaignsDataTotals = useMemo(
    () => campaignsData?.totals || null,
    [campaignsData]
  )

  return {
    chartData,
    daysData,
    campaignsData,
    campaignsDataCompact,
    campaignsDataTotals,
    isLoading
  }
}
