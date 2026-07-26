import { Reveal } from './Reveal'

const sections = [
  {
    title: '1. 毛孩健康與緊急醫療',
    items: [
      {
        label: '如實申報',
        text: '主人必須於預約時如實申報毛孩嘅健康狀況、病史及傳染病。如因隱瞞病情而發生意外，保姆恕不負責。',
      },
      {
        label: '緊急情況',
        text: '服務期間如毛孩突發不適，保姆會第一時間聯絡主人。若未能聯絡上，保姆有權將毛孩送往最近之 24 小時獸醫診所，所有醫療及交通費用須由主人全數承擔。',
      },
      {
        label: '消耗品自理',
        text: '主人需準備足夠嘅糧食、貓砂、尿墊及藥物。如需保姆代購，將實報實銷並加收 $50 跑腿費。',
      },
    ],
  },
  {
    title: '2. 行為及安全問題',
    items: [
      {
        label: '攻擊性行為',
        text: '若毛孩表現出嚴重攻擊性，危及保姆人身安全，保姆有權立即中止服務，已繳費用將不獲退還。建議主人預先安排親友作為緊急聯絡人接手照顧。',
      },
      {
        label: '家居安全（防走失）',
        text: '請確保家中已安裝穩固嘅窗網，出入門口需有安全閘。如因家居設施不足導致毛孩走失或受傷，保姆未能承擔相關責任。',
      },
      {
        label: '放狗安全',
        text: '散步期間必須配戴牽引繩（狗帶），保姆絕不接受「放養式」或「無繩散步」要求。',
      },
    ],
  },
  {
    title: '3. 家居財物與私隱',
    items: [
      {
        label: '劃定活動範圍',
        text: '保姆只會進入事前協議好嘅區域（如客廳、廚房）。請主人預先將貴重物品妥善鎖好。',
      },
      {
        label: '破壞免責',
        text: '如毛孩於保姆不在場期間，或因其自身行為引致家居物品損壞，保姆概不負責。',
      },
    ],
  },
  {
    title: '4. 惡劣天氣安排',
    items: [
      {
        label: '黑雨／8 號或以上風球',
        text: '為保障安全，上門服務及放狗服務將視乎實際天氣情況延期或取消。如遇突發惡劣天氣，保姆會同主人協商最安全嘅替代方案。',
      },
    ],
  },
]

export function TermsSection() {
  return (
    <section id="terms" className="section">
      <Reveal>
        <div className="section-head">
          <p className="section-kicker">Terms</p>
          <h2>Fuwahm 服務守則與免責條款</h2>
          <p>預約前請細閱以下守則。提交預約即表示你已閱讀並同意相關條款。</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="terms-list">
          {sections.map((section) => (
            <article key={section.title} className="terms-block">
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}：</strong>
                    {item.text}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
