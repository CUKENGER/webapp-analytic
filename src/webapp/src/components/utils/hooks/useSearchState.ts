import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router'

type SearchStateCollection = Record<string, any>

export function useSearchState(): SearchStateCollection

// Перегрузка для случая с ключом, начальным значением и опциями
export function useSearchState<T>(
  key: string,
  initialValue: T,
  options?: { useLocalStorage?: boolean; storagePrefix?: string }
): [T, (value: SetStateAction<T>, skipLocalStorage?: boolean) => void]

export function useSearchState<T>(
  key: string,
  initialValue: T,
  options?: { useLocalStorage?: boolean; storagePrefix?: string }
): [T, Dispatch<SetStateAction<T>>]

export function useSearchState<T>(
  key?: string,
  initialValue?: T,
  options: { useLocalStorage?: boolean; storagePrefix?: string } = {}
) {
  const [searchParams, setSearchParams] = useSearchParams()
	const { useLocalStorage = false, storagePrefix = 'app' } = options; // Устанавливаем useLocalStorage=false по умолчанию

  const getCollection = (): SearchStateCollection => {
    const collection: SearchStateCollection = {}
    searchParams.forEach((value, key) => {
      try {
        const decoded = decodeURIComponent(value)
        collection[key] = JSON.parse(decoded)
      } catch {
        collection[key] = value
      }
    })
    return collection
  }

  const getValue = (): T => {
    if (!key) return undefined as T

    // Сначала проверяем localStorage, если включено
    if (useLocalStorage) {
      const stored = localStorage.getItem(`${storagePrefix}.${key}`)
      if (stored) {
        try {
          return JSON.parse(stored) as T
        } catch {
          return initialValue as T
        }
      }
    }

    const param = searchParams.get(key)
    if (!param && initialValue !== undefined) {
      return initialValue
    }

    try {
      if (!param) return initialValue as T
      const decoded = decodeURIComponent(param)
      return JSON.parse(decoded) as T
    } catch {
      if (typeof initialValue === 'number') return Number(param) as T
      if (typeof initialValue === 'string') return param as T
      return param as T
    }
  }

  const setValue = useCallback(
    (action: SetStateAction<T>, skipLocalStorage = false) => {
      if (!key) return

      const currentValue = getValue()
      const newValue =
        action instanceof Function ? action(currentValue) : action

      const params = new URLSearchParams(searchParams)
      params.set(key, encodeURIComponent(JSON.stringify(newValue)))
      setSearchParams(params, { replace: true })

      // Запись в localStorage только если не указано skipLocalStorage
      if (useLocalStorage && !skipLocalStorage) {
        localStorage.setItem(`${storagePrefix}.${key}`, JSON.stringify(newValue))
      }
    },
    [key, searchParams, setSearchParams, useLocalStorage, storagePrefix]
  )

  // Инициализация: сначала пытаемся взять из localStorage, если useLocalStorage включено
  useEffect(() => {
    if (!key) return

    const param = searchParams.get(key)
    if (!param && useLocalStorage) {
      const stored = localStorage.getItem(`${storagePrefix}.${key}`)
      if (stored) {
        const storedValue = JSON.parse(stored)
        const params = new URLSearchParams(searchParams)
        params.set(key, encodeURIComponent(JSON.stringify(storedValue)))
        setSearchParams(params, { replace: true })
        return
      }
    }

    // Если нет в localStorage или useLocalStorage не включено, используем initialValue
    if (!param && initialValue !== undefined && useLocalStorage) {
      const params = new URLSearchParams(searchParams)
      params.set(key, encodeURIComponent(JSON.stringify(initialValue)))
      setSearchParams(params, { replace: true })
      localStorage.setItem(`${storagePrefix}.${key}`, JSON.stringify(initialValue))
    }
  }, [
    key,
    initialValue,
    searchParams,
    setSearchParams,
    useLocalStorage,
		storagePrefix 
  ])

  return key ? [getValue(), setValue] : getCollection()
}
