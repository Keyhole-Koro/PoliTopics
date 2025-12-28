# PoliTopics Monorepo

PoliTopics is a three-part pipeline that turns Japanese National Diet records into searchable summaries and a public web experience.

| Directory                   | Component                       | Summary                                                                               |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `PoliTopicsDataCollection/` | Ingestion + prompt fan-out      | Downloads records, chunks prompts, stores payloads in S3, registers tasks in DynamoDB |
| `PoliTopicsRecap/`          | LLM recap + article persistence | Processes tasks, generates summaries, stores articles in DynamoDB + S3                |
| `PoliTopicsWeb/`            | Web app + API                   | Next.js SPA + Fastify API backed by DynamoDB and S3                                   |

## Docs

- Docs index: `docs/README.md`
- Code reading guide: `docs/00_code_reading_guide.md`
- System overview: `docs/system_overview.md`
- Build & local environment guide: `docs/build.md`

## Repo Structure

The root repo stitches the three submodules together so they can share a unified Dev Container, LocalStack instance, and documentation while remaining deployable on their own.

```
.
├── PoliTopicsDataCollection/   # Ingestion + prompt fan-out (Lambda + Terraform)
│   ├── src/
│   ├── terraform/
│   └── doc/
├── PoliTopicsRecap/            # LLM recap + article persistence (Lambda + Terraform)
│   ├── src/
│   ├── terraform/
│   └── docs/
├── PoliTopicsWeb/              # Web app + API (Next.js + Fastify + Terraform)
│   ├── frontend/
│   ├── backend/
│   └── terraform/
├── docs/                       # Project documentation (split by topic)
│   ├── 00_code_reading_guide.md
│   ├── 01_project_overview.md
│   ├── 02_functional_spec.md
│   ├── 03_screen_flow.md
│   ├── 04_uiux_guide.md
│   ├── 05_system_diagram.md
│   ├── 06_architecture.md
│   ├── 07_api_spec.md
│   ├── 08_db_design.md
│   ├── 09_local_dev_setup.md
│   ├── 10_coding_standards.md
│   ├── 11_test_strategy.md
│   ├── 12_deploy.md
│   ├── 13_monitoring_logging.md
│   ├── 14_incident_response.md
│   ├── 15_security.md
│   ├── 16_dev_process.md
│   ├── 17_change_management.md
│   ├── 18_troubleshooting.md
│   ├── build.md
│   ├── system_overview.md
│   └── README.md
├── scripts/                    # Repo-level helpers
├── docker-compose.yml          # LocalStack + DynamoDB Admin UI
├── agent.md                    # Agent rules and workflow
└── README.md
```

## Agent Guide

See `agent.md` for AI agent rules, LocalStack requirements, and change log expectations.
