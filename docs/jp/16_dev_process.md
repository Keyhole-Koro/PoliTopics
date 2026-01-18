# 16. 開発プロセス
[English Version](../../docs/16_dev_process.md)

## Git ワークフロー
- リポジトリ内で正式なワークフローは文書化されていません (TBD)。
- 推奨: feature branches -> PR -> review -> merge to main。

## レビュー
- 推奨: パイプラインロジックまたはインフラストラクチャの変更には少なくとも1人のレビュアー。

## ローカル検証
- マージ前にモジュールテスト (`pnpm test` または `npm run lint`) を実行する。
