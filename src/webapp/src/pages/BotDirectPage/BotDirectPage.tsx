import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { useBotDirectCampaigns } from '@/api/hooks/direct/useBotDirectCampaigns';
import { useBotDirectDays } from '@/api/hooks/direct/useBotDirectDays';
import { useBotDirectDaysFull } from '@/api/hooks/direct/useBotDirectDaysFull';
import { useBotDirectReportAds } from '@/api/hooks/direct/useBotDirectReportAds';
import { CustomLoader } from '@/components/@common/CustomLoader';
import { NewReportChart } from '@/components/NewReportChart/NewReportChart';
import { columnHeadersBotCampaigns, columnHeadersBotDays, defaultColumnsBotDays } from '@/components/ReportTable/ReportTable.columns';
import { FilterValueType } from '@/components/ReportTable/ReportTable.types';
import { useLocalStorageState } from '@/components/utils/hooks/useLocalStorageState';
import { useSearchState } from '@/components/utils/hooks/useSearchState';
import { ChartButtonList } from '../DirectReportPages/components/ChartButtonList';
import { DirectNotFound } from '../DirectReportPages/components/DirectNotFound';
import DirectTableSegment from '../DirectReportPages/components/DirectTableSegment';
import { DirectFilters } from '../DirectReportPages/DirectFilters/DirectFilters'
import { DirectAdsContext } from '../DirectReportPages/model/DirectAdsContext'

