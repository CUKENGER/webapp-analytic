import { IBot } from '@/api/types/bot.types'
import { Project, ProjectFull } from '@/api/types/projects.types'

export const mockProjects: Project[] = [
  {
    id: '218',
    tgTitle: 'mock_сhannel_1',
    paidUntilEpoch: '2025-07-10T19:28:28+03:00',
    isActive: true,
    tariff: 'profi',
    tgChannelID: '-1001851066330',
    type: 'channel'
  },
  {
    id: '219',
    tgTitle: 'mock_сhannel_2',
    paidUntilEpoch: '2025-07-12T19:28:28+03:00',
    isActive: true,
    tariff: 'based',
    tgChannelID: '-100185106633321',
    type: 'channel'
  },
  {
    id: '220',
    tgTitle: 'mock_bot_1',
    paidUntilEpoch: '2025-07-16T19:28:28+03:00',
    isActive: true,
    tariff: 'profi',
    tgChannelID: '7019329523',
    type: 'bot'
  }
]

export const mockProjectsFull: ProjectFull[] = [
  {
    id: '218',
    tgTitle: 'mock_сhannel_1',
    paidUntilEpoch: '2025-07-10T19:28:28+03:00',
    isActive: true,
    tariff: 'profi',
    yaCounterID: '98440478',
    landingFolderName: '1001851066330',
    yaLoginInfo: 'teletrafru-tg',
    tgChannelID: '-1001851066330'
  },
  {
    id: '219',
    tgTitle: 'mock_сhannel_2',
    paidUntilEpoch: '2025-07-12T19:28:28+03:00',
    isActive: true,
    tariff: 'based',
    yaCounterID: '0123456789',
    landingFolderName: '7019329521',
    yaLoginInfo: 'tgraphyx',
    tgChannelID: '7019329521'
  }
]

export const mockBotFull: IBot[] = [
  {
    id: '220',
    name: 'mock_bot_1',
    end_date: '2025-07-16T19:28:28+03:00',
    is_active: true,
    tariff: 'profi',
    metrica: '98440478',
    landing: '1001851066330',
    direct: 'teletrafru-tg',
    tariff_display: 'Профи',
    type: 'bot',
    type_bot: 'SaleBot'
  }
]

