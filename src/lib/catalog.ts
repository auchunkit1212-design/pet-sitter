export type ServiceId =
  | 'walk-30'
  | 'walk-45'
  | 'walk-60'
  | 'visit-40'
  | 'visit-60'

export type ExtraId = 'nail' | 'oral-med' | 'subq'

export interface ServiceOption {
  id: ServiceId
  category: 'walk' | 'visit'
  name: string
  durationLabel: string
  durationMinutes: number
  priceHkd: number
  note?: string
}

export interface ExtraOption {
  id: ExtraId
  name: string
  priceHkd: number
  note?: string
}

export const SERVICES: ServiceOption[] = [
  {
    id: 'walk-30',
    category: 'walk',
    name: '放狗服務',
    durationLabel: '30 分鐘',
    durationMinutes: 30,
    priceHkd: 180,
  },
  {
    id: 'walk-45',
    category: 'walk',
    name: '放狗服務',
    durationLabel: '45 分鐘',
    durationMinutes: 45,
    priceHkd: 200,
  },
  {
    id: 'walk-60',
    category: 'walk',
    name: '放狗服務',
    durationLabel: '60 分鐘',
    durationMinutes: 60,
    priceHkd: 220,
  },
  {
    id: 'visit-40',
    category: 'visit',
    name: '上門照顧',
    durationLabel: '30–40 分鐘',
    durationMinutes: 40,
    priceHkd: 180,
    note: '餵食、換水、清理貓砂／便便、簡單陪玩',
  },
  {
    id: 'visit-60',
    category: 'visit',
    name: '上門照顧',
    durationLabel: '60 分鐘',
    durationMinutes: 60,
    priceHkd: 240,
    note: '以上服務 + 更多陪伴時間',
  },
]

export const EXTRAS: ExtraOption[] = [
  { id: 'nail', name: '修剪指甲', priceHkd: 50 },
  { id: 'oral-med', name: '餵口服藥', priceHkd: 30 },
  {
    id: 'subq',
    name: '皮下水注射',
    priceHkd: 80,
    note: '需自備藥品',
  },
]

export const TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
] as const

export const WHATSAPP_NUMBER = '85260391631'
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
export const IG_URL = 'https://www.instagram.com/90s.petsitter/'
export const IG_HANDLE = '@90s.petsitter'

export function getService(id: ServiceId) {
  return SERVICES.find((s) => s.id === id)
}

export function calcTotal(serviceId: ServiceId, extraIds: ExtraId[]) {
  const service = getService(serviceId)
  if (!service) return 0
  const extrasTotal = extraIds.reduce((sum, id) => {
    const extra = EXTRAS.find((e) => e.id === id)
    return sum + (extra?.priceHkd ?? 0)
  }, 0)
  return service.priceHkd + extrasTotal
}
