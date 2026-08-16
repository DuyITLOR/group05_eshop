# Task 3 — Human Review of Continuous Performance Testing Proposal

## 1. Review Scope

Scope: `TASK3_CONTINUOUS_PERFORMANCE_TESTING_PROPOSAL`

Đây là Student Human Review của `docs/performance-analysis/task3-continuous-performance-testing-proposal.md`. Review finalize proposal, không tạo CI workflow, không sửa application/JMX/CSV, không chạy JMeter, không tạo JTL/HTML, không cập nhật AI audit và không bắt đầu final report.

Previous review state: `BLOCKED` chỉ vì chưa có explicit Student decisions. Các quyết định dưới đây là `STUDENT HUMAN REVIEW DECISIONS`, không phải AI approval.

## 2. Requirement Verification

Requirement Verification: `PARTIAL`

Student Decision: `MODIFIED_AND_APPROVED`

Reason: repository/workflow evidence hỗ trợ Task 3 proposal, nhưng authoritative assignment source không đủ để nâng verification lên `PASS`.

Required Deliverable: `PROPOSAL_ONLY`

Student Decision: `APPROVED_FOR_CURRENT_EVIDENCE_SCOPE`

Implementation Required: `NO`

Limitation preserved: `NO` chỉ áp dụng current evidence/submission scope; nó không xác nhận unavailable authoritative requirement đã được kiểm chứng hoàn toàn.

## 3. CI Platform Review

Existing CI Platform: `NONE`

Proposed Platform: `GitHub Actions`

Student Decision: `APPROVE`

Final Classification: `PROPOSED_PLATFORM`

Repository chưa có CI platform; GitHub Actions chỉ là proposed candidate, không phải existing configuration.

## 4. Test Tier Review

| Tier | Student Decision | Final strategy | Reason |
|---|---|---|---|
| Fast | `MODIFY` | Separate `SUPPORTING_CI_PROFILE`, workload ngắn, backend-relevant only, `NON_BLOCKING` initially | Không thay production JMX/evidence và phù hợp frequent CI hơn full scenarios |
| Scheduled | `MODIFY` | `WEEKLY_SCHEDULED_VALIDATION`, chạy tuần tự `LOAD -> SPIKE -> STRESS`; manual scheduled validation allowed | Nightly full execution không tương xứng small coursework project |
| Full Validation | `APPROVE` | Release candidate, major backend endpoint, database/schema, auth/authorization changes, manual validation | Không cần full STRESS every commit |
| Supporting Endurance | `MODIFY` | Pre-release/manual, optional weekly khi runner time available | `SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT`, không thuộc three production scenarios |

## 5. Trigger Matrix Review

| Trigger | Tier | Blocking |
|---|---|---|
| Frontend-only PR | `NONE` | `NO` |
| Backend endpoint PR | `FAST` | `NON_BLOCKING` initially |
| Database/data-access change | `FAST`, plus `FULL` khi performance-sensitive/before release | `NON_BLOCKING` fast |
| Authentication/authorization change | `FAST`, plus `FULL` trước release/khi relevant | `NON_BLOCKING` fast |
| Merge to main | `FAST` | `NON_BLOCKING` initially |
| Scheduled | `FULL`, weekly | `NON_BLOCKING` / reporting |
| Release candidate | `FULL` | `REQUIRED_VALIDATION` |
| Manual performance validation | `FULL` | `MANUAL` |
| Endurance | `ENDURANCE`, pre-release/manual/optional weekly | `MANUAL` or scheduled when available |

Student Decision: `MODIFIED_AND_APPROVED`

## 6. Environment and Data Safety

| Control | Student Decision |
|---|---|
| `DISPOSABLE_BACKEND_RUNTIME_COPY` | `APPROVED` |
| Source DB Protection | `PASS` |
| Mutating Stress Isolation | `PASS` |
| Deterministic Data Strategy | `PASS` |

Reuse is approved for `test-data/read-heavy-orders.csv`, `test-data/auth-heavy-users-me.csv`, and `test-data/transactional-admin-coupons.csv`. STRESS preserves `external run tag + thread + iteration` uniqueness. `POST /api/admin/coupons` must not mutate the source development database directly.

## 7. Secret Handling

Student Decision: `APPROVE`

Secret Handling: `PASS`

Fail-Closed Auth: `PRESERVED`

Final strategy: `CI secret -> temporary runtime/environment property -> JMeter external property`. JWT, password, Authorization token and secret-property contents must not be committed into JMX, CSV, logs or repository artifacts.

## 8. Resource Monitoring

Student Decision: `APPROVE`

Retain backend PID, CPU, RSS, `resource-monitor.csv`, resource summary, execution metadata and JMeter logs. Resource observations support `CORRELATION`, not `ROOT_CAUSE_PROOF`.

