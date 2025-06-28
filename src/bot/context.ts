import type { Config } from '#root/config.js'
import type { KyselyDatabase } from '#root/db/database.js'
import type { Logger } from '#root/logger.js'
import type { AutoChatActionFlavor } from '@grammyjs/auto-chat-action'
import type { HydrateFlavor } from '@grammyjs/hydrate'
import type { I18nFlavor } from '@grammyjs/i18n'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import type { Update, UserFromGetMe } from '@grammyjs/types'
import { type Api, Context as DefaultContext, type SessionFlavor } from 'grammy'

export interface SessionData {
  // field?: string;
}

interface ExtendedContextFlavor {
  logger: Logger
  config: Config
  db: KyselyDatabase
}

export type Context = ParseModeFlavor<
  HydrateFlavor<
    DefaultContext &
    ExtendedContextFlavor &
    SessionFlavor<SessionData> &
    I18nFlavor &
    AutoChatActionFlavor
  >
>

interface Dependencies {
  logger: Logger
  config: Config
  db: KyselyDatabase
}

export function createContextConstructor(
  {
    logger,
    config,
    db,
  }: Dependencies,
) {
  return class extends DefaultContext implements ExtendedContextFlavor {
    logger: Logger
    config: Config
    db: KyselyDatabase

    constructor(update: Update, api: Api, me: UserFromGetMe) {
      super(update, api, me)

      this.logger = logger.child({
        update_id: this.update.update_id,
      })
      this.config = config
      this.db = db
    }
  } as unknown as new (update: Update, api: Api, me: UserFromGetMe) => Context
}
