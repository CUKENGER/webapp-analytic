import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDirectReportAds } from '@/api/hooks/direct/useDirectReportAds'
import { mockClient, queryClientMock, queryClientMockWrapper } from './apiMocks'

// Явно указываем, что fetch — это Vitest mock
const mockedFetch = global.fetch as unknown as ReturnType<typeof vi.fn>

describe('useDirectReportAds', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClientMock.clear()
    mockedFetch.mockClear()
  })

  it('должен запрашивать данные объявлений с правильными параметрами', async () => {
    const mockResponse = {
      data: [{ id: 'ad1', name: 'Ad 1' }],
      from: '2025-01-01',
      to: '2025-01-31'
    }
    console.log('Setting up mock for $get')
    mockClient.api.direct.ads.$get.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    })
    console.log('Mock set up:', mockClient.api.direct.ads.$get)

    const params = {
      channelUUID: 'channel-123',
      from: '2025-01-01',
      to: '2025-01-31'
    }

    const { result } = renderHook(
      () => useDirectReportAds(params, mockClient.api),
      {
        wrapper: queryClientMockWrapper
      }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toEqual(mockResponse)
    })

    expect(mockClient.api.direct.ads.$get).toHaveBeenCalledWith(
      {
        query: params
      },
      {
        headers: { 'bypass-tunnel-reminder': 1 }
      }
    )
    console.log('Mock calls:', mockClient.api.direct.ads.$get.mock.calls)
    expect(mockedFetch).not.toHaveBeenCalled()
  })

  it('должен обрабатывать ошибку API и поддерживать сброс ошибки', async () => {
    console.log('Setting up mock for $get error')
    mockClient.api.direct.ads.$get.mockRejectedValueOnce(
      new Error('Failed to fetch direct report ads')
    )
    const mockResponse = {
      data: [{ id: 'ad1', name: 'Ad 1' }],
      from: '2025-01-01',
      to: '2025-01-31'
    }
    mockClient.api.direct.ads.$get.mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    })
    console.log('Mock set up:', mockClient.api.direct.ads.$get)

    const params = {
      channelUUID: 'channel-123',
      from: '2025-01-01',
      to: '2025-01-31'
    }

    let caughtError: Error | null = null
    let resetError: (() => void) | undefined = undefined
    const { result, unmount } = renderHook(
      () => useDirectReportAds(params, mockClient.api),
      {
        wrapper: ({ children }) =>
          queryClientMockWrapper({
            children,
            onError: error => {
              console.log('onError called with:', error)
              caughtError = error
            },
            onReset: reset => {
              console.log('onReset called with:', reset)
              resetError = reset
            }
          })
      }
    )

    // Проверяем ошибку
    await waitFor(
      () => {
        console.log('Caught error in test:', caughtError)
        if (!caughtError) throw new Error('Error not caught yet')
        expect(caughtError).not.toBeNull()
        expect(caughtError?.message).toBe('Failed to fetch direct report ads')
      },
      { timeout: 2000 }
    )

    // Сбрасываем ошибку и проверяем успешный запрос
    if (resetError && typeof resetError === 'function') {
      console.log('Calling resetError')
      await act(async () => {
        ;(resetError as () => void)() // Сбрасываем ErrorBoundary
        queryClientMock.clear() // Полностью очищаем кэш
        queryClientMock.invalidateQueries({
          queryKey: ['directReportAds', params]
        }) // Инвалидируем запрос
      })
      // Инвалидируем кэш, чтобы хук сделал новый запрос
      queryClientMock.invalidateQueries({
        queryKey: ['directReportAds', params]
      })
      console.log('Result after reset:', result.current)
      await waitFor(
        () => {
          console.log('Result after wait:', result.current)
          expect(result.current.isSuccess).toBe(true)
          expect(result.current.data).toEqual(mockResponse)
        },
        { timeout: 2000 }
      )
    }

    expect(mockClient.api.direct.ads.$get).toHaveBeenCalledWith(
      {
        query: params
      },
      {
        headers: { 'bypass-tunnel-reminder': 1 }
      }
    )
    console.log('Mock calls:', mockClient.api.direct.ads.$get.mock.calls)
    expect(mockedFetch).not.toHaveBeenCalled()

    unmount()
  })
})
