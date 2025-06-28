import type { Env } from '#root/server/environment.js'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type {
  CreateInviteLinkRequest,
  EditCostRequest,
  EditCostResponse,
  EditInviteLinkRequest,
  InviteLinkResponse,
  TelegramInviteLinkResponse,
} from './insertInviteRoute.types.js'
import { config } from '#root/config.js'
import { Hono } from 'hono'

export const insertInviteRoute = new Hono<Env>()

insertInviteRoute.post('/create', async (c) => {
  const db = c.get('db')
  const { channelUUID, ...params }: CreateInviteLinkRequest = await c.req.json()

  if (!channelUUID) {
    throw new Error('channelUUID is required')
  }

  const channel = await db
    .selectFrom('channel')
    .where('uuid', '=', channelUUID)
    .select(['channel.tgChannelID', 'channel.uuid'])
    .executeTakeFirst()

  if (!channel) {
    return c.text('channelUUID does not exist', 404)
  }

  const createInviteLink = await (await fetch(`${config.botHost}/api/invite_link/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: channel.tgChannelID,
      ...params,
      expire_date: params.expire_date && params.expire_date > 0
        ? Math.floor(Date.now() / 1000) + Number(params.expire_date)
        : 0,
    }),
  })).json() as TelegramInviteLinkResponse

  if (createInviteLink.statusCode && createInviteLink.statusCode >= 400) {
    return c.text(createInviteLink.message || 'Unknown error', createInviteLink.statusCode as ContentfulStatusCode)
  }

  const result = await db.insertInto('channel_invite_link')
    .values({
      createdAtEpoch: Math.floor(Date.now() / 1000),
      channelUuid: channel.uuid,
      chat_id: channel.tgChannelID,
      creates_join_request: createInviteLink.creates_join_request ?? false,
      invite_link: createInviteLink.invite_link!,
      is_primary: createInviteLink.is_primary ?? false,
      is_revoked: createInviteLink.is_revoked ?? false,
      name: createInviteLink.name ?? null,
      expire_date: createInviteLink.expire_date ?? null,
      member_limit: params.member_limit ?? null,
      cost: !Number.isNaN(Number(params.cost)) ? Number(params.cost) : 0,
    })
    .returningAll()
    .execute()

  return c.json(result)
})

insertInviteRoute.post('/edit/:id', async (c) => {
  const db = c.get('db')
  const id = Number(c.req.param('id'))
  const params: EditInviteLinkRequest = await c.req.json()

  const inviteLink = await db
    .selectFrom('channel_invite_link')
    .select(['invite_link', 'chat_id'])
    .where('id', '=', id)
    .executeTakeFirst()

  if (!inviteLink) {
    return c.text('Invite link not found', 404)
  }

  const now = Math.floor(Date.now() / 1000)
  const maxExpireDate = now + 31536000 // 1 год
  let expireDate = params.expire_date && params.expire_date > now ? Number(params.expire_date) : 0

  if (expireDate > maxExpireDate) {
    expireDate = maxExpireDate
  }

  const editInviteLink = await (
    await fetch(`${config.botHost}/api/invite_link/edit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: inviteLink.chat_id,
        invite_link: inviteLink.invite_link,
        ...params,
        expire_date: expireDate,
      }),
    })
  ).json() as TelegramInviteLinkResponse

  if (editInviteLink.statusCode && editInviteLink.statusCode >= 400) {
    return c.text(editInviteLink.message || 'Unknown error', editInviteLink.statusCode as ContentfulStatusCode)
  }

  if (!editInviteLink.invite_link) {
    return c.text('Invalid response from Telegram API', 500)
  }

  const result = await db
    .updateTable('channel_invite_link')
    .where('id', '=', id)
    .set({
      name: editInviteLink.name ?? null,
      creates_join_request: editInviteLink.creates_join_request ?? false,
      expire_date: editInviteLink.expire_date ?? (expireDate > 0 ? expireDate : null),
      member_limit: editInviteLink.member_limit ?? null,
      cost: !Number.isNaN(Number(params.cost)) ? Number(params.cost) : 0,
    })
    .returningAll()
    .executeTakeFirst()

  if (!result) {
    return c.text('Failed to update invite link', 500)
  }

  const { chat_id, channelUuid, ...responseData } = result
  return c.json(responseData as InviteLinkResponse)
})

