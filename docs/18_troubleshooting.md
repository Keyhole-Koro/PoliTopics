# 18. Troubleshooting
[Japanese Version](./jp/18_troubleshooting.md)

## Common errors

- R2 upload fails with `NoSuchKey` during `aws s3 sync`:
  - The R2 S3 API endpoint must be the account root (`https://<accountid>.r2.cloudflarestorage.com`), not a bucket URL like `https://<accountid>.r2.cloudflarestorage.com/<bucket>`.(but cloudflare console shows this pattern...)
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

## Deploy Manually Issues

If Terraform init or import unexpectedly targets LocalStack for stage or prod, unset the LocalStack endpoint and ensure real AWS credentials are set:

```bash
unset AWS_ENDPOINT_URL
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```

## API Gateway stage path

- Web backend Lambda strips `/stage` from paths.
  - If you add new routes, keep this in mind for stage deployments.
