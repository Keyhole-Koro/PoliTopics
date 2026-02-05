# 8. DB 設計
[English Version](../../docs/08_db_design.md)

## DynamoDB: LLM タスクテーブル
DataCollection (書き込み) と Recap (読み取り/更新) で使用。

テーブルキー
- PK: `pk` (`session + house + issueID` をハッシュ化した内部UID)

GSI
- `StatusIndex`: `status` (パーティション) + `createdAt` (ソート)

主要な属性 (`PoliTopicsDataCollection/src/DynamoDB/tasks.ts` と `PoliTopicsRecap/src/tasks/types.ts` を参照):
- `pk`: 内部UID（`session + house + issueID` のハッシュ）
- `status`: `pending` | `completed`
- `llm`: 例: `gemini`
- `llmModel`: Gemini モデル名
- `retryAttempts`: 整数
- `createdAt`, `updatedAt`: ISO タイムスタンプ
- `processingMode`: `single_chunk` | `chunked`
- `prompt_version`: タスク生成に用いたプロンプトスキーマの版
- `prompt_url`: リデュースまたは直接プロンプトのための S3 URL
- `result_url`: 最終出力のための S3 URL
- `meeting`: メタデータ (issueID, 院, 会議名, 日付, 国会回次, 発言数)
- `chunks`: チャンクリスト (`prompt_url`, `result_url`, `status`, 任意で `based_on_orders`)

## DynamoDB: 記事テーブル
Recap (書き込み) と Web (読み取り) で使用。
シンインデックスを使用したシングルテーブルパターン。

メインアイテム
- `PK`: `A#<id>`
- `SK`: `META`
- `type`: `ARTICLE`
- `asset_url`: 大きなアセット JSON のための R2 URL
- `GSI1PK`: `ARTICLE`
- `GSI1SK`: `<ISO date>`
- `GSI2PK`: `Y#YYYY#M#MM`
- `GSI2SK`: `<ISO date>`
- フィールド: `title`, `date`, `month`, `imageKind`, `session`, `nameOfHouse`, `nameOfMeeting`, `categories`, `description`, `participants`, `keywords`, `terms`

シンインデックスアイテム (高速フィルタリング)
- `PK`: `CATEGORY#<name>` / `PERSON#<name>` / `KEYWORD#<kw>` / `IMAGEKIND#<kind>` /
  `SESSION#<session>` / `HOUSE#<house>` / `MEETING#<meeting>` / `ISSUE#<issueID>`
- `SK`: `Y#<YYYY>#M#<MM>#D#<ISO>#A#<id>`
- `type`: `THIN_INDEX`
- リスト表示のための軽量フィールド
用途
- `ISSUE#<issueID>` は同一 issue を横断したタイムライン取得に使う。

## R2 使用法 (S3 API)
- プロンプトバケット: DataCollection プロンプトと Recap 結果 JSON。
- 記事アセットバケット: Recap は重いフィールド (`summary`, `soft_language_summary`, `middle_summary`, `dialogs`) を含む `asset.json` を保存。
- dialogs には UI 向けのセクション配列（`summary_sections`）が含まれる。
