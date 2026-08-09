# [HW04][BUG][FR-05][Product Listing] Home page có nhiều hơn một semantic h1

## Found by Test Case

`FR05-TC-014` — home document phải có đúng một semantic `h1`.

## Related Requirements

`FR05-R08` — home page có đúng một `<h1>` element.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Medium` |
| Priority | `P3` |
| Reason | Duplicate page-level heading làm suy giảm semantic structure và accessibility navigation, nhưng không chặn product browsing hoặc làm sai dữ liệu. |

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-05 — Product listing and search |
| Module | Product Listing |
| Browser(s) | Chromium, Firefox, WebKit |
| OS | `NOT_RECORDED_AT_EXECUTION` |
| Viewport | `NOT_RECORDED_AT_EXECUTION` |
| Zoom | `NOT_RECORDED_AT_EXECUTION` |
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:3000` |
| Dataset / Fixture | `FR05-SETUP-001` — public home page với verified non-empty seed catalog |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |
| Run IDs | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z`; `FR-05-firefox-2026-08-09T19-58-55-6329954Z`; `FR-05-webkit-2026-08-09T20-00-12-2824300Z` |

## Preconditions

Public home page mở ở normal non-empty catalog state.

## Steps to Reproduce

1. Mở public home page.
2. Chờ initial catalog render hoàn tất.
3. Đếm toàn bộ semantic `h1` element trong document.

## Expected Result

Home document chứa đúng một `h1` element.

## Actual Result

Document chứa `2` `h1` element: `Danh sách sản phẩm` và `Hiển thị 5 sản phẩm`.

## Reproducibility

`Always`

Lỗi được reproduce nhất quán trên ba approved final browser runs: Chromium, Firefox và WebKit đều FAILED với cùng count.

## Impact

Document outline có hơn một page-level heading, làm screen-reader navigation và semantic interpretation kém nhất quán.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z` | `docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-05-firefox-2026-08-09T19-58-55-6329954Z` | `docs/execution-results/fr-05-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-05-webkit-2026-08-09T20-00-12-2824300Z` | `docs/execution-results/fr-05-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-05/screenshots/FR05-BUG-005.png` cho thấy home page đã render. Screenshot đơn lẻ không đủ để chứng minh semantic heading count.

### Automation Evidence

- Objective semantic count và text: `docs/defects/fr-05/runtime-evidence.md` ghi nhận count `2`.
- So sánh ba browser: `docs/execution-results/fr-05-cross-browser-summary.md`.
- HTML reports: `html-reports/fr-05/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/`, `html-reports/fr-05/FR-05-firefox-2026-08-09T19-58-55-6329954Z/`, `html-reports/fr-05/FR-05-webkit-2026-08-09T20-00-12-2824300Z/`.

## Technical Observation

Rendered document có hai semantic `h1` element. Root cause chưa được điều tra độc lập.

## Discovery and Confirmation

Phân loại: `PRODUCT_DEFECT`. Lỗi được phát hiện ban đầu tại `FR-05-chromium-2026-08-09T19-14-10-0306495Z`; xác nhận cuối dùng corrected Chromium baseline cùng Firefox và WebKit.

## Recommended Next Step

Giữ một page-level `h1` và demote hoặc reclassify secondary product-count heading theo semantic structure đã được phê duyệt.

## Status

`OPEN`

## Hashtags

#HW04 #BUG #FR05 #ProductListing #SeverityMedium #PriorityP3 #Chromium #Firefox #WebKit #CrossBrowser #Accessibility #UI

## Suggested GitHub Labels

`bug`, `hw04`, `fr-05`, `severity:medium`, `priority:p3`, `accessibility`, `ui`, `cross-browser`
