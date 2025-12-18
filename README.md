# PoliTopics Monorepo

This repository glues together the three PoliTopics submodules so that the data collection pipeline, the recap/LLM reducers, and the public web experience can be developed from one place. The root-level Dev Container, Docker Compose file, and README wrap the individual instructions that used to live inside each submodule and highlight how the pieces interact.

| Directory | Component | Notes |
| --- | --- | --- |
| `PoliTopicsDataCollection/` | Diet record ingestion + prompt fan-out | TypeScript Lambda, Terraform modules, LocalStack bootstrap scripts |
| `PoliTopicsRecap/` | Gemini-backed recap/reduce tasks | TypeScript Lambda + scheduler, Terraform, Jest suites |
| `PoliTopicsWeb/` | Next.js frontend + Fastify backend + IaC | Monorepo with frontend/backend workspaces, shared mock data, Terraform modules |

## Getting Started

```bash
git clone git@github.com:Keyhole-Koro/PoliTopics.git
cd PoliTopics
git submodule update --init --recursive
```

From here you can either open the workspace with the provided Dev Container (recommended) or run the Docker Compose stack manually if you are using another editor.

## Unified Dev Container & Docker Compose

The files at the root of this repo replace the submodule-specific devcontainer/docker-compose definitions:

- `.devcontainer/devcontainer.json` targets the `workspace` service defined in `docker-compose.yml`.
- `.devcontainer/post-create.sh` installs dependencies for all submodules so they are ready for use once the container is built.
- `docker-compose.yml` launches a single LocalStack instance that every project can share plus a DynamoDB Admin UI for interactive inspection.

### Services

| Service | Purpose |
| --- | --- |
| `workspace` | Base Ubuntu dev box used by VS Code / Dev Containers. Ports `3333` (Next.js) and `4000` (backend Fastify) are forwarded for the web stack. |
| `localstack` | Local AWS emulation with the superset of services required by all three modules (DynamoDB, S3, Lambda, API Gateway, SQS, EventBridge, Scheduler, CloudWatch, IAM, STS). Exposed on `http://localhost:4566`. |
| `dynamodb-admin` | Optional UI for browsing the LocalStack DynamoDB tables at `http://localhost:8001`. |

### Using the Dev Container

1. Install the [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) or the `devcontainer` CLI.
2. Run `Dev Containers: Reopen in Container` (VS Code) or `devcontainer up --workspace-folder .`.
3. The `post-create` hook will:
   - install the PoliTopics Web workspaces (`npm install --workspaces --include-workspace-root`)
   - install dependencies for Recap and Data Collection via `pnpm`
4. Start the LocalStack stack when you need it: `docker compose up -d localstack dynamodb-admin` (the Dev Container automatically depends on it, so it will already be up when you attach).

### Without Dev Containers

If you prefer to stay on bare metal:

```bash
docker compose up -d localstack dynamodb-admin
export AWS_REGION=ap-northeast-3
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_ENDPOINT_URL=http://localhost:4566
export LOCALSTACK_URL=http://localhost:4566
```

Open new shells per submodule and run the same commands described below. The services share the same environment variables, so a single LocalStack instance works for all flows.

## Working in Each Module

### PoliTopics Data Collection (`PoliTopicsDataCollection/`)

Purpose: download Japanese National Diet transcripts, chunk them into Gemini prompts, store payloads in S3, and capture fan-out task state entirely in DynamoDB.

Common commands:

```bash
cd PoliTopicsDataCollection
pnpm install
pnpm test
pnpm build          # wraps scripts/build-lambda.js and refreshes dist/
```

LocalStack + Terraform flow (from `doc/terraform-localstack.md`):

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

Use `scripts/create-state-bucket.sh <env>` before applying to make sure the Terraform state bucket exists (pass `LOCALSTACK_ENDPOINT` when working locally). Invoke the deployed `/run` endpoint with `curl` once Terraform outputs the HTTP API URL and remember to include `x-api-key: $RUN_API_KEY`.
See `doc/terraform-localstack.md` inside the module for details on producing the zipped Lambda + layer artifacts when Terraform expects them.

