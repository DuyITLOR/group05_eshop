# FR-17 Execution Readiness — Coupon management

## Readiness Result

| Field | Value |
| --- | --- |
| Readiness Status | `READY_FOR_EXECUTION` |
| Readiness Timestamp | `2026-08-10T08:28:15.6440602+07:00` |
| Readiness Run ID | `fr17-readiness-20260810T082458317+0700` |
| Feature | `FR-17 — Coupon management` |
| Student ID | `23127107` |
| Browser Execution Performed | `NO` |
| Database Business Mutation Performed | `NO` |
| Current Checkpoint | `CHECKPOINT: FR17_EXECUTION_READINESS_REVIEW_REQUIRED` |

Readiness chỉ thực hiện process preparation, HTTP health checks, isolated SQLite initialization/read-only verification, controlled login checks, Playwright collection và static review. Không có `FR17-TC-xxx` nào được execute và không có product-defect verdict nào được tạo.

## Process Inventory

| Component | URL | HTTP | PID | Action | Notes |
| --- | --- | ---: | ---: | --- | --- |
| Previous FR-09 isolated backend | `http://localhost:3000` | `200` before transition | `34568` | `STOPPED_RECORDED_PROCESS` | PID/path đã được FR-09 readiness và completed execution records xác nhận; stopped only to free required port 3000. |
| FR-17 isolated backend | `http://localhost:3000` | `200` | `34940` | `STARTED_BY_READINESS` | Launched from the run-specific copied backend directory. |
| Web Admin | `http://localhost:5174` | `200` | `21808` | `STARTED_BY_READINESS` | Vite process launched from `frontend-admin/`; no browser navigation occurred. |

## Isolated Backend Architecture

| Field | Value |
| --- | --- |
| Isolated Backend Directory | `D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend` |
| Isolated DB Path | `D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\.runtime\fr-17\fr17-readiness-20260810T082458317+0700\backend\database.sqlite` |
| Workspace DB Forbidden Path | `D:\Workspace\HCMUS\Software Testing\Homework\group05_eshop\backend\database.sqlite` |
| Paths Distinct | `PASS` |
| Backend Resolution Behavior | `path.resolve(__dirname, 'database.sqlite')` |
| Backend Startup Behavior | `initDatabase()` drops/recreates/seeds its local tables on startup. |
| Fixture Safety Inputs | `FR17_ISOLATED_DB=true`; exact `FR17_TEST_DB_PATH` above |

`FR17_TEST_DB_PATH` is a fixture safety/verification input, not a backend configuration switch. Isolation is achieved because PID 34940 was started with the copied backend directory as its working directory. Backend initialization therefore affected only the run-specific DB.

## Workspace DB Protection

| Check | Result |
| --- | --- |
| SHA-256 before runtime transition | `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` |
| SHA-256 after isolated preparation/auth/collection | `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` |
| Protection Result | `PASS` — hashes identical |

The isolated DB was readable through SQLite while served by the backend. A separate file hash was not required; one later hash attempt returned `HASH_NOT_AVAILABLE_WHILE_RUNTIME_LOCKED`. This does not affect the verified workspace protection result.

## Required Schema and Exact Baseline

| Gate | Result |
| --- | --- |
| Tables | `PASS` — `coupons`, `users` exist |
| Coupon fixture columns | `PASS` — `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user` |
| Authentication columns | `PASS` — identity, credential and `role` columns present |
| Exact coupon record count | `PASS` — 4 |
| Exact code set | `PASS` — `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`; no extra/missing record |
| Post-auth recheck | `PASS` — count 4 and same exact code set |

Schema and baseline queries were read-only. Controlled login may reset authentication housekeeping fields in the isolated users table according to existing backend behavior; no coupon record or business-test state was mutated.

## Authentication Readiness

| Identity | HTTP | Token Returned | Identity Present | Role Check | Result |
| --- | ---: | --- | --- | --- | --- |
| Admin seed | `200` | `YES` | `YES` | role exactly `admin` | `PASS` |
| Non-admin seed | `200` | `YES` | `YES` | role `user`, therefore not `admin` | `PASS` |

Passwords and JWTs were held only in process memory and were neither printed nor persisted. Execution must supply the credential variables again through a runtime-only mechanism.

## Runtime Environment Inventory

| Variable | Status | Safe Value / Note |
| --- | --- | --- |
| `FEATURE_ID` | `PRESENT` | `FR-17` |
| `STUDENT_ID` | `PRESENT` | `23127107` |
| `SUT_API_BASE_URL` | `PRESENT` | `http://localhost:3000` |
| `FR17_ADMIN_BASE_URL` | `PRESENT` | `http://localhost:5174` |
| `FR17_TEST_ADMIN_EMAIL` | `PRESENT` | Runtime-only; value omitted |
| `FR17_TEST_ADMIN_PASSWORD` | `PRESENT` | Runtime-only; value omitted |
| `FR17_TEST_USER_EMAIL` | `PRESENT` | Runtime-only; value omitted |
| `FR17_TEST_USER_PASSWORD` | `PRESENT` | Runtime-only; value omitted |
| `FR17_RUN_ID` | `PRESENT` | `fr17-readiness-20260810T082458317+0700` |
| `FR17_ISOLATED_DB` | `PRESENT` | `true` |
| `FR17_TEST_DB_PATH` | `PRESENT` | Exact isolated path recorded above |

These variables were resolved for readiness only; a future execution shell must explicitly export them again.

## Playwright Configuration Readiness

