# 3. 画面遷移図
[English Version](../../docs/03_screen_flow.md)

## 画面リスト
- ホーム: `/`
- 記事詳細: `/article/:id`
- Not found: その他のパス

## 遷移
- ホーム -> 記事詳細: 記事カードをクリック。
- 記事詳細 -> ホーム: ヘッダーの戻るボタン、またはブラウザの戻るボタン。
- 不明なルート -> Not found: ホームに戻るリンクを表示。

## URL マップ
- `/` ホームおよび検索。
- `/article/<issueId>` 記事詳細ページ。
- `/*` not found ページ。
