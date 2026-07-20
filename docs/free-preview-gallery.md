# 免費開源專案預覽中心

查核日期：**2026-07-20**。公開網址預計固定為 <https://mars-tw.github.io/morning-operator/>，原始碼位於 `public/showcase/`。

這個頁面是 Morning Operator 的程式專案展示，不是線上商店、SaaS、預約服務或實際營運後台。所有品牌、內容、時段、商品與訂單都是合成資料；頁面沒有表單、帳號、分析追蹤、網路請求、資料保存、真實金流或外部訊息。

## 已執行的四個計畫

| 計畫 | 單一工作 | 免費可驗證內容 | 真正商用前仍需完成 |
|---|---|---|---|
| 網頁設計工作室 | 把一項服務做成清楚的響應式落地頁 | 三種視覺方向、固定交付物、下載式非個資 brief | 內容／素材權利、表單、分析、結帳、網域與正式部署核准 |
| 預約服務微網站 | 說明服務並模擬選擇時段 | 可鍵盤操作的時段狀態，不收姓名也不建立預約 | 後端驗證、身分與個資、冪等預約、提醒同意與取消政策 |
| 創作者產品頁 | 讓訪客理解一項數位產品與課綱 | 合成封面、三段課綱、版本切換，沒有假見證或假倒數 | 教學主張、素材權利、價格／退款文字、託管結帳與 Email 同意 |
| 團購營運看板 | 把彙總狀態整理成例外佇列 | 只顯示合成的 Ready／Review／Hold 資料 | 私有身分、訂單冪等、金流驗簽、庫存／出貨寫入與外送訊息核准 |

自動化覆蓋率、時程與變現方式都標示為情境，不是收入、需求、節省或成功保證。專案刻意從小範圍開始，讓使用者先驗證畫面、操作、交付內容與安全邊界，再決定是否投入主機、網域或供應商成本。

## 主力 SEO 成長實驗室

四個專案之外，展示站另有獨立的 SEO 成長實驗室。使用者只選業務型態、搜尋目標與市場範圍三組 enum，系統在瀏覽器內產生「搜尋意圖 → 頁面地圖 → 技術檢查 → 90 天量測」路線。它不收網址或 Email、不掃描網站、不連接 Search Console，也不保存分析資料，因此輸出明確標示為合成情境，而不是實站稽核。

實驗室對應正式的 `professional-seo-foundation@1` recipe；固定範圍、資料邊界、核准與禁止作法見 [SEO 主力服務](seo-service.md)。

## 主機研究結論

| 選項 | 本專案的判定 | 2026-07-20 官方依據 |
|---|---|---|
| GitHub Pages | **本開源程式作品展示採用。** 公開 Repository 可使用 Pages；此站不收資料、不交易、不提供 SaaS。不可拿它經營線上商業或電商。 | [Pages 限制與用途](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)、[自訂 Actions 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) |
| Cloudflare Pages | **真實商業靜態站的免費優先選擇。** 免費方案目前每月 500 次建置、每站 20,000 個檔案；純靜態資產請求免費且不限量。 | [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)、[Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/) |
| Cloudflare Workers | **需要伺服器驗證或小型 API 時選用。** 免費方案目前每日 100,000 次請求；仍須設計驗證、秘密、限流、冪等、重試及例外處理。 | [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) |
| Firebase Hosting | **已有 Google 帳號的靜態備援。** Spark 方案可不提供付款資料，但 Hosting 屬有免費額度的產品，超額會停用至下個週期或須升級。 | [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)、[Pricing](https://firebase.google.com/pricing) |
| Vercel Hobby | **只列為個人、非商業專案選項。** 目前官方仍將 Hobby 限定為 personal、non-commercial；商業交付不能把它當免費預設。 | [Vercel Hobby](https://vercel.com/docs/plans/hobby)、[Fair use](https://vercel.com/docs/limits/fair-use-guidelines) |

供應商可隨時調整條款與額度；正式部署前必須重新檢查官方文件。免費主機也不包含付費網域、Email、資料庫、金流費用、法遵工作或超額流量。

## 為什麼獨立成純靜態展示

Morning Operator 主程式包含 SQLite、API、金流 Webhook、worker 與管理後台，不能假裝成靜態站部署。`public/showcase/` 則刻意保持：

- 相對路徑 HTML、CSS、JavaScript，可從 Next.js `/showcase/` 或任何靜態主機開啟。
- 不載入遠端字型、圖片、分析或 runtime 套件。
- 不使用表單、瀏覽器儲存、Cookie、網路請求或不安全 HTML sink。
- 四語內容、四個計畫與非個資 JSON brief 都由同一個可稽核 registry 產生。
- SEO 實驗室以原生按鈕操作，不新增表單、URL、Email、analytics 或 storage。
- Absolute canonical、sitemap、Open Graph、Twitter metadata、真實 JSON-LD 與 404 `noindex` 皆由靜態驗證器檢查。
- GitHub Pages artifact 只包含 `public/showcase/`，不包含資料庫、`.env`、後台或伺服器程式。

## 本機預覽與驗證

```powershell
pnpm showcase:verify
pnpm dev
```

啟動後開啟 <http://localhost:3000/showcase/index.html>。也可以直接開啟 `public/showcase/index.html`。

完整品質閘門：

```powershell
pnpm verify
pnpm test:e2e
```

## 從範例改成自己的專案

1. Fork Repository，選擇最接近的一個計畫，維持一個明確工作與一個衡量結果。
2. 先替換合成品牌、文案與視覺；第一版不要加入客戶紀錄、真實表單或金流。
3. 使用下載的 JSON brief 建立固定範圍，記錄必要的人工作業閘門。
4. 真實商業靜態站改部署到允許該用途的 Cloudflare Pages、Firebase Hosting 或其他已審查供應商。
5. 需要預約、資料寫入或 Webhook 時，新增經驗證的伺服器端流程；秘密不得進前端或 Git。
6. QA 通過並取得 deployment approval 後，才可連接正式網域、真實供應商與外部動作。
