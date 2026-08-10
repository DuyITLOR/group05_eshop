# [HW04][BUG][FR-09][Discount Coupon] User chưa đăng nhập vẫn có thể apply coupon

## Found by Test Case

`FR09-TC-012` — kiểm tra coupon application khi không có valid JWT.

## Related Requirements

`FR09-R06` — coupon application yêu cầu valid JWT Token.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `High` |
| Priority | `P1` |
| Reason | Runtime chứng minh authentication boundary của coupon application bị bỏ qua trên cả ba browser. User chưa xác thực vẫn nhận applied coupon response/amounts; không suy diễn thêm về account compromise hoặc successful order placement ngoài evidence. |

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-09 — Discount coupons |
| Module | Checkout / Apply Coupon Authentication |
| Browser(s) | Chromium, Firefox, WebKit |
| Browser version(s) | `NOT_RECORDED_AT_EXECUTION` |
| OS / Viewport / Zoom | `NOT_RECORDED_AT_EXECUTION` |
| Frontend URL | `http://localhost:5173` |
| Backend URL | `http://localhost:3000` |
| Dataset / Fixture | `FR09-DATA-001` (`SAVE10`); `FR09-DATA-005` (seed cart total 4000000); fresh unauthenticated context |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |

## Preconditions

Fresh browser context không có JWT/user session; cart được tạo qua UI với seed product total 4000000; C1, C2, C3 và C5 otherwise valid.

## Steps to Reproduce

1. Mở fresh unauthenticated context và xác nhận không inject JWT.
2. Tạo cart total 4000000 qua Home UI.
3. Dùng same-document SPA navigation tới `/checkout` để giữ cart nhưng không tạo authentication state.
4. Nhập `SAVE10` và chọn Apply.
5. Quan sát coupon/final-total state.

## Expected Result

Coupon không được apply khi thiếu valid JWT; coupon discount/final amount không hiển thị và payable total giữ nguyên 4000000.

## Actual Result

Unauthenticated user apply `SAVE10` thành công và UI hiển thị coupon-derived discount/final amounts. Behavior tái hiện trên cả ba browser.

## Reproducibility

`Always` — Chromium, Firefox và WebKit đều reproduce.

## Impact

Coupon business operation có thể được gọi mà không qua required JWT authentication boundary. Evidence không chứng minh order completion hoặc coupon usage persistence, nhưng đã chứng minh unauthorized coupon calculation/application response.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `docs/execution-results/fr-09-chromium-execution.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` | `docs/execution-results/fr-09-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` | `docs/execution-results/fr-09-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-09/screenshots/FR09-BUG-003.png` được promote byte-for-byte từ Chromium candidate `FR09-TC-012`, Run ID `FR-09-chromium-2026-08-09T22-35-59-4764573Z`. Header hiển thị unauthenticated state trong khi coupon đã được apply.

### Automation Evidence

- Cross-browser matrix: `docs/execution-results/fr-09-cross-browser-summary.md`.
- TC-012 original screenshots và traces được liên kết trong ba browser execution records.
- Runtime setup xác nhận fresh context, không JWT, cart/Checkout setup thành công trước assertion.

## Technical Observation

Source inspection ghi nhận `POST /api/apply-coupon` không gắn `authenticateToken`; request body nhận optional `user_id`, và frontend gửi `user?.id || null`. Observation phù hợp với runtime behavior nhưng không mở rộng impact ngoài coupon application đã kiểm chứng.

## Discovery and Confirmation

Chromium first run chuyển TC-012 từ `NEEDS_MORE_EVIDENCE` thành product-defect candidate sau khi setup gate thành công. Firefox/WebKit reproduce cùng behavior; human review xác nhận final `PRODUCT_DEFECT` mapping `FR09-BUG-003`.

## Recommended Next Step

Bắt buộc JWT middleware cho apply-coupon, derive user identity từ verified token thay vì client-supplied/nullable identity, thêm API authorization tests và rerun TC-012 trên ba browser.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR09 #DiscountCoupon #SeverityHigh #PriorityP1 #Chromium #Firefox #WebKit #CrossBrowser #Security #Authentication

## Suggested GitHub Labels

`bug`, `hw04`, `fr-09`, `severity:high`, `priority:p1`, `security`, `authentication`, `cross-browser`
