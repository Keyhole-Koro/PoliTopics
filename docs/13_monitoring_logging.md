# 13. Monitoring and Logging
[Japanese Version](./jp/13_monitoring_logging.md)

## Logs
- Lambda logs: CloudWatch log groups for each Lambda function.
- LocalStack logs: `docker compose logs -f localstack`.

## Latency Logging
- Web Backend (`/article/:id`): Logs high-resolution timing (hrtime) for total request duration.
- DynamoDB: Logs `GetCommand` duration, table name, key, and hit status for article lookups to help identify storage bottlenecks.

## DataCollection run logs
- When `ERROR_BUCKET` is set, DataCollection writes run summaries to S3:
  - `success/<timestamp>-<uuid>.json`
  - `error/<timestamp>-<uuid>.json`

## Metrics and alerts
- No alert rules are defined in Terraform (TBD).
- Consider adding alarms on Lambda errors, DLQ depth, and DynamoDB throttles.

## Discord notifications
- Webhook URLs live in secrets and are injected as Lambda environment variables via Terraform:
  - DataCollection/Recap: `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_BATCH` (set through `discord_webhook_error|warn|batch` variables).
  - Web backend: `DISCORD_WEBHOOK_ERROR`, `DISCORD_WEBHOOK_WARN`, `DISCORD_WEBHOOK_ACCESS` (set through matching Terraform variables).
- Channel routing:
  - `#error`: fatal Lambda failures (token budget aborts in DataCollection, unhandled Recap/Web errors).
  - `#warn`: soft failures (Dynamo write retry, unsupported LLM, persistence skipped) and as a fallback when no channel webhook is configured.
  - `#batch`: successful task registrations (DataCollection) and article persistence completions (Recap).
  - `#access`: 4xx/5xx access logs emitted by the Web backend after each response.
- Notifications use a lightweight custom HTTPS sender (no external libraries) to stay Lambda-size friendly and include environment, request/task IDs, and brief context.
