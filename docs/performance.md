# Backend API Latency Comparison
[Japanese Version](./jp/performance.md)

Latency measurements for backend APIs running on **AWS Lambda** and **Cloudflare Workers**.

> **Measurement script:** `profile/measure-backend-latency.js`  
> The script repeatedly calls each backend endpoint and records latency statistics.

---

## Cold Start Latency

| Endpoint     | AWS Lambda   | Cloudflare Workers   |
| ------------ | ------------ | -------------------- |
| `/headlines` | 4600–6600 ms | - ms (no cold start) |
| `/article`   | ~6880 ms     | - ms (no cold start) |

---

## Steady-State Latency (Average / p95)

### `/headlines`

| Platform           |   Avg (ms) |   p95 (ms) |   Max (ms) |
| ------------------ | ---------: | ---------: | ---------: |
| AWS Lambda         |      454.6 |    1496.98 |    1496.98 |
| Cloudflare Workers | **234.79** | **567.15** | **567.15** |

---

### `/article`

| Platform           |   Avg (ms) |   p95 (ms) |   Max (ms) |
| ------------------ | ---------: | ---------: | ---------: |
| AWS Lambda         |     763.87 |    1446.46 |    1446.46 |
| Cloudflare Workers | **377.91** | **554.54** | **554.54** |

---

### `/search`

| Platform           |  Avg (ms) |   p95 (ms) |   Max (ms) |
| ------------------ | --------: | ---------: | ---------: |
| AWS Lambda         |    296.75 |     630.88 |     630.88 |
| Cloudflare Workers | **85.88** | **211.02** | **211.02** |

---

## Overall Comparison (Avg Latency)

| Endpoint     | AWS Lambda | Cloudflare Workers | Faster         |
| ------------ | ---------- | ------------------ | -------------- |
| `/headlines` | 454.6 ms   | **234.79 ms**      | Workers (1.9×) |
| `/article`   | 763.87 ms  | **377.91 ms**      | Workers (2.0×) |
| `/search`    | 296.75 ms  | **85.88 ms**       | Workers (3.5×) |

---

## Summary

- **Cloudflare Workers outperform AWS Lambda across all endpoints**
- **Cold start latency is a major disadvantage for AWS Lambda**
- Workers show **significantly better tail latency (p95)**, which is critical for user-facing APIs
