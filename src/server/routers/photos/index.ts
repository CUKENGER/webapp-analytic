import type { Env } from '#root/server/environment.js'

import { Hono } from 'hono'

export const channelPhotoRoute = new Hono<Env>()

channelPhotoRoute.get('/', async (c) => {
  const logger = c.get('logger')
  const db = c.get('db')
  const channelUuid = c.req.query('channelUuid')
  const tgAdminID = c.req.query('tgAdminID')

  if (!channelUuid) {
    logger.error('channelUuid is missing')
    return c.text('channelUuid required', 400)
  }

  if (!tgAdminID) {
    logger.error('User not authenticated')
    return c.text('User not authenticated', 401)
  }

  const bot = c.get('bot')
  if (!bot) {
    logger.error('Bot instance missing')
    return c.text('Internal server error', 500)
  }

  // Подзапрос для каналов, к которым у пользователя есть доступ
  const accessibleChannels = db
    .selectFrom('channel as c')
    .leftJoin('accesses', 'accesses.channelUuid', 'c.uuid')
    .leftJoin('user', 'user.id', 'accesses.userId')
    .select('c.uuid')
    .where(eb =>
      eb.or([
        eb.and([
          eb('c.tgAdminID', '=', tgAdminID),
          eb('c.isActive', '=', true),
        ]),
        eb.and([
          eb('user.tgUserID', '=', tgAdminID),
          eb('c.isActive', '=', true),
        ]),
      ]),
    )
    .distinct()
    .as('accessible_channels')

  // Проверка канала и получение tgChannelID
  const channel = await db
    .selectFrom('channel as c')
    .innerJoin(accessibleChannels, 'accessible_channels.uuid', 'c.uuid')
    .select(['c.uuid', 'c.tgChannelID'])
    .where('c.uuid', '=', channelUuid)
    .where('c.isActive', '=', true)
    .executeTakeFirst()

  if (!channel) {
    logger.error('Channel not found or access denied', { channelUuid })
    return c.text('Channel not found or access denied', 404)
  }

  try {
    if (channel) {
      const chat = await bot.api.getChat(channel.tgChannelID)
      if (!chat.photo) {
        return c.json({ error: 'No photo available' }, 404)
      }
      const photo = await bot.api.getFile(chat.photo.big_file_id) // Используем большую версию
      const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${photo.file_path}`

      return c.json({ photoUrl: fileUrl })
    }
  }
  catch (e) {
    logger.error('Chat fetch failed', {
      error: e instanceof Error ? e.stack : e,
      channel,
    })
    return c.text('Chat not found', 404)
  }
})
