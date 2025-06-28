// useDirectFilters.test.tsx
import { act, renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useSearchState } from '@/components/utils/hooks/useSearchState'
import { useDirectFilters } from '@/pages/DirectReportPages/model/useDirectFilters'

// Мокаем useSearchState
vi.mock('@/components/utils/hooks/useSearchState')

// Мокаем react-router-dom useSearchParams
vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn()
}))

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => {
      console.log('getItem called with:', key)
      return store[key] || null
    }),
    setItem: vi.fn((key: string, value: string) => {
      console.log('setItem called with:', { key, value })
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      console.log('clear called')
      store = {}
    })
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useDirectFilters', () => {
  let searchParams: URLSearchParams
  let setSearchParams: ReturnType<typeof vi.fn>
  const mockUseSearchState = useSearchState as ReturnType<typeof vi.fn>

  const expectedColumns = [
    'cost',
    'subscribed',
    'pdp_cost',
    'unsub_per',
    'pdp_total',
    'cost_total'
  ]

  beforeEach(() => {
    searchParams = new URLSearchParams()
    setSearchParams = vi.fn((newParams, options) => {
      console.log('setSearchParams called with:', newParams.toString(), options)
      searchParams = new URLSearchParams(newParams.toString())
    })
    vi.mock('react-router-dom', () => ({
      useSearchParams: vi.fn(() => [searchParams, setSearchParams])
    }))
    mockUseSearchState.mockReset()
    localStorageMock.clear()

    // Хранилище состояния для имитации useState
    const stateStore: Record<string, any> = {}
    let callIndex = 0

    mockUseSearchState.mockImplementation((key, initial, options = {}) => {
      callIndex++
      console.log(`useSearchState called: key=${key}, callIndex=${callIndex}`)

      // Обработка вызова без ключа (для rtab и channelUUID)
      if (key === undefined) {
        console.log('Handling undefined key for rtab and channelUUID')
        return {
          rtab: searchParams.get('rtab') || undefined,
          channelUUID: searchParams.get('channelUUID') || undefined
        }
      }

      // Инициализация состояния для ключа, если его нет
      if (!(key in stateStore)) {
        let value = initial
        const { useLocalStorage = false, storagePrefix = 'app' } = options

        // Чтение из localStorage
        if (useLocalStorage) {
          const storageKey = `${storagePrefix}.${key}`
          const stored = localStorageMock.getItem(storageKey)
          if (stored) {
            try {
              value = JSON.parse(stored)
            } catch {
              value = initial
            }
          }
        }

        // Чтение из searchParams
        const param = searchParams.get(key)
        if (param) {
          try {
            value = JSON.parse(decodeURIComponent(param))
          } catch {
            value = param
          }
        }

        stateStore[key] = value
      }

      const setValue = vi.fn((newValue, skipLocalStorage = false) => {
        console.log('setValue called with:', {
          key,
          newValue,
          options,
          skipLocalStorage
        })
        stateStore[key] = newValue
        const params = new URLSearchParams(searchParams)
        params.set(key, encodeURIComponent(JSON.stringify(newValue)))
        setSearchParams(params, { replace: true })
        if (options.useLocalStorage && !skipLocalStorage) {
          const storageKey = `${options.storagePrefix}.${key}`
          localStorageMock.setItem(storageKey, JSON.stringify(newValue))
        }
        return newValue
      })

      return [
        Array.isArray(stateStore[key])
          ? [...stateStore[key]]
          : { ...stateStore[key] },
        setValue
      ]
    })
  })

  it('should initialize with default values and correct storagePrefix', async () => {
    mockUseSearchState.mockImplementationOnce(() => ({
      channelUUID: undefined,
      rtab: undefined
    }))

    const { result } = renderHook(() => useDirectFilters())

    await waitFor(() => {
      expect(result.current).toEqual({
        channelUUID: undefined,
        rtab: undefined,
        ads: [],
        columns: expectedColumns,
        range: { from: '', to: '' },
        setAds: expect.any(Function),
        setColumns: expect.any(Function),
        setRange: expect.any(Function),
        prefix: 'direct-filters-v1.0-undefined-undefined'
      })
    })
  })

  it('should initialize with provided channelUUID and rtab from URL', async () => {
    searchParams.set('channelUUID', 'channel-123')
    searchParams.set('rtab', 'rtab1')
    mockUseSearchState.mockImplementationOnce(() => ({
      channelUUID: 'channel-123',
      rtab: 'rtab1'
    }))

    const { result } = renderHook(() => useDirectFilters())

    await waitFor(() => {
      expect(result.current).toEqual({
        channelUUID: 'channel-123',
        rtab: 'rtab1',
        ads: [],
        columns: expectedColumns,
        range: { from: '', to: '' },
        setAds: expect.any(Function),
        setColumns: expect.any(Function),
        setRange: expect.any(Function),
        prefix: 'direct-filters-v1.0-channel-123-rtab1'
      })
    })
  })

  it('should update ads and save to searchParams and localStorage with correct prefix', async () => {
    searchParams.set('channelUUID', 'channel-123')
    searchParams.set('rtab', 'rtab1')
    mockUseSearchState.mockImplementationOnce(() => ({
      channelUUID: 'channel-123',
      rtab: 'rtab1'
    }))

    const { result, rerender } = renderHook(() => useDirectFilters())

    await act(async () => {
      console.log('Calling setAds with:', ['ad1', 'ad2'])
      result.current.setAds(['ad1', 'ad2'])
      rerender()
    })

    await waitFor(
      () => {
        console.log('searchParams ads:', searchParams.get('ads'))
        console.log(
          'localStorage ads:',
          localStorageMock.getItem('direct-filters-v1.0-channel-123-rtab1.ads')
        )
        expect(searchParams.get('ads')).toBe(
          encodeURIComponent(JSON.stringify(['ad1', 'ad2']))
        )
        expect(
          localStorageMock.getItem('direct-filters-v1.0-channel-123-rtab1.ads')
        ).toBe(JSON.stringify(['ad1', 'ad2']))
        expect(result.current.ads).toEqual(['ad1', 'ad2'])
      },
      { timeout: 1000 } // Уменьшаем таймаут
    )
  })

  it('should update range and save to searchParams with correct prefix', async () => {
    searchParams.set('channelUUID', 'channel-123')
    searchParams.set('rtab', 'rtab1')
    mockUseSearchState.mockImplementationOnce(() => ({
      channelUUID: 'channel-123',
      rtab: 'rtab1'
    }))

    const { result, rerender } = renderHook(() => useDirectFilters())

    await act(async () => {
      console.log('Calling setRange with:', {
        from: '2025-01-01',
        to: '2025-01-31'
      })
      result.current.setRange({ from: '2025-01-01', to: '2025-01-31' })
      rerender()
    })

    await waitFor(
      () => {
        console.log('searchParams range:', searchParams.get('range'))
        console.log(
          'localStorage range:',
          localStorageMock.getItem(
            'direct-filters-v1.0-channel-123-rtab1.range'
          )
        )
        expect(searchParams.get('range')).toBe(
          encodeURIComponent(
            JSON.stringify({ from: '2025-01-01', to: '2025-01-31' })
          )
        )
        expect(
          localStorageMock.getItem(
            'direct-filters-v1.0-channel-123-rtab1.range'
          )
        ).toBeNull()
        expect(result.current.range).toEqual({
          from: '2025-01-01',
          to: '2025-01-31'
        })
      },
      { timeout: 1000 } // Уменьшаем таймаут
    )
  })

  it('should ignore old storagePrefix keys', async () => {
    localStorageMock.setItem(
      'directFilters-channel-123-rtab1.ads',
      JSON.stringify([{ adID: 'ad1', campaignID: 'camp1' }])
    )

    searchParams.set('channelUUID', 'channel-123')
    searchParams.set('rtab', 'rtab1')
    mockUseSearchState.mockImplementationOnce(() => ({
      channelUUID: 'channel-123',
      rtab: 'rtab1'
    }))

    const { result } = renderHook(() => useDirectFilters())

    await waitFor(() => {
      expect(result.current.ads).toEqual([])
    })
  })

  it('should update columns and save to searchParams and localStorage with correct prefix', async () => {
    searchParams.set('channelUUID', 'channel-123')
    searchParams.set('rtab', 'rtab1')
    mockUseSearchState.mockImplementationOnce(() => ({
      channelUUID: 'channel-123',
      rtab: 'rtab1'
    }))

    const { result, rerender } = renderHook(() => useDirectFilters())

    await act(async () => {
      result.current.setColumns(['cost', 'clicks'])
      rerender()
    })

    await waitFor(() => {
      expect(searchParams.get('c_day')).toBe(
        encodeURIComponent(JSON.stringify(['cost', 'clicks']))
      )
      expect(
        localStorageMock.getItem('direct-filters-v1.0-channel-123-rtab1.c_day')
      ).toBe(JSON.stringify(['cost', 'clicks']))
      expect(result.current.columns).toEqual(['cost', 'clicks'])
    })
  })

  it('should handle localStorage parse error gracefully', async () => {
    localStorageMock.setItem(
      'direct-filters-v1.0-channel-123-rtab1.ads',
      'invalid-json'
    )
    searchParams.set('channelUUID', 'channel-123')
    searchParams.set('rtab', 'rtab1')
    mockUseSearchState.mockImplementationOnce(() => ({
      channelUUID: 'channel-123',
      rtab: 'rtab1'
    }))

    const { result } = renderHook(() => useDirectFilters())

    await waitFor(() => {
      expect(result.current.ads).toEqual([]) // Должно вернуться значение по умолчанию
    })
  })
})
