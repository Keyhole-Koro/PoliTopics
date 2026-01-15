# Functional Features Guide

This document outlines the key features and functional flows of the PoliTopics system, organized by capability.

## 1. Data Ingestion & Task Management (DataCollection)
The **DataCollection** service is responsible for discovering new content and preparing it for processing.

- **National Diet API Integration**: Fetches meeting records based on date ranges.
- **Smart Chunking**: Splits long meeting transcripts into manageable chunks that fit within the LLM's context window (Token Budget awareness).
- **Task Creation**:
  - Creates a master task in DynamoDB for each meeting (Issue ID).
  - Stores prompt payloads in S3.
  - Supports both "Single Chunk" (short meetings) and "Map-Reduce" (long meetings) strategies.

## 2. AI Summarization Pipeline (Recap)
The **Recap** service consumes tasks and generates the actual content.

- **Polling & Processing**: Continuously checks DynamoDB for pending tasks.
- **Scheduler**: Configurable execution windows (e.g., 9:00-17:00) to respect API rate limits and budget constraints.
- **LLM Integration**: Uses Google Gemini Pro to generate summaries.
  - **Map Phase**: Summarizes individual chunks of long meetings.
  - **Reduce Phase**: Combines chunk summaries into a final coherent article.
- **Retry Mechanism**: Automatically retries failed tasks with exponential backoff.
- **Failure Analysis**: Dumps invalid payloads (e.g., malformed JSON from LLM) to S3 for debugging.

## 3. Web & API Experience (Web)
The **Web** component serves the content to end-users.

- **Search & Discovery**:
  - Fast, client-side filtering for keywords, categories, and speakers.
  - Backend "Headlines" API for efficient initial load.
  - **Thin Index**: DynamoDB uses specialized index items (GSI) for high-performance list queries without loading heavy content.
- **Rich Content Rendering**:
  - **Markdown Support**: Summaries are rendered using GFM (GitHub Flavored Markdown) to support lists and links.
  - **Secure Assets**: Heavy content (full summaries, dialog logs) is stored in S3 and delivered via **Presigned URLs** with short expiration times, generated on-the-fly by the backend.
- **Developer Tools**:
  - **Swagger UI**: Interactive API documentation available at `/docs` (local/dev only).
  - **Latency Logging**: Backend logs high-resolution timing for performance monitoring.

## 4. Hosting & Infrastructure
The system uses a modern, cost-effective infrastructure strategy.

- **Frontend Hosting**:
  - **Production/Stage**: Hosted on **Cloudflare R2** for low-latency global delivery.
  - **Local/Dev**: Hosted on **LocalStack S3** to simulate the production environment without cloud costs.
- **Serverless Backend**: All logic runs on AWS Lambda (or LocalStack equivalent).
- **Infrastructure as Code**: Entire stack defined in Terraform, enabling identical environments for local, stage, and prod.

## 5. Monitoring & Notifications
A centralized notification system keeps operators informed via Discord.

- **Channel Routing**:
  - `#error`: Critical failures (e.g., budget exceeded, unhandled exceptions).
  - `#warn`: Non-critical issues (e.g., retries, malformed LLM responses).
  - `#batch`: Job completion reports (e.g., "Processed 50 meetings").
  - `#access`: Real-time access logs from the Web backend (status 4xx/5xx).
