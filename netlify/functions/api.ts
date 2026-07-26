import { handle } from 'hono/netlify'
import type { Config } from '@netlify/functions'
import { createApp } from '../../server/app'

const app = createApp()

export default handle(app)

export const config: Config = {
  path: '/api/*',
}
