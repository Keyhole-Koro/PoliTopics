# 5. System Diagram
[日本語版](./jp/05_system_diagram.md)

## Component map
- PoliTopicsDataCollection (AWS Lambda + API Gateway + EventBridge)
- PoliTopicsRecap (AWS Fargate + EventBridge Scheduler)
- PoliTopicsWeb (Cloudflare Workers V8 + Hono backend API, Next.js SPA on Cloudflare R2)
- DynamoDB (LLM task table, article table)
- Amazon S3 (prompt bucket)
- Cloudflare R2 (article asset bucket, SPA assets)
- External APIs (National Diet API, Gemini API)

## Mermaid diagrams

### DataCollection
```mermaid
flowchart LR
  %% ========== Data Collection ==========
  subgraph DC[PoliTopicsDataCollection / Ingestion Service]
    IngestSchedule["EventBridge (Cron)<br/>IngestSchedule"]
    IngestLambda["AWS Lambda (Node.js)<br/>IngestLambda"]
    PromptBucket[(Amazon S3<br/>PromptBucket)]
    TaskTable[(DynamoDB<br/>TaskTable: llm_task_table)]
  end

  NationalDietAPI["External<br/>NationalDietAPI<br/>(国会議事録API)"]

  IngestSchedule -->|Triggers| IngestLambda
  IngestLambda -->|Fetches Data| NationalDietAPI
  IngestLambda -->|Stores Raw Text| PromptBucket
  IngestLambda -->|Enqueues Task| TaskTable
```

### Recap
```mermaid
---
config:
  layout: dagre
---
flowchart LR
 subgraph RP["PoliTopicsRecap / Processing Service"]
        RecapSchedule["EventBridge (Cron)<br>RecapSchedule"]
        RecapBatch["AWS Fargate Task (Node.js)<br>RecapBatch"]
        S1["① Start Batch<br>Trigger Recap Job"]
        S2["② Fetch Pending Task<br>from TaskTable"]
        S3["③ Load Transcript<br>from PromptBucket"]
        S4["④ Summarize via LLM"]
        S5["⑤ Persist Results"]
        S6["⑥ Update Task Status as Completed"]
        AssetBucket[("S3 / Cloudflare R2<br>AssetBucket")]
        TaskTable[("DynamoDB<br>TaskTable: llm_task_table")]
        ArticleTable[("DynamoDB<br>ArticleTable: politopics_article_table")]
        PromptBucket[("S3 Bucket<br>PromptBucket")]
  end
    RecapSchedule --> S1
    S1 --> RecapBatch
    RecapBatch --> S2 & S3 & S4 & S5 & S6
    S2 --> TaskTable
    S3 --> PromptBucket
    S4 --> GeminiAPI["External<br>GeminiAPI<br>(LLM Summarization)"] & RecapBatch
    GeminiAPI --> S4
    S5 --> AssetBucket & ArticleTable
    S6 --> TaskTable

     S1:::step
     S2:::step
     S3:::step
     S4:::step
     S5:::step
     S6:::step
    classDef step fill:#f9f9f9,stroke:#333,stroke-width:1.5px
```

### Web
```mermaid
flowchart LR
  %% ========== Web Serving (Updated v8 + Hono + Cache Cron) ==========
  subgraph WEB["PoliTopicsWeb / Web Service"]
    WebFrontend["Cloudflare Worker (V8)<br/>WebFrontend<br/>Host: politopics.net<br/>(serves SPA from R2)"]
    WebBackend["Cloudflare Worker (V8) + Hono<br/>WebBackend API<br/>Host: api.politopics.net<br/>Endpoints: /headlines, /suggest"]
    AssetEdge["Cloudflare (R2 public access)<br/>Asset Host: asset.politopics.net"]
  end

  User["User<br/>(Browser / Mobile)"]

  R2Spa[("Cloudflare R2<br/>SPA assets<br/>(politopics.net)")]
  R2Asset[("Cloudflare R2<br/>Recap Assets<br/>(asset.politopics.net)")]
  ArticleTable[("DynamoDB<br/>ArticleTable: politopics_article_table")]

  %% ========== Cache Cron ==========
  subgraph CRON["Cache Cron (Daily)"]
    CacheSchedule["EventBridge (Cron)<br/>1/day"]
    CacheLambda["AWS Lambda (Node.js)<br/>CacheCronLambda<br/>Embeds /headlines into index.html"]
  end

  %% ---- Page load ----
  User -->|Requests Page| WebFrontend
  WebFrontend -->|Serves SPA assets| R2Spa

  %% ---- API (metadata only) ----
  User -->|"Requests API<br/>GET /headlines<br/>GET /suggest"| WebBackend
  WebBackend -->|"Reads article index<br/>(GSI filter/sort)"| ArticleTable
  WebBackend -->|"Returns JSON (metadata):<br/>title, date, ...<br/>recapAssetURL"| User

  %% ---- Direct asset download (client-side) ----
  User -->|Downloads recap assets directly| AssetEdge
  AssetEdge -->|Fetch asset objects| R2Asset

  %% ---- Recap assets content hint ----
  R2Asset ---|"Recap asset fields:<br/>title, description, participants, <br/>keywords, nameOfHouse, etc..."| R2Asset

  %% ---- Cache cron flow ----
  CacheSchedule -->|Triggers| CacheLambda
  CacheLambda -->|"Reads latest headlines<br/>(from ArticleTable)"| ArticleTable
  CacheLambda -->|"Writes updated index.html<br/>(headlines embedded)"| R2Spa
```

## Data flow (text)
1) National Diet API -> DataCollection Lambda
2) DataCollection Lambda -> R2 (prompts)
3) DataCollection Lambda -> DynamoDB LLM task table
4) Recap Fargate -> R2 (chunk/reduce results)
5) Recap Fargate -> DynamoDB article table + R2 article assets (public/signed URLs)
6) Web backend (Cloudflare Workers V8 + Hono) -> DynamoDB + R2 assets
7) Web frontend -> Web backend API and direct R2 asset fetch

## Network and infra
- AWS-managed services (Lambda, Fargate, DynamoDB, API Gateway, EventBridge/Scheduler) plus Cloudflare Workers/R2 for serving.
- Local development uses LocalStack for DynamoDB, Lambda, and API Gateway; Workers and R2 use their dev tooling or S3 API endpoints.

## Environment-specific configuration
- Local: LocalStack endpoints, test credentials, local table/bucket names, and Workers dev config.
- Stage/Prod: AWS endpoints, Cloudflare production accounts, stage/prod table/bucket names.
- See `docs/system_overview.md` and each module `config.ts` for exact names.
