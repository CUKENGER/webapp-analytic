import { useCallback, useMemo, useState } from 'react'
import { SortingState } from '@tanstack/react-table'
import { useLinkDirectDays } from '@/api/hooks/direct/useLinkDirectDays'
import {
  columnHeadersLinksDays,
  defaultColumnsDays
} from '@/components/ReportTable/ReportTable.columns'
import { FilterValueType } from '@/components/ReportTable/ReportTable.types'
import { useOptimalPageSize } from '@/components/utils/hooks/useOptimalPageSize'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import InfiniteReportTable from '../InfiniteReportTable/InfiniteReportTable'
import { DirectTableFullyButton } from './DirectTableFullyButton'
import { useParams } from 'react-router'

const DirectTableFullyLinksDays = () => {
  const {id: channelUUID} = useParams<{ id: string }>()
  const { range, clink_days: selectedColumns } = useSearchState()
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: false }
  ])
  const [_, setColumns] = useSearchState<FilterValueType[]>(
    'clink_days',
    columnHeadersLinksDays
      .slice(1, columnHeadersLinksDays.length)
      .map(({ value }) => value)
      .filter(value => defaultColumnsDays.includes(value)),
    { useLocalStorage: true, storagePrefix: 'daysFully' }
  )

  const pageSize = useOptimalPageSize({ buffer: 3 })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useLinkDirectDays({
      channelUUID,
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
  const options = columnHeadersLinksDays.slice(1, columnHeadersLinksDays.length)

  const visibleColumns = useMemo(
    () =>
      selectedColumns
        ? [
            columnHeadersLinksDays[0], // Всегда включаем первую колонку
            ...columnHeadersLinksDays.filter(({ value }) =>
              selectedColumns.includes(value)
            )
          ]
        : columnHeadersLinksDays,
    [selectedColumns]
  )

  return (
    <div className="flex flex-col bg-tg-secondary min-h-screen">
      <InfiniteReportTable
        dataProvider={reportData}
        mode={'fully'}
        columns={visibleColumns}
        tableId="DirectTableFullyLinksDays"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        showTotals={true}
        totals={totals}
        pageCount={pageCount}
        sorting={memoizedSorting}
        onSortingChange={handleSortingChange}
        tableType="links"
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

export default DirectTableFullyLinksDays
