# 貢獻指南 / Contributing Guide

感謝你協助改善「早安店長」。我們歡迎全球使用者以繁體中文或英文提交問題、文件、翻譯、測試與程式碼貢獻。

Thank you for improving 早安店長. Issues, documentation, translations, tests, and code contributions are welcome in Traditional Chinese or English.

參與本專案即代表你同意遵守 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。安全漏洞請依 [SECURITY.md](SECURITY.md) 私下通報，不要建立公開 Issue。

## 開始之前 / Before you start

1. 先搜尋現有 Issue 與 Pull Request，避免重複工作。
2. 錯誤修正可以直接提出 PR；較大功能或架構變更請先開 Feature Request 討論範圍。
3. 不要在 Issue、測試資料、截圖、日誌或提交中加入真實客戶資料、商店憑證、API 金鑰、付款資料或其他秘密。
4. 收益與節省時間的描述必須標示為估計，不得承諾結果。

## 本機開發 / Local development

需求：Node.js 24 或相容版本，以及 pnpm。

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm seed
pnpm dev
```

工作佇列可在另一個終端執行：

```powershell
pnpm worker:once
```

`.env.local`、資料庫、生成工作區及任何憑證不得提交至版本控制。

## 分支與提交 / Branches and commits

- 從最新預設分支建立短期分支。
- 每個 PR 聚焦一個問題，避免混入無關格式化或重構。
- 使用清楚的祈使句提交訊息，例如 `fix: reject duplicate payment events`。
- 如修改行為，請同步更新相關測試與文件。
- 保留現有安全閘門：付款驗簽、事件冪等、規格核准、部署核准與 Codex 沙箱不得繞過。

## 驗證 / Verification

提交 PR 前請執行：

```powershell
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
pnpm restore-check
```

若變更使用者流程，再執行：

```powershell
pnpm test:e2e
```

PR 說明應列出實際執行的檢查；無法執行者請說明原因。

## 全球化與可及性 / Internationalization and accessibility

- 公開介面以英文為 fallback，並維持繁中、日文與西文。新增使用者可見文字時，必須同步四個字典，且不得把地區、時區、幣別或日期格式寫死在商業邏輯中。
- 翻譯應保留原意，不誇大收益、準確度或自動化能力。
- 互動元件需支援鍵盤操作、可辨識焦點、合理的對比與輔助技術標籤。
- 新增語系時，請附語言、地區、時區及至少一條主要流程的測試證據。

## 產業包審查 / Industry-pack review

產業包不是可執行的遠端外掛，而是版本化、靜態且可稽核的工作流程合約。新增或調整產業包時：

1. 必須定義穩定 ID、版本、支援目標、自動化覆蓋率估計範圍、指標、必要核准、禁止動作與安全輸入範例。
2. 必須說明對此產業的實際用例、資料最小化方式、風險等級與人工接管路徑。
3. 不得以「所有產業都適用」、「全自動獲利」或未經驗證的節省時間數字當作驗收依據。
4. 金流、退款、法律或醫療建議、住房或聘僱資格、安全認證、銀行轉帳、資料刪除與未審閱對外承諾不可成為自動執行的成功路徑。
5. 請同時更新四語文案、登錄表驗證、風險分級、估算範圍測試與 [產業包文件](docs/industry-packs.md)。

Industry packs are versioned, static workflow contracts—not executable remote plugins. Keep the application provider-neutral and ensure the complete mock path still works without third-party credentials.

## Pull Request 審查

維護者會檢查正確性、安全性、隱私、測試、操作風險與專案範圍。所有檢查通過不保證合併；維護者可能要求縮小範圍或提出替代方案。貢獻一經提交，視為依本專案的 Apache-2.0 授權提供。
