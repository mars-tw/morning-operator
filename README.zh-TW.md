# 早安店長 / Morning Operator

[English](README.md) · 繁體中文 · [日本語](docs/README.ja.md) · [Español](docs/README.es.md)

早安店長是一套可自行架設、供多產業重複作業使用的多語 AI 自動化服務工廠。它把公開流程健檢一路串到產業包選擇、風險與適配評分、付款驗簽、規格核准、隔離的 AI 建置、自動 QA、交付核准、通知、稽核與備份。

> 預設設定是示範模式，不會真實收款、寄信、連接外部平台或部署產物。營收、回收期與節省時間都是估算，不是保證；任何產業包都不保證使用者或事業能夠獲利。

## 主要能力

- 英文、繁中、日文、西文獨立網址。
- 六種可稽核的靜態產業包：商務營運、專業服務、預約服務、創作者／教育、不動產／現場服務、後台營運。
- AI 建置前與正式交付前各有一道人工核准。
- 金流、Email、監控、業務平台與 AI 都採可替換轉接介面，維持供應商中立。
- SQLite 工作佇列包含租約、重試、dead-letter 與完整稽核紀錄。
- Docker 同時啟動網站與背景工作者，資料寫入持久化 volume。
- 涉及金流、退款、資格、醫療、聘僱、住房、安全認證或不可逆變更時，必須拒絕自動執行或交由人工核准。
- 不得把不必要的顧客、客戶、病患、學員、房客或員工個資送入 AI。

每個產業包都明列支援目標、自動化覆蓋率估計範圍、衡量指標、核准要求與禁止用途。擴充前請閱讀[產業包規格](docs/industry-packs.md)。

## 本機啟動

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm seed
pnpm dev
```

另一個終端執行：

```powershell
pnpm worker
```

瀏覽 `http://localhost:3000/zh-TW`。正式部署前請閱讀[自架手冊](docs/self-hosting.md)與[上線檢查](docs/production-readiness.md)。

## 驗證

```powershell
pnpm verify
pnpm test:e2e
```

專案採 Apache-2.0 授權。參與開發請閱讀[貢獻指南](CONTRIBUTING.md)，安全問題請依[安全政策](SECURITY.md)私下通報。
