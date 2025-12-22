# Agent Guide — PoliTopics

PoliTopics is a three-part pipeline that turns Japanese National Diet records
into searchable summaries and a public web experience.

This repository is designed to be developed collaboratively by humans and
AI agents (e.g. Codex, Gemini). All agents must strictly follow the rules
defined in this document.

---

## Repository Structure

| Directory                   | Component                       | Summary                                                                               |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `PoliTopicsDataCollection/` | Ingestion + prompt fan-out      | Downloads records, chunks prompts, stores payloads in S3, registers tasks in DynamoDB |
| `PoliTopicsRecap/`          | LLM recap + article persistence | Processes tasks, generates summaries, stores articles in DynamoDB + S3                |
| `PoliTopicsWeb/`            | Web app + API                   | Next.js SPA + Fastify API backed by DynamoDB and S3                                   |

Infrastructure provisioning is managed **exclusively with Terraform** and is
**out of scope** for this repository.

## LocalStack Endpoint (MUST)

For local and development environments, all AWS service access must use
the following LocalStack endpoint:

- **LocalStack URL:** `http://localstack:4566`

Rules:

- Do NOT hardcode real AWS endpoints in application code.
- The LocalStack endpoint must be referenced via centralized configuration
  (e.g. `config.ts`), not scattered literals.
- Tests and local executions must assume `localstack:4566` as the default
  AWS endpoint.
- If the endpoint needs to differ, it must be overridden in configuration,
  not in code logic.

---

## Hard Requirements (MUST)

### 1. Always run tests when adding or changing functionality

- Any feature addition, behavior change, or refactor **must run the test suite**.
- Tests are written using **Jest**.
- When appropriate, add or update tests to cover the change.

---

### 2. Do NOT include infrastructure provisioning code

- No Terraform, CDK, CloudFormation, or AWS SDK-based resource creation.
- This repository contains **application code only**.
- Infrastructure is defined and applied separately via Terraform.

---

### 3. Use LocalStack for AWS service access in local/dev

- Any access to AWS services (S3, DynamoDB, SQS, SNS, EventBridge, etc.) must:
  - Use **LocalStack** for local and development workflows
  - Avoid assumptions about direct access to real AWS accounts
- LocalStack endpoints, regions, and credentials must be configurable.

---

### 4. Centralize configuration; minimize environment variables

- Environment variables should be **minimized**, especially outside:
  - `local`
  - `stage`
  - `prod`
- Configuration must be centralized in a single module such as `config.ts`.
- Application code must **not** read scattered `process.env` values directly.
- Prefer:
  - base defaults
  - environment-specific overrides

---

### 5. Require explicit build-time environment selection

- Builds must explicitly target one of:
  - `local`
  - `stage`
  - `prod`
- Environment selection must happen **at build time**, not implicitly at runtime.
- Example patterns:
  - `build:local`
  - `build:stage`
  - `build:prod`

---

### 6. Error messages must be logged with debugging context

- All errors must be written to **stdout / stderr or structured logs**.
- Error output should include, when available:
  - What failed
  - Where it failed
  - Relevant identifiers (task ID, article ID, request ID, etc.)
- Logs should provide **actionable debugging hints**, not generic messages.

---

### 7. Schema or specification changes must be documented

- Any change to:
  - Data schemas
  - API contracts
  - Task formats
  - Prompt structures
- Must be reflected in the appropriate **`docs/` documentation**.
- Code and documentation must remain in sync.

---

### 8. Record changes per submodule in `changes.agent.md`

- For **each modified submodule**, record changes in:
  - `PoliTopicsDataCollection/changes.agent.md`
  - `PoliTopicsRecap/changes.agent.md`
  - `PoliTopicsWeb/changes.agent.md`
- If the file does not exist, **create it**.

Each entry must include:

- Agent name
- Date/time (**JST – Japan Standard Time**)
- Keywords
- Topic
- Detailed description

### 9. List changed files in each change entry (MUST)

Each change entry in `changes.agent.md` must explicitly list
all files modified as part of that entry.

Rules:

- The file list must use **relative paths from the repository root**.
- Include all relevant files:
  - Source code
  - Test files
  - Configuration files
  - Documentation
- Do NOT include generated files.
- Do NOT include files that were considered but not changed.

---

## If the agent cannot run shell commands (MUST)

If the agent environment does not allow executing shell commands (e.g. cannot run `npm`, `pnpm`, `jest`, `docker`, etc.),
the agent must NOT claim that commands were executed.

Instead, the agent must:

1. Clearly state that it cannot execute shell commands in the current environment.
2. Provide the exact commands the owner should run locally/CI.
3. Specify what logs/output the owner should paste back, so the agent can diagnose failures.

### What to ask the owner to run

At minimum, request:

- Install/build commands (if relevant)
- Jest test command(s)
- Lint/typecheck commands (if present in the repo)
- Any LocalStack startup/health checks (if AWS interactions are involved)

### Required logs/output to request

Ask the owner to paste:

- Full command output (stdout + stderr), not only the last lines
- The exact command(s) executed
- Node.js version and package manager version (if JS/TS):
  - `node -v`
  - `npm -v` or `pnpm -v` or `yarn -v`
- Relevant environment selection used at build time (local/stage/prod)
- If LocalStack is involved:
  - LocalStack logs around the failure time
  - The service endpoint(s) being used
  - Any request IDs / task IDs / article IDs shown in logs

### Standard prompt the agent should output

When blocked, the agent should output a “Run this and paste results” section like:

#### Run this locally

- `<command 1>`
- `<command 2>`
- ...

#### Paste back

- Full stdout/stderr for each command
- Versions: `node -v`, `<pkg-manager> -v`
- Build target env (local/stage/prod)
- Any IDs shown in logs (taskId/articleId/requestId)
- LocalStack logs (if applicable)

---

## Change Log Update Rules (IMPORTANT)

### Entry lifecycle

- A single entry represents **one coherent topic or work unit**.
- When the topic changes significantly, **start a new entry**.

### Changes after review

- Minor changes made **after discussion or review with the repository owner**
  (e.g. wording fixes, small refactors, config tweaks, log improvements)
  must be appended under a section titled:

  `### Changes After Review`

- Do **not** create a new entry for small post-review adjustments
  if they belong to the same topic.

### When to create a new entry

Create a new entry if:

- The purpose of the change is different
- The affected responsibility or behavior changes
- A new feature, schema, or workflow is introduced
- The discussion topic with the owner has clearly shifted

### Principle

- One topic = one entry
- Refinements after feedback = `Changes After Review`

---

## Recommended Practices (SHOULD)

- Keep changes small and reviewable
- Prefer explicit behavior over implicit assumptions
- Make configuration changes easy to trace
- Keep LocalStack-specific logic isolated and configurable
- Fail fast, but log clearly and informatively

---

## Change Workflow Checklist

### Before implementation

- Identify affected submodules
- Confirm whether schemas, APIs, or specs will change
- Identify required configuration changes

### During implementation

- Centralize new config in `config.ts`
- Use LocalStack for AWS interactions
- Log meaningful errors with sufficient context
- Avoid adding infrastructure or provisioning code

### After implementation

- Run Jest tests
- Update `docs/` if schemas/specs changed
- Append entries to each affected `changes.agent.md`
- Verify builds work with explicit environment selection

---

## Pull Request / Change Summary Expectations

Include:

- User-facing summary of changes
- Jest test command(s) and results
- LocalStack-related notes (services, endpoints)
- Configuration changes (new keys, env differences)
- Documentation updates (if applicable)
- `changes.agent.md` entries added
