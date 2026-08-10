# FR-09 Firefox Execution and Triage

## Run Summary

| Field | Value |
| --- | --- |
| Run ID | `FR-09-firefox-2026-08-09T22-38-41-6269203Z` |
| ISO Timestamp | `2026-08-09T22:38:41.6269203Z` |
| Student ID | `23127107` |
| Browser | `firefox` |
| Total | 16 |
| Passed | 10 |
| Failed | 6 |
| Skipped | 0 |
| Playwright Exit Code | 1 — có test failures |
| Duration | 1.3m |
| Adaptive Gate | `CONTINUE` — không có `AUTOMATION_DEFECT` hoặc `ENVIRONMENT_FAILURE` mới |

## Failure Triage

| Test Case ID | Failure Assertion / Observable Evidence | Classification | Confidence | Original Screenshot | Trace |
| --- | --- | --- | --- | --- | --- |
| `FR09-TC-002` | Expected là 400000; discount magnitude nhận được/hiển thị là 36000000 sau khi áp dụng percent coupon thành công. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-f6335-unt-is-calculated-correctly-firefox/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-f6335-unt-is-calculated-correctly-firefox/trace.zip) |
| `FR09-TC-003` | Expected final là 3600000; final nhận được/hiển thị là 40000000 sau setup thành công. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-06f85-unt-is-calculated-correctly-firefox/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-06f85-unt-is-calculated-correctly-firefox/trace.zip) |
| `FR09-TC-006` | Đã đạt exact-minimum total 300000, nhưng `SAVE10` bị từ chối thay vì được chấp nhận. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-f7295-t-minimum-total-is-accepted-firefox/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-f7295-t-minimum-total-is-accepted-firefox/trace.zip) |
| `FR09-TC-012` | Unauthenticated cart/Checkout setup thành công và coupon attempt tạo applied discount line thay vì bị từ chối. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-9f97b-thout-valid-JWT-is-rejected-firefox/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-9f97b-thout-valid-JWT-is-rejected-firefox/trace.zip) |
| `FR09-TC-013` | Stable render gate đạt; truy cập Checkout trực tiếp khi chưa xác thực vẫn hiển thị và bật coupon controls. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-6f0ce-ot-use-Checkout-coupon-flow-firefox/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-6f0ce-ot-use-Checkout-coupon-flow-firefox/trace.zip) |
| `FR09-TC-016` | Cart/payable total là 4000000, nhưng total input vẫn chỉnh sửa được. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-15678-d-and-not-directly-editable-firefox/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/fr-09-fr-09-FR-09---Discou-15678-d-and-not-directly-editable-firefox/trace.zip) |

Firefox tái hiện đúng tập Chromium failures và không có browser-specific failure. Chưa gán final Bug ID.

## Evidence and Safety

| Check | Result |
| --- | --- |
| HTML report | [index.html](../../html-reports/fr-09/FR-09-firefox-2026-08-09T22-38-41-6269203Z/index.html) |
| Rendered HTML identity | `PASS` — Feature, student, timestamp, Run ID và Firefox identity bắt buộc đều hiển thị |
| Original screenshots | giữ lại 6/6 trong Firefox results |
| Traces | giữ lại 6/6 |
| Persistent candidate screenshot policy | Chromium vẫn là primary; Firefox originals nằm trong run-specific results |
| Isolated `coupon_usage` cleanup | `PASS` — 0 rows sau run |
| Workspace DB protection | `PASS` — readiness SHA-256 không đổi |
| Isolated backend | `HEALTHY`, PID `34568` |

## Checkpoint Decision

Firefox không tạo `AUTOMATION_DEFECT` hoặc `ENVIRONMENT_FAILURE`. Adaptive execution được phép tiếp tục sang WebKit.
