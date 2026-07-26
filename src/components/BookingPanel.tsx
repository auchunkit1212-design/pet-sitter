import { useMemo, useState } from 'react'
import {
  EXTRAS,
  SERVICES,
  TIME_SLOTS,
  WHATSAPP_NUMBER,
  calcTotal,
  getService,
  type ExtraId,
  type ServiceId,
} from '../lib/catalog'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function buildMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1)
  const startWeekday = (first.getDay() + 6) % 7 // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: Array<Date | null> = []

  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day))
  }
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function isSlotPast(date: string, slot: string) {
  const now = new Date()
  const today = toDateKey(now)
  if (date < today) return true
  if (date > today) return false
  const [hh, mm] = slot.split(':').map(Number)
  const slotDate = new Date(now)
  slotDate.setHours(hh, mm, 0, 0)
  return slotDate.getTime() <= now.getTime() + 60 * 60 * 1000
}

const weekdays = ['一', '二', '三', '四', '五', '六', '日']

export function BookingPanel() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const maxDate = useMemo(() => {
    const d = startOfDay(new Date())
    d.setDate(d.getDate() + 28)
    return d
  }, [])

  const [monthCursor, setMonthCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [serviceId, setServiceId] = useState<ServiceId>('walk-30')
  const [extras, setExtras] = useState<ExtraId[]>([])
  const [date, setDate] = useState(toDateKey(today))
  const [time, setTime] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [district, setDistrict] = useState('')
  const [petInfo, setPetInfo] = useState('')
  const [notes, setNotes] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  const total = calcTotal(serviceId, extras)
  const service = getService(serviceId)
  const matrix = useMemo(
    () => buildMonthMatrix(monthCursor.getFullYear(), monthCursor.getMonth()),
    [monthCursor],
  )

  function toggleExtra(id: ExtraId) {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function shiftMonth(delta: number) {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  function handleWhatsAppBook() {
    setError('')
    if (!time) {
      setError('請先選擇時段')
      return
    }
    if (!customerName.trim() || !customerPhone.trim() || !district.trim() || !petInfo.trim()) {
      setError('請填寫姓名、電話、地區同毛孩資料')
      return
    }
    if (!agreed) {
      setError('請先同意服務守則與免責條款')
      return
    }

    const extraNames = extras
      .map((id) => EXTRAS.find((e) => e.id === id)?.name)
      .filter(Boolean)
      .join('、')

    const message = [
      '你好 Fuwahm，我想預約服務：',
      '',
      `服務：${service?.name} ${service?.durationLabel}`,
      `日期：${date}`,
      `時間：${time}`,
      `地區：${district.trim()}`,
      `毛孩：${petInfo.trim()}`,
      extraNames ? `額外服務：${extraNames}` : null,
      `預算約：HK$${total}`,
      '',
      `聯絡人：${customerName.trim()}`,
      `電話：${customerPhone.trim()}`,
      notes.trim() ? `備註：${notes.trim()}` : null,
      '',
      '我想用 WhatsApp 確認檔期同付款方式，謝謝！',
      '（已閱讀並同意服務守則與免責條款）',
    ]
      .filter((line) => line !== null)
      .join('\n')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="booking-panel">
      <div className="booking-steps">
        <section className="booking-card">
          <h3>1. 揀服務</h3>
          <div className="service-options">
            {SERVICES.map((item) => (
              <label key={item.id} className={`choice${serviceId === item.id ? ' is-active' : ''}`}>
                <input
                  type="radio"
                  name="service"
                  checked={serviceId === item.id}
                  onChange={() => setServiceId(item.id)}
                />
                <span className="choice-main">
                  <strong>
                    {item.name} · {item.durationLabel}
                  </strong>
                  <em>HK${item.priceHkd}</em>
                </span>
                {item.note ? <span className="choice-note">{item.note}</span> : null}
              </label>
            ))}
          </div>

          <div className="extra-options">
            <p className="mini-label">額外服務（可選）</p>
            {EXTRAS.map((extra) => (
              <label key={extra.id} className="check-row">
                <input
                  type="checkbox"
                  checked={extras.includes(extra.id)}
                  onChange={() => toggleExtra(extra.id)}
                />
                <span>
                  {extra.name}
                  {extra.note ? `（${extra.note}）` : ''}
                </span>
                <strong>+${extra.priceHkd}</strong>
              </label>
            ))}
          </div>
        </section>

        <section className="booking-card">
          <h3>2. 揀日期同時間</h3>
          <div className="calendar">
            <div className="calendar-head">
              <button type="button" onClick={() => shiftMonth(-1)} aria-label="上一個月">
                ‹
              </button>
              <strong>
                {monthCursor.getFullYear()} 年 {monthCursor.getMonth() + 1} 月
              </strong>
              <button type="button" onClick={() => shiftMonth(1)} aria-label="下一個月">
                ›
              </button>
            </div>
            <div className="calendar-grid weekday">
              {weekdays.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {matrix.map((cell, idx) => {
                if (!cell) return <span key={`e-${idx}`} />
                const key = toDateKey(cell)
                const disabled = cell < today || cell > maxDate
                const selected = key === date
                return (
                  <button
                    key={key}
                    type="button"
                    className={`day${selected ? ' is-selected' : ''}`}
                    disabled={disabled}
                    onClick={() => {
                      setDate(key)
                      setTime('')
                    }}
                  >
                    {cell.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          <p className="mini-label">可選時段</p>
          <div className="slot-grid">
            {TIME_SLOTS.map((slot) => {
              const taken = isSlotPast(date, slot)
              return (
                <button
                  key={slot}
                  type="button"
                  className={`slot${time === slot ? ' is-selected' : ''}`}
                  disabled={taken}
                  onClick={() => setTime(slot)}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </section>

        <section className="booking-card">
          <h3>3. 填資料，用 WhatsApp 確認同俾錢</h3>
          <div className="form-grid">
            <label>
              你嘅名
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="例如：Amy" />
            </label>
            <label>
              WhatsApp 電話
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="例如：60391631"
              />
            </label>
            <label>
              服務地區
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="例如：旺角／將軍澳"
              />
            </label>
            <label>
              毛孩資料
              <input
                value={petInfo}
                onChange={(e) => setPetInfo(e.target.value)}
                placeholder="品種、年齡、隻數、健康狀況"
              />
            </label>
            <label className="full">
              備註（可選）
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="門禁、牽繩位置、特別護理…"
              />
            </label>
          </div>

          <label className="agree-row">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              我已閱讀並同意{' '}
              <a href="#terms">Fuwahm 服務守則與免責條款</a>
            </span>
          </label>

          <div className="pay-bar">
            <div>
              <p className="mini-label">預算金額</p>
              <p className="pay-total">HK${total}</p>
              <p className="muted">
                {date} {time || '—'}｜下一步用 WhatsApp 確認檔期同付款
              </p>
            </div>
            <button type="button" className="btn btn-primary" onClick={handleWhatsAppBook}>
              WhatsApp 預約／俾錢
            </button>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
        </section>
      </div>
    </div>
  )
}
