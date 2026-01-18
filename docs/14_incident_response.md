# 14. Incident Response
[Japanese Version](./jp/14_incident_response.md)

## First response
- Check CloudWatch logs for the failing Lambda.
- For DataCollection, inspect the `ERROR_BUCKET` for failure payloads.
- Verify DynamoDB table health and throttling metrics.

## Escalation
- Escalate to maintainers responsible for the specific service (DataCollection, Recap, Web).
- Provide the failing request ID and relevant log excerpts.

## Recovery flow
- Re-run DataCollection `/run` for the affected date range if tasks were not created.
- Re-run Recap by letting the scheduler pick up pending tasks, or invoke manually.
- Re-deploy the affected Lambda if a code regression is suspected.
