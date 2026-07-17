# 金流啟用與 Webhook

## 已實作

- 開發用 mock payment：只在非 production 且負責人已登入時可用。
- Lemon Squeezy `order_created`：以原始 request body 計算 HMAC SHA-256，使用 `X-Signature` timing-safe 比對。
- 每個 provider event ID 只能建立一筆付款與一個專案。
- 無效簽章保存 payload SHA-256 雜湊，不保存或輸出金流密鑰。

## 正式啟用 Lemon Squeezy

1. 完成商家與銀行身分驗證。
2. 依目標市場建立商品或 checkout；價格與 ISO 4217 幣別分別設定於 `NEXT_PUBLIC_OFFER_SETUP_MINOR` 與 `NEXT_PUBLIC_OFFER_CURRENCY`，並將本系統 lead ID 放入 `custom_data.lead_id`。
3. 將 webhook URL 設為 `https://<domain>/api/webhooks/payments/lemon-squeezy`。
4. 只訂閱需要的 `order_created` 等事件。
5. 將 signing secret 放進主機秘密管理，不得寫入 Git。
6. 先在 provider test mode 驗證幣別與最小貨幣單位金額正確，且重送事件只建立一個專案。

其他市場可以新增當地 provider adapter，但必須依供應商當時官方規格完成簽章、交易狀態、退款、爭議款與稅務流程；在商家帳號與測試憑證尚未提供前，不以假 adapter 冒充可收款。台灣部署可另外實作綠界等本地金流。
