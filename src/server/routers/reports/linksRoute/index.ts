import { insertInviteRoute } from '#root/server/routers/reports/linksRoute/insertInviteRoute.js'
import { listInviteRoute } from '#root/server/routers/reports/linksRoute/listInviteRoute.js'
import { type Env, Hono } from 'hono'
import { daysInviteRoute } from './daysInviteRoute.js'

export const linksRoute = new Hono<Env>()
  .basePath('/')
  .route('/invite', listInviteRoute)
  .route('/invite', insertInviteRoute)
  .route('/days', daysInviteRoute)
