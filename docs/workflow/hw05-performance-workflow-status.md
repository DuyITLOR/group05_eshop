# HW05 Performance Workflow Status

## Metadata

- Student ID: `23127107`
- Execution Date: `2026-08-12`
- Last Updated: `2026-08-13` (Student-approved controlled Stress plan)
- Workflow Mode: `ENDPOINT`
- CORE_PERFORMANCE_WORKFLOW: `IN_PROGRESS`
- HW05_SUBMISSION_READINESS: `NOT_READY`

## Endpoint Mapping

| Group           | Endpoint                 | Scenario | Phase             | Status                  |
| --------------- | ------------------------ | -------- | ----------------- | ----------------------- |
| `TRANSACTIONAL` | `POST /api/apply-coupon` | `STRESS` | `REAL_EXECUTION_REQUIRED` | `APPROVED` |

## TRANSACTIONAL / STRESS

### Design

Status: `MODIFIED_AND_APPROVED`

Artifact: `docs/performance-design/stress-apply-coupon-design.md`

Human Review: `Student Decision: MODIFIED_AND_APPROVED`

Human Review Scope: `CONTROLLED_INTEGRATION_TEST`

Final HW05 Transactional Endpoint: `NOT_YET_APPROVED`

Fingerprint: `CURRENT`

Fingerprint Evidence:

- Approved design SHA-256: `6D536D96F22C259AF4062C026FD17ED81D249CD50C979D99EAA4E0ECA8812E60`
- API specification SHA-256: `488CBCB790099BA9CBB34C7C80BA04C6AEC9E9EBB598F031FFA575737547B139`
- Current handler source SHA-256: `E2263811A1690A63A7DBB4446C3FD33FB87F50D073D9F8CDFAB7083A52F5E8ED`
- Database config/seed SHA-256: `50012F35C2CF0776DD837482D76ADF701F0EE40CDCB9D80143278FCCDE034717`
- Supporting README SHA-256: `7859599624A8F94E7B28859F5E3EDBEE71F275E1A71043E3EFCAB10D5EE14CDD`
- Source/config files above are tracked and have no working-tree diff at this resume point; their current behavior remains consistent with the approved design evidence.

### JMeter Plan

Status: `COMPLETE`

JMX: `test-plans/23127107_Stress_20260812.jmx`

CSV: `test-data/transactional.csv` (`APPROVED_SUCCESS_PATH_ROWS`)

Generation Summary: `docs/jmeter-generation/23127107-stress-generation-summary.md`

Fingerprint: `CURRENT`

- JMX SHA-256: `0A8366B53356FFFF5301C49C3F6D0AA671B20EBB152A8288845F533CFE0DBB3E`
- CSV SHA-256: `194B43212CEE61226A52F2CC13A15DE54708FBAD95D31BA54E9286D38D5C3CC2`
- Generation Summary SHA-256: `1A5626302B3165CB080838918A3F4B0584B8B696C7172BDD4DC7913825263FA5`

Builder Prerequisites:

- Student ID: `23127107` (`PROVIDED`)
- Execution Date: `2026-08-12` (`PROVIDED`)

Builder Result:

- Status: `COMPLETE`
- Reason: `NONE`
- Expected filename: `23127107_Stress_20260812.jmx`
- Filename precheck: `PASS`
- JMeter installation: `D:\Tools\apache-jmeter-5.6.3` (`5.6.3`; JMeter workload was not executed)
- Student Runtime Verification: `PASS`; `jp@gc - Ultimate Thread Group` xuất hiện và mở thành công trong GUI.
- Plugin inventory: `jmeter-plugins-casutg-3.1.1.jar`, Plugins Manager `1.12`, `cmdrunner 2.3`.
- Component evidence: `kg.apc.jmeter.threads.UltimateThreadGroup` và GUI class có trong plugin jar; schedule schema tĩnh có đúng năm field.
- PLUGIN_CHECK: `PASS`
- DEPENDENCY_STATUS: `VERIFIED`
- WORKLOAD_MAPPING: `PASS`
- Planned Total Duration: `315 giây`
- Think Time Mapping: `PASS` (`Constant Timer`, `1000 ms`, enabled trong Thread Group scope)
- EXECUTION_READY: `CONDITIONALLY_READY`; vẫn cần Human Plan Review và runtime precheck trước real execution.
- CSV Status: `APPROVED_SUCCESS_PATH_ROWS` (`2` rows)
- Data status: `DATA_SETUP_COMPLETE_REQUIRES_RUNTIME_PRECHECK`; Student đã approve đúng hai row source-backed. Ngay trước real execution phải read-only check coupon active/expiry và quota của `SAVE10` cho user `1` và `2`; không xem đây là execution evidence.
- Static validation: filename, XML/hashTree, Ultimate Thread Group cohorts, aggregate profile, request/body types, CSV binding, Assertions, Timer, Listener, plugin class và placeholders đều `PASS`.

