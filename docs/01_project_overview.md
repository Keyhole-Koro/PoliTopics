# 1. Project Overview
[日本語版](./jp/01_project_overview.md)

## Service purpose
PoliTopics turns Japanese National Diet records into searchable summaries and a public web experience without human tampering in the loop. It ingests meeting records, builds LLM prompt tasks, generates summaries, and serves them through a web UI and API.

## Problems addressed
- National Diet transcripts are long and difficult to scan for key topics and actors.
- The raw data is not structured for quick search across topics, people, and dates.
- The source National Diet API is hard to browse (UI) and consume (documents) for everyday users.

## Target users
- General citizens who want concise summaries of Diet proceedings.

## Glossary (domain terms)
- National Diet API: External API used to fetch meeting records (Kokkai/National Diet API).
- Meeting: A Diet session meeting record (issueID, house, date, speeches).
- Issue ID: Unique identifier for a meeting record (used as task PK).
- LLM task: A DynamoDB record representing a summarization job for a meeting.
- Chunk: A split of a long meeting prompt used for chunked summarization.
- Reduce prompt: The final prompt that combines chunk results into an article.
- Article: The summarized output stored in DynamoDB + R2.
- Article asset: Large fields (summary, dialogs, etc.) stored in R2 and referenced by URL.
- Article Asset URL: A short-lived, signed or public URL used to access article assets from the frontend.
- Thin index: DynamoDB secondary items used for fast list/search by facets.
- LocalStack: Local AWS emulator used for local development.
