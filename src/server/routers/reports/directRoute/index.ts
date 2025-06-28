import { type Env, Hono } from 'hono'
import { campaignsRoute } from '#root/server/routers/reports/directRoute/campaignsRoute.js'
import { adsRoute } from '#root/server/routers/reports/directRoute/adsRoute.js'
import { daysRoute } from '#root/server/routers/reports/directRoute/daysRoute.js'

export const directRoute = new Hono<Env>()
  .basePath('/')
  .route('/ads', adsRoute)
  .route('/days', daysRoute)
  .route('/campaigns', campaignsRoute)
