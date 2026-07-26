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

const memoryBookings: BookingRecord[] = []

function blobsEnabled() {
  return Boolean(process.env.NETLIFY || process.env.USE_NETLIFY_BLOBS)
}

async function readFromBlobs(): Promise<BookingRecord[]> {
  const { getStore } = await import('@netlify/blobs')
  const store = getStore('fuwahm-bookings')
  const data = (await store.get('bookings', { type: 'json' })) as
    | { bookings?: BookingRecord[] }
    | null
  return data?.bookings ?? []
}

async function writeToBlobs(bookings: BookingRecord[]) {
  const { getStore } = await import('@netlify/blobs')
  const store = getStore('fuwahm-bookings')
  await store.setJSON('bookings', { bookings })
}

function ensureStore() {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true })
  if (!existsSync(storePath)) {
    writeFileSync(storePath, JSON.stringify({ bookings: [] }, null, 2))
  }
}

export async function readBookings(): Promise<BookingRecord[]> {
  if (shouldUseBlobs()) {
    try {
      return await readFromBlobs()
    } catch {
      return memoryBookings
    }
  }

  try {
    ensureStore()
    const raw = JSON.parse(readFileSync(storePath, 'utf8')) as { bookings: BookingRecord[] }
    return raw.bookings ?? []
  } catch {
    return memoryBookings
  }
}

export async function writeBookings(bookings: BookingRecord[]) {
  if (shouldUseBlobs()) {
    try {
      await writeToBlobs(bookings)
      return
    } catch {
      memoryBookings.splice(0, memoryBookings.length, ...bookings)
      return
    }
  }

  try {
    ensureStore()
    writeFileSync(storePath, JSON.stringify({ bookings }, null, 2))
  } catch {
    memoryBookings.splice(0, memoryBookings.length, ...bookings)
  }
}

export async function upsertBooking(booking: BookingRecord) {
  const bookings = await readBookings()
  const idx = bookings.findIndex((b) => b.id === booking.id)
  if (idx >= 0) bookings[idx] = booking
  else bookings.push(booking)
  await writeBookings(bookings)
  return booking
}

export async function findBySessionId(sessionId: string) {
  const bookings = await readBookings()
  return bookings.find((b) => b.stripeSessionId === sessionId)
}

export async function getBookedSlots(date: string) {
  const now = Date.now()
  const bookings = await readBookings()
  return bookings
    .filter((b) => {
      if (b.date !== date) return false
      if (b.status === 'paid') return true
      if (b.status !== 'pending') return false
      return now - new Date(b.createdAt).getTime() < 30 * 60 * 1000
    })
    .map((b) => b.time)
}
