import {
  Dispatch,
  lazy,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { Label } from '@radix-ui/react-label'
import { DirectReportItem } from '@/api/types/direct-report.types'
// import useExport from '@/pages/DirectReportPages/components/useExport'
import { FilterShowSettings } from '@/components/FilterShow/FilterShowSettings'
import { Modal } from '@/components/Modal/Modal'
import {
  FiltersType,
  FilterValueType
} from '@/components/ReportTable/ReportTable.types'
import { useModal } from '@/hooks/useModal'

const ReportTable = lazy(() => import('@/components/ReportTable/ReportTable'))

type PropTypes = {
  data: DirectReportItem[]
  title?: string
  toPath: string
  columns: FiltersType[]
  selectedColumns: FilterValueType[]
  setColumns: Dispatch<SetStateAction<FilterValueType[]>>
  totals?: any
  epochColumns?: FilterValueType[]
  hasNextPage: boolean
  tableName?: 'links'
  tableId?: string
  defaultSorting?: string
  defaultDesc?: boolean
}

const DirectTableSegment = (props: PropTypes) => {
  const {
    data,
    columns,
    title,
    toPath,
    selectedColumns,
    setColumns,
    totals,
    epochColumns = [],
    hasNextPage = false,
    tableName,
    tableId,
    defaultSorting,
    defaultDesc
  } = props
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const options = useMemo(() => columns.slice(1), [columns])

  const { isOpen, openModal, closeModal } = useModal()

  const visibleColumns = useMemo(
    () => [
      columns[0],
      ...columns.filter(({ value }) => selectedColumns.includes(value))
    ],
    [columns, selectedColumns]
  )

  const handleClickFully = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigate({ pathname: toPath, search: searchParams.toString() })
    },
    [navigate, searchParams, toPath]
  )

  // const { exportToCSV, exportToPDF, exportToXLSX } = useExport({
  //   columns,
  //   data,
  //   title: title || 'Отчет',
  //   epochColumns
  // })

  const result = [...data]
  const isFully = result.length > 10 || hasNextPage

  const [resetPendingFilters, setResetPendingFilters] = useState<
    (() => void) | undefined
  >(undefined)

  const handleClose = () => {
    resetPendingFilters?.()
    closeModal()
  }

  const handleCancel = () => {
    handleClose()
  }

  const onConfirm = (pending: string[]) => {
    setColumns(pending)
    handleClose()
  }

  return (
    <div>
      <div className="flex w-full justify-center flex-col">
        {title && (
          <Label className="text-xl font-bold text-center text-tg-text">
            {title}
          </Label>
        )}
        <div className="mt-4">
          <ReportTable
            dataProvider={data}
            columns={visibleColumns}
            totals={totals}
            showTotals={!!totals}
            tableName={tableName}
            tableId={`DirectTableSegment-${tableId}-${title}`}
            openModal={openModal}
            isFully={isFully}
            handleClickFully={handleClickFully}
            hasNextPage={hasNextPage}
            defaultSorting={defaultSorting}
            defaultDesc
          />
        </div>
      </div>
      <Modal onOpenChange={handleClose} isOpen={isOpen}>
        <FilterShowSettings
          columns={options}
          selectedFilters={selectedColumns}
          onConfirm={onConfirm}
          handleClose={handleClose}
          handleCancel={handleCancel}
          setResetPendingFilters={setResetPendingFilters}
        />
      </Modal>
    </div>
  )
}

export default DirectTableSegment
