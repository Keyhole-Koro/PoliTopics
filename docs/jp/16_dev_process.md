# 16. 開発プロセス
[English Version](../../docs/16_dev_process.md)

## Git ワークフロー
- リポジトリ内で正式なワークフローは未定義 (TBD)。
- 推奨: feature branch -> PR -> review -> main へのマージ。

## レビュー
- 推奨: パイプラインロジックまたはインフラ変更には最低 1 名でレビュー。

## ローカル検証
- マージ前に各モジュールのテスト (`pnpm test` / `npm test`) を実行。`npm run lint` は用意されているが標準フローでは使っていない。
- コーディングエージェントは `agent.md` の指示に従い、コード/ドキュメント変更時はサブモジュールごとに `changes.agent.md` を更新する。
