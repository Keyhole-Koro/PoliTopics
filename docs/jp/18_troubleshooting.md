# 18. トラブルシューティング
[English Version](../../docs/18_troubleshooting.md)

## 一般的なエラー

- `aws s3 sync` 中に R2 アップロードが `NoSuchKey` で失敗する:
  - R2 S3 API エンドポイントは、`https://<accountid>.r2.cloudflarestorage.com/<bucket>` のようなバケット URL ではなく、アカウントルート (`https://<accountid>.r2.cloudflarestorage.com`) である必要があります。(しかし Cloudflare コンソールはこのパターンを示しています...)
- DataCollection `/run` が `unauthorized` を返す:
  - `x-api-key` ヘッダーが `RUN_API_KEY` と一致しない。
- DataCollection `/run` が `invalid_range` を返す:
  - `from` と `until` は `YYYY-MM-DD` であり、かつ `from <= until` である必要がある。
- DataCollection `/run` が `server_misconfigured` を返す:
  - Lambda 環境に `RUN_API_KEY` が見つからない。
- Recap が `Task <id> missing required data` をスローする:
  - タスクアイテムに必須フィールドまたは無効な S3 URL がある。
- Gemini API エラーで起動に失敗する:
  - `GEMINI_API_KEY` が見つからない (Recap/DataCollection)。

## LocalStack の問題

- Terraform が誤って LocalStack をターゲットにする:
  - `AWS_ENDPOINT_URL` を設定解除し、実際の AWS 認証情報を設定する。
- LocalStack で Lambda 作成が失敗する:
  - docker-compose で `LAMBDA_EXECUTOR=local` が設定されていることを確認する。

## 手動デプロイの問題

Terraform init または import が予期せず stage または prod で LocalStack をターゲットにする場合は、LocalStack エンドポイントを設定解除し、実際の AWS 認証情報が設定されていることを確認してください:

```bash
unset AWS_ENDPOINT_URL
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```

## API Gateway ステージパス

- Web backend Lambda はパスから `/stage` を取り除きます。
  - 新しいルートを追加する場合は、ステージデプロイメントでこれを念頭に置いてください。
