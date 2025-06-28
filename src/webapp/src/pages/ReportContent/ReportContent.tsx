import { useRef } from 'react'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import { ChartButton } from '../Audience/components/ChartButton'
import { PeriodFilter } from '../Audience/components/PeriodFilter'
import { CoverageChart } from './components/CoverageChart/CoverageChart'
import { CoverageChartData } from './components/CoverageChart/model/coverageChartData'

export interface CoverageChartLayers {
  er: boolean
  err: boolean
}

export interface CoverageChartColors {
  er: string
  err: string
}

const ReportContent = () => {
  const relativeContainerRef = useRef<HTMLDivElement>(null)

  const [range, setRange] = useSearchState<{
    from: string
    to: string
  }>('range', {
    from: '',
    to: ''
  })

  // Состояние для видимости типов данных с useSearchState
  const [visibleLayers, setVisibleLayers] = useSearchState<CoverageChartLayers>(
    'layers_coverage',
    { er: true, err: true },
    { useLocalStorage: true, storagePrefix: 'contentTab' }
  )

  // Функция для переключения видимости
  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => {
      // Считаем активные слои
      const activeLayersCount = Object.values(prev).filter(Boolean).length
      // Если пытаемся отключить последний активный слой, не меняем состояние
      if (activeLayersCount === 1 && prev[layer]) {
        return prev
      }
      // Иначе переключаем слой
      return {
        ...prev,
        [layer]: !prev[layer]
      }
    })
  }

  // Определяем цвета для кнопок и графика
  const chartColors: CoverageChartColors = {
    er: '#99CCFF', // Подписчики
    err: '#0080FF' // Подписки
  }

  return (
    <div className="w-full bg-tg-secondary">
      <div className="flex flex-col pb-padding-bottom-nav gap-6">
        <div
          ref={relativeContainerRef}
          className="relative flex flex-col gap-4"
        >
          <PeriodFilter setSelectedRange={setRange} selectedRange={range} />
          <CoverageChart
            relativeContainerRef={relativeContainerRef}
            data={CoverageChartData}
            colors={chartColors} // Передаем цвета
            visibleLayers={visibleLayers}
          />
          <div className="flex justify-center w-full gap-2 items-center">
            <ChartButton
              color={chartColors.er}
              onClick={() => toggleLayer('er')}
              active={visibleLayers.er}
            >
              ER
            </ChartButton>
            <ChartButton
              color={chartColors.err}
              onClick={() => toggleLayer('err')}
              active={visibleLayers.err}
            >
              ERR
            </ChartButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportContent
