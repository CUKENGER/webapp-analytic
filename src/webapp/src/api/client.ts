import { ApiRoutes } from '@/types'
import { hc } from 'hono/client';


export const client = hc<ApiRoutes>('/').api
