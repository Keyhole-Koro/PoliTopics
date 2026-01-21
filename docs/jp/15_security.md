# 15. セキュリティ設計

[English Version](../../docs/15_security.md)

## 認証

- DataCollection `/run` は `RUN_API_KEY` と一致する `x-api-key` を要求。
- Web API エンドポイントはパブリック (コード内に認証なし)。

## 認可

- ロールベースのアクセス制御は実装なし。

## シークレットの取り扱い

- `GEMINI_API_KEY` と `RUN_API_KEY` は環境変数または Terraform 変数で渡す。
- シークレットは GitHub Actions の secrets に格納し、リポジトリへコミットしない。
- デプロイ用の IAM ロールを用意しており、長期キーの代わりにそれを利用する。

## CSRF / XSS

- Web API は GET ルートのみを公開し、Cookie ベースの認証は無いので CSRF は現状非対象。
