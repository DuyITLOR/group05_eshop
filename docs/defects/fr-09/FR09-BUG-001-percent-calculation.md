# [HW04][BUG][FR-09][Discount Coupon] Percent coupon tính sai discount và final amount

## Found by Test Case

- `FR09-TC-002` — kiểm tra percent `discount_amount`.
- `FR09-TC-003` — kiểm tra percent `final_amount` và checkout payable total.

Hai test case kiểm tra hai hậu quả độc lập của cùng một lỗi tính percent coupon.

## Related Requirements

- `FR09-R08` — với coupon type `percent`, `discount_amount = total × discount_value / 100`.
- `FR09-R10` — sau khi apply valid coupon, `final_amount = total - discount_amount`.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `High` |
| Priority | `P1` |
| Reason | Lỗi làm sai trực tiếp số tiền giảm và số tiền phải trả. Với total 4000000 và `SAVE10`, UI trả về magnitude 36000000/40000000 thay vì 400000/3600000, gây rủi ro nghiêm trọng cho tính toàn vẹn tài chính của Checkout. |

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-09 — Discount coupons |
| Module | Checkout / Discount Coupon |
| Browser(s) | Chromium, Firefox, WebKit |
| Browser version(s) | `NOT_RECORDED_AT_EXECUTION` |
| OS / Viewport / Zoom | `NOT_RECORDED_AT_EXECUTION` |
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:3000` |
| Dataset / Fixture | `FR09-DATA-001` (`SAVE10`, 10%); `FR09-DATA-005` (seed cart total 4000000) |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |

## Preconditions

Authenticated customer có valid JWT; cart chứa một `Bàn phím cơ Keychron Q1` với total 4000000; `SAVE10` tồn tại, active, chưa hết hạn, đạt minimum và user chưa vượt usage limit.

## Steps to Reproduce

1. Mở Checkout từ cart total 4000000 trong authenticated session.
2. Nhập coupon code `SAVE10`.
3. Chọn Apply.
4. Quan sát displayed discount, final amount và checkout payable total.

## Expected Result

`discount_amount = 4000000 × 10 / 100 = 400000`.

`final_amount = 4000000 - 400000 = 3600000`; checkout payable total cũng bằng 3600000.

## Actual Result

Coupon được báo apply thành công nhưng UI hiển thị `Tiết kiệm: -36,000,000 đ`, `Thành tiền: 40,000,000 đ` và `Tổng thanh toán: 40,000,000 đ`.

## Reproducibility

`Always` — cùng failure được reproduce trên Chromium, Firefox và WebKit.

## Impact

Khách hàng nhận sai discount và payable total. Lỗi làm mất tính đúng đắn của coupon calculation và có thể dẫn đến số tiền Checkout sai nếu luồng thanh toán tiếp tục.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `docs/execution-results/fr-09-chromium-execution.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` | `docs/execution-results/fr-09-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` | `docs/execution-results/fr-09-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-09/screenshots/FR09-BUG-001.png` được promote byte-for-byte từ Chromium candidate `FR09-TC-002`, Run ID `FR-09-chromium-2026-08-09T22-35-59-4764573Z`. Ảnh hiển thị đồng thời wrong discount và wrong final/payable amounts. Candidate và original screenshots của cả TC-002/TC-003 vẫn được giữ nguyên.

### Automation Evidence

- Cross-browser matrix: `docs/execution-results/fr-09-cross-browser-summary.md`.
- Ba execution records ở bảng trên liên kết original screenshots và traces cho `FR09-TC-002`/`FR09-TC-003`.
- HTML reports: `html-reports/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/`, `html-reports/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/`, `html-reports/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/`; mỗi report đã được render và verify identity.

## Technical Observation

Runtime xác nhận response/UI amounts sai. Source inspection tại `backend/server.js` ghi nhận percent branch dùng `total_amount * (1 - discount_value)` thay vì chia `discount_value` cho 100; đây là implementation observation hỗ trợ root-cause investigation, không thay thế runtime evidence.

## Discovery and Confirmation

Lỗi được phát hiện trong Chromium first run qua hai atomic assertions và được xác nhận lại trên Firefox/WebKit. Human review đã deduplicate hai failed Test Case IDs thành một underlying defect `FR09-BUG-001`.

## Recommended Next Step

Sửa percent calculation theo authoritative formulas, bổ sung unit/API coverage cho `discount_amount` và `final_amount`, sau đó rerun hai focused Playwright cases trên ba browser.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR09 #DiscountCoupon #SeverityHigh #PriorityP1 #Chromium #Firefox #WebKit #CrossBrowser #Functional #DataIntegrity

## Suggested GitHub Labels

`bug`, `hw04`, `fr-09`, `severity:high`, `priority:p1`, `functional`, `data-integrity`, `cross-browser`
