# 4. UI/UX ガイド
[English Version](../../docs/04_uiux_guide.md)

## デザインルール
- 長文コンテンツの可読性を重視したクリーンで高コントラストなレイアウト
- 主要セクションにセリフスタイルを使う大きく明確な見出し
- 要約・参加者・キーワードを区分するカードとバッジ

## タイポグラフィ
- フォントは Next.js 経由でロード: Inter と Manrope
- 本文は `font-sans` (Inter)
- 見出しは `font-serif` を多用 (Manrope 設定だが、上書きしない場合のセリフは Tailwind デフォルト)

## カラーパレット (`frontend/app/globals.css` より)
- プライマリ: シアン (`--primary`, oklch(0.5 0.15 200))
- アクセント: ピンク (`--accent`, oklch(0.65 0.2 330))
- 背景: 白 (`--background`)
- 前景: グレー (`--foreground`)
- Muted/secondary: ライトグレー (`--muted`, `--secondary`)
- Destructive: 赤 (`--destructive`)

## コンポーネント仕様
- ボタン: `default` / `outline` / `ghost` バリアントを持つ `Button` コンポーネント
- 入力: 検索向けの高さと `--ring` に合わせたフォーカスリングを持つ `Input`
- セレクト: カテゴリ/院/会議フィルタ用のリストを持つ `Select`
- 日付ピッカー: 日付範囲選択用の `Popover` 内の `Calendar`
- カード: 要約、参加者、キーワード、用語、対話に使う `Card`
- バッジ: カテゴリとキーワードに使う `Badge`
- 対話ビューア: 記事詳細ビュー内のフィルタ可能な議事録リスト

## レスポンシブのルール
- ホームレイアウトはグリッド用に Tailwind のブレークポイント (`sm`, `md`, `lg`)
- 記事詳細は `max-w-4xl` で中央揃え、モバイル向けパディングを付与
- フィルタパネルは高さトランジション付きで折りたたみ/展開
