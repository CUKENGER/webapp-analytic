import { useCallback, useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { SortingState } from '@tanstack/react-table';
import { useDirectCampaigns } from '@/api/hooks/direct/useDirectCampaigns';
import { columnHeadersCampaigns } from '@/components/ReportTable/ReportTable.columns';
import { FilterValueType } from '@/components/ReportTable/ReportTable.types';
import { useOptimalPageSize } from '@/components/utils/hooks/useOptimalPageSize';
import { useSearchState } from '@/components/utils/hooks/useSearchState';
import InfiniteReportTable from '../InfiniteReportTable/InfiniteReportTable';
import { DirectTableFullyButton } from './DirectTableFullyButton';
import { DirectAdsContext } from '../model/DirectAdsContext'


const DirectTableFullyCampaigns = () => {
  const { id: channelUUID } = useParams<{ id: string }>()
  const { ads } = useContext(DirectAdsContext)
  const { range, c_day } = useSearchState()

  const [selectedColumns, setColumns] = useSearchState<FilterValueType[]>(
    'c_day',
    c_day || columnHeadersCampaigns.slice(1).map(({ value }) => value),
    { useLocalStorage: true, storagePrefix: 'campaignsFully' }
  )

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'title', desc: true }
  ])

  const visibleColumns = selectedColumns
    ? [
        columnHeadersCampaigns[0],
        ...columnHeadersCampaigns.filter(({ value }) =>
          selectedColumns.includes(value)
        )
      ]
    : columnHeadersCampaigns

  const pageSize = useOptimalPageSize({ buffer: 3 })

  const {
    data: pages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useDirectCampaigns({
    channelUUID,
    ads,
    from: range.from,
    to: range.to,
    limit: pageSize,
    includeTotals: true,
    sortBy: sorting[0]?.id || 'title',
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
  })

  const allItems = pages?.pages.flatMap(page => page.data)
  const campaignsDataTotals = pages?.pages[0].totals || null

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const pageCount = pages?.pages.length ?? 0
  const options = columnHeadersCampaigns.slice(1, columnHeadersCampaigns.length)

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.history.back()
  }

  const memoizedSorting = useMemo(() => sorting, [sorting])
  const handleSortingChange = useCallback(
    (newSorting: SortingState) => {
      setSorting(newSorting.length > 0 ? [newSorting[0]] : sorting)
    },
    [sorting]
  )

  return (
    <div className="flex flex-col bg-tg-secondary min-h-screen">
      <InfiniteReportTable
        dataProvider={allItems ?? []}
        mode={'fully'}
        columns={visibleColumns}
        tableId="DirectTableFullyCampaigns"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        showTotals={true}
        totals={campaignsDataTotals}
        pageCount={pageCount}
        sorting={memoizedSorting}
        onSortingChange={handleSortingChange}
        tableType='campaigns'
      />
      <DirectTableFullyButton
        handleClick={handleBack}
        options={options}
        selectedColumns={selectedColumns}
        setColumns={setColumns}
      />
    </div>
  )
}

export default DirectTableFullyCampaigns