# おはよう店長 / Morning Operator

[English](../README.md) · [繁體中文](../README.zh-TW.md) · 日本語 · [Español](README.es.md)

Shopify の運営診断から、決済確認、範囲承認、隔離された AI ビルド、QA、納品承認、通知、監査、バックアップまでをつなぐ、セルフホスト可能なワークフローです。

既定値はデモモードです。実際の決済、メール送信、Shopify 接続、本番デプロイは行いません。収益や削減時間を保証しません。

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm seed
pnpm dev
```

別のターミナルで `pnpm worker` を実行し、`http://localhost:3000/ja` を開きます。本番環境では [セルフホスト手順](self-hosting.md) と [本番チェック](production-readiness.md) を確認してください。

Apache-2.0 ライセンスです。セキュリティ問題は公開 Issue ではなく、[セキュリティポリシー](../SECURITY.md) に従って非公開で報告してください。
