# FR-09 Playwright Automation Plan — Discount coupons

## Plan Status

`AUTOMATION_BUILD_REVIEW_REQUIRED`

Plan này triển khai 16 approved test cases từ `docs/test-cases/fr-09/`. Expected Results lấy từ `README.md` FR-09 và phần FR-08 trực tiếp liên quan; implementation chỉ được dùng cho locator, setup feasibility và discrepancy discovery.

## Approved Inventory

| Metric | Count |
| --- | ---: |
| Approved Test Cases | 16 |
| `READY_FOR_AUTOMATION` | 1 |
| `READY_WITH_SETUP` | 15 |
| `BLOCKED_BY_SETUP` | 0 |
| `BLOCKED_BY_IMPLEMENTATION` | 0 |
| Implemented Playwright Tests | 16 |

Expected product failures vẫn là executable automation và không bị đổi thành blocked status.

## Runtime Configuration

| Input | Environment Variable | Rule |
| --- | --- | --- |
| Frontend base URL | `SUT_BASE_URL` | Required by `playwright.config.js`. |
| Backend base URL | `SUT_API_BASE_URL` | Required by FR-09 auth fixture. |
| Student ID | `STUDENT_ID` | Future report phải dùng `23127107`. |
| Feature identity | `FEATURE_ID` | Set `FR-09` for report/output isolation. |
| Browser identity | `BROWSER_PROJECT` | Set to the active project or `multi-project`. |
| Test user email/password | `FR09_TEST_USER_EMAIL`, `FR09_TEST_USER_PASSWORD` | Runtime-only; không source control. |
| Isolated SQLite path | `FR09_TEST_DB_PATH` | Required only by TC-010/014/015; must be a run-specific copy used by the backend process. |
| DB mutation confirmation | `FR09_ISOLATED_DB=true` | Mandatory safety gate for stateful fixture. |

## Authentication Strategy

`authenticatedSession` gọi `POST /api/login` bằng runtime credentials, kiểm tra response có JWT và `user.id`, sau đó inject token vào `localStorage` trước navigation đầu tiên. UI vẫn thực hiện toàn bộ cart/Checkout/coupon behavior. Mỗi Playwright test nhận page/context mới; unauthenticated cases dùng base `page` fixture và không nhận token.

Không lưu credential/JWT trong JSON hoặc test source. Login fixture chỉ là setup support, không thay thế UI coupon assertions.

## Cart and Checkout Strategy

- Normal/non-boundary total 4000000: đi qua Home UI, dùng existing seed product `Bàn phím cơ Keychron Q1`, click `Thêm vào giỏ`, mở Cart rồi click `Tiến hành thanh toán`.
- Approved boundaries 299999, 300000, 500001, 100001: intercept riêng initial `GET /api/products` response bằng một test-only frontend product từ external JSON; add-to-cart và coupon application vẫn đi qua UI. Không insert product/database row.
- TC-012: tạo cart qua Home UI trong fresh unauthenticated context rồi điều hướng SPA tới `/checkout` để giữ in-memory CartContext nhưng không tạo JWT.
- TC-013: direct navigation `/checkout` trong fresh unauthenticated context, chờ existing EShop shell và `main` render bằng web-first assertions, sau đó kiểm tra functional coupon flow không usable mà không ép một denial mechanism cụ thể.

## Isolated DB Strategy

TC-010/014/015 dùng `isolatedDb` fixture với các guard bắt buộc:

1. `FR09_ISOLATED_DB=true`.
2. `FR09_TEST_DB_PATH` tồn tại và khác absolute workspace path `backend/database.sqlite`.
3. Future Execution Readiness phải tạo run-specific backend copy, start backend từ copy đó tại port 3000, rồi trỏ `FR09_TEST_DB_PATH` tới chính database của copy.
4. TC-010 chỉ insert/delete coupon row do fixture sở hữu.
5. TC-014/015 snapshot rows của đúng `(coupon_id, user_id)`, thiết lập exact count, rồi restore snapshot trong `finally`.
6. `workers: 1` khi `FEATURE_ID=FR-09` ngăn stateful cross-project overlap. Tests vẫn độc lập; không dùng serial-suite failure propagation và không phụ thuộc execution order.

