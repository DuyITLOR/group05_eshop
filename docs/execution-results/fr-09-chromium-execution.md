# FR-09 Chromium Execution and Triage

## Run Summary

| Field | Value |
| --- | --- |
| Run ID | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` |
| ISO Timestamp | `2026-08-09T22:35:59.4764573Z` |
| Student ID | `23127107` |
| Browser | `chromium` |
| Total | 16 |
| Passed | 10 |
| Failed | 6 |
| Skipped | 0 |
| Playwright Exit Code | 1 — có test failures |
| Duration | 31.4s |
| Adaptive Gate | `CONTINUE` — không có `AUTOMATION_DEFECT` hoặc `ENVIRONMENT_FAILURE` |

## Failure Triage

| Test Case ID | Failure Assertion / Observable Evidence | Classification | Confidence | Original Screenshot | Trace |
| --- | --- | --- | --- | --- | --- |
| `FR09-TC-002` | Expected percent discount là 400000; UI hiển thị `Tiết kiệm: -36,000,000 đ`, được parse thành 36000000. Seed cart total 4000000 và coupon success state đều đã đạt. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-f6335-unt-is-calculated-correctly-chromium/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-f6335-unt-is-calculated-correctly-chromium/trace.zip) |
| `FR09-TC-003` | Expected final là 3600000; UI hiển thị `Thành tiền: 40,000,000 đ`, được parse thành 40000000. Seed cart và thao tác áp dụng percent coupon đều thành công. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-06f85-unt-is-calculated-correctly-chromium/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-06f85-unt-is-calculated-correctly-chromium/trace.zip) |
| `FR09-TC-006` | Controlled cart đạt đúng minimum 300000. `SAVE10` bị từ chối với minimum-order error hiển thị trên UI thay vì được chấp nhận tại `total >= min_order_amount`. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-f7295-t-minimum-total-is-accepted-chromium/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-f7295-t-minimum-total-is-accepted-chromium/trace.zip) |
| `FR09-TC-012` | Fresh unauthenticated context tạo cart 4000000, tới Checkout không có injected JWT và submit coupon. UI chấp nhận `SAVE10` và hiển thị coupon amounts. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-9f97b-thout-valid-JWT-is-rejected-chromium/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-9f97b-thout-valid-JWT-is-rejected-chromium/trace.zip) |
| `FR09-TC-013` | EShop shell và `main` render gate thành công. Truy cập trực tiếp `/checkout` khi chưa xác thực vẫn hiển thị coupon input và bật Apply action, nên functional coupon controls vẫn sử dụng được. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-6f0ce-ot-use-Checkout-coupon-flow-chromium/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-6f0ce-ot-use-Checkout-coupon-flow-chromium/trace.zip) |
| `FR09-TC-016` | Cart-derived total và payable value đều là 4000000, nhưng Checkout total input vẫn chỉnh sửa được. | `PRODUCT_DEFECT_CANDIDATE` | `HIGH` | [original](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-15678-d-and-not-directly-editable-chromium/test-failed-1.png) | [trace](../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-15678-d-and-not-directly-editable-chromium/trace.zip) |

Sau Chromium runtime inspection, không có failure nào được phân loại là `AUTOMATION_DEFECT`, `ENVIRONMENT_FAILURE` hoặc `NEEDS_MORE_EVIDENCE`. Chưa gán final Bug ID.

## Evidence and Safety

| Check | Result |
| --- | --- |
| HTML report | [index.html](../../html-reports/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/index.html) |
| Rendered HTML identity | `PASS` — FR-09, `Run by: 23127107`, timestamp, Run ID và `Browser: chromium` đều hiển thị |
| Original screenshots | giữ lại 6/6 trong run-specific results |
| Traces | giữ lại 6/6 |
| Persistent candidate screenshots | 6 file được copy từ originals; không recapture |
| Isolated `coupon_usage` cleanup | `PASS` — 0 rows sau run |
| Workspace DB protection | `PASS` — SHA-256 vẫn là `2251BA251C2B0722F0E524775C6DB5FC1B7CFB046D561BA26905B1EDCC52BA02` |
| Isolated backend | `HEALTHY`, PID `34568` |

## Checkpoint Decision

Các Chromium failures chỉ gồm kết quả `PRODUCT_DEFECT_CANDIDATE` có confidence `HIGH`. Adaptive execution được phép tiếp tục sang Firefox.
