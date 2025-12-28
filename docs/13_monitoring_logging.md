# 13. Monitoring and Logging

## Logs
- Lambda logs: CloudWatch log groups for each Lambda function.
- LocalStack logs: `docker compose logs -f localstack`.

## DataCollection run logs
- When `ERROR_BUCKET` is set, DataCollection writes run summaries to S3:
  - `success/<timestamp>-<uuid>.json`
  - `error/<timestamp>-<uuid>.json`

## Metrics and alerts
- No alert rules are defined in Terraform (TBD).
- Consider adding alarms on Lambda errors, DLQ depth, and DynamoDB throttles.
