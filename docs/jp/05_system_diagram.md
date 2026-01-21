# 5. システム図
[English Version](../../docs/05_system_diagram.md)

## コンポーネントマップ
- PoliTopicsDataCollection (AWS Lambda + API Gateway + EventBridge)
- PoliTopicsRecap (AWS Fargate + EventBridge Scheduler)
- PoliTopicsWeb (Cloudflare Workers V8 + Hono バックエンド API、Cloudflare R2 上の Next.js SPA)
- DynamoDB (LLM タスクテーブル, 記事テーブル)
- Amazon S3 (プロンプトバケット)
- Cloudflare R2 (記事アセットバケット, SPA アセット)
- 外部 API (国会 API, Gemini API)

## Mermaid 図

### DataCollection
```mermaid
flowchart LR
  %% ========== データ収集 ==========
  subgraph DC["PoliTopicsDataCollection / 収集サービス"]
    IngestSchedule["EventBridge (Cron)<br/>取得スケジュール"]
    IngestLambda["AWS Lambda (Node.js)<br/>IngestLambda"]
    PromptBucket[(Amazon S3<br/>PromptBucket)]
    TaskTable[(DynamoDB<br/>TaskTable: llm_task_table)]
  end

  NationalDietAPI["外部<br/>国会議事録API<br/>(National Diet API)"]

  IngestSchedule -->|トリガー| IngestLambda
  IngestLambda -->|会議録を取得| NationalDietAPI
  IngestLambda -->|元テキストを保存| PromptBucket
  IngestLambda -->|タスクを登録| TaskTable
```

### Recap
```mermaid
---
config:
  layout: dagre
---
flowchart LR
  subgraph RP["PoliTopicsRecap / 要約サービス"]
        RecapSchedule["EventBridge (Cron)<br>要約スケジュール"]
        RecapBatch["AWS Fargate タスク (Node.js)<br>RecapBatch"]
        S1["① バッチ開始<br>要約ジョブを起動"]
        S2["② 未処理タスクを取得<br>TaskTable から読む"]
        S3["③ 会議録を取得<br>PromptBucket から読む"]
        S4["④ LLM で要約生成"]
        S5["⑤ 結果を永続化"]
        S6["⑥ タスクを完了に更新"]
        AssetBucket[("Cloudflare R2 (S3 API)<br>AssetBucket")]
        TaskTable[("DynamoDB<br>TaskTable: llm_task_table")]
        ArticleTable[("DynamoDB<br>ArticleTable: politopics_article_table")]
        PromptBucket[("Cloudflare R2 (S3 API)<br>PromptBucket")]
  end
    RecapSchedule --> S1
    S1 --> RecapBatch
    RecapBatch --> S2 & S3 & S4 & S5 & S6
    S2 --> TaskTable
    S3 --> PromptBucket
    S4 --> GeminiAPI["外部<br>GeminiAPI<br>(LLM 要約)"] & RecapBatch
    GeminiAPI --> S4
    S5 --> AssetBucket & ArticleTable
    S6 --> TaskTable

     S1:::step
     S2:::step
     S3:::step
     S4:::step
     S5:::step
     S6:::step
    classDef step fill:#f9f9f9,stroke:#333,stroke-width:1.5px
```

### Web
```mermaid
flowchart LR
  %% ========== Web 配信 (V8 + Hono + Cache Cron) ==========
  subgraph WEB["PoliTopicsWeb / Web サービス"]
    WebFrontend["Cloudflare Worker (V8)<br/>Web フロントエンド<br/>ホスト: politopics.net<br/>（R2 から SPA を配信）"]
    WebBackend["Cloudflare Worker (V8) + Hono<br/>Web バックエンド API<br/>ホスト: api.politopics.net<br/>エンドポイント: /headlines, /suggest"]
    AssetEdge["Cloudflare (R2 公開アクセス)<br/>アセットホスト: asset.politopics.net"]
  end

  User["利用者<br/>(ブラウザ / モバイル)"]

  R2Spa[("Cloudflare R2<br/>SPA アセット<br/>(politopics.net)")]
  R2Asset[("Cloudflare R2<br/>要約アセット<br/>(asset.politopics.net)")]
  ArticleTable[("DynamoDB<br/>ArticleTable: politopics_article_table")]

  %% ========== キャッシュ更新 ==========
  subgraph CRON["キャッシュ更新 (毎日)"]
    CacheSchedule["EventBridge (Cron)<br/>1日1回"]
    CacheLambda["AWS Lambda (Node.js)<br/>CacheCronLambda<br/>/headlines を index.html に埋め込み"]
  end

  %% ---- Page load ----
  User -->|ページを要求| WebFrontend
  WebFrontend -->|SPA アセットを配信| R2Spa

  %% ---- API (metadata only) ----
  User -->|"API をリクエスト<br/>GET /headlines<br/>GET /suggest"| WebBackend
  WebBackend -->|"記事インデックスを参照<br/>(GSI フィルタ/ソート)"| ArticleTable
  WebBackend -->|"JSON (メタデータ) を返却:<br/>タイトル、日付...<br/>recapAssetURL"| User

  %% ---- Direct asset download (client-side) ----
  User -->|要約アセットを直接ダウンロード| AssetEdge
  AssetEdge -->|アセットオブジェクトを取得| R2Asset

  %% ---- Recap assets content hint ----
  R2Asset ---|"要約アセットのフィールド:<br/>タイトル、説明、参加者、<br/>キーワード、院名など"| R2Asset

  %% ---- Cache cron flow ----
  CacheSchedule -->|トリガー| CacheLambda
  CacheLambda -->|"最新のヘッドラインを取得<br/>(ArticleTable から)"| ArticleTable
  CacheLambda -->|"更新済み index.html を書き込み<br/>(ヘッドラインを埋め込み)"| R2Spa
```

## データフロー (テキスト)
1) 国会 API -> DataCollection Lambda
2) DataCollection Lambda -> R2 (プロンプト)
3) DataCollection Lambda -> DynamoDB LLM タスクテーブル
4) Recap Fargate -> R2 (チャンク/リデュース結果)
5) Recap Fargate -> DynamoDB 記事テーブル + R2 記事アセット（公開/署名付き URL）
6) Web backend (Cloudflare Workers V8 + Hono) -> DynamoDB + R2 アセット
7) Web frontend -> Web backend API と R2 アセットの直接取得

## ネットワークとインフラ
- AWS マネージドサービス (Lambda, Fargate, DynamoDB, API Gateway, EventBridge/Scheduler) と Cloudflare Workers/R2 を併用。
- ローカル開発は DynamoDB, Lambda, API Gateway に LocalStack を使用し、Workers と R2 は dev ツールまたは S3 API エンドポイントを使用。

## 環境固有の設定
- Local: LocalStack エンドポイント、テスト認証情報、ローカルのテーブル/バケット名、Workers の dev 設定。
- Stage/Prod: AWS エンドポイント、Cloudflare 本番アカウント、ステージ/本番のテーブル/バケット名。
- 正確な名前は `docs/jp/system_overview.md` と各モジュールの `config.ts` を参照。
