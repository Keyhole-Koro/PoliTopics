# 10. コーディング規約
[English Version](../../docs/10_coding_standards.md)

## 言語と構造
- すべてのサービスで TypeScript を使用。
- サービスコードはドメインごとに分割（lambda, utils, DynamoDB など）。
- フロントエンドは Next.js app ディレクトリとコンポーネント、共有 UI プリミティブを使用。

## 命名規則（観測結果）
- DynamoDB キーは大文字のプレフィックスを使用（例: `PK`, `SK`, `GSI1PK`）。
- タスクアイテムは DynamoDB ストレージに合わせて snake_case のフィールド名を使用。
- 環境変数は大文字とアンダースコア。

## リントとフォーマット
- フロントエンドには ESLint がある (`npm --prefix frontend run lint`)。
- バックエンドとパイプラインサービスはリポジトリ内でリントルールセットを定義していない。
- これらのモジュールを編集する際は、既存のコードスタイルに従うこと。

## ディレクトリ規則
- `PoliTopicsDataCollection/src`: 収集 Lambda、国会 API クライアント、DynamoDB タスク。
- `PoliTopicsRecap/src`: タスクプロセッサ、LLM クライアント、DynamoDB 記事永続化。
- `PoliTopicsWeb/frontend`: SPA。
- `PoliTopicsWeb/backend`: Fastify API。
