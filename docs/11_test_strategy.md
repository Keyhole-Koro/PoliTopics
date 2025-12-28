# 11. Test Strategy

## Test types (current state)
- Unit tests: Jest in DataCollection and Recap.
- Integration tests: LocalStack tests for DynamoDB/S3 and Lambda handlers.
- Web: no automated tests configured in this repo.

## How to run
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
- No test runner is configured in `PoliTopicsWeb/package.json`.

## Automation rules
- LocalStack integration tests require LocalStack services running.
- Some tests are marked `describe.skip` to avoid long-running external calls.
