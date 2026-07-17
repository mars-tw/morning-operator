# 需要負責人完成的外部啟用

軟體已可用 mock adapters 跑完整流程。以下事項涉及身分、銀行、稅務、網域或對外權限，必須由負責人完成。

| 項目 | 必要資料／動作 | 完成後填入 |
|---|---|---|
| 稅籍與發票 | 依實際營運與銷售地區確認網路勞務、網站揭露、稅與發票方式 | 正式網站頁尾與會計流程 |
| 收款 | 目標市場可用的金流 KYC、銀行帳號、幣別與測試商品 | `NEXT_PUBLIC_CHECKOUT_URL`、價格／幣別、webhook secret |
| 寄信 | 驗證寄件網域、建立 API key | `RESEND_API_KEY`、`OPERATOR_FROM_EMAIL` |
| 網域 | 購買網域、設定 DNS 與 TLS | `AUTOPILOT_BASE_URL` |
| 管理登入 | 產生強密碼與至少 32 字元 session secret | `ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET` |
| 監控 | 建立錯誤監控專案 | `SENTRY_DSN` |
| Shopify | 客戶逐店授權必要唯讀 scope | 每個已批准專案的秘密管理 |
| 通知通路 | Email 為基準；LINE OA 或其他當地通路由客戶提供授權 | 客戶專案秘密管理 |
| 正式 AI | 確認 Codex CLI／API 計費與受信任執行主機 | `AUTOPILOT_AI_MODE=codex` |

不得把任何實際值貼進 issue、聊天紀錄、資料庫規格、`AGENTS.md` 或 Git。
