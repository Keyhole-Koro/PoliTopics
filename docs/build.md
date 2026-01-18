# Build & Local Environment Guide
[Japanese Version](./jp/build.md)

Always work inside the Dev Container (host-only runs are unsupported).

## Dev Container (required)
- In VS Code run “Reopen in Container” or `devcontainer up --workspace-folder .`.
- After the container starts, bring up LocalStack/UI: `docker compose up -d localstack dynamodb-admin`.

## LocalStack one-shot setup & tests
```bash
docker compose up -d localstack dynamodb-admin          # start LocalStack
bash scripts/localstack_apply_all.sh                    # build+apply for DataCollection/Recap/Web
source scripts/export_test_env.sh                       # export env vars into current shell (must source)
bash scripts/test_all.sh                                # npm test for all modules
```
Use `-only DataCollection,Web` to limit `localstack_apply_all.sh` targets.

## Per-module commands (inside container)
- DataCollection: `cd PoliTopicsDataCollection && pnpm install && pnpm test && pnpm build`
- Recap: `cd PoliTopicsRecap && pnpm install && pnpm test && pnpm build:local`
- Web: `cd PoliTopicsWeb && npm install --workspaces --include-workspace-root && npm run dev:backend && npm run dev:frontend` (build with `npm run build:backend && npm run build:frontend`)

## Environment variable tips
- LocalStack defaults are exported by `scripts/export_test_env.sh`.
- AWS connection: `AWS_REGION=ap-northeast-3`, `AWS_ACCESS_KEY_ID=test`, `AWS_SECRET_ACCESS_KEY=test`, `AWS_ENDPOINT_URL` / `LOCALSTACK_URL=http://localhost:4566`
- Product-specific: set test-safe values for `RUN_API_KEY`, `DISCORD_WEBHOOK_*`, `GEMINI_API_KEY`, etc.; do not commit real secrets.

## Observability
- DynamoDB Admin UI: `http://localhost:8001`
- LocalStack logs: `docker compose logs -f localstack`
- AWS CLI (LocalStack): `aws --endpoint-url http://localhost:4566 ...`
