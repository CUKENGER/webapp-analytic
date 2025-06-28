export const PATHS = {
  root: '/',
  projects: {
    root: '/',
    project: (id: string | number) => `/projects/${id}`,
    bot: {
      card: (id: string | number) => `/projects/bot/${id}`,
      type: (id: string | number) => `/projects/bot/${id}/type`,
      absolute: {
        card: (id: string | number) => `/projects/bot/${id}`,
        type: (id: string | number) => `/projects/bot/${id}/type`,
      },
    },
    tariff: {
      root: (id: string | number) => `/projects/${id}/tariff`,
      success: (id: string | number) => `/projects/${id}/tariff/result`
    },
    landing: {
      root: (id: string | number) => `/projects/${id}/landing`,
      connect: (id: string | number) => `/projects/${id}/landing/connect`,
      absolute: {
        root: (id: string | number) => `/projects/${id}/landing`,
        connect: (id: string | number) => `/projects/${id}/landing/connect`,
      },
    },
    direct: {
      root: (id: string | number) => `/projects/${id}/direct`,
      days: (id: string | number) => `/projects/${id}/direct/days`,
      audience: (id: string | number) => `/projects/${id}/direct/audience`,
      campaigns: (id: string | number) => `/projects/${id}/direct/campaigns`,
      links: {
        root: (id: string | number) => `/projects/${id}/direct/links`,
        days: (id: string | number) => `/projects/${id}/direct/links/days`,
        add: (id: string | number) => `/projects/${id}/direct/links/add`,
        edit: (id: string | number, linkId: string | number) => `/projects/${id}/direct/links/edit/${linkId}`,
      },
      absolute: {
        root: (id: string | number) => `/projects/${id}/direct`,
        days: (id: string | number) => `/projects/${id}/direct/days`,
        audience: (id: string | number) => `/projects/${id}/direct/audience`,
        campaigns: (id: string | number) => `/projects/${id}/direct/campaigns`,
        links: (id: string | number) => `/projects/${id}/direct/links`,
      },
    },
    smartButton: (id: string | number) => `/projects/${id}/smart_button`,
    accesses: {
      root: (id: string | number) => `/projects/${id}/accesses`,
      find: (id: string | number) => `/projects/${id}/accesses/find`,
      absolute: {
        root: (id: string | number) => `/projects/${id}/accesses`,
        find: (id: string | number) => `/projects/${id}/accesses/find`,
      },
    },
    botPrivet: {
      root: (id: string | number) => `/projects/${id}/bot_privet`,
      add: (projectId: string | number, id: string | number) =>
        `/projects/${projectId}/bot_privet/add/${id}`,
      edit: (projectId: string | number, id: string | number) =>
        `/projects/${projectId}/bot_privet/edit/${id}`,
      absolute: {
        root: (id: string | number) => `/projects/${id}/bot_privet`,
        add: (projectId: string | number, id: string | number) =>
          `/projects/${projectId}/bot_privet/add/${id}`,
        edit: (projectId: string | number, id: string | number) =>
          `/projects/${projectId}/bot_privet/edit/${id}`,
      },
    },
    add: {
      channel: '/projects/add/channel',
      bot: '/projects/add/bot',
      group: '/projects/add/group',
      absolute: {
        channel: '/projects/add/channel',
        bot: '/projects/add/bot',
        group: '/projects/add/group',
      },
    },
    yDirect: (id: string | number) => `/projects/${id}/y_direct`,
    absolute: {
      root: '/',
      project: (id: string | number) => `/projects/${id}`,
      tariff: (id: string | number) => `/projects/${id}/tariff`,
      direct: (id: string | number) => `/projects/${id}/direct`,
      smartButton: (id: string | number) => `/projects/${id}/smart_button`,
    },
  },
  result: '/result',
  instructions: '/instructions',
  help: {
    root: '/help',
    request: '/help/request',
    requestResult: '/help/request/result',
    absolute: {
      root: '/help',
      request: '/help/request',
      requestResult: '/help/request/result',
    },
  },
  about: {
    root: '/about',
    referral: '/about/referral',
    referralStats: '/about/referral/stats',
    absolute: {
      root: '/about',
      referral: '/about/referral',
      referralStats: '/about/referral/stats',
    },
  },
  notFound: '*',
  absolute: {
    root: '/',
    result: '/result',
    instructions: '/instructions',
    notFound: '*',
  },
} as const

export type PathsType = typeof PATHS
