# [HW04][BUG][FR-05][Product Listing] Ảnh sản phẩm có thuộc tính alt rỗng

## Found by Test Case

`FR05-TC-004` — kiểm tra mỗi product image có `alt` không rỗng.

## Related Requirements

`FR05-R02C` — mỗi product image phải có thuộc tính `alt` tồn tại và không rỗng.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Medium` |
| Priority | `P2` |
| Reason | Lỗi ảnh hưởng đến accessibility của toàn bộ product image trong catalog đã kiểm tra, nhưng không gây mất dữ liệu hoặc thực thi code. |

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
3. Kiểm tra `img` của product card và giá trị thuộc tính `alt`.

## Expected Result

Mỗi controlled product image có thuộc tính `alt` với trimmed value không rỗng.

## Actual Result

Image tồn tại nhưng `alt` là empty string (`""`). Narrow runtime capture ghi nhận image count `1` và `alt=""`.

## Reproducibility

`Always`

Lỗi được reproduce nhất quán trên ba approved final browser runs: Chromium, Firefox và WebKit.

## Impact

Người dùng sử dụng screen reader không nhận được alternative text có ý nghĩa cho product image bị ảnh hưởng, làm vi phạm requirement về accessibility.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z` | `docs/execution-results/fr-05-chromium-rerun-after-tc006-fix.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-05-firefox-2026-08-09T19-58-55-6329954Z` | `docs/execution-results/fr-05-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-05-webkit-2026-08-09T20-00-12-2824300Z` | `docs/execution-results/fr-05-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-05/screenshots/FR05-BUG-001.png` hiển thị product card. Screenshot đơn lẻ không thể chứng minh giá trị `alt` vốn không hiển thị trực quan.

### Automation Evidence

- `docs/defects/fr-05/runtime-evidence.md` ghi nhận objective DOM value `alt=""`.
- So sánh ba browser: `docs/execution-results/fr-05-cross-browser-summary.md`.
- HTML reports: `html-reports/fr-05/FR-05-chromium-rerun-tc006-fix-2026-08-09T19-40-49-6875324Z/`, `html-reports/fr-05/FR-05-firefox-2026-08-09T19-58-55-6329954Z/`, `html-reports/fr-05/FR-05-webkit-2026-08-09T20-00-12-2824300Z/`.

## Technical Observation

UI output quan sát được có thuộc tính `alt` rỗng. Root cause chưa được điều tra độc lập.

## Discovery and Confirmation

Phân loại: `PRODUCT_DEFECT`. Lỗi được phát hiện ban đầu tại `FR-05-chromium-2026-08-09T19-14-10-0306495Z`; xác nhận cuối dùng corrected Chromium baseline cùng Firefox và WebKit.

## Recommended Next Step

Bổ sung alternative text có ý nghĩa, riêng cho từng sản phẩm, thông qua SUT accessibility fix đã được phê duyệt; sau đó rerun focused assertion.

## Status

`OPEN`

## Hashtags

#HW04 #BUG #FR05 #ProductListing #SeverityMedium #PriorityP2 #Chromium #Firefox #WebKit #CrossBrowser #Accessibility

## Suggested GitHub Labels

`bug`, `hw04`, `fr-05`, `severity:medium`, `priority:p2`, `accessibility`, `cross-browser`
