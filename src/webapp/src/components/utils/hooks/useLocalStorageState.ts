import { useEffect, useState } from 'react'

export function useLocalStorageState<T>(key: string, initialValue: T, storagePrefix = 'app'): [T, (value: React.SetStateAction<T>) => void] {
	const fullKey = `${storagePrefix}.${key}`
	const [state, setState] = useState<T>(() => {
		const stored = localStorage.getItem(fullKey)
		if (stored) {
			try {
				return JSON.parse(stored)
			} catch {
				return initialValue
			}
		}
		return initialValue
	})
	useEffect(() => {
		localStorage.setItem(fullKey, JSON.stringify(state))
	}, [state, fullKey])
	return [state, setState]
} 