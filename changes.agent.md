## 2026-01-14 15:42:13 JST - Codex
Keywords: measure, latency, backend, cold-start
Topic: Add backend latency measurement script
Details:
- Added a configurable latency probe with per-target intervals, optional cold-start cooldowns, and JSON-line logging.
- Documented the config schema and provided an example targets file for common backend routes.
Files:
- measure/measure-backend-latency.js
- measure/README.md
- measure/targets.example.json
- changes.agent.md

The `ACTIVE_ENVIRONMENT` environment variable has been successfully added to the Lambda function configuration in `PoliTopicsWeb/terraform/service/lambda/main.tf`.

This ensures that the backend application, which relies on `process.env.ACTIVE_ENVIRONMENT` (as seen in `PoliTopicsWeb/backend/src/config.ts`), will receive the correct environment value (local, stage, or prod) when deployed.

**Revert Note:**
Changes to `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts` and `PoliTopicsWeb/backend/src/repositories/dynamoArticleRepository.ts` regarding mandatory asset passing have been reverted at the user's request. The code is restored to its previous state where fallbacks to `item.summary` are allowed.

Added Discord webhook notifications across DataCollection, Recap, and Web: DataCollection now reports task writes and fatal runs plus batch task creation to Discord, Recap sends task errors/warnings and article persistence results, and the Web backend emits 4xx/5xx access logs and server errors. All use lightweight custom webhook handlers with URLs supplied via new Terraform variables (`discord_webhook_error|warn|batch|access`) that populate `DISCORD_WEBHOOK_*` Lambda environment variables. Updated docs/13_monitoring_logging.md with channel routing and configuration notes.

Added a real Discord webhook integration test in `PoliTopicsRecap/tests/integration/discordWebhook.integration.test.ts` that loads `DISCORD_WEBHOOK_TEST_URL` from `.test.env`, aggregates missing env errors before failing, and verifies the webhook returns a successful HTTP status. Color constants now include inline comments indicating their hues.

Centralized Discord webhook utilities into a publishable `@keyhole-koro/politopics-notification` package built to `dist` with exports for the Discord helpers. DataCollection, Recap, and the Web backend now consume the package rather than local path references in `../common`, and corresponding TS references were removed.

Moved the live Discord webhook integration test into `common/tests/discordWebhook.integration.test.ts` so all services share the same validation. Recap Jest roots were trimmed now that the shared package is external.

Frontend article page now renders AI要約/簡潔要約 as Markdown (GFM) via a shared `Markdown` component using `react-markdown` + `remark-gfm`, with supporting prose styles in `frontend/styles/globals.css`. Added the dependencies to `frontend/package.json`.

Backend Dynamo mapping now normalizes participants to avoid null `position` values breaking Zod response schemas and relaxes summary validation when data lives in S3 assets or signed URLs.

Gated frontend console logs to local environment and removed placeholder badges/text for unset categories or speaker affiliations to keep the user-facing UI clean. Also added frontend health checks that use a secret-provided stage URL in the deploy workflow, while backend health checks now live in the backend workflow. Files changed:
- `PoliTopicsWeb/frontend/lib/config.ts`
- `PoliTopicsWeb/frontend/lib/api.ts`
- `PoliTopicsWeb/frontend/components/articles/article-meta.tsx`
- `PoliTopicsWeb/frontend/components/articles/article-card.tsx`
- `PoliTopicsWeb/frontend/app/article/article-client.tsx`
- `PoliTopicsWeb/frontend/components/dialog-viewer.tsx`
- `PoliTopicsWeb/.github/workflows/deploy-frontend.yml`
- `PoliTopicsWeb/.github/workflows/deploy-backend.yml`

Introduced a small frontend logger (`frontend/lib/logger.ts`) that no-ops debug/info unless `NEXT_PUBLIC_LOG_LEVEL=debug` or `NEXT_PUBLIC_APP_ENV=local`, and switched config/api logging to use it. This avoids accidental console output in non-local environments while still allowing opt-in debugging.

Renamed remaining "parliamentary news" branding to PoliTopics (metadata, not-found page CTA/text, about link, globals comment). Files changed:
- `PoliTopicsWeb/frontend/app/layout.tsx`
- `PoliTopicsWeb/frontend/app/not-found.tsx`
- `PoliTopicsWeb/frontend/components/home/about-panel.tsx`
- `PoliTopicsWeb/frontend/app/globals.css`

Backend now falls back to a singular `category` field (from the item or asset) when `categories` is empty, so detail and list APIs return categories even if only `category` was stored. File changed:
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts`

Simplified category fallback to only read the Dynamo item (`categories` array or `category` string) without touching assets. File changed:
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts`

Replaced the top-left header glyph with the app icon for both home and article views. Files changed:
- `PoliTopicsWeb/frontend/components/home/home-header.tsx`
- `PoliTopicsWeb/frontend/app/[[...slug]]/catch-all-client.tsx`

Logged /article latency to stdout using hrtime-based timing around the handler. File changed:
- `PoliTopicsWeb/backend/src/http/routes/articles.ts`

Added Dynamo GetCommand timing for /article lookups, logging table, id, duration, and hit status. File changed:
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleRepository.ts`
