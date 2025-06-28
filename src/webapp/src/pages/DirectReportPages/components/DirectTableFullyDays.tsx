import { useCallback, useContext, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { SortingState } from '@tanstack/react-table'
import { useDirectDays } from '@/api/hooks/direct/useDirectDays'
import {
  columnHeadersDays,
  defaultColumnsDays
} from '@/components/ReportTable/ReportTable.columns'
import { FilterValueType } from '@/components/ReportTable/ReportTable.types'
import { useOptimalPageSize } from '@/components/utils/hooks/useOptimalPageSize'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import InfiniteReportTable from '../InfiniteReportTable/InfiniteReportTable'
import { DirectAdsContext } from '../model/DirectAdsContext'
import { DirectTableFullyButton } from './DirectTableFullyButton'

interface SearchState {
  channelUUID?: string
  ads?: string[]
  range?: { from: string; to: string }
  c_day: FilterValueType[]
}

const DirectTableFullyDays = () => {
  const { id: channelUUID } = useParams()
  const { ads } = useContext(DirectAdsContext)
  const { range, c_day: selectedColumns } = useSearchState() as SearchState
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true }
  ])
  const [_, setColumns] = useSearchState<FilterValueType[]>(
    'c_day',
    columnHeadersDays
      .slice(1, columnHeadersDays.length)
      .map(({ value }) => value)
      .filter(value => defaultColumnsDays.includes(value)),
    { useLocalStorage: true, storagePrefix: 'daysFully' }
  )

  const pageSize = useOptimalPageSize({ buffer: 3 })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDirectDays({
      channelUUID,
      ads,
      from: range?.from,
      to: range?.to,
      limit: pageSize,
      includeTotals: true,
      sortBy: sorting[0]?.id || 'date',
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
    })

  const reportData = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data?.pages])

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.history.back()
  }

  const handleSortingChange = useCallback(
    (newSorting: SortingState) => {
      setSorting(newSorting.length > 0 ? [newSorting[0]] : sorting)
    },
    [sorting]
  )

  const memoizedSorting = useMemo(() => sorting, [sorting])
  const totals = data?.pages[0]?.totals || null
  const pageCount = data?.pages.length ?? 0
  const options = columnHeadersDays.slice(1, columnHeadersDays.length)

  const visibleColumns = useMemo(
    () =>
      selectedColumns
        ? [
            columnHeadersDays[0], // Всегда включаем первую колонку
            ...columnHeadersDays.filter(({ value }) =>
              selectedColumns.includes(value)
            )
          ]
        : columnHeadersDays,
    [selectedColumns]
  )

  return (
    <div className="flex flex-col bg-tg-secondary min-h-screen">
      <InfiniteReportTable
        dataProvider={reportData}
        mode={'fully'}
        columns={visibleColumns}
        tableId="DirectTableFullyDays"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        showTotals={true}
        totals={totals}
        pageCount={pageCount}
        sorting={memoizedSorting}
        onSortingChange={handleSortingChange}
        tableType="days"
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

export default DirectTableFullyDays
