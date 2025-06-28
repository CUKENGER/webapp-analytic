import { openLink, openTelegramLink, useLaunchParams } from '@telegram-apps/sdk-react'

export const useOpenLink = () => {

	const launchParams = useLaunchParams()
	const isTelegram = !!launchParams

	const handleOpenWebLink = (url: string) => {
		if (isTelegram) {
			openLink(url)
		} else {
			window.open(url, "_blank")
		}
	}

	const handleOpenTelegramLink = (url: string) => {
		if (isTelegram) {
			openTelegramLink(url)
		} else {
			window.open(url, "_blank")
		}
	}

	return {
		handleOpenWebLink,
		handleOpenTelegramLink
	}
} 