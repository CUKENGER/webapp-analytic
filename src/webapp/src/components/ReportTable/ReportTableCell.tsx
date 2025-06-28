import { useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Cell as CellType, flexRender, Row } from '@tanstack/react-table'
import { DirectReportItem } from '@/api/types/direct-report.types'
import iconSettings from '@/assets/settings-icon-table.svg'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import { cn } from '@/lib/utils'
import MenuEditCost from '@/pages/Links/components/MenuEditCost'
import { EditIcon } from '../icons/EditIcon'
import { PATHS } from '../utils/paths'
import { useCellStyles } from './useCellStyles'

// Расширяем интерфейс для поддержки дополнительных полей из API
interface ExtendedDirectReportItem extends DirectReportItem {
  is_revoked?: boolean
  source?: 'custom' | 'channel'
}

interface ReportTableCellProps {
  columns: FiltersType[]
  cell: CellType<ExtendedDirectReportItem, unknown>
  row: Row<ExtendedDirectReportItem>
  index: number
  tableName: string
  uniqueId: string
  totalRows?: number
  mode?: 'compact' | 'fully'
}

export const ReportTableCell = ({
  columns,
  cell,
  row,
  index,
  tableName,
  uniqueId,
  totalRows,
  mode
}: ReportTableCellProps) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedColumn = columns.find(item => item.value === cell.column.id)
  const id = `${uniqueId}_${cell.id}`

  const { cellClasses, cellStyle, contentClasses } = useCellStyles({
    cell,
    row,
    index,
    columns,
    width: selectedColumn?.width,
    style: selectedColumn?.style,
    totalRows
  })

  const isRevoked = !!row.original.is_revoked
  const isTotalRow = row.original.type === 'total'
  const isEllipsisRow = row.original.type === 'ellipsis'
  const isChannelSource =
    row.original['source'] === 'channel' && index === 0 && !isEllipsisRow

  const handleClickSettingsLink = useCallback(() => {
    if (cell.column.id !== 'url' || !row.original.id) return
    const params = searchParams.toString()
    navigate({
      pathname: PATHS.links.absolute.edit(row.original.id),
      search: params
    })
  }, [navigate, searchParams, cell.column.id, row.original.id])

  const shouldRenderEditCost = useMemo(
    () =>
      tableName === 'links' &&
      cell.column.id === 'cost' &&
      !isTotalRow &&
      !isEllipsisRow,
    [tableName, cell.column.id, isTotalRow]
  )

  const renderCellContent = () => {
    if (isEllipsisRow) return '...'
    if (isTotalRow && index === 0) {
      return <span className="font-bold text-sm text-tg-text">Итого</span>
    }

    const cellValue = cell.getValue()
    if (
      cell.column.id === 'name' &&
      !isTotalRow &&
      (!cellValue || String(cellValue).trim() === '')
    ) {
      return <span className="text-gray">нет</span>
    }

    return flexRender(cell.column.columnDef.cell, cell.getContext())
  }

  const cellStyles = useMemo(
    () => ({
      ...cellStyle,
      minWidth: cell.column.columnDef.minSize,
      maxWidth: cell.column.columnDef.maxSize
    }),
    [cellStyle, cell.column.columnDef.minSize, cell.column.columnDef.maxSize]
  )

  return (
    <td key={id} id={id} className={cellClasses} style={cellStyles}>
      <div className="flex items-center w-full">
        <div
          className={cn(
            'overflow-hidden overflow-ellipsis whitespace-nowrap w-full',
            contentClasses,
						isChannelSource && 'font-bold'
          )}
        >
          {renderCellContent()}
        </div>
        {isChannelSource && (
          <button
            className={cn('flex-shrink-0 pl-1', isRevoked && 'opacity-50')}
            onClick={handleClickSettingsLink}
            disabled={isRevoked}
            aria-label="Edit settings"
          >
            <EditIcon />
          </button>
        )}
        {shouldRenderEditCost && (
          <div className="flex items-center pl-2 flex-shrink-0">
            <MenuEditCost
              value={row.original.cost?.toString() ?? ''}
              id={row.original.id}
              source={row.original.source}
              disabled={isRevoked}
            />
          </div>
        )}
      </div>
    </td>
  )
}
