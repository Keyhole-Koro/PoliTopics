# 18. Troubleshooting
[日本語版](./jp/18_troubleshooting.md)

## Common errors

- R2 upload fails with `NoSuchKey` during `aws s3 sync`:
  - Use the R2 S3 API account root (`https://<accountid>.r2.cloudflarestorage.com`), not a bucket URL.
- DataCollection `/run` returns `unauthorized`:
  - `x-api-key` header does not match `RUN_API_KEY`.
- DataCollection `/run` returns `invalid_range`:
  - `from` and `until` must be `YYYY-MM-DD` and `from <= until`.
- DataCollection `/run` returns `server_misconfigured`:
  - `RUN_API_KEY` is missing in Lambda environment.
- Recap throws `Task <id> missing required data`:
  - Task items are missing required fields or invalid R2 URLs.
- Startup fails with Gemini API error:
  - `GEMINI_API_KEY` is missing (Recap/DataCollection).
- JSON parse failures from Recap land as `invalid_request` objects in R2/S3; inspect those payloads for root causes.
- Web backend runs on Cloudflare Workers (not API Gateway Lambda); adjust routing and environment accordingly.
- CloudWatch log groups also contain stdout, helpful for reproducing local/edge behaviors.

## Pipeline behaviors to check
- Tasks with `retryAttempts >= 3` are skipped by design; raise the cap before reprocessing.
- Heavy load on the LLM API can skip requests; retry once the provider is healthy.
- DataCollection cron queries meetings from 21 days ago to today and skips issueIds already present in tasks.
- Frontend headline cache refreshes daily; if `headline-cache` is absent in `index.html`, the SPA fetches `/headlines` on load.

## LocalStack issues

- Terraform targeting LocalStack by mistake:
  - Unset `AWS_ENDPOINT_URL` and set real AWS credentials.
- Lambda creation fails in LocalStack:
  - Ensure `LAMBDA_EXECUTOR=local` in docker-compose.

## Deploy manually issues

If Terraform init or import unexpectedly targets LocalStack for stage or prod, unset the LocalStack endpoint and ensure real AWS credentials are set:

```bash
unset AWS_ENDPOINT_URL
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
```
