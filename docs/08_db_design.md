# 8. DB Design
[日本語版](./jp/08_db_design.md)

## DynamoDB: LLM task table
Used by DataCollection (write) and Recap (read/update).

Table key
- PK: `pk` (internal UID; hash of `session + house + issueID`)

GSI
- `StatusIndex`: `status` (partition) + `createdAt` (sort)

Main attributes (see `PoliTopicsDataCollection/src/DynamoDB/tasks.ts` and `PoliTopicsRecap/src/tasks/types.ts`):
- `pk`: internal UID (hash of `session + house + issueID`)
- `status`: `pending` | `completed`
- `llm`: e.g. `gemini`
- `llmModel`: Gemini model name
- `retryAttempts`: integer
- `createdAt`, `updatedAt`: ISO timestamp
- `processingMode`: `single_chunk` | `chunked`
- `prompt_version`: prompt schema version used to build the task
- `prompt_url`: S3 URL for reduce or direct prompt
- `result_url`: S3 URL for final output
- `meeting`: metadata (issueID, house, meeting name, date, session, speech count)
- `chunks`: chunk list (`prompt_url`, `result_url`, `status`, optional `based_on_orders`)

## DynamoDB: Article table
Used by Recap (write) and Web (read).
Single-table pattern with thin indexes.

Main item
- `PK`: `A#<id>`
- `SK`: `META`
- `type`: `ARTICLE`
- `asset_url`: R2 URL for large asset JSON
- `GSI1PK`: `ARTICLE`
- `GSI1SK`: `<ISO date>`
- `GSI2PK`: `Y#YYYY#M#MM`
- `GSI2SK`: `<ISO date>`
- Fields: `title`, `date`, `month`, `imageKind`, `session`, `nameOfHouse`, `nameOfMeeting`, `categories`, `description`, `participants`, `keywords`, `terms`
Thin index items (fast filtering)
- `PK`: `CATEGORY#<name>` / `PERSON#<name>` / `KEYWORD#<kw>` / `IMAGEKIND#<kind>` /
  `SESSION#<session>` / `HOUSE#<house>` / `MEETING#<meeting>` / `ISSUE#<issueID>`
- `SK`: `Y#<YYYY>#M#<MM>#D#<ISO>#A#<id>`
- `type`: `THIN_INDEX`
- Light fields for list views
Uses
- `ISSUE#<issueID>` supports timeline queries for the same issue across meetings.

## R2 usage (S3 API)
- Prompt bucket: DataCollection prompt payloads and Recap result JSON.
- Article asset bucket: Recap stores `asset.json` containing heavy fields
  (`summary`, `soft_language_summary`, `middle_summary`, `dialogs`).
- Dialog entries include section arrays (`summary_sections`) for structured UI rendering.
