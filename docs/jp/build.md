# ビルド & ローカル環境ガイド
[English Version](../../docs/build.md)

常に Dev Container 内で作業してください (ホストのみの実行はサポートされていません)。

## Dev Container (必須)
- VS Code で “Reopen in Container” を実行するか、`devcontainer up --workspace-folder .` を実行します。
- コンテナ起動後、LocalStack/UI を起動します: `docker compose up -d localstack dynamodb-admin`。

## LocalStack ワンショットセットアップ & テスト
```bash
docker compose up -d localstack dynamodb-admin          # LocalStack を起動
bash scripts/localstack_apply_all.sh                    # DataCollection/Recap/Web のビルド+適用
source scripts/export_test_env.sh                       # 環境変数を現在のシェルにエクスポート (source 必須)
bash scripts/test_all.sh                                # 全モジュールの npm test
```
`localstack_apply_all.sh` のターゲットを制限するには `-only DataCollection,Web` を使用します。

## モジュールごとのコマンド (コンテナ内)
- DataCollection: `cd PoliTopicsDataCollection && pnpm install && pnpm test && pnpm build`
- Recap: `cd PoliTopicsRecap && pnpm install && pnpm test && pnpm build:local`
- Web: `cd PoliTopicsWeb && npm install --workspaces --include-workspace-root && npm run dev:backend && npm run dev:frontend` (`npm run build:backend && npm run build:frontend` でビルド)

## 環境変数のヒント
- LocalStack のデフォルトは `scripts/export_test_env.sh` によってエクスポートされます。
- AWS 接続: `AWS_REGION=ap-northeast-3`, `AWS_ACCESS_KEY_ID=test`, `AWS_SECRET_ACCESS_KEY=test`, `AWS_ENDPOINT_URL` / `LOCALSTACK_URL=http://localhost:4566`
- 製品固有: `RUN_API_KEY`, `DISCORD_WEBHOOK_*`, `GEMINI_API_KEY` などにはテスト用の安全な値を設定し、実際のシークレットはコミットしないでください。

## 可観測性
- DynamoDB Admin UI: `http://localhost:8001`
- LocalStack ログ: `docker compose logs -f localstack`
- AWS CLI (LocalStack): `aws --endpoint-url http://localhost:4566 ...`
