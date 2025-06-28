import { useMemo } from 'react'
import { columnHeadersDays } from '@/components/ReportTable/ReportTable.columns'
import { formatYTick } from '@/components/utils/formatYTick'
import { REPORT_CHART_CONSTANTS } from './const'

interface ChartDimensionsProps {
  data: any[] // Формат: [{ date, [selectedMetric]: value }, ...]
  filterValue?: string
}

export const useChartDimensions = ({
  data,
  filterValue
}: ChartDimensionsProps) => {

  const metricType = useMemo(
    () => columnHeadersDays.find(item => item.value === filterValue)?.metricType,
    [filterValue]
  );

  // Преобразуем входные данные в формат для @nivo/line
  const normalizedData = useMemo(() => {
    return [
      {
        id: filterValue || 'series',
        data: data
          .map(item => ({
            x: item.date,
            y: Number(item[filterValue!] ?? 0)
          }))
      }
    ]
  }, [data, filterValue])

  const rawMinYValue = useMemo(() => {
    const values = normalizedData.flatMap(item =>
      item.data.map(point => Number(point.y) || 0)
    )
    return values.length ? Math.min(...values) : 0
  }, [normalizedData])

  const rawMaxYValue = useMemo(() => {
    const values = normalizedData.flatMap(item =>
      item.data.map(point => Number(point.y) || 0)
    )
    return values.length ? Math.max(...values) : 1
  }, [normalizedData])

  const getNiceStep = (range: number): number => {
    const targetTicks = REPORT_CHART_CONSTANTS.MIN_TICK_COUNT - 1
    const rawStep = range / targetTicks
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
    const normalized = rawStep / magnitude
    if (normalized <= 1.5) return magnitude
    if (normalized <= 3) return magnitude * 2
    if (normalized <= 7) return magnitude * 5
    return magnitude * 10
  }

  const yTickValues = useMemo(() => {
    if (!normalizedData?.[0]?.data?.length) {
      return [0, 1, 2, 3, 4] // Шкала Y для пустого графика
    }

    if (normalizedData[0].data.length === 1) {
      const yValue = Number(normalizedData[0].data[0].y) || 0
      const step = getNiceStep(yValue || 1)
      const roundedMin = Math.floor(yValue / step) * step
      const roundedMax = Math.ceil((yValue + step) / step) * step
      const ticks: number[] = []
      for (let value = roundedMin; value <= roundedMax; value += step) {
        ticks.push(value)
      }
      while (ticks.length < REPORT_CHART_CONSTANTS.MIN_TICK_COUNT) {
        ticks.push(ticks[ticks.length - 1] + step)
        ticks.unshift(ticks[0] - step)
      }
      return ticks
    }

    const range = rawMaxYValue - rawMinYValue || 1
    const step = getNiceStep(range)
    const roundedMin = Math.floor(rawMinYValue / step) * step
    const roundedMax = Math.ceil(rawMaxYValue / step) * step
    const ticks: number[] = []
    for (let value = roundedMin; value <= roundedMax; value += step) {
      ticks.push(value)
    }

    if (
      ticks.length < REPORT_CHART_CONSTANTS.MIN_TICK_COUNT &&
      ticks.length > 0
    ) {
      const smallerStep = step / 2
      const newTicks: number[] = []
      const newRoundedMin = Math.floor(rawMinYValue / smallerStep) * smallerStep
      const newRoundedMax = Math.ceil(rawMaxYValue / smallerStep) * smallerStep
      for (
        let value = newRoundedMin;
        value <= newRoundedMax;
        value += smallerStep
      ) {
        newTicks.push(value)
      }
      while (
        newTicks.length < REPORT_CHART_CONSTANTS.MIN_TICK_COUNT &&
        newTicks.length > 0
      ) {
        newTicks.push(newTicks[newTicks.length - 1] + smallerStep)
      }
      return newTicks
    }

    return ticks
  }, [rawMinYValue, rawMaxYValue, normalizedData])

  const minYValue = useMemo(() => yTickValues[0], [yTickValues])
  const maxYValue = useMemo(
    () => yTickValues[yTickValues.length - 1],
    [yTickValues]
  )

  const chartContentHeight =
    (yTickValues.length - 1) * REPORT_CHART_CONSTANTS.CELL_HEIGHT
  const totalChartHeight = Math.min(
    Math.max(
      chartContentHeight +
        REPORT_CHART_CONSTANTS.MARGIN_TOP +
        REPORT_CHART_CONSTANTS.MARGIN_BOTTOM,
      150
    ),
    350
  )

  const xTickValues = useMemo(() => {
    const threshold = 4

    if (!normalizedData?.[0]?.data?.length) {
      return []
    }

    const points = normalizedData[0].data
    const pointCount = points.length

    if (pointCount === 1) {
      return [points[0].x] // Только реальная дата точки
    }

    if (pointCount < threshold) {
      return points.map(point => point.x)
    }

    return points.map(point => point.x).filter((_, index) => index % 2 === 0)
  }, [normalizedData])

  const chartData = useMemo(() => {
    if (!normalizedData?.[0]?.data?.length) {
      return [] // Пустой график — нет данных
    }

    if (normalizedData[0].data.length === 1) {
      return normalizedData // Только одна реальная точка
    }

    return normalizedData
  }, [normalizedData])

  const { marginLeft, chartHeight } = useMemo(() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return { marginLeft: 72, chartHeight: 300 }

    context.font = REPORT_CHART_CONSTANTS.FONT
    const formattedTicks = yTickValues.map(value => formatYTick(value, metricType))
    const maxTickWidth = Math.max(
      ...formattedTicks.map(text => context.measureText(text).width)
    )
    const calculatedMarginLeft =
      REPORT_CHART_CONSTANTS.TICK_PADDING +
      REPORT_CHART_CONSTANTS.EXTRA_MARGIN +
      Math.ceil(maxTickWidth) +
      15

    const chartContentHeight =
      (yTickValues.length - 1) * REPORT_CHART_CONSTANTS.CELL_HEIGHT
    const calculatedChartHeight = Math.min(
      Math.max(
        chartContentHeight +
        REPORT_CHART_CONSTANTS.MARGIN_TOP +
        REPORT_CHART_CONSTANTS.MARGIN_BOTTOM,
        150
      ),
      350
    )

    return { marginLeft: calculatedMarginLeft, chartHeight: calculatedChartHeight }
  }, [yTickValues, metricType]);

  return {
    marginLeft,
    MARGIN_TOP: REPORT_CHART_CONSTANTS.MARGIN_TOP,
    MARGIN_BOTTOM: REPORT_CHART_CONSTANTS.MARGIN_BOTTOM,
    yTickValues,
    xTickValues,
    chartHeight,
    minYValue,
    maxYValue,
    metricType,
    chartData
  }
}
