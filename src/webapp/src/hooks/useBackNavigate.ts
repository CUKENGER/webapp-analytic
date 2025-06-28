import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export const useBackNavigate = (path: string | number) => {
	const navigate = useNavigate()

	useEffect(() => {
		const handlePopState = (event: PopStateEvent) => {
			event.preventDefault()
			if (typeof path === 'string') {
				navigate(path, { replace: true })
			} else {
				navigate(-1)
			}
		}

		window.addEventListener("popstate", handlePopState)
		return () => window.removeEventListener("popstate", handlePopState)
	}, [navigate])
}