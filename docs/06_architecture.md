# 6. Architecture Design

## Technology choices (from repo)
- TypeScript across DataCollection, Recap, and Web services.
- AWS Lambda for serverless execution.
- DynamoDB for task tracking and article storage.
- S3 for prompt payloads and large article assets.
- Gemini API for summarization.
- Next.js for the SPA frontend and Fastify for the backend API.
- Terraform for infrastructure provisioning.

## Design principles
- Pipeline separation: ingestion, summarization, and serving are isolated services.
- Task-based processing: each meeting maps to a DynamoDB task.
- Cost-aware storage: large assets stored in S3, metadata indexed in DynamoDB.
- Local-first: LocalStack and dev container for local testing.

## Responsibility boundaries
- DataCollection: fetch, chunk, and enqueue tasks.
- Recap: consume tasks and produce summarized articles.
- Web: serve search and article experiences.
