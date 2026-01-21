# 12. Deployment
[日本語版](./jp/12_deploy.md)

## Automated deploys
- Stage/Prod branches trigger GitHub Actions to deploy DataCollection, Recap (Fargate), and Web (Workers + R2/frontend).
- CI supplies `APP_ENVIRONMENT=ghaTest` for tests before deploy.

## Manual deploy (when needed)
- Set your own AWS credentials in the shell (see troubleshooting for exact env vars) and export `TF_VAR_gemini_api_key` before running Terraform.
- DataCollection/Recap: run `pnpm build` then Terraform in each module with the stage/prod tfvars.
- Web backend/frontend has many environment variables; manual deploy is discouraged. Prefer the GitHub Actions workflows.

## Terraform state and locking
- Terraform state lives in an S3 bucket (per module backend config). Keep the bucket available before running `init`/`plan`/`apply`.
- There is no apply lock for concurrency; avoid running multiple applies at the same time.

## Rollback
- Terraform: re-apply a previous plan or restore from the stored state.
- Frontend assets: re-upload the prior build to R2 if needed.
