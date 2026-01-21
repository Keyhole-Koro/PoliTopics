# 14. Incident Response
[日本語版](./jp/14_incident_response.md)

- Unprocessed tasks with `retryAttempts >= 3` are intentionally skipped; do not re-run them unless the cap is raised.
- If the LLM API is under load, requests may be skipped; monitor rate limits and retry once the provider recovers.
- DataCollection cron queries meetings from 21 days ago to today (the Diet API publishes records with a delay of a few days after meetings) and skips any issueId already present in tasks.
- Frontend article metadata cache is refreshed daily; if `index.html` lacks `headline-cache`, the SPA fetches `/headlines` on load.
