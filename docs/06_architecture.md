# 6. Architecture Design
[日本語版](./jp/06_architecture.md)

## Technology choices (from repo)
- TypeScript across DataCollection, Recap, and Web services.
- AWS Lambda for serverless execution.
- DynamoDB for task tracking and article storage.
- Amazon S3 for prompt payloads and intermediate reduce outputs; Cloudflare R2 (S3 API) for article assets and SPA hosting.
- Gemini API for summarization.
- Next.js for the SPA frontend.
- Cloudflare Workers (V8) + Hono for the backend API, with Zod for validation and Swagger/OpenAPI for documentation.
- Terraform for infrastructure provisioning.

## Design principles
- Pipeline separation: ingestion, summarization, and serving are isolated services.
- Task-based processing: each meeting maps to a DynamoDB task.
- Cost-aware storage: prompts/results stored in S3; large article assets and SPA stored in R2; metadata indexed in DynamoDB.
- Local-first: LocalStack and dev container for local testing.

## Responsibility boundaries
- DataCollection: fetch, chunk, and enqueue tasks.
- Recap: consume tasks and produce summarized articles.
- Web: serve search and article experiences (Frontend hosted on Cloudflare R2 for stage/prod, LocalStack S3 for local).
- Backend API: Cloudflare Workers (V8) to avoid cold starts; V8 isolates delivered roughly 2x faster warm execution than Lambda during profiling, while serving responses from the edge.

## Technology rationale
- SPA on R2: Cloudflare-managed domain + edge delivery without adding CloudFront on AWS.
- Article assets on R2: supports custom domains with HTTPS and zero egress cost for outbound.
- Backend on Workers: no cold starts and faster V8 isolate reuse than Lambda warm starts.
- DynamoDB: NoSQL lookups minimize joins—`/headlines`, `/article`, and `/suggest` each resolve in a single query; heavy content comes from the asset URL (R2) without extra DB fetches.

## Notifications
- A centralized notification service handles alerts via Discord webhooks.
- Channels are routed based on severity/type: `#error` (fatal), `#warn` (soft failures), `#batch` (completions), and `#access` (web logs).

## Asset Security
- Article assets (summaries, dialogs) are stored in R2 and accessed via time-limited presigned or public URLs.
- The backend generates the URLs on demand, ensuring controlled access to heavy content while keeping the SPA cacheable.
