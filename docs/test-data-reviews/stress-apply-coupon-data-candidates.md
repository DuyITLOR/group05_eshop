# Stress Apply Coupon — Test Data Candidates

> Phạm vi: đề xuất dữ liệu cho controlled Stress plan `POST /api/apply-coupon` / `TRANSACTIONAL` / `STRESS`. Báo cáo chỉ đọc source, specification, JMX và SQLite hiện tại; không gọi endpoint, không chạy JMeter và không sửa CSV production.

## 1. R-001

- Finding: `R-001`
- Severity: `HIGH`
- Category: `DATA_STRATEGY`
- Classification: `TEST_DATA_PROBLEM`
- Problem: `test-data/transactional.csv` chỉ có header, chưa có Student-approved success-path row. Vì vậy plan không thể tạo measured workload hợp lệ trong trạng thái hiện tại.
- Evidence: `docs/performance-reviews/stress-apply-coupon-jmeter-ai-review.md`, mục 4, 9 và 14; `test-data/transactional.csv:1`; generation summary đánh dấu `TEMPLATE_ONLY`, `NEEDS_DATA_SETUP`, `NOT_READY`.
- Proposed Fix: Student review và quyết định các row success-path bên dưới, sau đó mới populate `test-data/transactional.csv`, re-check state/quota ngay trước execution và chạy lại static reviewer.
- Why it blocks execution: primary Stress sampler assert HTTP `200` và `success: true`; CSV không có data row nên JMeter không có request-driving value được phê duyệt cho `code`, `total_amount`, `user_id`.

## 2. Source Evidence

### 2.1 Current implementation contract

| Item                          | Current source evidence                                                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Route and body                | `POST /api/apply-coupon` destructures `code`, `total_amount`, `user_id`. (`backend/server.js:363-364`)                                                                                                 |
| HTTP `400`                    | Missing `code`; expired coupon; quota exhausted; or `total_amount <= min_order_amount`. (`backend/server.js:366-367`, `376-437`)                                                                       |
| HTTP `404`                    | No active coupon matches `code`. (`backend/server.js:370-376`)                                                                                                                                         |
| HTTP `200` / business success | Active matching coupon, `total_amount > min_order_amount`, expiry is not before current time, and, when `user_id` is supplied, usage count is below `max_uses_per_user`. (`backend/server.js:370-433`) |
| Usage mutation                | The handler only reads `coupon_usage`; it does not insert or update it. `POST /api/coupon-usage` is the separate write route. (`backend/server.js:382-430`, `443-455`)                                 |
| Boundary rule                 | Current source uses strict `total_amount > coupon.min_order_amount`; equality is excluded. (`backend/server.js:378`, `434-438`)                                                                        |

### 2.2 Deterministic current-data evidence

Read-only SQLite inspection of `backend/database.sqlite` on `2026-08-12` found the following coupon state. Seed definitions match these records in `backend/database.js:105-110`.

| Coupon    | Active | Type      | Discount value | Min order | Expiry       | Max uses per user | Candidate decision                                                                                   |
| --------- | -----: | --------- | -------------: | --------: | ------------ | ----------------: | ---------------------------------------------------------------------------------------------------- |
| `SAVE10`  |    `1` | `percent` |           `10` |  `300000` | `2099-12-31` |               `1` | Selected                                                                                             |
| `BIGBUY`  |    `1` | `fixed`   |        `50000` |  `500000` | `2099-12-31` |               `1` | Not selected; no documented non-boundary request amount is needed for this proposal.                 |
| `VIP100`  |    `1` | `fixed`   |       `100000` |  `300000` | `2099-12-31` |               `2` | Not selected; one documented coupon/amount is sufficient for the handler's read-only reuse analysis. |
| `EXPIRED` |    `1` | `percent` |           `20` |  `100000` | `2020-01-01` |               `1` | Excluded: expired.                                                                                   |

The same read-only inspection found existing users `id=1` (`admin@eshop.com`) and `id=2` (`test@eshop.com`). It found no `coupon_usage` rows, so current usage for `SAVE10` is `0` for each selected user. The documented API example supplies the request-driving pair `code: "SAVE10"` and `total_amount: 500000` with `user_id: 1`. (`api_specification.md:154-162`)

## 3. Proposed Success-path Rows

`coupon_case` and `iteration_key` below are proposed trace-only metadata; only `code`, `total_amount`, and `user_id` are sent in the HTTP JSON body.

| Row | code     | total_amount | user_id | coupon_case           | iteration_key   | Expected                    | Evidence                                                                                                                                       |
| --: | -------- | -----------: | ------: | --------------------- | --------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | `SAVE10` |     `500000` |     `1` | `success_path_save10` | `save10-user-1` | HTTP `200`; `success: true` | API example provides `SAVE10` / `500000` / `1`; current DB has active `SAVE10`, min `300000`, expiry `2099-12-31`, quota `1`, and usage `0/1`. |
|   2 | `SAVE10` |     `500000` |     `2` | `success_path_save10` | `save10-user-2` | HTTP `200`; `success: true` | Current DB has user `2`; same active coupon state; current usage is `0/1`.                                                                     |

### 3.1 Total amount safety

