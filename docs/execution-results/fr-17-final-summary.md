# FR-17 Final Feature Summary — Coupon management

## Finalization Status

`COMPLETED_PENDING_HUMAN_REVIEW`

Finalization này chỉ chuẩn hóa defect, traceability và demo readiness từ evidence đã được A-020 approve. Không browser execution, database mutation hoặc screenshot recapture nào được thực hiện.

## Approved Automation Inventory

| Field | Value |
| --- | ---: |
| Approved Test Cases | 16 |
| Automated Playwright Tests | 16 |
| Blocked Approved Tests | 0 |
| Browser Projects | 3 |
| Final Project-Test Combinations | 48 |

## Final Multi-Browser Metrics

| Browser | Run ID | Total | Passed | Failed | Skipped | Failed Test Case IDs |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Chromium | `fr17-chromium-corrected-20260810T092053847+0700` | 16 | 12 | 4 | 0 | `FR17-TC-002`, `FR17-TC-008`, `FR17-TC-011`, `FR17-TC-016` |
| Firefox | `fr17-firefox-20260810T092258944+0700` | 16 | 14 | 2 | 0 | `FR17-TC-002`, `FR17-TC-016` |
| WebKit | `fr17-webkit-20260810T092419436+0700` | 16 | 14 | 2 | 0 | `FR17-TC-002`, `FR17-TC-016` |
| **Final Aggregate** |  | **48** | **40** | **8** | **0** |  |

Historical Chromium run `fr17-chromium-20260810T084402107+0700` remains preserved as automation-correction history and is not used for final Chromium metrics.

## Confirmed Defect Mapping

| Defect ID | Found by | Requirement | Final Defect | Browser Scope | Severity / Priority |
| --- | --- | --- | --- | --- | --- |
| `FR17-BUG-001` | `FR17-TC-002` | `FR17-R16` | Required coupon fields không hiển thị visible `*` indicator. | `CROSS_BROWSER` | `Low / P3` |
| `FR17-BUG-002` | `FR17-TC-008` | `FR17-R08` | Corrected Chromium tạo coupon có `discount_value=0`. | `CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR` | `Medium / P2` |
| `FR17-BUG-003` | `FR17-TC-011` | `FR17-R11` | Corrected Chromium tạo coupon có `min_order_amount=-1`. | `CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR` | `Medium / P2` |
| `FR17-BUG-004` | `FR17-TC-016` | `FR17-R15` | Runtime-verified non-admin vẫn nhận usable Coupon Management control. | `CROSS_BROWSER` | `High / P1` |

Confirmed Failed Test Case IDs: `4`. Confirmed Underlying Product Defects: `4`. Remaining `AUTOMATION_DEFECT`: `0`. Remaining `NEEDS_MORE_EVIDENCE`: `0`. `ENVIRONMENT_FAILURE`: `0`.

## Cross-Browser Interpretation

Failure-set result: `PARTIALLY_OVERLAPPING`.

- `FR17-TC-002` và `FR17-TC-016` reproduce trên Chromium, Firefox và WebKit.
- `FR17-TC-008` và `FR17-TC-011` reproduce trong corrected Chromium nhưng PASS trên Firefox/WebKit.
- Không suy luận cross-browser-independent backend root cause cho TC-008/TC-011 từ static inspection.
- Historical `FR17-TC-003` failure là `AUTOMATION_DEFECT`, đã được correction và PASS trên cả ba engines; case này không tạo Product Bug ID.

## Screenshot and Publication Status

| Field | Result |
| --- | --- |
| Promoted Defect Screenshots | `4` |
| Promotion Identity | `PASS` — byte/hash-identical derivatives |
| Candidate Copies Preserved | `PASS` |
| Original Run Evidence Preserved | `PASS` |
| Standardized Bug Reports | `4` |
| GitHub Issue Drafts | `4` |
| GitHub Publication Status | `NOT_PUBLISHED` |

## AI / Human Automation Correction History

### Primary Genuine AI-Generated Script Correction

| Field | Value |
| --- | --- |
| Correction | `getCouponRow` relative-locator correction |
| Original Issue | Incorrect Playwright `filter({ has })` composition used a locator already scoped through the ancestor table. |
| Human Correction | Row-relative exact-code locator. |
| Type | `TEST_SCRIPT_CORRECTION` |
| Runtime Verification | `VERIFIED_MULTI_BROWSER` |

