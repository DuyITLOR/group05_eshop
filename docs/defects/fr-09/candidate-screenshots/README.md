# FR-09 Product Defect Candidate Screenshot Manifest

Chỉ liệt kê execution-level `PRODUCT_DEFECT_CANDIDATE` evidence. Các file được copy từ original Chromium first-run artifacts; không recapture UI và chưa gán final Bug ID.

| Test Case ID | Primary Browser | Source Run ID | Original Screenshot | Persistent Candidate Screenshot | Classification |
| --- | --- | --- | --- | --- | --- |
| `FR09-TC-002` | Chromium | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | [original](../../../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-f6335-unt-is-calculated-correctly-chromium/test-failed-1.png) | [FR09-TC-002.png](FR09-TC-002.png) | `PRODUCT_DEFECT_CANDIDATE` |
| `FR09-TC-003` | Chromium | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | [original](../../../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-06f85-unt-is-calculated-correctly-chromium/test-failed-1.png) | [FR09-TC-003.png](FR09-TC-003.png) | `PRODUCT_DEFECT_CANDIDATE` |
| `FR09-TC-006` | Chromium | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | [original](../../../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-f7295-t-minimum-total-is-accepted-chromium/test-failed-1.png) | [FR09-TC-006.png](FR09-TC-006.png) | `PRODUCT_DEFECT_CANDIDATE` |
| `FR09-TC-012` | Chromium | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | [original](../../../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-9f97b-thout-valid-JWT-is-rejected-chromium/test-failed-1.png) | [FR09-TC-012.png](FR09-TC-012.png) | `PRODUCT_DEFECT_CANDIDATE` |
| `FR09-TC-013` | Chromium | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | [original](../../../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-6f0ce-ot-use-Checkout-coupon-flow-chromium/test-failed-1.png) | [FR09-TC-013.png](FR09-TC-013.png) | `PRODUCT_DEFECT_CANDIDATE` |
| `FR09-TC-016` | Chromium | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | [original](../../../../test-results/fr-09/FR-09-chromium-2026-08-09T22-35-59-4764573Z/fr-09-fr-09-FR-09---Discou-15678-d-and-not-directly-editable-chromium/test-failed-1.png) | [FR09-TC-016.png](FR09-TC-016.png) | `PRODUCT_DEFECT_CANDIDATE` |

Firefox và WebKit screenshots vẫn nằm trong các directory `test-results/fr-09/<Run ID>/` tương ứng và không được promote vì Chromium originals đã cung cấp primary evidence rõ ràng.

## Human-Approved Promotion Mapping

Finalization không chạy lại Playwright hoặc recapture UI. Mỗi promoted file bên dưới là byte-identical copy của candidate source.

| Defect ID | Selected Source Test Case | Source Run ID | Promoted Screenshot | Reason |
| --- | --- | --- | --- | --- |
| `FR09-BUG-001` | `FR09-TC-002` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `../screenshots/FR09-BUG-001.png` | TC-002/TC-003 images giống nhau; TC-002 bám trực tiếp primary `discount_amount` oracle và ảnh cũng hiển thị wrong final amount. |
| `FR09-BUG-002` | `FR09-TC-006` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `../screenshots/FR09-BUG-002.png` | Hiển thị exact-minimum total và rejection message. |
| `FR09-BUG-003` | `FR09-TC-012` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `../screenshots/FR09-BUG-003.png` | Hiển thị unauthenticated header state và applied coupon outcome. |
| `FR09-BUG-004` | `FR09-TC-013` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `../screenshots/FR09-BUG-004.png` | Hiển thị unauthenticated Checkout coupon controls. |
| `FR09-BUG-005` | `FR09-TC-016` | `FR-09-chromium-2026-08-09T22-35-59-4764573Z` | `../screenshots/FR09-BUG-005.png` | Hiển thị Checkout total input; editability được chứng minh trong trace/assertion. |

Candidate files cho `FR09-TC-002`, `FR09-TC-003`, `FR09-TC-006`, `FR09-TC-012`, `FR09-TC-013`, `FR09-TC-016` và toàn bộ original run evidence đều được giữ nguyên.
