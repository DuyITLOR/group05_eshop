# HW05 — Performance Testing Report

**Student ID:** `23127107`

**Execution date:** `2026-08-12`

**Report status:** `DRAFT_FOR_HUMAN_REVIEW`
**Workflow checkpoint:** `FINAL_REPORT_HUMAN_REVIEW_REQUIRED`

## 1. Tóm tắt

Báo cáo này tổng hợp các artifact hiện hành của HW05 Performance Testing. Phạm vi gồm ba production scenario đã được Human Review chấp thuận, một supporting Endurance artifact, Task 2 JTL analysis, Task 3 continuous-performance proposal và các bug report phát hiện trong quá trình kiểm thử.

Báo cáo không tạo lại JMeter plan, không chạy JMeter, không tạo JTL/HTML mới và không đưa ra kết luận SLA, capacity hoặc production readiness. Mọi số liệu runtime trong báo cáo đều được đọc từ raw JTL và execution-review artifact tương ứng.

## 2. Mục tiêu và phạm vi

### Mục tiêu

- Đánh giá ba endpoint theo ba workload khác nhau: `LOAD`, `SPIKE`, `STRESS`.
- Lưu lại workload model, test data, assertion, Listener và execution evidence có thể truy vết.
- Phân tích raw JTL bằng percentile, throughput, error rate và stage context.
- Tách bạch performance observation với security, authorization, correctness và data-minimization findings.
- Đề xuất quy trình Continuous Performance Testing ở mức proposal-only.

### Ngoài phạm vi

- Không coi `0%` error là SLA hoặc business correctness.
- Không suy ra capacity ceiling, bottleneck, memory leak hay root cause chỉ từ một run.
- Không coi supporting Endurance là scenario thứ tư.
- Không triển khai CI, không sửa source code, không sửa JMX/CSV và không chạy lại JMeter trong bước tạo report.

## 3. Môi trường và kiểm soát thực thi

| Thành phần        | Context đã ghi nhận                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| SUT               | Node.js/Express eShop backend với SQLite                                                              |
| Load tool         | Apache JMeter `5.6.3`                                                                                 |
| Execution host    | Windows development environment của Student                                                           |
| Runtime isolation | `DISPOSABLE_BACKEND_RUNTIME_COPY` cho workload có mutation                                            |
| Test data         | CSV riêng cho từng production endpoint group                                                          |
| Authentication    | JWT externalized qua runtime property; secret không nằm trong CSV/JMX/log                             |
| Resource evidence | CPU/RSS/backend liveness được ghi trong `resource-monitor.csv`, summary và metadata                   |
| Database safety   | Source DB hash được kiểm tra trước/sau các run production; Stress không chạy trực tiếp trên source DB |

Các **final successful production execution reviews** ghi JMeter exit `0`, một invocation, không silent rerun và không phát hiện secret exposure. Các attempt lỗi lịch sử được phân loại riêng ở mục 5.6; chúng không có measured workload result. Đây là evidence-integrity facts, không phải bằng chứng hệ thống đã đạt SLA.

## 4. Ma trận production scenario

Mỗi endpoint group được map đúng một scenario. Listener/report view cũng khác nhau giữa ba scenario.

| Group           | Endpoint                  | Scenario | Listener / report view             | JMX                                       | CSV                                         | Raw JTL                                                                             |
| --------------- | ------------------------- | -------- | ---------------------------------- | ----------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------- |
| `READ_HEAVY`    | `GET /api/orders/:id`     | `LOAD`   | `Summary Report`                   | `test-plans/23127107_Load_20260812.jmx`   | `test-data/read-heavy-orders.csv`           | `results/23127107_Load_20260812/run-002/raw/23127107_Load_20260812_run-002.jtl`     |
| `AUTH_HEAVY`    | `GET /api/users/me`       | `SPIKE`  | `jp@gc - Response Times Over Time` | `test-plans/23127107_Spike_20260816.jmx`  | `test-data/auth-heavy-users-me.csv`         | `results/23127107_Spike_20260816/run-003/raw/23127107_Spike_20260816_run-003.jtl`   |
| `TRANSACTIONAL` | `POST /api/admin/coupons` | `STRESS` | `Aggregate Report`                 | `test-plans/23127107_Stress_20260816.jmx` | `test-data/transactional-admin-coupons.csv` | `results/23127107_Stress_20260816/run-001/raw/23127107_Stress_20260816_run-001.jtl` |

