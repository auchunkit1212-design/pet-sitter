# 90s Pet Sitter

90後年輕寵物保姆網站｜全港上門放狗、放貓、餵食、陪伴。

功能：
- 分欄：主頁／服務／價錢／團隊／預約付款
- 預約日曆揀時段 → Stripe 線上付款
- WhatsApp：`60391631`
- Instagram：[@90s.petsitter](https://www.instagram.com/90s.petsitter/)

## 本機開發

```bash
npm install
cp .env.example .env
npm run dev
```

- 前端：http://localhost:5173/pet-sitter/
- API：http://localhost:8787

未設定 `STRIPE_SECRET_KEY` 時會以 **Demo 模式**運行：揀完時段後直接當作已付款成功（方便測試流程）。

## 接上真實 Stripe

1. 到 [Stripe Dashboard](https://dashboard.stripe.com/) 建立帳戶
2. 複製 test/live Secret Key 到 `.env` 的 `STRIPE_SECRET_KEY`
3. （建議）設定 webhook 指到 `https://你的API網域/api/webhook`，事件選 `checkout.session.completed`
4. 重啟 `npm run dev` 或 `npm run start:api`

付款幣別為 **HKD**，金額按網站價錢表計算。

## 建置

```bash
npm run build
npm run preview
```

## 部署

### 前端（GitHub Pages）

合併到 `main` 後由 GitHub Actions 部署：  
`https://auchunkit1212-design.github.io/pet-sitter/`

Repo Settings → Pages → Source 選 **GitHub Actions**。

### 後端 API（必須，先有 Stripe 付款）

把 `server/` 部署到 Railway／Render／Fly.io 等，設定環境變數：

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLIENT_URL=https://auchunkit1212-design.github.io/pet-sitter`
- `PORT`

前端建置時加上：

```bash
VITE_API_URL=https://你的API網域
```

## 聯絡

- WhatsApp：[60391631](https://wa.me/85260391631)
- Instagram：[@90s.petsitter](https://www.instagram.com/90s.petsitter/)
