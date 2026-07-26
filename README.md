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

- 前端：http://localhost:5173/
- API：http://localhost:8787

未設定 `STRIPE_SECRET_KEY` 時為 **Demo 模式**。

## 部署到 Netlify（建議）

你而家有 Netlify website 的話，直接用得：

1. Netlify → Site configuration → **Link repository** 到呢個 GitHub repo  
   （或者 Add new site → Import existing project）
2. Build settings 會讀 `netlify.toml`：
   - Build command：`npm run build`
   - Publish directory：`dist`
3. 加 Environment variables：
   - `CLIENT_URL` = 你嘅 Netlify 網址（例如 `https://xxxx.netlify.app`）
   - `STRIPE_SECRET_KEY` = Stripe key（正式收款先要）
   - `STRIPE_WEBHOOK_SECRET` = webhook secret（建議）
4. Deploy 之後：
   - 網站同 `/api/*`（預約／Stripe）都喺同一個 Netlify site
   - Stripe webhook URL：`https://你的網域/api/webhook`

本機亦可用 Netlify CLI：

```bash
npx netlify dev
```

## GitHub Pages（可選）

仍然支援，但 **Stripe API 唔會跟住去 Pages**。Pages 只係前端。  
若用 Pages，API 要另外部署，並設定 `VITE_API_URL`。

## 聯絡

- WhatsApp：[60391631](https://wa.me/85260391631)
- Instagram：[@Fuwahm.petsitter](https://www.instagram.com/fuwahm.petsitter/)
