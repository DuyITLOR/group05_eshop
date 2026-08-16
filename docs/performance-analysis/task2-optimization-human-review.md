# Task 2 — Human Review of AI Optimization Proposals

## 1. Review Scope

Review này đánh giá cả 9 AI optimization candidate trong `docs/performance-analysis/task2-optimization-proposals.md`. Phạm vi là feasibility, evidence level, hallucination/unsupported risk, priority và quan hệ thực tế với performance evidence. Không có implementation, JMeter rerun, JTL, Task 3 hoặc AI audit update.

## 2. Evidence Baseline

| Scenario | Samples | Success / Failed | p95 | p99 | Throughput |
|---|---:|---:|---:|---:|---:|
| `LOAD` | 1250 | 1250 / 0 | 2 ms | 3 ms | 10.58685 RPS |
| `SPIKE` | 2123 | 2123 / 0 | 4 ms | 6 ms | 32.025463 RPS |
| `STRESS` | 1687 | 1687 / 0 | 8 ms | 16 ms | 11.865158 RPS |

Baseline được lấy từ Human-reviewed JTL analysis. `0%` error rate không phải SLA, capacity, production readiness hay business correctness. `STRESS` giữ `STATE_GROWTH_CONFOUND: DOCUMENTED` và `POTENTIAL_WRITE_CONTENTION: UNVERIFIED`.

## 3. Classification Method

- `DIRECT`: source và measured evidence cùng trực tiếp chứng minh premise của candidate.
- `INDIRECT`: source xác nhận behavior/gap, nhưng performance evidence không chứng minh benefit của thay đổi.
- `HYPOTHESIS`: hướng điều tra hợp lý nhưng chưa có evidence đủ để quyết định worthwhile.
- `UNSUPPORTED`: premise không được source/evidence hỗ trợ.

`FEASIBLE` chỉ nói thay đổi phù hợp current stack; không chứng minh p95, p99, throughput hoặc error rate sẽ tốt hơn. Performance relevance được tách thành `DIRECT`, `UNPROVEN` hoặc `NONE`.

## 4. AI Evidence-Level Sanity Check

AI đã gắn `DIRECT` cho 8 candidate. Review từng candidate cho thấy source-code existence không tự tạo measured performance premise.

| AI evidence level | Student result | Count | Reason |
|---|---|---:|---|
| `DIRECT` | Giữ `DIRECT` | 2 | `OPT-LOAD-001` là no-change dựa trên low-latency profile; `OPT-SPIKE-003` trực tiếp giải quyết observed stage-coverage interpretation limitation. |
| `DIRECT` | Hạ `INDIRECT` | 6 | Các security/correctness gaps có thật trong source, nhưng benchmark không chứng minh performance benefit. |
| `INDIRECT` | Hạ `HYPOTHESIS` | 1 | `OPT-STRESS-003` nhắm quota query không thuộc measured STRESS endpoint; need chưa được đo. |

AI_DIRECT_CLASSIFICATION_REVIEW: `PASS`

## 5. LOAD Candidate Review

### OPT-LOAD-001

- AI Proposal / Type: `NO_CHANGE_RECOMMENDED` / `PERFORMANCE`.
- AI Evidence / Hallucination / Feasibility: `DIRECT` / `LOW` / `LIKELY_NOT_WORTH_IT`.
- Source Verification: `PASS`; order query là `db.get` theo `orders.id` primary key.
- Performance Evidence Verification: `PASS`; p95 `2 ms`, p99 `3 ms`, 0 failed trong approved profile, không có measured performance problem.
- Student Evidence-Level Assessment: `DIRECT`.
- Student Feasibility Classification: `ACCEPTED_NO_CHANGE_RECOMMENDATION`.
- Student Hallucination Classification: `NOT_HALLUCINATED`.
- Student Decision: `ACCEPTED_NO_CHANGE_RECOMMENDATION`.
- Student Priority: `P3`.
- Student Reasoning: Không có evidence-backed lý do để thêm cache/index/queue; no-change chỉ áp dụng profile đã đo, không phải capacity claim.

### OPT-LOAD-002

- AI Proposal / Type: owner-scoped authenticated order detail / `MULTI_PURPOSE`.
- AI Evidence / Hallucination / Feasibility: `DIRECT` / `LOW` / `LIKELY_FEASIBLE`.
- Source Verification: `PASS`; route không dùng `authenticateToken`/`user_id`, trong khi schema có `orders.user_id`.
- Performance Evidence Verification: `PASS_WITH_BOUNDARY`; benchmark không đo benefit của auth, owner condition hoặc projection.
- Student Evidence-Level Assessment: `INDIRECT`.
- Student Feasibility Classification: `FEASIBLE`.
- Student Hallucination Classification: `NOT_HALLUCINATED`.
- Student Decision: `ACCEPTED_WITH_BOUNDARY`.
- Student Priority: `P0`.
- Student Reasoning: Đây là security/correctness remediation source-backed; performance benefit là `UNPROVEN` và contract/JMX cần review lại trước future rerun.

