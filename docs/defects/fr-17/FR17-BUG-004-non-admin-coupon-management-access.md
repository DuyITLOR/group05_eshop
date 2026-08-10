# [HW04][BUG][FR-17][Coupon Management] Non-admin vẫn truy cập được Coupon Management

## Found by Test Case

`FR17-TC-016` — xác nhận valid authenticated non-admin không có usable Coupon Management surface.

## Related Requirements

`FR17-R15` — Coupon Management chỉ dành cho `role = 'admin'`.

## Severity / Priority

| Field | Value |
| --- | --- |
| Severity | `High` |
| Priority | `P1` |
| Reason | Authorization boundary của Admin surface thất bại nhất quán trên ba engines: valid non-admin session vẫn nhận được usable Coupon Management control. Runtime case chưa thực hiện create/delete, nên report không khẳng định unauthorized data mutation đã xảy ra. |

## Reason

Đây là role-based access discrepancy trên privileged management surface, reproduce ổn định với runtime-verified non-admin identity.

## Environment

| Field | Value |
| --- | --- |
| SUT | EShop |
| Feature | FR-17 — Coupon management |
| Module | Web Admin — Coupon Management authorization |
| Frontend URL | `http://localhost:5174` |
| Backend URL | `http://localhost:3000` |
| Browser(s) | Chromium, Firefox, WebKit |
| Browser version(s) | `NOT_RECORDED` |
| OS build / Device / Viewport / Zoom | `NOT_RECORDED` |
| Setup | `FR17-SETUP-002` — runtime-only authenticated non-admin role descriptor |
| Execution Date | `2026-08-10` |
| SUT Commit | `NOT_RECORDED` |

## Preconditions

Fresh browser context; valid controlled non-admin JWT được runtime-verified; không có admin JWT; Web Admin shell accessible.

## Steps to Reproduce

1. Tạo fresh browser context.
2. Đăng nhập bằng controlled non-admin identity và verify role khác `admin`.
3. Cài runtime non-admin session vào Web Admin context.
4. Mở Web Admin và quan sát Coupon Management controls.

## Expected Result

Coupon list/create/delete controls không khả dụng và non-admin không có usable Coupon Management operation.

## Actual Result

Web Admin shell render thành công và hiển thị một usable `Mã Giảm Giá` control cho non-admin trên Chromium, Firefox và WebKit. Test dừng tại control-availability assertion; không thực hiện create/delete operation.

## Reproducibility

`Always in final runs` — reproduce trên Chromium, Firefox và WebKit.

## Impact

Non-admin được tiếp cận privileged management navigation/surface trái role requirement, tạo authorization risk. Evidence không khẳng định record đã bị tạo/xóa hoặc privilege escalation rộng hơn flow được quan sát.

## Cross-Browser Result

| Browser | Result | Run ID | Evidence |
| --- | --- | --- | --- |
| Chromium | `FAIL` — reproduced | `fr17-chromium-corrected-20260810T092053847+0700` | `docs/execution-results/fr-17-chromium-corrected-execution.md` |
| Firefox | `FAIL` — reproduced | `fr17-firefox-20260810T092258944+0700` | `docs/execution-results/fr-17-firefox-execution.md` |
| WebKit | `FAIL` — reproduced | `fr17-webkit-20260810T092419436+0700` | `docs/execution-results/fr-17-webkit-execution.md` |

## Evidence

### Screenshot

`docs/defects/fr-17/screenshots/FR17-BUG-004.png` — promoted byte-identically từ preserved first A-018 Chromium candidate của `FR17-TC-016`; SHA-256 `DC2675A9BB08A0719FD6CA63D4A770600A6EF5C3BE2E8A4D591CC5F70687130D`.

### Automation Evidence

- Historical first capture: Run ID `fr17-chromium-20260810T084402107+0700`.
- Final corrected Chromium, Firefox và WebKit execution records preserve non-admin runtime setup, screenshots, traces và assertion failures.
- Cross-browser matrix: `docs/execution-results/fr-17-cross-browser-summary.md`.

## Technical Observation

Source inspection ghi nhận Web Admin sidebar renders Coupon Management navigation once token state exists, trong khi coupon admin routes use authentication middleware without an explicit role check at those route declarations. Đây là supporting static observation; test chỉ chứng minh non-admin nhận usable control, không chứng minh create/delete mutation thành công.

## Discovery and Confirmation

Phát hiện ban đầu trong A-018 Chromium run; reproduce trong final corrected Chromium, Firefox và WebKit. A-020 human review chấp nhận `FR17-TC-016` là cross-browser `PRODUCT_DEFECT_CANDIDATE`.

## Recommended Next Step

Enforce `role='admin'` tại trusted server authorization boundary và hide/disable privileged UI for non-admin sessions. Sau fix, rerun `FR17-TC-016` trên ba engines và bổ sung server authorization checks nếu scope cho phép.

## Status

`OPEN` — `PRODUCT_DEFECT`; GitHub Publication Status: `NOT_PUBLISHED`.

## Hashtags

#HW04 #BUG #FR17 #CouponManagement #SeverityHigh #PriorityP1 #Chromium #Firefox #WebKit #CrossBrowser #Functional #Security #Authentication #Authorization

## Suggested GitHub Labels

`bug`, `hw04`, `fr-17`, `severity:high`, `priority:p1`, `coupon-management`, `functional`, `security`, `authentication`, `authorization`, `cross-browser`
