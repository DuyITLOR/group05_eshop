# Phân tích JTL production — TRANSACTIONAL / STRESS

## 1. Metadata

- Scenario / Group: `STRESS` / `TRANSACTIONAL`
- Endpoint: `POST /api/admin/coupons`
- JTL: `results/23127107_Stress_20260816/run-001/raw/23127107_Stress_20260816_run-001.jtl`
- SHA-256: `8A7510F670FD67905E4887AEC0E584D26136AEBCCFB6B1A2CBA647481C732C5B`
- Analysis Status: `PARTIAL` cho stage mapping, core metrics `COMPLETE`
- Raw unchanged: `true`

## 2. RAW FACTS

Raw JTL có một sampler label `POST /api/admin/coupons`; preflight requests không nằm trong raw JTL.

| Metric | Overall |
|---|---:|
| Test start timestamp | `2026-08-15T22:24:08.153Z` |
| Test end timestamp | `2026-08-15T22:26:30.334Z` |
| Observed JTL duration | `142.181 s` |
| Total samples | `1687` |
| Successful / failed | `1687 / 0` |
| Error rate | `0%` |
| Min / max | `4 / 33 ms` |
| Mean | `6.033788 ms` |
| Median / p50 | `6 / 6 ms` |
| p90 / p95 / p99 | `7 / 8 / 16 ms` |
| Throughput | `11.865158 RPS` |

Response code breakdown: HTTP `200` = `1687`.

Resource evidence: `157` samples, backend-not-alive `0`; system CPU `8.83-39.60%` (average `14.27%`); backend working set `56414208-91508736` bytes (average `72063067.31`). Đây là correlation context; không có bằng chứng trực tiếp cho causal SQLite locking/write contention.

## 3. Timestamp-based Stress Stages

Stage map dùng `jmeter_started_at` thực tế (`2026-08-15T22:24:02.486Z`) và approved JMX timeline. Các hold-stage được map riêng; ramp intervals không bị giả định là hold-stage.

| Stage | Samples | Mean | p50 | p95 | p99 | Throughput |
|---|---:|---:|---:|---:|---:|---:|
| `STAGE_5_VU_BASELINE` (`0-20s`) | 58 | 7.931034 ms | 7 ms | 13 ms | 33 ms | 2.9 RPS |
| `STAGE_10_VU_HOLD` (`30-50s`) | 152 | 6.375 ms | 6 ms | 8 ms | 10 ms | 7.6 RPS |
| `STAGE_20_VU_HOLD` (`60-80s`) | 312 | 5.974359 ms | 6 ms | 8 ms | 10 ms | 15.6 RPS |
| `STAGE_30_VU_HOLD` (`90-110s`) | 470 | 5.474468 ms | 5 ms | 7 ms | 8 ms | 23.5 RPS |
| `RECOVERY_RAMP_DOWN_AND_HOLD` (`110-145s`) | 372 | 6.448925 ms | 6 ms | 10 ms | 22 ms | 10.628571 RPS |

Stage mapping: `PARTIAL`, `1364/1687` timestamped samples mapped (`80.853586%`). `323` samples thuộc ramp intervals không có hold-stage label và vẫn được giữ trong overall metrics. Stage metrics chỉ hỗ trợ so sánh các hold/recovery windows đã định nghĩa.

`STATE_GROWTH_CONFOUND: DOCUMENTED`: mỗi successful request tạo coupon state trong disposable runtime. `POTENTIAL_WRITE_CONTENTION: UNVERIFIED`.

## 4. AI Interpretation Candidates for Student Review

| ID | AI Proposed Statement | Evidence | Confidence | Potential Misinterpretation Risk |
|---|---|---|---|---|
| `S-001` | Hold-stage throughput tăng từ `2.9` lên `23.5 RPS`, trong khi p95 hold-stage là `13, 8, 8, 7 ms`. | Stage metrics | `MEDIUM` | Bị đọc thành capacity curve hoặc hệ thống tốt hơn ở tải cao; stages có thời lượng/concurrency khác nhau. |
| `S-002` | Recovery p95 `10 ms` và p99 `22 ms` cao hơn stage 30 p95/p99 `7/8 ms`. | Recovery vs hold metrics | `MEDIUM` | Bị quy causal cho database/write contention; state growth và ramp composition là confounds. |
| `S-003` | Không có failed sample/HTTP non-200 trong run. | Overall JTL | `HIGH` | Bị đọc thành transaction/business success tuyệt đối hoặc SLA pass. |

