import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useMutationState } from '@tanstack/react-query';
import { last } from 'lodash';
import { useLinkDirectDays } from '@/api/hooks/direct/useLinkDirectDays';
import { useLinksInvite } from '@/api/hooks/useLinksInvite';
import { LinksChartData } from '@/components/NewReportChart/model/LinksChartData';
import { NewReportChart } from '@/components/NewReportChart/NewReportChart';
import { columnHeadersLinks, columnHeadersLinksDays } from '@/components/ReportTable/ReportTable.columns';
import { FilterValueType } from '@/components/ReportTable/ReportTable.types';
import { MainButtonBox } from '@/components/ui/MainButtonBox';
import { useSearchState } from '@/components/utils/hooks/useSearchState';
import DirectTableSegment from '@/pages/DirectReportPages/components/DirectTableSegment';
import { PeriodFilter } from '../Audience/components/PeriodFilter';
import { ChartButtonList } from '../DirectReportPages/components/ChartButtonList';
import { DirectNotFound } from '../DirectReportPages/components/DirectNotFound';


const metrics = [
  { value: 'subscriptions', label: 'Подписок' },
  { value: 'unsubscriptions', label: 'Отписок' },
  { value: 'unsubscriptions_per', label: 'Отписок, %' },
  { value: 'total_pdp', label: 'Итого ПДП' }
]

const LinksPage = () => {
  const relativeContainerRef = useRef<HTMLDivElement>(null)
  const {id: channelUUID} = useParams<{ id: string }>()
  const [range, setRange] = useSearchState<{
    from: string
    to: string
  }>('range', {
    from: '',
    to: ''
  })
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { data: pages, refetch } = useLinksInvite({
    channelUUID,
    from: range.from,
    to: range.to,
    limit: 10,
    includeTotals: true
  })
  const data = pages?.pages[0]

  const mutationState = useMutationState({
    filters: { mutationKey: ['editInviteLinkCost'] },
    select: mutation => ({
      isSuccess: mutation.state.status === 'success'
    })
  })

  const isSuccessEditCost = last(mutationState)?.isSuccess
  useEffect(() => {
    if (isSuccessEditCost) {
      refetch()
    }
  }, [isSuccessEditCost, refetch])

  const [columns, setColumns] = useSearchState<FilterValueType[]>(
    'clink',
    columnHeadersLinks
      .slice(1, columnHeadersLinks.length)
      .map(({ value }) => value),
    { useLocalStorage: true, storagePrefix: 'linksTab' }
  )

  const [daysColumns, setDaysColumns] = useSearchState<FilterValueType[]>(
    'clink_days',
    columnHeadersLinksDays
      .slice(1, columnHeadersLinksDays.length)
      .map(({ value }) => value),
    { useLocalStorage: true, storagePrefix: 'linksTab' }
  )

  const [chartMetric, setChartMetric] = useSearchState<string>(
    'links_chart',
    'subscriptions',
    { useLocalStorage: true, storagePrefix: 'linksTab' }
  )

  const handleClickAddLink = useCallback(() => {
    navigate({ pathname: 'links/add', search: searchParams.toString() })
  }, [navigate, searchParams])

  const { data: linksDaysResponse } = useLinkDirectDays({
    channelUUID,
    limit: 10,
    includeTotals: true,
    from: range.from,
    to: range.to
  })

  const reportData = linksDaysResponse.pages[0]

  return (
    <div className="w-full bg-tg-secondary min-h-tabs-content-height flex flex-col">
      <div className="flex flex-col flex-1 gap-2">
        <PeriodFilter selectedRange={range} setSelectedRange={setRange} />
        {/* <div */}
        {/*   ref={relativeContainerRef} */}
        {/*   className="relative flex flex-col gap-4" */}
        {/* > */}
        {/*   <NewReportChart */}
        {/*     data={LinksChartData} */}
        {/*     relativeContainerRef={relativeContainerRef} */}
        {/*     selectedMetric={chartMetric} */}
        {/*   /> */}
        {/*   <div className="flex gap-2 w-full justify-center"> */}
        {/*     {metrics.map(metric => ( */}
        {/*       <ChartButton */}
        {/*         key={metric.value} */}
        {/*         active={chartMetric === metric.value} // Подсветка активной кнопки */}
        {/*         onClick={() => setChartMetric(metric.value)} */}
        {/*       > */}
        {/*         {metric.label} */}
        {/*       </ChartButton> */}
        {/*     ))} */}
        {/*   </div> */}
        {/* </div> */}
        {/* <div> */}
        {/*   {reportData && reportData.data.length > 0 ? ( */}
        {/*     <DirectTableSegment */}
        {/*       title={''} */}
        {/*       toPath={'/direct/links/days'} */}
        {/*       data={reportData?.data ?? []} */}
        {/*       columns={columnHeadersLinksDays} */}
        {/*       selectedColumns={columns} */}
        {/*       setColumns={setColumns} */}
        {/*       totals={reportData?.totals} */}
        {/*       tableName={'links'} */}
        {/*       hasNextPage={reportData?.hasNextPage} */}
        {/*       tableId="LinksDaysReport" */}
        {/*       defaultSorting={'date'} */}
        {/*       defaultDesc={true} */}
        {/*     /> */}
        {/*   ) : ( */}
        {/*     <DirectNotFound /> */}
        {/*   )} */}
        {/* </div> */}
        <div className="pt-4 flex-1">
          {data && data.data.length > 0 ? (
            <DirectTableSegment
              title={''}
              toPath={'links'}
              data={data?.data ?? []}
              columns={columnHeadersLinks}
              selectedColumns={columns}
              setColumns={setColumns}
              totals={data?.totals}
              tableName={'links'}
              hasNextPage={data?.hasNextPage}
              tableId="LinksReport"
              defaultSorting={'firstSubscriberEpoch'}
              defaultDesc={true}
            />
          ) : (
            <DirectNotFound />
          )}
        </div>
        <MainButtonBox onClick={handleClickAddLink} big>
          Добавить ссылку
        </MainButtonBox>
      </div>
    </div>
  )
}

export default LinksPage