// useDirectPageQueries.test.tsx
import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { queryClientMockWrapper } from '@/__tests__/api/apiMocks'
import { fetchDirectReportCampaigns } from '@/api/hooks/direct/useDirectCampaigns'
import { fetchDirectReportDays } from '@/api/hooks/direct/useDirectDays'
import { fetchDirectReportDaysFull } from '@/api/hooks/direct/useDirectDaysFull'
import { useDirectPageQueries } from '@/api/hooks/direct/useDirectPageQueries'
import { fetchDirectReportAds } from '@/api/hooks/direct/useDirectReportAds'

vi.mock('@/api/hooks/direct/useDirectReportAds')
vi.mock('@/api/hooks/direct/useDirectDays')
vi.mock('@/api/hooks/direct/useDirectDaysFull')
vi.mock('@/api/hooks/direct/useDirectCampaigns')

// Приводим их к типу jest.Mock для доступа к .mockResolvedValue
const mockedFetchDirectReportAds = vi.mocked(fetchDirectReportAds)
const mockedFetchDirectReportDays = vi.mocked(fetchDirectReportDays)
const mockedFetchDirectReportDaysFull = vi.mocked(fetchDirectReportDaysFull)
const mockedFetchDirectReportCampaigns = vi.mocked(fetchDirectReportCampaigns)

describe('useDirectPageQueries', () => {
  const mockSetRange = vi.fn()
  const mockRange = { from: '2025-01-01', to: '2025-01-31' }
  const mockAds = ['ad1', 'ad2']
  const mockChannelUUID = 'channel-123'

  beforeEach(() => {
    vi.clearAllMocks()
    mockSetRange.mockReset()
  })

  it('should fetch data with correct query keys', async () => {
  })

})
