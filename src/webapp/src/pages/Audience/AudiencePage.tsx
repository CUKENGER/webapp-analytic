import React, { useRef } from 'react';
import { useParams } from 'react-router';
import { useAudienceList } from '@/api/hooks/useAudienceList';
import { columnHeadersAudience } from '@/components/ReportTable/ReportTable.columns';
import { FilterValueType } from '@/components/ReportTable/ReportTable.types';
import { useSearchState } from '@/components/utils/hooks/useSearchState';
import { initialProviders } from '@/pages/Audience/providers';
import { ChartButtonList } from '../DirectReportPages/components/ChartButtonList';
import { DirectNotFound } from '../DirectReportPages/components/DirectNotFound';
import DirectTableSegment from '../DirectReportPages/components/DirectTableSegment';
import { MenuFilter } from './components/MenuFilter';
import { PeriodFilter } from './components/PeriodFilter';
import { chartData } from './components/SubscribersChart/chartData';
import SubscribersChart from './components/SubscribersChart/SubscribersChart';


type PropTypes = {}

export interface AudienceChartLayers {
  total: boolean
  unsubscriptions: boolean
  subscriptions: boolean
}

export interface AudienceChartColors {
  total: string
  unsubscriptions: string
  subscriptions: string
}

const AudiencePage: React.FC<PropTypes> = () => {
  const {id: channelUUID} = useParams<{ id: string }>()
  const relativeContainerRef = useRef<HTMLDivElement>(null)
	const prefix = `audienceTab-v1.0`

  const [range, setRange] = useSearchState<{
    from: string
    to: string
  }>('range', {
    from: '',
    to: ''
  })

  const [providers, setProviders] = useSearchState<string[]>(
    'providers',
    initialProviders.map(p => p.value),
    { useLocalStorage: true, storagePrefix: prefix }
  )
  const { data: response } = useAudienceList({
    from: range.from,
    to: range.to,
    channelUUID,
    provider: providers,
    limit: 10
  })
  const data = response.pages[0]?.data

  const [columns, setColumns] = useSearchState<FilterValueType[]>(
    'c_au',
    columnHeadersAudience
      .slice(1, columnHeadersAudience.length)
      .map(({ value }) => value),
    { useLocalStorage: true, storagePrefix: prefix }
  )

  // Состояние для видимости типов данных с useSearchState
  const [visibleLayers, setVisibleLayers] = useSearchState<AudienceChartLayers>(
    'layers_au',
    { total: true, subscriptions: true, unsubscriptions: true }, // Исправлены ключи
    { useLocalStorage: true, storagePrefix: prefix }
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
  const chartColors: AudienceChartColors = {
    total: '#0080FF', // Подписчики
    subscriptions: '#99CCFF', // Подписки
    unsubscriptions: '#FF4000' // Отписки
  }

  // Массив метрик для ChartButtonList
  const chartMetrics = [
    { value: 'total', label: 'Подписчики', color: chartColors.total },
    {
      value: 'subscriptions',
      label: 'Подписки',
      color: chartColors.subscriptions
    },
    {
      value: 'unsubscriptions',
      label: 'Отписки',
      color: chartColors.unsubscriptions
    }
  ]

  return (
    <div className="w-full bg-tg-secondary">
      <div className="flex flex-col pb-padding-bottom-nav gap-6">
        {/* <div */}
        {/*   ref={relativeContainerRef} */}
        {/*   className="relative flex flex-col gap-4" */}
        {/* > */}
        {/*   <PeriodFilter setSelectedRange={setRange} selectedRange={range} /> */}
        {/*   <SubscribersChart */}
        {/*     relativeContainerRef={relativeContainerRef} */}
        {/*     data={chartData} */}
        {/*     colors={chartColors} // Передаем цвета */}
        {/*     visibleLayers={visibleLayers} */}
        {/*   /> */}
        {/*   <div className="flex justify-center w-full gap-2 items-center"> */}
        {/*     <ChartButton */}
        {/*       color={chartColors.total} */}
        {/*       onClick={() => toggleLayer('total')} */}
        {/*       active={visibleLayers.total} // Добавляем индикацию активности */}
        {/*     > */}
        {/*       Подписчики */}
        {/*     </ChartButton> */}
        {/*     <ChartButton */}
        {/*       color={chartColors.subscriptions} */}
        {/*       onClick={() => toggleLayer('subscriptions')} */}
        {/*       active={visibleLayers.subscriptions} */}
        {/*     > */}
        {/*       Подписки */}
        {/*     </ChartButton> */}
        {/*     <ChartButton */}
        {/*       color={chartColors.unsubscriptions} */}
        {/*       onClick={() => toggleLayer('unsubscriptions')} */}
        {/*       active={visibleLayers.unsubscriptions} */}
        {/*     > */}
        {/*       Отписки */}
        {/*     </ChartButton> */}
        {/*   </div> */}
        {/* </div> */}
        <div className="flex flex-col gap-2 instructions-screen:flex-row instructions-screen:gap-4">
          <div className="w-full instructions-screen:w-[calc(50%-0.5rem)]">
            <PeriodFilter setSelectedRange={setRange} selectedRange={range} />
          </div>
          <div className="w-full instructions-screen:w-[calc(50%-0.5rem)]">
            <MenuFilter
              selectedItems={providers}
              setSelectedItems={setProviders}
              items={initialProviders}
            />
          </div>
        </div>

        {data && data.length > 0 ? (
          <DirectTableSegment
            toPath={'audience'}
            data={data}
            hasNextPage={response.pages[0]?.hasNextPage}
            columns={columnHeadersAudience}
            selectedColumns={columns}
            setColumns={setColumns}
            epochColumns={['subscribedAtEpoch', 'unsubscribedAtEpoch']}
            tableId="Audience"
            defaultSorting="subscribedAtEpoch"
            defaultDesc={true}
          />
        ) : (
          <DirectNotFound />
        )}
      </div>
    </div>
  )
}

export default AudiencePage