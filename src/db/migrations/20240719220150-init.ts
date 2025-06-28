import type { DB } from '#root/db/types/kysely.js'
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<DB>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db)
}

export async function down(db: Kysely<DB>): Promise<void> {
  await sql`DROP EXTENSION IF EXISTS "uuid-ossp"`.execute(db)
}