Các câu trên chỉ là `AI_PROPOSED_INTERPRETATION`; không xác nhận breakpoint hay absolute system limit.

## 5. Proposed Thresholds

`PENDING_STUDENT_REVIEW`; không phải official SLA/production SLA.

| Threshold | Candidate | Derivation / limitation |
|---|---:|---|
| p95 response time | `<= 16 ms` | Max observed hold/recovery p95 `13 ms` x margin `1.2` = `15.6`, làm tròn lên; nên đánh giá theo đúng stage map và data-state setup. |
| Error rate | `<= 0.5%` | Observed `0%` + bounded guardrail; không thay thế assertion/business validation. |

Confidence: `LOW_TO_MEDIUM` vì stage coverage partial và `STATE_GROWTH_CONFOUND`.

## 6. Claim Verification / Misinterpretation Findings

Không có external AI claim cần verify: `Misinterpretations Found: 0`.

Không được viết CPU gây latency hoặc SQLite gây degradation. Resource evidence chỉ đủ mô tả correlation; `Hardware Resource Conclusion: NOT_SUPPORTED_BY_CURRENT_EVIDENCE`.

## 7. Limitations and Human Review

- Overall standard JTL success không thay thế application/business-level verification.
- Không kết luận breakpoint, capacity, SLA, bottleneck, regression hoặc production readiness.
- Potential issue candidate: `RECOVERY_TAIL_CANDIDATE`; recovery p95/p99 `10/22 ms` cao hơn stage 30 `7/8 ms`, nhưng state growth và ramp composition là alternatives.
- Optimization: `NOT_STARTED`.

## Optimization Recommendations

Không đưa final optimization recommendation ở checkpoint này. `O-001` chỉ là `POTENTIAL_INVESTIGATION_AREA`: lặp stress với state reset/controlled dataset để tách concurrency khỏi state growth; Technology Applicability `NOT_VERIFIED`, Classification `NEEDS_MORE_EVIDENCE`, Benefit Proven `NO`.

Review Status: `FINALIZED`  
Student Decision: `MODIFIED_AND_APPROVED`  
Raw Metrics Decision: `APPROVED`  
Threshold Decision: `MODIFIED_AND_APPROVED`  
Interpretation Decision: `MODIFIED_AND_APPROVED`  
Misinterpretation Hunt: `COMPLETE`  
Optimization: `NOT_STARTED`

## 8. Student Review

| Candidate | Student Decision | Review Note |
|---|---|---|
| `S-001` | `MODIFY` | Hold-stage throughput tăng cùng concurrency và stage duration khác nhau; không phải capacity curve hoặc dấu hiệu hệ thống tốt hơn ở tải cao. |
| `S-002` | `MODIFY` | Recovery tail cao hơn stage 30 là observation; không quy causal cho SQLite/write contention vì `POTENTIAL_WRITE_CONTENTION` vẫn `UNVERIFIED`. |
| `S-003` | `MODIFY` | `0` failed/HTTP `200` chỉ là JTL facts; không phải transaction/business PASS hoặc SLA PASS. |

**Final Student Interpretation:** Stage comparison chỉ áp dụng cho `1364/1687` mapped samples; `323` ramp samples vẫn nằm trong overall metrics. `STATE_GROWTH_CONFOUND` được giữ là limitation và chưa có breakpoint/root cause.

## 9. Final Review Status

- Raw Metrics Decision: `APPROVED`
- Threshold Decision: `MODIFIED_AND_APPROVED` (`p95 <= 16 ms`, error rate `<= 0.5%`; coursework guardrail, không phải SLA)
- Interpretation Decision: `MODIFIED_AND_APPROVED`
- Misinterpretation Hunt: `COMPLETE`
- Optimization: `NOT_STARTED`
