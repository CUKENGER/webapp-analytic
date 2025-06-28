import type { Context, Next } from 'hono'
import database from '#root/db/database.js'

export async function setUpDbClientMiddleware(c: Context, next: Next) {
  c.set('db', database)
  await next()
}
