# 9. Local Development Setup

## Required tools
- Node.js 22+
- pnpm (Recap, DataCollection)
- npm (Web workspaces)
- Docker + Docker Compose (LocalStack)
- Terraform

## Dev container
See `docs/build.md` for full instructions. The repo uses a shared dev container that runs LocalStack and DynamoDB Admin UI.

## LocalStack services
- LocalStack endpoint: `http://localhost:4566`
- DynamoDB Admin UI: `http://localhost:8001`
- S3 (via LocalStack): Used for prompts, articles, and local assets.

## Environment variables
Common local defaults (see `docs/build.md`):
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
- Uses `backend/src/config.ts` defaults (currently hard-coded to `local`).
- `DISCORD_WEBHOOK_ERROR` / `DISCORD_WEBHOOK_WARN` / `DISCORD_WEBHOOK_ACCESS`

## Quick commands
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
# Run E2E tests against LocalStack
npm run test:e2e:localstack
```
