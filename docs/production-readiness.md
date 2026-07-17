# 全球公開服務：Production readiness

## 現況結論

目前可作為**單一營運者、單一主機、低流量**的 self-hosted MVP。容器包具備 web/worker 分離、非 root、唯讀根檔案系統、SQLite volume、健康檢查、簽章金流入口、核准閘門與一致性備份。

它尚未達到全球多租戶 SaaS、高可用或無人監管營運的標準。以下 P0 全部完成前，不應對全球使用者宣稱正式可用、保證收入或 24/7 可用。

## P0：公開上線前阻擋項

| 領域 | 必要條件 | 驗收證據 |
| --- | --- | --- |
| 網路 | DNS、TLS、HSTS、反向代理 body/timeout/rate limit | 外網 TLS 掃描與 webhook 測試 |
| Secrets | 管理、session、金流、Email 金鑰存於外部 secret store；完成輪替程序 | 無 secret 進 Git/image/Compose config |
| 身分 | 後台再加 MFA／SSO 或 VPN/Zero Trust 存取 | 未授權與暴力登入測試 |
| 金流 | 商家 KYC、退款/爭議流程、sandbox 訂單、webhook 重送與冪等 | 測試付款至專案建立的稽核紀錄 |
| 資料 | 隱私政策、服務條款、保存期限、刪除/匯出流程、DPA | 法務核准與資料生命週期演練 |
| 區域 | 目標國家的稅、電子發票、消保、退款及行銷同意 | 各銷售地區合規簽核 |
| 國際化 | 語系、時區、幣別、Email template、無障礙 | 四個 locale 的 E2E；多幣別最小單位資料模型 |
| 備援 | 每日加密異地備份、保留政策、還原 runbook | 全新主機還原演練及時間紀錄 |
| 監控 | uptime、錯誤追蹤、磁碟、job dead-letter、備份新鮮度警報 | 告警送達值班者的演練 |
| AI 執行 | 生產 worker 的 CLI/認證/網路政策與隔離環境 | 已批准規格的沙箱建置測試，無 secrets 外洩 |
| 供應鏈 | 鎖定 base image digest、SBOM、依賴與 image 漏洞掃描、映像簽章 | CI artifact 與 release provenance |
| 容量 | 預期流量、DB 大小、job latency、Email rate limit 的負載測試 | 基準報告與停止擴張門檻 |

## 建議服務目標

第一階段只作為內部目標，不對外承諾：

- Web 可用性：每月 99.5%。
- API p95：低流量下 750 ms 內，不含外部 provider。
- Job queue：95% 的 ready jobs 在 5 分鐘內開始。
- RPO：24 小時；RTO：4 小時。
- Critical security incident：15 分鐘內通知營運者並停止付款／worker 入口。

必須先累積至少 30 天監控數據，才考慮寫入付費 SLA。

## 資料與威脅邊界

- 公開 intake、webhook、Email、店舖輸入皆為不可信資料。
- 不得把任何連接平台中的顧客、客戶、病患、學員、房客或員工姓名、Email、電話、地址、付款內容、機密備註或原始紀錄傳給 AI；優先使用聚合資料與 metadata。
- 不把 Docker socket、主機檔案系統、Codex home/auth 或雲端長效金鑰掛入容器。
- 管理核准不等於 provider 端退款、部署或大量寄信授權；高風險動作仍需獨立稽核紀錄。
- 健康 endpoint 不應回傳 secrets、資料列或內部錯誤堆疊。
- 外部備份需加密、限制服務帳號權限、測試刪除與到期政策。

## 單機容量與遷移觸發點

SQLite 版本固定一個 web、一個 worker。出現以下任一情況，就停止增加流量並開始 PostgreSQL／queue 遷移：

- 持續出現 `SQLITE_BUSY` 或 5 秒 busy timeout。
- DB 或 WAL 增長速度超出每日備份窗口。
- ready job p95 等候超過 5 分鐘。
- 單機 CPU/記憶體/磁碟連續 15 分鐘超過 70%。
- 需要兩個以上 worker、零停機部署、跨區容錯或多租戶資料隔離。

遷移順序應是：PostgreSQL source of truth → 受管 queue → object storage artifacts → stateless web → 多副本 worker。不要直接把 SQLite volume 放進共享 NFS。

## 分階段全球發布

1. **內部 preview**：mock AI、測試付款、合成資料，完成容器與還原測試。
2. **封閉試用**：只選一種產業包、1–3 個授權測試專案與單一幣別，人工監看每個核准與通知。
3. **單區正式版**：完成該地金流、稅務、隱私、客服及告警，限制每日新客數。
4. **第二市場**：一次增加一種語言／幣別／法域，重新做付款與內容 E2E。
5. **全球平台**：完成多租戶資料模型、PostgreSQL/queue、HA、區域資料政策與正式 SRE 值班。

## 每次 release 的證據

```text
pnpm typecheck
pnpm test
pnpm build
pnpm smoke
pnpm restore-check
pnpm test:e2e
docker compose config --quiet
docker build --target web .
docker build --target worker .
```

發布記錄要保存 Git SHA、image digest、SBOM、漏洞掃描、資料庫備份 ID、操作者、核准紀錄、部署時間與回滾結果。任何一步無證據，就維持在上一個發布階段。
