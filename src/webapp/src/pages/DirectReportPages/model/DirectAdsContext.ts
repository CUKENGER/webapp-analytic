import { createContext } from 'react'

export const DirectAdsContext = createContext<{
	ads: string[]
	setAds: React.Dispatch<React.SetStateAction<string[]>>
}>({ ads: [], setAds: () => { } }) 