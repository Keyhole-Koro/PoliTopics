# 5. システム図
[English Version](../../docs/05_system_diagram.md)

## コンポーネントマップ
- PoliTopicsDataCollection (Lambda + API Gateway + EventBridge)
- PoliTopicsRecap (Lambda + EventBridge Scheduler)
- PoliTopicsWeb (Next.js frontend + Fastify backend Lambda)
- DynamoDB (LLM タスクテーブル, 記事テーブル)
- S3 (プロンプトバケット, 記事アセットバケット)
- 外部 API (国会 API, Gemini API)

## データフロー (テキスト図)
1) 国会 API -> DataCollection Lambda
2) DataCollection Lambda -> S3 (プロンプトペイロード)
3) DataCollection Lambda -> DynamoDB LLM タスクテーブル
4) Recap Lambda -> S3 (チャンク結果, リデュース結果)
5) Recap Lambda -> DynamoDB 記事テーブル + S3 記事アセット
6) Web backend -> DynamoDB + S3
7) Web frontend -> Web backend API

## ネットワークとインフラ
- AWS マネージドサービス (Lambda, DynamoDB, S3, API Gateway, EventBridge/Scheduler).
- ローカル開発は DynamoDB, S3, Lambda, API Gateway に LocalStack を使用。

## 環境固有の設定
- Local: LocalStack エンドポイント, テスト認証情報, ローカルテーブル/バケット名。
- Stage/Prod: AWS エンドポイント, 実際の認証情報, ステージ/本番テーブル/バケット名。
- 正確な名前については `docs/jp/system_overview.md` および各モジュールの `config.ts` を参照してください。
