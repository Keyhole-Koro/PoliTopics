# 7. API 仕様

[English Version](../../docs/07_api_spec.md)

## DataCollection API

### POST /run (API Gateway -> Lambda)

- 認証: `x-api-key` ヘッダーを `RUN_API_KEY` と一致させる。
- ボディ (JSON, オプション):
  - `from`: `YYYY-MM-DD`
  - `until`: `YYYY-MM-DD`
- ボディが空の場合、`from` と `until` の両方を今日 (JST) にデフォルト設定。

例:

```
POST /run
x-api-key: <RUN_API_KEY>
Content-Type: application/json

{"from":"2024-12-01","until":"2024-12-15"}
```

レスポンス:

- `200 {"message":"Event processed."}`
- `200 {"message":"No meetings found for the specified range."}`
- `401 {"error":"unauthorized"}`
- `400 {"error":"invalid_json"}`
- `400 {"error":"invalid_range","message":"from must be <= until"}`
- `500 {"error":"server_misconfigured"}` (`RUN_API_KEY` 未設定)
- `500 {"error":"prompt_over_budget"}` (プロンプトがトークン予算超過)
- `500 {"error":"internal_error"}` (予期しないエラー)

## Web backend API

Cloudflare Workers (V8 + Hono) で提供。インタラクティブな Swagger は `/docs` (local/dev) にある。

### GET /healthz

- レスポンス: `{ "status": "ok" }`

### GET /headlines

クエリパラメータ:

- `limit` (1-50, デフォルト 6)
- `start` (オフセット, デフォルト 0)
- `end` (オプション, limit を上書き)

レスポンス:

```
{ "items": [...], "limit": 6, "start": 0, "end": 6, "hasMore": true }
```

### GET /suggest

クエリパラメータ:

- `input` (文字列)
- `limit` (デフォルト 5)
- `categories`, `houses`, `meetings`, `dateStart`, `dateEnd` (任意のフィルタ)

レスポンス:

```
{ "input": "<input>", "suggestions": ["..."] }
```

### GET /article/:id

レスポンス:

- `200 { "article": { ..., "assetUrl": "https://..." } }` (`assetUrl` は R2 の公開URL)
- `404 { "message": "Article not found" }`

## 認証

- DataCollection `/run` は `x-api-key` が必要。
- Web API は認証なしだが、Cloudflare がエッジで攻撃トラフィックを吸収する。

## エラーコード

- DataCollection エラーは上記で定義されています。
- Web API エラー:
  - `404 Not Found` (不明なパス)
  - `500 Internal error`

## レート制限

- コード内でレート制限は未実装 (TBD)。
