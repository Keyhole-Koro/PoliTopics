# 9. ローカル開発セットアップ
[English Version](../../docs/09_local_dev_setup.md)

## 必要なツール
- Node.js 22+
- pnpm (Recap, DataCollection)
- npm (Web workspaces)
- Docker + Docker Compose (LocalStack)
- Terraform

## Dev container
完全な手順については `docs/jp/build.md` を参照してください。リポジトリは LocalStack と DynamoDB Admin UI を実行する共有 dev container を使用します。

## LocalStack サービス
- LocalStack エンドポイント: `http://localhost:4566`
- DynamoDB Admin UI: `http://localhost:8001`
- S3 (via LocalStack): プロンプト、記事、ローカルアセットに使用されます。

## 環境変数
一般的なローカルデフォルト (`docs/jp/build.md` を参照):
- `AWS_REGION` / `AWS_DEFAULT_REGION`
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
- `AWS_ENDPOINT_URL` / `LOCALSTACK_URL`

DataCollection
- `APP_ENVIRONMENT` (local|stage|prod)
- `GEMINI_API_KEY`
- `RUN_API_KEY`
- `LLM_TASK_TABLE`
- `PROMPT_BUCKET`
- `ERROR_BUCKET` (optional)
- `DISCORD_WEBHOOK_ERROR` / `DISCORD_WEBHOOK_WARN` / `DISCORD_WEBHOOK_BATCH`

Recap
- `APP_ENVIRONMENT` (local|stage|prod)
- `GEMINI_API_KEY`
- `DISCORD_WEBHOOK_ERROR` / `DISCORD_WEBHOOK_WARN` / `DISCORD_WEBHOOK_BATCH`

Web frontend
- `NEXT_PUBLIC_APP_ENV` (local|stage|prod)
- `NEXT_PUBLIC_API_BASE_URL` (optional override)
- `NEXT_PUBLIC_LOG_LEVEL` (debug|info)

Web backend
- `backend/src/config.ts` のデフォルトを使用 (現在は `local` にハードコードされています)。
- `DISCORD_WEBHOOK_ERROR` / `DISCORD_WEBHOOK_WARN` / `DISCORD_WEBHOOK_ACCESS`

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
# E2E テストを LocalStack に対して実行
npm run test:e2e:localstack
```
