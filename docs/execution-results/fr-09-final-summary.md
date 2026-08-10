# FR-09 Final Feature Summary

## Feature

FR-09 — Discount coupons

## Approved Scope and Automation

| Metric | Result |
| --- | --- |
| Approved Test Cases | 16 |
| Automated | 16 |
| Blocked | 0 |
| Browsers | Chromium, Firefox, WebKit |
| External data | Approved `test-data/fr-09.json`; 13 logical datasets; 16/16 approved Test Case IDs được trace; credentials/JWT không lưu trong JSON. |
| Assertion-pattern coverage | `CALCULATION`, `TEXT_OR_VALUE`, `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE`, `ENABLED_OR_DISABLED_STATE`, `PERMISSION`, `URL_OR_NAVIGATION`, `ATTRIBUTE_OR_CLASS`. |

## Final Automation Result

| Browser | Total | Passed | Failed | Skipped | Run ID |
| --- | ---: | ---: | ---: | ---: | --- |
| Chromium | 16 | 10 | 6 | 0 | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` |
| Firefox | 16 | 10 | 6 | 0 | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` |
| WebKit | 16 | 10 | 6 | 0 | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` |
| **Total combinations** | **48** | **30** | **18** | **0** | — |

Sáu failed Test Cases giống nhau trên ba browser: `FR09-TC-002`, `FR09-TC-003`, `FR09-TC-006`, `FR09-TC-012`, `FR09-TC-013`, `FR09-TC-016`.

| Classification | Count | Result |
| --- | ---: | --- |
| Confirmed failed Test Cases | 6 | `PRODUCT_DEFECT` |
| Confirmed underlying Product Defects | 5 | TC-002 và TC-003 cùng map tới percent-calculation defect. |
| Remaining `AUTOMATION_DEFECT` | 0 | Không còn. |
| Remaining `NEEDS_MORE_EVIDENCE` | 0 | TC-012/TC-013 đã runtime-verified trên ba engines. |
| `ENVIRONMENT_FAILURE` | 0 | Không có. |

## Defect Deduplication and Traceability

| Defect ID | Found by Test Case | Defect Report | Screenshot | GitHub Issue Draft |
| --- | --- | --- | --- | --- |
| `FR09-BUG-001` | `FR09-TC-002`, `FR09-TC-003` | `docs/defects/fr-09/FR09-BUG-001-percent-calculation.md` | `docs/defects/fr-09/screenshots/FR09-BUG-001.png` | `docs/defects/fr-09/github-issues/FR09-BUG-001.md` |
| `FR09-BUG-002` | `FR09-TC-006` | `docs/defects/fr-09/FR09-BUG-002-minimum-boundary.md` | `docs/defects/fr-09/screenshots/FR09-BUG-002.png` | `docs/defects/fr-09/github-issues/FR09-BUG-002.md` |
| `FR09-BUG-003` | `FR09-TC-012` | `docs/defects/fr-09/FR09-BUG-003-missing-coupon-authentication.md` | `docs/defects/fr-09/screenshots/FR09-BUG-003.png` | `docs/defects/fr-09/github-issues/FR09-BUG-003.md` |
| `FR09-BUG-004` | `FR09-TC-013` | `docs/defects/fr-09/FR09-BUG-004-unguarded-checkout-coupon-flow.md` | `docs/defects/fr-09/screenshots/FR09-BUG-004.png` | `docs/defects/fr-09/github-issues/FR09-BUG-004.md` |
| `FR09-BUG-005` | `FR09-TC-016` | `docs/defects/fr-09/FR09-BUG-005-editable-checkout-total.md` | `docs/defects/fr-09/screenshots/FR09-BUG-005.png` | `docs/defects/fr-09/github-issues/FR09-BUG-005.md` |

`FR09-TC-002` kiểm tra wrong `discount_amount` và `FR09-TC-003` kiểm tra wrong `final_amount`; human review xác nhận đây là hai consequences độc lập của cùng underlying percent-calculation defect `FR09-BUG-001`, không phải hai Bug IDs riêng.

## Severity / Priority Summary

| Defect ID | Severity | Priority | Primary Category |
| --- | --- | --- | --- |
| `FR09-BUG-001` | `High` | `P1` | Functional / Data Integrity |
| `FR09-BUG-002` | `Medium` | `P2` | Functional / Validation |
| `FR09-BUG-003` | `High` | `P1` | Security / Authentication |
| `FR09-BUG-004` | `Medium` | `P2` | Security / Authorization / UI |
| `FR09-BUG-005` | `High` | `P1` | Functional / Validation / Data Integrity |

Security/authentication impact chỉ mô tả behavior đã chứng minh: unauthorized coupon application và usable unauthenticated Checkout coupon UI. Không claim account compromise, successful payment hoặc fraudulent order persistence.

## Screenshot and Trace Policy

- Screenshots bắt nguồn từ first actual failed Chromium execution; không rerun defect chỉ để capture evidence.
- Năm primary screenshots được promote sau human defect review và đều byte-identical với candidate source.
- `FR09-BUG-001` chọn TC-002 làm primary vì ảnh thể hiện trực tiếp wrong discount đồng thời hiển thị wrong final amount; TC-002/TC-003 candidate và original evidence đều được giữ nguyên.
- Không xóa sáu candidate screenshots tại `docs/defects/fr-09/candidate-screenshots/`.
- Firefox/WebKit original screenshots vẫn nằm trong run-specific `test-results/fr-09/<Run ID>/` directories.
- Tổng cộng 18 original failure screenshots và 18 traces được giữ nguyên.

## Isolation and Database Protection

- TC-010/TC-014/TC-015 dùng isolated backend/database fixture với `FR09_ISOLATED_DB=true`, exact isolated DB path và cleanup độc lập.
- `coupon_usage` trở về 0 sau mỗi browser run.
- Workspace `backend/database.sqlite` không được dùng cho stateful fixtures; final SHA-256 khớp baseline `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02`.
- Không có database record mới được tạo trong finalization phase này.

## HTML Reports

Rendered HTML reports cho Chromium, Firefox và WebKit đều `PASS_RENDERED`, hiển thị `FR-09`, `Run by: 23127107`, ISO timestamp, Run ID và browser identity. Original HTML reports không bị sửa trong finalization.

## Requirement Gaps

Bảy requirement gaps/deferred requirements vẫn được bảo toàn và không bị biến thành invented assertions:

1. Exact success/error UI copy.
2. Expiry timezone/exact timestamp boundary.
3. Fractional percent rounding.
4. Usage increment timing/transaction semantics.
5. Empty input, trimming và case sensitivity.
6. Coupon stacking/replacement/removal lifecycle.
7. Network recovery behavior.

Các gaps này không block 16 approved automation cases và không thay đổi năm confirmed defect classifications.

## Automation Review and Gaps

Automation review corrections đã được human-approved. Runtime execution giải quyết TC-012/TC-013 navigation/render risks; không còn automation defect hoặc evidence blocker. `docs/automation-reviews/fr-09-ai-review.md` và `docs/gaps/fr-09-automation-gaps.md` chứa finalization addenda, trong khi original static findings vẫn được giữ để trace lịch sử.

## GitHub Issue Publication

Năm GitHub Issue-ready drafts được tạo tại `docs/defects/fr-09/github-issues/`.

Publication Status: `NOT_PUBLISHED`.

Không có external GitHub Issue nào được tạo hoặc publish.

## Final Traceability Result

`PASS_WITH_OPEN_REQUIREMENT_GAPS` — 16 approved cases, 16 scripts, external JSON, eight assertion patterns, three-browser execution, HTML identity, isolated DB protection, 6 failed cases, 5 deduplicated defects, promoted screenshots, original traces và unpublished issue drafts đều trace được. Bảy documented requirement gaps vẫn mở nhưng không phải automation blockers.

## Browser Execution Performed During Finalization

`NO` — không chạy Playwright, không mở browser và không reproduce defect trong phase này.

## Current Checkpoint

`CHECKPOINT: FR09_FINAL_REVIEW_REQUIRED`
