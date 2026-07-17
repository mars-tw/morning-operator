# Self-hosting 早安店長

這套執行包面向單一組織、單一 Linux 主機。它同時啟動 Next.js Web 與背景 worker，兩者共用 Docker named volume 內的 SQLite。預設只綁定 `127.0.0.1:3000`，正式公開服務必須放在具 TLS 的反向代理後方。

## 需求與支援邊界

- Docker Engine 26+ 與 Docker Compose v2。
- 建議 2 vCPU、2 GB RAM、20 GB SSD；建置映像時另預留至少 2 GB。
- 支援 Docker 可運行的 `amd64` 與 `arm64` Linux；原生模組會在建置階段依架構安裝。
- 公開 UI 支援英文、繁中、日文與西文；付款資料使用 ISO 4217 幣別及最小貨幣單位。部署者仍須自行完成當地稅務、隱私、付款與消費者法規工作。
- 此版本不是高可用叢集。SQLite volume 不能跨主機共享，而且 worker 固定只能有一個副本。

## 1. 在儲存庫外建立 secrets

不要把密碼、金流金鑰或 `.env` 放進 Git。以下腳本預設寫入 `$HOME/.config/autopilot-hq/secrets`：

```sh
ADMIN_PASSWORD='choose-a-unique-password' sh docker/init-secrets.sh
export AUTOPILOT_SECRETS_DIR="$HOME/.config/autopilot-hq/secrets"
```

腳本要求管理密碼至少 16 字元，並產生 256-bit session secret。若不在命令列提供 `ADMIN_PASSWORD`，腳本會隱藏輸入；這種方式可避免密碼留在 shell history。

必要的非秘密設定可放在 Compose 專案旁的 `.env`，但該檔案同樣不可提交：

```dotenv
AUTOPILOT_BASE_URL=https://autopilot.example.com
AUTOPILOT_BIND_ADDRESS=127.0.0.1
AUTOPILOT_PORT=3000
AUTOPILOT_AI_MODE=mock
NEXT_PUBLIC_CHECKOUT_URL=https://example.lemonsqueezy.com/checkout/buy/example
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_OFFER_CURRENCY=USD
NEXT_PUBLIC_OFFER_SETUP_MINOR=65000
NEXT_PUBLIC_OFFER_MONTHLY_MINOR=6500
OPERATOR_EMAIL=owner@example.com
OPERATOR_FROM_EMAIL=Autopilot HQ <notifications@example.com>
```

價格欄位使用金流供應商的最小貨幣單位，不是顯示字串。例如 USD 650.00 寫成 `65000`；部署其他幣別時必須先確認供應商與該幣別使用的 exponent，再用測試訂單核對。

`NEXT_PUBLIC_CHECKOUT_URL` 會寫入瀏覽器 bundle；修改後必須重建 web 映像。

## 2. 建置並啟動

```sh
docker compose config --quiet
docker compose build --pull
docker compose up -d
docker compose ps
curl --fail http://127.0.0.1:3000/api/health
```

服務包括：

- `web`：Next.js standalone server，只開放 3000 port。
- `worker`：每兩秒租用並處理一個 SQLite job，不開放 port。
- `backup`：只有 `maintenance` profile 的一次性工具，不會常駐。

兩個常駐容器都以 UID/GID `10001`、唯讀根檔案系統、移除 Linux capabilities、`no-new-privileges` 執行。只有 `/app/var` named volume 和 `/tmp` tmpfs 可寫。

## 3. TLS 與反向代理

對外 DNS 應指向 Caddy、Traefik、nginx 或雲端 load balancer，由代理終止 TLS，再轉送 `http://127.0.0.1:3000`。代理必須保留 Lemon Squeezy webhook 的原始 request body，並限制 request body 大小、加入存取日誌與速率限制。不要直接把管理後台以純 HTTP 暴露到網際網路。

公開健康檢查為：

```text
GET /api/health
```

它會同時驗證 Web 與資料庫。worker 健康檢查則驗證 worker process 與 SQLite 可讀性。

## 4. 金流、Email 與可選 secrets

Compose 預設用 Docker secrets 掛載管理密碼與 session secret，且不把 provider 金鑰提交進 Compose 檔案。正式環境應使用額外 Compose override 將 Lemon Squeezy、ECPay 和 Resend 金鑰掛成 secrets；目前應用程式直接讀取對應環境變數，部署入口可由 secret manager 將檔案內容注入環境，避免秘密出現在 image 或 Git：

