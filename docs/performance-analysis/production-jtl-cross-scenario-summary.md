# Tổng hợp JTL production — Task 2

## 1. Phạm vi

Chỉ so sánh ba raw JTL production đã finalized. Supporting Endurance JTL không phải scenario thứ tư và không được gộp vào bảng này.

| Scenario | Group / Endpoint | Raw JTL SHA-256 | Samples | Error rate | Observed duration |
|---|---|---|---:|---:|---:|
| `LOAD` | `READ_HEAVY` / `GET /api/orders/:id` | `35B7055E06C290A43358ECA8380C42F18A04507B0F41F58E23C4F1E31E9F3A66` | 1250 | 0% | 118.071s |
| `SPIKE` | `AUTH_HEAVY` / `GET /api/users/me` | `B5484DF66137CFB3A7B2787D02DFB2D12B69F4AFFA2127D7A05EF524586E30AB` | 2123 | 0% | 66.291s |
| `STRESS` | `TRANSACTIONAL` / `POST /api/admin/coupons` | `8A7510F670FD67905E4887AEC0E584D26136AEBCCFB6B1A2CBA647481C732C5B` | 1687 | 0% | 142.181s |

Ba hash đầy đủ được lưu trong từng analysis artifact và metrics JSON; cả ba parser run đều xác nhận `raw_unchanged=true`.

## 2. FACT — Overall Metrics

| Scenario | Mean (ms) | p50 (ms) | p90 (ms) | p95 (ms) | p99 (ms) | Max (ms) | Throughput (RPS) |
|---|---:|---:|---:|---:|---:|---:|---:|
| `LOAD` | 1.5824 | 2 | 2 | 2 | 3 | 28 | 10.58685 |
| `SPIKE` | 2.963731 | 3 | 4 | 4 | 6 | 55 | 32.025463 |
| `STRESS` | 6.033788 | 6 | 7 | 8 | 16 | 33 | 11.865158 |

All three runs: successful / failed = `1250/0`, `2123/0`, `1687/0`; response code breakdown is HTTP `200` for every raw sample. Standard JTL application semantics remain `NOT_AVAILABLE` unless separately evidenced.

Throughput is not directly rankable as best/worst: endpoints, concurrency shapes, Timer settings, and scenario goals differ.

## 3. FACT — Resource Evidence

| Scenario | Resource samples | Backend-not-alive | System CPU min/avg/max | Backend RSS min/avg/max |
|---|---:|---:|---:|---:|
| `LOAD` | 133 | 0 | 9.19 / 19.83 / 54.67% | 56045568 / 63772810.59 / 67702784 bytes |
| `SPIKE` | 82 | 0 | 11.56 / 21.95 / 55.62% | 56582144 / 81043555.9 / 96272384 bytes |
| `STRESS` | 157 | 0 | 8.83 / 14.27 / 39.60% | 56414208 / 72063067.31 / 91508736 bytes |

Resource evidence supports timestamp correlation only. It does not prove causation, hardware maximum, memory-leak absence, or bottleneck.

## 4. DERIVED_METRIC — Stage / Window Context

- `LOAD`: two 60-second windows are available; p95 `3 -> 2 ms`, throughput `7.966667 -> 13.294071 RPS`. Đây là profile transition, không phải capacity test.
- `SPIKE`: timestamp stage map coverage `97.880358%`; `BASELINE`, `SPIKE_RAMP_AND_HOLD`, `RECOVERY_RAMP_AND_HOLD` được tính riêng. `45` samples ngoài map giữ trong overall.
- `STRESS`: timestamp stage map coverage `80.853586%`; hold-stage và recovery metrics được tính. `323` samples ở ramp intervals không bị bỏ khỏi overall.
- Stress limitation: `STATE_GROWTH_CONFOUND: DOCUMENTED`; `POTENTIAL_WRITE_CONTENTION: UNVERIFIED`.

## 5. AI Interpretation Candidates for Student Review

