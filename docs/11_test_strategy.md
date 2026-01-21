# 11. Test Strategy
[日本語版](./jp/11_test_strategy.md)

## Test types (current state)
- DataCollection: Jest unit/integration (LocalStack for DynamoDB/R2-compatible S3).
- Recap: Jest unit/integration (LocalStack for DynamoDB/S3 API) plus optional full-flow tests.
- Web: Playwright E2E (uses LocalStack + R2 sync for assets).

## How to run
- Export env defaults at once: `source scripts/export_test_env.sh`.
- Ensure LocalStack resources exist: `./scripts/verify_localstack_resources.sh --ensure` (or `./scripts/localstack_apply_all.sh`).

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

Run everything:
```
./scripts/test_all.sh
```

## Automation rules
- Some suites use LocalStack and some do not, but `pretest` scripts always apply required resources before `npm test`/`pnpm test`.
- CI uses the `ghaTest` environment to provision resources because GitHub runners cannot route to `localstack:4566`.
- `scripts/verify_localstack_resources.sh` (or `localstack_apply_all.sh`) checks/creates LocalStack tables and buckets before test runs.
