import { useEffect, useState } from 'react'
import './App.css'
import { BookingPanel } from './components/BookingPanel'
import { Reveal } from './components/Reveal'
import { TeamSection } from './components/TeamSection'
import { BRAND, IG_HANDLE, IG_URL, WHATSAPP_URL } from './lib/catalog'

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

type PageTab = 'home' | 'about' | 'services' | 'pricing' | 'booking'

const tabs: Array<{ id: PageTab; label: string; href: string }> = [
  { id: 'home', label: '主頁', href: '#top' },
  { id: 'about', label: '關於', href: '#about' },
  { id: 'services', label: '服務', href: '#services' },
  { id: 'pricing', label: '價錢', href: '#pricing' },
  { id: 'booking', label: '預約付款', href: '#booking' },
]

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

function useActiveTab(): PageTab {
  const [active, setActive] = useState<PageTab>('home')

  useEffect(() => {
    const sectionIds: PageTab[] = ['about', 'services', 'pricing', 'booking']
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) {
          setActive(visible.target.id as PageTab)
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.15, 0.35, 0.6] },
    )

    elements.forEach((el) => observer.observe(el))

    const onScrollTop = () => {
      if (window.scrollY < 160) setActive('home')
    }
    window.addEventListener('scroll', onScrollTop, { passive: true })

    const hash = window.location.hash.replace('#', '')
    if (hash && sectionIds.includes(hash as PageTab)) setActive(hash as PageTab)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScrollTop)
    }
  }, [])

  return active
}

