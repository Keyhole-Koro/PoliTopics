# 12. デプロイ
[English Version](../../docs/12_deploy.md)

## DataCollection
1) Lambda パッケージをビルド:
```
cd PoliTopicsDataCollection
pnpm install
pnpm build
```
2) Terraform を適用:
```
cd terraform
export ENV=stage
export TF_VAR_gemini_api_key="<key>"
export TF_VAR_run_api_key="<key>"
terraform init -backend-config=backends/stage.hcl
terraform plan -var-file=tfvars/stage.tfvars -out=tfplan
terraform apply tfplan
```

## Recap
1) Lambda パッケージをビルド:
```
cd PoliTopicsRecap
pnpm install
pnpm build
```
2) Terraform を適用:
```
cd terraform
export ENV=stage
export TF_VAR_gemini_api_key="<key>"
terraform init -backend-config=backends/stage.hcl
terraform plan -var-file=tfvars/stage.tfvars -out=tfplan
terraform apply tfplan
```

## Web
Backend:
- バックエンド Lambda バンドルをビルド:
```
cd PoliTopicsWeb
npm run build:backend
```
- `PoliTopicsWeb/terraform` から stage/prod tfvars を使用して Terraform を適用。

Frontend:
- 静的アセットをビルド:
```
cd PoliTopicsWeb/frontend
npm run build
```
- `frontend/out` を環境のフロントエンド S3 バケットにアップロード。

## ロールバック
- Terraform: 以前のバージョンを再適用するか、状態/以前のアーティファクトから復元する。
- S3 フロントエンド: 以前のビルド出力を再アップロードする。
