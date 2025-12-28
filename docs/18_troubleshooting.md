# 18. Troubleshooting

## Common errors
- DataCollection `/run` returns `unauthorized`:
  - `x-api-key` header does not match `RUN_API_KEY`.
- DataCollection `/run` returns `invalid_range`:
  - `from` and `until` must be `YYYY-MM-DD` and `from <= until`.
- DataCollection `/run` returns `server_misconfigured`:
  - `RUN_API_KEY` is missing in Lambda environment.
- Recap throws `Task <id> missing required data`:
  - Task items are missing required fields or invalid S3 URLs.
- Startup fails with Gemini API error:
  - `GEMINI_API_KEY` is missing (Recap/DataCollection).

## LocalStack issues
- Terraform targeting LocalStack by mistake:
  - Unset `AWS_ENDPOINT_URL` and set real AWS credentials.
- Lambda creation fails in LocalStack:
  - Ensure `LAMBDA_EXECUTOR=local` in docker-compose.

## API Gateway stage path
- Web backend Lambda strips `/stage` from paths.
  - If you add new routes, keep this in mind for stage deployments.
