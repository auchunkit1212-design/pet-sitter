import { Reveal } from './Reveal'

const team = [
  {
    name: 'Kit',
    initials: 'K',
    role: '創辦人｜首席寵物保姆',
    bio: '90後，專心做好上門照顧。放狗、餵食、陪伴都親力親為，把每位毛孩當自己寶貝。',
  },
  {
    name: '90s Crew',
    initials: '90',
    role: '上門夥伴保姆',
    bio: '一班年輕、有耐性嘅夥伴保姆，熟悉貓狗日常護理，按預約時段覆蓋全港主要地區。',
  },
  {
    name: 'Care Desk',
    initials: 'C',
    role: '預約同客戶聯絡',
    bio: '幫忙確認時段、付款同服務後報告。有突發狀況可以 WhatsApp 即時搵我哋。',
  },
]

export function TeamSection() {
  return (
    <section id="team" className="section">
      <Reveal>
        <div className="section-head">
          <p className="section-kicker">Team</p>
          <h2>認識 90s Pet Sitter 團隊</h2>
          <p>
            親切可靠嘅 90 後年輕寵物保姆團隊。你喺上面揀好時段付款後，我們會安排最適合嘅保姆上門。
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="team-grid">
          {team.map((member) => (
            <article key={member.name} className="team-member">
              <div className="team-avatar" aria-hidden="true">
                {member.initials}
              </div>
              <div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
