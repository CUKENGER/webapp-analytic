import { Dispatch, SetStateAction } from 'react'
import { columnHeadersCampaigns } from '@/components/ReportTable/ReportTable.columns'
import { FilterValueType } from '@/components/ReportTable/ReportTable.types'
import { DirectNotFound } from './DirectNotFound'
import DirectTableSegment from './DirectTableSegment'

interface PropTypes {
  campaignsDataCompact: any
  campaignsData: any
  campaignsDataTotals: any
  columns: FilterValueType[]
  setColumns: Dispatch<SetStateAction<FilterValueType[]>>
}

export const DirectCampaignsTable = ({
  campaignsDataCompact,
  columns,
  setColumns,
  campaignsData,
  campaignsDataTotals
}: PropTypes) => {
  if (!campaignsDataCompact || campaignsDataCompact.length <= 0) {
    return <DirectNotFound />
  }

  return (
    <DirectTableSegment
      title={'Отчёт по кампаниям'}
      toPath={'campaigns'}
      data={campaignsDataCompact}
      columns={columnHeadersCampaigns}
      selectedColumns={columns}
      setColumns={setColumns}
      totals={campaignsDataTotals}
      tableId="CampaignsReport"
      hasNextPage={campaignsData?.hasNextPage}
    />
  )
}
