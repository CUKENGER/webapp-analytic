import { useCallback, useRef } from 'react'
import { SortingState } from '@tanstack/react-table'
import { uniqueId } from 'lodash'
import { Loader2 } from 'lucide-react'
import { DirectReportItem } from '@/api/types/direct-report.types'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import { TableRow } from '@/components/ReportTable/TableRow'
import { cn } from '@/lib/utils'
import { InfiniteTableHeader } from './components/InfiniteTableHeader'
import styles from './InfiniteReportTable.module.css'
import { useInfiniteData } from './model/useInfiniteData'
import type { Cell } from '@tanstack/react-table'

interface PropTypes {
  dataProvider: DirectReportItem[] | undefined
  onLoadMore?: () => void
  onClickRow?: (row: DirectReportItem) => void
  mode?: 'compact' | 'fully'
  columns: FiltersType[]
  totals?: DirectReportItem | null
  showTotals?: boolean
  hasNextPage?: boolean
  tableName?: 'links' | undefined
  tableId: string
  isFetchingNextPage?: boolean
  pageCount?: number
  sorting?: SortingState // Добавляем проп для сортировки
  onSortingChange?: (sorting: SortingState) => void // Добавляем обработчик
  tableType: 'campaigns' | 'days' | 'links' | 'audience'
}

const InfiniteReportTable = ({
  dataProvider,
  onLoadMore,
  onClickRow,
  mode = 'fully',
  columns,
  totals = null,
  showTotals = false,
  hasNextPage = false,
  tableName,
  tableId,
  isFetchingNextPage,
  pageCount = 0,
  sorting = [{ id: 'date', desc: true }],
  onSortingChange,
  tableType
}: PropTypes) => {
  const localUniqueId = uniqueId('table_')
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { table, rows, totalRowObject, totalRows, triggerRef, inView } =
    useInfiniteData({
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
    })

  const handleRowHover = useCallback(
    (cells: Cell<DirectReportItem, unknown>[], isHovering: boolean) => {
      cells.forEach(cell => {
        const cellElement = document.getElementById(
          `${localUniqueId}_${cell.id}`
        )
        if (cellElement) {
          cellElement.classList.toggle(styles.hovered, isHovering)
        }
      })
    },
    [localUniqueId]
  )

  const containerWidth = tableContainerRef?.current?.clientWidth || 0
  const widthToTable = containerWidth + 32

  return (
    <div
      className={cn(styles.tableContainer, 'bg-tg-background custom-scrollbar')}
      ref={tableContainerRef}
      data-table-id={tableId}
    >
      <div>
        <table className={styles.customTable} width={widthToTable}>
          <InfiniteTableHeader
            table={table}
            columns={columns}
            sorting={sorting}
            isFetching={isFetchingNextPage}
          />
          <tbody>
            {rows.map(row => (
              <TableRow
                key={row.id}
                row={row}
                columns={columns}
                uniqueId={localUniqueId}
                tableName={tableName ?? 'table'}
                onClickRow={onClickRow}
                onHover={handleRowHover}
                totalRows={totalRows}
                mode={mode}
              />
            ))}
          </tbody>
          {totalRowObject && showTotals && (
            <tfoot className={styles.totalRow}>
              <TableRow
                key={totalRowObject.id}
                columns={columns}
                row={totalRowObject}
                tableName={tableName ?? 'table'}
                uniqueId={localUniqueId}
                onClickRow={onClickRow}
                onHover={handleRowHover}
                totalRows={totalRows}
                mode={mode}
              />
            </tfoot>
          )}
          {hasNextPage && (
            <tbody>
              <tr ref={triggerRef} className={styles.ellipsisRow}>
                {columns.map((_, index) => (
                  <td
                    key={`ellipsis-${index}`}
                    className={cn(
                      styles.ellipsisCell,
                      index === 0 ? 'text-left' : 'text-right',
                      'border-[var(--tg-border-color)] border-t',
                      index < columns.length - 1 && 'border-r'
                    )}
                  >
                    ...
                  </td>
                ))}
              </tr>
            </tbody>
          )}
        </table>
        {hasNextPage && (
          <div
            ref={triggerRef}
            className={cn(
              styles.loaderContainer,
              'flex justify-center items-center py-2'
            )}
          >
            {(inView || isFetchingNextPage) && (
              <Loader2 className="size-5 animate-spin text-tg-text" />
            )}
          </div>
        )}
        {!hasNextPage && pageCount > 2 && (
          <div className="text-center font-bold text-tg-hint text-lg py-4">
            Все данные загружены
          </div>
        )}
      </div>
    </div>
  )
}

export default InfiniteReportTable
