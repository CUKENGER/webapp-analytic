import { flexRender, SortingState, Table } from '@tanstack/react-table'
import { SortIcon } from '@/components/icons/SortIcon/SortIcon'
import { useCellStyles } from '@/components/ReportTable/useCellStyles'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import styles from '../InfiniteTableHeader.module.css'

interface HeaderCellProps {
  header: any // Тип можно уточнить, если есть интерфейс для header
  columns: FiltersType[]
  sorting: SortingState
  isFetching?: boolean
  table: Table<any>
}

// Компонент для отдельной ячейки заголовка
export const InfiniteTableHeaderCell = ({ header, columns, sorting, isFetching, table }: HeaderCellProps) => {
  const canSort = header.column.getCanSort()
  const sortState = sorting.find(s => s.id === header.column.id)
  const isSorted = sortState ? (sortState.desc ? 'desc' : 'asc') : false

  const { cellStyle } = useCellStyles({
    cell: {
      column: header.column,
      getValue: () => undefined,
      id: header.id,
      getContext: () => ({} as any)
    } as any,
    row: {
      index: 0,
      original: null,
      getParentRows: () => []
    } as any,
    index: header.index,
    columns,
    isHeader: true
  })

  const handleSortClick = () => {
    if (!canSort || isFetching) return
    const currentSort = sorting.find(s => s.id === header.column.id)
    let nextSort: 'asc' | 'desc'

    // Если столбец не отсортирован, начинаем с 'desc'
    if (!currentSort) {
      nextSort = 'desc'
    } else {
      // Переключаем между 'desc' и 'asc'
      nextSort = currentSort.desc ? 'asc' : 'desc'
    }

    table.setSorting([{ id: header.column.id, desc: nextSort === 'desc' }])
  }

  return (
    <th
      key={header.id}
      className="select-none hover:text-tg-link active:text-tg-link transition-colors duration-300 ease-in-out"
      style={{
        ...cellStyle,
        paddingTop: 0,
        paddingBottom: 0,
        height: '28px',
        minWidth: header.column.columnDef.minSize,
        maxWidth: header.column.columnDef.maxSize,
        cursor: canSort && !isFetching ? 'pointer' : 'default'
      }}
      onClick={handleSortClick}
    >
      <div className={styles.headerContent}>
        {flexRender(header.column.columnDef.header, header.getContext())}
        {canSort && <SortIcon isSorted={isSorted} />}
      </div>
    </th>
  )
}

