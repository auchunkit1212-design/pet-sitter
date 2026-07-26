import { Reveal } from './Reveal'
import { IG_HANDLE, IG_URL, WHATSAPP_URL } from '../lib/catalog'

const highlights = [
  {
    title: 'Fuwa = 毛茸茸',
    body: '代表住毛茸茸（Fuwafuwa）嘅可愛毛孩，每一次照顧都帶住溫柔同耐性。',
  },
  {
    title: 'hm = Home',
    body: '代表溫暖嘅家。當你去旅行或公幹，寶貝依然留喺最熟悉、最安心嘅環境。',
  },
  {
    title: '透明可靠',
    body: '明白交鎖匙同毛孩需要信任。我承諾會當成自己寶貝，每次即時相片／短片匯報。',
  },
]

export function TeamSection() {
  return (
    <section id="about" className="section">
      <Reveal>
        <div className="section-head">
          <p className="section-kicker">About</p>
          <h2>歡迎來到 Fuwahm</h2>
          <p>
            大家好！我係 {IG_HANDLE}。成立 Fuwahm，希望你出門時，毛孩仍然可以留喺屋企安心生活，免受轉換環境嘅驚嚇。
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="about-story">
          <div className="about-lead">
            <div className="team-avatar" aria-hidden="true">
              F
            </div>
            <div>
              <h3>你的專屬寵物保姆</h3>
              <p className="team-role">Fuwahm Pet Sitter</p>
              <p>
                我明白要將屋企鎖匙同最愛嘅毛孩交託俾人，需要建立好大嘅信任。首次服務前，我非常樂意先安排一個簡單見面，等我同毛孩互相認識一下，令你更加放心。
              </p>
              <div className="cta-row" style={{ marginTop: '1rem' }}>
                <a className="btn btn-solid" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                  WhatsApp 查詢
                </a>
                <a className="btn btn-ghost contact-ghost" href={IG_URL} target="_blank" rel="noreferrer">
                  Instagram DM
                </a>
              </div>
            </div>
          </div>

          <div className="team-grid about-points">
            {highlights.map((item) => (
              <article key={item.title} className="team-member">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
