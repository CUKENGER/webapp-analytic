import type { DB } from '#root/db/types/kysely.js'
import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('email', 'text', col => col.unique().notNull())
    .addColumn('password', 'text', col => col.notNull())
    .execute()

  await db.schema.createIndex('users_email_index').on('users').column('email').execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('users').execute()
}