| Row | Coupon min | Chosen total | Why success is expected                                                                                                                     |
| --: | ---------: | -----------: | ------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 |   `300000` |     `500000` | The documented request amount is `200000` above the current strict minimum, so it is not the `==` boundary excluded by the approved design. |
|   2 |   `300000` |     `500000` | Same deterministic non-boundary amount; the handler evaluates the same coupon minimum independently for user `2`.                           |

### 3.2 User and quota safety

| Row | User ID | Existing usage evidence                                             | max_uses_per_user | Expected quota result                 | Data candidate status    |
| --: | ------: | ------------------------------------------------------------------- | ----------------: | ------------------------------------- | ------------------------ |
|   1 |     `1` | Current SQLite query: no matching `coupon_usage` row, therefore `0` |               `1` | `PASS` for current snapshot (`0 < 1`) | `NEEDS_RUNTIME_PRECHECK` |
|   2 |     `2` | Current SQLite query: no matching `coupon_usage` row, therefore `0` |               `1` | `PASS` for current snapshot (`0 < 1`) | `NEEDS_RUNTIME_PRECHECK` |

The candidates are not `EXECUTION_READY`: database state can change between this static inspection and a future execution. The required runtime precheck is limited to confirming the selected coupon/user state and quota immediately before the approved run; it is not an execution result.

## 4. Dataset Size and Reuse

- Approved workload: `5 -> 10 -> 20 -> 30 -> 5 VUs`, planned `315 seconds`, Think Time `1000 ms`.
- `ROW_REUSE: SUPPORTED` for the current `apply-coupon`-only handler.
- Evidence: every request only queries `coupons` and, when `user_id` is supplied, counts `coupon_usage`; it does not insert usage. (`backend/server.js:369-430`)
- Consequence: the proposal does not invent hundreds of users/coupons. Two independently source-backed rows are enough for a recycled, read-only lookup workload while the current quota snapshot stays valid.
- Limit: reuse becomes unsafe without a revised review if the plan adds `/api/coupon-usage`, checkout, another state-mutating flow, or a concurrent external actor changes coupon usage.

## 5. Proposed CSV Runtime Strategy

| CSV Data Set Config field | Current JMX            | Recommendation       | Rationale                                                                                                                                                   |
| ------------------------- | ---------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recycle on EOF            | `true`                 | Keep `true`          | Two rows may be reused because the current handler does not consume quota.                                                                                  |
| Stop thread on EOF        | `false`                | Keep `false`         | Prevents threads from ending merely because the small reviewed dataset reaches EOF.                                                                         |
| Sharing mode              | `shareMode.all`        | Keep `shareMode.all` | All VUs share one sequential file stream; with recycle enabled, the two reviewed rows are spread then reused without creating per-thread data requirements. |
| Header handling           | `ignoreFirstLine=true` | Keep `true`          | The CSV has a header and JMX separately declares the five variable names.                                                                                   |

`CSV_RUNTIME_STRATEGY: PROPOSED`. The current JMX already matches all four recommendations, so no JMX change is proposed at this checkpoint.

## 6. Request Type Binding Check

| Check                                      | Result | Evidence                                                 |
| ------------------------------------------ | ------ | -------------------------------------------------------- |
| `code` is sent as JSON string              | `PASS` | JMX body uses `"code": "${code}"`.                       |
| `total_amount` is sent as JSON number      | `PASS` | JMX body uses unquoted `${total_amount}`.                |
| `user_id` is sent as JSON number           | `PASS` | JMX body uses unquoted `${user_id}`.                     |
| `coupon_case` is excluded from HTTP JSON   | `PASS` | JMX body contains only the three request-driving fields. |
| `iteration_key` is excluded from HTTP JSON | `PASS` | JMX body contains only the three request-driving fields. |

`CSV_BINDING: PASS`. No additional data-binding finding is proposed.

## 7. Data Candidate Verdict

- `DATA_CANDIDATES: FOUND`
- Candidate count: `2`
- Request-driving candidate values source-backed: `YES`
- Primary dataset rule: `SUCCESS_PATH_ONLY` — `PASS`
- Boundary isolation: `PASS`; neither row uses `total_amount == min_order_amount`.
- Quota verification: `PARTIAL`; current SQLite snapshot passes, but each selected row needs the stated pre-execution runtime precheck.
- `R-001 Resolution Proposal: READY_FOR_HUMAN_APPROVAL`

This is a proposal only. `R-001` remains open until the Student chooses `APPROVE_DATA`, `MODIFY_DATA`, or `REJECT_DATA` and the approved change is subsequently reviewed.

## 8. Human Review Checkpoint

CHECKPOINT: `TEST_DATA_REVIEW_REQUIRED`

Student must choose exactly one:

- `APPROVE_DATA`
- `MODIFY_DATA`
- `REJECT_DATA`

## 9. Student Decision

Student Decision: `APPROVE_DATA`

Decision Scope: The Student approved exactly the two proposed `SAVE10` success-path rows in section 3, without modifying their values or the CSV schema.

Applied Artifact: `test-data/transactional.csv`

Runtime Precheck Requirement: Immediately before any real execution, perform a read-only precheck that `SAVE10` remains active and unexpired and that usage for users `1` and `2` remains below `max_uses_per_user`. This precheck is mandatory and is not execution evidence.

No JMeter execution, JTL, HTML execution report, or execution evidence has been created.
