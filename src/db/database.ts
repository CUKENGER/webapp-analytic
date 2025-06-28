import type { DB } from '#root/db/types/kysely.js'
import type { PostgresPool } from 'kysely'
import { config } from '#root/config.js'
import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

const { Pool } = pg
export type KyselyDatabase = Kysely<DB>

const database: KyselyDatabase = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.databaseUrl,
    }) as PostgresPool,
  }),
})

export default database
