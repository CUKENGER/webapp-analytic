import { useCallback, useRef } from 'react'
import { uniqueId } from 'lodash'
import { TableHeader } from '@/components/ReportTable/components/TableHeader/TableHeader'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import { TableRow } from '@/components/ReportTable/TableRow'
import { cn } from '@/lib/utils'
import { OptionsIcon } from '../icons/OptionsIcon'
import { TableContainer } from './components/TableContainer'
import { useReportTableData } from './model/useReportTableData'
import styles from './ReportTable.module.css'
import { useTableScroll } from './useTableScroll'
import type { DirectReportItem } from '@/api/types/direct-report.types'
import type { Cell } from '@tanstack/react-table'

interface PropTypes {
  dataProvider: DirectReportItem[] | undefined
  onClickRow?: (row: DirectReportItem) => void
  columns: FiltersType[]
  totals?: DirectReportItem | null
  showTotals?: boolean
  tableName?: 'links' | string
  tableId: string
  openModal: (e: string) => void
  isFully: boolean
  handleClickFully: (e: React.MouseEvent) => void
  hasNextPage?: boolean
  defaultSorting?: string
  defaultDesc?: boolean
}

const ReportTable = ({
  dataProvider,
  onClickRow,
  columns,
  totals = null,
  showTotals = false,
  tableName = 'table',
  tableId,
  openModal,
  isFully,
  handleClickFully,
  hasNextPage = false,
  defaultSorting,
  defaultDesc
}: PropTypes) => {
  const tableUniqueId = uniqueId('table_')
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const mode = 'compact'

  const { table, sortedRows, rowVirtualizer } = useReportTableData({
    tableName,
    tableContainerRef,
    tableId,
    dataProvider,
    showTotals,
    columns,
    mode,
    totals,
    hasNextPage,
    defaultSorting,
    defaultDesc
  })

  const { tableWidth, isWideScreen, tableRef, buttonWidth } = useTableScroll({
    table,
    containerRef: tableContainerRef,
    tableId,
    columns
  })

  const handleRowHover = useCallback(
    (cells: Cell<DirectReportItem, unknown>[], isHovering: boolean) => {
      cells.forEach(cell => {
        const cellElement = document.getElementById(
          `${tableUniqueId}_${cell.id}`
        )
        if (cellElement) {
          cellElement.classList.toggle(styles.hovered, isHovering)
        }
      })
    },
    [tableUniqueId]
  )
  const containerWidth = tableContainerRef?.current?.clientWidth || 0
  const widthToTable = containerWidth - 64 || 1000

  const adaptiveButtonWidth = isWideScreen ? buttonWidth + 16 : buttonWidth - 16

  return (
    <TableContainer
      tableId={tableId}
      tableContainerRef={tableContainerRef}
      containerWidth={containerWidth || 1032}
      tableWidth={tableWidth || 1000}
      isWideScreen={isWideScreen}
    >
      <div className="bg-tg-background">
        <table
          className={styles.customTable}
          ref={tableRef}
          width={widthToTable}
        >
          <TableHeader table={table} />
          <tbody>
            {rowVirtualizer.getVirtualItems().map(virtualRow => (
              <TableRow
                key={virtualRow.index}
                row={sortedRows[virtualRow.index]}
                columns={columns}
                uniqueId={tableUniqueId}
                tableName={tableName ?? 'table'}
                onClickRow={onClickRow}
                onHover={handleRowHover}
                totalRows={10}
                mode={mode}
              />
            ))}
          </tbody>
        </table>
        <div
          className="sticky left-0 -ml-4 pl-4 bottom-0 z-10 bg-tg-background rounded-lg transition-all duration-100"
          style={{
            width: `${adaptiveButtonWidth}px`
          }}
        >
          <div
            className={
              'flex justify-between gap-2 w-full bg-tg-background rounded-b-2xl p-4 pb-0 pt-4 px-0'
            }
          >
            <button
              className="h-[38px] text-sm flex-1 text-center border rounded-lg border-table-button-border hover:bg-table-button-hover active:hover:bg-table-button-hover transition-colors duration-300 ease-in-out"
              aria-label="Развернуть таблицу"
              onClick={e => handleClickFully(e)}
              disabled={!isFully}
            >
              <span
                className={cn(
                  'font-bold',
                  isFully ? 'text-tg-link' : 'text-gray'
                )}
              >
                Показать всё
              </span>
            </button>
            <div
              className="flex items-center gap-2 h-full flex-shrink-0 border rounded-lg border-table-button-border hover:bg-table-button-hover active:hover:bg-table-button-hover transition-colors duration-300 ease-in-out"
              onClick={() => openModal(`TableFilter-${tableId}`)}
            >
              <button className="p-2">
                <OptionsIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TableContainer>
  )
}

export default ReportTable
