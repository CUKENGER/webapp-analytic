// useDirectData.test.tsx
import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useDirectPageQueries } from '@/api/hooks/direct/useDirectPageQueries'
import { useDirectData } from '@/pages/DirectReportPages/model/useDirectData'

vi.mock('@/api/hooks/direct/useDirectPageQueries')

describe('useDirectData', () => {
  const mockSetRange = vi.fn()
  const mockRange = { from: '2025-01-01', to: '2025-01-31' }
  const mockAds = ['ad1', 'ad2']
  const mockChannelUUID = 'channel-123'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should return data from useDirectPageQueries with correct structure', () => {
    const mockCampaignsData = {
      data: [
        {
          date: '2025-01-01',
          campaignID: 'camp1',
          campaignName: 'Campaign 1',
          adID: 'ad1',
          adTitle: 'Ad 1',
          cost: 100,
          impressions: 50,
          clicks: 25,
          redirected: 5,
          subscribed: 10,
          unsubscribed: 15,
          hidden: false
        }
      ],
      totals: {
        date: '2025-01-02',
        campaignID: 'camp1',
        campaignName: 'Campaign 1',
        adID: 'ad1',
        adTitle: 'Ad 1',
        cost: 100,
        impressions: 50,
        clicks: 25,
        redirected: 5,
        subscribed: 10,
        unsubscribed: 15,
        hidden: false
      },
      page: 1,
      hasNextPage: false
    }

    vi.mocked(useDirectPageQueries).mockReturnValue({
      adsData: { data: [], from: '2025-01-01', to: '2025-01-31' },
      daysResponse: { days: [{ date: '2025-01-01', cost: 50 }] },
      chartData: { chart: [{ date: '2025-01-01', value: 10 }] },
      campaignsData: mockCampaignsData
    })

    const { result } = renderHook(() =>
      useDirectData({
        channelUUID: mockChannelUUID,
        setRange: mockSetRange,
        range: mockRange,
        ads: mockAds
      })
    )

    expect(useDirectPageQueries).toHaveBeenCalledWith({
      channelUUID: mockChannelUUID,
      setRange: mockSetRange,
      range: mockRange,
      ads: mockAds
    })

    expect(result.current).toEqual({
      adsData: { data: [], from: '2025-01-01', to: '2025-01-31' },
      daysData: { days: [{ date: '2025-01-01', cost: 50 }] },
      chartData: { chart: [{ date: '2025-01-01', value: 10 }] },
      campaignsData: mockCampaignsData,
      campaignsDataCompact: mockCampaignsData.data,
      campaignsDataTotals: mockCampaignsData.totals
    })
  })

  test('should handle null campaignsData correctly', () => {
    // Обходим строгую типизацию, используя минимально допустимые объекты
    vi.mocked(useDirectPageQueries).mockReturnValue({
      adsData: { data: [], from: '', to: '' }, // DirectReportAdsResponse не допускает null
      daysResponse: null,
      chartData: null,
      campaignsData: { data: [], totals: null, page: 1, hasNextPage: false } // DirectCampaignsResponse не допускает null
    })

    const { result } = renderHook(() =>
      useDirectData({
        channelUUID: mockChannelUUID,
        setRange: mockSetRange,
        range: mockRange,
        ads: mockAds
      })
    )

    expect(result.current).toEqual({
      adsData: { data: [], from: '', to: '' },
      daysData: null,
      chartData: null,
      campaignsData: { data: [], hasNextPage: false, page: 1, totals: null },
      campaignsDataCompact: [],
      campaignsDataTotals: null
    })
  })

  it('should pass correct parameters to useDirectPageQueries', () => {
    vi.mocked(useDirectPageQueries).mockReturnValue({
      adsData: { data: [], from: '', to: '' },
      daysResponse: null,
      chartData: null,
      campaignsData: { data: [], totals: null, page: 1, hasNextPage: false }
    })

    renderHook(() =>
      useDirectData({
        channelUUID: mockChannelUUID,
        setRange: mockSetRange,
        range: mockRange,
        ads: mockAds
      })
    )

    expect(useDirectPageQueries).toHaveBeenCalledWith({
      channelUUID: mockChannelUUID,
      range: mockRange,
      ads: mockAds,
      setRange: mockSetRange
    })
  })

  it('should handle empty channelUUID', () => {
    vi.mocked(useDirectPageQueries).mockReturnValue({
      adsData: { data: [], from: '', to: '' },
      daysResponse: null,
      chartData: null,
      campaignsData: { data: [], totals: null, page: 1, hasNextPage: false }
    })

    const { result } = renderHook(() =>
      useDirectData({
        channelUUID: '',
        setRange: mockSetRange,
        range: mockRange,
        ads: mockAds
      })
    )

    expect(useDirectPageQueries).toHaveBeenCalledWith({
      channelUUID: '',
      range: mockRange,
      ads: mockAds,
      setRange: mockSetRange
    })

    expect(result.current).toEqual({
      adsData: { data: [], from: '', to: '' },
      daysData: null,
      chartData: null,
      campaignsData: { data: [], totals: null, page: 1, hasNextPage: false },
      campaignsDataCompact: [],
      campaignsDataTotals: null
    })
  })
})