## 6. SPIKE Candidate Review

### OPT-SPIKE-001

- AI Proposal / Type: explicit public-profile projection / `SECURITY`.
- AI Evidence / Hallucination / Feasibility: `DIRECT` / `LOW` / `LIKELY_FEASIBLE`.
- Source Verification: `PASS`; `/api/users/me` dùng `SELECT *` và users row chứa `password`, `reset_token`, `phone`, `shipping_address`.
- Performance Evidence Verification: `PASS_WITH_BOUNDARY`; p95 `4 ms` không chứng minh payload reduction cải thiện latency.
- Student Evidence-Level Assessment: `INDIRECT`.
- Student Feasibility Classification: `FEASIBLE`.
- Student Hallucination Classification: `NOT_HALLUCINATED`.
- Student Decision: `ACCEPTED_WITH_BOUNDARY`.
- Student Priority: `P0`.
- Student Reasoning: Security/data-minimization value trực tiếp; performance relevance `UNPROVEN`.

### OPT-SPIKE-002

- AI Proposal / Type: explicit DB error/absent-user handling / `CORRECTNESS`.
- AI Evidence / Hallucination / Feasibility: `DIRECT` / `LOW` / `LIKELY_FEASIBLE`.
- Source Verification: `PASS`; callback lookup bỏ qua `err` và không branch absent user.
- Performance Evidence Verification: `PASS_WITH_BOUNDARY`; raw JTL success không exercise failure branches.
- Student Evidence-Level Assessment: `INDIRECT`.
- Student Feasibility Classification: `FEASIBLE`.
- Student Hallucination Classification: `NOT_HALLUCINATED`.
- Student Decision: `ACCEPTED_WITH_BOUNDARY`.
- Student Priority: `P1`.
- Student Reasoning: Correctness/observability có giá trị; performance relevance `NONE`.

### OPT-SPIKE-004

- AI Proposal / Type: externalize JWT signing secret / `SECURITY`.
- AI Evidence / Hallucination / Feasibility: `DIRECT` / `LOW` / `LIKELY_FEASIBLE`.
- Source Verification: `PASS`; `SECRET_KEY` hiện hard-code và dùng cho signing/verification.
- Performance Evidence Verification: `NOT_APPLICABLE`; JTL không đo secret management.
- Student Evidence-Level Assessment: `INDIRECT`.
- Student Feasibility Classification: `FEASIBLE`.
- Student Hallucination Classification: `NOT_HALLUCINATED`.
- Student Decision: `ACCEPTED_WITH_BOUNDARY`.
- Student Priority: `P0`.
- Student Reasoning: Security/operability change hợp current Node stack; performance relevance `NONE`.

### OPT-SPIKE-003

- AI Proposal / Type: stage coverage/tolerance report / `TEST_DESIGN`.
- AI Evidence / Hallucination / Feasibility: `DIRECT` / `LOW` / `LIKELY_FEASIBLE`.
- Source Verification: `NOT_REQUIRED`; proposal là reporting/analysis, không phải source change.
- Performance Evidence Verification: `PASS`; stage map `2078/2123`, có 45 unmapped samples và Human Review cấm fully-recovered wording khi thiếu tolerance.
- Student Evidence-Level Assessment: `DIRECT`.
- Student Feasibility Classification: `FEASIBLE`.
- Student Hallucination Classification: `NOT_HALLUCINATED`.
- Student Decision: `ACCEPTED_WITH_BOUNDARY`.
- Student Priority: `P2`.
- Student Reasoning: Trực tiếp cải thiện interpretability/reproducibility, không có performance benefit để claim.

## 7. STRESS Candidate Review

### OPT-STRESS-001

- AI Proposal / Type: server-side admin role check / `SECURITY`.
- AI Evidence / Hallucination / Feasibility: `DIRECT` / `LOW` / `LIKELY_FEASIBLE`.
- Source Verification: `PASS`; route chỉ authenticate JWT, không check `req.user.role` trước INSERT.
- Performance Evidence Verification: `PASS_WITH_BOUNDARY`; STRESS p95 `8 ms` không chứng minh authorization change cải thiện write latency.
- Student Evidence-Level Assessment: `INDIRECT`.
- Student Feasibility Classification: `FEASIBLE`.
- Student Hallucination Classification: `NOT_HALLUCINATED`.
- Student Decision: `ACCEPTED_WITH_BOUNDARY`.
- Student Priority: `P0`.
- Student Reasoning: Security/correctness issue trực tiếp; performance benefit `UNPROVEN`.

