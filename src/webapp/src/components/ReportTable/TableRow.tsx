// Компонент для рендеринга строки
import { DirectReportItem } from '@/api/types/direct-report.types'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import { ReportTableCell } from '@/components/ReportTable/ReportTableCell'
import styles from '@/pages/DirectReportPages/InfiniteReportTable/InfiniteReportTable.module.css'

export const TableRow = ({
  row,
  columns,
  uniqueId,
  tableName,
  onClickRow,
  onHover,
  totalRows,
  mode
}: {
  row: any
  columns: FiltersType[]
  uniqueId: string
  tableName: string
  onClickRow?: (row: DirectReportItem) => void
  onHover: (cells: any[], isHovering: boolean) => void
  totalRows: number
  mode: 'compact' | 'fully'
}) => {
  const isTotalRow = row.original?.type === 'total'
  return (
    <tr
      key={row.id}
      onClick={() => onClickRow?.(row.original)}
      onMouseEnter={() => onHover(row.getVisibleCells(), true)}
      onMouseLeave={() => onHover(row.getVisibleCells(), false)}
      className={isTotalRow ? styles.stickyTotal : ''}
      style={{ animation: 'fadeIn 0.3s ease-in' }}
    >
      {row.getVisibleCells().map((cell: any, index: number) => (
        <ReportTableCell
          key={cell.id}
          columns={columns}
          cell={cell}
          row={row}
          index={index}
          tableName={tableName}
          uniqueId={uniqueId}
          totalRows={totalRows}
          mode={mode}
        />
      ))}
    </tr>
  )
}
