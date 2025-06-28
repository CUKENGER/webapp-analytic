import axios from 'axios'

export const apiAxios = axios.create({
	// baseURL: import.meta.env.VITE_API_ROOT,
	baseURL: 'https://telegraphyx.com/api/v1',
	headers: {
		'Content-Type': 'application/json',
		// 'bypass-tunnel-reminder': '1' // Твой заголовок
	}
})

// Обработка ошибок (опционально)
apiAxios.interceptors.response.use(
	response => response,
	error => {
		console.error('API1 error:', error)
		return Promise.reject(error)
	}
)

apiAxios.interceptors.request.use(config => {
	const baseURL = config.baseURL ?? ''
	const url = config.url ?? ''
	const fullUrl = baseURL.endsWith('/') || url.startsWith('/') ? baseURL + url : baseURL + '/' + url
	console.log('Request URL:', fullUrl)
	return config
})
