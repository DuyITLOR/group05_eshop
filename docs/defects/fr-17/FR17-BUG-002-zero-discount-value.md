# [HW04][BUG][FR-17][Coupon Management] Chromium chấp nhận coupon có discount_value bằng 0

## Found by Test Case

`FR17-TC-008` — kiểm tra exact invalid lower boundary `discount_value=0` bị reject.

## Related Requirements

`FR17-R08` — `discount_value > 0`.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Medium` |
| Priority | `P2` |
| Reason | Chromium final run quan sát invalid coupon record được tạo, làm sai validation/data-integrity rule của Coupon Management. Firefox và WebKit pass, nên phạm vi hiện tại chỉ là Chromium-specific observed behavior. |

## Reason

Approved boundary oracle yêu cầu code không xuất hiện và list count không tăng. Corrected Chromium quan sát exact owned-code row xuất hiện sau submit với `discount_value=0`.

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-17 — Coupon management |
| Module | Web Admin — Coupon create validation |
| Frontend URL | `http://localhost:5174` |
| Backend URL | `http://localhost:3000` |
| Browser(s) tested | Chromium, Firefox, WebKit |
| Browser version(s) | `NOT_RECORDED` |
| OS build / Device / Viewport / Zoom | `NOT_RECORDED` |
| Dataset | `FR17-DATA-008` — `discountValue=0`, all other fields valid |
| Execution Date | `2026-08-10` |
| SUT Commit | `NOT_RECORDED` |

## Preconditions

Valid admin session; isolated DB ở exact four-seed baseline; runtime-derived unique controlled code chưa tồn tại.

## Steps to Reproduce

1. Mở Coupon Management bằng valid admin session.
2. Điền external dataset `FR17-DATA-008`, gồm `discount_value=0` và các field còn lại hợp lệ.
3. Submit create form.
4. Quan sát list count và exact owned-code row.

## Expected Result

Coupon bị reject; controlled code không xuất hiện và list count không tăng.

## Actual Result

Trong corrected Chromium run, exact owned-code row xuất hiện, chứng tỏ coupon có `discount_value=0` được tạo. Cleanup đã xóa test-owned record và phục hồi baseline.

## Reproducibility

`Chromium-specific observed final behavior` — Chromium `FAIL`; Firefox và WebKit `PASS` trong approved final runs.

## Impact

Chromium flow có thể tạo coupon vi phạm positivity rule, làm suy giảm validation và data integrity. Evidence không chứng minh backend luôn chấp nhận dữ liệu này trên mọi browser hoặc mọi request path.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAIL` — reproduced | `fr17-chromium-corrected-20260810T092053847+0700` | `docs/execution-results/fr-17-chromium-corrected-execution.md` |
| Firefox | `PASS` | `fr17-firefox-20260810T092258944+0700` | `docs/execution-results/fr-17-firefox-execution.md` |
| WebKit | `PASS` | `fr17-webkit-20260810T092419436+0700` | `docs/execution-results/fr-17-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-17/screenshots/FR17-BUG-002.png` — promoted byte-identically từ first corrected-Chromium `FR17-TC-008` candidate; SHA-256 `F6BCF2511432C87F04CE5B7B8C9A42AF178AFC1D51E6A5E778D694428C51D858`.

### Automation Evidence

- Corrected Chromium original screenshot/trace/error context: run-specific `FR17-TC-008` result directory.
- Firefox/WebKit execution records preserve the corresponding PASS outcomes.
- Cross-browser matrix: `docs/execution-results/fr-17-cross-browser-summary.md`.

## Technical Observation

Source inspection ghi nhận `discount_value` dùng number input không có `min`, và create route chuyển request values vào INSERT. Đây chỉ là non-causal implementation observation; runtime evidence hiện chỉ chứng minh Chromium failed trong final runs, không chứng minh universal server-side root cause.

## Discovery and Confirmation

Phát hiện trong corrected Chromium run và được A-020 human review chấp nhận. Firefox/WebKit PASS được giữ nguyên, vì vậy defect được ghi là `CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR`, không phải cross-browser defect.

## Recommended Next Step

Enforce `discount_value > 0` tại trusted validation boundary và align client constraints. Sau fix, rerun `FR17-TC-008` trên Chromium, Firefox và WebKit để xác định phạm vi đã được khắc phục.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR17 #CouponManagement #SeverityMedium #PriorityP2 #Chromium #Firefox #WebKit #Functional #Validation #DataIntegrity

## Suggested GitHub Labels

`bug`, `hw04`, `fr-17`, `severity:medium`, `priority:p2`, `coupon-management`, `functional`, `validation`, `data-integrity`, `chromium`
