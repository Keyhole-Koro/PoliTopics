# 14. インシデント対応
[English Version](../../docs/14_incident_response.md)

- `retryAttempts >= 3` の未処理タスクは意図的にスキップする設計。上限を上げない限り再処理しない。
- LLM API が高負荷の場合、リクエストがスキップされることがある。レートリミットを確認し、プロバイダ回復後に再試行する。
- DataCollection の cron は過去 21 日から今日までをクエリする（会議後に議事録 API に反映されるまで数日遅れるため）。すでにタスクに存在する issueId は投入しない。
- フロントエンドの記事メタデータキャッシュは毎日更新。`index.html` に `headline-cache` が無い場合、SPA が `/headlines` をフェッチする。
