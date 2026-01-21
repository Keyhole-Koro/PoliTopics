# 2. 機能仕様
[English Version](../../docs/02_functional_spec.md)

## 機能リスト
### PoliTopicsDataCollection
- 日付範囲を指定して、国会 API から会議録を取得する。
- Gemini のトークン予算に基づいて、会議の発言をプロンプトチャンクに分割する。
- プロンプトを S3 に保存し、タスクを DynamoDB に作成する。
- HTTP API (/run) またはスケジュールされたイベントを介して実行をトリガーする。

### PoliTopicsRecap
- DynamoDB をポーリングして保留中のタスクを確認する。
- 単一チャンクまたはチャンク化されたタスクに対して LLM 要約を実行する。
- プロンプト/リデュース結果は S3 に保存し、記事の重いアセットは R2 に保存する。
- 記事のメタデータを DynamoDB に、重いアセットを R2 に永続化する。
- エラー、警告、完了について Discord 経由で通知を送信する。

### PoliTopicsWeb
- 最新の記事（ヘッドライン）を表示する。
- キーワード、カテゴリ、院、会議、日付範囲によるクライアントサイドフィルタリング。
- バックエンド API から検索語を提案する。
- 要約、対話、参加者、キーワード、用語を含む記事詳細ビュー（R2 の公開アセット URL を利用）。

## 画面レベルの動作
### ホーム (/)
- バックエンド `/headlines` からヘッドラインを読み込む。
- キーワード検索とフィルタ選択（カテゴリ、院、会議、日付範囲）を可能にする。
- フィルタは、読み込まれたヘッドラインセットに対してクライアントサイドで適用される。
- 入力に応じて、検索条件に合致した記事メタデータを `/suggest` から取得する。

### 記事詳細 (/article/:id)
- `/article/:id` から記事の詳細を取得する。
- 要約、簡易要約、対話リスト、参加者、キーワード、用語を表示する。
- 要約は、リッチテキスト形式（リスト、リンク）をサポートするために Markdown (GFM) としてレンダリングされる。

### Not found
- 不明なルートは、ホームへのリンクを含む単純な not-found ビューを表示する。

## 入力制約
- DataCollection `/run` の範囲は `YYYY-MM-DD` のみを受け付ける。省略された場合、`from` と `until` の両方が今日 (JST) にデフォルト設定される。
- DataCollection は `from > until` を拒否する。
- Web `/headlines` 制限: `limit` は 1-50 に制限される。`start` は 0 以上でなければならない。
- Web `/suggest` の制限はデフォルトで 5。

## エラー条件
- DataCollection:
  - `x-api-key` が `RUN_API_KEY` と一致しない場合、`401 unauthorized`。
  - JSON ボディが不正な場合、`400 invalid_json`。
  - `from > until` または範囲が決定できない場合、`400 invalid_range`。
  - `RUN_API_KEY` が設定されていない場合、`500 server_misconfigured`。
  - プロンプトがトークン予算を超えた場合、`500 prompt_over_budget`。
  - 予期しない例外の場合、`500 internal_error`。
- Web backend:
  - 不明な記事 ID の場合、`404 Article not found`。
  - 不明なルートの場合、`404 Not Found`。
  - 未処理の例外の場合、`500 Internal error`。

## バリデーションルール
- Recap は処理前にタスクフィールドを検証する:
  - `pk`, `llm`, `llmModel`, `prompt_url`, `result_url` は必須。
  - `meeting` フィールドが存在し、有効でなければならない。
  - チャンク化されたタスクは、S3 URL を含むチャンク定義を含む。
- DataCollection は日付範囲の形式を `YYYY-MM-DD` として検証する。

## アクセスの扱い
- ロールベースの UI または API アクセスは実装していない。
- DataCollection `/run` は `x-api-key` ヘッダーでのみ保護される。
