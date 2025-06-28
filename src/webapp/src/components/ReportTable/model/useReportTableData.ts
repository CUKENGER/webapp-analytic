import { RefObject, useMemo, useState } from 'react'
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { DirectReportItem } from '@/api/types/direct-report.types'
import { reportTableColumns } from '../ReportTable.columns'
import { FiltersType } from '../ReportTable.types'
import { useProcessedData } from '../useProcessedData'
import type { Row } from '@tanstack/react-table'

export interface ExtendedDirectReportItem extends DirectReportItem {
  id?: string
}

interface PropTypes {
  dataProvider: DirectReportItem[] | undefined
  mode: 'compact' | 'fully'
  columns: FiltersType[]
  totals: DirectReportItem | null
  showTotals: boolean
  tableId: string
  tableContainerRef: RefObject<HTMLDivElement>
  tableName: string
  hasNextPage?: boolean
  defaultSorting?: string
  defaultDesc?: boolean
}

export const useReportTableData = ({
  columns,
  dataProvider,
  totals,
  showTotals,
  mode,
  tableId,
  tableContainerRef,
  tableName,
  hasNextPage,
  defaultSorting,
  defaultDesc
}: PropTypes) => {
  // Добавьте состояние для сортировки
  const [sorting, setSorting] = useState<SortingState>([
    {
      id:
        defaultSorting || columns.find(col => col.sortable)?.value || 'default',
      desc: defaultDesc || false
    }
  ])

  const processedDataRaw = useProcessedData({
    dataProvider,
    mode,
    totals,
    showTotals,
    hasNextPage: hasNextPage
  })
  const processedData = useMemo(() => processedDataRaw, [processedDataRaw])

  const table = useReactTable({
    data: processedData ?? [],
    columns: processedData ? reportTableColumns(processedData, columns) : [],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    },
    onSortingChange: setSorting
  })

  // Кастомная обработка строк после сортировки
  const sortedRows = useMemo(() => {
    const rows = table.getRowModel().rows
    // Отделяем специальные строки
    const ellipsisRow = rows.find(
      (row: Row<ExtendedDirectReportItem>) => row.original.id === 'ellipsis'
    )
    const totalRow = rows.find(
      (row: Row<ExtendedDirectReportItem>) => row.original.id === 'total'
    )

    // Проверяем, является ли таблица кампаний
    const isCampaignsTable = tableId.includes('CampaignsReport')

    if (isCampaignsTable) {
      // Логика для таблицы кампаний
      const campaignRows = rows.filter(
        (row: Row<ExtendedDirectReportItem>) => row.original.type === 'campaign'
      )
      const adRows = rows.filter(
        (row: Row<ExtendedDirectReportItem>) => row.original.type === 'ad'
      )

      // Сортируем кампании с учётом агрегированных значений
      const sort = sorting[0]
      const sortedCampaigns = [...campaignRows].sort((a, b) => {
        if (!sort) return 0

        const aValue = Number(a.original[sort.id]) || 0
        const bValue = Number(b.original[sort.id]) || 0

        return sort.desc ? bValue - aValue : aValue - bValue
      })

      // Формируем финальный порядок строк: кампания -> её объявления
      const finalRows: typeof rows = []
      sortedCampaigns.forEach(campaignRow => {
        finalRows.push(campaignRow)
        // Добавляем объявления, относящиеся к этой кампании
        const relatedAds = adRows.filter(
          adRow => adRow.original.campaignID === campaignRow.original.campaignID
        )
        // Сортируем объявления по тому же критерию
        const sortedAds = [...relatedAds].sort((a, b) => {
          const aAdValue = Number(a.original[sort.id]) || 0
          const bAdValue = Number(b.original[sort.id]) || 0
          return sort.desc ? bAdValue - aAdValue : aAdValue - bAdValue
        })
        finalRows.push(...sortedAds)
      })

      // Добавляем ellipsis и total в конец
      if (ellipsisRow) finalRows.push(ellipsisRow)
      if (totalRow) finalRows.push(totalRow)

      return finalRows
    } else {
      // Логика для других таблиц (без кампаний)
      const regularRows = rows.filter(
        (row: Row<ExtendedDirectReportItem>) =>
          row.original.id !== 'ellipsis' && row.original.id !== 'total'
      )

      // Сортируем обычные строки
      const sort = sorting[0]
      const sortedRegularRows = [...regularRows].sort((a, b) => {
        if (!sort) return 0

        const aValue = Number(a.original[sort.id]) || a.original[sort.id] || ''
        const bValue = Number(b.original[sort.id]) || b.original[sort.id] || ''

        // Для строк сортируем лексикографически
        if (typeof aValue === 'string' || typeof bValue === 'string') {
          return sort.desc
            ? String(bValue).localeCompare(String(aValue))
            : String(aValue).localeCompare(String(bValue))
        }

        return sort.desc ? bValue - aValue : aValue - bValue
      })

      const finalRows: typeof rows = [...sortedRegularRows]
      if (ellipsisRow) finalRows.push(ellipsisRow)
      if (totalRow) finalRows.push(totalRow)

      return finalRows
    }
  }, [table.getRowModel().rows, sorting, tableId])

  const rowVirtualizer = useVirtualizer({
    count: sortedRows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 36,
    overscan: 20,
    indexAttribute: tableName
  })

  return {
    table,
    rowVirtualizer,
    sortedRows
  }
}