### OPT-STRESS-002

- AI Proposal / Type: validation và duplicate-code semantics / `CORRECTNESS`.
- AI Evidence / Hallucination / Feasibility: `DIRECT` / `LOW` / `LIKELY_FEASIBLE`.
- Source Verification: `PASS`; request fields đi thẳng vào INSERT; `code` unique; route chỉ trả generic 500 khi DB error.
- Performance Evidence Verification: `PASS_WITH_BOUNDARY`; JTL chỉ cover success path, không đo invalid/duplicate behavior.
- Student Evidence-Level Assessment: `INDIRECT`.
- Student Feasibility Classification: `FEASIBLE`.
- Student Hallucination Classification: `NOT_HALLUCINATED`.
- Student Decision: `ACCEPTED_WITH_BOUNDARY`.
- Student Priority: `P1`.
- Student Reasoning: Correctness/operability improvement; performance relevance `NONE`.

### OPT-STRESS-003

- AI Proposal / Type: investigate `coupon_usage(coupon_id, user_id)` index / `PERFORMANCE`.
- AI Evidence / Hallucination / Feasibility: `INDIRECT` / `MEDIUM` / `NEEDS_INVESTIGATION`.
- Source Verification: `PASS`; quota query exists và schema không khai báo index ghép.
- Performance Evidence Verification: `FAIL_FOR_PREMISE`; measured STRESS endpoint là admin coupon INSERT, không gọi quota query. `STATE_GROWTH_CONFOUND` không chứng minh query/index need.
- Student Evidence-Level Assessment: `HYPOTHESIS`.
- Student Feasibility Classification: `DEFERRED_WITH_JUSTIFICATION`.
- Student Hallucination Classification: `NOT_HALLUCINATED_SOURCE_GROUNDED_BUT_UNPROVEN`.
- Student Decision: `DEFERRED_PENDING_EVIDENCE`.
- Student Priority: `P3`.
- Student Reasoning: Chỉ reconsider sau `EXPLAIN QUERY PLAN` và representative data cho đúng coupon-usage endpoint; không dùng current STRESS result để suy ra SQLite/write bottleneck.

## 8. Feasibility Classification

| Classification | Count | Candidate IDs |
|---|---:|---|
| `FEASIBLE` | 7 | `OPT-LOAD-002`, `OPT-SPIKE-001`, `OPT-SPIKE-002`, `OPT-SPIKE-003`, `OPT-SPIKE-004`, `OPT-STRESS-001`, `OPT-STRESS-002` |
| `NOT_FEASIBLE` | 0 | None |
| `HALLUCINATED_OR_UNSUPPORTED` | 0 | None |
| `DEFERRED_WITH_JUSTIFICATION` | 1 | `OPT-STRESS-003` |
| `ACCEPTED_NO_CHANGE_RECOMMENDATION` | 1 | `OPT-LOAD-001` |

## 9. Hallucination / Unsupported Review

Hallucination Review: `COMPLETE`. Không candidate nào giả định Redis, distributed cache, read replica, sharding, queue, horizontal autoscaling, microservice, load balancer, ORM feature, cloud infrastructure hay confirmed database bottleneck. `OPT-STRESS-003` bị defer vì optimization need chưa được đo, không phải vì query/index component không tồn tại.

High Hallucination Risk Candidates: `0`.

## 10. Performance vs Security/Correctness Boundary

Performance/Security Boundary: `PASS`. `OPT-LOAD-002`, `OPT-SPIKE-001`, `OPT-SPIKE-004` và `OPT-STRESS-001` có implementation value về security/correctness; không candidate nào được review như measured performance fix.

Performance/Correctness Boundary: `PASS`. `OPT-SPIKE-002` và `OPT-STRESS-002` có correctness/observability value; performance relevance là `NONE`. `OPT-SPIKE-003` là test-design improvement, cũng không phải latency optimization.

Measured Performance Benefit Proven: `0`  
Measured Performance Benefit Unproven: `8`  
Measured Performance Benefit Not Applicable: `1`

## 11. Validation Requirements

Validation Required: `8`. Mọi candidate được cân nhắc implementation phải có source-specific tests trước, sau đó chỉ so sánh performance bằng same endpoint, approved scenario/JMX, CSV, workload profile và environment. Không thay implementation lẫn workload trong một before/after comparison. Không có rerun nào được authorize tại review này.

`OPT-STRESS-003` cần `EXPLAIN QUERY PLAN` với representative coupon-usage data trước; current admin-coupon STRESS JTL không phải validation vehicle cho index này.