Không stateful fixture nào được phép chạy trên workspace/shared/production DB.

## Test Case Automation Mapping

| Test Case ID | Status | Data IDs | Fixture / Setup | Primary Assertions | Helpers | Known Risk |
| --- | --- | --- | --- | --- | --- | --- |
| FR09-TC-001 | `READY_WITH_SETUP` | FR09-DATA-001, 005 | Auth + seed cart UI | input visible/value; button enabled; applied-or-rejected state transition | `openAuthenticatedCheckoutWithSeedProduct`, `applyCoupon` | Exact outcome copy intentionally not asserted. |
| FR09-TC-002 | `READY_WITH_SETUP` | FR09-DATA-001, 005 | Auth + seed cart UI | numeric discount = 400000 | `expectAppliedAmounts` | Expected to reveal percent-formula defect. |
| FR09-TC-003 | `READY_WITH_SETUP` | FR09-DATA-001, 005 | Auth + seed cart UI | numeric final/payable = 3600000 | `expectAppliedAmounts` | Expected to reveal percent-formula defect. |
| FR09-TC-004 | `READY_WITH_SETUP` | FR09-DATA-002, 005 | Auth + seed cart UI | numeric discount = 50000 | `expectAppliedAmounts` | Usage baseline must remain isolated. |
| FR09-TC-005 | `READY_WITH_SETUP` | FR09-DATA-002, 005 | Auth + seed cart UI | numeric final/payable = 3950000 | `expectAppliedAmounts` | Final line must not be confused with original total. |
| FR09-TC-006 | `READY_WITH_SETUP` | FR09-DATA-001, 007 | Auth + controlled boundary cart | applied state; discount 30000; final 270000 | controlled route + amount helpers | Expected to reveal `>` versus `>=` defect. |
| FR09-TC-007 | `READY_WITH_SETUP` | FR09-DATA-001, 006 | Auth + controlled boundary cart | coupon amounts absent; payable 299999 | `expectRejectedCoupon` | No error-region or exact-copy dependency. |
| FR09-TC-008 | `READY_WITH_SETUP` | FR09-DATA-002, 008 | Auth + controlled boundary cart | discount 50000; final 450001 | controlled route + amount helpers | Frontend route fixture must be disposed. |
| FR09-TC-009 | `READY_WITH_SETUP` | FR09-DATA-005, 010 | Auth + seed cart UI | rejection state; payable 4000000 | `expectRejectedCoupon` | Reserved code must remain absent at readiness. |
| FR09-TC-010 | `READY_WITH_SETUP` | FR09-DATA-005, FR09-SETUP-001 | Auth + isolated inactive coupon + seed cart | rejection state; payable unchanged | `isolatedDb.installInactiveCoupon` | Requires isolated backend copy. |
| FR09-TC-011 | `READY_WITH_SETUP` | FR09-DATA-004, 009 | Auth + expiration-isolation cart | rejection state; payable 100001 | controlled route + rejection helper | Exact expiry-time boundary intentionally excluded. |
| FR09-TC-012 | `READY_WITH_SETUP` | FR09-DATA-001, 005 | Fresh unauthenticated page + UI cart + SPA navigation | permission/rejection; amounts absent; payable 4000000 | `openUnauthenticatedCheckoutWithSeedProduct` | Expected to reveal missing JWT enforcement. |
| FR09-TC-013 | `READY_FOR_AUTOMATION` | None | Fresh unauthenticated direct navigation | stable app shell/main render gate, then functional Checkout/coupon flow must not be usable | role locators + URL/access-state evaluation | Expected to reveal unguarded route; cross-browser render/navigation behavior needs runtime evidence. |
| FR09-TC-014 | `READY_WITH_SETUP` | FR09-DATA-001, 005, FR09-SETUP-002 | Auth + exact SAVE10 usage 1/1 + seed cart | rejection; payable remains 4000000 | `isolatedDb.setExactUsageCount` | C5 isolated; do not revert to total 300000. |
| FR09-TC-015 | `READY_WITH_SETUP` | FR09-DATA-003, 005, FR09-SETUP-003 | Auth + exact VIP100 usage 1/2 + seed cart | discount 100000; final 3900000 | usage fixture + amount helpers | Apply only; no Checkout completion. |
| FR09-TC-016 | `READY_WITH_SETUP` | FR09-DATA-005 | Auth + seed cart UI | input value 4000000; payable 4000000; total not editable | amount helper + `not.toBeEditable()` | Expected to reveal editable-total defect. |

