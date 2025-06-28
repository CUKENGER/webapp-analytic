

import { useSuspenseQuery } from '@tanstack/react-query'
import { ApiProject, ApiProjectsResponse } from '../types/projects.types'
import { apiAxios } from '../axiosClient'
import { API_ROUTES } from '../API_ROUTES'

interface GetProjectsParams {
	user_id?: string
}

async function fetchProjects(params: GetProjectsParams): Promise<ApiProject[]> {
	const res = await apiAxios.get<ApiProjectsResponse>(API_ROUTES.PROJECTS, {
		params: { ...params },
	})

	return res.data.data
}

export function useGetApiProjects(params: GetProjectsParams) {
	return useSuspenseQuery({
		queryKey: ['getProjects', params],
		queryFn: () => fetchProjects(params),
		refetchOnWindowFocus: false
	})
}
