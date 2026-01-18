# 7. API 仕様
[English Version](../../docs/07_api_spec.md)

## DataCollection API
### POST /run (API Gateway -> Lambda)
- 認証: `x-api-key` ヘッダーは `RUN_API_KEY` と一致する必要があります。
- ボディ (JSON, オプション):
  - `from`: `YYYY-MM-DD`
  - `until`: `YYYY-MM-DD`
- ボディが空の場合、`from` と `until` の両方が今日 (JST) にデフォルト設定されます。

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
- `500 {"error":"server_misconfigured"}` `RUN_API_KEY` が設定されていない場合
- `500 {"error":"prompt_over_budget"}` プロンプトがトークン予算を超えた場合
- `500 {"error":"internal_error"}` 予期しないエラーの場合

## Web backend API
ベースパスは API Gateway のステージルートです。Lambda はステージデプロイのためにパスから `/stage` を取り除きます。
インタラクティブな Swagger ドキュメントは `/docs` で利用可能です (local/dev 環境)。

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

### GET /search
クエリパラメータ:
- `words` (カンマ区切り)
- `categories` (カンマ区切り)
- `houses` (カンマ区切り)
- `meetings` (カンマ区切り)
- `dateStart` (ISO 日付文字列)
- `dateEnd` (ISO 日付文字列)
- `sort` (`date_desc` | `date_asc`, デフォルト `date_desc`)
- `limit` (デフォルト 20)

レスポンス:
```
{ "query": { ...filters }, "items": [...], "total": <count> }
```

### GET /search/suggest
クエリパラメータ:
- `input` (文字列)
- `limit` (デフォルト 5)
- `categories`, `houses`, `meetings`, `dateStart`, `dateEnd` (検索と同じ)

レスポンス:
```
{ "input": "<input>", "suggestions": ["..."] }
```

### GET /article/:id
レスポンス:
- `200 { "article": { ..., "assetUrl": "https://..." } }`
- `404 { "message": "Article not found" }`

## 認証
- DataCollection `/run` は `x-api-key` が必要です。
- Web API は現在認証がありません。

## エラーコード
- DataCollection エラーは上記で定義されています。
- Web API エラー:
  - `404 Not Found` (不明なパス)
  - `500 Internal error`

## レート制限
- コード内でレート制限は実装されていません (TBD)。
