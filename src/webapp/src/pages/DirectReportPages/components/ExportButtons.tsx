import React from 'react'
import { Button } from '@/components/ui/button'

interface PropTypes {
  exportToPDF: () => void
  exportToCSV: () => void
  exportToXLSX: () => void
  onClose?: () => void
}

export const ExportButtons = ({
  exportToXLSX,
  exportToPDF,
  exportToCSV,
  onClose
}: PropTypes) => {
  const handleExportToPDF = () => {
    exportToPDF()
    if (onClose) {
      onClose()
    }
  }
  const handleExportToCSV = () => {
    exportToCSV()
    if (onClose) {
      onClose()
    }
  }
  const handleExportToXLSX = () => {
    exportToXLSX()
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="p-4 flex flex-col gap-2">
      <Button
        className="p-2 bg-tg-secondary shadow-sm text-tg-text w-full hover:shadow-md transition-all duration-200 rounded-lg"
        onClick={handleExportToPDF}
        aria-label="Экспорт в PDF"
      >
        Экспорт в PDF
      </Button>
      <Button
        className="p-2 bg-tg-secondary shadow-sm text-tg-text w-full hover:shadow-md transition-all duration-200 rounded-lg"
        onClick={handleExportToCSV}
        aria-label="Экспорт в CSV"
      >
        Экспорт в CSV
      </Button>
      <Button
        className="p-2 bg-tg-secondary shadow-sm text-tg-text w-full hover:shadow-md transition-all duration-200 rounded-lg"
        onClick={handleExportToXLSX}
        aria-label="Экспорт в XLSX"
      >
        Экспорт в XLSX
      </Button>
    </div>
  )
}
