# [HW04][BUG][FR-05][Product Listing] Giá sản phẩm hiển thị VND thay vì ký hiệu ₫

## Found by Test Case

`FR05-TC-005` — kiểm tra product price dùng ký hiệu đồng `₫`.

## Related Requirements

`FR05-R03B` — mỗi controlled product price phải hiển thị ký hiệu `₫`.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Medium` |
| Priority | `P2` |
| Reason | Định dạng currency đã phê duyệt bị sai trên toàn bộ price presentation được kiểm tra, có thể làm người dùng hiểu nhầm đơn vị tiền tệ. |

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
| Dataset / Fixture | `FR05-DATA-001` — approved seed catalog gồm năm product |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |
| Run IDs | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z`; `FR-05-firefox-2026-08-09T19-58-55-6329954Z`; `FR-05-webkit-2026-08-09T20-00-12-2824300Z` |

## Preconditions

Public home page khả dụng với approved seed catalog gồm năm product.

## Steps to Reproduce

1. Mở public home page.
2. Xác định product card `iPhone 15 Pro Max`.
3. Kiểm tra price text đang hiển thị.

## Expected Result

Mỗi controlled product price hiển thị ký hiệu đồng bắt buộc `₫`.

## Actual Result

Giá sản phẩm đang hiển thị là `30.000.000 VND`; ký hiệu bắt buộc `₫` không xuất hiện.

## Reproducibility

`Always`

Lỗi được reproduce nhất quán trên ba approved final browser runs: Chromium, Firefox và WebKit.

## Impact

Lỗi làm cách hiển thị đơn vị tiền tệ không nhất quán trên product listing và không đáp ứng requirement về định dạng giá.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z` | `docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-05-firefox-2026-08-09T19-58-55-6329954Z` | `docs/execution-results/fr-05-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-05-webkit-2026-08-09T20-00-12-2824300Z` | `docs/execution-results/fr-05-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-05/screenshots/FR05-BUG-002.png` hiển thị trực tiếp `30.000.000 VND`.

### Automation Evidence

- Runtime displayed value: `docs/defects/fr-05/runtime-evidence.md`.
- So sánh ba browser: `docs/execution-results/fr-05-cross-browser-summary.md`.
- HTML reports: `html-reports/fr-05/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/`, `html-reports/fr-05/FR-05-firefox-2026-08-09T19-58-55-6329954Z/`, `html-reports/fr-05/FR-05-webkit-2026-08-09T20-00-12-2824300Z/`.

## Technical Observation

Price text quan sát được dùng `VND` thay cho ký hiệu `₫` đã được phê duyệt. Root cause chưa được điều tra độc lập.

## Discovery and Confirmation

Phân loại: `PRODUCT_DEFECT`. Lỗi được phát hiện ban đầu tại `FR-05-chromium-2026-08-09T19-14-10-0306495Z`; xác nhận cuối dùng corrected Chromium baseline cùng Firefox và WebKit.

## Recommended Next Step

Cập nhật price presentation sang biểu diễn `₫` đã được phê duyệt, sau đó rerun price-symbol assertion.

## Status

`OPEN`

## Hashtags

#HW04 #BUG #FR05 #ProductListing #SeverityMedium #PriorityP2 #Chromium #Firefox #WebKit #CrossBrowser #Functional #UI

## Suggested GitHub Labels

`bug`, `hw04`, `fr-05`, `severity:medium`, `priority:p2`, `functional`, `ui`, `cross-browser`
