import { serve } from '@hono/node-server'
import { createApp } from './app.js'

const PORT = Number(process.env.PORT || 8787)
const app = createApp()

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`)
  console.log(
    `Stripe: ${process.env.STRIPE_SECRET_KEY ? 'enabled' : 'DEMO MODE (no STRIPE_SECRET_KEY)'}`,
  )
  console.log(`Client URL: ${(process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '')}`)
})
