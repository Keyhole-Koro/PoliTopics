The `ACTIVE_ENVIRONMENT` environment variable has been successfully added to the Lambda function configuration in `PoliTopicsWeb/terraform/service/lambda/main.tf`.

This ensures that the backend application, which relies on `process.env.ACTIVE_ENVIRONMENT` (as seen in `PoliTopicsWeb/backend/src/config.ts`), will receive the correct environment value (local, stage, or prod) when deployed.

**Revert Note:**
Changes to `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts` and `PoliTopicsWeb/backend/src/repositories/dynamoArticleRepository.ts` regarding mandatory asset passing have been reverted at the user's request. The code is restored to its previous state where fallbacks to `item.summary` are allowed.

Added Discord webhook notifications across DataCollection, Recap, and Web: DataCollection now reports task writes and fatal runs plus batch task creation to Discord, Recap sends task errors/warnings and article persistence results, and the Web backend emits 4xx/5xx access logs and server errors. All use lightweight custom webhook handlers with URLs supplied via new Terraform variables (`discord_webhook_error|warn|batch|access`) that populate `DISCORD_WEBHOOK_*` Lambda environment variables. Updated docs/13_monitoring_logging.md with channel routing and configuration notes.

Added a real Discord webhook integration test in `PoliTopicsRecap/tests/integration/discordWebhook.integration.test.ts` that loads `DISCORD_WEBHOOK_TEST_URL` from `.test.env`, aggregates missing env errors before failing, and verifies the webhook returns a successful HTTP status. Color constants now include inline comments indicating their hues.

Centralized Discord webhook utilities under the new top-level `common/` package so DataCollection, Recap, and Web backend now import `@common/discord/*` instead of duplicating helpers. Build scripts keep using `tsc`/`tsc-alias`, and common sources stay the single point of truth for webhook payloads, colors, and test env loading. A `.gitignore` entry was added for `common/dist`.

Moved the live Discord webhook integration test into `common/tests/discordWebhook.integration.test.ts` so all services share the same validation. Recap Jest now includes the common test root; the per-service copies were removed.
