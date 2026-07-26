import { useEffect, useRef, useState, type ReactNode } from 'react'
import './App.css'

const IG_URL = 'https://www.instagram.com/90s.petsitter/'
const IG_HANDLE = '@90s.petsitter'

const galleryPhotos = [
  { src: 'pet-12.jpg', alt: '戶外放狗陪伴' },
  { src: 'pet-02.jpg', alt: '小型犬近距離互動' },
  { src: 'pet-06.jpg', alt: '兩隻小貓居家照顧' },
  { src: 'pet-17.jpg', alt: '橘貓居家陪伴' },
  { src: 'pet-18.jpg', alt: '小貓沙發休息' },
  { src: 'pet-09.jpg', alt: '白貓放鬆時刻' },
  { src: 'pet-16.jpg', alt: '毛孩日常' },
  { src: 'pet-01.jpg', alt: '毛孩服務瞬間' },
]

type PriceTab = 'walk' | 'visit'

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.16 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function Reveal({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </div>
  )
}

export default function App() {
  const scrolled = useScrolled()
  const [tab, setTab] = useState<PriceTab>('walk')

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <a className="brand-mark" href="#top">
          90s Pet Sitter
        </a>
        <nav className="nav-links" aria-label="主要導覽">
          <a href="#services">服務</a>
          <a href="#pricing">價錢</a>
          <a href="#gallery">相簿</a>
          <a className="nav-cta" href={IG_URL} target="_blank" rel="noreferrer">
            DM 預約
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-label="品牌介紹">
          <div className="hero-media">
            <img
              src={`${import.meta.env.BASE_URL}photos/pet-12.jpg`}
              alt="90s Pet Sitter 戶外放狗服務"
            />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content">
            <h1 className="hero-brand">
              90s Pet Sitter
              <span>90後年輕寵物保姆</span>
            </h1>
            <p className="hero-line">把你嘅毛孩當自己寶貝一樣照顧</p>
            <p className="hero-sub">
              全港上門｜放狗、放貓、餵食、陪伴。親切可靠，每次即時影相／短片報告。
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href={IG_URL} target="_blank" rel="noreferrer">
                Instagram DM 約時間
              </a>
              <a className="btn btn-ghost" href="#pricing">
                睇服務價錢
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <Reveal>
            <div className="section-head">
              <p className="section-kicker">Services</p>
              <h2>上門照顧，簡單又放心</h2>
              <p>
                無論出埠定返工忙碌，都可以放心將毛孩交給 90 後保姆。香港全區上門，按你同毛孩需要安排時間。
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="services-grid">
              <article className="service-block">
                <h3>放狗服務</h3>
                <p>帶毛孩出門活動、嗅嗅世界、消耗精力，回家再報告狀態。</p>
                <ul className="price-list">
                  <li>
                    <span className="label">30 分鐘</span>
                    <span className="amount">$180</span>
                  </li>
                  <li>
                    <span className="label">45 分鐘</span>
                    <span className="amount">$200</span>
                  </li>
                  <li>
                    <span className="label">60 分鐘</span>
                    <span className="amount">$220</span>
                  </li>
                </ul>
              </article>

              <article className="service-block">
                <h3>上門照顧</h3>
                <p>適合貓狗居家照顧：餵食、換水、清理、陪玩，讓毛孩喺熟悉環境安心。</p>
                <ul className="price-list">
                  <li>
                    <span className="label">30–40 分鐘</span>
                    <span className="amount">$180</span>
                    <span className="note">餵食、換水、清理貓砂／便便、簡單陪玩</span>
                  </li>
                  <li>
                    <span className="label">60 分鐘</span>
                    <span className="amount">$240</span>
                    <span className="note">以上服務 + 更多陪伴時間</span>
                  </li>
                </ul>
              </article>
            </div>
          </Reveal>
        </section>

        <section id="pricing" className="section">
          <Reveal>
            <div className="section-head">
              <p className="section-kicker">Pricing</p>
              <h2>清楚價錢，方便你預算</h2>
              <p>費用已包一般交通費（港島、九龍、新界主要地區）。有特別需要可以先 DM 傾。</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="tabs" role="tablist" aria-label="價錢類別">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'walk'}
                className={`tab${tab === 'walk' ? ' is-active' : ''}`}
                onClick={() => setTab('walk')}
              >
                放狗服務
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'visit'}
                className={`tab${tab === 'visit' ? ' is-active' : ''}`}
                onClick={() => setTab('visit')}
              >
                上門照顧
              </button>
            </div>

            {tab === 'walk' ? (
              <ul className="price-list">
                <li>
                  <span className="label">Dog Walking 30 分鐘</span>
                  <span className="amount">$180</span>
                </li>
                <li>
                  <span className="label">Dog Walking 45 分鐘</span>
                  <span className="amount">$200</span>
                </li>
                <li>
                  <span className="label">Dog Walking 60 分鐘</span>
                  <span className="amount">$220</span>
                </li>
              </ul>
            ) : (
              <ul className="price-list">
                <li>
                  <span className="label">Home Visit 30–40 分鐘</span>
                  <span className="amount">$180</span>
                  <span className="note">餵食、換水、清理貓砂／便便、簡單陪玩</span>
                </li>
                <li>
                  <span className="label">Home Visit 60 分鐘</span>
                  <span className="amount">$240</span>
                  <span className="note">以上服務 + 更多陪伴時間</span>
                </li>
              </ul>
            )}

            <div className="extras">
              <h3 className="section-kicker" style={{ marginBottom: '0.25rem' }}>
                Extra
              </h3>
              <div className="extras-row">
                <span>修剪指甲</span>
                <span>+$50</span>
              </div>
              <div className="extras-row">
                <span>餵口服藥</span>
                <span>+$30</span>
              </div>
              <div className="extras-row">
                <span>皮下水注射（需自備藥品）</span>
                <span>+$80</span>
              </div>
            </div>

            <ul className="notes">
              <li>第 2 隻寵物 +$30–50；第 3 隻或以上另議</li>
              <li>大型犬（&gt;20kg）+$30–50</li>
              <li>公眾假期 +$50／次</li>
              <li>偏遠地區（離島／偏遠新界）視乎交通另議</li>
              <li>餵藥／特別護理 +$20–50</li>
            </ul>
          </Reveal>
        </section>

        <section className="promise" aria-label="服務承諾">
          <Reveal>
            <div className="promise-inner">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <p className="section-kicker">Why 90s</p>
                <h2>親切可靠，有溫度嘅照顧</h2>
                <p>唔止完成任務，而係認真對待每一位毛孩嘅性格同習慣。</p>
              </div>
              <ul className="promise-list">
                <li>
                  <strong>每次即時報告</strong>
                  <span>服務後即時影相／短片，等你可以放心返工或者出埠。</span>
                </li>
                <li>
                  <strong>先見面再服務</strong>
                  <span>首次服務前可安排免費／優惠見面，認識毛孩同屋企環境。</span>
                </li>
                <li>
                  <strong>香港全區上門</strong>
                  <span>港島、九龍、新界主要地區一般交通費已包含。</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </section>

        <section id="gallery" className="section">
          <Reveal>
            <div className="section-head">
              <p className="section-kicker">Moments</p>
              <h2>真實照顧瞬間</h2>
              <p>來自日常服務同毛孩相處嘅真實相片，見證每一段陪伴。</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="gallery">
              {galleryPhotos.map((photo) => (
                <figure key={photo.src}>
                  <img
                    src={`${import.meta.env.BASE_URL}photos/${photo.src}`}
                    alt={photo.alt}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="contact" className="section contact">
          <Reveal>
            <div className="section-head">
              <p className="section-kicker">Book</p>
              <h2>想預約？直接 DM</h2>
              <p>
                告訴我毛孩品種、住邊區、需要咩服務同時間，我會盡快覆你安排。
              </p>
            </div>
            <div className="cta-row">
              <a className="btn btn-primary" href={IG_URL} target="_blank" rel="noreferrer">
                去 Instagram 預約
              </a>
              <a className="btn btn-solid" href="#pricing">
                再睇一次價錢
              </a>
            </div>
            <p className="ig-handle">{IG_HANDLE}</p>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          <strong>90s Pet Sitter</strong>
          <br />
          90後年輕寵物保姆｜香港全區上門
          <br />
          {IG_HANDLE}
        </p>
      </footer>
    </>
  )
}
