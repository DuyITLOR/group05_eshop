# HW05 Task 2 — Human Review phân tích JTL production

## 1. Review Scope

Phạm vi review là ba raw JTL production thuộc Task 2: `READ_HEAVY / LOAD`, `AUTH_HEAVY / SPIKE` và `TRANSACTIONAL / STRESS`. Supporting Endurance không thuộc phép so sánh này. Review chỉ xác nhận integrity, metric calculation, interpretation boundaries và threshold candidates; không thực hiện optimization.

## 2. Raw JTL Integrity

| Scenario | Raw JTL | SHA-256 | Result |
|---|---|---|---|
| `LOAD` | `results/23127107_Load_20260812/run-002/raw/23127107_Load_20260812_run-002.jtl` | `35B7055E06C290A43358ECA8380C42F18A04507B0F41F58E23C4F1E31E9F3A66` | `PASS` |
| `SPIKE` | `results/23127107_Spike_20260816/run-003/raw/23127107_Spike_20260816_run-003.jtl` | `B5484DF66137CFB3A7B2787D02DFB2D12B69F4AFFA2127D7A05EF524586E30AB` | `PASS` |
| `STRESS` | `results/23127107_Stress_20260816/run-001/raw/23127107_Stress_20260816_run-001.jtl` | `8A7510F670FD67905E4887AEC0E584D26136AEBCCFB6B1A2CBA647481C732C5B` | `PASS` |

Raw JTL là immutable; không có rerun hoặc chỉnh sửa raw evidence trong review này.

## 3. Raw Metric Verification

| Scenario | Samples | Success / Failed | Error rate | Mean | p95 | p99 | Throughput |
|---|---:|---:|---:|---:|---:|---:|---:|
| `LOAD` | 1250 | 1250 / 0 | 0% | 1.5824 ms | 2 ms | 3 ms | 10.58685 RPS |
| `SPIKE` | 2123 | 2123 / 0 | 0% | 2.963731 ms | 4 ms | 6 ms | 32.025463 RPS |
| `STRESS` | 1687 | 1687 / 0 | 0% | 6.033788 ms | 8 ms | 16 ms | 11.865158 RPS |

Raw Metrics Decision: `APPROVED`. Đây là execution facts, không phải SLA, capacity hoặc business correctness.

## 4. Percentile Method Review

`PASS`. Parser dùng nearest-rank: `ceil(p / 100 * n)`, one-based, không interpolation. `elapsed` được tính bằng milliseconds; median là statistical median. Throughput là total samples chia observed timestamp span. Phương pháp này nhất quán với metrics JSON và ba analysis artifacts.

## 5. LOAD Analysis Review

- `L-001`: `ACCEPT` trong phạm vi hai cửa sổ của run; không phải SLA hoặc kết luận cho tải khác.
- `L-002`: `MODIFY`; throughput `7.966667 -> 13.294071 RPS` đi cùng profile/concurrency thay đổi, không chứng minh capacity scaling.
- `L-003`: `MODIFY`; `0%` failure và HTTP `200` chỉ là transport/assertion facts, không xác nhận business/auth/owner correctness.

Threshold Decision: `MODIFIED_AND_APPROVED`: p95 `<= 5 ms`, error rate `<= 0.5%`. Đây là coursework guardrail được suy ra từ observed metrics và margin, không phải official SLA.

## 6. SPIKE Stage Review

Timestamp segmentation: `PASS`. Stage map dùng `jmeter_started_at` và approved profile. Mapping coverage `2078/2123 = 97.880358%`; `45` unmapped samples vẫn được giữ trong overall metrics.

- `P-001`: `MODIFY`; spike/recovery p95 là stage observations, không gọi `fully recovered` hoặc capacity proof.
- `P-002`: `MODIFY`; baseline p99 `55 ms` là tail observation của `196` samples, không suy ra spike làm hệ thống nhanh hơn.
- `P-003`: `MODIFY`; zero failures/HTTP `200` không xác nhận auth hoặc business correctness.

Stage decision: `ACCEPT_WITH_LIMITATION`. Threshold Decision: `MODIFIED_AND_APPROVED`: p95 `<= 6 ms`, error rate `<= 0.5%`, không phải SLA.

