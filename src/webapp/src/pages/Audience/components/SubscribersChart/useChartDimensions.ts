import { useLayoutEffect, useMemo, useState } from 'react'
import { SUBSCRIBERS_CHART_CONSTANTS } from './SubscribersChartConstants'

// Константы
interface ChartDimensionsProps {
  data: Array<{
    day: string
    unsubscriptions: number
    subscriptions: number
    total: number
  }>
}

// useChartDimensions.ts (обновлено для работы с вашим форматом данных)
export const useChartDimensions = ({ data }: ChartDimensionsProps) => {
  const [marginLeft, setMarginLeft] = useState(72)
  const [chartHeight, setChartHeight] = useState(300)

  // Минимальное и максимальное значение данных
  const rawMinYValue = useMemo(() => {
    return Math.min(
      ...data.flatMap(item => [
        item.unsubscriptions,
        item.subscriptions,
        item.total
      ])
    )
  }, [data])

  const rawMaxYValue = useMemo(() => {
    return Math.max(
      ...data.flatMap(item => [
        item.unsubscriptions,
        item.subscriptions,
        item.total
      ])
    )
  }, [data])

  // Функция для получения "красивого" шага
  const getNiceStep = (range: number, minTicks: number): number => {
    const rawStep = range / (minTicks - 1)
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)))
    const normalized = rawStep / magnitude

    // Более детализированная логика выбора шага
    if (normalized <= 1.2) return magnitude
    if (normalized <= 2.5) return magnitude * 2
    if (normalized <= 4) return magnitude * 3 // Добавляем шаг 3
    if (normalized <= 7) return magnitude * 5
    return magnitude * 10
  }

  // Расчёт тиков и шага
  const yTickValues = useMemo(() => {
    const range = rawMaxYValue - rawMinYValue || 1
    // Динамическое количество тиков на основе высоты графика
    const targetTicks = Math.max(
      SUBSCRIBERS_CHART_CONSTANTS.MIN_TICK_COUNT,
      Math.floor(chartHeight / SUBSCRIBERS_CHART_CONSTANTS.CELL_HEIGHT)
    )
    const step = getNiceStep(range, targetTicks)
    const roundedMin = Math.floor(rawMinYValue / step) * step
    const roundedMax = Math.ceil(rawMaxYValue / step) * step
    const ticks: number[] = []

    for (let value = roundedMin; value <= roundedMax; value += step) {
      ticks.push(value)
    }

    // Убеждаемся, что есть хотя бы MIN_TICK_COUNT тиков
    while (ticks.length < SUBSCRIBERS_CHART_CONSTANTS.MIN_TICK_COUNT) {
      ticks.unshift(ticks[0] - step)
      ticks.push(ticks[ticks.length - 1] + step)
    }

    return ticks
  }, [rawMinYValue, rawMaxYValue])

  // Расчёт итоговых minYValue и maxYValue с отступами
  const minYValue = useMemo(() => {
    return yTickValues[0]
  }, [yTickValues])

  const maxYValue = useMemo(() => {
    return yTickValues[yTickValues.length - 1] // Половина шага вверх для отступа
  }, [yTickValues])

  const chartContentHeight =
    (yTickValues.length - 1) * SUBSCRIBERS_CHART_CONSTANTS.CELL_HEIGHT
  const totalChartHeight =
    chartContentHeight +
    SUBSCRIBERS_CHART_CONSTANTS.MARGIN_TOP +
    SUBSCRIBERS_CHART_CONSTANTS.MARGIN_BOTTOM

  const xTickValues = useMemo(() => data.map(item => item.day), [data])

  useLayoutEffect(() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      context.font = SUBSCRIBERS_CHART_CONSTANTS.FONT
      const formattedTicks = yTickValues.map(value => value.toString())
      const maxTickWidth = Math.max(
        ...formattedTicks.map(text => context.measureText(text).width)
      )
      setMarginLeft(
        SUBSCRIBERS_CHART_CONSTANTS.TICK_PADDING +
          SUBSCRIBERS_CHART_CONSTANTS.EXTRA_MARGIN +
          Math.ceil(maxTickWidth) - 6
      )
    }
    setChartHeight(totalChartHeight)
  }, [yTickValues, totalChartHeight])

  return {
    marginLeft,
    MARGIN_TOP: SUBSCRIBERS_CHART_CONSTANTS.MARGIN_TOP,
    MARGIN_BOTTOM: SUBSCRIBERS_CHART_CONSTANTS.MARGIN_BOTTOM,
    yTickValues,
    xTickValues,
    chartHeight,
    minYValue,
    maxYValue
  }
}
