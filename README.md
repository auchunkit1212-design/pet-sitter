# Fuwahm

專屬寵物保姆網站｜毛茸茸（Fuwa）× 溫暖嘅家（hm）

功能：
- 分欄：主頁／關於／服務／價錢／預約／守則
- 預約日曆揀時段 → **WhatsApp 確認檔期同付款**
- 服務守則與免責條款
- WhatsApp：`60391631`
- Instagram：[@Fuwahm.petsitter](https://www.instagram.com/fuwahm.petsitter/)

## 本機開發

```bash
npm install
npm run dev
```

前端：http://localhost:5173/

> 預約流程已改為 WhatsApp，唔再依賴 Stripe。`server/` 可留作日後需要。

## 部署到 Netlify

1. Link 呢個 GitHub repo（`main`）
2. Build：`npm run build`｜Publish：`dist`（見 `netlify.toml`）
3. Deploy 後確認 file browser 有 `index.html`、`assets/`、`photos/`

## 聯絡

- WhatsApp：[60391631](https://wa.me/85260391631)
- Instagram：[@Fuwahm.petsitter](https://www.instagram.com/fuwahm.petsitter/)
