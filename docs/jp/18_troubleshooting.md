# 18. トラブルシューティング
[English Version](../../docs/18_troubleshooting.md)

## 一般的なエラー

- `aws s3 sync` 中に R2 アップロードが `NoSuchKey` で失敗する:
  - R2 の S3 API エンドポイントはアカウントルート (`https://<accountid>.r2.cloudflarestorage.com`) を使う。バケット URL を渡さない。
- DataCollection `/run` が `unauthorized` を返す:
  - `x-api-key` ヘッダーが `RUN_API_KEY` と一致しない。
- DataCollection `/run` が `invalid_range` を返す:
  - `from` と `until` は `YYYY-MM-DD` で、`from <= until` を満たす。
- DataCollection `/run` が `server_misconfigured` を返す:
  - Lambda 環境に `RUN_API_KEY` が無い。
- Recap が `Task <id> missing required data` をスローする:
  - タスクアイテムに必須フィールドまたは無効な R2 URL がある。
- Gemini API エラーで起動に失敗する:
  - `GEMINI_API_KEY` が無い (Recap/DataCollection)。
- Recap の JSON パース失敗は R2/S3 の `invalid_request` オブジェクトとして残る。ペイロードを確認する。
- Web backend は Cloudflare Workers 上で動作（API Gateway Lambda ではない）。ルーティングや環境設定を合わせる。
- CloudWatch ロググループには stdout も記録されるので、挙動確認に利用する。

## パイプライン動作の確認ポイント
- `retryAttempts >= 3` のタスクは設計上スキップする。再処理する場合は上限を上げる。
- LLM API が高負荷だとリクエストがスキップされることがある。プロバイダが安定してから再実行する。
- DataCollection の cron は過去 21 日から今日までをクエリし、既存の issueId があるタスクはスキップする。
- フロントエンドの記事メタデータキャッシュは毎日更新され、`index.html` に `headline-cache` が無い場合は SPA が `/headlines` をフェッチする。

## LocalStack の問題

- Terraform が誤って LocalStack をターゲットにする:
  - `AWS_ENDPOINT_URL` を unset し、実際の AWS 認証情報を設定する。
- LocalStack で Lambda 作成が失敗する:
  - docker-compose で `LAMBDA_EXECUTOR=local` が設定されていることを確認する。

## 手動デプロイの問題

Terraform init または import が予期せず stage/prod で LocalStack をターゲットにする場合は、LocalStack エンドポイントを unset し、実際の AWS 認証情報を設定する:

```bash
unset AWS_ENDPOINT_URL
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```