## 12. Final Optimization Matrix

| ID | Scenario | Proposal | AI Evidence Level | Student Evidence Level | AI Feasibility | Student Feasibility | Hallucinated / Unsupported | Performance Relevance | Measured Benefit Proven | Student Priority | Validation Required | Student Decision | Short Reason |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `OPT-LOAD-001` | `LOAD` | No change | `DIRECT` | `DIRECT` | `LIKELY_NOT_WORTH_IT` | `ACCEPTED_NO_CHANGE_RECOMMENDATION` | `NO` | `NONE` | `NOT_APPLICABLE` | `P3` | `NO` | `ACCEPTED_NO_CHANGE_RECOMMENDATION` | No measured performance problem under tested profile. |
| `OPT-LOAD-002` | `LOAD` | Auth/owner/projection | `DIRECT` | `INDIRECT` | `LIKELY_FEASIBLE` | `FEASIBLE` | `NO` | `UNPROVEN` | `NO` | `P0` | `YES` | `ACCEPTED_WITH_BOUNDARY` | Source-backed security/correctness, not benchmarked benefit. |
| `OPT-SPIKE-001` | `SPIKE` | Profile projection | `DIRECT` | `INDIRECT` | `LIKELY_FEASIBLE` | `FEASIBLE` | `NO` | `UNPROVEN` | `NO` | `P0` | `YES` | `ACCEPTED_WITH_BOUNDARY` | Sensitive response fields exist; latency benefit unproven. |
| `OPT-SPIKE-002` | `SPIKE` | Error handling | `DIRECT` | `INDIRECT` | `LIKELY_FEASIBLE` | `FEASIBLE` | `NO` | `NONE` | `NO` | `P1` | `YES` | `ACCEPTED_WITH_BOUNDARY` | Source branch gap, no measured performance premise. |
| `OPT-SPIKE-004` | `SPIKE` | JWT secret externalization | `DIRECT` | `INDIRECT` | `LIKELY_FEASIBLE` | `FEASIBLE` | `NO` | `NONE` | `NO` | `P0` | `YES` | `ACCEPTED_WITH_BOUNDARY` | Hard-coded secret is security issue only. |
| `OPT-SPIKE-003` | `SPIKE` | Stage coverage/tolerance report | `DIRECT` | `DIRECT` | `LIKELY_FEASIBLE` | `FEASIBLE` | `NO` | `NONE` | `NO` | `P2` | `YES` | `ACCEPTED_WITH_BOUNDARY` | Directly addresses observed interpretation limitation. |
| `OPT-STRESS-001` | `STRESS` | Admin role check | `DIRECT` | `INDIRECT` | `LIKELY_FEASIBLE` | `FEASIBLE` | `NO` | `UNPROVEN` | `NO` | `P0` | `YES` | `ACCEPTED_WITH_BOUNDARY` | Source-backed authorization gap, not a measured latency issue. |
| `OPT-STRESS-002` | `STRESS` | Input/duplicate validation | `DIRECT` | `INDIRECT` | `LIKELY_FEASIBLE` | `FEASIBLE` | `NO` | `NONE` | `NO` | `P1` | `YES` | `ACCEPTED_WITH_BOUNDARY` | Success-only JTL does not show validation benefit. |
| `OPT-STRESS-003` | `STRESS` | Quota composite index investigation | `INDIRECT` | `HYPOTHESIS` | `NEEDS_INVESTIGATION` | `DEFERRED_WITH_JUSTIFICATION` | `NO` | `UNPROVEN` | `NO` | `P3` | `YES` | `DEFERRED_PENDING_EVIDENCE` | Query is outside measured STRESS endpoint; query plan/data required. |

## 13. Student Conclusions

Human Review sửa meaningful evidence framing của 7 candidates: sáu AI `DIRECT` labels được hạ `INDIRECT`, còn index investigation được hạ `HYPOTHESIS` và priority `P3`. Các security/correctness proposals được giữ là feasible theo source nhưng không được trình bày thành performance fix. Không có candidate nào bị phân loại `HALLUCINATED_OR_UNSUPPORTED`.

## 14. Final Human Decision

Review Status: `FINALIZED`  
Student Decision: `MODIFIED_AND_APPROVED`  
Approval Scope: `TASK2_AI_OPTIMIZATION_PROPOSALS`  
Feasibility Review: `COMPLETE`  
Hallucination Review: `COMPLETE`  
Implementation: `NOT_STARTED`  
Performance Rerun: `NOT_AUTHORIZED`

Task 2 completion check: `PASS`. Task 3 remains `NOT_STARTED`; next legal action là dedicated AI Audit cho Task 2 optimization proposal + Human Review.
