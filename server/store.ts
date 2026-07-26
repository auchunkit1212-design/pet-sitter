import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, 'data')
const storePath = join(dataDir, 'bookings.json')

export interface BookingRecord {
  id: string
  serviceId: string
  serviceName: string
  extras: string[]
  date: string
  time: string
  totalHkd: number
  customerName: string
  customerPhone: string
  district: string
  petInfo: string
  notes?: string
  status: 'pending' | 'paid' | 'cancelled'
  stripeSessionId?: string
  createdAt: string
  paidAt?: string
}

function ensureStore() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
  if (!existsSync(storePath)) {
    writeFileSync(storePath, JSON.stringify({ bookings: [] }, null, 2))
  }
}

export function readBookings(): BookingRecord[] {
  ensureStore()
  const raw = JSON.parse(readFileSync(storePath, 'utf8')) as { bookings: BookingRecord[] }
  return raw.bookings ?? []
}

export function writeBookings(bookings: BookingRecord[]) {
  ensureStore()
  writeFileSync(storePath, JSON.stringify({ bookings }, null, 2))
}

export function upsertBooking(booking: BookingRecord) {
  const bookings = readBookings()
  const idx = bookings.findIndex((b) => b.id === booking.id)
  if (idx >= 0) bookings[idx] = booking
  else bookings.push(booking)
  writeBookings(bookings)
  return booking
}

export function findBySessionId(sessionId: string) {
  return readBookings().find((b) => b.stripeSessionId === sessionId)
}

export function getBookedSlots(date: string) {
  const now = Date.now()
  return readBookings()
    .filter((b) => {
      if (b.date !== date) return false
      if (b.status === 'paid') return true
      if (b.status !== 'pending') return false
      // Hold pending Stripe checkouts for 30 minutes
      return now - new Date(b.createdAt).getTime() < 30 * 60 * 1000
    })
    .map((b) => b.time)
}
