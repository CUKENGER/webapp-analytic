import { client } from '@/api/client'
import { useSuspenseQuery } from '@tanstack/react-query'

interface InviteLinkData {
  id: number
  name: string | null
  invite_link: string
  is_primary: boolean
  is_revoked: boolean
  creates_join_request: boolean
  expire_date: number | null
  member_limit: number | null
  cost: number
  createdAtEpoch: number
}

async function getInviteLinkById(id: string): Promise<InviteLinkData> {
  const response = await client.links.invite[id].$get()

  if (!response.ok) {
    throw new Error('Failed to fetch invite link')
  }

  return response.json()
}

export function useGetInviteLinkById(id: string) {
  return useSuspenseQuery({
    queryKey: ['invite-link', id],
    queryFn: () => getInviteLinkById(id),
    staleTime: 5 * 60 * 1000, // Кэшируем данные на 5 минут
    // enabled: !!id
  })
}
