# 2. Functional Specification
[日本語版](./jp/02_functional_spec.md)

## Feature list
### PoliTopicsDataCollection
- Fetch meeting records from the National Diet API for a date range.
- Split meeting speeches into prompt chunks based on Gemini token budget.
- Store prompts in S3 and create tasks in DynamoDB.
- Trigger runs via HTTP API (/run) or scheduled events.

### PoliTopicsRecap
- Poll DynamoDB for pending tasks.
- Run LLM summarization on single-chunk or chunked tasks.
- Store reduce results in S3 (prompt/result) and heavy article assets in R2.
- Persist article metadata to DynamoDB and heavy assets to R2.
- Send notifications via Discord for errors, warnings, and completions.

### PoliTopicsWeb
- Show latest articles (headlines).
- Client-side filtering by keyword, category, house, meeting, date.
- Suggest search terms from the backend API.
- Article detail view with summaries, dialogs, participants, keywords, and terms via public asset URLs (R2).

## Screen-level behavior
### Home (/) 
- Loads headlines from backend `/headlines`.
- Allows keyword search and filter selection (category, house, meeting, date range).
- Filters are applied client-side to the loaded headline set.
- Suggestions return headline metadata filtered by the current query input.

### Article detail (/article/:id)
- Fetches article details from `/article/:id`.
- Shows summary, simplified summary, dialog list, participants, keywords, and terms.
- Summaries are rendered as Markdown (GFM) to support rich text formatting (lists, links).

### Not found
- Any unknown route shows a simple not-found view with a link back to home.

## Input constraints
- DataCollection `/run` range accepts `YYYY-MM-DD` only. If missing, defaults to today (JST) for both `from` and `until`.
- DataCollection rejects `from > until`.
- Web `/headlines` limits: `limit` is clamped to 1-50; `start` must be >= 0.
- Web `/suggest` limits default to 5.

## Error conditions
- DataCollection:
  - `401 unauthorized` when `x-api-key` does not match `RUN_API_KEY`.
  - `400 invalid_json` when the JSON body is malformed.
  - `400 invalid_range` when `from > until` or range cannot be determined.
  - `500 server_misconfigured` when `RUN_API_KEY` is not set.
  - `500 prompt_over_budget` when the prompt exceeds the token budget.
  - `500 internal_error` for unexpected exceptions.
- Web backend:
  - `404 Article not found` for unknown article IDs.
  - `404 Not Found` for unknown routes.
  - `500 Internal error` for unhandled exceptions.

## Validation rules
- Recap validates task fields before processing:
  - `pk`, `llm`, `llmModel`, `prompt_url`, `result_url` are required.
  - `meeting` fields must be present and valid.
  - Chunked tasks must include chunk definitions with S3 URLs for prompts/results.
- DataCollection validates date range format as `YYYY-MM-DD`.

## Access behavior
- No role-based UI or API access is implemented.
- DataCollection `/run` is protected only by the `x-api-key` header.
