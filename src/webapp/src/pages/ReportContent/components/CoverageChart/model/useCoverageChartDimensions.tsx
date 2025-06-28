import { useLayoutEffect, useMemo, useState } from 'react'
import { Point } from '@nivo/line'
import { COVERAGE_CHART_CONSTANTS } from './consts'

interface ChartDimensionsProps {
  data: any[]
}

export const useCoverageChartDimensions = ({ data }: ChartDimensionsProps) => {
  const [marginLeft, setMarginLeft] = useState(72)
  const [chartHeight, setChartHeight] = useState(300)

  // Минимальное и максимальное значение Y
  const rawMinYValue = useMemo(() => {
    const values = data.flatMap(item =>
      item.data.map((point: Point) => point.y as number)
    )
    return values.length ? Math.min(...values, 0) : 0
  }, [data])

  const rawMaxYValue = useMemo(() => {
    const values = data.flatMap(item =>
      item.data.map((point: Point) => point.y as number)
    )
    return values.length ? Math.max(...values, 100) : 100
  }, [data])

  // Тики для процентов (0–100)
  const yTickValues = useMemo(() => {
    // Если max = 100, шаг 20
    if (rawMaxYValue >= 100) {
      return [0, 20, 40, 60, 80, 100]
    }

    // Для значений < 100
    const range = rawMaxYValue - rawMinYValue
    const step = range <= 20 ? 5 : range <= 50 ? 10 : 20
    const roundedMin = Math.floor(rawMinYValue / step) * step
    const roundedMax = Math.ceil(rawMaxYValue / step) * step
    const ticks: number[] = []

    for (let value = roundedMin; value <= roundedMax; value += step) {
      ticks.push(Number(value.toFixed(1)))
    }

    // Гарантируем 0 и 100, если они в диапазоне
    if (rawMinYValue <= 0 && !ticks.includes(0)) ticks.unshift(0)
    if (rawMaxYValue >= 100 && !ticks.includes(100)) ticks.push(100)

    return ticks.sort((a, b) => a - b)
  }, [rawMinYValue, rawMaxYValue])

  // Min и Max
  const minYValue = useMemo(() => 0, []) // Всегда 0 для процентов
  const maxYValue = useMemo(() => 100, []) // Всегда 100 для процентов

  // Высота графика
  const chartContentHeight =
    (yTickValues.length - 1) * COVERAGE_CHART_CONSTANTS.CELL_HEIGHT
  const totalChartHeight = Math.min(
    chartContentHeight +
      COVERAGE_CHART_CONSTANTS.MARGIN_TOP +
      COVERAGE_CHART_CONSTANTS.MARGIN_BOTTOM,
    350
  )

  const xTickValues = useMemo(
    () =>
      data[0]?.data
        .map((point: Point) => point.x)
        .filter((_, index: number) => index % 2 === 0) || [],
    [data]
  )

  useLayoutEffect(() => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      context.font = COVERAGE_CHART_CONSTANTS.FONT
      const formattedTicks = yTickValues.map(value =>
        value % 1 === 0 ? value.toString() : value.toFixed(1)
      )
      const maxTickWidth = Math.max(
        ...formattedTicks.map(text => context.measureText(text).width)
      )
      setMarginLeft(
        COVERAGE_CHART_CONSTANTS.TICK_PADDING +
          COVERAGE_CHART_CONSTANTS.EXTRA_MARGIN +
          Math.ceil(maxTickWidth) + 25
      )
    }
    setChartHeight(totalChartHeight)
  }, [yTickValues])

  return {
    marginLeft,
    MARGIN_TOP: COVERAGE_CHART_CONSTANTS.MARGIN_TOP,
    MARGIN_BOTTOM: COVERAGE_CHART_CONSTANTS.MARGIN_BOTTOM,
    yTickValues,
    xTickValues,
    chartHeight,
    minYValue,
    maxYValue
  }
}
