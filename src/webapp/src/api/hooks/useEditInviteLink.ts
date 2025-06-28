import { client } from '@/api/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface EditInviteLinkParams {
  id: string
  name?: string
  expire_date?: number
  member_limit?: number
  creates_join_request?: boolean
  cost?: number
  is_revoked?: boolean
}

async function editInviteLink(params: EditInviteLinkParams) {
  const { id, ...updateData } = params
  const response = await client.links.invite.edit[id].$post({
    json: updateData
  })

  if (!response.ok) {
    throw new Error('Failed to edit invite link')
  }

  return response.json()
}

export function useEditInviteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editInviteLink,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invite-link', variables.id] });
    }
  })
}
