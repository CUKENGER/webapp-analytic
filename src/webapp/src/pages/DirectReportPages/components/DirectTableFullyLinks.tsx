import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutationState } from '@tanstack/react-query'
import { SortingState } from '@tanstack/react-table'
import { last } from 'lodash'
import { useLinksInvite } from '@/api/hooks/useLinksInvite'
import { columnHeadersLinks } from '@/components/ReportTable/ReportTable.columns'
import { FilterValueType } from '@/components/ReportTable/ReportTable.types'
import { useOptimalPageSize } from '@/components/utils/hooks/useOptimalPageSize'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import InfiniteReportTable from '../InfiniteReportTable/InfiniteReportTable'
import { DirectTableFullyButton } from './DirectTableFullyButton'
import { useParams } from 'react-router'

const DirectTableFullyLinks = () => {
  const {id: channelUUID} = useParams<{ id: string }>()
  const { clink: selectedColumns } = useSearchState()

  const [_, setColumns] = useSearchState<FilterValueType[]>(
    'clink',
    columnHeadersLinks.slice(1).map(({ value }) => value),
    { useLocalStorage: true, storagePrefix: 'linksFully' }
  )

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'firstSubscriberEpoch', desc: true }
  ])

  // Маппинг id сортировки на поля API
  const sortFieldMap: Record<string, string> = {
    firstSubscriberEpoch: 'firstSubscriberEpoch', // date на фронте соответствует firstSubscriberEpoch
    url: 'url',
    name: 'name',
    subscribed: 'subscribed',
    unsubscribed: 'unsubscribed',
    unsub_per: 'unsub_per',
    pdp_total: 'pdp_total',
    cost: 'cost',
    pdp_cost: 'pdp_cost',
    cost_total: 'cost_total'
  }

  const sortBy = sorting[0]?.id
    ? sortFieldMap[sorting[0].id] || 'firstSubscriberEpoch'
    : 'firstSubscriberEpoch'
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc'

  const visibleColumns = selectedColumns
    ? [
        columnHeadersLinks[0],
        ...columnHeadersLinks.filter(({ value }) =>
          selectedColumns.includes(value)
        )
      ]
    : columnHeadersLinks

  const pageSize = useOptimalPageSize({ buffer: 3 })

  const {
    data: pages,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useLinksInvite({
    channelUUID,
    limit: pageSize,
    includeTotals: true,
    sortBy,
    sortOrder
  })

  const allItems = pages?.pages.flatMap(page => page.data)

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

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const totals = pages?.pages[0]?.totals || null
  const options = columnHeadersLinks.slice(1, columnHeadersLinks.length)

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
    <div className="flex flex-col w-full bg-tg-secondary min-h-screen">
      <InfiniteReportTable
        dataProvider={allItems ?? []}
        mode={'fully'}
        columns={visibleColumns}
        tableName="links"
        tableId="DirectTableFullyLinks"
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        showTotals={true}
        totals={totals}
        tableType="links"
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

export default DirectTableFullyLinks