Controlled `POST /api/apply-coupon` evidence is not part of this final production matrix. Rejected or superseded designs are retained only as history and are not counted as final scenarios.

## 5. Task 1 — Thiết kế và thực thi

### 5.1 READ_HEAVY / LOAD

**Endpoint analysis.** `GET /api/orders/:id` là read path theo order identifier. CSV `test-data/read-heavy-orders.csv` drive `${order_id}` trong request path. Runtime source evidence cho thấy route hiện không được trình bày như owner-authorization coverage; vì vậy kết quả Load không được diễn giải thành JWT/ownership validation.

**Workload được duyệt.** `0 -> 5 VUs` trong `10s`, giữ `5 VUs` `30s`, `5 -> 10 VUs` trong `20s`, giữ `10 VUs` `60s`; scheduled duration `120s`. `Uniform Random Timer` tạo Think Time `500-1000ms`. Đây là baseline/normal-load profile, không phải stress capacity test.

**Execution facts.** Final run là `run-002`; raw JTL SHA-256 là `35B7055E06C290A43358ECA8380C42F18A04507B0F41F58E23C4F1E31E9F3A66`. Có `1250` samples, `1250` successful, `0` failed; observed duration `118.071s`; HTML report và resource evidence tồn tại. Resource monitor có `133` samples, backend-not-alive `0`, system CPU `9.19/19.83/54.67%` (min/avg/max), backend RSS `56045568/63772810.59/67702784` bytes.

### 5.2 AUTH_HEAVY / SPIKE

**Endpoint analysis.** `GET /api/users/me` kiểm tra JWT verification và identity lookup. Đây không phải login/password-hashing, failed-login lockout hoặc brute-force scenario. CSV giữ identity traceability; JWT được truyền qua external runtime property và không ghi vào repository artifacts.

**Workload được duyệt.** Baseline `5 VUs / 20s` -> tăng lên `25 VUs` trong `3s` -> giữ `25 VUs / 20s` -> giảm `25 -> 5 VUs` trong `5s` -> recovery `5 VUs / 20s`; scheduled duration `68s`. Think Time `250-500ms`.

**Execution facts.** Final run là `run-003`; raw JTL SHA-256 là `B5484DF66137CFB3A7B2787D02DFB2D12B69F4AFFA2127D7A05EF524586E30AB`. Có `2123` samples, `2123` successful, `0` failed; observed duration `66.291s`; stage-map coverage `97.880358%`, còn `45` samples ngoài map nhưng vẫn nằm trong overall metrics. Resource monitor có `82` samples, backend-not-alive `0`, CPU `11.56/21.95/55.62%`, RSS `56582144/81043555.9/96272384` bytes.

### 5.3 TRANSACTIONAL / STRESS

**Endpoint analysis.** `POST /api/admin/coupons` là write path có business side effects. CSV `test-data/transactional-admin-coupons.csv` chứa một approved success-path row; JMX tạo unique code theo run tag/thread/iteration để giảm duplicate collision. Mutation được cô lập trong disposable runtime và phải giữ state-growth confound.

**Workload được duyệt.** Giữ `5 VUs / 20s` -> `5 -> 10 VUs / 10s` -> giữ `10 / 20s` -> `10 -> 20 / 10s` -> giữ `20 / 20s` -> `20 -> 30 / 10s` -> giữ `30 / 20s` -> `30 -> 5 / 15s` -> recovery `5 / 20s`; scheduled duration `145s`. Think Time `1000-1500ms` với `Uniform Random Timer`.

