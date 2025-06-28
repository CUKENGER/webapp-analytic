import type { Context, SessionData } from '#root/bot/context.js'
import type { Config } from '#root/config.js'
import type { KyselyDatabase } from '#root/db/database.js'
import type { Logger } from '#root/logger.js'
import type { BotConfig, StorageAdapter } from 'grammy'
import { createContextConstructor } from '#root/bot/context.js'
import { errorHandler } from '#root/bot/handlers/error.js'
import { updateLogger } from '#root/bot/middlewares/update-logger.js'
import { parseMode } from '@grammyjs/parse-mode'
import { Bot as TelegramBot } from 'grammy'

interface Dependencies {
  config: Config
  logger: Logger
  db: KyselyDatabase
}

interface Options {
  botSessionStorage?: StorageAdapter<SessionData>
  botConfig?: Omit<BotConfig<Context>, 'ContextConstructor'>
}

function getSessionKey(ctx: Omit<Context, 'session'>) {
  return ctx.chat?.id.toString()
}

export function createBot(token: string, dependencies: Dependencies, options: Options = {}) {
  const {
    config,
    logger,
    db,
  } = dependencies

  const bot = new TelegramBot(token, {
    ...options.botConfig,
    ContextConstructor: createContextConstructor({
      logger,
      config,
      db,
    }),
  })
  const protectedBot = bot.errorBoundary(errorHandler)

  // Middlewares
  bot.api.config.use(parseMode('HTML'))
  if (config.isDebug)
    protectedBot.use(updateLogger())
  // if (config.isPollingMode)
    // protectedBot.use(sequentialize(getSessionKey))
  // protectedBot.use(autoChatAction(bot.api))
  // protectedBot.use(hydrateReply)
  // protectedBot.use(hydrate())
  // protectedBot.use(session({ getSessionKey, storage: options.botSessionStorage }))
  // protectedBot.use(i18n)

  // Handlers
  // protectedBot.use(welcomeFeature)
  // protectedBot.use(adminFeature)
  // if (isMultipleLocales)
  // protectedBot.use(languageFeature)
  // must be the last handler
  // protectedBot.use(unhandledFeature)

  return bot
}

export type Bot = ReturnType<typeof createBot>