### PoliTopics Recap (`PoliTopicsRecap/`)

Purpose: consume queued tasks, call Gemini to produce multi-layer recaps, and persist the results back into the PoliTopics tables.

Core commands:

```bash
cd PoliTopicsRecap
pnpm install
pnpm dev                          # ts-node local invoke against LocalStack
pnpm test                         # runs Jest suites
pnpm build:local                  # scripts/build-local-lambda.js (function + deps)
pnpm local:test:e2e               # long-running integration test
```

Terraform + LocalStack steps mirror the doc at `PoliTopicsRecap/docs/terraform-localstack.md`:

```bash
cd PoliTopicsRecap/terraform
export ENV=local
export TF_VAR_gemini_api_key="fake"
terraform init -backend-config=backends/local.hcl
terraform plan -var-file=tfvars/localstack.tfvars -out=tfplan
terraform apply tfplan
```

Run `LOCALSTACK_ENDPOINT_URL=http://localstack:4566 pnpm test -- --runInBand src/tasks/tasks.localstack.test.ts` to exercise the Dynamo flow once the stack is up.

### PoliTopics Web (`PoliTopicsWeb/`)

Purpose: deliver the public-facing SPA plus the search/headline API and supporting infrastructure.

Workflow (based on `PoliTopicsWeb/README.md`):

```bash
cd PoliTopicsWeb
npm install --workspaces --include-workspace-root
docker compose up --build       # from inside PoliTopicsWeb if you want its legacy stack
# or, from the repo root, rely on the shared LocalStack already running

npm run dev:backend             # Fastify server on http://localhost:4000
npm run dev:frontend            # Next.js on http://localhost:3333
npm run build:backend
npm run build:frontend
```

Seed mock data when LocalStack is running:

```bash
node shared/mock/upload_articles.js \
  --endpoint http://localhost:4566 \
  --bucket politopics-articles-local
```

Deployments still happen per the Terraform module inside `PoliTopicsWeb/terraform` (package the backend Lambda to `backend/dist/lambda.zip` and run the existing Terraform workflows for `stage`, `prod`, or `localstack`).

## Environment Variables & Secrets

The Docker Compose + Dev Container wiring exports reasonable defaults for LocalStack:

| Variable | Default | Used by |
| --- | --- | --- |
| `AWS_REGION` / `AWS_DEFAULT_REGION` | `ap-northeast-3` | All AWS SDK calls |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | `test` | LocalStack auth bypass |
| `AWS_ENDPOINT_URL` / `LOCALSTACK_URL` | `http://localstack:4566` | All AWS clients |
| `POLITOPICS_TABLE` | `politopics-localstack` | PoliTopics Web backend |
| `POLITOPICS_ARTICLE_BUCKET` | `politopics-articles-local` | PoliTopics Web backend & seeding steps |
| `LLM_TASK_TABLE` | `politopics-llm-tasks-local` | Recap + Data Collection workers |
| `ERROR_BUCKET` | `politopics-data-collection-errors-local` | Data Collection Lambda |
| `RUN_API_KEY` | `local-dev` | Data Collection `/run` entry point |

Secrets such as `GOOGLE_API_KEY`, `GEMINI_API_KEY`, or production `RUN_API_KEY` **must not** be committed. Provide them through your shell, `.env` files that stay local, or Terraform variable overrides (see each module's docs for the expected names).

## Observability & Debugging Aids

- Visit `http://localhost:8001` for the DynamoDB Admin UI.
- Use `aws --endpoint-url http://localhost:4566 ...` commands from inside the Dev Container to inspect LocalStack resources.
- Tail the LocalStack logs with `docker compose logs -f localstack` when Terraform, Lambda invocations, or AWS CLI commands misbehave.

With this setup you can switch between collecting transcripts, generating recaps, and iterating on the frontend/backend without rebuilding separate environments.