**Execution facts.** Final run là `run-001`; raw JTL SHA-256 là `8A7510F670FD67905E4887AEC0E584D26136AEBCCFB6B1A2CBA647481C732C5B`. Có `1687` samples, `1687` successful, `0` failed; observed duration `142.181s`; stage-map coverage `80.853586%`, với `323` ramp samples ngoài map nhưng vẫn được giữ trong overall. Resource monitor có `157` samples, backend-not-alive `0`, CPU `8.83/14.27/39.60%`, RSS `56414208/72063067.31/91508736` bytes. `STATE_GROWTH_CONFOUND` được documented; `POTENTIAL_WRITE_CONTENTION` vẫn là unverified hypothesis.

### 5.4 Supporting Endurance / Soak

Supporting Endurance dùng `GET /api/orders/:id`, profile `60s` ramp-up, `10 VUs` steady trong `600s`, `60s` ramp-down; tổng `720s`, Think Time `500-1000ms`. Artifact này hỗ trợ nhận diện dấu hiệu ổn định theo thời gian, không phải scenario thứ tư và không thay thế `LOAD`, `SPIKE` hoặc `STRESS`.

JMX: `test-plans/supporting/23127107_Endurance_20260816.jmx`; raw JTL: `results/supporting-endurance/23127107_Endurance_20260816/run-001/raw/23127107_Endurance_20260816_run-001.jtl`; SHA-256: `2B4E8A398EAD44F438B11D83758B6087E31B298D6DDA48A678DF43D9E7DF4B10`. Có `8740/8740` successful samples, steady window `7962/7962`, không restart, backend-not-alive `0`; monitor có `725` samples. Early p95 `3ms`, late p95 `2ms`; early/late median RSS ratio `1.019652`. Kết quả `STABLE_WITHIN_PROPOSED_THRESHOLD` chỉ là threshold đã được Student duyệt cho coursework context, không phải SLA hoặc chứng nhận memory-leak absence.

### 5.5 Integrity và resource-evidence boundary

Các raw JTL production có hash được kiểm tra, HTML report được tạo từ cùng run identity, execution metadata giữ Student ID/scenario/run, và resource files cho thấy monitoring đã diễn ra trong các execution. CPU/RSS chỉ hỗ trợ timestamp correlation. Chúng không chứng minh causal bottleneck, hardware maximum, absence of leak, hay production capacity.

Assertions trong các JMX được giữ theo approved plan. Raw JTL xác nhận HTTP status/transport outcome; application-level success, business-rule validation và authorization semantics vẫn phải được đánh giá từ contract/source evidence riêng.

### 5.6 Historical failed attempts

Các attempt trước final run được giữ để traceability và không được diễn giải thành product performance failure:

- `LOAD run-001`: `EXECUTION/EVIDENCE_FAILURE`, JMeter không chạy vì resource-monitor preflight thất bại; final measured run là `run-002`.
- `SPIKE run-001`: `ENVIRONMENT_FAILURE` ở JMeter version-only guard trước measured execution.
- `SPIKE run-002`: `EVIDENCE_FAILURE` do resource-monitor CSV parser/tooling; không có JTL performance result; final measured run là `run-003`.

Không attempt nào trong danh sách trên được dùng để tính metrics hoặc xác nhận application defect.

## 6. Task 2 — Phân tích JTL

### 6.1 Phương pháp

Percentile dùng nearest-rank, không interpolation. Phân tích giữ cả overall samples và stage/window samples; sample ngoài stage map không bị loại khỏi overall. Throughput, p95 và p99 giữa các scenario không được rank trực tiếp vì endpoint, concurrency shape, Think Time và mục tiêu khác nhau.

### 6.2 Overall metrics

| Scenario | Samples | Mean (ms) | p50 | p90 | p95 | p99 | Max (ms) | Throughput (RPS) | Error rate |
| -------- | ------: | --------: | --: | --: | --: | --: | -------: | ---------------: | ---------: |
| `LOAD`   |    1250 |    1.5824 |   2 |   2 |   2 |   3 |       28 |         10.58685 |         0% |
| `SPIKE`  |    2123 |  2.963731 |   3 |   4 |   4 |   6 |       55 |        32.025463 |         0% |
| `STRESS` |    1687 |  6.033788 |   6 |   7 |   8 |  16 |       33 |        11.865158 |         0% |

