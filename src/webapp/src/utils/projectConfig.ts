// tariffConfig.ts
export const tariffMapping = {
  free: 'Бесплатный',
  trial: 'Пробный',
  based: 'Базовый',
  profi: 'Профи'
} as const

export type TariffType = keyof typeof tariffMapping

export const tariffConfig = {
  free: {
    name: 'Бесплатный',
    features: {
      landing: true,
      direct: true,
      metric: true,
      dailyReport: true,
      smartButton: true,
      welcomeBot: false,
      accessSettings: false
    }
  },
  trial: {
    name: 'Пробный',
    features: {
      landing: true,
      direct: true,
      metric: true,
      dailyReport: true,
      smartButton: true,
      welcomeBot: false,
      accessSettings: false
    }
  },
  profi: {
    name: 'Профи',
    features: {
      landing: true,
      direct: true,
      metric: true,
      dailyReport: true,
      smartButton: true,
      welcomeBot: true,
      accessSettings: true
    }
  },
  based: {
    name: 'Базовый',
    features: {
      landing: true,
      direct: true,
      metric: true,
      dailyReport: true,
      smartButton: true,
      welcomeBot: false,
      accessSettings: false
    }
  }
} as const
