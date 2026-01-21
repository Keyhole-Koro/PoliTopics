# 6. アーキテクチャ設計
[English Version](../../docs/06_architecture.md)

## 技術選定 (リポジトリより)
- DataCollection, Recap, Web サービス全体で TypeScript を採用。
- サーバーレス実行のための AWS Lambda。
- タスク追跡と記事保存のための DynamoDB。
- プロンプトペイロードとリデュース出力は Amazon S3。記事アセットと SPA は Cloudflare R2 (S3 API)。
- 要約のための Gemini API。
- SPA フロントエンドのための Next.js。
- バックエンド API のための Cloudflare Workers (V8) + Hono（バリデーションに Zod、ドキュメントに Swagger/OpenAPI を使用）。
- インフラストラクチャのプロビジョニングのための Terraform。

## 設計原則
- パイプラインの分離: 収集、要約、提供は分離されたサービス。
- タスクベースの処理: 各会議は DynamoDB タスクにマップされる。
- コストを意識したストレージ: プロンプト/結果は S3、記事アセットと SPA は R2、メタデータは DynamoDB にインデックス。
- ローカルファースト: ローカルテストのための LocalStack と dev container。

## 責任境界
- DataCollection: タスクのフェッチ、チャンク化、エンキュー。
- Recap: タスクの消費と要約された記事の生成。
- Web: 検索と記事体験の提供 (フロントエンドは Stage/Prod では Cloudflare R2 に、ローカルでは LocalStack S3 にホスト)。
- Backend API: Cloudflare Workers (V8) を採用し、コールドスタートを避けつつ V8 の Isolate 再利用でウォーム時に Lambda 比およそ 2 倍の速度を狙う。

## 技術選定の理由
- SPA を R2 配信: Cloudflare でドメインを取得しており、エッジ配信が容易。AWS だと S3 + CloudFront 構成が必要になる。
- 記事アセットを R2 に置く: 独自ドメイン + HTTPS を簡単に設定でき、アウトバウンド転送料が無料。
- バックエンドを Workers に: コールドスタートがなく、V8 Isolate のウォーム実行が Lambda より約 2 倍速かったため。
- DynamoDB 採用: NoSQL による少クエリ構成で `/headlines` `/article` `/suggest` をそれぞれ 1 クエリで取得。本文は同梱の asset URL から R2 をダウンロードするため、DB 追加クエリが不要。

## 通知
- 集約された通知サービスが Discord Webhook を介してアラートを処理する。
- チャンネルは重大度/タイプに基づいてルーティングされる: `#error` (致命的), `#warn` (軽微な障害), `#batch` (完了), `#access` (Web ログ)。

## アセットセキュリティ
- 記事アセット (要約、対話) は R2 に保存し、期限付きの署名付きまたは公開 URL でアクセスする。
- バックエンドはこれらの URL をオンデマンドで生成し、重いコンテンツへの制御されたアクセスを維持しつつ SPA のキャッシュ性も確保する。
