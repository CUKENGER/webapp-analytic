import { flexRender, Table } from '@tanstack/react-table'
import { SortIcon } from '@/components/icons/SortIcon/SortIcon'
import styles from './TableHeader.module.css'

export const TableHeader = ({ table }: { table: Table<any> }) => {
  return (
    <thead>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => {
            // Проверяем, можно ли сортировать столбец
            const canSort = header.column.getCanSort()
            const isSorted = header.column.getIsSorted() // 'asc' | 'desc' | false

            // Кастомный обработчик сортировки
            const handleSortClick = () => {
              if (!canSort) return

              const currentSort = header.column.getIsSorted()
              let nextSort: 'asc' | 'desc'

              // Если столбец не отсортирован, начинаем с 'desc'
              if (!currentSort) {
                nextSort = 'desc'
              } else {
                // Переключаем между 'desc' и 'asc'
                nextSort = currentSort === 'desc' ? 'asc' : 'desc'
              }

              // Обновляем состояние сортировки
              table.setSorting([
                { id: header.column.id, desc: nextSort === 'desc' }
              ])
            }

            return (
              <th
                key={header.id}
                className="select-none hover:text-tg-link active:text-tg-link"
                style={{
                  width: header.getSize(),
                  paddingTop: 0,
                  paddingBottom: 0,
                  height: '28px',
                  minWidth: header.column.columnDef.minSize, // Минимальная ширина
                  maxWidth: header.column.columnDef.maxSize, // Максимальная ширина (опционально),
                  borderBottom: '1px solid var(--tg-border-color)',
                  cursor: canSort ? 'pointer' : 'default'
                }}
                onClick={handleSortClick}
              >
                <div className={styles.headerContent}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {canSort && <SortIcon isSorted={isSorted} />}
                </div>
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