## 7. STRESS Stage Review

Timestamp segmentation: `PASS` cho hold/recovery windows. Mapping coverage `1364/1687 = 80.853586%`; `323` ramp samples không bị drop và vẫn nằm trong overall metrics.

- `S-001`: `MODIFY`; throughput `2.9 -> 23.5 RPS` đi cùng concurrency/stage duration khác nhau, không phải capacity curve.
- `S-002`: `MODIFY`; recovery p95/p99 cao hơn stage 30 là observation; không quy causal cho SQLite/write contention.
- `S-003`: `MODIFY`; zero failures/HTTP `200` không phải transaction/business PASS hoặc SLA PASS.

Giữ nguyên `STATE_GROWTH_CONFOUND: DOCUMENTED` và `POTENTIAL_WRITE_CONTENTION: UNVERIFIED`. Stage decision: `ACCEPT_WITH_LIMITATION`. Threshold Decision: `MODIFIED_AND_APPROVED`: p95 `<= 16 ms`, error rate `<= 0.5%`, không phải SLA.

## 8. Resource Correlation Review

`PASS_WITH_BOUNDARY`. Resource samples tồn tại cho cả ba run và backend-not-alive là `0`, nhưng CPU/RSS chỉ được dùng làm timestamp correlation context. Không có causal claim, hardware maximum, memory-leak absence hoặc bottleneck conclusion nào được approve.

## 9. AI Threshold Review

| Scenario | p95 | Error rate | Decision |
|---|---:|---:|---|
| `LOAD` | `<= 5 ms` | `<= 0.5%` | `MODIFIED_AND_APPROVED` |
| `SPIKE` | `<= 6 ms` | `<= 0.5%` | `MODIFIED_AND_APPROVED` |
| `STRESS` | `<= 16 ms` | `<= 0.5%` | `MODIFIED_AND_APPROVED` |

Các threshold có source, công thức và margin tái lập được; applicability phụ thuộc workload tương ứng. Chúng không thay thế SLA hoặc instructor requirement.

## 10. Misinterpretation Hunt

`COMPLETE`. Các misinterpretation thực tế đã được sửa trong các analysis artifacts: throughput window/stage bị đọc thành capacity; zero-error bị đọc thành business/auth/SLA pass; recovery bị đọc thành fully recovered; resource cùng thời điểm bị đọc thành causal CPU/RSS; recovery tail bị đọc thành SQLite bottleneck. Bản AI gốc được giữ nguyên, còn Student Review và Final Student Interpretation ghi rõ correction.

## 11. Cross-Scenario Interpretation Boundaries

- Cross-scenario comparability: `PASS`; không rank trực tiếp p95/p99/throughput vì endpoint, concurrency shape, Timer và mục tiêu khác nhau.
- Zero-error interpretation: `PASS_WITH_BOUNDARY`; chỉ là raw JTL observation.
- Throughput interpretation: `PASS_WITH_BOUNDARY`; mô tả theo từng profile/window, không phải capacity claim.
- Latency interpretation: `PASS_WITH_BOUNDARY`; p95/p99 là percentile của run/stage tương ứng, không phải SLA.

## 12. Student Corrections

Student chấp nhận raw metrics và percentile method; sửa các candidate diễn giải nêu ở trên để không vượt quá evidence boundary. Stage limitations, `45` SPIKE unmapped samples, `323` STRESS ramp samples, state-growth confound và write contention chưa xác minh được giữ nguyên.

## 13. Final Human Decision

- Review Status: `FINALIZED`
- Student Decision: `MODIFIED_AND_APPROVED`
- Approval Scope: `TASK2_PRODUCTION_JTL_ANALYSIS`
- Raw Metrics Decision: `APPROVED`
- Threshold Decision: `MODIFIED_AND_APPROVED`
- Interpretation Decision: `MODIFIED_AND_APPROVED`
- Misinterpretation Hunt: `COMPLETE`
- Optimization: `NOT_STARTED`

Task 2 hiện đủ điều kiện chuyển sang review optimization; chưa có optimization recommendation nào được phê duyệt trong artifact này.