### Secondary Runtime Automation Correction

| Field | Value |
| --- | --- |
| Correction | `FR17-TC-003 assertion-scope / locale-independence correction` |
| Original Issue | Out-of-scope locale-dependent min-order display assertion caused a false Chromium failure after valid percent CREATE succeeded. |
| Human Correction | Keep TC-003 PASS/FAIL scope to exact owned row, percent type and submitted discount value. |
| Runtime Verification | `VERIFIED_MULTI_BROWSER` |

Lịch sử này được giữ nguyên; final scripts không được mô tả như thể AI đã tạo đúng ngay lần đầu.

## Demo Readiness

| Field | Value |
| --- | --- |
| Primary Demo Feature | `FR-17` |
| Primary Demo Test | `FR17-TC-004` |
| Final Selected Demo Test | `FR17-TC-004` |
| Demo Tag | `@demo` |
| Demo Runtime Status | `VERIFIED_MULTI_BROWSER` |
| Primary DEMO_FIX | FR-17 `getCouponRow` relative-locator correction |
| Primary DEMO_FIX Runtime Verification | `VERIFIED_MULTI_BROWSER` |
| Secondary Runtime Correction Verification | `VERIFIED_MULTI_BROWSER` |
| Demo Recording Command Status | `READY` |
| Recording Status | `NOT_RECORDED` |

Later recording run là demonstration run và không thay thế archived corrected Chromium, Firefox, WebKit full-feature evidence.

## Final Traceability

| Requirement | Test Case | External Data / Setup | Playwright Test | Final Browser Result / Classification | Defect ID | Screenshot | Bug Report | GitHub Draft |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `FR17-R16` | `FR17-TC-002` | `FR17-DATA-002` | `tests/fr-17/fr-17.spec.js` | Chromium/Firefox/WebKit `FAIL` → `PRODUCT_DEFECT` | `FR17-BUG-001` | `screenshots/FR17-BUG-001.png` | `FR17-BUG-001-required-field-indicators.md` | `github-issues/FR17-BUG-001.md` |
| `FR17-R08` | `FR17-TC-008` | `FR17-DATA-008` | `tests/fr-17/fr-17.spec.js` | Chromium `FAIL`; Firefox/WebKit `PASS` → `PRODUCT_DEFECT` | `FR17-BUG-002` | `screenshots/FR17-BUG-002.png` | `FR17-BUG-002-zero-discount-value.md` | `github-issues/FR17-BUG-002.md` |
| `FR17-R11` | `FR17-TC-011` | `FR17-DATA-011` | `tests/fr-17/fr-17.spec.js` | Chromium `FAIL`; Firefox/WebKit `PASS` → `PRODUCT_DEFECT` | `FR17-BUG-003` | `screenshots/FR17-BUG-003.png` | `FR17-BUG-003-negative-minimum-order.md` | `github-issues/FR17-BUG-003.md` |
| `FR17-R15` | `FR17-TC-016` | `FR17-SETUP-002` | `tests/fr-17/fr-17.spec.js` | Chromium/Firefox/WebKit `FAIL` → `PRODUCT_DEFECT` | `FR17-BUG-004` | `screenshots/FR17-BUG-004.png` | `FR17-BUG-004-non-admin-coupon-management-access.md` | `github-issues/FR17-BUG-004.md` |

Traceability Result: `PASS_WITH_OPEN_REQUIREMENT_GAPS`.

All four defects have Requirement → Test Case → external data/setup → Playwright test → browser run → assertion result → failure classification → Defect ID → screenshot → Bug Report → GitHub Issue draft. The existing `11` requirement gaps remain open and were not closed or redefined.

## Safety and Final Checkpoint

| Field | Value |
| --- | --- |
| Browser Execution Performed During Finalization | `NO` |
| Database Mutation Performed During Finalization | `NO` |
| Screenshot Recapture | `NO` |
| Test / Config / SUT Modification | `NO` |
| GitHub Publication | `NO` |
| Current Checkpoint | `CHECKPOINT: FR17_FINAL_REVIEW_REQUIRED` |
