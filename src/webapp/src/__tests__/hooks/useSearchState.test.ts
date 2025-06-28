import { useSearchParams } from 'react-router'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useSearchState } from '@/components/utils/hooks/useSearchState'

// Мокаем useSearchParams
vi.mock('react-router', () => ({
  useSearchParams: vi.fn()
}))

// мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useSearchState', () => {
  let searchParams: URLSearchParams
  let setSearchParams: ReturnType<typeof vi.fn>

  beforeEach(() => {
    searchParams = new URLSearchParams()
    setSearchParams = vi.fn((newParams: URLSearchParams) => {
      searchParams = new URLSearchParams(newParams.toString())
    })
    ;(useSearchParams as ReturnType<typeof vi.fn>).mockImplementation(() => [
      searchParams,
      setSearchParams
    ])
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('должен возвращать коллекцию без ключа', () => {
    searchParams.set('test', encodeURIComponent(JSON.stringify('value')))
    const { result } = renderHook(() => useSearchState())
    expect(result.current).toEqual({ test: 'value' })
  })

  it('должен возвращать initialValue, если нет параметров и localStorage', () => {
    const { result } = renderHook(() => useSearchState('key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('должен брать значение из localStorage, если useLocalStorage=true', async () => {
    localStorageMock.setItem('app.key', JSON.stringify('stored'))
    const { result } = renderHook(() =>
      useSearchState('key', 'default', { useLocalStorage: true })
    )
    await waitFor(() => {
      expect(setSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      )
    })
    expect(searchParams.get('key')).toBe(
      encodeURIComponent(JSON.stringify('stored'))
    )
    expect(result.current[0]).toBe('stored')
  })

  it('должен брать значение из searchParams, если есть', () => {
    searchParams.set('key', encodeURIComponent(JSON.stringify('param')))
    const { result } = renderHook(() => useSearchState('key', 'default'))
    expect(result.current[0]).toBe('param')
  })

  it('должен устанавливать значение в searchParams', async () => {
    const { result, rerender } = renderHook(() =>
      useSearchState('key', 'default')
    )
    await act(async () => {
      result.current[1]('newValue')
    })
    rerender()
    expect(setSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), {
      replace: true
    })
    expect(searchParams.get('key')).toBe(
      encodeURIComponent(JSON.stringify('newValue'))
    )
    expect(result.current[0]).toBe('newValue')
  })

  it('должен сохранять значение в localStorage, если useLocalStorage=true', async () => {
    const { result } = renderHook(() =>
      useSearchState('key', 'default', { useLocalStorage: true })
    )
    await act(async () => {
      result.current[1]('newValue')
    })
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'app.key',
      JSON.stringify('newValue')
    )
    expect(localStorage.getItem('app.key')).toBe(JSON.stringify('newValue'))
  })

  it('должен работать с объектами', async () => {
    const initial = { foo: 'bar' }
    const { result, rerender } = renderHook(() =>
      useSearchState('key', initial)
    )
    await act(async () => {
      result.current[1]({ foo: 'baz' })
    })
    expect(setSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), {
      replace: true
    })
    ;(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
      searchParams,
      setSearchParams
    ])
    rerender()
    expect(searchParams.get('key')).toBe(
      encodeURIComponent(JSON.stringify({ foo: 'baz' }))
    )
    expect(result.current[0]).toEqual({ foo: 'baz' })
  })

  it('должен работать с массивами', async () => {
    const initial = ['a', 'b']
    const { result, rerender } = renderHook(() =>
      useSearchState('key', initial)
    )
    await act(async () => {
      result.current[1](['c', 'd'])
    })
    expect(setSearchParams).toHaveBeenCalledWith(expect.any(URLSearchParams), {
      replace: true
    })
    ;(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
      searchParams,
      setSearchParams
    ])
    rerender()
    expect(searchParams.get('key')).toBe(
      encodeURIComponent(JSON.stringify(['c', 'd']))
    )
    expect(result.current[0]).toEqual(['c', 'd'])
  })

  it('должен использовать prefix для localStorage', async () => {
    const { result } = renderHook(() =>
      useSearchState('key', 'default', {
        useLocalStorage: true,
        storagePrefix: 'custom'
      })
    )
    await act(async () => {
      result.current[1]('newValue')
    })
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'custom.key',
      JSON.stringify('newValue')
    )
    expect(localStorageMock.getItem('custom.key')).toBe(
      JSON.stringify('newValue')
    )
  })

  it('должен инициализировать searchParams из localStorage', async () => {
    localStorageMock.setItem('app.key', JSON.stringify('stored'))
    const { result } = renderHook(() =>
      useSearchState('key', 'default', { useLocalStorage: true })
    )

    await waitFor(() => {
      expect(setSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        {
          replace: true
        }
      )
    })

    expect(searchParams.get('key')).toBe(
      encodeURIComponent(JSON.stringify('stored'))
    )
    expect(result.current[0]).toBe('stored')
  })

  it('должен использовать initialValue при отсутствии параметров и localStorage', async () => {
    const { result } = renderHook(() =>
      useSearchState('key', 'initial', { useLocalStorage: true })
    )

    await waitFor(() => {
      expect(setSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      )
    })

    expect(searchParams.get('key')).toBe(
      encodeURIComponent(JSON.stringify('initial'))
    )
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'app.key',
      JSON.stringify('initial')
    )
    expect(result.current[0]).toBe('initial')
  })

  it('должен использовать storagePrefix для инициализации из localStorage', async () => {
    localStorageMock.setItem('custom.key', JSON.stringify('stored'))
    const { result } = renderHook(() =>
      useSearchState('key', 'default', {
        useLocalStorage: true,
        storagePrefix: 'custom'
      })
    )

    await waitFor(() => {
      expect(setSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        {
          replace: true
        }
      )
    })

    expect(searchParams.get('key')).toBe(
      encodeURIComponent(JSON.stringify('stored'))
    )
    expect(result.current[0]).toBe('stored')
  })

  it('должен игнорировать localStorage, если useLocalStorage=false', async () => {
    localStorageMock.setItem('app.key', JSON.stringify('stored'))
    const { result } = renderHook(() => useSearchState('key', 'default'))
    await waitFor(() => {
      expect(setSearchParams).not.toHaveBeenCalled()
    })
    expect(searchParams.get('key')).toBe(null)
    expect(result.current[0]).toBe('default')
  })

  it('должен обновлять состояние при изменении searchParams извне', async () => {
    const { result, rerender } = renderHook(() =>
      useSearchState('key', 'default')
    )
    await act(async () => {
      searchParams.set('key', encodeURIComponent(JSON.stringify('external')))
      ;(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
        searchParams,
        setSearchParams
      ])
      rerender()
    })
    expect(result.current[0]).toBe('external')
  })

  it('should handle nested objects correctly', async () => {
    const initial = { data: { foo: 'bar' } }
    const { result, rerender } = renderHook(() =>
      useSearchState('key', initial)
    )

    await act(async () => {
      result.current[1]({ data: { foo: 'baz' } })
    })

    rerender()
    expect(searchParams.get('key')).toBe(
      encodeURIComponent(JSON.stringify({ data: { foo: 'baz' } }))
    )
    expect(result.current[0]).toEqual({ data: { foo: 'baz' } })
  })
})
