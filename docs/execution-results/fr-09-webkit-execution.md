# FR-09 WebKit Execution and Triage

## Run Summary

| Field | Value |
| --- | --- |
| Run ID | `FR-09-webkit-2026-08-09T22-41-12-8688590Z` |
| ISO Timestamp | `2026-08-09T22:41:12.8688590Z` |
| Student ID | `23127107` |
| Browser | `webkit` |
| Total | 16 |
| Passed | 10 |
| Failed | 6 |
| Skipped | 0 |
| Playwright Exit Code | 1 — có test failures |
| Duration | 35.2s |

## Failure Triage

| Test Case ID | Failure Assertion / Observable Evidence | Classification | Confidence | Original Screenshot | Trace |
| --- | --- | --- | --- | --- | --- |
| `FR09-TC-002` | Expected là 400000; discount magnitude nhận được/hiển thị là 36000000 sau valid percent-coupon setup. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-f6335-unt-is-calculated-correctly-webkit/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-f6335-unt-is-calculated-correctly-webkit/trace.zip) |
| `FR09-TC-003` | Expected final là 3600000; final nhận được/hiển thị là 40000000. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-06f85-unt-is-calculated-correctly-webkit/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-06f85-unt-is-calculated-correctly-webkit/trace.zip) |
| `FR09-TC-006` | Exact-minimum 300000 setup thành công; coupon vẫn bị từ chối. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-f7295-t-minimum-total-is-accepted-webkit/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-f7295-t-minimum-total-is-accepted-webkit/trace.zip) |
| `FR09-TC-012` | Unauthenticated cart/Checkout/coupon attempt hoàn tất. Coupon-derived payable đổi từ expected original 4000000 thành 40000000, cho thấy unauthorized application behavior. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-9f97b-thout-valid-JWT-is-rejected-webkit/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-9f97b-thout-valid-JWT-is-rejected-webkit/trace.zip) |
| `FR09-TC-013` | Stable render gate đạt; truy cập Checkout trực tiếp khi chưa xác thực vẫn hiển thị và bật coupon controls. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-6f0ce-ot-use-Checkout-coupon-flow-webkit/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-6f0ce-ot-use-Checkout-coupon-flow-webkit/trace.zip) |
| `FR09-TC-016` | Đã đạt đúng cart/payable setup 4000000, nhưng total vẫn chỉnh sửa được. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-15678-d-and-not-directly-editable-webkit/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/fr-09-fr-09-FR-09---Discou-15678-d-and-not-directly-editable-webkit/trace.zip) |

Chưa gán final Bug ID. WebKit tái hiện cùng candidate set như Chromium và Firefox.

## Evidence and Safety

| Check | Result |
| --- | --- |
| HTML report | [index.html](../../html-reports/fr-09/FR-09-webkit-2026-08-09T22-41-12-8688590Z/index.html) |
| Rendered HTML identity | `PASS` — Feature, student, timestamp, Run ID và WebKit identity bắt buộc đều hiển thị |
| Original screenshots | giữ lại 6/6 |
| Traces | giữ lại 6/6 |
| Persistent candidate screenshot policy | Chromium vẫn là primary; WebKit originals nằm trong run-specific results |
| Isolated `coupon_usage` cleanup | `PASS` — 0 rows sau run |
| Workspace DB protection | `PASS` — readiness SHA-256 không đổi |
| Isolated backend | `HEALTHY`, PID `34568` |
