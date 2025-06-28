import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import {
  getCoreRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { DirectReportItem } from '@/api/types/direct-report.types'
import { reportTableColumns } from '@/components/ReportTable/ReportTable.columns'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import { useProcessedData } from '@/components/ReportTable/useProcessedData'

interface PropTypes {
  dataProvider: DirectReportItem[] | undefined
  mode: 'compact' | 'fully'
  totals: DirectReportItem | null
  showTotals: boolean
  hasNextPage: boolean
  columns: FiltersType[]
  sorting: SortingState
  onSortingChange?: (sorting: SortingState) => void
  onLoadMore?: () => void
  isFetchingNextPage?: boolean
  tableId: string
  tableType: 'campaigns' | 'days' | 'links' | 'audience'
}

export const useInfiniteData = ({
  dataProvider,
  mode,
  totals,
  showTotals,
  hasNextPage,
  columns,
  sorting,
  onSortingChange,
  onLoadMore,
  isFetchingNextPage,
  tableId,
  tableType
}: PropTypes) => {
  const processedData = useProcessedData({
    dataProvider,
    mode,
    totals,
    showTotals,
    hasNextPage
  })

  // Разделяем данные: обычные строки и total
  const { regularData, totalRow } = useMemo(() => {
    if (!processedData) return { regularData: [], totalRow: null }
    const regular = processedData.filter(item => item.type !== 'total')
    const total = processedData.find(item => item.type === 'total') || null
    return { regularData: regular, totalRow: total }
  }, [processedData])

  // Группируем данные: кампании и их объявления
  const groupedData = useMemo(() => {
    if (tableType === 'campaigns') {
      const result: DirectReportItem[] = []
      let currentCampaign: DirectReportItem | null = null

      for (const item of regularData) {
        if (item.type === 'campaign') {
          currentCampaign = item
          result.push(item)
        } else if (item.type === 'ad' && currentCampaign) {
          if (item.campaignID === currentCampaign.campaignID) {
            result.push(item)
          }
        }
      }
      return result
    }
    // Для 'days' и 'links' возвращаем regularData без изменений
    return regularData
  }, [regularData, tableType])

  const table = useReactTable({
    data: groupedData,
    columns: processedData ? reportTableColumns(processedData, columns) : [],
    getCoreRowModel: getCoreRowModel(),
    state: { sorting },
    onSortingChange: updater => {
      const newSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      if (onSortingChange) {
        onSortingChange(newSorting.length > 0 ? newSorting : sorting)
      }
    }
  })

  const rows = useMemo(() => {
    const rows = table.getRowModel().rows
    return rows
  }, [table, regularData])

  const { ref: triggerRef, inView } = useInView({
    threshold: 0.5,
    rootMargin: `0px 0px 200px 0px`,
    triggerOnce: false
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && onLoadMore) {
      onLoadMore()
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore])

  // Создаем объект строки для totals
  const totalRowObject = useMemo(() => {
    if (!totalRow || !showTotals) return null
    return {
      id: 'total',
      original: totalRow,
      getVisibleCells: () => {
        return table.getAllColumns().map((column, index) => ({
          id: `total_${index}`,
          column: column,
          getValue: () => {
            const value = totalRow[column.id]
            return value != null ? value : '-'
          },
          getContext: () => ({
            column,
            row: { original: totalRow },
            getValue: () => totalRow[column.id] ?? '-',
            table
          })
        }))
      }
    }
  }, [totalRow, showTotals, table])

  const totalRows = regularData.length

  return {
    table,
    rows,
    totalRowObject,
    totalRows,
    triggerRef,
    inView
  }
}
