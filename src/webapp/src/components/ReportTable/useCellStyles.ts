import { CSSProperties, useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { DirectReportItem } from '@/api/types/direct-report.types'
import type { FiltersType } from '@/components/ReportTable/ReportTable.types'
import type { Cell, Row } from '@tanstack/react-table'

interface CellStyleProps {
  cell: Cell<DirectReportItem, unknown>
  row: Row<DirectReportItem>
  index: number
  columns: FiltersType[]
  width?: number
  style?: CSSProperties
  isHeader?: boolean
  totalRows?: number
  mode?: string
}

export const useCellStyles = ({
  cell,
  row,
  index,
  columns,
  width,
  style,
  isHeader = false,
  totalRows = 0,
  mode = 'fully'
}: CellStyleProps) => {
  return useMemo(() => {
    const selectedColumn = columns.find(item => item.value === cell.column.id)
    const isTotalRow = row.original?.type === 'total'
    const isEllipsisRow = row.original?.type === 'ellipsis'
    const isCampaignRow = row.original?.type === 'campaign'
    const isAdRow = row.original?.type === 'ad'
    const isFirstColumn = index === 0
    const isLastColumn = index === columns.length - 1
    const isFirstRow = row.index === 0 && !isTotalRow && !isHeader
    const isLastRow = row.index === totalRows - 1 && !isTotalRow && !isHeader
    const isCompactTotalRow = isTotalRow && mode === 'compact'
    const isTitleColumn = cell.column.id === 'title'

    const cellClasses = cn({
      'sticky-column': index === 0 && !isHeader
    })

    const cellStyle: CSSProperties = {
      textAlign: index === 0 ? 'left' : 'right',
      paddingLeft: isAdRow && isTitleColumn ? 20 : 'auto',
      fontWeight:
        isEllipsisRow || (!isTotalRow && !isCampaignRow && !isHeader)
          ? 'normal'
          : 'bold',
      fontSize: isTotalRow ? '14px' : '12px',
      borderBottom: isCompactTotalRow
        ? '1px solid var(--tg-border-color)' // Border для "Итого" в compact
        : isLastRow
          ? 'none' // Без border для "Итого" в wide и последней строки
          : '0.5px solid var(--tg-border-color)', // Обычный border
      borderRight: isLastColumn ? 'none' : '0.5px solid var(--tg-border-color)', // Без правой границы для последней колонки
      width: width || cell.column.getSize(),
      minWidth: width || cell.column.getSize(),
      maxWidth: width || cell.column.getSize(),
      ...style
    }

    const contentClasses = cn({
      'text-gray':
        !isHeader &&
        selectedColumn?.metricType === 'date' &&
        (cell.getValue() === undefined || cell.getValue() === null)
    })

    return { cellClasses, cellStyle, contentClasses }
  }, [
    columns,
    row.original?.type,
    row.index,
    index,
    isHeader,
    totalRows,
    mode,
    width,
    cell,
    style
  ])
}
