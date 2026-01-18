# 14. インシデント対応
[English Version](../../docs/14_incident_response.md)

## 初動対応
- 失敗している Lambda の CloudWatch ログを確認する。
- DataCollection の場合、`ERROR_BUCKET` で失敗ペイロードを検査する。
- DynamoDB テーブルの健全性とスロットリングメトリクスを確認する。

## エスカレーション
- 特定のサービス (DataCollection, Recap, Web) の担当メンテナにエスカレーションする。
- 失敗したリクエスト ID と関連するログの抜粋を提供する。

## 復旧フロー
- タスクが作成されなかった場合、影響を受ける日付範囲に対して DataCollection `/run` を再実行する。
- スケジューラに保留中のタスクを取得させるか、手動で呼び出して Recap を再実行する。
- コードのリグレッションが疑われる場合、影響を受ける Lambda を再デプロイする。
