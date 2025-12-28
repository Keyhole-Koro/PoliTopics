# 1. Project Overview

## Service purpose
PoliTopics is a three-part pipeline that turns Japanese National Diet records into searchable summaries and a public web experience. It ingests meeting records, builds LLM prompt tasks, generates summaries, and serves them through a web UI and API.

## Problems addressed
- National Diet transcripts are long and difficult to scan for key topics and actors.
- The raw data is not structured for quick search across topics, people, and dates.
- Heavy payloads (summaries, dialogs) are too large to store efficiently in a single query-friendly store.

## Target users
- General citizens who want concise summaries of Diet proceedings.
- Journalists and researchers who need to search meetings by topic or person.
- Internal operators who run the ingestion and summarization pipeline.

## Glossary (domain terms)
- National Diet API: External API used to fetch meeting records (Kokkai/National Diet API).
- Meeting: A Diet session meeting record (issueID, house, date, speeches).
- Issue ID: Unique identifier for a meeting record (used as task PK).
- LLM task: A DynamoDB record representing a summarization job for a meeting.
- Chunk: A split of a long meeting prompt used for chunked summarization.
- Reduce prompt: The final prompt that combines chunk results into an article.
- Article: The summarized output stored in DynamoDB + S3.
- Article asset: Large fields (summary, dialogs, etc.) stored in S3 and referenced by URL.
- Thin index: DynamoDB secondary items used for fast list/search by facets.
- LocalStack: Local AWS emulator used for local development.
