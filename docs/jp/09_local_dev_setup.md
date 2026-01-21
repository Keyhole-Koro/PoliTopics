# 9. ローカル開発セットアップ
[English Version](../../docs/09_local_dev_setup.md)

## 必要なツール
- Node.js 22+
- pnpm (Recap, DataCollection)
- npm (Web workspaces)
- Docker + Docker Compose (LocalStack)
- Terraform

## ローカルサービス
- LocalStack エンドポイント: `http://localhost:4566`
- DynamoDB Admin UI: `http://localhost:8001`
- ストレージ: プロンプト/結果は LocalStack の S3 を使用。記事アセットと SPA は必要に応じて R2 (S3 API) に同期。Workers の dev は Wrangler を使用。

## 環境変数（最新）
- 共通 AWS/LocalStack: `AWS_REGION` / `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL` (LocalStack), `LOCALSTACK_URL`（使用箇所のみ）, `APP_ENVIRONMENT` または `ACTIVE_ENVIRONMENT` (`local`/`stage`/`prod`/`ghaTest`/`localstackTest`)。
- DataCollection: `GEMINI_API_KEY`, `RUN_API_KEY`, `LLM_TASK_TABLE`, `PROMPT_BUCKET`, `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_BATCH`, `NATIONAL_DIET_API_ENDPOINT` (任意), `ERROR_BUCKET` (任意), キャッシュ系オプション。
- Recap: `GEMINI_API_KEY`, `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_BATCH`, `R2_ENDPOINT_URL`, `R2_REGION` (デフォルト `auto`), `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ARTICLE_BUCKET`, `R2_PUBLIC_URL_BASE`, `ENABLE_NOTIFICATION`, `NOTIFICATION_DELAY_MS`。
- Web backend (Workers/Hono): `ACTIVE_ENVIRONMENT` (`local`/`stage`/`prod`/`localstack`/`localstackTest`), `DATA_MODE` (`dynamo`|`mock`), `ASSET_URL_TTL_SECONDS`, `DISABLE_NOTIFICATIONS`, `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_ACCESS`。
- Web frontend: `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_LOG_LEVEL`。

## テスト
- `npm test` / `pnpm test` は `pretest` で LocalStack リソースを自動 apply するため、ローカルでの手動 Terraform は不要。
- `PoliTopicsWeb` の `npm test` は `scripts/ensure-localstack.sh` で LocalStack を用意した上で Playwright E2E を実行。
- 各リポジトリの push 時に CI がテストを実行。GitHub Runner では `localstack:4566` にルーティングできないため `APP_ENVIRONMENT=ghaTest` を使用し、ローカルプロファイルは使わない。

## クイックコマンド
DataCollection:
```
cd PoliTopicsDataCollection
pnpm install
pnpm test
pnpm build
```

Recap:
```
cd PoliTopicsRecap
pnpm install
pnpm dev
pnpm test
pnpm build:local
```

Web:
```
cd PoliTopicsWeb
npm install --workspaces --include-workspace-root
npm run dev:backend
npm run dev:frontend
npm test
```
