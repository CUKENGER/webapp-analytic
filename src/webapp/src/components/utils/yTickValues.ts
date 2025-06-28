export function yTickValues(data: any[]) {
  const maxCost = Math.max(...data.map(item => item.cost))
  const step = maxCost / 4 // 4 интервала для 5 точек
  return Array.from({ length: 5 }, (_, i) => i * step)
}
