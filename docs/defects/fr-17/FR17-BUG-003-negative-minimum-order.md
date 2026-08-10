# [HW04][BUG][FR-17][Coupon Management] Chromium chấp nhận min_order_amount âm

## Found by Test Case

`FR17-TC-011` — kiểm tra exact invalid lower boundary `min_order_amount=-1` bị reject.

## Related Requirements

`FR17-R11` — `min_order_amount >= 0`.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `Medium` |
| Priority | `P2` |
| Reason | Chromium final run quan sát coupon có minimum order âm được tạo, vi phạm business validation và có thể làm sai eligibility data. Firefox/WebKit pass nên chưa có evidence về cross-browser-independent root cause. |

## Reason

Approved lower-bound oracle yêu cầu reject, code absent và count unchanged; corrected Chromium quan sát exact owned-code row xuất hiện sau submit.

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
| Dataset | `FR17-DATA-011` — `minOrderAmount=-1`, all other fields valid |
| Execution Date | `2026-08-10` |
| SUT Commit | `NOT_RECORDED` |

## Preconditions

Valid admin session; isolated DB ở exact four-seed baseline; runtime-derived unique controlled code chưa tồn tại.

## Steps to Reproduce

1. Mở Coupon Management bằng valid admin session.
2. Điền external dataset `FR17-DATA-011`, gồm `min_order_amount=-1` và các field còn lại hợp lệ.
3. Submit create form.
4. Quan sát list count và exact owned-code row.

## Expected Result

Coupon bị reject; controlled code không xuất hiện và list count không tăng.

## Actual Result

Trong corrected Chromium run, exact owned-code row xuất hiện, chứng tỏ coupon có `min_order_amount=-1` được tạo. Cleanup đã xóa test-owned record và phục hồi baseline.

## Reproducibility

`Chromium-specific observed final behavior` — Chromium `FAIL`; Firefox và WebKit `PASS` trong approved final runs.

## Impact

Chromium flow có thể tạo invalid coupon configuration với minimum order âm, làm suy giảm validation và data integrity. Evidence không chứng minh hành vi này tồn tại trong mọi browser hoặc mọi backend request path.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAIL` — reproduced | `fr17-chromium-corrected-20260810T092053847+0700` | `docs/execution-results/fr-17-chromium-corrected-execution.md` |
| Firefox | `PASS` | `fr17-firefox-20260810T092258944+0700` | `docs/execution-results/fr-17-firefox-execution.md` |
| WebKit | `PASS` | `fr17-webkit-20260810T092419436+0700` | `docs/execution-results/fr-17-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-17/screenshots/FR17-BUG-003.png` — promoted byte-identically từ first corrected-Chromium `FR17-TC-011` candidate; SHA-256 `4F58EFF1F9918B0A5FA7C136D7C0513721E48BC23BBF53188AACCF0B316D5EC7`.

### Automation Evidence

- Corrected Chromium original screenshot/trace/error context: run-specific `FR17-TC-011` result directory.
- Firefox/WebKit execution records preserve the corresponding PASS outcomes.
- Cross-browser matrix: `docs/execution-results/fr-17-cross-browser-summary.md`.

## Technical Observation

Source inspection ghi nhận `min_order_amount` number input không có `min`, và create route chuyển request values vào INSERT. Đây là non-causal implementation observation; final runtime evidence chỉ chứng minh Chromium failed, không chứng minh universal backend root cause.

## Discovery and Confirmation

Phát hiện trong corrected Chromium run và được A-020 human review chấp nhận. Firefox/WebKit PASS được giữ nguyên, nên defect được ghi là `CHROMIUM_SPECIFIC_OBSERVED_BEHAVIOR`.

## Recommended Next Step

Enforce `min_order_amount >= 0` tại trusted validation boundary và align client constraints. Sau fix, rerun `FR17-TC-011` trên cả ba engines.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR17 #CouponManagement #SeverityMedium #PriorityP2 #Chromium #Firefox #WebKit #Functional #Validation #DataIntegrity

## Suggested GitHub Labels

`bug`, `hw04`, `fr-17`, `severity:medium`, `priority:p2`, `coupon-management`, `functional`, `validation`, `data-integrity`, `chromium`
