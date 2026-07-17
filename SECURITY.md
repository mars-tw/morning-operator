# 安全政策 / Security Policy

我們重視使用者、商店與付款資料的安全。請以負責任揭露方式通報疑似漏洞。

## 支援版本 / Supported versions

本專案仍在早期階段，只有預設分支的最新版本接受安全修正。舊提交、私人 fork 及第三方部署不在維護範圍內。

| Version | Supported |
| --- | --- |
| Latest default branch | Yes |
| Older commits or forks | No |

## 私下通報 / Private reporting

請勿為安全漏洞建立公開 Issue，也不要提交包含可用攻擊程式、憑證、個人資料或真實客戶資料的公開 PR。

1. 前往本專案 GitHub 頁面的 **Security** 分頁。
2. 選擇 **Report a vulnerability**，透過 GitHub Private Vulnerability Reporting 建立私人報告。
3. 若該功能尚未啟用，請使用 GitHub 個人檔案所列的維護者私人聯絡管道，主旨註明 `SECURITY: 早安店長`。在確認安全管道之前，請勿傳送秘密或客戶資料。

報告請盡可能包含：

- 受影響版本、提交或部署方式
- 漏洞類型及可能影響
- 可重現的最少步驟或無害概念驗證
- 已嘗試的緩解措施
- 是否涉及付款、權限提升、Webhook、AI prompt injection 或個人資料
- 希望使用的署名方式；可選擇匿名

## 回應流程 / Response process

維護者目標在 5 個工作日內確認收到報告，接著進行重現、風險評估與修正協調。處理時間依複雜度而異；我們會透過私人管道提供進度。在修正可供使用者部署之前，請保持內容機密。

若確認漏洞，我們會盡可能：

- 準備最小且經測試的修正
- 輪替受影響的專案憑證並記錄必要操作
- 發布安全公告與升級／緩解說明
- 在通報者同意下提供致謝

目前不提供漏洞獎金，也不承諾任何報酬。

## 安全研究邊界 / Safe research boundaries

僅對你擁有或明確獲准測試的系統進行研究。不得：

- 存取、修改或刪除他人資料
- 進行阻斷服務、垃圾訊息、社交工程或實體攻擊
- 使用真實付款工具進行未授權交易
- 擷取或公開秘密、個人資料、Shopify 客戶資料或 Codex 認證
- 在確認漏洞後繼續擴大存取範圍

此政策不是授權測試任何第三方服務，例如 Shopify、付款供應商、電子郵件服務或 AI 供應商；其各自政策仍然適用。

English-language reports are welcome. Please use the same private reporting process and avoid sharing customer data or credentials.
