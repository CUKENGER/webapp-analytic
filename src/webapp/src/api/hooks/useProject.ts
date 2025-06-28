
import { client } from '@/api/client'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { ProjectFull } from '../types/projects.types'

interface GetProjectParams {
  id: string
}

async function fetchProject(
  params: GetProjectParams
): Promise<ProjectFull> {
  const response = await client.projects.get_full[':id'].$get(
    {
      param: { id: params.id },
    },
    {
      headers: {
        'bypass-tunnel-reminder': 1
      }
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch project')
  }

  const data = await response.json()

  return data
}

export function useGetProject(params: GetProjectParams) {
  return useQuery({
    queryKey: ['fetchProject', params],
    queryFn: () => fetchProject(params),
    // enabled: !!params.uuid,
    refetchOnWindowFocus: false
  })
}
