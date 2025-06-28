// types.d.ts
import type { KyselyDatabase } from '#root/db/database.js'

declare module 'hono' {
  interface Context {
    req: {
      db: KyselyDatabase
    }
  }
}
