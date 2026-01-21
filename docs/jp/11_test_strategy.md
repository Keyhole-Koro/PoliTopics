# 11. テスト戦略
[English Version](../../docs/11_test_strategy.md)

## テストの種類（現在）
- DataCollection: Jest の単体/統合テスト（DynamoDB・R2 互換 S3 は LocalStack）。
- Recap: Jest の単体/統合テスト（DynamoDB/S3 API は LocalStack）、必要に応じてフルフロー。
- Web: Playwright の E2E（LocalStack と R2 同期を使用）。

## 実行方法
- まとめて環境変数をセット: `source scripts/export_test_env.sh`
- LocalStack リソースの確認/作成: `./scripts/verify_localstack_resources.sh --ensure` （または `./scripts/localstack_apply_all.sh`）

DataCollection:
```
cd PoliTopicsDataCollection
pnpm test
```

Recap:
```
cd PoliTopicsRecap
pnpm test
```

Web:
```
cd PoliTopicsWeb
npm test
```

一括実行:
```
./scripts/test_all.sh
```

## 自動化ルール
- LocalStack を使うテストと使わないテストが混在するが、`pretest` により `npm test` / `pnpm test` 実行時に必ず必要リソースを適用。
- CI は `APP_ENVIRONMENT=ghaTest` を使い、`localstack:4566` にルーティングできない Runner 環境を回避。
- `scripts/verify_localstack_resources.sh`（または `localstack_apply_all.sh`）でテーブル/バケットの存在をチェック・作成できる。