| Gate | Result |
| --- | --- |
| Playwright | `1.62.1` |
| Projects | `PASS` — `chromium`, `firefox`, `webkit` with distinct `browserName` values |
| FR-17 workers | `PASS` — `1` |
| Retries | `PASS` — `0` |
| Screenshot | `PASS` — `only-on-failure` |
| Trace | `PASS` — `retain-on-failure` |
| Video | `PASS` — `off` |
| Existing FR-05/FR-09 compatibility | `PASS` — only the existing feature-specific worker rule is used; project/reporter settings remain shared |

## Test Collection

Collection used `npx.cmd` with `--list --reporter=list`. The reporter override prevented collection-only HTML output, and no browser was launched.

```powershell
$env:FEATURE_ID = 'FR-17'
$env:STUDENT_ID = '23127107'
$env:SUT_BASE_URL = 'http://localhost:5174'
npx.cmd playwright test tests/fr-17/fr-17.spec.js --list --reporter=list
```

| Metric | Result |
| --- | ---: |
| Unique FR17 Test Case IDs | 16 |
| Missing IDs | 0 |
| Duplicate IDs | 0 |
| Chromium collected | 16 |
| Firefox collected | 16 |
| WebKit collected | 16 |
| Total project-test definitions | 48 |

## Demo Collection and Script-Fix Wiring

```powershell
npx.cmd playwright test tests/fr-17/fr-17.spec.js --grep "@demo" --list --reporter=list
```

| Field | Result |
| --- | --- |
| Demo Test ID | `FR17-TC-004` |
| Demo Project-Test Definitions | `3` — one per project |
| Demo Command Collection | `PASS` |
| Primary DEMO_FIX Candidate | `FR-17 getCouponRow relative-locator correction` |
| DEMO_FIX Type | `TEST_SCRIPT_CORRECTION` |
| DEMO_FIX Static Wiring | `VERIFIED` |
| DEMO_FIX Runtime Verification | `PENDING` |
| Demo Runtime Status | `NOT_EXECUTED` |

Static inspection confirms TC-004 imports the corrected `getCouponRow()` chain through `expectOwnedCouponRow()`. Row scope originates from the coupon table rows, `filter({ has })` uses exact code text relative to each candidate row, no ancestor-table locator is embedded in `has`, and no `nth()` fallback exists.

## Corrected Automation Static Gates

| Area | Result |
| --- | --- |
| TC-005 duplicate oracle | `PASS` — pre/post `SAVE10` count 1; total count remains baseline; no zero-count path |
| TC-002 visible indicator | `PASS` — requires visibly rendered associated label/`aria-labelledby` text containing `*`; plain `aria-label` and hidden text excluded |
| Exact baseline guard | `PASS` — full coupon query, expected count and exact code-set comparison |
| Workspace DB rejection | `PASS` — resolved workspace path explicitly forbidden |
| Owned cleanup | `PASS` — exact controlled code only |
| TC-014 setup | `PASS` — independent owned record; UI performs Delete |
| Test-order safety | `PASS` — TC-003, TC-004 and TC-014 use independent data/setup; TC-005 never deletes `SAVE10`; TC-006–013 clean only their potential residue |
| Prohibited shortcuts | `PASS` — no `waitForTimeout()`, `force: true`, `test.skip()` or `test.fail()` |

## Report Identity and Evidence Readiness

The HTML reporter configuration is ready to display:

- `FR-17` from `FEATURE_ID`;
- `Run by: 23127107` from `STUDENT_ID`;
- ISO timestamp from `RUN_TIMESTAMP` or runtime generation;
- Run ID from `RUN_ID`;
- browser identity from `BROWSER_PROJECT` and the selected Playwright project.

Future runs must use distinct paths under `html-reports/fr-17/<run-id>/` and `test-results/fr-17/<run-id>/`. Collection did not create either FR-17 evidence directory. Original `only-on-failure` screenshots and `retain-on-failure` traces will be authoritative; video remains off. No rerun should be performed solely to recapture screenshots.

## Runtime-Only Risks

- Missing visible required `*`, invalid coupon validation and non-admin authorization remain `IMPLEMENTATION_ONLY` / `RUNTIME_VERIFICATION_REQUIRED` until approved multi-browser execution.
- The `getCouponRow()` script fix is statically wired but remains runtime `PENDING`.
- Before execution, reverify port 3000 belongs to PID 34940, port 5174 belongs to PID 21808, both HTTP checks pass, exact seed baseline remains four, and workspace DB hash is unchanged.

No `PRODUCT_DEFECT`, Bug Report or `FR17-BUG` ID was produced in readiness.

## Cleanup and Reuse Instructions

1. Preserve PID 34940, PID 21808 and the run-specific directory for the reviewed A-018 execution if they remain healthy.
2. Before execution, compare the current listeners/PIDs with this document; do not assume a reused port belongs to the same process.
3. After FR-17 execution is complete, stop the isolated backend only if port 3000 still belongs to PID 34940. Do not stop a replacement/unrelated PID.
4. Stop the readiness-started Web Admin only if port 5174 still belongs to PID 21808 and it is no longer needed.
5. Do not automatically restart the workspace backend, because its startup would reset the workspace database.
6. Remove the run-specific `.runtime/fr-17/fr17-readiness-20260810T082458317+0700/` directory only after its backend process is stopped and execution evidence no longer depends on it.

## Final Gate

All mandatory readiness gates passed. Status: `READY_FOR_EXECUTION`.

Current checkpoint: `CHECKPOINT: FR17_EXECUTION_READINESS_REVIEW_REQUIRED`.
