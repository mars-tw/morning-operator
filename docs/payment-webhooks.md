# 金流啟用與 Webhook

## 已實作

- 開發用 mock payment：只在非 production 且負責人已登入時可用。
- Lemon Squeezy `order_created`：以原始 request body 計算 HMAC SHA-256，使用 `X-Signature` timing-safe 比對。
- 綠界 ECPay AIO：建立簽章結帳表單、保存本機付款嘗試、驗證完整 `CheckMacValue`、`MerchantID`、商戶訂單、lead、固定報價與幣別，再以綠界 `TradeNo` 冪等入帳。
- 每個 provider event ID 只能建立一筆付款與一個專案；低付、錯幣、錯 lead、錯商戶訂單或無效簽章都不會建立專案。
- 無效簽章只保存 payload SHA-256 雜湊，不保存完整付款內容或金流密鑰。

## 正式啟用 Lemon Squeezy

1. 完成商家與銀行身分驗證。
2. 依目標市場建立商品或 checkout；價格與 ISO 4217 幣別分別設定於 `NEXT_PUBLIC_OFFER_SETUP_MINOR` 與 `NEXT_PUBLIC_OFFER_CURRENCY`。
3. 使用 checkout URL 的動態欄位把本系統 lead ID 放入 `custom_data.lead_id`；公開按鈕支援以 `{leadId}` 代入。
4. 將 webhook URL 設為 `https://<domain>/api/webhooks/payments/lemon-squeezy`，只訂閱需要的事件。
5. 將 signing secret 放進主機秘密管理，不得寫入 Git。
6. 先在 provider test mode 驗證簽章、固定報價與重送事件只建立一個專案。

## 正式啟用綠界 ECPay

1. 完成商家 KYC、銀行帳戶與付款方式申請。
2. 將公開報價改為新台幣整數，設定 `NEXT_PUBLIC_OFFER_CURRENCY=TWD`。
3. 將 `NEXT_PUBLIC_CHECKOUT_URL` 設為 `/api/payments/ecpay/checkout?leadId={leadId}`。
4. 在秘密管理設定 `ECPAY_MERCHANT_ID`、`ECPAY_HASH_KEY`、`ECPAY_HASH_IV`；測試期使用 `ECPAY_ENVIRONMENT=stage`。
5. `AUTOPILOT_BASE_URL` 必須是外部可連線的 HTTPS 網址。系統會自行產生 `ReturnURL=/api/webhooks/payments/ecpay`。
6. 完成有效簽章、竄改簽章、低付、錯商戶、重送、`SimulatePaid=1` 與正式小額交易測試後，經負責人核准才切換 `ECPAY_ENVIRONMENT=production`。

綠界要求 `MerchantTradeNo` 不得重複；系統會把每次建立的商戶訂單寫入 `payment_attempts`。回呼雖然也帶 `CustomField1`，仍必須與該筆付款嘗試的 lead、金額及幣別一致。前端返回頁不是付款證明，只有通過背景回呼驗證才會入帳。

台灣其他金流與開源編排方案的完整比較、接入順序及安全條件，見 [台灣與開源金流接入](taiwan-payments.md)。
