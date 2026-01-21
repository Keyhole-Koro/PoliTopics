# 12. デプロイ
[English Version](../../docs/12_deploy.md)

## 自動デプロイ
- stage / prod ブランチで GitHub Actions が走り、DataCollection、Recap (Fargate)、Web (Workers + R2/フロント) をデプロイ。
- デプロイ前に `APP_ENVIRONMENT=ghaTest` でテストを実行。

## 手動デプロイ（必要な場合のみ）
- シェルに自身の AWS 資格情報を設定し（トラブルシューティング参照）、`TF_VAR_gemini_api_key` をエクスポートしてから Terraform を実行。
- DataCollection / Recap: 各モジュールで `pnpm build` 実行後、stage/prod の tfvars で Terraform を適用。
- Web backend/frontend は環境変数が多いため手動デプロイは非推奨。GitHub Actions のワークフローを優先。

## Terraform の state とロック
- Terraform state は各モジュールの backend 設定にある S3 バケットに保存。`init`/`plan`/`apply` 前にバケットが利用可能であることを確認。
- apply のロックは無いので同時実行は避ける。

## ロールバック
- Terraform: 以前のプランを再適用するか、保存された state から復元する。
- フロントエンドアセット: 必要に応じて過去のビルドを R2 に再アップロードする。