export default function App() {
  const scrolled = useScrolled()
  const activeTab = useActiveTab()
  const [priceTab, setPriceTab] = useState<'walk' | 'visit'>('walk')

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
        <a className="brand-mark" href="#top">
          {BRAND}
        </a>
        <nav className="nav-links" aria-label="主要分欄">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={tab.href}
              className={activeTab === tab.id ? 'is-active' : undefined}
            >
              {tab.label}
            </a>
          ))}
          <a className="nav-cta" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-label="品牌介紹">
          <div className="hero-media">
            <img
              src={`${import.meta.env.BASE_URL}photos/pet-09.jpg`}
              alt="Fuwahm 居家寵物照顧"
            />
            <div className="hero-overlay" />
          </div>
          <div className="hero-content">
            <h1 className="hero-brand">
              Fuwahm
              <span>專屬寵物保姆</span>
            </h1>
            <p className="hero-line">留喺最熟悉嘅家，安心被照顧</p>
            <p className="hero-sub">
              Fuwa 代表毛茸茸毛孩，hm 代表溫暖嘅家。全港主要地區上門｜線上揀時段 Stripe 付款，亦可 WhatsApp／IG DM。
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#booking">
                線上預約並付款
              </a>
              <a className="btn btn-ghost" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                WhatsApp 60391631
              </a>
            </div>
          </div>
        </section>

        <div className="section-tabs" aria-label="內容分欄捷徑">
          {tabs
            .filter((t) => t.id !== 'home')
            .map((tab) => (
              <a key={tab.id} href={tab.href} className={activeTab === tab.id ? 'is-active' : undefined}>
                {tab.label}
              </a>
            ))}
        </div>

        <TeamSection />

        <section id="services" className="section">
          <Reveal>
            <div className="section-head">
              <p className="section-kicker">Services</p>
              <h2>Fuwahm 核心服務</h2>
              <p>
                當你需要去旅行、公幹，或者工作太忙，毛孩依然可以留喺屋企，接受透明可靠嘅上門照顧。
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="services-grid">
              <article className="service-block">
                <h3>上門照顧（貓／狗）</h3>
                <p>餵食、換水、清理貓砂／尿墊、溫馨陪玩，讓毛孩喺熟悉環境安心。</p>
                <ul className="price-list">
                  <li>
                    <span className="label">30–40 分鐘</span>
                    <span className="amount">$180</span>
                  </li>
                  <li>
                    <span className="label">60 分鐘</span>
                    <span className="amount">$240</span>
                    <span className="note">以上服務 + 更多陪伴時間</span>
                  </li>
                </ul>
              </article>

              <article className="service-block">
                <h3>放狗服務</h3>
                <p>30 至 60 分鐘安全散步放電，帶毛孩出門活動後即時匯報。</p>
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
            </div>

            <div className="service-extra-block">
              <h3>特別護理</h3>
              <p>餵口服藥、剪指甲、皮下水注射（視乎情況評估）。預約時可加購，亦可先 WhatsApp 傾清楚。</p>
            </div>
          </Reveal>
        </section>

        <section id="pricing" className="section">
          <Reveal>
            <div className="section-head">
              <p className="section-kicker">Pricing</p>
              <h2>詳細收費</h2>
              <p>服務範圍：全港主要地區。費用已包一般交通費；額外同特別護理可喺預約時一併加購。</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="tabs" role="tablist" aria-label="價錢類別">
              <button
                type="button"
                role="tab"
                aria-selected={priceTab === 'visit'}
                className={`tab${priceTab === 'visit' ? ' is-active' : ''}`}
                onClick={() => setPriceTab('visit')}
              >
                上門照顧
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={priceTab === 'walk'}
                className={`tab${priceTab === 'walk' ? ' is-active' : ''}`}
                onClick={() => setPriceTab('walk')}
              >
                放狗服務
              </button>
            </div>

            {priceTab === 'walk' ? (
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
                  <span className="note">餵食、換水、清理貓砂／尿墊、溫馨陪玩</span>
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
                Special Care
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
                <span>皮下水注射（需自備藥品／視乎評估）</span>
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

            <div className="cta-row" style={{ marginTop: '1.75rem' }}>
              <a className="btn btn-primary" href="#booking">
                去預約日曆付款
              </a>
            </div>
          </Reveal>
        </section>

        <section className="promise" aria-label="安心保證">
          <Reveal>
            <div className="promise-inner">
              <div className="section-head" style={{ marginBottom: 0 }}>
                <p className="section-kicker">Promise</p>
                <h2>安心保證</h2>
                <p>透明、可靠，把你嘅毛孩當成自己寶貝一樣看待。</p>
              </div>
              <ul className="promise-list">
                <li>
                  <strong>即時相片短片匯報</strong>
                  <span>每次上門均會即時提供相片及短片，等你隨時掌握毛孩狀態。</span>
                </li>
                <li>
                  <strong>首次可先見面</strong>
                  <span>服務前可安排簡單見面，等保姆同毛孩互相認識，令你更加放心。</span>
                </li>
                <li>
                  <strong>全港主要地區</strong>
                  <span>WhatsApp 60391631 或 Instagram {IG_HANDLE} 查詢檔期。</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </section>

        <section id="booking" className="section booking-section">
          <Reveal>
            <div className="section-head">
              <p className="section-kicker">Book & Pay</p>
              <h2>預約日曆：揀時段，即刻俾錢</h2>
              <p>
                揀服務 → 揀日期同時間 → 填資料 → Stripe 付款。付款成功即鎖定時段。
              </p>
            </div>
          </Reveal>
          <Reveal>
            <BookingPanel />
          </Reveal>
        </section>

        <section id="gallery" className="section">
          <Reveal>
            <div className="section-head">
              <p className="section-kicker">Moments</p>
              <h2>毛孩喺屋企嘅安心時光</h2>
              <p>真實照顧瞬間，見證 Fuwahm 點樣陪伴每一位寶貝。</p>
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
              <p className="section-kicker">Contact</p>
              <h2>準備出門？隨時查詢檔期</h2>
              <p>歡迎 DM／WhatsApp 查詢及索取詳細收費表。有特別護理需要都可以先傾。</p>
            </div>
            <div className="cta-row">
              <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                WhatsApp 60391631
              </a>
              <a className="btn btn-solid" href={IG_URL} target="_blank" rel="noreferrer">
                Instagram {IG_HANDLE}
              </a>
              <a className="btn btn-ghost contact-ghost" href="#booking">
                返回線上預約
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          <strong>Fuwahm</strong>
          <br />
          專屬寵物保姆｜毛茸茸 × 溫暖嘅家
          <br />
          WhatsApp 60391631｜{IG_HANDLE}
        </p>
      </footer>
    </>
  )
}
