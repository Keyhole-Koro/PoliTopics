# PoliTopics Monorepo
[English Version](../README.md) ・ 本番: https://politoipcs.net

PoliTopics は、AI によって分かりやすく、恣意的な操作のない国会情報を提供するプロジェクトです。
- 会議録を収集し、プロンプトサイズに分割して LLM タスクを登録
- 読みやすい要約とアセットを生成し、メタデータを DynamoDB に保存
- DynamoDB/R2 をバックエンドにした SPA + API を提供し、ヘッドラインをキャッシュ

## モジュール

| ディレクトリ                   | コンポーネント                       | 概要                                                                               |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `PoliTopicsDataCollection/` | 収集 + タスク生成      | 会議録のダウンロード、プロンプトのチャンク化、プロンプトのS3保存、DynamoDBへのタスク登録 |
| `PoliTopicsRecap/`          | LLM要約 + 記事永続化 | タスクの処理、要約の生成、DynamoDB + R2 への記事保存                |
| `PoliTopicsWeb/`            | Webアプリ + API                   | DynamoDB と R2 をバックエンドとする Next.js SPA + Cloudflare Workers (Hono) API           |

## アーキテクチャと図
- Mermaid ソース (英): `docs/diagrams/datacollection.mmd`, `docs/diagrams/recap.mmd`, `docs/diagrams/web.mmd`
- Mermaid ソース (日): `docs/diagrams/jp/datacollection.mmd`, `docs/diagrams/jp/recap.mmd`, `docs/diagrams/jp/web.mmd`
- システム設計: `docs/jp/05_system_diagram.md`, `docs/jp/06_architecture.md`
- LocalStack エンドポイント: `http://localstack:4566`（ローカル構成は `docker-compose.yml` を参照）

## ドキュメント
- インデックス: `docs/jp/README.md`（英: `docs/README.md`）
- クイックスタート: `docs/jp/09_local_dev_setup.md`
- アーキテクチャ/選定理由: `docs/jp/06_architecture.md`, `docs/jp/tech_choices.md`
- API/データ: `docs/jp/07_api_spec.md`, `docs/jp/08_db_design.md`
- 運用: `docs/jp/12_deploy.md`, `docs/jp/13_monitoring_logging.md`

## ローカル開発
- Dev Container + Docker Compose で LocalStack と DynamoDB 管理 UI を提供します。起動手順は `docs/jp/09_local_dev_setup.md` を参照してください。
- ビルド対象は `local` / `stage` / `prod` を明示します。スクリプトに環境選択を組み込んでください。
- テストは各サービスで Jest を使用します。挙動を変える際は関連スイートを実行してください。

```
.
├── PoliTopicsDataCollection/   # 収集 + プロンプトファンアウト (Lambda + Terraform)
│   ├── src/
│   ├── terraform/
│   └── doc/
├── PoliTopicsRecap/            # LLM要約 + 記事永続化 (Lambda + Terraform)
│   ├── src/
│   ├── terraform/
│   └── docs/
├── PoliTopicsWeb/              # Webアプリ + API (Next.js + Workers/Hono + Terraform)
│   ├── frontend/
│   ├── backend/               # (旧 Lambda)、現行は workers/backend の Hono を使用
│   └── terraform/
├── docs/                       # プロジェクトドキュメント (トピック別)
│   ├── 00_code_reading_guide.md
│   ├── 01_project_overview.md
│   ├── 02_functional_spec.md
│   ├── 03_screen_flow.md
│   ├── 04_uiux_guide.md
│   ├── 05_system_diagram.md
│   ├── 06_architecture.md
│   ├── 07_api_spec.md
│   ├── 08_db_design.md
│   ├── 09_local_dev_setup.md
│   ├── 10_coding_standards.md
│   ├── 11_test_strategy.md
│   ├── 12_deploy.md
│   ├── 13_monitoring_logging.md
│   ├── 14_incident_response.md
│   ├── 15_security.md
│   ├── 16_dev_process.md
│   ├── 17_change_management.md
│   ├── 18_troubleshooting.md
│   ├── system_overview.md
│   └── README.md
├── scripts/                    # リポジトリレベルのヘルパー
├── docker-compose.yml          # LocalStack + DynamoDB Admin UI
├── agent.md                    # エージェントルールとワークフロー
└── README.md
```

## フロントエンドのホスティングとデプロイ
- Local/localstack: `frontend_deploy_enabled = true` の場合、Terraform が SPA をビルドして LocalStack バケットにアップロードします (`terraform/tfvars/localstack.tfvars` を参照)。
- Stage/Prod: GitHub Actions ワークフロー `.github/workflows/deploy-frontend.yml` でデプロイします。`terraform output backend_api_url` の `NEXT_PUBLIC_API_BASE_URL` でビルドし、Cloudflare R2 に同期します (事前に R2 シークレットを設定)。

## エージェントガイド
AIエージェントのルール、LocalStackの要件、変更ログの期待事項については `agent.md` を参照してください。
