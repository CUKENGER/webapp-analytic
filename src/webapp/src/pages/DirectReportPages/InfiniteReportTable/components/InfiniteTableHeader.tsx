import { SortingState, Table } from '@tanstack/react-table'
import styles from './InfiniteTableHeader.module.css'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'
import { memo } from 'react'
import { InfiniteTableHeaderCell } from './InfiniteTableHeaderCell/InfiniteTableHeaderCell'

interface InfiniteTableHeaderProps {
  table: Table<any>
  columns: FiltersType[]
  sorting: SortingState
  isFetching?: boolean
}

export const InfiniteTableHeader = memo(({ table, columns, sorting, isFetching }: InfiniteTableHeaderProps) => {
  return (
    <thead className={styles.stickyHeader}>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <InfiniteTableHeaderCell
              key={header.id}
              header={header}
              columns={columns}
              sorting={sorting}
              isFetching={isFetching}
              table={table}
            />
          ))}
        </tr>
      ))}
    </thead>
  )
})
