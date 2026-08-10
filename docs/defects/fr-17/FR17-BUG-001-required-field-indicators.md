# [HW04][BUG][FR-17][Coupon Management] Required coupon fields không hiển thị ký hiệu *

## Found by Test Case

`FR17-TC-002` — xác nhận cả sáu required coupon fields có visible `*` indicator bên cạnh field label.

## Related Requirements

`FR17-R16` — mỗi required coupon field phải có ký hiệu `*` hiển thị bên cạnh nhãn.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Low` |
| Priority | `P3` |
| Reason | Thiếu required indicator làm giảm khả năng nhận biết trường bắt buộc và không đáp ứng UI requirement, nhưng runtime evidence không cho thấy create flow bị chặn hoặc dữ liệu bị sai. |

## Reason

Đây là discrepancy trực tiếp giữa approved UI requirement và form thực tế, được reproduce ổn định trên cả ba browser engines.

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-17 — Coupon management |
| Module | Web Admin — Coupon Management form |
| Frontend URL | `http://localhost:5174` |
| Backend URL | `http://localhost:3000` |
| Browser(s) | Chromium, Firefox, WebKit |
| Browser version(s) | `NOT_RECORDED` |
| OS build / Device / Viewport / Zoom | `NOT_RECORDED` |
| Dataset | `FR17-DATA-002` — six required field identities |
| Execution Date | `2026-08-10` |
| SUT Commit | `NOT_RECORDED` |

## Preconditions

Valid admin session; Coupon Management create form được mở thành công.

## Steps to Reproduce

1. Đăng nhập Web Admin bằng valid admin account.
2. Mở `Mã Giảm Giá` / Coupon Management.
3. Quan sát các field `code`, `type`, `discount_value`, `expired_at`, `min_order_amount`, `max_uses_per_user`.
4. Kiểm tra visible `*` indicator gắn với từng field label.

## Expected Result

Cả sáu required field labels đều có visible `*` indicator bên cạnh.

## Actual Result

Form không hiển thị visible associated label/labelled element có `*`; assertion dừng tại field `code` vì indicator yêu cầu không tồn tại.

## Reproducibility

`Always in final runs` — reproduce trên Chromium, Firefox và WebKit.

## Impact

Admin không được cung cấp visual cue rõ ràng về các field bắt buộc; ảnh hưởng UI clarity và accessibility/usability, nhưng không có evidence rằng thao tác create bị vô hiệu hoàn toàn.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAIL` — reproduced | `fr17-chromium-corrected-20260810T092053847+0700` | `docs/execution-results/fr-17-chromium-corrected-execution.md` |
| Firefox | `FAIL` — reproduced | `fr17-firefox-20260810T092258944+0700` | `docs/execution-results/fr-17-firefox-execution.md` |
| WebKit | `FAIL` — reproduced | `fr17-webkit-20260810T092419436+0700` | `docs/execution-results/fr-17-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-17/screenshots/FR17-BUG-001.png` — promoted byte-identically từ preserved first A-018 Chromium candidate của `FR17-TC-002`; SHA-256 `958F9599E25418F7FA0416301B917955D24620BE7EB51EAB4CF784FA7EE631B8`.

### Automation Evidence

- Historical first capture: Run ID `fr17-chromium-20260810T084402107+0700`.
- Final corrected Chromium, Firefox và WebKit execution records liên kết original screenshots, traces và assertion failures.
- Cross-browser matrix: `docs/execution-results/fr-17-cross-browser-summary.md`.

## Technical Observation

Source inspection cho thấy Coupon Management form render `input`/`select` dựa trên placeholders và không render field labels hoặc `*` indicators. Runtime evidence, không phải source inspection đơn lẻ, xác nhận requirement failure trên ba engines.

## Discovery and Confirmation

Phát hiện ban đầu trong A-018 Chromium run; reproduce trong final corrected Chromium, Firefox và WebKit. A-020 human review chấp nhận `FR17-TC-002` là `PRODUCT_DEFECT_CANDIDATE` với cross-browser coverage.

## Recommended Next Step

Thêm visible label cho từng required field, đặt `*` bên cạnh label và duy trì programmatic association phù hợp. Rerun `FR17-TC-002` trên cả ba engines sau fix.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR17 #CouponManagement #SeverityLow #PriorityP3 #Chromium #Firefox #WebKit #CrossBrowser #UI #Accessibility

## Suggested GitHub Labels

`bug`, `hw04`, `fr-17`, `severity:low`, `priority:p3`, `coupon-management`, `ui`, `accessibility`, `cross-browser`
