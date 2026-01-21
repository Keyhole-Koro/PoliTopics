# 16. Development Process
[日本語版](./jp/16_dev_process.md)

## Git workflow
- No formal workflow documented in the repo (TBD).
- Suggested: feature branches -> PR -> review -> merge to main.

## Review
- Suggested: at least one reviewer for changes to pipeline logic or infrastructure.

## Local validation
- Run module tests before merge (`pnpm test` / `npm test`). `npm run lint` exists but is not part of the standard flow.
- Coding agents follow `agent.md` for rules and must update `changes.agent.md` per submodule when editing code/docs.
