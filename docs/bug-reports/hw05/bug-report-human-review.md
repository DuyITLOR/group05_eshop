# HW05 Bug Report — Human Review

## 1. Review Scope

- **Scope:** `HW05_FINAL_BUG_REPORTS`.
- **Candidates reviewed:** `BUG-001`, `BUG-002`, `BUG-003`.
- **Method:** current source/schema and repository requirement/specification review; no JMeter rerun, no source modification, and no GitHub Issue creation.
- **Performance boundary:** the existing LOAD, SPIKE and STRESS metrics are execution context only. They do not confirm any security/correctness defect and no performance defect is fabricated here.

## 2. BUG-001 Review

| Field               | Decision                                                       |
| ------------------- | -------------------------------------------------------------- |
| Status              | `CONFIRMED`                                                    |
| Evidence Quality    | `CURRENT_SOURCE` + `CURRENT_SCHEMA` + `SUPPORTING_REQUIREMENT` |
| Requirement Support | `api_specification.md:59-64`; `README.md:62-67,278-280`        |
| Severity            | `Major`                                                        |
| Priority            | `P1`                                                           |
| Classification      | `SECURITY` / `DATA_MINIMIZATION` / `CORRECTNESS`               |
| Performance Status  | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE`                            |
| GitHub Readiness    | `READY_FOR_GITHUB`                                             |

**Student Reasoning:** `backend/server.js:112-115` serializes the result of `SELECT * FROM users`, while `backend/database.js:50-61` proves that row contains `password` and `reset_token`. The generated title and evidence were corrected to state this direct behavior. Because the caller is authenticated and sees its own row, the reviewed priority is `P1`, not the generated `P0`.

## 3. BUG-002 Review

| Field               | Decision                                                                   |
| ------------------- | -------------------------------------------------------------------------- |
| Status              | `CONFIRMED`                                                                |
| Evidence Quality    | `CURRENT_SOURCE` + `AUTHORITATIVE_REQUIREMENT` + `DOCUMENTED_API_CONTRACT` |
| Requirement Support | `README.md:174-180,213-216,278-280`; `api_specification.md:171-214`        |
| Severity            | `Major`                                                                    |
| Priority            | `P0`                                                                       |
| Classification      | `SECURITY` / `AUTHORIZATION` / `CORRECTNESS`                               |
| Performance Status  | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE`                                        |
| GitHub Readiness    | `READY_FOR_GITHUB`                                                         |

**Student Reasoning:** `authenticateToken` verifies a JWT and assigns `req.user`, but `POST /api/admin/coupons` neither evaluates `req.user.role` nor calls a role guard before `INSERT INTO coupons`. `FR-12`, `FR-17` and `SEC-03` make Admin-only coupon creation an explicit requirement. The generated `Critical` severity was normalized to `Major`; the unauthorized Admin write path remains `P0`.

## 4. BUG-003 Review

| Field               | Decision                                                                   |
| ------------------- | -------------------------------------------------------------------------- |
| Status              | `CONFIRMED`                                                                |
| Evidence Quality    | `CURRENT_SOURCE` + `AUTHORITATIVE_REQUIREMENT` + `DOCUMENTED_API_CONTRACT` |
| Requirement Support | `README.md:1-6,164-168,278-280`; `api_specification.md:110-146`            |
| Severity            | `Major`                                                                    |
| Priority            | `P0`                                                                       |
| Classification      | `SECURITY` / `AUTHORIZATION` / `CORRECTNESS`                               |
| Performance Status  | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE`                                        |
| GitHub Readiness    | `READY_FOR_GITHUB`                                                         |

**Student Reasoning:** The requirements document declares itself the System Requirements Specification and states in `FR-11` that a user may view only their own orders. The order-detail route at `backend/server.js:344-348` has no authentication middleware and filters only by `id`; both confirmation conditions are met. This is requirement-backed, not a generic best-practice-only finding.

## 5. Requirement Traceability Review

| Candidate | Requirement source                  | Identifier                           | Evidence quality                                                       |
| --------- | ----------------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `BUG-001` | `README.md`, `api_specification.md` | `FR-04`, `SEC-01`                    | `SUPPORTING` for exact response projection                             |
| `BUG-002` | `README.md`, `api_specification.md` | `FR-12`, `FR-17`, `SEC-02`, `SEC-03` | `AUTHORITATIVE`                                                        |
| `BUG-003` | `README.md`, `api_specification.md` | `FR-11`, `SEC-02`                    | `AUTHORITATIVE` for ownership; API contract supports Bearer protection |

## 6. Severity / Priority Review

- `BUG-001`: `Major/P1`; raw credential/reset fields reach an authenticated caller, but no cross-account exposure or exploit impact was observed in this review.
- `BUG-002`: `Major/P0`; an authenticated non-admin can reach an Admin coupon write path. `Critical` was not retained because broader compromise was not demonstrated.
- `BUG-003`: `Major/P0`; unauthenticated or non-owner order-detail access violates an authoritative owner-only rule and exposes order records by identifier.

## 7. Performance Classification Review

- **Confirmed Performance Issues:** `0`.
- `BUG-001`, `BUG-002`, and `BUG-003` are security/correctness findings only: `NOT_A_CONFIRMED_PERFORMANCE_ISSUE`.
- `POTENTIAL_WRITE_CONTENTION` remains `UNVERIFIED_PERFORMANCE_HYPOTHESIS`; `STATE_GROWTH_CONFOUND: DOCUMENTED` prevents promotion to a confirmed performance bug.

## 8. GitHub Issue Readiness

| Candidate | Recommended Labels                     | Readiness          |
| --------- | -------------------------------------- | ------------------ |
| `BUG-001` | `bug`, `hw05-perf-testing`, `security` | `READY_FOR_GITHUB` |
| `BUG-002` | `bug`, `hw05-perf-testing`, `security` | `READY_FOR_GITHUB` |
| `BUG-003` | `bug`, `hw05-perf-testing`, `security` | `READY_FOR_GITHUB` |

No issue was created or labeled during this review. No JWT, password, reset token, Authorization value or sensitive response body is recorded in this artifact.

## 9. Unverified Findings

### POTENTIAL_WRITE_CONTENTION

- **Status:** `UNVERIFIED_PERFORMANCE_HYPOTHESIS`.
- **Reason Not Confirmed:** available STRESS evidence does not isolate SQLite contention, capacity saturation or database bottleneck; state growth is a documented confound.
- **Required Additional Evidence:** a comparable controlled workload with data-volume control and direct resource/database investigation evidence.

## 10. Final Student Decision

- **Review Status:** `FINALIZED`.
- **Student Decision:** `MODIFIED_AND_APPROVED`.
- **Approval Scope:** `HW05_FINAL_BUG_REPORTS`.
- **Changes approved:** BUG-001 title/evidence were made schema-direct and its priority normalized to `P1`; BUG-002 severity was normalized from `Critical` to `Major`; BUG-003 requirement evidence was recorded as authoritative.
- **Confirmed issue count:** `3`; **unverified finding count:** `1`; **confirmed performance issue count:** `0`.
- **Next boundary:** create GitHub Issues only for the three `READY_FOR_GITHUB` confirmed reports, then record issue URLs/numbers before a later commit of reviewed bug-report artifacts.
