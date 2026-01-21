# Technology Choices and Rationale
[日本語版](./jp/tech_choices.md)

## SPA hosting (Cloudflare R2)
- Domain is managed in Cloudflare, so using R2 keeps DNS + hosting in one place.
- R2 serves from the edge without adding CloudFront on AWS; S3 alone would require CloudFront for equivalent delivery.

## Article assets (Cloudflare R2)
- Supports custom domains with HTTPS easily, and outbound egress is free.
- Public/signed URLs keep heavy content off DynamoDB queries.

## Backend (Cloudflare Workers V8 + Hono)
- No cold starts; V8 isolates measured roughly 2× faster warm execution than Lambda.
- Edge execution shortens user latency versus centralized regions.

## Prompts and reduce outputs (Amazon S3)
- Native S3 used for prompt and reduce payloads, keeping ingestion simple while assets/SPA live on R2.

## DynamoDB
- NoSQL lookups minimize joins: `/headlines`, `/article`, `/suggest` each resolve in a single query.
- Heavy content is fetched via the asset URL (R2), so additional DB lookups for summaries/dialogs are unnecessary.
