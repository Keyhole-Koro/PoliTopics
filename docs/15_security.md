# 15. Security Design
[日本語版](./jp/15_security.md)

## Authentication
- DataCollection `/run` requires `x-api-key` to match `RUN_API_KEY`.
- Web API endpoints are public (no auth in code).

## Authorization
- No role-based access control is implemented.

## Secret handling
- `GEMINI_API_KEY` and `RUN_API_KEY` must be provided via environment variables or Terraform variables.
- Secrets live in GitHub Actions secrets for CI/CD; do not commit them to the repo.
- Deployment uses dedicated IAM roles; reuse those roles instead of personal long-lived keys.

## CSRF / XSS
- Web API only exposes GET routes; no cookie-based auth is used, so CSRF is not currently relevant.

## Vulnerability response
- No explicit policy in repo (TBD). Consider documenting patch and disclosure workflow.