| ID | Candidate boundary | Risk |
|---|---|---|
| `X-001` | Các p95/p99 khác nhau giữa scenario không thể dùng để xếp hạng trực tiếp vì workload và endpoint khác nhau. | So sánh apples-to-apples sai. |
| `X-002` | `0%` error rate là observation của JTL, không phải SLA/business correctness. | Đổi transport/assertion success thành application PASS. |
| `X-003` | Resource và latency cùng khoảng thời gian chỉ cho phép correlation wording. | Gán CPU/RSS là nguyên nhân mà không có causal evidence. |
| `X-004` | Stress stage changes cần giữ state-growth confound. | Gọi stage cuối là SQLite bottleneck hoặc absolute breakpoint. |

## 6. AI Threshold Proposals

Các threshold dưới đây là `AI_PROPOSED_THRESHOLD`, đều `PENDING_STUDENT_REVIEW`:

| Scenario | p95 candidate | Error-rate candidate | Basis |
|---|---:|---:|---|
| `LOAD` | `<= 5 ms` | `<= 0.5%` | Max observed window p95 `3 ms` x 1.5 margin; observed error `0%`. |
| `SPIKE` | `<= 6 ms` | `<= 0.5%` | Max mapped-stage p95 `5 ms` x 1.2 margin; stage coverage partial. |
| `STRESS` | `<= 16 ms` | `<= 0.5%` | Max hold/recovery p95 `13 ms` x 1.2 margin; state-growth confound. |

Đây không phải official SLA, production SLA hoặc instructor requirement. Student phải review basis, margin và applicability trước khi dùng.

## 7. Boundaries and Human Review

- Endurance result `STABLE_WITHIN_PROPOSED_THRESHOLD` chỉ là supporting Task 1 context, không nằm trong production comparison.
- Optimization: `NOT_STARTED`.
- Potential issue candidates chỉ là investigation prompts; chưa có root-cause hoặc code/database recommendation nào được chấp thuận.
- Misinterpretation findings: `0` external claims supplied; candidate boundaries trên là AI review prompts, không phải false claims được chèn vào.
- Review Status: `FINALIZED`
- Student Decision: `MODIFIED_AND_APPROVED`
- Raw Metrics Decision: `APPROVED`
- Threshold Decision: `MODIFIED_AND_APPROVED`
- Interpretation Decision: `MODIFIED_AND_APPROVED`
- Misinterpretation Hunt: `COMPLETE`

CHECKPOINT: `AI_PERFORMANCE_ANALYSIS_REVIEW_REQUIRED`

Human Review Required For: raw metric interpretation, proposed thresholds, stage limitations, correlation wording, misinterpretation candidates và issue candidates.

## Optimization Recommendations

`O-001`: `POTENTIAL_INVESTIGATION_AREA` chỉ — kiểm tra reproducibility và state-reset sensitivity trong một workflow được Student duyệt. Technology Applicability: `NOT_VERIFIED`; Classification: `NEEDS_MORE_EVIDENCE`; Benefit Proven: `NO`; Student Decision: `NOT_REVIEWED`.

## 8. Student Review

| Candidate | Student Decision | Final boundary |
|---|---|---|
| `X-001` | `ACCEPT` | Không rank trực tiếp p95/p99 hoặc throughput giữa các scenario khác endpoint/workload. |
| `X-002` | `MODIFY` | `0%` error chỉ là raw JTL observation, không phải SLA hay business correctness. |
| `X-003` | `ACCEPT` | Resource và latency chỉ được mô tả theo correlation; không claim causality. |
| `X-004` | `ACCEPT` | Stress interpretation phải giữ `STATE_GROWTH_CONFOUND` và `POTENTIAL_WRITE_CONTENTION: UNVERIFIED`; không gọi absolute breakpoint. |

Misinterpretation Hunt: `COMPLETE`; các correction trên là Student corrections cho những cách diễn giải dễ vượt quá evidence boundary. Raw metrics đã được kiểm tra độc lập và giữ nguyên.

## 9. Final Review Status

- Student Decision: `MODIFIED_AND_APPROVED`
- Approval Scope: `TASK2_PRODUCTION_JTL_ANALYSIS`
- Raw Metrics Decision: `APPROVED`
- Threshold Decision: `MODIFIED_AND_APPROVED`
- Interpretation Decision: `MODIFIED_AND_APPROVED`
- Optimization: `NOT_STARTED`
