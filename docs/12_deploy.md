# 12. Deployment

## DataCollection
1) Build Lambda package:
```
cd PoliTopicsDataCollection
pnpm install
pnpm build
```
2) Apply Terraform:
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
1) Build Lambda package:
```
cd PoliTopicsRecap
pnpm install
pnpm build
```
2) Apply Terraform:
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
- Build the backend Lambda bundle:
```
cd PoliTopicsWeb
npm run build:backend
```
- Apply Terraform from `PoliTopicsWeb/terraform` using stage/prod tfvars.

Frontend:
- Build static assets:
```
cd PoliTopicsWeb/frontend
npm run build
```
- Upload `frontend/out` to the frontend S3 bucket for the environment.

## Rollback
- Terraform: re-apply previous versions or restore from state/previous artifact.
- S3 frontend: re-upload prior build output.
