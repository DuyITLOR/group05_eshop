# FR-09 AI-Generated Automation Static Review

## Review Status

`APPROVED`

Không có browser/SUT execution trong review này. `Verification` chỉ phản ánh static checks.

## Findings

| Review ID | Test Case ID | File / Section | Finding | Risk | Decision | Applied Correction | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR09-AUTO-REV-001 | All | `fr-09.spec.js` suite mode | Draft ban đầu dùng Playwright serial suite; một expected product failure có thể skip các test sau. | Không thu đủ 16 runtime results. | `MODIFIED` | Bỏ serial mode; dùng config `workers: 1` cho FR-09 để tránh DB overlap mà không tạo failure propagation. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-002 | All | `playwright.config.js` evidence | Existing config chưa giữ screenshot/trace tự động. | Mất original failure evidence. | `MODIFIED` | Thêm `only-on-failure` screenshot và `retain-on-failure` trace; giữ video off. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-003 | All | `playwright.config.js` report identity | Existing report/output paths hardcode FR-05. | FR-09 report có thể mang sai feature identity hoặc ghi chung output. | `MODIFIED` | Dùng `FEATURE_ID`, feature-specific output path, visible title và `Browser project` metadata; default FR-05 giữ backward compatibility. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-004 | TC-001–012, 014–016 | Auth fixture | Duplicated or source-controlled seed credentials/JWT would be unsafe. | Secret leakage và shared auth state. | `MODIFIED` | Credentials/backend URL chỉ lấy từ environment; login response token được inject per fresh page. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-005 | TC-010, 014, 015 | DB fixture | A generic SQLite mutation helper could accidentally target workspace/shared DB. | Corrupt business data hoặc leak state giữa tests. | `MODIFIED` | Require explicit confirmation, reject workspace DB absolute path, mutate exact owned rows and restore snapshots in `finally`. | `STATIC_VERIFIED`; runtime isolation remains readiness prerequisite. |
| FR09-AUTO-REV-006 | TC-002–006, 008, 015–016 | Monetary assertions | Substring/format-only checks could accept a wrong amount. | False pass against calculation defects. | `MODIFIED` | Added scoped single-value parser and safe-integer equality assertions. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-007 | TC-006–008, 011 | Controlled cart route | Boundary totals cannot be produced naturally by seed products. | DB product fabrication or API-only coverage. | `MODIFIED` | External JSON product response is intercepted only for initial catalog; add-to-cart and coupon behavior remain UI-driven; route disposed in `finally`. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-008 | TC-012 | SPA navigation | CartContext is in-memory, so full direct navigation would lose the controlled cart. | JWT test could accidentally run with total 0 and fail C3 first. | `MODIFIED` | Build cart through UI, then use same-document History navigation to `/checkout` without adding JWT. | `NEEDS_MORE_EVIDENCE` across Chromium/Firefox/WebKit. |
| FR09-AUTO-REV-009 | Negative cases | Optional error evidence | Current error region has no role/test ID/programmatic label. | Treating it as a required oracle would create false automation failures after presentation-only refactors. | `MODIFIED` | Classified it as `OPTIONAL_EVIDENCE_LOCATOR` and removed it from generic negative pass/fail assertions; no CSS error locator is required by the suite. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-010 | All | Data/title inventory | Reusable data could drift inline or approved IDs could be omitted/duplicated. | Traceability/count failure. | `MODIFIED` | Centralized 13 logical datasets in `test-data/fr-09.json`; static inventory confirms 16 unique titles from TC-001 through TC-016. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-011 | TC-014, TC-015 | Upstream design traceability | Original design value 300000 could let the known C3 minimum-total discrepancy mask the intended C5 boundary result. | Ambiguous failure attribution despite correct usage fixtures. | `MODIFIED` | Confirmed total 4000000 across design, JSON, plan and spec; C5 objectives remain `usage = max` and `usage = max - 1`, while total is only a C3-positive control. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-012 | Negative cases | `expectRejectedCoupon` | Generic rejection helper required a present CSS error element in addition to the requirement-supported outcome oracle. | Over-constrained automation and presentation-coupled false failures. | `MODIFIED` | Helper now asserts only discount line absent, coupon final line absent and payable unchanged after `applyCoupon()` waits for POST completion. | `STATIC_VERIFIED` |
| FR09-AUTO-REV-013 | TC-013 | Direct-navigation readiness | Functional visibility was evaluated immediately after `page.goto()` without an explicit deterministic app-render boundary. | Timing-dependent cross-browser result. | `MODIFIED` | Added web-first checks for the existing EShop shell link and `main`, then retained mechanism-neutral URL/control usability evaluation without redirect or denial-copy assumptions. | `NEEDS_MORE_EVIDENCE` across Chromium/Firefox/WebKit. |

