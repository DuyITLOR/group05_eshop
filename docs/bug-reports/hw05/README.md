# HW05 Bug Reports

## Confirmed Issues

| ID        | Title                                                       | Endpoint                  | Classification                                   | Severity | Priority | Performance Status                  | GitHub Readiness   | File                                                            |
| --------- | ----------------------------------------------------------- | ------------------------- | ------------------------------------------------ | -------- | -------- | ----------------------------------- | ------------------ | --------------------------------------------------------------- |
| `BUG-001` | Users API trả trực tiếp user row có password và reset_token | `GET /api/users/me`       | `SECURITY` / `DATA_MINIMIZATION` / `CORRECTNESS` | Major    | P1       | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE` | `READY_FOR_GITHUB` | [BUG-001](BUG-001-users-me-sensitive-data-exposure.md)          |
| `BUG-002` | Coupons API thiếu server-side Admin role enforcement        | `POST /api/admin/coupons` | `SECURITY` / `AUTHORIZATION` / `CORRECTNESS`     | Major    | P0       | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE` | `READY_FOR_GITHUB` | [BUG-002](BUG-002-admin-coupons-missing-admin-authorization.md) |
| `BUG-003` | Orders detail thiếu authentication/owner enforcement        | `GET /api/orders/:id`     | `SECURITY` / `AUTHORIZATION` / `CORRECTNESS`     | Major    | P0       | `NOT_A_CONFIRMED_PERFORMANCE_ISSUE` | `READY_FOR_GITHUB` | [BUG-003](BUG-003-orders-detail-missing-access-control.md)      |

## Unverified Findings

### POTENTIAL_WRITE_CONTENTION

- **Status:** `UNVERIFIED_PERFORMANCE_HYPOTHESIS`
- **Why not promoted to bug:** STRESS measured admin coupon inserts, nhưng `STATE_GROWTH_CONFOUND: DOCUMENTED` và current evidence không chứng minh SQLite/write contention, database bottleneck, capacity saturation, memory leak hoặc CPU bottleneck.
- **Evidence required:** reproducible comparable workload, valid raw JTL/environment, controlled state/data volume, and direct investigation evidence before Human confirmation.

## Issue Classification Summary

- **Confirmed Total:** `3`
- **Confirmed Security:** `3`
- **Confirmed Correctness:** `3`
- **Confirmed Performance:** `0`
- **Unverified Performance Hypotheses:** `1`

Mỗi row trong Confirmed Issues được tính đúng một lần trong `Confirmed Total`, dù có thể có nhiều classification.

## Performance Summary

Confirmed Performance Issues: `0`

The approved HW05 runs did not produce a Student-confirmed performance regression under their tested workloads:

- `LOAD`: `1250` samples, `0` failures, p95 `2 ms`, p99 `3 ms`.
- `SPIKE`: `2123` samples, `0` failures, p95 `4 ms`, p99 `6 ms`.
- `STRESS`: `1687` samples, `0` failures, p95 `8 ms`, p99 `16 ms`.
- Supporting Endurance: `STABLE_WITHIN_PROPOSED_THRESHOLD`.

These execution facts do not prove capacity, SLA, business correctness, root cause or future performance behavior. The three confirmed reports above are security/correctness/data-minimization issues discovered during HW05 performance testing, not confirmed performance issues.

## GitHub Issue Mapping

| Bug ID    | GitHub Issue                                                 |
| --------- | ------------------------------------------------------------ |
| `BUG-001` | [#291](https://github.com/DuyITLOR/group05_eshop/issues/291) |
| `BUG-002` | [#290](https://github.com/DuyITLOR/group05_eshop/issues/290) |
| `BUG-003` | [#292](https://github.com/DuyITLOR/group05_eshop/issues/292) |
