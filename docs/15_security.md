# 15. Security Design

## Authentication
- DataCollection `/run` requires `x-api-key` to match `RUN_API_KEY`.
- Web API endpoints are public (no auth in code).

## Authorization
- No role-based access control is implemented.

## Secret handling
- `GEMINI_API_KEY` and `RUN_API_KEY` must be provided via environment variables or Terraform variables.
- Secrets must not be committed to repo.

## CSRF / XSS
- Web API only exposes GET routes; no cookie-based auth is used, so CSRF is not currently relevant.
- Frontend is React-based; ensure any new HTML rendering is sanitized.

## Vulnerability response
- No explicit policy in repo (TBD). Consider documenting patch and disclosure workflow.
