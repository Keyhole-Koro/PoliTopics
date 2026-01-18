# 7. API Specification
[Japanese Version](./jp/07_api_spec.md)

## DataCollection API
### POST /run (API Gateway -> Lambda)
- Auth: `x-api-key` header must match `RUN_API_KEY`.
- Body (JSON, optional):
  - `from`: `YYYY-MM-DD`
  - `until`: `YYYY-MM-DD`
- If body is empty, defaults to today (JST) for both `from` and `until`.

Example:
```
POST /run
x-api-key: <RUN_API_KEY>
Content-Type: application/json

{"from":"2024-12-01","until":"2024-12-15"}
```

Responses:
- `200 {"message":"Event processed."}`
- `200 {"message":"No meetings found for the specified range."}`
- `401 {"error":"unauthorized"}`
- `400 {"error":"invalid_json"}`
- `400 {"error":"invalid_range","message":"from must be <= until"}`
- `500 {"error":"server_misconfigured"}` when `RUN_API_KEY` is not set
- `500 {"error":"prompt_over_budget"}` when prompt exceeds token budget
- `500 {"error":"internal_error"}` for unexpected errors

## Web backend API
Base path is the API Gateway stage root. The Lambda strips `/stage` from the path for stage deployments.
Interactive Swagger documentation is available at `/docs` (in local/dev environments).

### GET /healthz
- Response: `{ "status": "ok" }`

### GET /headlines
Query params:
- `limit` (1-50, default 6)
- `start` (offset, default 0)
- `end` (optional, overrides limit)

Response:
```
{ "items": [...], "limit": 6, "start": 0, "end": 6, "hasMore": true }
```

### GET /search
Query params:
- `words` (comma-separated)
- `categories` (comma-separated)
- `houses` (comma-separated)
- `meetings` (comma-separated)
- `dateStart` (ISO date string)
- `dateEnd` (ISO date string)
- `sort` (`date_desc` | `date_asc`, default `date_desc`)
- `limit` (default 20)

Response:
```
{ "query": { ...filters }, "items": [...], "total": <count> }
```

### GET /search/suggest
Query params:
- `input` (string)
- `limit` (default 5)
- `categories`, `houses`, `meetings`, `dateStart`, `dateEnd` (same as search)

Response:
```
{ "input": "<input>", "suggestions": ["..."] }
```

### GET /article/:id
Response:
- `200 { "article": { ..., "assetUrl": "https://..." } }`
- `404 { "message": "Article not found" }`

## Auth
- DataCollection `/run` requires `x-api-key`.
- Web API has no auth at the moment.

## Error codes
- DataCollection errors are defined above.
- Web API errors:
  - `404 Not Found` (unknown path)
  - `500 Internal error`

## Rate limiting
- No rate limiting is implemented in the code (TBD).
