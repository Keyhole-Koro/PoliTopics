# Code Reading Guide (Goal-Oriented)
[日本語版](./jp/00_code_reading_guide.md)

This document summarizes where to start reading, based on your goal.

## Goal-based entry points

### Where tasks are created and consumed
- Creation (collection)
  - `PoliTopicsDataCollection/src/lambda_handler.ts`
    - `resolveRunRange()` determines the date range
    - `fetchMeetingsForRange()` fetches Diet records
    - `buildTasksForMeeting()` constructs tasks
    - `TaskRepository.createTask()` writes to DynamoDB
  - Related
    - `PoliTopicsDataCollection/src/lambda/taskBuilder.ts` (task structure + S3 writes)
    - `PoliTopicsDataCollection/src/DynamoDB/tasks.ts` (DynamoDB I/O)

- Consumption (processing)
  - `PoliTopicsRecap/src/lambda_handler.ts`
    - `fetchOldestPendingTask()` loads pending tasks
    - `createLlmClient()` builds Gemini client
    - `handleDirectTask()` / `handleChunkedTask()` process the task
  - Related
    - `PoliTopicsRecap/src/lambda/taskProcessor.ts` (S3 read/write + LLM)
    - `PoliTopicsRecap/src/tasks/taskRepository.ts` (DynamoDB I/O)

### How chunking rules work
- `PoliTopicsDataCollection/src/utils/packing.ts` (token-based packing)
- `PoliTopicsDataCollection/src/lambda/taskBuilder.ts` (chunked vs single)

### Prompt shapes and R2 payloads
- `PoliTopicsDataCollection/src/lambda/taskBuilder.ts` (prompt payload writes)
- `PoliTopicsRecap/src/lambda/taskProcessor.ts` (prompt/result reads and writes)
- `PoliTopicsRecap/src/utils/r2.ts` (R2 helpers for intermediate artifacts and final article assets)

### LLM calls and model configuration
- `PoliTopicsRecap/src/llm/geminiClient.ts` (Gemini API)
- `PoliTopicsRecap/src/lambda/llmFactory.ts` (LLM selection)
- `PoliTopicsDataCollection/src/lambda_handler.ts` (Gemini token counting)

### Article persistence format
- `PoliTopicsRecap/src/dynamoDB/storeData.ts` (single-table + R2 assets)
- `PoliTopicsRecap/src/dynamoDB/article.d.ts` (Article type)
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts` (Dynamo -> API mapping)

### Web API entry points
- `PoliTopicsWeb/workers/backend/src/index.ts`
  - `/headlines`, `/suggest`, `/article/:id`
- `PoliTopicsWeb/workers/backend/src/repositories/articleRepository.ts`
  - DynamoDB queries and R2 asset loading (via signed/public URLs)

### Frontend search and rendering
- `PoliTopicsWeb/frontend/app/home-client.tsx` (search UI + filters)
- `PoliTopicsWeb/frontend/app/article/article-client.tsx` (article details)
- `PoliTopicsWeb/frontend/components/home/search-controls.tsx` (filters UI)

### Infra (env vars and Workers wiring)
- Recap Fargate env
  - `PoliTopicsRecap/terraform/service/fargate/main.tf`
- DataCollection Lambda env
  - `PoliTopicsDataCollection/terraform/service/lambda/main.tf`
- Web backend Workers env
  - `PoliTopicsWeb/terraform/workers/main.tf`

## Change impact hotspots

### Adding fields to task items
- DataCollection: `src/lambda/taskBuilder.ts`, `src/DynamoDB/tasks.ts`
- Recap: `src/tasks/types.ts`, `src/tasks/taskValidator.ts`
- Web: update `shared/types` and UI if needed

### Changing the article schema
- Recap: `src/dynamoDB/article.d.ts`, `src/dynamoDB/storeData.ts`
- Web: `shared/types/article.ts`, `backend/src/repositories/dynamoArticleMapper.ts`
- Frontend: related display components

### Switching LLM models
- Recap: `src/llm/geminiClient.ts` / `src/lambda/llmFactory.ts`
- DataCollection: `src/config.ts` (model/max token)

## References
- `docs/system_overview.md`
- `docs/08_db_design.md`
