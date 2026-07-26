export type ServiceId =
  | 'walk-30'
  | 'walk-45'
  | 'walk-60'
  | 'visit-40'
  | 'visit-60'

export type ExtraId = 'nail' | 'oral-med' | 'subq'

export const SERVICES = [
  { id: 'walk-30', name: '放狗服務 30 分鐘', priceHkd: 180 },
  { id: 'walk-45', name: '放狗服務 45 分鐘', priceHkd: 200 },
  { id: 'walk-60', name: '放狗服務 60 分鐘', priceHkd: 220 },
  { id: 'visit-40', name: '上門照顧 30–40 分鐘', priceHkd: 180 },
  { id: 'visit-60', name: '上門照顧 60 分鐘', priceHkd: 240 },
] as const

export const EXTRAS = [
  { id: 'nail', name: '修剪指甲', priceHkd: 50 },
  { id: 'oral-med', name: '餵口服藥', priceHkd: 30 },
  { id: 'subq', name: '皮下水注射', priceHkd: 80 },
] as const

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

export function isServiceId(value: string): value is ServiceId {
  return SERVICES.some((s) => s.id === value)
}

export function isExtraId(value: string): value is ExtraId {
  return EXTRAS.some((e) => e.id === value)
}

export function calcTotal(serviceId: ServiceId, extras: ExtraId[]) {
  const service = SERVICES.find((s) => s.id === serviceId)!
  const extrasTotal = extras.reduce((sum, id) => {
    const extra = EXTRAS.find((e) => e.id === id)
    return sum + (extra?.priceHkd ?? 0)
  }, 0)
  return service.priceHkd + extrasTotal
}
