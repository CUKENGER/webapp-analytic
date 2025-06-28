import { client } from '@/api/client'
import { useMutation } from '@tanstack/react-query'

interface CreateInviteLinkParams {
  channelUUID: string
  name?: string
  expire_date?: number
  member_limit?: number
  creates_join_request?: boolean
  cost?: number
}

async function createInviteLink(
  params: CreateInviteLinkParams
) {
  const response = await client.links.invite.create.$post({
    json: params
  })

  if (!response.ok) {
    throw new Error('Failed to create invite link')
  }

  return response.json()
}

export function useCreateInviteLink() {
  return useMutation({
    mutationFn: createInviteLink
  })
}
