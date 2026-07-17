## 摘要 / Summary

<!-- 說明問題、解法與使用者影響。 Describe the problem, solution, and user impact. -->

## 變更類型 / Change type

- [ ] 錯誤修正 / Bug fix
- [ ] 功能 / Feature
- [ ] 文件或翻譯 / Documentation or translation
- [ ] 重構或維運 / Refactor or maintenance
- [ ] 安全修正（敏感細節已透過私人管道協調） / Security fix coordinated privately

## 驗證 / Verification

<!-- 列出實際執行的指令與結果；使用者流程變更請附去識別化的畫面或 E2E 證據。 List commands and results; add redacted UI or E2E evidence for user-flow changes. -->

- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] 相關的 smoke、restore 或 E2E 檢查 / Relevant smoke, restore, or E2E checks

## 安全與品質檢查 / Safety and quality checklist

- [ ] 此 PR 聚焦單一問題，沒有無關修改。
- [ ] 沒有加入秘密、`.env`、資料庫、生成工作區、日誌或真實客戶資料。
- [ ] 外部輸入在邊界驗證，重試操作具有冪等鍵、上限、稽核及 dead-letter 狀態。
- [ ] 沒有繞過付款驗簽、核准紀錄、部署閘門或 Codex `workspace-write` 沙箱。
- [ ] 新增或變更行為有對應測試與文件。
- [ ] 使用者可見文字考慮語系、時區、幣別、日期格式、鍵盤操作與輔助技術。
- [ ] 收益、節省時間及成效內容明確標示為估計，沒有保證。
- [ ] 我已閱讀並同意遵守貢獻指南與行為準則。

## 部署與回復 / Deployment and rollback

<!-- 若不適用請填 N/A。 Describe migration, configuration, rollout, and rollback, or write N/A. -->