Response code breakdown của cả ba raw JTL là HTTP `200`. Standard JTL application semantics được ghi là `NOT_AVAILABLE` nếu không có assertion/application oracle tương ứng; do đó HTTP success không tự động là business PASS.

### 6.3 Stage và diễn giải có điều kiện

- `LOAD`: hai cửa sổ 60 giây có p95 `3 -> 2ms` và throughput `7.966667 -> 13.294071 RPS`; đây là profile transition, không phải capacity breakpoint.
- `SPIKE`: coverage `97.880358%`; 45 samples unmapped vẫn nằm trong overall. Không dùng coverage chưa hoàn chỉnh để nói fully recovered.
- `STRESS`: coverage `80.853586%`; 323 ramp samples nằm ngoài hold/recovery map. Không gọi stage cuối là absolute breakpoint hoặc SQLite bottleneck.
- Resource và latency chỉ được mô tả theo correlation. `0%` error chỉ là JTL observation, không phải SLA, capacity hay business correctness.

### 6.4 Misinterpretation hunt

Human Review hoàn tất chín nhóm kiểm tra diễn giải/optimization boundary. Các boundary quan trọng gồm: không rank trực tiếp percentile giữa workload khác nhau; không đổi HTTP success thành SLA/business PASS; không gán CPU/RSS là nguyên nhân; không gọi stress state growth là bottleneck; không coi một max spike là regression; không coi stage map coverage thiếu là fully recovered; không coi Endurance threshold là production SLA; không coi security/correctness finding là performance defect; và không coi candidate optimization là effective khi chưa có before/after comparable rerun. Các corrections đã được Student chấp thuận trong `task2-jtl-analysis-human-review.md` và cross-scenario summary.

### 6.5 Optimization review

Task 2 review đánh giá `9` AI candidates:

| Kết quả                             | Count |
| ----------------------------------- | ----: |
| `FEASIBLE`                          |     7 |
| `NOT_FEASIBLE`                      |     0 |
| `HALLUCINATED_OR_UNSUPPORTED`       |     0 |
| `DEFERRED_WITH_JUSTIFICATION`       |     1 |
| `ACCEPTED_NO_CHANGE_RECOMMENDATION` |     1 |

Evidence-level sau Human Review: `DIRECT` `2`, `INDIRECT` `6`, `HYPOTHESIS` `1`, `UNSUPPORTED` `0`. Measured performance benefit proven là `0`; `8` candidate có benefit chưa được chứng minh và cần validation, một candidate không áp dụng trực tiếp cho performance benchmark. Nhiều proposal có giá trị security/correctness/test-design, không nên gọi chúng là performance fix. `OPT-STRESS-003` chỉ là điều tra composite index với `EXPLAIN QUERY PLAN` và representative data; current admin-coupon JTL không đo quota query đó.

## 7. Task 3 — Continuous Performance Testing

Deliverable được Human Review là `PROPOSAL_ONLY`; requirement verification giữ ở mức `PARTIAL`; CI implementation `NOT_IMPLEMENTED`. Platform được đề xuất là GitHub Actions, không phải existing CI configuration. Human Decision là `MODIFIED_AND_APPROVED`.

- **Fast tier:** supporting profile ngắn, chỉ chạy khi backend-relevant change, ban đầu `NON_BLOCKING`.
- **Scheduled tier:** weekly full validation chạy tuần tự `LOAD -> SPIKE -> STRESS`; manual trigger được phép.
- **Full validation:** release candidate hoặc major backend/database/auth/authorization change; không chạy full Stress ở mỗi commit.
- **Supporting Endurance:** pre-release/manual, optional weekly khi runner time cho phép; không nằm trong ba production scenarios.
- Runtime phải disposable, data deterministic, JWT/secret externalized, artifact retention và resource evidence bắt buộc.
- So sánh chỉ hợp lệ khi endpoint, JMX/workload, CSV, Think Time, concurrency và environment tương đương; nếu không là `NON_COMPARABLE_RUN`.
- Regression flow: `SUSPECTED_REGRESSION -> VALIDATE_RUN_INTEGRITY -> CHECK_COMPARABILITY -> REPEAT_OR_VERIFY_IF_NEEDED -> HUMAN_REVIEW -> CONFIRMED_PERFORMANCE_REGRESSION`.
- AI không được tự declare root cause, production readiness, threshold change hoặc optimization effectiveness.

