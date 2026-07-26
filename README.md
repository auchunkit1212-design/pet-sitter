# Fuwahm

專屬寵物保姆網站｜毛茸茸（Fuwa）× 溫暖嘅家（hm）

功能：
- 分欄：主頁／關於／服務／價錢／預約付款
- 預約日曆揀時段 → Stripe 線上付款
- WhatsApp：`60391631`
- Instagram：[@Fuwahm.petsitter](https://www.instagram.com/fuwahm.petsitter/)

## 本機開發

```bash
npm install
cp .env.example .env
npm run dev
```

- 前端：http://localhost:5173/pet-sitter/
- API：http://localhost:8787

未設定 `STRIPE_SECRET_KEY` 時會以 **Demo 模式**運行。

## 接上真實 Stripe

1. 到 [Stripe Dashboard](https://dashboard.stripe.com/) 建立帳戶
2. 複製 Secret Key 到 `.env` 的 `STRIPE_SECRET_KEY`
3. Webhook 指到 `https://你的API網域/api/webhook`，事件選 `checkout.session.completed`
4. 重啟 `npm run start:api`

## 部署

### 前端（GitHub Pages）

`https://auchunkit1212-design.github.io/pet-sitter/`

### 後端 API（Stripe 必須）

建議用 **Railway** 部署 `server/`：

- Start：`npm run start:api`
- 環境變數：`STRIPE_SECRET_KEY`、`STRIPE_WEBHOOK_SECRET`、`CLIENT_URL`
- 前端建置加：`VITE_API_URL=https://你的API網域`

## 聯絡

- WhatsApp：[60391631](https://wa.me/85260391631)
- Instagram：[@Fuwahm.petsitter](https://www.instagram.com/fuwahm.petsitter/)