Resource Causation Boundary: `PASS`

## 9. Baseline and Comparability

Student Decision: `APPROVE`

Baseline Comparability: `PASS`

Valid comparison requires equivalent endpoint, scenario, JMX/workload, Think Time, concurrency profile, test data and runtime/environment configuration. Material difference yields `NON_COMPARABLE_RUN`, never `PERFORMANCE_REGRESSION`.

## 10. Threshold / Regression Policy

Student Decision: `MODIFIED_AND_APPROVED`

Task 2 values remain `COURSEWORK_REGRESSION_GUARDRAIL`, never `OFFICIAL_SLA` or `PRODUCTION_SLA`. No new numeric threshold is approved.

`WARNING_THRESHOLD` may signal percentile/resource drift for review. `HARD_FAILURE_THRESHOLD` is limited to functional request failure/error criteria or a clearly Student-approved guardrail violation after valid comparability checks.

Final regression flow:

`SUSPECTED_REGRESSION -> VALIDATE_RUN_INTEGRITY -> CHECK_COMPARABILITY -> REPEAT_OR_VERIFY_IF_NEEDED -> HUMAN_REVIEW -> CONFIRMED_PERFORMANCE_REGRESSION`

One unusual max value or one isolated CI run is insufficient.

## 11. Failure Classification

Student Decision: `APPROVE`

Failure Classification: `PASS`

Preserved categories: `FUNCTIONAL_FAILURE`, `PERFORMANCE_REGRESSION_CANDIDATE`, `ENVIRONMENT_FAILURE`, `TEST_TOOLING_FAILURE`, `DATA_STATE_FAILURE`, `EVIDENCE_FAILURE`. Environment/tooling/evidence failure is not automatically a product performance defect.

## 12. Performance Issue Policy

Student Decision: `MODIFIED_AND_APPROVED`

A formal performance issue requires valid raw JTL, valid environment/evidence, comparable workload, reproducible degradation or guardrail violation and Human review. One slow sample, environment/tooling failure or unverified CPU/RSS correlation is insufficient.

Lifecycle: `PERFORMANCE_REGRESSION_CANDIDATE -> EVIDENCE_VERIFICATION -> REPRODUCTION / COMPARABILITY_REVIEW -> HUMAN_CONFIRMATION -> CONFIRMED_PERFORMANCE_ISSUE`.

`GET /api/users/me` sensitive/full response remains `SECURITY / DATA_MINIMIZATION / CORRECTNESS`; `POST /api/admin/coupons` missing role enforcement remains `SECURITY / CORRECTNESS`; `STATE_GROWTH_CONFOUND: DOCUMENTED` and `POTENTIAL_WRITE_CONTENTION: UNVERIFIED` remain `UNVERIFIED_PERFORMANCE_HYPOTHESIS` boundaries.

## 13. AI Governance

Student Decision: `APPROVE`

AI Governance Boundary: `PASS`

AI may analyze JTL, summarize metrics, compare comparable runs, propose investigation/optimization and draft issue reports. AI may not autonomously declare root cause, change thresholds, declare production readiness, confirm/close a performance defect or claim optimization effectiveness.

Task 2 lesson remains mandatory: AI initially labelled `DIRECT: 8`; Student Review resulted in `DIRECT: 2`, `INDIRECT: 6`, `HYPOTHESIS: 1`. Human review of AI evidence classification is retained.

## 14. Cost / Practicality Review

Student Decision: `APPROVE`

Coursework Practicality: `PASS`

No distributed load infrastructure, Redis, sharding, autoscaling architecture, large observability platform or cloud load farm is introduced.

## 15. Student Modifications

The Student modified the proposal from nightly to weekly scheduled full validation; designated a separate `SUPPORTING_CI_PROFILE`; retained fast runs as initially non-blocking; narrowed Endurance to pre-release/manual plus optional weekly; and tightened the hard-failure, regression and performance-issue policies. The proposal retains an Original AI Proposal / Student Decision / Final Proposal traceability table.

## 16. Final Human Decision

Review Status: `FINALIZED`

Student Decision: `MODIFIED_AND_APPROVED`

Approval Scope: `TASK3_CONTINUOUS_PERFORMANCE_TESTING_PROPOSAL`

Requirement Verification: `PARTIAL`

Requirement Student Decision: `MODIFIED_AND_APPROVED`

Required Deliverable: `PROPOSAL_ONLY`

Implementation Required: `NO`

Task 1: `COMPLETE`

Task 2: `COMPLETE`

Task 3: `COMPLETE`

Workflow State: `TASK3_COMPLETE_FINALIZATION_READY`

Next Allowed Action: Dedicated AI Audit for Task 3 proposal plus Human Review before final bug/performance-finding and report packaging. No CI implementation is authorized by this review.
