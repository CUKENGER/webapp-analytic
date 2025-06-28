import type { Bot } from '#root/bot/index.js'
import type { Config } from '#root/config.js'
import type { KyselyDatabase } from '#root/db/database.js'
import type { Logger } from '#root/logger.js'
import type { Env } from '#root/server/environment.js'
import { setUpDbClientMiddleware } from '#root/server/middlewares/db-client-middleware.js'
import { setLogger } from '#root/server/middlewares/logger.js'
import { requestId } from '#root/server/middlewares/request-id.js'
import { requestLogger } from '#root/server/middlewares/request-logger.js'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { getPath } from 'hono/utils/url'


interface Dependencies {
  bot: Bot
  config: Config
  logger: Logger
  db: KyselyDatabase
}

export async function createServer(dependencies: Dependencies) {
  const {
    bot,
    config,
    logger,
    db,
  } = dependencies

  const server = new Hono<Env>()

  server.use(requestId())
  server.use(cors())
  server.use(setLogger(logger))
  if (config.isDebug)
    server.use(requestLogger())
  server.use(setUpDbClientMiddleware)
  server.onError(async (error, c) => {
    if (error instanceof HTTPException) {
      if (error.status < 500)
        c.var.logger.info(error)
      else
        c.var.logger.error(error)

      return error.getResponse()
    }

    // unexpected error
    c.var.logger.error({
      err: error,
      method: c.req.raw.method,
      path: getPath(c.req.raw),
    })
    return c.json(
      {
        error: 'Oops! Something went wrong.',
      },
      500,
    )
  })

  server.use('/', cors())
  server.get('/', c => c.json({ status: true }))

  server.use('*', async (c, next) => {
    c.set('logger', logger)
    c.set('db', dependencies.db)
    c.set('bot', bot)
    await next()
  })

  return server
}
export type Server = Awaited<ReturnType<typeof createServer>>

export function createServerManager(server: Server, options: { host: string, port: number }) {
  let handle: undefined | ReturnType<typeof serve>
  // console.log(options)
  return {
    start() {
      return new Promise<{ url: string }>((resolve) => {
        handle = serve(
          {
            fetch: server.fetch,
            hostname: options.host,
            port: options.port,
          },
          info => resolve({
            url: info.family === 'IPv6'
              ? `http://[${info.address}]:${info.port}`
              : `http://${info.address}:${info.port}`,
          }),
        )
      })
    },
    stop() {
      return new Promise<void>((resolve) => {
        if (handle)
          handle.close(() => resolve())
        else
          resolve()
      })
    },
  }
}
