# おはよう店長 / Morning Operator

[English](../README.md) · [繁體中文](../README.zh-TW.md) · 日本語 · [Español](README.es.md)

複数業種の反復業務を対象に、業種パックの選択、リスクと適合度の評価、決済確認、範囲承認、隔離された AI ビルド、QA、納品承認、通知、監査、バックアップまでをつなぐ、セルフホスト可能でプロバイダー中立のワークフローです。

既定値はデモモードです。実際の決済、メール送信、外部プラットフォーム接続、本番デプロイは行いません。収益、投資回収期間、削減時間は推定値であり、事業成果を保証しません。

静的でレビュー可能な 6 種類の業種パック（コマース運営、専門サービス、予約サービス、クリエイター／教育、不動産／現場サービス、バックオフィス）を収録しています。各パックには対応目標、推定自動化範囲、指標、承認ゲート、禁止用途があります。詳細は [業種パック仕様](industry-packs.md) を参照してください。

```powershell
git clone https://github.com/mars-tw/morning-operator.git
Set-Location morning-operator
pnpm install
Copy-Item .env.example .env.local
pnpm seed
pnpm dev
```

別のターミナルで `pnpm worker` を実行し、`http://localhost:3000/ja` を開きます。本番環境では [セルフホスト手順](self-hosting.md) と [本番チェック](production-readiness.md) を確認してください。

Apache-2.0 ライセンスです。セキュリティ問題は公開 Issue ではなく、[セキュリティポリシー](../SECURITY.md) に従って非公開で報告してください。
