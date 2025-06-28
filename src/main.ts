import type { Server } from '#root/server/index.js'
import process from 'node:process'
// import type { PollingConfig, WebhookConfig } from '#root/config.js'
import { config } from '#root/config.js'
import database from '#root/db/database.js'
import { logger } from '#root/logger.js'
import { createServer, createServerManager } from '#root/server/index.js'
import { audienceRoute } from '#root/server/routers/reports/audienceRoute/audienceRoute.js'
import { directRoute } from '#root/server/routers/reports/directRoute/index.js'
import { linksRoute } from '#root/server/routers/reports/linksRoute/index.js'
import { createBot } from './bot/index.js'
import { channelPhotoRoute } from './server/routers/photos/index.js'
import { projectsRoute } from './server/routers/projects/index.js'
import { botDirectRoute } from './server/routers/reports/botDirectRoute/index.js'

// async function startPolling(config: any) {
//   const bot = createBot(config.botToken, {
//     config,
//     logger,
//     db: database,
//   })
//   let runner: undefined | RunnerHandle

//   // graceful shutdown
//   onShutdown(async () => {
//     logger.info('Shutdown')
//     await runner?.stop()
//   })

//   await Promise.all([
//     bot.init(),
//     bot.api.deleteWebhook(),
//   ])

//   // start bot
//   runner = run(bot, {
//     runner: {
//       fetch: {
//         allowed_updates: config.botAllowedUpdates,
//       },
//     },
//   })

//   logger.info({
//     msg: 'Bot running...',
//     username: bot.botInfo.username,
//   })
// }

export const server: Server = await startServer()
const api = server
  .basePath('/api')
  .route('/direct', directRoute)
  .route('/links', linksRoute)
  .route('/projects', projectsRoute)
  .route('/audience', audienceRoute)
  .route('/channelPhoto', channelPhotoRoute)
  .route('/bot/direct', botDirectRoute)

export type ApiRoutes = typeof api

try {
  try {
    process.loadEnvFile()
  }
  catch {
    // No .env file found
  }

  // if (config.isWebhookMode)
  //   await startWebhook(config, server)
  // else if (config.isPollingMode)
  //   await startPolling(config)
}
catch (error) {
  logger.error(error)
  process.exit(1)
}

async function startServer() {
  const bot = createBot(config.botToken, {
    config,
    logger,
    db: database,
  })
  const server = await createServer({
    config,
    logger,
    db: database,
    bot,
  })
  const serverManager = await createServerManager(server, {
    host: config.serverHost,
    port: config.serverPort,
  })

  // graceful shutdown
  onShutdown(async () => {
    logger.info('Shutdown')
    await serverManager.stop()
  })

  // start server
  const info = await serverManager.start()
  logger.info({
    msg: 'Server started',
    url: info.url,
  })

  return server
}

// async function startWebhook(config: any, server: any) {
//   const bot = createBot(config.botToken, {
//     config,
//     logger,
//     db: database,
//   })

//   // to prevent receiving updates before the bot is ready
//   await bot.init()

//   // set webhook
//   await bot.api.setWebhook(config.botWebhook, {
//     allowed_updates: config.botAllowedUpdates,
//     secret_token: config.botWebhookSecret,
//   })
//   logger.info({
//     msg: 'Webhook was set',
//     url: config.botWebhook,
//   })

//   if (config.isWebhookMode) {
//     server.post(
//       '/webhook',
//       webhookCallback(bot, 'hono', {
//         secretToken: config.botWebhookSecret,
//       }),
//     )
//   }
// }

// Utils

function onShutdown(cleanUp: () => Promise<void>) {
  let isShuttingDown = false
  const handleShutdown = async () => {
    if (isShuttingDown)
      return
    isShuttingDown = true
    await cleanUp()
  }
  process.on('SIGINT', handleShutdown)
  process.on('SIGTERM', handleShutdown)
}
