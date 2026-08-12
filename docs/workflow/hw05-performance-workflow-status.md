# HW05 Performance Workflow Status

## Metadata

- Student ID: `23127107`
- Execution Date: `2026-08-12`
- Last Updated: `2026-08-12` (controlled integration test)
- Workflow Mode: `ENDPOINT`
- CORE_PERFORMANCE_WORKFLOW: `IN_PROGRESS`
- HW05_SUBMISSION_READINESS: `NOT_READY`

## Endpoint Mapping

| Group           | Endpoint                 | Scenario | Phase             | Status                  |
| --------------- | ------------------------ | -------- | ----------------- | ----------------------- |
| `TRANSACTIONAL` | `POST /api/apply-coupon` | `STRESS` | `DESIGN_APPROVED` | `MODIFIED_AND_APPROVED` |

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

Status: `BLOCKED`

JMX: `NOT_CREATED`

CSV: `NOT_CREATED`

Generation Summary: `NOT_CREATED`

Builder Prerequisites:

- Student ID: `23127107` (`PROVIDED`)
- Execution Date: `2026-08-12` (`PROVIDED`)

Builder Result:

- Status: `BLOCKED`
- Reason: `DEPENDENCY_MISSING`
- Expected filename: `23127107_Stress_20260812.jmx`
- Filename precheck: `PASS`
- JMeter installation: `D:\Tools\apache-jmeter-5.6.3` (`5.6.3` inferred from inspected installation path; JMeter was not executed)
- Required staged workload component: `Ultimate Thread Group` / JMeter Custom Thread Groups plugin
- Plugin inventory evidence: no `jpgc`, `ultimate`, `custom-thread`, `plugins-manager` or `cmdrunner` artifact found under the inspected JMeter installation; `lib/ext` contains only core JMeter jars.
- PLUGIN_CHECK: `FAIL`
- DEPENDENCY_STATUS: `MISSING`
- EXECUTION_READY: `NO`
- Data status: `NEEDS_DATA_SETUP`; no Student-approved coupon/user row exists. No production value was fabricated.
- Artifact generation: stopped before JMX/CSV/generation summary creation, as required by `$jmeter-plan-builder` for a missing staged-workload dependency.

### Plan Review

Status: `NOT_STARTED`

Review Artifact: `NOT_CREATED`

Student Decision: `NOT_REVIEWED`

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

Status: `AUDIT_INITIALIZATION_INFORMATION_REQUIRED`

Reason: `docs/ai-audit/AI_AUDIT_LOG.md` chưa tồn tại và repository chưa cung cấp Student Information đầy đủ; không tạo entry giả.

## Current Workflow State

`DESIGN_APPROVED`

## Current Blocker

`DEPENDENCY_MISSING`: JMeter `5.6.3` hiện không có Custom Thread Groups/`Ultimate Thread Group` cần để biểu diễn chính xác approved staged Stress timeline, đặc biệt ramp-down recovery `30 -> 5 VUs` trong `15 giây`.

## Next Allowed Action

Cài đặt và xác minh Custom Thread Groups plugin cung cấp `Ultimate Thread Group` trong JMeter `5.6.3`, sau đó resume `$jmeter-plan-builder` từ state `DESIGN_APPROVED`.
