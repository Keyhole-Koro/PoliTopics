# コードリーディングガイド（目的別）
[English Version](../../docs/00_code_reading_guide.md)

このドキュメントは、目的に応じてどこから読み始めるべきかをまとめています。

## 目的別エントリーポイント

### タスクの作成と消費
- 作成 (収集)
  - `PoliTopicsDataCollection/src/lambda_handler.ts`
    - `resolveRunRange()` 日付範囲を決定
    - `fetchMeetingsForRange()` 国会会議録を取得
    - `buildTasksForMeeting()` タスクを構築
    - `TaskRepository.createTask()` DynamoDBに書き込み
  - 関連
    - `PoliTopicsDataCollection/src/lambda/taskBuilder.ts` (タスク構造 + S3書き込み)
    - `PoliTopicsDataCollection/src/DynamoDB/tasks.ts` (DynamoDB I/O)

- 消費 (処理)
  - `PoliTopicsRecap/src/lambda_handler.ts`
    - `fetchOldestPendingTask()` 保留中のタスクをロード
    - `createLlmClient()` Geminiクライアントを構築
    - `handleDirectTask()` / `handleChunkedTask()` タスクを処理
  - 関連
    - `PoliTopicsRecap/src/lambda/taskProcessor.ts` (S3読み書き + LLM)
    - `PoliTopicsRecap/src/tasks/taskRepository.ts` (DynamoDB I/O)

### チャンク化ルールの仕組み
- `PoliTopicsDataCollection/src/utils/packing.ts` (トークンベースのパッキング)
- `PoliTopicsDataCollection/src/lambda/taskBuilder.ts` (分割 vs 単一)

### プロンプト形状と R2 ペイロード
- `PoliTopicsDataCollection/src/lambda/taskBuilder.ts` (プロンプトペイロードの書き込み)
- `PoliTopicsRecap/src/lambda/taskProcessor.ts` (プロンプト/結果の読み書き)
- `PoliTopicsRecap/src/utils/r2.ts` (中間成果物と最終記事アセットの R2 ヘルパー)

### LLM呼び出しとモデル設定
- `PoliTopicsRecap/src/llm/geminiClient.ts` (Gemini API)
- `PoliTopicsRecap/src/lambda/llmFactory.ts` (LLM 選択)
- `PoliTopicsDataCollection/src/lambda_handler.ts` (Gemini トークンカウント)

### 記事の永続化フォーマット
- `PoliTopicsRecap/src/dynamoDB/storeData.ts` (シングルテーブル + R2 アセット)
- `PoliTopicsRecap/src/dynamoDB/article.d.ts` (記事の型定義)
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts` (Dynamo -> API マッピング)

### Web API エントリーポイント
- `PoliTopicsWeb/workers/backend/src/index.ts`
  - `/headlines`, `/suggest`, `/article/:id`
- `PoliTopicsWeb/workers/backend/src/repositories/articleRepository.ts`
  - DynamoDB クエリと R2 アセットのロード（署名付き/公開 URL 経由）

### フロントエンド検索とレンダリング
- `PoliTopicsWeb/frontend/app/home-client.tsx` (検索 UI + フィルタ)
- `PoliTopicsWeb/frontend/app/article/article-client.tsx` (記事詳細)
- `PoliTopicsWeb/frontend/components/home/search-controls.tsx` (フィルタ UI)

### インフラ (環境変数と Workers 配線)
- Recap Fargate 環境
  - `PoliTopicsRecap/terraform/service/fargate/main.tf`
- DataCollection Lambda 環境
  - `PoliTopicsDataCollection/terraform/service/lambda/main.tf`
- Web backend Workers 環境
  - `PoliTopicsWeb/terraform/workers/main.tf`

## 変更影響のホットスポット

### タスクアイテムへのフィールド追加
- DataCollection: `src/lambda/taskBuilder.ts`, `src/DynamoDB/tasks.ts`
- Recap: `src/tasks/types.ts`, `src/tasks/taskValidator.ts`
- Web: 必要に応じて `shared/types` と UI を更新

### 記事スキーマの変更
- Recap: `src/dynamoDB/article.d.ts`, `src/dynamoDB/storeData.ts`
- Web: `shared/types/article.ts`, `backend/src/repositories/dynamoArticleMapper.ts`
- Frontend: 関連する表示コンポーネント

### LLMモデルの切り替え
- Recap: `src/llm/geminiClient.ts` / `src/lambda/llmFactory.ts`
- DataCollection: `src/config.ts` (モデル/最大トークン)

## リファレンス
- `docs/jp/system_overview.md`
- `docs/jp/08_db_design.md`
