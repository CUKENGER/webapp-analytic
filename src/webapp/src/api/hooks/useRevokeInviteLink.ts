import { client } from '@/api/client'
import { useMutation } from '@tanstack/react-query'

interface RevokeInviteLinkParams {
  id: string
}

async function revokeInviteLink(
  params: RevokeInviteLinkParams
) {
  const response = await client.links.invite.revoke[params.id].$post()

  if (!response.ok) {
    throw new Error('Failed to invoke invite link')
  }

  return response.json()
}

export function useRevokeInviteLink() {
  return useMutation({
    mutationFn: revokeInviteLink
  })
}
