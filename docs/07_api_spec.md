# 7. API Specification
[日本語版](./jp/07_api_spec.md)

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
Served from Cloudflare Workers (V8 + Hono). Interactive Swagger documentation is available at `/docs` (in local/dev environments).

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

### GET /suggest
Query params:
- `input` (string)
- `limit` (default 5)
- `categories`, `houses`, `meetings`, `dateStart`, `dateEnd` (optional filters)

Response:
```
{ "input": "<input>", "suggestions": ["..."] }
```

### GET /article/:id
Response:
- `200 { "article": { ..., "assetUrl": "https://..." } }` (assetUrl is a public/signed URL to R2)
- `404 { "message": "Article not found" }`

## Auth
- DataCollection `/run` requires `x-api-key`.
- Web API has no auth at the moment.
- Cloudflare sits in front of the Workers API to absorb basic abuse and edge-level attacks.

## Error codes
- DataCollection errors are defined above.
- Web API errors:
  - `404 Not Found` (unknown path)
  - `500 Internal error`

## Rate limiting
- No rate limiting is implemented in the code (TBD).
