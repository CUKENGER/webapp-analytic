import 'dotenv/config.js';

type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>

type KeysToCamelCase<T> = {
  [K in keyof T as CamelCase<string & K>]: T[K] extends object ? KeysToCamelCase<T[K]> : T[K]
}

// Определим интерфейс для нашего конфига
export interface Config extends KeysToCamelCase<NodeJS.ProcessEnv> {
  botMode?: string
  isWebhookMode?: boolean
  isPollingMode?: boolean
  isDebug?: boolean
  botToken: string
  // botAdmins?: any[];
  // botAllowedUpdates?: any[];
  serverPort: number
  [key: string]: any // Разрешаем любые другие свойства
}

function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/_([a-z])/g, (_match, p1) => p1.toUpperCase())
}

function convertKeysToCamelCase<T extends Record<string, any>>(obj: T): KeysToCamelCase<T> {
  const result: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = toCamelCase(key)
      result[camelCaseKey] = obj[key]
    }
  }
  return result as KeysToCamelCase<T>
}

function createConfigFromEnvironment(): Config {
  try {
    // Преобразуем все переменные окружения в camelCase
    const config = convertKeysToCamelCase(process.env) as Config

    // Добавим полезные флаги на основе значения botMode
    if (config.botMode === 'webhook') {
      config.isWebhookMode = true
      config.isPollingMode = false
    }
    else {
      config.isWebhookMode = false
      config.isPollingMode = true
    }

    // Преобразуем строковые значения в JSON, где это необходимо
    if (config.debug)
      config.isDebug = JSON.parse(config.debug as string)
    // if (config.botAdmins) config.botAdmins = JSON.parse(config.botAdmins as string)
    // if (config.botAllowedUpdates) config.botAllowedUpdates = JSON.parse(config.botAllowedUpdates as string)
    if (config.serverPort)
      config.serverPort = Number(config.serverPort)

    return config
  }
  catch (error) {
    throw new Error('Invalid config', {
      cause: error,
    })
  }
}

export const config = createConfigFromEnvironment()
