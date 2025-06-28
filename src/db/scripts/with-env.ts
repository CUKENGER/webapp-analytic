// this file is solely to load the .env file before any other scripts are run.
// This is needed because the dotenv.config() call is not hoisted to the top of the file.
// Usage: ts-node -r ./src/scripts/with-env.ts src/scripts/create-migration.ts

// eslint-disable-next-line @typescript-eslint/no-var-requires
import 'dotenv/config.js'
