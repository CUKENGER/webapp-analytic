import { useEffect, useRef, useState } from 'react';
import { DirectReportDaysFullResponse } from '@/api/hooks/direct/useDirectDaysFull';
import { BlockTitle } from '@/components/@common/BlockTitle';
import { NewReportChart } from '@/components/NewReportChart/NewReportChart';
import { columnHeadersDays } from '@/components/ReportTable/ReportTable.columns';
import { FilterValueType } from '@/components/ReportTable/ReportTable.types';
import { useSearchState } from '@/components/utils/hooks/useSearchState';
import { ChartButtonList } from './ChartButtonList';
import { DirectNotFound } from './DirectNotFound';
import { CustomLoader } from '@/components/@common/CustomLoader'
interface PropTypes {
  chartData: DirectReportDaysFullResponse | null
  prefix: string
}

export const DirectDaysChart = ({ chartData, prefix }: PropTypes) => {
  const relativeContainerRef = useRef<HTMLDivElement>(null)
  const options = columnHeadersDays.slice(1, columnHeadersDays.length)

  const [filterValue, setFilterValue] = useSearchState<FilterValueType>(
    'metrics',
    'cost',
    { useLocalStorage: true, storagePrefix: prefix }
  )

  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return <DirectNotFound />
  }
  
  return (
    <div>
      {chartData && chartData.data && chartData.data.length > 0 ? (
        <>
          <BlockTitle title="График по дням" className="space-y-0 mt-0" />
          <div
            ref={relativeContainerRef}
            className="relative flex flex-col gap-4"
          >
            <NewReportChart
              data={chartData.data}
              selectedMetric={filterValue}
              relativeContainerRef={relativeContainerRef}
            />
            <ChartButtonList
              options={options}
              selectedOption={filterValue}
              setSelectedOption={setFilterValue}
              needPadding={false}
            />
          </div>
        </>
      ) : (
        <DirectNotFound />
      )}
    </div>
  )
}