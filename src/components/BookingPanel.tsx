import { useEffect, useMemo, useState } from 'react'
import {
  EXTRAS,
  SERVICES,
  TIME_SLOTS,
  calcTotal,
  type ExtraId,
  type ServiceId,
} from '../lib/catalog'
import { createCheckout, fetchAvailability, fetchCheckoutStatus } from '../lib/api'

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
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [district, setDistrict] = useState('')
  const [petInfo, setPetInfo] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{
    serviceName: string
    date: string
    time: string
    totalHkd: number
  } | null>(null)

  const total = calcTotal(serviceId, extras)
  const matrix = useMemo(
    () => buildMonthMatrix(monthCursor.getFullYear(), monthCursor.getMonth()),
    [monthCursor],
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('booking')
    const sessionId = params.get('session_id')
    if (status === 'success' && sessionId) {
      fetchCheckoutStatus(sessionId)
        .then((res) => {
          if (res.paid && res.booking) setSuccess(res.booking)
          else setSuccess({
            serviceName: '預約服務',
            date: '',
            time: '',
            totalHkd: 0,
          })
        })
        .catch(() => {
          setSuccess({
            serviceName: '預約服務',
            date: '',
            time: '',
            totalHkd: 0,
          })
        })
    }
    if (status === 'cancelled') {
      setError('已取消付款，你可以重新揀時段再試。')
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadingSlots(true)
    setError('')
    fetchAvailability(date)
      .then((res) => {
        if (cancelled) return
        setBookedSlots(res.bookedSlots)
        if (res.bookedSlots.includes(time)) setTime('')
      })
      .catch((err: Error) => {
        if (cancelled) return
        setBookedSlots([])
        setError(err.message || '無法載入時段，請確認後端 API 已啟動。')
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false)
      })
    return () => {
      cancelled = true
    }
  }, [date, time])

  function toggleExtra(id: ExtraId) {
    setExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function shiftMonth(delta: number) {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }

  async function handlePay() {
    setError('')
    if (!time) {
      setError('請先選擇時段')
      return
    }
    setSubmitting(true)
    try {
      const res = await createCheckout({
        serviceId,
        extras,
        date,
        time,
        customerName,
        customerPhone,
        district,
        petInfo,
        notes,
      })
      window.location.href = res.url
    } catch (err) {
      setError(err instanceof Error ? err.message : '付款建立失敗')
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="booking-success">
        <p className="section-kicker">Paid</p>
        <h3>預約成功，多謝信任</h3>
        <p>
          {success.serviceName}
          {success.date ? `｜${success.date} ${success.time}` : ''}
          {success.totalHkd ? `｜HK$${success.totalHkd}` : ''}
        </p>
        <p className="muted">我們會盡快 WhatsApp 你確認上門詳情。</p>
        <button
          type="button"
          className="btn btn-solid"
          onClick={() => {
            setSuccess(null)
            const url = new URL(window.location.href)
            url.searchParams.delete('booking')
            url.searchParams.delete('session_id')
            window.history.replaceState({}, '', `${url.pathname}${url.search}#booking`)
          }}
        >
          再預約另一次
        </button>
      </div>
    )
  }

  return (
    <div className="booking-panel">
      <div className="booking-steps">
        <section className="booking-card">
          <h3>1. 揀服務</h3>
          <div className="service-options">
            {SERVICES.map((service) => (
              <label key={service.id} className={`choice${serviceId === service.id ? ' is-active' : ''}`}>
                <input
                  type="radio"
                  name="service"
                  checked={serviceId === service.id}
                  onChange={() => setServiceId(service.id)}
                />
                <span className="choice-main">
                  <strong>
                    {service.name} · {service.durationLabel}
                  </strong>
                  <em>HK${service.priceHkd}</em>
                </span>
                {service.note ? <span className="choice-note">{service.note}</span> : null}
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
                    onClick={() => setDate(key)}
                  >
                    {cell.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          <p className="mini-label">可選時段 {loadingSlots ? '（載入中…）' : ''}</p>
          <div className="slot-grid">
            {TIME_SLOTS.map((slot) => {
              const taken = bookedSlots.includes(slot)
              return (
                <button
                  key={slot}
                  type="button"
                  className={`slot${time === slot ? ' is-selected' : ''}`}
                  disabled={taken || loadingSlots}
                  onClick={() => setTime(slot)}
                >
                  {slot}
                  {taken ? ' 滿' : ''}
                </button>
              )
            })}
          </div>
        </section>

        <section className="booking-card">
          <h3>3. 填資料，即刻 Stripe 付款</h3>
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
                placeholder="品種、年齡、隻數"
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

          <div className="pay-bar">
            <div>
              <p className="mini-label">應付金額</p>
              <p className="pay-total">HK${total}</p>
              <p className="muted">
                {date} {time || '—'}｜安全 Stripe 線上付款
              </p>
            </div>
            <button type="button" className="btn btn-primary" disabled={submitting} onClick={handlePay}>
              {submitting ? '跳轉付款中…' : '確認並付款'}
            </button>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
        </section>
      </div>
    </div>
  )
}
