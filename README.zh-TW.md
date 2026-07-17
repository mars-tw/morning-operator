# 早安店長 / Morning Operator

[English](README.md) · 繁體中文 · [日本語](docs/README.ja.md) · [Español](docs/README.es.md)

早安店長是一套可自行架設的多語 AI 營運流程，將公開健檢一路串到名單評分、付款驗簽、規格核准、隔離的 AI 建置、自動 QA、交付核准、通知、稽核與備份。

> 預設設定是示範模式，不會真實收款、寄信、連接 Shopify 或部署產物。營收與節省時間都是估算，不是保證。

## 主要能力

- 英文、繁中、日文、西文獨立網址。
- AI 建置前與正式交付前各有一道人工核准。
- 金流、Email、監控、Shopify 與 AI 都採可替換轉接介面。
- SQLite 工作佇列包含租約、重試、dead-letter 與完整稽核紀錄。
- Docker 同時啟動網站與背景工作者，資料寫入持久化 volume。
- 顧客姓名、電話、Email、地址與原始訂單備註不得送入 AI。

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
