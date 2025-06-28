import React, { useCallback, useMemo, useState } from 'react'
import { SortingState } from '@tanstack/react-table'
import { useAudienceList } from '@/api/hooks/useAudienceList'
import { columnHeadersAudience } from '@/components/ReportTable/ReportTable.columns'
import { FilterValueType } from '@/components/ReportTable/ReportTable.types'
import { useOptimalPageSize } from '@/components/utils/hooks/useOptimalPageSize'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import InfiniteReportTable from '../InfiniteReportTable/InfiniteReportTable'
import { DirectTableFullyButton } from './DirectTableFullyButton'
import { useParams } from 'react-router'

const DirectTableFullyAudience: React.FC = () => {
  const {id: channelUUID} = useParams<{ id: string }>()
  const { providers, range, c_au } = useSearchState()
  const pageSize = useOptimalPageSize({ buffer: 3 })

  const [selectedColumns, setColumns] = useSearchState<FilterValueType[]>(
    'c_au',
    c_au || columnHeadersAudience.slice(1).map(({ value }) => value),
    { useLocalStorage: true, storagePrefix: 'audienceFully' }
  )

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'subscribedAtEpoch', desc: true }
  ])

  // Маппинг id сортировки на поля API (единообразно с columnHeadersAudience)
  const sortFieldMap: Record<string, string> = {
    provider: 'provider',
    tgUserID: 'tgUserID',
    tgUsername: 'tgUsername',
    subscribedAtEpoch: 'subscribedAtEpoch',
    unsubscribedAtEpoch: 'unsubscribedAtEpoch'
  }

  const sortBy = sorting[0]?.id
    ? sortFieldMap[sorting[0].id] || 'subscribedAtEpoch'
    : 'subscribedAtEpoch'
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc'

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAudienceList({
      channelUUID,
      from: range?.from,
      to: range?.to,
      provider: providers,
      limit: pageSize,
      sortBy,
      sortOrder
    })

  const allItems = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const options = columnHeadersAudience.slice(1, columnHeadersAudience.length)

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
        dataProvider={allItems}
        columns={
          selectedColumns
            ? [
                columnHeadersAudience[0],
                ...columnHeadersAudience.filter(({ value }) =>
                  selectedColumns.includes(value)
                )
              ]
            : columnHeadersAudience
        }
        tableId="DirectTableFullyAudience"
        hasNextPage={hasNextPage}
        mode="fully"
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        tableType="audience"
        sorting={memoizedSorting}
        onSortingChange={handleSortingChange}
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

export default DirectTableFullyAudience
