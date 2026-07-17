# 部署

新部署請優先依照 [`self-hosting.md`](self-hosting.md) 使用已加固的 Docker web／worker 組合；本頁保留非容器部署摘要。

本機 SQLite 版需要持久磁碟與長駐 worker，不適合把資料庫直接放在純 serverless 檔案系統。

## 第一個正式環境

- 一台受信任的 Linux 主機或支援 persistent disk 的平台。
- Web：`pnpm start`。
- Worker：`pnpm worker`。
- 每日摘要：排程 `pnpm digest`，再由 worker 處理。
- 每日備份：排程 `pnpm backup`，並將備份複製到另一個受控儲存位置。
- 健康檢查：`GET /api/health`。
- TLS 由反向代理或平台提供。

## 上線前閘門

1. 將 `ADMIN_PASSWORD` 與 `ADMIN_SESSION_SECRET` 換成強密碼／隨機秘密。
2. 設定正式網域、營業人名稱、統一編號、隱私告知與服務條款。
3. 設定金流、寄信網域、Sentry 與備份目的地。
4. 執行 `pnpm verify && pnpm test:e2e`。
5. 用測試模式完成付款重送、規格批准、建置、QA 與部署批准。
6. 確認 production 無法存取 mock payment route。

Vercel 可用於展示公開頁或 preview；本版本若要整套放上 Vercel，先把 SQLite repository 遷移到 PostgreSQL，並將 worker 移到可長駐的工作執行環境。
