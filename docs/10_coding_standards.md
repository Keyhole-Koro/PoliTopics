# 10. Coding Standards

[日本語版](./jp/10_coding_standards.md)

## Language and structure

- TypeScript across all services.
- Service code is split by domain (lambda, utils, DynamoDB, etc.).
- Frontend uses Next.js app directory with components and shared UI primitives.

## Naming conventions

- DynamoDB keys use uppercase prefixes (e.g., `PK`, `SK`, `GSI1PK`).
- Task items use snake_case field names matching DynamoDB storage.
- Environment variables are uppercase with underscores.

## Lint and formatting

- Frontend has ESLint (`npm --prefix frontend run lint`), but linting is not enforced in CI.
- Backend and pipeline services include lint configs only nominally; lint is not part of the standard workflow.
- Follow existing code style when editing in those modules.

## Configuration handling

- Environment variables are centralized and validated in each module's `config.ts`.
- Avoid reading `process.env` directly in source code outside the config modules.

## Directory conventions

- `PoliTopicsDataCollection/src`: ingestion Lambda, National Diet API client, DynamoDB tasks.
- `PoliTopicsRecap/src`: task processor, LLM clients, DynamoDB article persistence.
- `PoliTopicsWeb/frontend`: SPA.
- `PoliTopicsWeb/workers/backend`: Hono API on Cloudflare Workers.