## Locator Strategy

Priority locators used:

1. `getByRole()` for main, headings, buttons, links and spinbutton.
2. `getByPlaceholder()` for coupon input because current label is not programmatically associated.
3. `getByText()` scoped to `main` for discount/final lines.
4. Stable CSS only for the authenticated profile anchor where no stronger current locator exists.

No XPath, absolute DOM path, generated class, `nth()` or invented test ID is used. SPA navigation and the TC-013 app-render gate remain documented navigation/runtime risks pending cross-browser evidence.

## Assertion Strategy

Distinct patterns include:

- `VISIBILITY_OR_HIDDEN_STATE`
- `ENABLED_OR_DISABLED_STATE`
- `TEXT_OR_VALUE`
- `STATE_TRANSITION`
- `CALCULATION`
- `PERMISSION`
- `URL_OR_NAVIGATION`
- `COUNT`

`parseDisplayedAmount` extracts exactly one numeric semantic value from the scoped monetary line and compares a safe integer. Formatting alone cannot satisfy an incorrect value.

Negative tests require coupon-derived discount/final lines to remain absent and the payable total to remain unchanged after the POST completes. Error presentation may be collected as optional supplemental evidence only; it is not a pass/fail dependency and no exact Vietnamese copy is asserted.

## Known Implementation Risks

- Apply-coupon lacks JWT middleware and trusts body `user_id`.
- Missing identity bypasses usage checks.
- Minimum comparison is `>` instead of `>=`.
- Percent formula is nonconforming.
- `/checkout` is unguarded.
- Checkout total is editable.
- Usage recording is separated from apply/checkout.

Assertions remain requirement-based. These risks do not block automation and may produce legitimate future product failures.

## Failure Evidence and Reporting

`playwright.config.js` now provides:

- `screenshot: 'only-on-failure'`
- `trace: 'retain-on-failure'`
- `video: 'off'`
- dynamic Feature/Run/browser identity in metadata and visible HTML report title

Future FR-09 run must set `FEATURE_ID=FR-09`, `STUDENT_ID=23127107`, ISO `RUN_TIMESTAMP`, unique `RUN_ID`, and active `BROWSER_PROJECT`. Chromium, Firefox and WebKit should be executed as separately identified runs against a fresh isolated backend copy.

If a failure is later human-approved as `PRODUCT_DEFECT`, copy the original failure screenshot to `docs/defects/fr-09/screenshots/<DefectID>.png`. Do not promote `AUTOMATION_DEFECT` screenshots and do not assign Defect IDs during build.

## Static Validation Strategy

Allowed checks: `node --check`, JSON parse, import resolution, ID inventory, prohibited-pattern scan and config inspection. Browser/SUT execution and runtime DB mutation are prohibited in this phase. `playwright test --list` is not required because static inspection fully establishes the 16-title inventory without invoking fixture collection paths.

## Current Checkpoint

`CHECKPOINT: FR09_AUTOMATION_BUILD_REVIEW_REQUIRED`
