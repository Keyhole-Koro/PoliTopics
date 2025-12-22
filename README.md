# PoliTopics Monorepo

PoliTopics is a three-part pipeline that turns Japanese National Diet records into searchable summaries and a public web experience.

| Directory | Component | Summary |
| --- | --- | --- |
| `PoliTopicsDataCollection/` | Ingestion + prompt fan-out | Downloads records, chunks prompts, stores payloads in S3, registers tasks in DynamoDB |
| `PoliTopicsRecap/` | LLM recap + article persistence | Processes tasks, generates summaries, stores articles in DynamoDB + S3 |
| `PoliTopicsWeb/` | Web app + API | Next.js SPA + Fastify API backed by DynamoDB and S3 |

## Docs

- System overview: `docs/system_overview.md`
- Build & local environment guide: `docs/build.md`

## Repo Structure

The root repo stitches the three submodules together so they can share a unified Dev Container, LocalStack instance, and documentation while remaining deployable on their own.
