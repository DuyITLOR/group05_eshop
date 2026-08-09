# [HW04][BUG][FR-05][Product Listing] Search input render HTML markup thay vì literal text

## Found by Test Case

`FR05-TC-011` — formatting markup trong search input phải được giữ là literal text.

## Related Requirements

`FR05-R05`; `SEC-04` — reflected user input phải được render như safe text, không tạo input-derived markup.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Medium` |
| Priority | `P2` |
| Reason | Reflected user input làm thay đổi UI thay vì hiển thị literal text, vi phạm safe-rendering boundary đã xác nhận; test case này không chứng minh execution. |

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
| Dataset / Fixture | `FR05-DATA-005` với `FR05-SETUP-002` controlled empty `GET /api/products` search response |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |
| Run IDs | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z`; `FR-05-firefox-2026-08-09T19-58-55-6329954Z`; `FR-05-webkit-2026-08-09T20-00-12-2824300Z` |

## Preconditions

Public home page khả dụng; controlled search response là empty product array.

## Steps to Reproduce

1. Mở public home page.
2. Submit exact keyword `<b>FR05 HTML Keyword</b>`.
3. Kiểm tra scoped reflected-keyword region và các descendant.

## Expected Result

Input được hiển thị như safe literal text, không tạo input-derived `b` element và không làm keyword bold do submitted HTML.

## Actual Result

Visible text là `Kết quả tìm kiếm cho: FR05 HTML Keyword`, nhưng scoped region chứa một `b` element. Submitted markup đã được interpreted.

## Reproducibility

`Always`

Lỗi được reproduce nhất quán trên ba approved final browser runs: Chromium, Firefox và WebKit.

## Impact

User-controlled content có thể thay đổi presentation của reflected search keyword, làm vi phạm safe text rendering và `SEC-04` boundary.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z` | `docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-05-firefox-2026-08-09T19-58-55-6329954Z` | `docs/execution-results/fr-05-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-05-webkit-2026-08-09T20-00-12-2824300Z` | `docs/execution-results/fr-05-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-05/screenshots/FR05-BUG-003.png` cho thấy reflected keyword được render bold. Screenshot hỗ trợ quan sát trực quan; runtime DOM evidence chứng minh input-derived `b` element.

### Automation Evidence

- `docs/defects/fr-05/runtime-evidence.md` ghi nhận input-derived `b` element count `1`.
- So sánh ba browser: `docs/execution-results/fr-05-cross-browser-summary.md`.
- HTML reports: `html-reports/fr-05/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/`, `html-reports/fr-05/FR-05-firefox-2026-08-09T19-58-55-6329954Z/`, `html-reports/fr-05/FR-05-webkit-2026-08-09T20-00-12-2824300Z/`.

## Technical Observation

Reflected formatting payload được interpreted thành DOM markup. Root cause chưa được điều tra độc lập.

## Discovery and Confirmation

Phân loại: `PRODUCT_DEFECT`. Lỗi được phát hiện ban đầu tại `FR-05-chromium-2026-08-09T19-14-10-0306495Z`; xác nhận cuối dùng corrected Chromium baseline cùng Firefox và WebKit.

## Recommended Next Step

Render reflected user input thành literal text theo safe-rendering boundary đã phê duyệt, sau đó rerun `FR05-TC-011` và `FR05-TC-012`.

## Status

`OPEN`

## Hashtags

#HW04 #BUG #FR05 #ProductListing #SeverityMedium #PriorityP2 #Chromium #Firefox #WebKit #CrossBrowser #Security #Validation

## Suggested GitHub Labels

`bug`, `hw04`, `fr-05`, `severity:medium`, `priority:p2`, `security`, `validation`, `cross-browser`
