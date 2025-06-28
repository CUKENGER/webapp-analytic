// DirectPage.test.tsx
import { MemoryRouter } from 'react-router'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import DirectPage from '@/pages/DirectReportPages/DirectPage'
import { useDirectData } from '@/pages/DirectReportPages/model/useDirectData'
import { useDirectFilters } from '@/pages/DirectReportPages/model/useDirectFilters'

// Мокаем хуки
vi.mock('@/pages/DirectReportPages/model/useDirectFilters')
vi.mock('@/pages/DirectReportPages/model/useDirectData')

describe('DirectPage', () => {
  beforeEach(() => {
    vi.mocked(useDirectFilters).mockReturnValue({
      channelUUID: 'channel-123',
      rtab: 'rtab1',
      range: { from: '2025-01-01', to: '2025-01-31' },
      ads: ['ad1'],
      columns: ['cost', 'clicks'],
      setRange: vi.fn(),
      setAds: vi.fn(),
      setColumns: vi.fn(),
      prefix: 'direct-filters-v1.0-channel-123-rtab1'
    })

    vi.mocked(useDirectData).mockReturnValue({
      adsData: {
        data: [],
        from: '2025-01-01',
        to: '2025-01-31'
      },
      daysData: { days: [{ date: '2025-01-01', cost: 50 }] },
      chartData: { chart: [{ date: '2025-01-01', value: 10 }] },
      campaignsData: { data: [], totals: null, page: 1, hasNextPage: false },
      campaignsDataCompact: [],
      campaignsDataTotals: null
    })
  })

  it('should render all child components with correct props', () => {
    render(
      <MemoryRouter>
        <DirectPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('direct-filters')).toBeInTheDocument()
    expect(screen.getByTestId('direct-days-chart')).toBeInTheDocument()
    expect(screen.getByTestId('direct-days-table')).toBeInTheDocument()
    expect(screen.getByTestId('direct-campaigns-table')).toBeInTheDocument()

    // Проверка пропсов можно добавить через моки дочерних компонентов
  })

  it('should handle null data gracefully', () => {
    vi.mocked(useDirectData).mockReturnValue({
      adsData: null,
      daysData: null,
      chartData: null,
      campaignsData: null,
      campaignsDataCompact: [],
      campaignsDataTotals: null
    })

    render(
      <MemoryRouter>
        <DirectPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('direct-filters')).toBeInTheDocument()
    expect(screen.getByTestId('direct-days-chart')).toBeInTheDocument()
    expect(screen.getByTestId('direct-days-table')).toBeInTheDocument()
    expect(screen.getByTestId('direct-campaigns-table')).toBeInTheDocument()
  })
})
