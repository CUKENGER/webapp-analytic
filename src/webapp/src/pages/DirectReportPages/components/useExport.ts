import { useCallback } from 'react'
import { DirectReportItem } from '@/api/types/direct-report.types'
import { FiltersType } from '@/components/ReportTable/ReportTable.types'

interface PropTypes {
  columns: FiltersType[]
  data: DirectReportItem[]
  title: string
  epochColumns?: string[]
}

const useExport = ({
  columns,
  data,
  title,
  epochColumns = [],
}: PropTypes) => {
  const visibleHeaders = columns.map(col => col.label)
  const visibleColumnIds = columns.map(col => col.value)

  const getCellValue = (item: DirectReportItem, columnId: string) => {
    const value = item[columnId as keyof DirectReportItem] ?? ''
    if (epochColumns.includes(columnId) && typeof value === 'string') {
      const epochValue = parseInt(value, 10)
      if (!isNaN(epochValue)) {
        return new Date(epochValue).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      }
    }
    return value
  }

  const exportToPDF = useCallback(async () => {
    const { default: jsPDF } = await import('jspdf')
    await import('jspdf-autotable') // Регистрирует autotable в jsPDF

    const doc = new jsPDF({ orientation: 'landscape' })
    try {
      const response = await fetch('/Roboto-Regular.ttf')
      const arrayBuffer = await response.arrayBuffer()
      const base64Font = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
      doc.addFileToVFS('Roboto-Regular.ttf', base64Font)
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal')
      doc.setFont('Roboto')
    } catch (error) {
      console.error('Failed to load font:', error)
      doc.setFont('helvetica')
    }

    doc.setFontSize(10)
    const headers = visibleHeaders
    const bodyData = data.map(item =>
      visibleColumnIds.map(columnId => getCellValue(item, columnId) || '')
    )

      ; (doc as any).autoTable({
        head: [headers],
        body: bodyData.length ? bodyData : [[]],
        styles: {
          font: doc.getFont().fontName === 'Roboto' ? 'Roboto' : 'helvetica',
          fontSize: 10,
        },
      })

    doc.save(`${title}_data.pdf`)
  }, [data, title, columns])

  const exportToCSV = useCallback(() => {
    const csvHeaders = visibleHeaders.join(',')
    const rows = data.map(item =>
      visibleColumnIds.map(columnId => getCellValue(item, columnId)).join(',')
    )
    const csvContent = [csvHeaders, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${title}_data.csv`
    link.click()
  }, [data, title, columns])

  const exportToXLSX = useCallback(async () => {
    const { utils, writeFile } = await import('xlsx')
    const worksheetData = [
      visibleHeaders,
      ...data.map(item =>
        visibleColumnIds.map(columnId => getCellValue(item, columnId))
      ),
    ]
    const worksheet = utils.aoa_to_sheet(worksheetData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Report')
    writeFile(workbook, `${title}_data.xlsx`)
  }, [data, title, columns])

  return {
    exportToPDF,
    exportToCSV,
    exportToXLSX,
  }
}

export default useExport