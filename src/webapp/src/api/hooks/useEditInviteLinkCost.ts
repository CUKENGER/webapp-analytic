import { client } from '@/api/client';
import { useMutation } from '@tanstack/react-query';

interface EditInviteLinkCostParams {
  id: string | number;
  source: 'custom' | 'channel';
  cost: string;
}

async function editInviteLinkCost(params: EditInviteLinkCostParams) {
  const { id, ...updateData } = params
  const response = await client.links.invite.edit_cost[id.toString()].$post({
    json: updateData
  })

  if (!response.ok) {
    throw new Error('Failed to edit invite link cost')
  }

  return response.json()
}

export function useEditInviteLinkCost() {
  return useMutation({
    mutationKey: ['editInviteLinkCost'],
    mutationFn: editInviteLinkCost
  })
}
