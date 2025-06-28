import { useCallback, useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { SortingState } from '@tanstack/react-table';
import { useBotDirectDays } from '@/api/hooks/direct/useBotDirectDays';
import { columnHeadersBotDays, defaultColumnsBotDays } from '@/components/ReportTable/ReportTable.columns';
import { FilterValueType } from '@/components/ReportTable/ReportTable.types';
import { useOptimalPageSize } from '@/components/utils/hooks/useOptimalPageSize';
import { useSearchState } from '@/components/utils/hooks/useSearchState';
import InfiniteReportTable from '../InfiniteReportTable/InfiniteReportTable';
import { DirectTableFullyButton } from './DirectTableFullyButton';
import { DirectAdsContext } from '../model/DirectAdsContext'


interface SearchState {
  botId?: string
  ads?: string[]
  range?: { from: string; to: string }
  c_day: FilterValueType[]
}

const DirectTableFullyBotDays = () => {
  const { id: botId } = useParams()
  const { ads } = useContext(DirectAdsContext)
  const { range, c_day: selectedColumns } = useSearchState() as SearchState

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true }
  ])
  const [_, setColumns] = useSearchState<FilterValueType[]>(
    'c_day',
    columnHeadersBotDays
      .slice(1, columnHeadersBotDays.length)
      .map(({ value }) => value)
      .filter(value => defaultColumnsBotDays.includes(value)),
    { useLocalStorage: true, storagePrefix: 'botDaysFully' }
  )

  const pageSize = useOptimalPageSize({ buffer: 3 })
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBotDirectDays({
      botId,
      ads,
      from: range?.from,
      to: range?.to,
      limit: pageSize,
      includeTotals: true,
      sortBy: sorting[0]?.id || 'date',
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
    })

  const reportData = useMemo(() => {
    return (data?.pages.flatMap(page => page.data) ?? []).map(item => ({
      ...item,
      date: item.date ? item.date.split('T')[0] : item.date
    }))
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
  const options = columnHeadersBotDays.slice(1, columnHeadersBotDays.length)

  const visibleColumns = useMemo(
    () =>
      selectedColumns
        ? [
            columnHeadersBotDays[0], // Всегда включаем первую колонку
            ...columnHeadersBotDays.filter(({ value }) =>
              selectedColumns.includes(value)
            )
          ]
        : columnHeadersBotDays,
    [selectedColumns]
  )

  return (
    <div className="flex flex-col bg-tg-secondary min-h-screen">
      <InfiniteReportTable
        dataProvider={reportData}
        mode={'fully'}
        columns={visibleColumns}
        tableId="DirectTableFullyBotDays"
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

export default DirectTableFullyBotDays