## 8. Bug findings và GitHub mapping

Ba bug hiện hành đều là security/correctness/data-minimization findings, không phải confirmed performance issues.

| Bug       | Endpoint                  | Classification                                   | Severity / Priority | Performance status                  | GitHub                                                       |
| --------- | ------------------------- | ------------------------------------------------ | ------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `BUG-001` | `GET /api/users/me`       | `SECURITY` / `DATA_MINIMIZATION` / `CORRECTNESS` | Major / P1          | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE` | [#291](https://github.com/DuyITLOR/group05_eshop/issues/291) |
| `BUG-002` | `POST /api/admin/coupons` | `SECURITY` / `AUTHORIZATION` / `CORRECTNESS`     | Major / P0          | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE` | [#290](https://github.com/DuyITLOR/group05_eshop/issues/290) |
| `BUG-003` | `GET /api/orders/:id`     | `SECURITY` / `AUTHORIZATION` / `CORRECTNESS`     | Major / P0          | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE` | [#292](https://github.com/DuyITLOR/group05_eshop/issues/292) |

`POTENTIAL_WRITE_CONTENTION` remains `UNVERIFIED_PERFORMANCE_HYPOTHESIS`. Current evidence does not prove SQLite contention, database bottleneck, capacity saturation, memory leak or CPU bottleneck. Existing equivalent issue references are retained inside the individual reports; the URLs above are the current mapping recorded in those reports.

## 9. Ranh giới performance, functional và security

- HTTP `200`, zero failed samples và low observed latency are transport/runtime observations only.
- Security and authorization defects can coexist with successful performance samples; they must not be relabelled as latency defects.
- `GET /api/users/me` analysis represents JWT verification plus identity lookup, not login abuse resistance.
- `POST /api/admin/coupons` success-path Stress does not exercise invalid input, duplicate-code handling or admin-role denial.
- `GET /api/orders/:id` performance result does not establish authenticated owner access control.
- No performance issue is confirmed by the current Task 1/Task 2 evidence.

## 10. Limitations và open risks

| ID    | Limitation / risk                               | Current treatment                                                                                                                             |
| ----- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| L-001 | Chưa có official SLA/capacity target            | Không claim SLA hoặc capacity                                                                                                                 |
| L-002 | Workloads khác endpoint và mục tiêu             | Không rank trực tiếp p95/throughput                                                                                                           |
| L-003 | Stage-map coverage không đủ 100% ở SPIKE/STRESS | Giữ unmapped samples trong overall, dùng `ACCEPT_WITH_LIMITATION`                                                                             |
| L-004 | Stress state growth                             | Documented confound, không gọi absolute breakpoint                                                                                            |
| L-005 | Write contention                                | Chưa đo, giữ `UNVERIFIED_PERFORMANCE_HYPOTHESIS`                                                                                              |
| L-006 | Resource correlation                            | Không suy ra causation/root cause                                                                                                             |
| L-007 | Success-path-only data                          | Không kết luận invalid/duplicate/error behavior                                                                                               |
| L-008 | AUTH_HEAVY semantics                            | Không phải login/lockout/brute-force coverage                                                                                                 |
| L-009 | Owner/admin authorization                       | Các route có confirmed security findings; performance result không khắc phục                                                                  |
| L-010 | Task 3 CI                                       | Proposal-only; GitHub Actions chưa triển khai                                                                                                 |
| L-011 | Endurance                                       | Supporting artifact; threshold là coursework guardrail, không phải SLA                                                                        |
| L-012 | Audit                                           | AI Audit được giữ nguyên/frozen theo instruction; report này không tạo hoặc cập nhật audit entry                                              |
| L-013 | Endurance/source requirement                    | Requirement verification của supporting Endurance là `PARTIAL_BUT_ACCEPTED_BY_STUDENT`; không nâng thành full authoritative requirement proof |

## 11. Kết luận

Task 1 đã hoàn thành với ba production scenarios và supporting Endurance evidence. Task 2 đã hoàn thành với raw-JTL metrics, percentile method, stage limitations, misinterpretation hunt và Human-reviewed optimization classification. Task 3 đã hoàn thành ở mức proposal-only; CI implementation chưa bắt đầu.

Ba confirmed findings đều thuộc security/correctness/data-minimization. Không có confirmed performance issue và không có unsupported SLA claim. Kết luận này chỉ áp dụng cho evidence, workload và environment đã được review; không phải production readiness statement.

Báo cáo dừng tại Human Review gate. Student cần review và quyết định `APPROVE`, `MODIFY` hoặc `REJECT` trước khi tiếp tục README finalization, AI Critique, demo hoặc submission packaging.

## 12. Traceability index

### Workflow và design

- `docs/workflow/hw05-performance-workflow-status.md`
- `docs/performance-design/load-order-detail-design.md`
- `docs/performance-design/spike-users-me-design.md`
- `docs/performance-design/stress-admin-coupons-design.md`
- `docs/performance-design/endurance-soak-design.md`

### JMeter plans và data

- `test-plans/23127107_Load_20260812.jmx`
- `test-plans/23127107_Spike_20260816.jmx`
- `test-plans/23127107_Stress_20260816.jmx`
- `test-plans/supporting/23127107_Endurance_20260816.jmx`
- `test-data/read-heavy-orders.csv`
- `test-data/auth-heavy-users-me.csv`
- `test-data/transactional-admin-coupons.csv`

### Execution evidence

- `docs/performance-executions/load-order-detail-run-002-execution-review.md`
- `docs/performance-executions/spike-users-me-run-003-execution-review.md`
- `docs/performance-executions/stress-admin-coupons-run-001-execution-review.md`
- `docs/performance-executions/endurance-soak-run-001-execution-review.md`
- `results/23127107_Load_20260812/run-002/`
- `results/23127107_Spike_20260816/run-003/`
- `results/23127107_Stress_20260816/run-001/`
- `results/supporting-endurance/23127107_Endurance_20260816/run-001/`
- `results/23127107_Load_20260812/run-002/html/index.html`
- `results/23127107_Spike_20260816/run-003/html/index.html`
- `results/23127107_Stress_20260816/run-001/html/index.html`
- `results/supporting-endurance/23127107_Endurance_20260816/run-001/html/index.html`
- `results/23127107_Load_20260812/run-002/evidence/resource-monitor.csv`
- `results/23127107_Spike_20260816/run-003/evidence/resource-monitor.csv`
- `results/23127107_Stress_20260816/run-001/evidence/resource-monitor.csv`
- `results/supporting-endurance/23127107_Endurance_20260816/run-001/evidence/resource-monitor.csv`

### Task 2 và Task 3

- `docs/performance-analysis/production-jtl-cross-scenario-summary.md`
- `docs/performance-analysis/task2-jtl-analysis-human-review.md`
- `docs/performance-analysis/task2-optimization-proposals.md`
- `docs/performance-analysis/task2-optimization-human-review.md`
- `docs/performance-analysis/task3-continuous-performance-testing-proposal.md`
- `docs/performance-analysis/task3-continuous-performance-testing-human-review.md`

### Bug reports

- `docs/bug-reports/hw05/README.md`
- `docs/bug-reports/hw05/BUG-001-users-me-sensitive-data-exposure.md`
- `docs/bug-reports/hw05/BUG-002-admin-coupons-missing-admin-authorization.md`
- `docs/bug-reports/hw05/BUG-003-orders-detail-missing-access-control.md`

## 13. Final report checkpoint

`CHECKPOINT: FINAL_REPORT_HUMAN_REVIEW_REQUIRED`

`NEXT ALLOWED ACTION: Student Human Review of the generated final report.`

`NO README FINALIZATION.`

`NO AI CRITIQUE.`

`NO DEMO.`

`NO SUBMISSION PACKAGING.`

`NO COMMIT.`

`NO PUSH.`
