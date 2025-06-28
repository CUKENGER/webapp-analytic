import { Dispatch, SetStateAction } from 'react'
import { DirectReportDaysResponse } from '@/api/hooks/direct/useDirectDays'
import { columnHeadersDays } from '@/components/ReportTable/ReportTable.columns'
import { FilterValueType } from '@/components/ReportTable/ReportTable.types'
import { DirectNotFound } from './DirectNotFound'
import DirectTableSegment from './DirectTableSegment'

interface PropTypes {
  reportData: DirectReportDaysResponse | null
  columns: FilterValueType[]
  setColumns: Dispatch<SetStateAction<FilterValueType[]>>
}

export const DirectDaysTable = ({
  reportData,
  setColumns,
  columns
}: PropTypes) => {
  if (!reportData?.data || reportData?.data.length <= 0) {
    return <DirectNotFound />
  }

  return (
    <DirectTableSegment
      title={'Отчёт по дням'}
      toPath={'days'}
      data={reportData.data}
      hasNextPage={reportData.hasNextPage}
      columns={columnHeadersDays}
      selectedColumns={columns}
      setColumns={setColumns}
      totals={reportData.totals}
      tableId="DaysReport"
      defaultSorting="date"
      defaultDesc={true}
    />
  )
}
