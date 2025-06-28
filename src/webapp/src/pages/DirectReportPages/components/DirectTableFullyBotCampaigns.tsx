import { useCallback, useContext, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { SortingState } from '@tanstack/react-table'
import { useBotDirectCampaigns } from '@/api/hooks/direct/useBotDirectCampaigns'
import { columnHeadersBotCampaigns } from '@/components/ReportTable/ReportTable.columns'
import { FilterValueType } from '@/components/ReportTable/ReportTable.types'
import { useOptimalPageSize } from '@/components/utils/hooks/useOptimalPageSize'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import InfiniteReportTable from '../InfiniteReportTable/InfiniteReportTable'
import { DirectAdsContext } from '../model/DirectAdsContext'
import { DirectTableFullyButton } from './DirectTableFullyButton'

const DirectTableFullyBotCampaigns = () => {
  const { id: botId } = useParams()
  const { ads } = useContext(DirectAdsContext)
  const { range, c_day } = useSearchState()
  const navigate = useNavigate()

  const [selectedColumns, setColumns] = useSearchState<FilterValueType[]>(
    'c_day',
    c_day || columnHeadersBotCampaigns.slice(1).map(({ value }) => value),
    { useLocalStorage: true, storagePrefix: 'botCampaignsFully' }
  )

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'title', desc: true }
  ])

  const visibleColumns = selectedColumns
    ? [
        columnHeadersBotCampaigns[0],
        ...columnHeadersBotCampaigns.filter(({ value }) =>
          selectedColumns.includes(value)
        )
      ]
    : columnHeadersBotCampaigns

  const pageSize = useOptimalPageSize({ buffer: 3 })

  const {
    data: pages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useBotDirectCampaigns({
    botId,
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
  const options = columnHeadersBotCampaigns.slice(
    1,
    columnHeadersBotCampaigns.length
  )

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(-1)
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
        tableId="DirectTableFullyBotCampaigns"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        showTotals={true}
        totals={campaignsDataTotals}
        pageCount={pageCount}
        sorting={memoizedSorting}
        onSortingChange={handleSortingChange}
        tableType="campaigns"
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

export default DirectTableFullyBotCampaigns
