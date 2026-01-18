# 11. テスト戦略
[English Version](../../docs/11_test_strategy.md)

## テストの種類（現在の状態）
- 単体テスト: DataCollection と Recap での Jest。
- 統合テスト: DynamoDB/S3 および Lambda ハンドラに対する LocalStack テスト。
- Web: このリポジトリには自動化テストが設定されていません。

## 実行方法
DataCollection:
```
cd PoliTopicsDataCollection
pnpm test
```

Recap:
```
cd PoliTopicsRecap
pnpm test
pnpm local:test:e2e
```

Web:
- `PoliTopicsWeb/package.json` にテストランナーが設定されていません。

## 自動化ルール
- LocalStack 統合テストには、LocalStack サービスの実行が必要です。
- 一部のテストは、長時間実行される外部呼び出しを避けるために `describe.skip` とマークされています。