insertInviteRoute.post('/revoke/:id', async (c) => {
  const db = c.get('db')
  const id = Number(c.req.param('id'))

  const inviteLink = await db
    .selectFrom('channel_invite_link')
    .select(['invite_link', 'chat_id'])
    .where('id', '=', id)
    .executeTakeFirst()

  if (!inviteLink) {
    return c.text('Invite link not found', 404)
  }

  const revokeInviteLink = await (await fetch(`${config.botHost}/api/invite_link/revoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: inviteLink.chat_id,
      invite_link: inviteLink.invite_link,
    }),
  })).json() as TelegramInviteLinkResponse

  if (revokeInviteLink.statusCode && revokeInviteLink.statusCode >= 400) {
    return c.text(revokeInviteLink.message || 'Unknown error', revokeInviteLink.statusCode as ContentfulStatusCode)
  }

  const result = await db.updateTable('channel_invite_link')
    .where('id', '=', id)
    .set({
      name: revokeInviteLink.name ?? null,
      creates_join_request: revokeInviteLink.creates_join_request ?? false,
      is_primary: revokeInviteLink.is_primary ?? false,
      is_revoked: revokeInviteLink.is_revoked ?? true,
      expire_date: revokeInviteLink.expire_date ?? null,
      member_limit: revokeInviteLink.member_limit ?? null,
    })
    .returningAll()
    .executeTakeFirst()

  if (!result) {
    return c.text('Failed to revoke invite link', 500)
  }

  const { chat_id, channelUuid, ...responseData } = result
  return c.json(responseData as InviteLinkResponse)
})

insertInviteRoute.get('/:id', async (c) => {
  const db = c.get('db')
  const id = Number(c.req.param('id'))

  const inviteLink = await db
    .selectFrom('channel_invite_link')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!inviteLink) {
    return c.text('Invite link not found', 404)
  }

  return c.json(inviteLink)
})

// Добавьте следующий код в insertInviteRoute.ts

// Интерфейс для запроса редактирования стоимости

insertInviteRoute.post('/edit_cost/:id', async (c) => {
  const db = c.get('db')
  const id = Number(c.req.param('id'))
  const { source, cost }: EditCostRequest = await c.req.json()

  // Проверяем, что cost — это число
  const numericCost = !Number.isNaN(Number(cost)) ? Number(cost) : 0

  if (source === 'custom') {
    // Редактирование cost для custom_invite_link

    // Сначала получаем custom_invite_link по id
    const customLink = await db
      .selectFrom('custom_invite_link')
      .where('id', '=', id)
      .select(['url'])
      .executeTakeFirst()

    if (!customLink) {
      return c.text('Custom invite link not found', 404)
    }

    // Проверяем существование записи в additional таблице
    const additionalExists = await db
      .selectFrom('custom_invite_link_additional')
      .where('invite_link', '=', customLink.url)
      .executeTakeFirst()

    let result
    if (additionalExists) {
      // Обновляем существующую запись
      result = await db.updateTable('custom_invite_link_additional')
        .where('invite_link', '=', customLink.url)
        .set({ cost: numericCost })
        .returningAll()
        .executeTakeFirst()
    }
    else {
      // Создаем новую запись
      result = await db.insertInto('custom_invite_link_additional')
        .values({
          invite_link: customLink.url,
          cost: numericCost,
        })
        .returningAll()
        .executeTakeFirst()
    }

    return c.json({
      id,
      cost: result?.cost ?? '0',
    })
  }
  else if (source === 'channel') {
    // Редактирование cost для channel_invite_link

    const result = await db.updateTable('channel_invite_link')
      .where('id', '=', id)
      .set({
        cost: numericCost,
      })
      .returningAll()
      .executeTakeFirst()

    if (!result) {
      return c.text('Channel invite link not found', 404)
    }

    return c.json({
      id: result.id,
      cost: result.cost,
    } as EditCostResponse)
  }
  else {
    return c.text('Invalid source type. Must be "custom" or "channel"', 400)
  }
})
