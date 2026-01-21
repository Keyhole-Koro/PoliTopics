# PoliTopics Monorepo
[English Version](../README.md)

PoliTopics は、日本の国会会議録を検索可能な要約と公開 Web 体験に変換する 3 部構成のパイプラインです。
- 会議録を収集し、プロンプトサイズに分割して LLM タスクを登録
- 読みやすい要約とアセットを生成し、メタデータを DynamoDB に保存
- DynamoDB/R2 をバックエンドにした SPA + API を提供し、ヘッドラインをキャッシュ

## モジュール

| ディレクトリ                   | コンポーネント                       | 概要                                                                               |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| `PoliTopicsDataCollection/` | 収集 + プロンプトファンアウト      | 会議録のダウンロード、プロンプトのチャンク化、ペイロードのS3への保存、DynamoDBへのタスク登録 |
| `PoliTopicsRecap/`          | LLM要約 + 記事永続化 | タスクの処理、要約の生成、DynamoDB + S3への記事保存                |
| `PoliTopicsWeb/`            | Webアプリ + API                   | DynamoDBとS3をバックエンドとするNext.js SPA + Fastify API                                   |

## アーキテクチャと図
- Mermaid ソース (英): `docs/diagrams/datacollection.mmd`, `docs/diagrams/recap.mmd`, `docs/diagrams/web.mmd`
- Mermaid ソース (日): `docs/diagrams/jp/datacollection.mmd`, `docs/diagrams/jp/recap.mmd`, `docs/diagrams/jp/web.mmd`
- システム設計: `docs/jp/05_system_diagram.md`, `docs/jp/06_architecture.md`
- LocalStack エンドポイント: `http://localstack:4566`（ローカル構成は `docker-compose.yml` を参照）

## ドキュメント
- インデックス: `docs/jp/README.md`（英: `docs/README.md`）
- クイックスタート: `docs/jp/09_local_dev_setup.md`, `docs/jp/build.md`
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
├── PoliTopicsWeb/              # Webアプリ + API (Next.js + Fastify + Terraform)
│   ├── frontend/
│   ├── backend/
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
│   ├── build.md
│   ├── system_overview.md
│   └── README.md
├── scripts/                    # リポジトリレベルのヘルパー
├── docker-compose.yml          # LocalStack + DynamoDB Admin UI
├── agent.md                    # エージェントルールとワークフロー
└── README.md
```

## フロントエンドのホスティングとデプロイ
- Local/localstack: `frontend_deploy_enabled = true` の場合、Terraform が SPA をビルドして LocalStack S3 バケットにアップロードします (`terraform/tfvars/localstack.tfvars` を参照)。
- Stage/Prod: Terraform は SPA をアップロードしません。GitHub Actions ワークフロー `.github/workflows/deploy-frontend.yml` を介してデプロイします。これは `terraform output backend_api_url` から `NEXT_PUBLIC_API_BASE_URL` を使用してフロントエンドをビルドし、Cloudflare R2 に同期します (実行前にリポジトリに R2 シークレットを設定してください)。

## エージェントガイド
AIエージェントのルール、LocalStackの要件、変更ログの期待事項については `agent.md` を参照してください。
