import { useEffect } from 'react'
import { useLocation } from 'react-router'

const SCROLL_KEY = 'root_scroll_position'

export const useScrollRestoration = () => {
	const location = useLocation()

	useEffect(() => {
		if (location.pathname !== '/') return
		const saved = sessionStorage.getItem(SCROLL_KEY)
		if (saved) {
			// Отключаем smooth scroll на время восстановления
			const html = document.documentElement
			const body = document.body
			const prevHtmlScroll = html.style.scrollBehavior
			const prevBodyScroll = body.style.scrollBehavior
			html.style.scrollBehavior = 'auto'
			body.style.scrollBehavior = 'auto'
			window.scrollTo(0, Number(saved))
			// Возвращаем обратно через тик
			setTimeout(() => {
				html.style.scrollBehavior = prevHtmlScroll
				body.style.scrollBehavior = prevBodyScroll
			}, 0)
		}
	}, [location.pathname])

	useEffect(() => {
		if (location.pathname !== '/') return
		const onScroll = () => {
			sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
		}
		window.addEventListener('scroll', onScroll)
		return () => {
			window.removeEventListener('scroll', onScroll)
		}
	}, [location.pathname])
} 