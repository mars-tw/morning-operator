# 系統架構

```mermaid
flowchart LR
    Lead["銷售頁／流程健檢表"] --> Web["Next.js 營運總部"]
    Pay["金流 Webhook"] --> Web
    Registry["靜態產業包 registry"] --> Web
    Web --> DB["SQLite 單一資料真相"]
    DB --> Queue["租約式工作佇列"]
    Queue --> Worker["長駐 Worker"]
    Worker --> Codex["隔離 Codex 工作目錄"]
    Codex --> QA["型別／測試／安全檢查"]
    QA --> Approval["正式部署批准"]
    Worker --> Notify["通知／每日摘要"]
```

SQLite 啟用 WAL、foreign keys 與 busy timeout。付款事件、專案與工作在同一交易內建立；工作採租約、最大嘗試次數、指數退避與 dead-letter。公開部署若需要多台 worker，先把 repository 層遷移至 PostgreSQL。

## 多產業接入

系統不將公開表單的「產業」視為可執行指令。邊界驗證只接受內建 registry 中的產業包 ID 與支援目標，再將結構化輸入作為不可信任資料寫入 SQLite。產業包提供的是靜態、版本化且可審閱的工作流程合約；詳見 [產業包文件](industry-packs.md)。

```mermaid
flowchart LR
    Input["工作量、平台、目標與成本"] --> Validate["Zod 邊界驗證"]
    Validate --> Pack["產業包與目標配對"]
    Pack --> Risk["低／中／受限風險"]
    Risk --> Estimate["工時、價值與回收期範圍"]
    Risk --> Spec["附禁止動作的規格草稿"]
    Spec --> Approval["人工核准閘門"]
```

估算是協助篩選的上下界，不是獲利保證。受限的範圍不建立自動交付工作；必須轉人工審查或縮小成安全的讀取／草擬作業。任何對外平台串接皆為選配 adapter，不影響無憑證 mock 路徑的完整性。

## 專案狀態

```text
paid → spec_draft → spec_approval → build_queued → building
     → qa_failed | qa_passed → deploy_approval → delivered
```

## 設計方向

介面採「店長交班簿」而非一般 SaaS 儀表板：霧藍紙張、深藍墨水、朱紅核准章與青綠運行狀態。標題使用宋體系，正文使用台灣常見無襯線字體，數字與狀態使用等寬字體。首頁的辨識元素是可檢視的產業包藍圖與作業傳送帶；動態僅用於呈現事件流，並尊重 reduced-motion。
