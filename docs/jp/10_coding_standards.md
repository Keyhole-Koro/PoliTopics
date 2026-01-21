# 10. コーディング規約

[English Version](../../docs/10_coding_standards.md)

## 言語と構造

- すべてのサービスで TypeScript を使用。
- サービスコードはドメインごとに分割（lambda, utils, DynamoDB など）。
- フロントエンドは Next.js app ディレクトリとコンポーネント、共有 UI プリミティブを使用。

## 命名規則

- DynamoDB キーは大文字のプレフィックスを使用（例: `PK`, `SK`, `GSI1PK`）。
- タスクアイテムは DynamoDB ストレージに合わせて snake_case のフィールド名を使用。
- 環境変数は大文字とアンダースコア。

## リントとフォーマット

- フロントエンドには ESLint がある (`npm --prefix frontend run lint`) が、CI で強制はしない。
- バックエンドとパイプラインは名目上リント設定を持つ程度で、通常ワークフローに含めない。
- これらのモジュールを編集する際は既存のコードスタイルに従う。

## 設定の扱い

- 環境変数は各モジュールの `config.ts` で集中管理・バリデーションする。
- `config.ts` 以外のソースで直接 `process.env` を読まない。

## ディレクトリ規則

- `PoliTopicsDataCollection/src`: 収集 Lambda、国会 API クライアント、DynamoDB タスク。
- `PoliTopicsRecap/src`: タスクプロセッサ、LLM クライアント、DynamoDB 記事永続化。
- `PoliTopicsWeb/frontend`: SPA。
- `PoliTopicsWeb/workers/backend`: Cloudflare Workers 上の Hono API。
