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

### プロンプト形状とS3ペイロード
- `PoliTopicsDataCollection/src/lambda/taskBuilder.ts` (プロンプトペイロードの書き込み)
- `PoliTopicsRecap/src/lambda/taskProcessor.ts` (プロンプト/結果の読み書き)
- `PoliTopicsRecap/src/utils/s3.ts` (S3 ヘルパー)

### LLM呼び出しとモデル設定
- `PoliTopicsRecap/src/llm/geminiClient.ts` (Gemini API)
- `PoliTopicsRecap/src/lambda/llmFactory.ts` (LLM 選択)
- `PoliTopicsDataCollection/src/lambda_handler.ts` (Gemini トークンカウント)

### 記事の永続化フォーマット
- `PoliTopicsRecap/src/dynamoDB/storeData.ts` (シングルテーブル + S3 アセット)
- `PoliTopicsRecap/src/dynamoDB/article.d.ts` (記事の型定義)
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts` (Dynamo -> API マッピング)

### Web API エントリーポイントと検索動作
- `PoliTopicsWeb/backend/src/http/routes/articles.ts`
  - `/headlines`, `/search`, `/search/suggest`, `/article/:id`
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleRepository.ts`
  - DynamoDB クエリと S3 アセットのロード

### フロントエンド検索とレンダリング
- `PoliTopicsWeb/frontend/app/home-client.tsx` (検索 UI + フィルタ)
- `PoliTopicsWeb/frontend/app/article/article-client.tsx` (記事詳細)
- `PoliTopicsWeb/frontend/components/home/search-controls.tsx` (フィルタ UI)

### インフラ (環境変数とLambda配線)
- Recap Lambda 環境
  - `PoliTopicsRecap/terraform/service/lambda/main.tf`
- DataCollection Lambda 環境
  - `PoliTopicsDataCollection/terraform/service/lambda/main.tf`
- Web backend Lambda 環境
  - `PoliTopicsWeb/terraform/service/lambda/main.tf`

## 読み方の例

### 1) "タスクが作成されない"
- `PoliTopicsDataCollection/src/lambda_handler.ts`
  - APIキーチェック -> 日付範囲 -> 会議取得 -> タスク作成
- `PoliTopicsDataCollection/src/lambda/meetings.ts`
  - 国会会議録 API レスポンス処理
- `PoliTopicsDataCollection/src/DynamoDB/tasks.ts`
  - DynamoDB 書き込み

### 2) "タスクが処理されない"
- `PoliTopicsRecap/src/lambda_handler.ts`
  - 保留タスククエリ (StatusIndex)
- `PoliTopicsRecap/src/tasks/taskRepository.ts`
  - クエリ条件とステータス更新

### 3) "記事が表示されない"
- `PoliTopicsRecap/src/lambda/taskProcessor.ts`
  - LLM 結果 -> JSON パース -> `storeData()`
- `PoliTopicsRecap/src/dynamoDB/storeData.ts`
  - DynamoDB + S3 永続化

### 4) "検索結果が空になる"
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleRepository.ts`
  - `getHeadlines`, `searchArticles`, `getSuggestions`
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts`
  - Dynamo アイテム -> API レスポンスマッピング

### 5) "UI レンダリングがおかしい"
- `PoliTopicsWeb/frontend/app/home-client.tsx`
- `PoliTopicsWeb/frontend/components/home/articles-sections.tsx`
- `PoliTopicsWeb/frontend/app/article/article-client.tsx`

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
- `docs/jp/build.md`
- `docs/jp/08_db_design.md`
