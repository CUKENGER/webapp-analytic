import type { Bot } from '#root/bot/index.js'
import type { KyselyDatabase } from '#root/db/database.js'
import type { Logger } from '#root/logger.js'

export interface Env {
  Variables: {
    requestId: string
    logger: Logger
    db: KyselyDatabase
    bot: Bot
  }
}
