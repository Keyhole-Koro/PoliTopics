# 6. Architecture Design
[Japanese Version](./jp/06_architecture.md)

## Technology choices (from repo)
- TypeScript across DataCollection, Recap, and Web services.
- AWS Lambda for serverless execution.
- DynamoDB for task tracking and article storage.
- S3 for prompt payloads and large article assets.
- Gemini API for summarization.
- Next.js for the SPA frontend.
- Fastify for the backend API, with Zod for validation and Swagger/OpenAPI for documentation.
- Terraform for infrastructure provisioning.

## Design principles
- Pipeline separation: ingestion, summarization, and serving are isolated services.
- Task-based processing: each meeting maps to a DynamoDB task.
- Cost-aware storage: large assets stored in S3, metadata indexed in DynamoDB.
- Local-first: LocalStack and dev container for local testing.

## Responsibility boundaries
- DataCollection: fetch, chunk, and enqueue tasks.
- Recap: consume tasks and produce summarized articles.
- Web: serve search and article experiences (Frontend hosted on Cloudflare R2 for stage/prod, LocalStack S3 for local).

## Notifications
- A centralized notification service handles alerts via Discord webhooks.
- Channels are routed based on severity/type: `#error` (fatal), `#warn` (soft failures), `#batch` (completions), and `#access` (web logs).

## Asset Security
- Article assets (summaries, dialogs) are stored in S3 and accessed via time-limited presigned URLs.
- The backend generates these signed URLs on demand, ensuring secure and controlled access to heavy content.
