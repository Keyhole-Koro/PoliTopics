# 9. Local Development Setup

[日本語版](./jp/09_local_dev_setup.md)

## Required tools

- Node.js 22+
- pnpm (Recap, DataCollection)
- npm (Web workspaces)
- Docker + Docker Compose (LocalStack)
- Terraform

LocalStack tip: `source scripts/export_test_env.sh` to load common local defaults before running tests or dev servers.

## Local services

- LocalStack endpoint: `http://localhost:4566`
- DynamoDB Admin UI: `http://localhost:8001`
- Storage: prompts/results use LocalStack S3; article assets and SPA can be synced to R2 (S3 API) in local flows; Workers dev uses Wrangler locally.

## Environment variables
- Tip: `source scripts/export_test_env.sh` to populate common LocalStack defaults before running tests.

- Shared AWS/LocalStack: `AWS_REGION` / `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL` (LocalStack), `LOCALSTACK_URL` (where used), `APP_ENVIRONMENT` or `ACTIVE_ENVIRONMENT` (`local`/`stage`/`prod`/`ghaTest`/`localstackTest`).
- DataCollection: `GEMINI_API_KEY`, `RUN_API_KEY`, `LLM_TASK_TABLE`, `PROMPT_BUCKET`, `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_BATCH`, `NATIONAL_DIET_API_ENDPOINT` (optional override), `ERROR_BUCKET` (optional), cache toggles.
- Recap: `GEMINI_API_KEY`, `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_BATCH`, `R2_WRITE_ENDPOINT_URL`, `R2_REGION` (default `auto`), `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ARTICLE_BUCKET`, `R2_PUBLIC_ASSET_URL`, `ENABLE_NOTIFICATION`, `NOTIFICATION_DELAY_MS`.
- Web backend (Workers/Hono): `ACTIVE_ENVIRONMENT` (`local`/`stage`/`prod`/`localstack`/`localstackTest`), `DATA_MODE` (`dynamo`|`mock`), `ASSET_URL_TTL_SECONDS`, `DISABLE_NOTIFICATIONS`, `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_ACCESS`.
- Web frontend: `NEXT_PUBLIC_APP_ENV`, `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_LOG_LEVEL`.

## Tests

- `npm test` / `pnpm test` use `pretest` scripts to auto-apply LocalStack resources; no manual Terraform step is needed for local runs.
- `npm run test` in `PoliTopicsWeb` executes Playwright e2e after provisioning LocalStack via `scripts/ensure-localstack.sh`.
- Push triggers run per repository; CI uses `APP_ENVIRONMENT=ghaTest` because GitHub runners cannot reuse the local Docker network or route to `localstack:4566`. Local profiles are not used in CI.

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
npm test
```
