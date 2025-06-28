import { RefObject, useEffect, useRef, useState } from 'react'
import { Table } from '@tanstack/react-table'
import { DirectReportItem } from '@/api/types/direct-report.types'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'

const SCROLL_CONSTANTS = {
  MIN_CELL_WIDTH: 107,
  OFFSET: 16,
  BREAKPOINT: 1368
}

export const useTableScroll = ({
  table,
  containerRef,
  tableId,
  columns
}: {
  table: Table<DirectReportItem>
  containerRef: RefObject<HTMLDivElement>
  tableId: string
  columns: FiltersType[]
}) => {
  const [isWideScreen, setIsWideScreen] = useState(false)
  const [tableWidth, setTableWidth] = useState(0)
  const [buttonWidth, setButtonWidth] = useState(0)
  const tableRef = useRef<HTMLTableElement>(null)

  const calculateTableWidth = () => {
    const columns = table.getAllColumns()
    const totalColumnsWidth = columns.reduce(
      (acc, column) => acc + column.getSize(),
      0
    )
    const tableElement = tableRef.current
    const containerElement = containerRef.current
    const containerWidth = containerElement?.offsetWidth
    const containerClientWidth = containerElement?.clientWidth || 0

    const sidePadding = 16 // Левый отступ из tableStyles.side
    const rightPadding = 16 // Правый отступ из tableStyles.rightWork
    const buttonWidth = containerClientWidth - sidePadding - rightPadding // Огр
    setButtonWidth(buttonWidth)

    const realTableWidth = tableElement
      ? tableElement.offsetWidth
      : totalColumnsWidth

    let newTableWidth: number
    if (containerWidth) {
      if (realTableWidth + 63 < containerWidth) {
        newTableWidth = containerWidth - 32
      } else {
        newTableWidth = realTableWidth + 32
      }
    } else {
      newTableWidth = realTableWidth + 32
    }

    return newTableWidth
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateTableDimensions = () => {
      const screenWidth = window.innerWidth
      const newWidth = calculateTableWidth()
      setTableWidth(newWidth)
      setIsWideScreen(screenWidth > SCROLL_CONSTANTS.BREAKPOINT)
    }

    updateTableDimensions()
    window.addEventListener('resize', updateTableDimensions)

    const observer = new ResizeObserver(updateTableDimensions)
    if (tableRef.current) observer.observe(tableRef.current)

    return () => {
      window.removeEventListener('resize', updateTableDimensions)
      if (tableRef.current) observer.unobserve(tableRef.current)
    }
  }, [containerRef, table, tableId, columns]);

  return { tableWidth, isWideScreen, tableRef, buttonWidth }
}
