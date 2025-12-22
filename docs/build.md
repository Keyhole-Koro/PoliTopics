# Build & Local Environment Guide

This guide focuses on setup, builds, and local workflows. For architecture and data flow, see `docs/system_overview.md`.

## Getting Started

```bash
git clone git@github.com:Keyhole-Koro/PoliTopics.git
cd PoliTopics
git submodule update --init --recursive
```

Open the workspace with the Dev Container (recommended) or run Docker Compose manually.

## Dev Container & Docker Compose

The root-level files replace submodule-specific devcontainer/docker-compose definitions:

- `.devcontainer/devcontainer.json` targets the `workspace` service in `docker-compose.yml`.
- `.devcontainer/post-create.sh` installs dependencies for all submodules.
- `docker-compose.yml` launches LocalStack + DynamoDB Admin UI.

### Services

| Service | Purpose |
| --- | --- |
| `workspace` | Base Ubuntu dev box; forwards `3333` (Next.js) and `4000` (Fastify) |
| `localstack` | AWS emulation (DynamoDB, S3, Lambda, API Gateway, etc.) at `http://localhost:4566` |
| `dynamodb-admin` | DynamoDB UI at `http://localhost:8001` |

### Using the Dev Container

1. Install the VS Code Dev Containers extension or the `devcontainer` CLI.
2. Run `Dev Containers: Reopen in Container` or `devcontainer up --workspace-folder .`.
3. The `post-create` hook installs:
   - PoliTopics Web workspaces (`npm install --workspaces --include-workspace-root`)
   - Recap + Data Collection dependencies via `pnpm`
4. Start LocalStack when you need it: `docker compose up -d localstack dynamodb-admin`.

### Without Dev Containers

```bash
docker compose up -d localstack dynamodb-admin
export AWS_REGION=ap-northeast-3
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_ENDPOINT_URL=http://localhost:4566
export LOCALSTACK_URL=http://localhost:4566
```

## Module Workflows

### PoliTopics Data Collection (`PoliTopicsDataCollection/`)

```bash
cd PoliTopicsDataCollection
pnpm install
pnpm test
pnpm build          # scripts/build-lambda.js + dist refresh
```

LocalStack + Terraform (from `doc/terraform-localstack.md`):

```bash
cd PoliTopicsDataCollection
pnpm install && pnpm build
cd terraform
export ENV=local
export TF_VAR_gemini_api_key="fake"
terraform init -backend-config=backends/local.hcl
terraform plan -var-file=tfvars/localstack.tfvars -out=tfplan
terraform apply tfplan
```

Use `scripts/create-state-bucket.sh <env>` before applying when needed.

### PoliTopics Recap (`PoliTopicsRecap/`)

```bash
cd PoliTopicsRecap
pnpm install
pnpm dev                          # ts-node local invoke
pnpm test                         # Jest suites
pnpm build:local                  # scripts/build-local-lambda.js
pnpm local:test:e2e               # long-running integration test
```

Terraform + LocalStack (see `PoliTopicsRecap/docs/terraform-localstack.md`):

```bash
cd PoliTopicsRecap/terraform
export ENV=local
export TF_VAR_gemini_api_key="fake"
terraform init -backend-config=backends/local.hcl
terraform plan -var-file=tfvars/localstack.tfvars -out=tfplan
terraform apply tfplan
```

### PoliTopics Web (`PoliTopicsWeb/`)

```bash
cd PoliTopicsWeb
npm install --workspaces --include-workspace-root
npm run dev:backend             # http://localhost:4000
npm run dev:frontend            # http://localhost:3333
npm run build:backend
npm run build:frontend
```

Seed mock data when LocalStack is running:

```bash
node shared/mock/upload_articles.js \
  --endpoint http://localhost:4566 \
  --bucket politopics-articles-local
```

## Environment Variables & Secrets

The Dev Container and Docker Compose provide LocalStack defaults:

| Variable | Default | Used by |
| --- | --- | --- |
| `AWS_REGION` / `AWS_DEFAULT_REGION` | `ap-northeast-3` | All AWS SDK calls |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | `test` | LocalStack auth bypass |
| `AWS_ENDPOINT_URL` / `LOCALSTACK_URL` | `http://localhost:4566` | All AWS clients |
| `POLITOPICS_TABLE` | `politopics-localstack` | Web backend |
| `POLITOPICS_ARTICLE_BUCKET` | `politopics-articles-local` | Web backend + seed scripts |
| `LLM_TASK_TABLE` | `politopics-llm-tasks-local` | Recap + Data Collection |
| `ERROR_BUCKET` | `politopics-data-collection-errors-local` | Data Collection Lambda |
| `RUN_API_KEY` | `local-dev` | Data Collection `/run` entry point |

Secrets such as `GOOGLE_API_KEY`, `GEMINI_API_KEY`, or production `RUN_API_KEY` must not be committed. Provide them via local `.env` files or Terraform variable overrides.

## Observability

- DynamoDB Admin UI: `http://localhost:8001`
- LocalStack logs: `docker compose logs -f localstack`
- AWS CLI (LocalStack): `aws --endpoint-url http://localhost:4566 ...`
