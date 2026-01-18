# 13. モニタリングとロギング
[English Version](../../docs/13_monitoring_logging.md)

## ログ
- Lambda ログ: 各 Lambda 関数の CloudWatch ロググループ。
- LocalStack ログ: `docker compose logs -f localstack`。

## レイテンシロギング
- Web Backend (`/article/:id`): 総リクエスト所要時間の高解像度タイミング (hrtime) をログに記録。
- DynamoDB: 記事ルックアップの `GetCommand` 所要時間、テーブル名、キー、ヒットステータスをログに記録し、ストレージのボトルネック特定を支援。

## DataCollection 実行ログ
- `ERROR_BUCKET` が設定されている場合、DataCollection は実行サマリーを S3 に書き込みます:
  - `success/<timestamp>-<uuid>.json`
  - `error/<timestamp>-<uuid>.json`

## メトリクスとアラート
- Terraform でアラートルールは定義されていません (TBD)。
- Lambda エラー、DLQ の深さ、DynamoDB スロットルに対するアラームの追加を検討してください。

## Discord 通知
- Webhook URL はシークレットに存在し、Terraform を介して Lambda 環境変数として注入されます:
  - DataCollection/Recap: `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_BATCH` (`discord_webhook_error|warn|batch` 変数を介して設定)。
  - Web backend: `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_ACCESS` (一致する Terraform 変数を介して設定)。
- チャンネルルーティング:
  - `#error`: 致命的な Lambda 障害 (DataCollection でのトークン予算中止、未処理の Recap/Web エラー)。
  - `#warn`: 軽微な障害 (Dynamo 書き込みリトライ、サポートされていない LLM、永続化のスキップ)、およびチャンネル Webhook が設定されていない場合のフォールバック。
  - `#batch`: 成功したタスク登録 (DataCollection) と記事永続化の完了 (Recap)。
  - `#access`: 各レスポンス後に Web backend から発行される 4xx/5xx アクセスログ。
- 通知は軽量なカスタム HTTPS 送信者 (外部ライブラリなし) を使用して Lambda サイズに配慮し、環境、リクエスト/タスク ID、および簡単なコンテキストを含みます。
