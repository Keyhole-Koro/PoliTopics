# 6. アーキテクチャ設計
[English Version](../../docs/06_architecture.md)

## 技術選定 (リポジトリより)
- DataCollection, Recap, Web サービス全体で TypeScript を採用。
- サーバーレス実行のための AWS Lambda。
- タスク追跡と記事保存のための DynamoDB。
- プロンプトペイロードと大きな記事アセットのための S3。
- 要約のための Gemini API。
- SPA フロントエンドのための Next.js。
- バックエンド API のための Fastify (バリデーションに Zod、ドキュメントに Swagger/OpenAPI を使用)。
- インフラストラクチャのプロビジョニングのための Terraform。

## 設計原則
- パイプラインの分離: 収集、要約、提供は分離されたサービス。
- タスクベースの処理: 各会議は DynamoDB タスクにマップされる。
- コストを意識したストレージ: 大きなアセットは S3 に保存し、メタデータは DynamoDB にインデックスする。
- ローカルファースト: ローカルテストのための LocalStack と dev container。

## 責任境界
- DataCollection: タスクのフェッチ、チャンク化、エンキュー。
- Recap: タスクの消費と要約された記事の生成。
- Web: 検索と記事体験の提供 (フロントエンドは Stage/Prod では Cloudflare R2 に、ローカルでは LocalStack S3 にホストされる)。

## 通知
- 集約された通知サービスが Discord Webhook を介してアラートを処理する。
- チャンネルは重大度/タイプに基づいてルーティングされる: `#error` (致命的), `#warn` (軽微な障害), `#batch` (完了), `#access` (Web ログ)。

## アセットセキュリティ
- 記事アセット (要約、対話) は S3 に保存され、期限付きの署名付き URL を介してアクセスされる。
- バックエンドはこれらの署名付き URL をオンデマンドで生成し、重いコンテンツへの安全で制御されたアクセスを保証する。