```yaml
services:
  web:
    environment:
      LEMON_SQUEEZY_WEBHOOK_SECRET_FILE: /run/secrets/lemon_webhook
      ECPAY_MERCHANT_ID_FILE: /run/secrets/ecpay_merchant_id
      ECPAY_HASH_KEY_FILE: /run/secrets/ecpay_hash_key
      ECPAY_HASH_IV_FILE: /run/secrets/ecpay_hash_iv
    secrets: [lemon_webhook, ecpay_merchant_id, ecpay_hash_key, ecpay_hash_iv]
  worker:
    environment:
      RESEND_API_KEY_FILE: /run/secrets/resend_api_key
    secrets: [resend_api_key]

secrets:
  lemon_webhook:
    file: /secure/path/lemon_webhook
  ecpay_merchant_id:
    file: /secure/path/ecpay_merchant_id
  ecpay_hash_key:
    file: /secure/path/ecpay_hash_key
  ecpay_hash_iv:
    file: /secure/path/ecpay_hash_iv
  resend_api_key:
    file: /secure/path/resend_api_key
```

在 provider 後台將 webhook URL 設為：

```text
https://autopilot.example.com/api/webhooks/payments/lemon-squeezy
```

上線前必須實際完成一筆 sandbox／測試訂單，確認簽章、`lead_id`、幣別、最小貨幣單位金額、冪等與重送流程。production 模式不提供 mock payment route。

台灣部署可使用已實作的 ECPay AIO 路徑。將公開報價設為 TWD、checkout URL 設為 `/api/payments/ecpay/checkout?leadId={leadId}`，並依 [台灣與開源金流接入](taiwan-payments.md) 完成付款嘗試、CheckMacValue、低付、重送與正式切換驗收。NewebPay、TapPay 與 LINE Pay 目前只有接入藍圖，未完成 adapter 前不可在營運畫面標成可收款。

## 5. 備份與還原演練

建立 SQLite 一致性備份：

```sh
docker compose --profile maintenance run --rm backup
docker compose exec worker node node_modules/tsx/dist/cli.mjs scripts/restore-check.ts
```

備份預設留在 named volume 的 `/app/var/backups`，這不算異地備份。每次備份後把檔案匯出主機，再送到加密的 object storage：

```sh
mkdir -p ./exported-backups
docker compose cp worker:/app/var/backups/. ./exported-backups/
```

還原會覆寫正式資料，不能在線執行。正確程序是停止 `web` 與 `worker`、保留現有 DB/WAL/SHM 的副本、用已通過 `PRAGMA integrity_check` 的備份替換資料庫，再重啟並檢查 `/api/health`。至少每季在隔離主機做一次完整還原演練；不要只驗證「檔案存在」。

## 6. 升級與回滾

```sh
docker compose --profile maintenance run --rm backup
git pull --ff-only
docker compose build --pull
docker compose up -d
docker compose ps
```

使用不可變 image tag 或 Git SHA 保存前一版。應用目前在啟動時執行向前相容的 `CREATE TABLE IF NOT EXISTS`，沒有通用 down migration；程式回滾若涉及 schema 變更，應同時還原升級前備份。

## 7. 日常操作

```sh
docker compose logs --since=30m web worker
docker compose restart worker
docker compose exec worker node node_modules/tsx/dist/cli.mjs scripts/worker.ts --once
docker compose exec worker node node_modules/tsx/dist/cli.mjs scripts/daily-digest.ts
docker compose down
```

不要使用 `docker compose down -v`，除非已確認要永久刪除資料 volume 且有可還原的異地備份。

## 擴展限制

- `worker` 不可使用 `--scale worker=2`；SQLite 租約雖能降低重複執行，仍不是多 worker／跨節點佇列設計。
- 不支援 Docker Swarm、Kubernetes 多副本或跨區 volume。
- 低流量時可以由反向代理快取靜態資產，但不要快取 API、後台或 webhook。
- 若需要多租戶、水平擴展或跨區容錯，先把 repository 與 job lease 遷移到 PostgreSQL／受管佇列，將工作產物改放 object storage，再做 stateless web replicas。
- stock worker image 只保證 `AUTOPILOT_AI_MODE=mock`。真實 Codex 模式還需要受控地安裝 Codex CLI 與 Git、提供非互動認證，並維持既有 `workspace-write` 沙箱；不可把主機 Codex 認證或 Docker socket 掛入公開容器。