## Prohibited Shortcut Review

| Check | Result |
| --- | --- |
| Inline data-driven arrays replacing JSON | `PASS` |
| `waitForTimeout()` | `PASS` — none |
| `test.skip()` placeholders | `PASS` — none |
| `force: true` | `PASS` — none |
| Swallowed assertion errors | `PASS` — none |
| Absolute XPath / unstable `nth()` | `PASS` — none |
| Runtime retries | `PASS` — retries remain 0 |
| Test-order dependency | `PASS` — independent setup/cleanup |
| API-only feature tests | `PASS` — coupon flow remains UI-driven |
| Expected Results weakened to current implementation | `PASS` |

## Inventory Review

- Approved IDs represented: 16/16.
- Unique Playwright titles: 16.
- External logical datasets: 13.
- Assertion patterns: at least 8.
- `READY_FOR_AUTOMATION`: 1.
- `READY_WITH_SETUP`: 15.
- Blocked cases: 0.
- Browser execution at build review: `NOT_EXECUTED`; approved final runtime result: 48 project-test combinations completed.

## Human Review Result

Human review đã approve corrected automation build. Approved multi-browser runtime review sau đó xác nhận isolated backend-copy procedure và giải quyết TC-012/TC-013 navigation/render risks. Error presentation vẫn là optional evidence và không phải correctness dependency.

## Static Validation Evidence

| Validation | Result |
| --- | --- |
| `node --check` for config/spec/helper/fixture | `PASS` |
| Helper/fixture import resolution | `PASS` |
| `test-data/fr-09.json` parse | `PASS` |
| Monetary parser examples using period, comma, regular space, NBSP and narrow NBSP | `PASS` — 5/5 |
| Approved ID inventory versus Playwright titles | `PASS` — 16/16, sequential, unique, no missing/extra IDs |
| Dataset traceability | `PASS` — 13 logical datasets; every data-requiring case mapped; TC-013 intentionally has no business data |
| TC-014/TC-015 C5 isolation traceability | `PASS` — design/data/plan/spec use seed total 4000000; TC-015 retains discount 100000 and final 3900000 |
| Generic rejection oracle | `PASS` — no mandatory error element/copy locator; asserts coupon amounts absent and payable unchanged after POST completion |
| TC-013 render gate | `PASS` static — EShop shell link and `main` use web-first readiness assertions; cross-browser behavior remains `NEEDS_MORE_EVIDENCE` |
| Config identity/project review | `PASS` — FR-09, student ID, ISO timestamp, Run ID, browser identity and three distinct browser engines |
| Failure evidence config | `PASS` — screenshot/trace configured |
| Prohibited shortcut scan | `PASS` — no timeout wait, skip, force, XPath or `nth()` |
| Workspace DB hash check | `NOT_AVAILABLE_DUE_EXISTING_FILE_LOCK`; no DB fixture or mutation command was invoked |
| Browser/SUT test execution | `NOT_EXECUTED` |

## Runtime Verification Addendum

Human-approved Chromium/Firefox/WebKit execution đã giải quyết các runtime-only risks mà static review chưa thể kết luận.

| Review ID | Final Runtime Verification | Evidence |
| --- | --- | --- |
| `FR09-AUTO-REV-005` | `RUNTIME_VERIFIED_ISOLATED_DB` — stateful fixtures dùng isolated backend DB, cleanup `coupon_usage = 0`, workspace DB hash không đổi. | `docs/execution-results/fr-09-cross-browser-summary.md` |
| `FR09-AUTO-REV-008` | `RUNTIME_VERIFIED_MULTI_BROWSER` — TC-012 setup thành công trên ba engines; failure được human-confirm là `PRODUCT_DEFECT`, không phải navigation/setup defect. | Browser execution records; `FR09-BUG-003` |
| `FR09-AUTO-REV-013` | `RUNTIME_VERIFIED_MULTI_BROWSER` — shell/`main` gate pass trên ba engines; usable unauthenticated controls được human-confirm là `PRODUCT_DEFECT`. | Browser execution records; `FR09-BUG-004` |

Final runtime result: Chromium/Firefox/WebKit đều 16 total, 10 passed, 6 failed; `AUTOMATION_DEFECT: 0`, `NEEDS_MORE_EVIDENCE: 0`, `ENVIRONMENT_FAILURE: 0`.

## Current Checkpoint

`CHECKPOINT: FR09_FINAL_REVIEW_REQUIRED`
