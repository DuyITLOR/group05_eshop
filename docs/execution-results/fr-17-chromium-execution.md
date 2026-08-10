# FR-17 Chromium Execution — Coupon management

## Saved Raw Execution Outcome

| Field | Value |
| --- | --- |
| Execution Status | `COMPLETED_WITH_TEST_FAILURES` |
| Browser | `chromium` |
| Run ID | `fr17-chromium-20260810T084402107+0700` |
| Run Timestamp | `2026-08-10T08:44:02.1034866+07:00` |
| Completed At | `2026-08-10T08:44:28.9745977+07:00` |
| Playwright Duration | `26.2s` |
| Total | `16` |
| Passed | `13` |
| Failed | `3` |
| Skipped | `0` |
| Failed Test Case IDs | `FR17-TC-002`, `FR17-TC-003`, `FR17-TC-016` |
| HTML Report Directory | `html-reports/fr-17/fr17-chromium-20260810T084402107+0700/` |
| Playwright Result Directory | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/` |
| Raw Stdout | `.runtime/fr-17/execution-logs/fr17-chromium-20260810T084402107+0700.stdout.log` |
| Raw Stderr | `.runtime/fr-17/execution-logs/fr17-chromium-20260810T084402107+0700.stderr.log` — `0` bytes |
| Retry Policy | `0` |
| Video | `off` |

Raw outcome was saved immediately after the browser command completed and before detailed failure triage.

## Original Failure Evidence

| Test Case ID | Screenshot | Trace | Error Context |
| --- | --- | --- | --- |
| `FR17-TC-002` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-6a3de-ssociated-visible-indicator-chromium/test-failed-1.png` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-6a3de-ssociated-visible-indicator-chromium/trace.zip` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-6a3de-ssociated-visible-indicator-chromium/error-context.md` |
| `FR17-TC-003` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-91387-ates-a-valid-percent-coupon-chromium/test-failed-1.png` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-91387-ates-a-valid-percent-coupon-chromium/trace.zip` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-91387-ates-a-valid-percent-coupon-chromium/error-context.md` |
| `FR17-TC-016` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-16fc0--Coupon-Management-controls-chromium/test-failed-1.png` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-16fc0--Coupon-Management-controls-chromium/trace.zip` | `test-results/fr-17/fr17-chromium-20260810T084402107+0700/fr-17-fr-17-FR-17---Coupon-16fc0--Coupon-Management-controls-chromium/error-context.md` |

## Immediate Demo Record

| Field | Result |
| --- | --- |
| TC-004 Setup | `PASS` |
| TC-004 Primary Assertion | `PASS` |
| TC-004 Cleanup | `PASS` |
| TC-004 Overall | `PASS` |
| Corrected `getCouponRow` Path Exercised | `YES` |
| DEMO_FIX Browser Status | `DEMO_FIX_RUNTIME_VERIFIED_CHROMIUM` |

## Failure Triage

| Test Case ID | Failure Phase | Expected Result | Observed Runtime Behavior | Assertion / Error | Screenshot | Trace | Classification | Confidence | Reasoning |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `FR17-TC-002` | Primary UI requirement assertion | Sáu required field labels có visible `*` indicator. | Coupon Management và form được mở; field `code` được resolve đúng qua approved placeholder, association logic chạy nhưng không tìm thấy visible associated label/labelled element chứa `*`. Screenshot cũng cho thấy form dùng placeholder và không hiển thị required indicator. | `Required field code must have a visible associated label or labelled element containing *`; expected `true`, received `false`. | Original TC-002 path ở trên; derivative candidate: `docs/defects/fr-17/candidate-screenshots/FR17-TC-002.png`. | Original TC-002 trace path ở trên. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | Admin setup, target form và field identity đều hợp lệ; failure trực tiếp phản ánh approved FR17-R16. Một missing indicator đủ làm Expected Result “cả sáu” fail. |
| `FR17-TC-003` | Post-create row assertion | Exactly one owned percent coupon; correct code, `type=percent` và `discount_value=10` observable. | Baseline/setup pass, owned code absent ban đầu, POST create success, corrected `getCouponRow` tìm đúng row; code, type và `10%` xuất hiện. Helper sau đó đòi min-order text `100.000 ₫` trong khi row hiển thị `100,000 ₫`; `finally` cleanup thành công. | `getByText('100.000 ₫', { exact: true })` not found. | Original TC-003 screenshot path ở trên; không copy vào product-candidate directory. | Original TC-003 trace path ở trên. | `AUTOMATION_DEFECT` | `HIGH` | `Number(...).toLocaleString()` phụ thuộc Node host locale, còn SUT dùng comma grouping. Assertion min-order này không thuộc primary approved Expected Result của TC-003 và gây false failure sau khi required code/type/discount behavior đã thành công. Không sửa hoặc rerun trong phase này. |
| `FR17-TC-016` | Authorization surface assertion | Valid non-admin JWT không được cấp usable coupon list/create/delete controls. | Fresh page nhận JWT từ login đã runtime-verify `role != admin`; Admin shell vẫn render và sidebar chứa clickable `Mã Giảm Giá` control với count `1`. | `getByText('Mã Giảm Giá', { exact: true })`; expected count `0`, received `1`. | Original TC-016 path ở trên; derivative candidate: `docs/defects/fr-17/candidate-screenshots/FR17-TC-016.png`. | Original TC-016 trace path ở trên. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | Non-admin identity check chạy trước khi token được cài vào fresh page; không có Admin-token setup. Runtime UI cấp Coupon Management control trái approved FR17-R15; exact redirect/copy không bị giả định. |

### Classification Summary

| Classification | Test Case IDs |
| --- | --- |
| `PRODUCT_DEFECT_CANDIDATE` | `FR17-TC-002`, `FR17-TC-016` |
| `AUTOMATION_DEFECT` | `FR17-TC-003` |
| `NEEDS_MORE_EVIDENCE` | None |
| `ENVIRONMENT_FAILURE` | None |

Vì Chromium có `AUTOMATION_DEFECT`, adaptive execution gate chặn Firefox và WebKit. Test code không được sửa và Chromium không được rerun trong phase này.

## Database and Report Gates

| Gate | Result |
| --- | --- |
| Isolated DB Count | `PASS` — `4` |
| Exact Seed Code Set | `PASS` — `BIGBUY`, `EXPIRED`, `SAVE10`, `VIP100` |
| FR17-Owned Residue | `0` |
| Workspace DB SHA-256 | `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` |
| Workspace DB Protection | `PASS` |
| Isolated Backend Health | `PASS` — HTTP `200`, PID `34940` |
| HTML Report Verification | `PASS_RENDERED` — visible `FR-17`, `Run by: 23127107`, ISO timestamp, Run ID and `chromium` identity |
| Original Failure Screenshots | `3` preserved |
| Original Traces | `3` preserved |
| Product Candidate Copies | `2`, SHA-256 byte-identical |

## Adaptive Execution Decision

| Field | Value |
| --- | --- |
| Firefox | `NOT_EXECUTED_BLOCKED_BY_CHROMIUM_AUTOMATION_DEFECT` |
| WebKit | `NOT_EXECUTED_BLOCKED_BY_CHROMIUM_AUTOMATION_DEFECT` |
| Current Checkpoint | `CHECKPOINT: FR17_CHROMIUM_AUTOMATION_REVIEW_REQUIRED` |

## Pre-Execution Launcher Diagnostic

Launcher attempt ID `fr17-chromium-20260810T084305470+0700` failed before Playwright/browser startup with Windows `spawnSync npx.cmd EINVAL`. It created no HTML/result directory and is excluded from browser-run metrics. The runtime-only launcher was corrected to invoke the installed Playwright CLI through `node.exe`; this infrastructure diagnostic did not alter test code or SUT.