const BotDirectPage = () => {
  const relativeContainerRef = useRef<HTMLDivElement>(null)

  const { id: botId } = useParams()

  const [ads, setAds] = useLocalStorageState<string[]>(
    'ads',
    [],
    'botDirectReportAds'
  )

  const [filterValue, setFilterValue] = useSearchState<FilterValueType>(
    'metrics',
    'cost',
    { useLocalStorage: true, storagePrefix: 'botDirectReportChart' }
  )

  const [columns, setColumns] = useSearchState<FilterValueType[]>(
    'c_day',
    columnHeadersBotDays
      .slice(1, columnHeadersBotDays.length)
      .map(({ value }) => value)
      .filter(value => defaultColumnsBotDays.includes(value)),
    {
      useLocalStorage: true,
      storagePrefix: 'botDirectReportDays'
    }
  )

  const [range, setRange] = useSearchState<{
    from: string
    to: string
  }>('range', {
    from: '',
    to: ''
  })

  const { data: adsData, isSuccess: isSuccessAds } = useBotDirectReportAds({
    botId,
    from: range.from,
    to: range.to
  })

  const { data: daysResponse, isLoading: isLoadingDays } = useBotDirectDays({
    botId,
    ads,
    from: adsData?.from,
    to: adsData?.to,
    limit: 10,
    includeTotals: true
  })

  useEffect(() => {
    if (
      isSuccessAds &&
      adsData?.from !== range.from &&
      adsData?.to !== range.to &&
      (!range.from || !range.to)
    ) {
      setRange(prev => {
        if (prev.from && prev.to) return prev
        return {
          from: adsData.from,
          to: adsData.to
        }
      })
    }
  }, [adsData?.from, adsData?.to, isSuccessAds, range, setRange])

  const { data: daysFullData } = useBotDirectDaysFull({
    botId,
    ads,
    from: adsData?.from,
    to: adsData?.to,
    includeTotals: false
  })

  // Данные для графика (без агрегации, так как сервер возвращает готовые данные)
  const chartData = daysFullData
    ? {
        ...daysFullData,
        data: daysFullData.data.map(item => ({
          date: item.date.split('T')[0],
          cost: item.cost || 0,
          impressions: item.impressions || 0,
          clicks: item.clicks || 0,
          redirected: item.redirected || 0,
          subscribed: item.subscribed || 0,
          ctr: item.ctr || 0,
          cpc: item.cpc || 0,
          cland: item.cland || 0,
          cpa: item.cpa || 0,
          cpdp: item.cpdp || 0,
          pdp_cost: item.pdp_cost || 0
        }))
      }
    : daysFullData

  const options = columnHeadersBotDays.slice(1, columnHeadersBotDays.length)

  const { data: campaignsData } = useBotDirectCampaigns({
    botId,
    ads,
    from: adsData?.from,
    to: adsData?.to,
    includeTotals: true,
    limit: 10
  })

  const campaignsDataCompact = campaignsData?.pages.flatMap(page => page.data)
  const campaignsDataCompactTotals = campaignsData?.pages[0]?.totals || null

  // Данные для таблицы (без агрегации)
  const reportData = daysResponse
    ? {
        ...daysResponse.pages[0],
        data: daysResponse.pages[0].data.map(item => ({
          date: item.date.split('T')[0],
          cost: String(item.cost || 0),
          impressions: String(item.impressions || 0),
          clicks: String(item.clicks || 0),
          redirected: String(item.redirected || 0),
          subscribed: String(item.subscribed || 0),
          ctr: String(item.ctr || 0),
          cpc: String(item.cpc || 0),
          cland: String(item.cland || 0),
          cpa: String(item.cpa || 0),
          cpdp: String(item.cpdp || 0),
          pdp_cost: String(item.pdp_cost || 0)
        })),
        totals: daysResponse.pages[0].totals
          ? {
              cost: String(daysResponse.pages[0].totals.cost || 0),
              impressions: String(
                daysResponse.pages[0].totals.impressions || 0
              ),
              clicks: String(daysResponse.pages[0].totals.clicks || 0),
              visited: String(daysResponse.pages[0].totals.visited || 0),
              redirected: String(daysResponse.pages[0].totals.redirected || 0),
              subscribed: String(daysResponse.pages[0].totals.subscribed || 0),
              ctr: String(daysResponse.pages[0].totals.ctr || 0),
              cpc: String(daysResponse.pages[0].totals.cpc || 0),
              cland: String(daysResponse.pages[0].totals.cland || 0),
              cpa: String(daysResponse.pages[0].totals.cpa || 0),
              cpdp: String(daysResponse.pages[0].totals.cpdp || 0),
              pdp_cost: String(daysResponse.pages[0].totals.pdp_cost || 0)
            }
          : null,
        hasNextPage: daysResponse.pages[0].hasNextPage
      }
    : null

  if (isLoadingDays) {
    return <CustomLoader />
  }

  return (
    <DirectAdsContext.Provider value={{ ads, setAds }}>
      <div className="bg-tg-secondary">
        <div className="max-w-screen-reports-max-screen px-4 pb-0 mx-auto w-full">
          <div className="pt-10 min-h-screen sizing-box">
            <div className="space-y-10 pb-padding-bottom-nav">
              <div className="space-y-10">
                <DirectFilters
                  selectedAds={ads}
                  selectedRange={range}
                  setSelectedAds={setAds}
                  setSelectedRange={setRange}
                  campaigns={adsData?.data}
                />
                {chartData && chartData.data.length > 0 ? (
                  <div
                    ref={relativeContainerRef}
                    className="relative flex flex-col gap-4"
                  >
                    <NewReportChart
                      data={chartData.data}
                      selectedMetric={filterValue}
                      relativeContainerRef={relativeContainerRef}
                    />
                    <ChartButtonList
                      options={options}
                      selectedOption={filterValue}
                      setSelectedOption={setFilterValue}
                    />
                  </div>
                ) : (
                  <DirectNotFound />
                )}
              </div>
              {reportData && reportData.data.length > 0 ? (
                <DirectTableSegment
                  title={'Отчёт по дням'}
                  toPath={`/projects/bot/${botId}/direct/days`}
                  data={reportData.data}
                  hasNextPage={reportData.hasNextPage}
                  columns={columnHeadersBotDays}
                  selectedColumns={columns}
                  setColumns={setColumns}
                  totals={reportData.totals}
                  tableId="BotDaysReport"
                  defaultDesc={true}
                  defaultSorting="date"
                />
              ) : (
                <DirectNotFound />
              )}
              {campaignsDataCompact && campaignsDataCompact.length > 0 ? (
                <DirectTableSegment
                  title={'Отчёт по кампаниям'}
                  toPath={`/projects/bot/${botId}/direct/campaigns`}
                  data={campaignsDataCompact}
                  columns={columnHeadersBotCampaigns}
                  selectedColumns={columns}
                  setColumns={setColumns}
                  totals={campaignsDataCompactTotals}
                  tableId="BotCampaignsReport"
                  hasNextPage={campaignsData?.pages[0]?.hasNextPage}
                  defaultDesc={true}
                  defaultSorting="title"
                />
              ) : (
                <DirectNotFound />
              )}
            </div>
          </div>
        </div>
      </div>
    </DirectAdsContext.Provider>
  )
}

export default BotDirectPage