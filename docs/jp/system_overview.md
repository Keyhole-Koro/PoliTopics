# PoliTopics システム概要
[English Version](../../docs/system_overview.md)

## コンポーネントの役割

### PoliTopicsDataCollection
- 役割: 国会会議録を取得し、LLM 用のプロンプトに分割し、プロンプトを S3 に保存して、DynamoDB にタスクを登録する。
- メインフロー:
  - 国会 API から会議録を取得。
  - 長いテキストを LLM サイズのチャンクに分割。
  - プロンプト JSON を S3 に保存し、タスクに URL を記録。
  - DynamoDB LLM タスクテーブルに Issue レベルのタスクを作成。

### PoliTopicsRecap
- 役割: DynamoDB からタスクを取得し、LLM 要約を実行し、記事を永続化する。
- メインフロー:
  - DynamoDB タスクテーブルから保留中のタスクを読み込む。
  - R2 からプロンプトをロードし、Map/Reduce 要約を実行。
  - 重い記事アセットを R2 に保存。
  - 記事メタデータ + インデックスを DynamoDB 記事テーブルに書き込む。
  - タスクステータスを完了に更新。

### PoliTopicsWeb
- 役割: 生成された記事を検索して閲覧するための Web アプリを提供。
- メインフロー:
  - frontend: 検索と記事詳細 UI のための Next.js SPA（SPA アセットは R2）。
  - backend: DynamoDB をクエリし、R2 からアセットを取得する Cloudflare Workers (V8) + Hono API。
  - infra/terraform: ローカル開発 (LocalStack) と本番用のインフラストラクチャ。

## データフロー
1. DataCollection が記録を取得し、プロンプトを S3 に保存する。
2. DataCollection が DynamoDB LLM タスクテーブルにタスクを作成する。
3. Recap がタスクを処理し、LLM で要約を生成する。
4. Recap が記事を DynamoDB に書き込み、アセットを R2 に保存する。
5. Web backend が DynamoDB + R2 から記事をフロントエンドに提供し、公開/署名付きのアセット URL を返す。

## DB スキーマ概要

### LLM タスクテーブル (DynamoDB)
- 使用者: DataCollection (書き込み), Recap (読み取り/更新)
- テーブル定義:
  - PK: `pk` (文字列, issueID)
  - GSI: `StatusIndex` (`status` + `createdAt`)
- 主要属性 (IssueTask / TaskItem):
  - `pk`: issueID
  - `status`: `pending` | `completed`
  - `llm`: 例: `gemini`
  - `llmModel`: モデル名
  - `retryAttempts`: リトライ回数
  - `createdAt`, `updatedAt`: ISO タイムスタンプ
  - `processingMode`: DataCollection=`single_chunk` | `chunked`, Recap=`direct` | `chunked`
  - `prompt_url`: リデュースプロンプト用 S3 URL
  - `result_url`: リデュース結果用 S3 URL
  - `meeting`: 会議メタデータ
    - `issueID`, `nameOfMeeting`, `nameOfHouse`, `date`, `numberOfSpeeches`, `session`
  - `chunks`: チャンクリスト
    - `id`, `prompt_key`, `prompt_url`, `result_url`, `status` (`notReady` | `ready`)

### 記事テーブル (DynamoDB)
- 使用者: Recap (書き込み), Web (読み取り)
- テーブル定義:
  - PK: `PK` (文字列)
  - SK: `SK` (文字列)
  - GSI1: `ArticleByDate` (`GSI1PK`, `GSI1SK`)
  - GSI2: `MonthDateIndex` (`GSI2PK`, `GSI2SK`)
- 主要アイテムタイプ:
  - 記事メインアイテム
    - `PK`: `A#<id>`
    - `SK`: `META`
    - `type`: `ARTICLE`
    - `asset_url`: 詳細アセット JSON への R2 ポインタ (API によって署名付き/公開 URL として返される)
    - `GSI1PK`: `ARTICLE`, `GSI1SK`: `<ISO-UTC date>`
    - `GSI2PK`: `Y#YYYY#M#MM`, `GSI2SK`: `<ISO-UTC date>`
    - キーフィールド: `title`, `date`, `month`, `imageKind`, `session`, `nameOfHouse`, `nameOfMeeting`,
      `categories`, `description`, `participants`, `keywords`, `terms` など
    - `summary`, `soft_language_summary`, `middle_summary`, `dialogs` は R2 に保存され、`asset_url` 経由で参照される。
  - シンインデックスアイテム (リスト/検索)
    - `PK`: `CATEGORY#<name>` / `PERSON#<name>` / `KEYWORD#<kw>` / `IMAGEKIND#<kind>` /
      `SESSION#<session>` / `HOUSE#<house>` / `MEETING#<meeting>`
    - `SK`: `Y#<YYYY>#M#<MM>#D#<ISO-UTC>#A#<id>`
    - `type`: `THIN_INDEX`
    - カードレンダリング用メタデータを保持: タイトル, 日付, imageKind, 説明, カテゴリ, キーワード, 参加者。
  - オプション: 最近のキーワードログ
    - `PK`: `KEYWORD_RECENT`
    - `SK`: `D#<ISO-UTC>#KW#<keyword>#A#<id>`
    - `type`: `KEYWORD_OCCURRENCE`

## ノート: ストレージ
- プロンプトとリデュース出力: Amazon S3 (DataCollection + Recap)。
- 記事アセットと SPA ビルド: Cloudflare R2（公開/署名付き URL で提供）。
