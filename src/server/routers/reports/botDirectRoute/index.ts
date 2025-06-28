import { type Env, Hono } from 'hono'
import { botAdsRoute } from './adsRoute.js'
import { botCampaignsRoute } from './botCampaignsRoute.js'
import { botDaysRoute } from './daysRoute.js'

export const botDirectRoute = new Hono<Env>()
  .basePath('/')
  .route('/days', botDaysRoute)
  .route('/ads', botAdsRoute)
  .route('/campaigns', botCampaignsRoute)
