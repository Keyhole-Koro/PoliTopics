# PoliTopics Monorepo
[Japanese Version](./jp/README.md)

PoliTopics turns Japanese National Diet records into searchable summaries and a public web experience.
- Collects minutes, slices them into prompt-sized chunks, and registers LLM tasks
- Generates readable recaps plus assets, then stores metadata in DynamoDB
- Serves a SPA + API backed by DynamoDB/R2 with cached headlines

## Modules

| Directory                   | Component                       | Summary                                                                               |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `PoliTopicsDataCollection/` | Ingestion + prompt fan-out      | Downloads records, chunks prompts, stores payloads in S3, registers tasks in DynamoDB |
| `PoliTopicsRecap/`          | LLM recap + article persistence | Processes tasks, generates summaries, stores articles in DynamoDB + S3                |
| `PoliTopicsWeb/`            | Web app + API                   | Next.js SPA + Fastify API backed by DynamoDB and S3                                   |

## Architecture & Diagrams
- Mermaid sources (EN): `docs/diagrams/datacollection.mmd`, `docs/diagrams/recap.mmd`, `docs/diagrams/web.mmd`
- Mermaid sources (JP): `docs/diagrams/jp/datacollection.mmd`, `docs/diagrams/jp/recap.mmd`, `docs/diagrams/jp/web.mmd`
- System design overviews: `docs/05_system_diagram.md`, `docs/06_architecture.md`
- LocalStack endpoint: `http://localstack:4566` (see `docker-compose.yml` for the local stack)

## Documentation
- Index: `docs/README.md` (JP: `docs/jp/README.md`)
- Quick starts: `docs/09_local_dev_setup.md`, `docs/build.md`
- APIs/data: `docs/07_api_spec.md`, `docs/08_db_design.md`
- Operations: `docs/12_deploy.md`, `docs/13_monitoring_logging.md`

## Working Locally
- Dev Container + Docker Compose provide LocalStack and DynamoDB admin; see `docs/09_local_dev_setup.md` for bootstrap commands.
- Builds must target `local`, `stage`, or `prod` explicitly; wire env selection into your scripts.
- Tests use Jest across services; run the relevant suite when changing behavior.

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

## Frontend hosting & deploy
- Local/localstack: Terraform builds/uploads the SPA to the LocalStack S3 bucket when `frontend_deploy_enabled = true` (see `terraform/tfvars/localstack.tfvars`).
- Stage/Prod: Terraform no longer uploads the SPA. Deploy via GitHub Actions workflow `.github/workflows/deploy-frontend.yml`, which builds the frontend with `NEXT_PUBLIC_API_BASE_URL` from `terraform output backend_api_url` and syncs to Cloudflare R2 (set the R2 secrets in the repo before running).

## Agent Guide
See `agent.md` for AI agent rules, LocalStack requirements, and change log expectations.
