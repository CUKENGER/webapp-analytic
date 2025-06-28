

import { client } from '@/api/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Project } from '../types/projects.types'

interface GetProjectsParams {
  tgAdminID?: string
}

async function fetchProjects(
  params: GetProjectsParams
): Promise<Project[]> {
  const response = await client.projects.$get(
    {
      query: params
    },
    {
      headers: {
        'bypass-tunnel-reminder': 1
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  const data = await response.json()

  return data
}

export function useGetProjects(params: GetProjectsParams) {
  return useSuspenseQuery({
    queryKey: ['fetchProjects', params],
    queryFn: () => fetchProjects(params),
    // enabled: !!params.tgAdminID,
    refetchOnWindowFocus: false
  })
}
