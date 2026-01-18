# 10. Coding Standards
[Japanese Version](./jp/10_coding_standards.md)

## Language and structure
- TypeScript across all services.
- Service code is split by domain (lambda, utils, DynamoDB, etc.).
- Frontend uses Next.js app directory with components and shared UI primitives.

## Naming conventions (observed)
- DynamoDB keys use uppercase prefixes (e.g., `PK`, `SK`, `GSI1PK`).
- Task items use snake_case field names matching DynamoDB storage.
- Environment variables are uppercase with underscores.

## Lint and formatting
- Frontend has ESLint (`npm --prefix frontend run lint`).
- Backend and pipeline services do not define a lint rule set in repo.
- Follow existing code style when editing in those modules.

## Directory conventions
- `PoliTopicsDataCollection/src`: ingestion Lambda, National Diet API client, DynamoDB tasks.
- `PoliTopicsRecap/src`: task processor, LLM clients, DynamoDB article persistence.
- `PoliTopicsWeb/frontend`: SPA.
- `PoliTopicsWeb/backend`: Fastify API.
