import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import _ from 'lodash'
import { DateTime } from 'luxon'

const dateString = DateTime.local().toFormat('yyyyMMddHHmmss')
const migrationName = process.argv[2]
const migrationFileName = `${dateString}-${_.snakeCase(migrationName)}.ts`
const migrationPath = path.join(process.cwd(), 'src', 'db', 'migrations', migrationFileName)

const template = `import { sql, type Kysely } from 'kysely'
import { type DB } from '#root/db/types/kysely.js'

export async function up(db: Kysely<any>): Promise<void> {

}

export async function down(db: Kysely<any>): Promise<void> {

}
`

// create file
fs.writeFileSync(migrationPath, template)

console.log(`created migration file: ${migrationPath}`)
