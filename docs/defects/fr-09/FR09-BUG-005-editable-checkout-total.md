# [HW04][BUG][FR-09][Discount Coupon] Checkout total có thể chỉnh sửa trực tiếp

## Found by Test Case

`FR09-TC-016` — kiểm tra Checkout total được derive từ cart và không user-editable.

## Related Requirements

`FR09-R12` — Checkout total được tính tự động từ cart và user không chỉnh trực tiếp; coupon evaluation phải dùng trusted total context.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `High` |
| Priority | `P1` |
| Reason | Runtime chứng minh financial input quan trọng có thể bị user sửa trực tiếp và source inspection cho thấy value này được dùng cho coupon/checkout requests. Chưa có evidence về completed fraudulent order, nhưng trusted-total boundary đã bị phá vỡ. |

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-09 — Discount coupons |
| Module | Checkout Total / Coupon Context |
| Browser(s) | Chromium, Firefox, WebKit |
| Browser version(s) | `NOT_RECORDED_AT_EXECUTION` |
| OS / Viewport / Zoom | `NOT_RECORDED_AT_EXECUTION` |
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:3000` |
| Dataset / Fixture | `FR09-DATA-005` — seed product/cart total 4000000 |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |

## Preconditions

Authenticated session; cart chứa một `Bàn phím cơ Keychron Q1`, quantity 1, derived total 4000000; Checkout mở thành công.

## Steps to Reproduce

1. Add seed product vào cart và đi đến Checkout.
2. Xác nhận displayed total ban đầu bằng 4000000.
3. Focus Checkout total control.
4. Thử nhập một value khác trực tiếp.
5. Quan sát control state/value.

## Expected Result

Checkout total bằng 4000000 được derive từ cart và không thể bị user chỉnh trực tiếp; coupon evaluation context tiếp tục dùng trusted total.

## Actual Result

Checkout total được render bằng editable number input và chấp nhận user-entered value trên Chromium, Firefox và WebKit.

## Reproducibility

`Always` — reproduce nhất quán trên ba browser.

## Impact

User có thể điều khiển value dùng làm coupon total/Checkout amount ở client, tạo data-integrity risk cho eligibility và calculation. Report không khẳng định backend đã persist một fraudulent order vì test không complete Checkout.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `docs/execution-results/fr-09-chromium-execution.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` | `docs/execution-results/fr-09-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` | `docs/execution-results/fr-09-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-09/screenshots/FR09-BUG-005.png` được promote byte-for-byte từ Chromium candidate `FR09-TC-016`, Run ID `FR-09-chromium-2026-08-09T22-35-59-4764573Z`. Screenshot cho thấy total input; editability được chứng minh bởi Playwright interaction/assertion và trace.

### Automation Evidence

- Cross-browser matrix: `docs/execution-results/fr-09-cross-browser-summary.md`.
- TC-016 original screenshots/traces được liên kết trong ba browser execution records.
- Numeric oracle xác nhận cart-derived/payable total ban đầu là 4000000 trước editability assertion.

## Technical Observation

Source inspection ghi nhận `editableTotal` state được bind vào `<input type="number">` có `onChange`; value này được gửi làm `total_amount` cho apply-coupon và được dùng trong Checkout request path. Runtime chỉ xác nhận user-editability, không thực hiện order completion.

## Discovery and Confirmation

Phát hiện trên Chromium và reproduce trên Firefox/WebKit với cùng trusted seed total. Human review xác nhận đây là `PRODUCT_DEFECT` `FR09-BUG-005`.

## Recommended Next Step

Không cho client chỉnh derived total; server phải recompute/validate total từ trusted cart/product data trước coupon eligibility và Checkout. Sau fix, rerun TC-016 và related calculation cases.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR09 #DiscountCoupon #SeverityHigh #PriorityP1 #Chromium #Firefox #WebKit #CrossBrowser #Functional #Validation #DataIntegrity #UI

## Suggested GitHub Labels

`bug`, `hw04`, `fr-09`, `severity:high`, `priority:p1`, `functional`, `validation`, `data-integrity`, `ui`, `cross-browser`
