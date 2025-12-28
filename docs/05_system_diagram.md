# 5. System Diagram

## Component map
- PoliTopicsDataCollection (Lambda + API Gateway + EventBridge)
- PoliTopicsRecap (Lambda + EventBridge Scheduler)
- PoliTopicsWeb (Next.js frontend + Fastify backend Lambda)
- DynamoDB (LLM task table, article table)
- S3 (prompt bucket, article asset bucket)
- External APIs (National Diet API, Gemini API)

## Data flow (text diagram)
1) National Diet API -> DataCollection Lambda
2) DataCollection Lambda -> S3 (prompt payloads)
3) DataCollection Lambda -> DynamoDB LLM task table
4) Recap Lambda -> S3 (chunk results, reduce results)
5) Recap Lambda -> DynamoDB article table + S3 article assets
6) Web backend -> DynamoDB + S3
7) Web frontend -> Web backend API

## Network and infra
- AWS-managed services (Lambda, DynamoDB, S3, API Gateway, EventBridge/Scheduler).
- Local development uses LocalStack for DynamoDB, S3, Lambda, and API Gateway.

## Environment-specific configuration
- Local: LocalStack endpoints, test credentials, local table/bucket names.
- Stage/Prod: AWS endpoints, real credentials, stage/prod table/bucket names.
- See `docs/system_overview.md` and each module `config.ts` for exact names.
