import type { ExtraId, ServiceId } from './catalog'

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error(data.error || `請求失敗（${res.status}）`)
  }
  return data
}

export interface AvailabilityResponse {
  date: string
  bookedSlots: string[]
}

export interface CheckoutPayload {
  serviceId: ServiceId
  extras: ExtraId[]
  date: string
  time: string
  customerName: string
  customerPhone: string
  district: string
  petInfo: string
  notes?: string
}

export interface CheckoutResponse {
  url: string
  demo?: boolean
}

export function fetchAvailability(date: string) {
  return request<AvailabilityResponse>(`/api/availability?date=${encodeURIComponent(date)}`)
}

export function createCheckout(payload: CheckoutPayload) {
  return request<CheckoutResponse>('/api/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchCheckoutStatus(sessionId: string) {
  return request<{
    paid: boolean
    booking?: {
      serviceName: string
      date: string
      time: string
      totalHkd: number
    }
  }>(`/api/checkout-status?session_id=${encodeURIComponent(sessionId)}`)
}
