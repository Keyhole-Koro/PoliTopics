# 技術選定と理由
[English Version](../../docs/tech_choices.md)

## SPA ホスティング (Cloudflare R2)
- ドメインを Cloudflare で取得しており、R2 を使えば DNS とホスティングを一箇所に集約できる。
- R2 はエッジ配信が標準。AWS で同等にするには S3 に加えて CloudFront を導入する必要がある。

## 記事アセット (Cloudflare R2)
- 独自ドメイン + HTTPS を簡単に設定でき、アウトバウンドの転送料が無料。
- 公開/署名付き URL で重いコンテンツを DynamoDB クエリから切り離せる。

## バックエンド (Cloudflare Workers V8 + Hono)
- コールドスタートがなく、V8 Isolate のウォーム実行は Lambda よりおよそ 2 倍速かった。
- エッジ実行によりユーザーへのレイテンシを短縮。

## プロンプト/リデュース出力 (Amazon S3)
- プロンプトとリデュース結果は素直に S3 に置き、アセット/SPA を R2 に分離して役割を分ける。

## DynamoDB
- NoSQL でルックアップを少なく保つ設計。`/headlines` `/article` `/suggest` はそれぞれ 1 クエリで取得可能。
- 本文や対話は同梱の asset URL から R2 をダウンロードするため、追加の DB クエリが不要。
