# Phân tích JTL production — AUTH_HEAVY / SPIKE

## 1. Metadata

- Scenario / Group: `SPIKE` / `AUTH_HEAVY`
- Endpoint: `GET /api/users/me`
- JTL: `results/23127107_Spike_20260816/run-003/raw/23127107_Spike_20260816_run-003.jtl`
- SHA-256: `B5484DF66137CFB3A7B2787D02DFB2D12B69F4AFFA2127D7A05EF524586E30AB`
- Analysis Status: `PARTIAL` cho stage mapping, core metrics `COMPLETE`
- Raw unchanged: `true`

## 2. RAW FACTS

Raw JTL có một sampler label `GET /api/users/me`; không đưa setup/preflight request vào metrics.

| Metric | Overall |
|---|---:|
| Test start timestamp | `2026-08-15T20:51:26.555Z` |
| Test end timestamp | `2026-08-15T20:52:32.846Z` |
| Observed JTL duration | `66.291 s` |
| Total samples | `2123` |
| Successful / failed | `2123 / 0` |
| Error rate | `0%` |
| Min / max | `1 / 55 ms` |
| Mean | `2.963731 ms` |
| Median / p50 | `3 / 3 ms` |
| p90 / p95 / p99 | `4 / 4 / 6 ms` |
| Throughput | `32.025463 RPS` |

Response code breakdown: HTTP `200` = `2123`.

Resource evidence: `82` samples, backend-not-alive `0`; system CPU `11.56-55.62%` (average `21.95%`); backend working set `56582144-96272384` bytes (average `81043555.9`). Các giá trị này là resource facts, không chứng minh CPU gây ra latency.

## 3. Timestamp-based Spike Stages

Stage map dùng `jmeter_started_at` thực tế (`2026-08-15T20:51:21.309Z`) và approved profile `5 VUs / 20s -> 25 VUs in 3s -> 25 VUs / 20s -> 5 VUs in 5s -> 5 VUs / 20s`.

| Stage | Samples | Mean | p50 | p95 | p99 | Throughput |
|---|---:|---:|---:|---:|---:|---:|
| `BASELINE` (`0-20s`) | 196 | 4.127551 ms | 3 ms | 5 ms | 55 ms | 9.8 RPS |
| `SPIKE_RAMP_AND_HOLD` (`20-43s`) | 1229 | 2.925142 ms | 3 ms | 5 ms | 6 ms | 53.434783 RPS |
| `RECOVERY_RAMP_AND_HOLD` (`43-68s`) | 653 | 2.705972 ms | 3 ms | 4 ms | 5 ms | 26.12 RPS |

Stage mapping: `PARTIAL`, `2078/2123` timestamped samples mapped (`97.880358%`); `45` samples nằm ngoài stage map và không bị silently drop khỏi overall metrics. Vì vậy stage comparison là evidence-backed nhưng không phải full-run partition.

## 4. AI Interpretation Candidates for Student Review

| ID | AI Proposed Statement | Evidence | Confidence | Potential Misinterpretation Risk |
|---|---|---|---|---|
| `P-001` | Trong stage map, throughput tăng mạnh ở `SPIKE_RAMP_AND_HOLD` và p95 giữ ở `5 ms`; recovery p95 là `4 ms`. | Stage metrics | `MEDIUM` | Bị đọc thành hệ thống đã fully recovered hoặc capacity đã chứng minh. |
| `P-002` | Baseline có p99 `55 ms`, cao hơn p99 `6 ms` của spike stage. | Stage p99 nearest-rank | `MEDIUM` | Bị đọc thành spike làm hệ thống nhanh hơn; baseline chỉ có 196 samples và có một tail observation. |
| `P-003` | Không có failed sample/HTTP non-200 trong `2123` samples. | Overall JTL | `HIGH` | Bị đọc thành auth/business correctness hoặc không có mọi loại lỗi ngoài JTL. |

Các câu trên là `AI_PROPOSED_INTERPRETATION`; không kết luận `RECOVERY_OBSERVED` theo nghĩa fully recovered vì chưa đặt tolerance so sánh baseline.

## 5. Proposed Thresholds

`PENDING_STUDENT_REVIEW`; các giá trị là recommendation, không phải SLA.

| Threshold | Candidate | Derivation / limitation |
|---|---:|---|
| p95 response time | `<= 6 ms` | Max observed mapped-stage p95 `5 ms` x margin `1.2`, làm tròn lên; cần cùng spike profile và stage mapping. |
| Error rate | `<= 0.5%` | Observed `0%` + bounded guardrail; không thay thế auth lockout/business criteria. |

Confidence: `LOW_TO_MEDIUM` vì stage coverage partial và baseline tail nhỏ.

## 6. Claim Verification / Misinterpretation Findings

Không có external AI claim cần verify: `Misinterpretations Found: 0`.

CPU/RSS chỉ được dùng cho correlation description. `Hardware Resource Conclusion: NOT_SUPPORTED_BY_CURRENT_EVIDENCE`.

## 7. Limitations and Human Review

- CSV của AUTH_HEAVY là `TRACEABILITY_ONLY` theo approved plan; standard JTL không chứng minh token value hay business identity beyond execution evidence.
- Không kết luận SLA, capacity, bottleneck, regression, production readiness hoặc fully recovered.
- Potential issue candidate: `UNVERIFIED`; baseline p99 `55 ms` và stage mapping partial cần Student kiểm tra trước khi gọi degradation/recovery.
- Optimization: `NOT_STARTED`.

## Optimization Recommendations

Không đưa final optimization recommendation ở checkpoint này. `O-001` chỉ là `POTENTIAL_INVESTIGATION_AREA`: repeat cùng spike profile với stage/tolerance review; Technology Applicability `NOT_VERIFIED`, Classification `NEEDS_MORE_EVIDENCE`, Benefit Proven `NO`.

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
| `P-001` | `MODIFY` | Throughput/p95 của stage map được chấp nhận như quan sát stage; không gọi recovery là fully recovered và không suy ra capacity. |
| `P-002` | `MODIFY` | Baseline p99 `55 ms` là tail observation của `196` samples; không diễn giải thành spike làm hệ thống nhanh hơn. |
| `P-003` | `MODIFY` | `0` failed/HTTP `200` chỉ là JTL execution facts; không xác nhận auth/business correctness hay absence của mọi lỗi. |

**Final Student Interpretation:** Stage segmentation hợp lệ theo timestamp nhưng chỉ bao phủ `2078/2123` samples; `45` samples unmapped vẫn thuộc overall metrics. Không kết luận fully recovered, capacity, SLA hoặc auth correctness.

## 9. Final Review Status

- Raw Metrics Decision: `APPROVED`
- Threshold Decision: `MODIFIED_AND_APPROVED` (`p95 <= 6 ms`, error rate `<= 0.5%`; coursework guardrail, không phải SLA)
- Interpretation Decision: `MODIFIED_AND_APPROVED`
- Misinterpretation Hunt: `COMPLETE`
- Optimization: `NOT_STARTED`
