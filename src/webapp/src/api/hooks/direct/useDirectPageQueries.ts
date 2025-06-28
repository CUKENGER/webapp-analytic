import { Dispatch, SetStateAction, startTransition, useEffect } from 'react'
import { useSuspenseQueries } from '@tanstack/react-query'
import { FilterRangeType } from '@/components/ReportTable/ReportTable.types'
import { fetchDirectReportCampaigns } from './useDirectCampaigns'
import { fetchDirectReportDays } from './useDirectDays'
import { fetchDirectReportDaysFull } from './useDirectDaysFull'
import { fetchDirectReportAds } from './useDirectReportAds'

interface PropTypes {
  channelUUID?: string
  range: FilterRangeType
  ads: string[]
  setRange: Dispatch<SetStateAction<FilterRangeType>>
}

export const useDirectPageQueries = ({
  channelUUID,
  range,
  ads,
  setRange
}: PropTypes) => {

  if(!range?.from || !range?.to) {
    return {
      daysResponse: null,
      chartData: null,
      campaignsData: null,
      isLoading: true
    }
  }

  const [
    { data: daysResponse, isLoading: isDaysLoading },
    { data: chartData, isLoading: isChartLoading },
    { data: campaignsData, isLoading: isCampaignsLoading }
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: [
          'directReportDays',
          channelUUID,
          ads.join(',') || 'no-ads',
          range.from,
          range.to
        ],
        queryFn: () =>
          fetchDirectReportDays({
            channelUUID,
            ads,
            from: range.from,
            to: range.to,
            limit: 10,
            includeTotals: true
          }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false
      },
      {
        queryKey: [
          'directReportDaysFull',
          channelUUID,
          ads.join(',') || 'no-ads',
          range.from,
          range.to
        ],
        queryFn: () =>
          fetchDirectReportDaysFull({
            channelUUID,
            ads,
            from: range?.from,
            to: range?.to,
            includeTotals: false
          }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false
      },
      {
        queryKey: [
          'directReportCampaigns',
          channelUUID,
          ads.join(',') || 'no-ads',
          range.from,
          range.to
        ],
        queryFn: () =>
          fetchDirectReportCampaigns({
            channelUUID,
            ads,
            from: range.from,
            to: range.to,
            includeTotals: true,
            limit: 10,
            sortBy: 'title',
            sortOrder: 'desc'
          }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false
      }
    ]
  })

  return {
    daysResponse,
    chartData,
    campaignsData,
    isLoading: isDaysLoading || isChartLoading || isCampaignsLoading
  }
}