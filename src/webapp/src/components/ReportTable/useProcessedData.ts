import { useMemo } from 'react'
import type { DirectReportItem } from '@/api/types/direct-report.types'

export const useProcessedData = ({
  dataProvider,
  mode,
  totals,
  showTotals,
  hasNextPage = false
}: {
  dataProvider: DirectReportItem[] | undefined
  mode: 'compact' | 'fully'
  totals: DirectReportItem | null
  showTotals: boolean
  hasNextPage?: boolean
}) => {
  return useMemo(() => {
    if (!dataProvider) return undefined

    const result = [...dataProvider]

    if (mode === 'compact') {
      // Добавляем ellipsis только если строк больше 10 или есть следующая страница
      if (result.length > 10 || (hasNextPage && result.length >= 10)) {
        const first10 = result.slice(0, 10)
        const ellipsisRow: DirectReportItem = {
          ...result[0],
          id: 'ellipsis',
          title: '...',
          date: '...',
          campaignID: '',
          cost: 0,
          impressions: 0,
          clicks: 0,
          redirected: 0,
          subscribed: 0,
          unsubscribed: 0,
          ctr: 0,
          cpc: 0,
          cland: 0,
          cpa: 0,
          cpdp: 0,
          pdp_cost: 0,
          unsub_per: 0,
          pdp_total: 0,
          cost_total: 0,
          type: 'ellipsis'
        }
        return showTotals && totals
          ? [...first10, ellipsisRow, { ...totals, id: 'total', type: 'total' }]
          : [...first10, ellipsisRow]
      }
      return showTotals && totals
        ? [...result, { ...totals, id: 'total', type: 'total' }]
        : result
    }

    return showTotals && totals
      ? [...result, { ...totals, id: 'total', type: 'total' }]
      : result
  }, [dataProvider, mode, totals, showTotals, hasNextPage])
}
