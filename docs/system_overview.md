# PoliTopics System Overview
[日本語版](./jp/system_overview.md)

## Component Roles

### PoliTopicsDataCollection
- Role: Fetch National Diet records, split into LLM-ready prompts, store prompts in S3, and register tasks in DynamoDB.
- Main flow:
  - Fetch meeting records from the National Diet API.
  - Split long text into LLM-sized chunks.
  - Store prompt JSON in S3 and record URLs in tasks.
  - Create issue-level tasks in the DynamoDB LLM task table.

### PoliTopicsRecap
- Role: Pull tasks from DynamoDB, run LLM summarization, and persist articles.
- Main flow:
  - Read pending tasks from the DynamoDB task table.
  - Load prompts from R2 and run map/reduce summarization.
  - Store heavy article assets in R2.
  - Write article metadata + indexes into the DynamoDB article table.
  - Update task status to completed.

### PoliTopicsWeb
- Role: Serve a web app to search and read generated articles.
- Main flow:
  - frontend: Next.js SPA for search and article detail UI (SPA assets on R2).
  - backend: Cloudflare Workers (V8) + Hono API that queries DynamoDB and fetches assets from R2.
  - infra/terraform: Infrastructure for local development (LocalStack) and production.

## Data Flow
1. DataCollection fetches records and stores prompts in S3.
2. DataCollection creates tasks in the DynamoDB LLM task table.
3. Recap processes tasks and generates summaries with LLMs.
4. Recap writes articles to DynamoDB and stores assets in R2.
5. Web backend serves articles from DynamoDB + R2 to the frontend and exposes public/signed asset URLs.

## DB Schema Overview

### LLM Task Table (DynamoDB)
- Used by: DataCollection (write), Recap (read/update)
- Table definition:
  - PK: `pk` (string, internal task UID: hash of `session + house + issueID`)
  - GSI: `StatusIndex` (`status` + `createdAt`)
- Main attributes (IssueTask / TaskItem):
  - `pk`: internal task UID (hash of `session + house + issueID`)
  - `status`: `pending` | `completed`
  - `llm`: e.g. `gemini`
  - `llmModel`: model name
  - `retryAttempts`: retry count
  - `createdAt`, `updatedAt`: ISO timestamp
  - `processingMode`: DataCollection=`single_chunk` | `chunked`, Recap=`direct` | `chunked`
  - `prompt_url`: S3 URL for reduce prompt
  - `result_url`: S3 URL for reduce result
  - `meeting`: meeting metadata
    - `issueID`, `nameOfMeeting`, `nameOfHouse`, `date`, `numberOfSpeeches`, `session`
  - `chunks`: chunk list
    - `id`, `prompt_key`, `prompt_url`, `result_url`, `status` (`notReady` | `ready`)

### Article Table (DynamoDB)
- Used by: Recap (write), Web (read)
- Table definition:
  - PK: `PK` (string)
  - SK: `SK` (string)
  - GSI1: `ArticleByDate` (`GSI1PK`, `GSI1SK`)
  - GSI2: `MonthDateIndex` (`GSI2PK`, `GSI2SK`)
- Main item types:
  - Article main item
    - `PK`: `A#<id>`
    - `SK`: `META`
    - `type`: `ARTICLE`
    - `asset_url`: R2 pointer to detailed asset JSON (returned as signed/public URL by API)
    - `GSI1PK`: `ARTICLE`, `GSI1SK`: `<ISO-UTC date>`
    - `GSI2PK`: `Y#YYYY#M#MM`, `GSI2SK`: `<ISO-UTC date>`
    - Key fields: `title`, `date`, `month`, `imageKind`, `session`, `nameOfHouse`, `nameOfMeeting`,
      `categories`, `description`, `participants`, `keywords`, `terms`, etc.
    - `summary`, `soft_language_summary`, `middle_summary`, `dialogs` are stored in R2 and referenced via `asset_url`.
  - Thin index items (list/search)
    - `PK`: `CATEGORY#<name>` / `PERSON#<name>` / `KEYWORD#<kw>` / `IMAGEKIND#<kind>` /
      `SESSION#<session>` / `HOUSE#<house>` / `MEETING#<meeting>`
    - `SK`: `Y#<YYYY>#M#<MM>#D#<ISO-UTC>#A#<id>`
    - `type`: `THIN_INDEX`
    - Holds metadata for card rendering: title, date, imageKind, description, categories, keywords, participants.

## Notes: Storage
- Prompts and reduce outputs: Amazon S3 (DataCollection + Recap).
- Article assets and SPA build output: Cloudflare R2 (served via public/signed URLs).
