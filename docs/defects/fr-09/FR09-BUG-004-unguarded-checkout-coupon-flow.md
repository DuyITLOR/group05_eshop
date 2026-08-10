# [HW04][BUG][FR-09][Discount Coupon] User chưa đăng nhập vẫn sử dụng được Checkout coupon flow

## Found by Test Case

`FR09-TC-013` — kiểm tra unauthenticated direct Checkout access và usability của coupon controls.

## Related Requirements

`FR09-R11` — chỉ authenticated user được tiến hành Checkout.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Medium` |
| Priority | `P2` |
| Reason | Unauthenticated user truy cập được Checkout UI và functional coupon controls, vi phạm access-control prerequisite. Runtime chưa chứng minh successful payment/order creation nên severity không được nâng quá phạm vi evidence. |

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-09 — Discount coupons |
| Module | Checkout UI Access Control |
| Browser(s) | Chromium, Firefox, WebKit |
| Browser version(s) | `NOT_RECORDED_AT_EXECUTION` |
| OS / Viewport / Zoom | `NOT_RECORDED_AT_EXECUTION` |
| Frontend URL | `http://localhost:5173/checkout` |
| Backend URL | `http://localhost:3000` |
| Dataset / Fixture | Fresh unauthenticated context; không có business test data |
| Execution Date | 2026-08-09 |
| SUT Commit | `NOT_RECORDED_AT_EXECUTION` |

## Preconditions

Fresh browser context không có JWT hoặc user session.

## Steps to Reproduce

1. Truy cập trực tiếp `/checkout` trong fresh unauthenticated context.
2. Chờ deterministic EShop shell và `main` render gate.
3. Quan sát coupon input và Apply action.
4. Nhập coupon code để kiểm tra controls có usable hay không.

## Expected Result

Unauthenticated user không được tiến hành Checkout; functional coupon application UI không usable. Requirement không bắt buộc một redirect URL hoặc denial message cụ thể.

## Actual Result

Checkout page render hoàn chỉnh cho unauthenticated user. Coupon input visible và Apply action trở nên enabled sau khi nhập code, nên functional coupon flow vẫn usable.

## Reproducibility

`Always` — cùng behavior trên Chromium, Firefox và WebKit.

## Impact

Checkout/UI access-control boundary không được thực thi, làm lộ functional coupon workflow cho unauthenticated users. Lỗi này độc lập với API/JWT defect `FR09-BUG-003`.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAILED` — `PRODUCT_DEFECT` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `docs/execution-results/fr-09-chromium-execution.md` |
| Firefox | `FAILED` — `PRODUCT_DEFECT` | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` | `docs/execution-results/fr-09-firefox-execution.md` |
| WebKit | `FAILED` — `PRODUCT_DEFECT` | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` | `docs/execution-results/fr-09-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-09/screenshots/FR09-BUG-004.png` được promote byte-for-byte từ Chromium candidate `FR09-TC-013`, Run ID `FR-09-chromium-2026-08-09T22-35-59-4764573Z`; header hiển thị unauthenticated state và Checkout coupon controls.

### Automation Evidence

- Cross-browser matrix: `docs/execution-results/fr-09-cross-browser-summary.md`.
- TC-013 original screenshots và traces được liên kết trong từng browser execution record.
- Web-first shell/`main` gate đã pass trước khi kiểm tra control usability.

## Technical Observation

Source inspection ghi nhận route `/checkout` render trực tiếp `Checkout` component; authentication check chỉ nằm trong normal Cart button handler. Runtime evidence xác nhận direct route vẫn cung cấp usable coupon controls.

## Discovery and Confirmation

TC-013 ban đầu cần runtime evidence để phân biệt timing/setup defect. Sau khi render gate pass trên ba engines và controls vẫn usable, human review xác nhận `PRODUCT_DEFECT` độc lập với coupon API authentication.

## Recommended Next Step

Bổ sung route-level access guard hoặc conforming denial mechanism cho Checkout, đồng thời bảo vệ API độc lập; sau đó rerun direct-route TC-013 trên ba browser.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR09 #DiscountCoupon #SeverityMedium #PriorityP2 #Chromium #Firefox #WebKit #CrossBrowser #Security #Authorization #UI

## Suggested GitHub Labels

`bug`, `hw04`, `fr-09`, `severity:medium`, `priority:p2`, `security`, `authorization`, `ui`, `cross-browser`
