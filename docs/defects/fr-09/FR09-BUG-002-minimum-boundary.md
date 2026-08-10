# [HW04][BUG][FR-09][Discount Coupon] Coupon bị từ chối khi total bằng minimum amount

## Found by Test Case

`FR09-TC-006` — kiểm tra inclusive boundary `total = min_order_amount`.

## Related Requirements

`FR09-R05` — coupon valid khi `total >= min_order_amount`.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Medium` |
| Priority | `P2` |
| Reason | Lỗi từ chối khách hàng đủ điều kiện đúng tại business boundary. Phạm vi quan sát được giới hạn ở exact-minimum orders; không có mất dữ liệu hoặc security impact được chứng minh. |

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-09 — Discount coupons |
| Module | Checkout / Discount Coupon Validation |
| Browser(s) | Chromium, Firefox, WebKit |
| Browser version(s) | `NOT_RECORDED_AT_EXECUTION` |
| OS / Viewport / Zoom | `NOT_RECORDED_AT_EXECUTION` |
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:3000` |
| Dataset / Fixture | `FR09-DATA-001` (`SAVE10`, minimum 300000); `FR09-DATA-007` (controlled cart total 300000) |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |

## Preconditions

Authenticated customer có valid JWT; `SAVE10` active/chưa hết hạn, usage condition valid; controlled frontend cart đạt exact total 300000 mà không tạo product/database record.

## Steps to Reproduce

1. Mở Checkout với controlled cart total 300000.
2. Nhập `SAVE10` có `min_order_amount = 300000`.
3. Chọn Apply.
4. Quan sát application state và displayed amounts.

## Expected Result

Coupon được chấp nhận vì `300000 >= 300000`; discount bằng 30000 và final amount bằng 270000.

## Actual Result

Coupon bị từ chối. UI hiển thị minimum-order error dù displayed cart total bằng đúng 300000; payable total vẫn là 300000.

## Reproducibility

`Always` — reproduce nhất quán trên Chromium, Firefox và WebKit.

## Impact

Khách hàng có order đạt đúng minimum requirement không nhận được discount hợp lệ, tạo sai khác giữa business rule đã công bố và Checkout behavior.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `docs/execution-results/fr-09-chromium-execution.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` | `docs/execution-results/fr-09-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` | `docs/execution-results/fr-09-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-09/screenshots/FR09-BUG-002.png` được promote byte-for-byte từ Chromium candidate `FR09-TC-006`, Run ID `FR-09-chromium-2026-08-09T22-35-59-4764573Z`.

### Automation Evidence

- Cross-browser matrix: `docs/execution-results/fr-09-cross-browser-summary.md`.
- Execution records liên kết original screenshots/traces cho TC-006 trên từng browser.
- Controlled fixture source: `test-data/fr-09.json`, `FR09-DATA-007`; không mutate database.

## Technical Observation

Runtime chứng minh exact-minimum request bị từ chối. Source inspection tại `backend/server.js` ghi nhận comparison `total_amount > coupon.min_order_amount`; observation này hỗ trợ root-cause hypothesis vì authoritative boundary là `>=`.

## Discovery and Confirmation

Phát hiện trong Chromium first run và xác nhận cùng outcome trên Firefox/WebKit. Human review xác nhận classification `PRODUCT_DEFECT` và mapping `FR09-BUG-002`.

## Recommended Next Step

Điều chỉnh minimum eligibility thành inclusive boundary, bổ sung backend boundary tests cho just-below/equal/just-above, rồi rerun TC-006 trên ba browser.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR09 #DiscountCoupon #SeverityMedium #PriorityP2 #Chromium #Firefox #WebKit #CrossBrowser #Functional #Validation

## Suggested GitHub Labels

`bug`, `hw04`, `fr-09`, `severity:medium`, `priority:p2`, `functional`, `validation`, `cross-browser`
