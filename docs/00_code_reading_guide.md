# Code Reading Guide (Goal-Oriented)

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

### Prompt shapes and S3 payloads
- `PoliTopicsDataCollection/src/lambda/taskBuilder.ts` (prompt payload writes)
- `PoliTopicsRecap/src/lambda/taskProcessor.ts` (prompt/result reads and writes)
- `PoliTopicsRecap/src/utils/s3.ts` (S3 helpers)

### LLM calls and model configuration
- `PoliTopicsRecap/src/llm/geminiClient.ts` (Gemini API)
- `PoliTopicsRecap/src/lambda/llmFactory.ts` (LLM selection)
- `PoliTopicsDataCollection/src/lambda_handler.ts` (Gemini token counting)

### Article persistence format
- `PoliTopicsRecap/src/dynamoDB/storeData.ts` (single-table + S3 assets)
- `PoliTopicsRecap/src/dynamoDB/article.d.ts` (Article type)
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts` (Dynamo -> API mapping)

### Web API entry points and search behavior
- `PoliTopicsWeb/backend/src/http/routes/articles.ts`
  - `/headlines`, `/search`, `/search/suggest`, `/article/:id`
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleRepository.ts`
  - DynamoDB queries and S3 asset loading

### Frontend search and rendering
- `PoliTopicsWeb/frontend/app/home-client.tsx` (search UI + filters)
- `PoliTopicsWeb/frontend/app/article/article-client.tsx` (article details)
- `PoliTopicsWeb/frontend/components/home/search-controls.tsx` (filters UI)

### Infra (env vars and Lambda wiring)
- Recap Lambda env
  - `PoliTopicsRecap/terraform/service/lambda/main.tf`
- DataCollection Lambda env
  - `PoliTopicsDataCollection/terraform/service/lambda/main.tf`
- Web backend Lambda env
  - `PoliTopicsWeb/terraform/service/lambda/main.tf`

## Example reading paths

### 1) "Tasks are not being created"
- `PoliTopicsDataCollection/src/lambda_handler.ts`
  - API key check -> date range -> meeting fetch -> task creation
- `PoliTopicsDataCollection/src/lambda/meetings.ts`
  - National Diet API response handling
- `PoliTopicsDataCollection/src/DynamoDB/tasks.ts`
  - DynamoDB writes

### 2) "Tasks are not being processed"
- `PoliTopicsRecap/src/lambda_handler.ts`
  - Pending task query (StatusIndex)
- `PoliTopicsRecap/src/tasks/taskRepository.ts`
  - Query conditions and status updates

### 3) "Articles are not showing up"
- `PoliTopicsRecap/src/lambda/taskProcessor.ts`
  - LLM result -> JSON parse -> `storeData()`
- `PoliTopicsRecap/src/dynamoDB/storeData.ts`
  - DynamoDB + S3 persistence

### 4) "Search results are empty"
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleRepository.ts`
  - `getHeadlines`, `searchArticles`, `getSuggestions`
- `PoliTopicsWeb/backend/src/repositories/dynamoArticleMapper.ts`
  - Dynamo item -> API response mapping

### 5) "UI rendering looks wrong"
- `PoliTopicsWeb/frontend/app/home-client.tsx`
- `PoliTopicsWeb/frontend/components/home/articles-sections.tsx`
- `PoliTopicsWeb/frontend/app/article/article-client.tsx`

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
- `docs/build.md`
- `docs/08_db_design.md`
