import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { randomUUID } from 'node:crypto'
import Stripe from 'stripe'
import {
  TIME_SLOTS,
  SERVICES,
  EXTRAS,
  calcTotal,
  isExtraId,
  isServiceId,
  type ExtraId,
  type ServiceId,
} from './catalog.js'
import {
  findBySessionId,
  getBookedSlots,
  upsertBooking,
  type BookingRecord,
} from './store.js'

const PORT = Number(process.env.PORT || 8787)
const CLIENT_URL = (process.env.CLIENT_URL || 'http://localhost:5173/pet-sitter').replace(/\/$/, '')
const stripeKey = process.env.STRIPE_SECRET_KEY || ''
const stripe = stripeKey ? new Stripe(stripeKey) : null
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

const app = new Hono()

app.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Stripe-Signature'],
  }),
)

app.get('/api/health', (c) =>
  c.json({
    ok: true,
    stripe: Boolean(stripe),
    demoMode: !stripe,
  }),
)

app.get('/api/availability', (c) => {
  const date = c.req.query('date')
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return c.json({ error: '請提供有效日期' }, 400)
  }

  const booked = new Set(getBookedSlots(date))
  const now = new Date()
  const today = toDateKey(now)

  const unavailable = TIME_SLOTS.filter((slot) => {
    if (booked.has(slot)) return true
    if (date < today) return true
    if (date === today) {
      const [hh, mm] = slot.split(':').map(Number)
      const slotDate = new Date(now)
      slotDate.setHours(hh, mm, 0, 0)
      return slotDate.getTime() <= now.getTime() + 60 * 60 * 1000
    }
    return false
  })

  return c.json({ date, bookedSlots: unavailable })
})

app.post('/api/create-checkout-session', async (c) => {
  const body = await c.req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return c.json({ error: '無效請求' }, 400)
  }

  const serviceId = String(body.serviceId || '')
  const date = String(body.date || '')
  const time = String(body.time || '')
  const customerName = String(body.customerName || '').trim()
  const customerPhone = String(body.customerPhone || '').trim()
  const district = String(body.district || '').trim()
  const petInfo = String(body.petInfo || '').trim()
  const notes = String(body.notes || '').trim()
  const extrasRaw = Array.isArray(body.extras) ? body.extras.map(String) : []

  if (!isServiceId(serviceId)) return c.json({ error: '請選擇有效服務' }, 400)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return c.json({ error: '請選擇日期' }, 400)
  if (!(TIME_SLOTS as readonly string[]).includes(time)) {
    return c.json({ error: '請選擇時段' }, 400)
  }
  if (!customerName || !customerPhone || !district || !petInfo) {
    return c.json({ error: '請填寫姓名、電話、地區同毛孩資料' }, 400)
  }
  if (!extrasRaw.every(isExtraId)) return c.json({ error: '額外服務無效' }, 400)

  const extras = extrasRaw as ExtraId[]
  const booked = getBookedSlots(date)
  if (booked.includes(time)) {
    return c.json({ error: '此時段剛剛被人預約咗，請另揀' }, 409)
  }

  const service = SERVICES.find((s) => s.id === serviceId)!
  const totalHkd = calcTotal(serviceId as ServiceId, extras)
  const bookingId = randomUUID()

  const booking: BookingRecord = {
    id: bookingId,
    serviceId,
    serviceName: service.name,
    extras: extras.map((id) => EXTRAS.find((e) => e.id === id)!.name),
    date,
    time,
    totalHkd,
    customerName,
    customerPhone,
    district,
    petInfo,
    notes: notes || undefined,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  // Demo mode: no Stripe key — mark paid and return success URL
  if (!stripe) {
    booking.status = 'paid'
    booking.paidAt = new Date().toISOString()
    booking.stripeSessionId = `demo_${bookingId}`
    upsertBooking(booking)
    return c.json({
      url: `${CLIENT_URL}/?booking=success&session_id=${booking.stripeSessionId}#booking`,
      demo: true,
    })
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      quantity: 1,
      price_data: {
        currency: 'hkd',
        unit_amount: service.priceHkd * 100,
        product_data: {
          name: service.name,
          description: `${date} ${time}｜${district}`,
        },
      },
    },
    ...extras.map((id) => {
      const extra = EXTRAS.find((e) => e.id === id)!
      return {
        quantity: 1,
        price_data: {
          currency: 'hkd' as const,
          unit_amount: extra.priceHkd * 100,
          product_data: { name: extra.name },
        },
      }
    }),
  ]

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${CLIENT_URL}/?booking=success&session_id={CHECKOUT_SESSION_ID}#booking`,
    cancel_url: `${CLIENT_URL}/?booking=cancelled#booking`,
    customer_email: undefined,
    phone_number_collection: { enabled: true },
    metadata: {
      bookingId,
      serviceId,
      date,
      time,
      customerName,
      customerPhone,
      district,
    },
    line_items: lineItems,
  })

  booking.stripeSessionId = session.id
  upsertBooking(booking)

  if (!session.url) return c.json({ error: '無法建立付款連結' }, 500)
  return c.json({ url: session.url })
})

app.get('/api/checkout-status', async (c) => {
  const sessionId = c.req.query('session_id')
  if (!sessionId) return c.json({ error: '缺少 session_id' }, 400)

  let booking = findBySessionId(sessionId)

  if (stripe && sessionId.startsWith('cs_')) {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === 'paid' && booking && booking.status !== 'paid') {
      booking = {
        ...booking,
        status: 'paid',
        paidAt: new Date().toISOString(),
      }
      upsertBooking(booking)
    }
  }

  if (!booking) return c.json({ paid: false })

  return c.json({
    paid: booking.status === 'paid',
    booking: {
      serviceName: booking.serviceName,
      date: booking.date,
      time: booking.time,
      totalHkd: booking.totalHkd,
    },
  })
})

app.post('/api/webhook', async (c) => {
  if (!stripe) return c.json({ error: 'Stripe 未設定' }, 400)

  const signature = c.req.header('stripe-signature')
  const rawBody = await c.req.text()

  let event: Stripe.Event
  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } else {
      event = JSON.parse(rawBody) as Stripe.Event
    }
  } catch {
    return c.json({ error: 'Webhook 驗證失敗' }, 400)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const booking = findBySessionId(session.id)
    if (booking) {
      upsertBooking({
        ...booking,
        status: 'paid',
        paidAt: new Date().toISOString(),
      })
    }
  }

  return c.json({ received: true })
})

function toDateKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`)
  console.log(`Stripe: ${stripe ? 'enabled' : 'DEMO MODE (no STRIPE_SECRET_KEY)'}`)
  console.log(`Client URL: ${CLIENT_URL}`)
})
