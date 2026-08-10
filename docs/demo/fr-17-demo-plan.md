# FR-17 Demo Plan

## Demo Selection Status

`READY_FOR_RECORDING`

| Field                         | Value                                 |
| ----------------------------- | ------------------------------------- |
| Primary Demo Feature          | `FR-17`                               |
| Primary Demo Test             | `FR17-TC-004`                         |
| Final Selected Demo Test      | `FR17-TC-004`                         |
| Demo Tag                      | `@demo` — sole tagged FR-17 test      |
| Demo Runtime Status           | `VERIFIED_MULTI_BROWSER`              |
| Spec Path                     | `tests/fr-17/fr-17.spec.js`           |
| External Data Path            | `test-data/fr-17.json`                |
| Browser Projects              | `chromium`, `firefox`, `webkit`       |
| Demo Recording Command Status | `READY`                               |
| Separate Recording Run        | `NOT_EXECUTED`                        |
| Integrated Video Script       | `docs/demo/HW04-FR17-VIDEO-SCRIPT.md` |

TC-004 được thực thi trong mỗi full 16-test suite; không có separate `--grep @demo` run trong phase này.

## Selected Demo Objective and Oracle

| Field                    | Value                                                                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Objective                | Valid admin tạo controlled fixed coupon tại approved lower valid boundaries và thấy đúng owned row trong Coupon Management list. |
| Requirement Traceability | FR17-R02, FR17-R07–R13                                                                                                           |
| Controlled Values        | `discount_value=1`, `min_order_amount=0`, `max_uses_per_user=1` từ external JSON                                                 |
| Primary Oracle           | Exact owned code count chuyển `0 → 1`; row visible; fixed type/value và approved lower-bound displays đúng.                      |
| Cleanup                  | Delete only test-owned record và xác nhận exact four-seed baseline được phục hồi.                                                |

## Per-Browser Runtime Evidence

| Browser  | Run ID                                            | Setup  | Create | Corrected Row Lookup | Row/Boundary Assertions | Cleanup | Overall |
| -------- | ------------------------------------------------- | ------ | ------ | -------------------- | ----------------------- | ------- | ------- |
| Chromium | `fr17-chromium-corrected-20260810T092053847+0700` | `PASS` | `PASS` | `PASS`               | `PASS`                  | `PASS`  | `PASS`  |
| Firefox  | `fr17-firefox-20260810T092258944+0700`            | `PASS` | `PASS` | `PASS`               | `PASS`                  | `PASS`  | `PASS`  |
| WebKit   | `fr17-webkit-20260810T092419436+0700`             | `PASS` | `PASS` | `PASS`               | `PASS`                  | `PASS`  | `PASS`  |

## Automation-Correction Demo Story

### Primary DEMO_FIX

| Field                | Value                                            |
| -------------------- | ------------------------------------------------ |
| Candidate            | FR-17 `getCouponRow` relative-locator correction |
| Type                 | `TEST_SCRIPT_CORRECTION`                         |
| Chromium             | `DEMO_FIX_RUNTIME_VERIFIED_CHROMIUM`             |
| Firefox              | `DEMO_FIX_RUNTIME_VERIFIED_FIREFOX`              |
| WebKit               | `DEMO_FIX_RUNTIME_VERIFIED_WEBKIT`               |
| Runtime Verification | `VERIFIED_MULTI_BROWSER`                         |

Correction dùng exact code text relative to each candidate coupon row. TC-004 exercised thành công path này trên cả ba engines.

### Secondary Runtime Automation Correction

| Field                       | Value                                                          |
| --------------------------- | -------------------------------------------------------------- |
| Correction                  | `FR17-TC-003 assertion-scope / locale-independence correction` |
| Type                        | `TEST_SCRIPT_CORRECTION`                                       |
| Chromium / Firefox / WebKit | `PASS / PASS / PASS`                                           |
| Runtime Verification        | `VERIFIED_MULTI_BROWSER`                                       |

TC-003 xác nhận valid percent CREATE, exact owned row, percent type, submitted discount value và cleanup. Không có removed out-of-scope locale assertion nào gây failure.

## Demo Flow

1. Verify isolated DB exact four-seed baseline and owned fixed-code absence.
2. Establish valid admin session and open Coupon Management.
3. Show controlled values from `test-data/fr-17.json`.
4. Submit once.
5. Show the exact owned fixed-code row and count transition `0 → 1`.
6. Verify fixed type/value and approved `1 / 0 / 1` boundaries.
7. Clean up the test-owned record and verify baseline restoration.

## Safety Constraints

- Use the approved isolated database only; never target workspace `backend/database.sqlite`.
- Do not delete shared seed coupons.
- Preserve external data and deterministic per-test cleanup.
- Keep `workers=1`, retries `0`, screenshot `only-on-failure`, trace `retain-on-failure`, video `off`.
- Do not alter the sole `@demo` tag before final feature review.

## Draft Recording Command

```powershell
$env:FEATURE_ID = 'FR-17'
$env:STUDENT_ID = '23127107'

# Set privately at recording time; do not persist secret values:
# SUT_API_BASE_URL
# FR17_ADMIN_BASE_URL
# FR17_TEST_ADMIN_EMAIL
# FR17_TEST_ADMIN_PASSWORD
# FR17_TEST_USER_EMAIL
# FR17_TEST_USER_PASSWORD
# FR17_ISOLATED_DB
# FR17_TEST_DB_PATH
# FR17_RUN_ID
# RUN_ID
# RUN_TIMESTAMP

npx.cmd playwright test tests/fr-17/fr-17.spec.js --grep "@demo"
```

Status: `READY`. Command này chưa được chạy; runtime-only credentials phải được cung cấp riêng tại thời điểm recording.

Later recording là demonstration run. Authoritative full-feature evidence vẫn là archived corrected Chromium, Firefox và WebKit runs; recording không thay thế các run này.

Feature Status: `FR17_COMPLETE`. Recording Status: `NOT_RECORDED`.
