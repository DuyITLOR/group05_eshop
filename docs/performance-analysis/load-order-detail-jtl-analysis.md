# Phân tích JTL production — READ_HEAVY / LOAD

## 1. Metadata

- Scenario / Group: `LOAD` / `READ_HEAVY`
- Endpoint: `GET /api/orders/:id`
- JTL: `results/23127107_Load_20260812/run-002/raw/23127107_Load_20260812_run-002.jtl`
- SHA-256: `35B7055E06C290A43358ECA8380C42F18A04507B0F41F58E23C4F1E31E9F3A66`
- Analysis Status: `COMPLETE`
- Raw unchanged: `true`

## 2. RAW FACTS

Raw JTL có một sampler label `GET Order Detail - Baseline` và `GET Order Detail - Increment`. Không có setup/preflight request trong JTL này.

| Metric | Overall |
|---|---:|
| Test start timestamp | `2026-08-15T17:55:59.854Z` |
| Test end timestamp | `2026-08-15T17:57:57.925Z` |
| Observed JTL duration | `118.071 s` |
| Total samples | `1250` |
| Successful / failed | `1250 / 0` |
| Error rate | `0%` |
| Min / max | `0 / 28 ms` |
| Mean | `1.5824 ms` |
| Median / p50 | `2 / 2 ms` |
| p90 / p95 / p99 | `2 / 2 / 3 ms` |
| Throughput | `10.58685 RPS` |

Response code breakdown: HTTP `200` = `1250`.

Per-label facts:

| Label | Samples | Mean | p50 | p95 | p99 | Max | Throughput |
|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline | 774 | 1.624031 ms | 2 ms | 3 ms | 4 ms | 28 ms | 6.563828 RPS |
| Increment | 476 | 1.514706 ms | 1 ms | 2 ms | 3 ms | 3 ms | 6.000403 RPS |

Time-window facts từ parser (`60s`, không filtering/warm-up):

| Window | Samples | Mean | p95 | p99 | Throughput |
|---|---:|---:|---:|---:|---:|
| `0-60s` | 478 | 1.784519 ms | 3 ms | 4 ms | 7.966667 RPS |
| `60-120s` (observed 58.071s) | 772 | 1.457254 ms | 2 ms | 3 ms | 13.294071 RPS |

Resource evidence độc lập: `133` samples, backend-not-alive `0`; system CPU `9.19-54.67%` (average `19.83%`); backend working set `56045568-67702784` bytes (average `63772810.59`). Đây là correlation context, không phải causal proof.

## 3. Calculation Notes

- `PERCENTILE_METHOD`: nearest-rank, `rank = ceil(p / 100 * n)`, one-based, không interpolation.
- Response time field: `elapsed`, đơn vị milliseconds.
- Median: statistical median; even `n` là trung bình của hai giá trị giữa.
- Throughput: total samples / observed timestamp span.
- Filtering/warm-up: `none`.
- Application-level success: `NOT_AVAILABLE` chỉ từ standard JTL fields.

## 4. AI Interpretation Candidates for Student Review

| ID | AI Proposed Statement | Evidence | Confidence | Potential Misinterpretation Risk |
|---|---|---|---|---|
| `L-001` | Trong run này, tail latency quan sát được thấp và ổn định giữa hai cửa sổ (`p95 3 -> 2 ms`). | Parser windows và overall metrics | `MEDIUM` | Bị đọc thành SLA/pass hoặc ổn định cho mọi tải khác. |
| `L-002` | Throughput cửa sổ sau cao hơn cửa sổ đầu (`13.294071` vs `7.966667 RPS`) mà không có error. | Window metrics | `LOW` | Bị đọc thành capacity scaling proof; hai cửa sổ có concurrency profile khác nhau. |
| `L-003` | Không thấy lỗi transport/assertion trong `1250` samples. | `success=true`, HTTP `200` | `HIGH` | Bị đọc thành toàn bộ business correctness hoặc auth/owner coverage. |

Đây là `AI_PROPOSED_INTERPRETATION`, chưa phải kết luận được Student duyệt.

## 5. Proposed Thresholds

Tất cả đều là `AI_PROPOSED_THRESHOLD`, `PENDING_STUDENT_REVIEW`, không phải SLA.

| Threshold | Candidate | Derivation / limitation |
|---|---:|---|
| p95 response time | `<= 5 ms` | Max observed window p95 `3 ms` x margin `1.5`, làm tròn lên; cần workload/baseline tương đương để dùng lại. |
| Error rate | `<= 0.5%` | Observed `0%` + guardrail `0.5` percentage point; không chứng minh business error absence. |

Confidence: `LOW_TO_MEDIUM`. Student threshold review bắt buộc.

## 6. Claim Verification / Misinterpretation Findings

Không có external AI claim cần verify trong input này: `Misinterpretations Found: 0`.

Không có causal claim. `CPU` và `Memory` có resource evidence, nhưng `Hardware Resource Conclusion: NOT_SUPPORTED_BY_CURRENT_EVIDENCE`.

## 7. Limitations and Human Review

- Endpoint/source implementation discrepancy về auth/owner scope vẫn giữ nguyên; run này không chứng minh JWT/owner authorization.
- Không kết luận good/bad performance, SLA, capacity, bottleneck, regression hoặc production readiness.
- Potential issue candidate: `NONE_CONFIRMED`; observed JTL facts alone không chứng minh absence of all defects.
- Optimization: `NOT_STARTED`.

## Optimization Recommendations

Không đưa final optimization recommendation ở checkpoint này. `O-001` chỉ là `POTENTIAL_INVESTIGATION_AREA`: kiểm tra lại cùng profile nếu cần baseline lặp; Technology Applicability `NOT_VERIFIED`, Classification `NEEDS_MORE_EVIDENCE`, Benefit Proven `NO`.

Review Status: `FINALIZED`  
Student Decision: `MODIFIED_AND_APPROVED`  
Raw Metrics Decision: `APPROVED`  
Threshold Decision: `MODIFIED_AND_APPROVED`  
Interpretation Decision: `MODIFIED_AND_APPROVED`  
Misinterpretation Hunt: `COMPLETE`  
Optimization: `NOT_STARTED`

## 7. Student Review

| Candidate | Student Decision | Review Note |
|---|---|---|
| `L-001` | `ACCEPT` | Chấp nhận trong phạm vi hai cửa sổ của run này; không phải SLA, capacity hoặc kết luận cho tải khác. |
| `L-002` | `MODIFY` | Throughput tăng giữa hai cửa sổ cùng với thay đổi profile/concurrency; không dùng làm bằng chứng capacity scaling. |
| `L-003` | `MODIFY` | `0%` failure và HTTP `200` chỉ xác nhận raw transport/assertion facts; không xác nhận business correctness, auth hoặc owner coverage. |

**Final Student Interpretation:** Run LOAD cho thấy các metric quan sát được của chính workload này; không kết luận `good performance`, SLA, capacity hay production readiness.

## 8. Final Review Status

- Raw Metrics Decision: `APPROVED`
- Threshold Decision: `MODIFIED_AND_APPROVED` (`p95 <= 5 ms`, error rate `<= 0.5%`; coursework guardrail, không phải SLA)
- Interpretation Decision: `MODIFIED_AND_APPROVED`
- Misinterpretation Hunt: `COMPLETE`
- Optimization: `NOT_STARTED`
