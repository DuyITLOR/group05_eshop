# Traceability Matrix – Requirement ↔ Test Case ↔ Bug

> Chứng minh coverage (requirement nào đã test) và defect traceability (bug nào thuộc test case/requirement nào).
> Cập nhật dần khi làm Feature B (CART), C (PRODUCT), D (PROFILE).

## Feature A – FR-01 (Register)

| Requirement | Test Case | Technique | Result | Bug Issue | Status |
| --- | --- | --- | --- | --- | --- |
| FR-01 | TC-REGISTER-001 | EP | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-002 | EP | Pass † | — | Done |
| FR-01 | TC-REGISTER-003 | EP | Fail | BUG-A2 (#18) | New |
| FR-01 | TC-REGISTER-004 | EP | Fail | BUG-A3 (#19) | New |
| FR-01 | TC-REGISTER-005 | EP | Pass † | — | Done |
| FR-01 | TC-REGISTER-006 | EP | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-007 | EP | Pass\* | — | Done |
| FR-01 | TC-REGISTER-008 | EP | Pass † | — | Done |
| FR-01 | TC-REGISTER-009 | EP | Fail | BUG-A4 (#20) | New |
| FR-01 | TC-REGISTER-010 | BVA | Pass | — | Done |
| FR-01 | TC-REGISTER-011 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-012 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-013 | EP | Pass\* | — | Done |
| FR-01 | TC-REGISTER-014 | EP | Pass\* | — | Done |
| FR-01 | TC-REGISTER-015 | EP | Fail | BUG-A2 (#18) | New |
| FR-01 | TC-REGISTER-016 | EP | Fail | BUG-A2 (#18) | New |
| FR-01 | TC-REGISTER-017 | EP | Fail | BUG-A2 (#18) | New |
| FR-01 | TC-REGISTER-018 | EP | Fail | BUG-A2 (#18) | New |
| FR-01 | TC-REGISTER-019 | EP | Fail | BUG-A2 (#18) | New |
| FR-01 | TC-REGISTER-020 | EP | Pass\* | — | Done |
| FR-01 | TC-REGISTER-021 | EP | Pass\* | — | Done |
| FR-01 | TC-REGISTER-022 | BVA | Pass | — | Done |
| FR-01 | TC-REGISTER-023 | BVA | Pass | — | Done |
| FR-01 | TC-REGISTER-024 | BVA | Pass\* | — | Done |
| FR-01 | TC-REGISTER-025 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-026 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-027 | BVA | Pass\* | — | Done |
| FR-01 | TC-REGISTER-028 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-029 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-030 | BVA | Pass\* | — | Done |
| FR-01 | TC-REGISTER-031 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-032 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-033 | BVA | Pass\* | — | Done |
| FR-01 | TC-REGISTER-034 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-035 | BVA | Fail | BUG-A1 (#17) | New |
| FR-01 | TC-REGISTER-036 | BVA | Pass | — | Done |
| FR-01 | TC-REGISTER-037 | BVA | Pass | — | Done |

**Bug tổng hợp (Feature A):** BUG-A1, BUG-A2, BUG-A3, BUG-A4, BUG-A5, BUG-A6 — chi tiết ở [bug-report](../../bug-report/bug-report.md).

> \*Pass\* = đúng kết quả, sai lý do (regex BUG-A1).
> † TC-002/005/008 (trường rỗng) = Pass vì HTML `required` chặn submit; BUG-A2 chỉ lộ khi gọi thẳng API.

## Feature B – FR-07 (Cart)

> Actual = dự đoán từ source, cần xác nhận UI.

| Requirement | Test Case | Technique | Result | Bug Issue | Status |
| --- | --- | --- | --- | --- | --- |
| FR-07/FR-06 | TC-CART-001 | EP | Pass | — | Done |
| FR-07/FR-06 | TC-CART-002 | EP | Pass | — | Done |
| FR-06 | TC-CART-003 | EP | Fail | BUG-B1 (#51) | New |
| FR-06 | TC-CART-004 | EP | Fail | BUG-B1 (#51) | New |
| FR-06 | TC-CART-005 | EP | Fail | BUG-B1 (#51) | New |
| FR-06 | TC-CART-006 | EP | Fail | BUG-B1 (#51) | New |
| FR-07 | TC-CART-007 | EP | Fail | BUG-B2 (#52) | New |
| FR-07 | TC-CART-008 | EP | Fail | BUG-B3 (#53) | New |
| FR-07 | TC-CART-009 | EP | Fail | BUG-B4 (#54) | New |
| FR-07 | TC-CART-010 | EP | Fail | BUG-B5 (#55) | New |
| FR-07 | TC-CART-011 | EP | Fail | BUG-B6 (#56) | New |
| FR-07 | TC-CART-013 | EP | Pass | — | Done |
| FR-06 | TC-CART-014 | BVA | Pass | — | Done |
| FR-06 | TC-CART-015 | BVA | Pass\* | — | Done |

**Bug tổng hợp (Feature B):** BUG-B1, B2, B3, B4, B5, B6 — chi tiết ở [bug-report](../../bug-report/bug-report.md).
> *Đã loại TC-CART-012 / BUG-B7 (nút "Thêm vào giỏ" bấm 2 lần) vì thuộc FR-06, ngoài phạm vi FR-07.*

## Feature C – FR-15 (Product CRUD)

> Actual = dự đoán từ source, cần xác nhận Admin UI / API.

| Requirement | Test Case | Technique | Result | Bug Issue | Status |
| --- | --- | --- | --- | --- | --- |
| FR-15 | TC-PRODUCT-001 | EP | Pass | — | Done |
| FR-15 | TC-PRODUCT-002 | EP | Pass † | BUG-C4 (#81) | New |
| FR-15 | TC-PRODUCT-003 | EP | Fail | BUG-C3 (#80) | New |
| FR-15 | TC-PRODUCT-004 | EP | Fail | BUG-C1 (#78) | New |
| FR-15 | TC-PRODUCT-005 | EP | Fail | BUG-C1 (#78) | New |
| FR-15 | TC-PRODUCT-006 | EP | Fail | BUG-C1 (#78) | New |
| FR-15 | TC-PRODUCT-007 | EP | Fail | BUG-C4 (#81) | New |
| FR-15 | TC-PRODUCT-008 | EP | Fail | BUG-C2 (#79) | New |
| FR-15 | TC-PRODUCT-009 | EP | Pass | — | Done |
| FR-15 | TC-PRODUCT-010 | EP | Pass | — | Done |
| FR-15 | TC-PRODUCT-011 | BVA | Pass | — | Done |
| FR-15 | TC-PRODUCT-012 | BVA | Fail | BUG-C3 (#80) | New |
| FR-15 | TC-PRODUCT-013 | BVA | Pass | — | Done |
| FR-15 | TC-PRODUCT-014 | BVA | Fail | BUG-C1 (#78) | New |
| FR-15 | TC-PRODUCT-015 | BVA | Pass | — | Done |
| FR-15 *(giả định)* | TC-PRODUCT-016 | EP | Pass\* | — | Done |
| FR-15 *(giả định)* | TC-PRODUCT-017 | EP | Pass | — | Done |
| FR-15 | TC-PRODUCT-018 | BVA | Pass | — | Done |
| FR-15 | TC-PRODUCT-019 | BVA | Pass | — | Done |
| FR-15 | TC-PRODUCT-020 | BVA | Pass\* | — | Done |

**Bug tổng hợp (Feature C):** BUG-C1, C2, C3, C4 — chi tiết ở [bug-report](../../bug-report/bug-report.md).
> TC-016/017 là EP **giả định** cho `imageUrl`/`description` (ngoài SRS) — đều Pass (hệ thống xử lý an toàn).
> † TC-PRODUCT-002 (name rỗng) = Pass vì HTML `required` chặn submit; BUG-C4 chỉ lộ khi gọi thẳng API.

## Feature D – D7 Mobile / FR-04 (Hồ sơ cá nhân)

> Actual = đối chiếu source (`App.js`, `server.js`), cần xác nhận trên app Mobile / API.

| Requirement | Test Case | Technique | Result | Bug Issue | Status |
| --- | --- | --- | --- | --- | --- |
| FR-04 | TC-PROFILE-001 | EP | Fail | BUG-D1 (#82) | New |
| FR-04 | TC-PROFILE-002 | EP | Fail | BUG-D1 (#82) | New |
| FR-04 | TC-PROFILE-003 | EP | Fail | BUG-D1 (#82) | New |
| FR-04 | TC-PROFILE-004 | EP | Pass | — | Done |
| FR-04 | TC-PROFILE-005 | EP | Pass | — | Done |
| FR-04 | TC-PROFILE-006 | EP | Pass | — | Done |
| FR-04 | TC-PROFILE-007 | EP | Pass | — | Done |
| FR-04 | TC-PROFILE-008 | EP | Fail | BUG-D2 (#83) | New |
| FR-04 | TC-PROFILE-009 | EP | Fail | BUG-D3 (#84) | New |
| FR-04 | TC-PROFILE-010 | EP | Pass | — | Done |
| FR-04 | TC-PROFILE-011 | EP | Fail | BUG-D4 (#85) | New |
| FR-04 | TC-PROFILE-012 | BVA | Pass | — | Done |
| FR-04 | TC-PROFILE-013 | BVA | Pass | — | Done |

**Bug tổng hợp (Feature D):** BUG-D1, D2, D3, D4 — chi tiết ở [bug-report](../../bug-report/bug-report.md).
> TC-001/002 là biên min/max hợp lệ theo SRS nhưng bị mobile từ chối sai (BUG-D1) — đồng thời tái dùng làm BVA.