### Plan Review

Status: `APPROVED`

Review Artifact: `docs/performance-reviews/stress-apply-coupon-jmeter-ai-review.md`

Review Fingerprint: `CURRENT`

- Review SHA-256: `7147DFE6D61EA6178D7F9E60A57D4C169EECE3426DD4F6116B053424D47F0F45`
- Open Critical/High Findings: `0 / 0`
- Open Medium/Low/Info Findings: `1 / 0 / 2`
- Prior R-001: `RESOLVED_BY_REVIEW_EVIDENCE`
- Execution Readiness: `CONDITIONALLY_READY`

Student Decision: `APPROVED`

Approval Scope: `CONTROLLED_STRESS_EXECUTION`

Finding Dispositions:

- `R-001`: `RESOLVED`
- `R-002`: `ACCEPTED_NON_BLOCKING`
- `R-003`: `DEFERRED_PROJECT_LEVEL_CHECK`
- `R-004`: `ACCEPTED_DOCUMENTED_DISCREPANCY`

Test Data Proposal: `docs/test-data-reviews/stress-apply-coupon-data-candidates.md` (`APPROVE_DATA`)

R-001 Resolution: `RESOLVED_BY_REVIEW_EVIDENCE`

Required Runtime Precheck: `YES` (read-only coupon active/expiry and quota check immediately before a real run)

### Execution

Status: `NOT_STARTED`

Raw JTL: `NOT_CREATED`

HTML Report Folder: `NOT_CREATED`

Resource Monitor Evidence: `NOT_CREATED`

Execution Metadata: `NOT_CREATED`

REAL_EXECUTION_EVIDENCE_COMPLETE: `NO`

### Analysis

Status: `NOT_STARTED`

Metrics: `NOT_CREATED`

AI Analysis: `NOT_CREATED`

Human Review: `NOT_REVIEWED`

## Global Compliance

| Requirement         | Status                | Evidence                                                                      |
| ------------------- | --------------------- | ----------------------------------------------------------------------------- |
| Group uniqueness    | `NEEDS_CLARIFICATION` | Chưa có đủ production `READ_HEAVY` và `AUTH_HEAVY` designs.                   |
| Scenario uniqueness | `NEEDS_CLARIFICATION` | Chưa có đủ ba production scenario designs.                                    |
| Separate CSV        | `PASS`                | Controlled design chỉ định `test-data/transactional.csv`.                     |
| Data-driven fit     | `PASS`                | `code`, `total_amount`, `user_id` drive request body.                         |
| Listener uniqueness | `NEEDS_CLARIFICATION` | `Aggregate Report` phù hợp STRESS nhưng chưa đối chiếu production LOAD/SPIKE. |

## Audit

Status: `AUDIT_LOG_INITIALIZED`

Artifact: `docs/ai-audit/AI_AUDIT_LOG.md`

Audit Scope: `INCLUDED_HW05_ARTIFACT_INTERACTION`; Agent Skill development/maintenance: `EXCLUDED_AGENT_SKILL_DEVELOPMENT`

Safe Backfill:

- Entries created: `4`
- `BACKFILL_GAP`: `0`
- Audit review status: `PENDING_HUMAN_REVIEW`; không suy diễn Student Decision hoặc audit verdict.
- Current HW05 artifact interaction: `A-007` (`PENDING_HUMAN_REVIEW`).

## Current Workflow State

`REAL_EXECUTION_REQUIRED`

## Current Blocker

`REAL_EXECUTION_REQUIRED`: Plan đã được Student approve trong phạm vi `CONTROLLED_STRESS_EXECUTION`; trước real execution phải thực hiện runtime precheck read-only cho `SAVE10` active/expiry và quota của user `1` và `2`. Không có JTL hoặc execution evidence.

## Next Allowed Action

Perform the mandatory read-only runtime precheck for `SAVE10` active/expiry state and quota for user IDs `1` and `2` immediately before the approved controlled Stress execution.
