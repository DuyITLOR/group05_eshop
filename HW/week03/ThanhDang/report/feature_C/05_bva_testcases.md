# 05 — BVA Test Cases: feature_C (FR-14 — Quản lý Danh mục)

## Test Cases

**Defaults:**
- JWT: Valid admin token (`admin@eshop.com`)
- DB: Seed data (3 categories: id=1 Điện thoại, id=2 Laptop, id=3 Phụ kiện)
- Precondition: Admin authenticated

### name Length — Create (4 TC)

> SPEC min = 1 (tên không được rỗng). Không có Max từ SPEC/CODE (SQLite TEXT unlimited) → không có Max-1, Max, Max+1.

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-C-001 | Min-1 (0 chars) | POST `{name: ""}` | **SPEC:** 400 — tên không được rỗng. **CODE:** 200 OK, category created với name="" (**BUG**) |
| BVA-C-002 | Min (1 char) | POST `{name: "A"}` | 200 OK, `{message: "Category created", id: N}` |
| BVA-C-003 | Min+1 (2 chars) | POST `{name: "AB"}` | 200 OK, category created |
| BVA-C-004 | Nominal (7 chars) | POST `{name: "Điện tử"}` | 200 OK, category created |

### name Length — Update (4 TC)

> Tương tự Create — SPEC min = 1, không có Max.

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-C-005 | Min-1 (0 chars) | PUT `/api/categories/3` `{name: ""}` | **SPEC:** 400. **CODE:** 200 OK, name="" (**BUG**) |
| BVA-C-006 | Min (1 char) | PUT `/api/categories/3` `{name: "X"}` | 200 OK, `{message: "Category updated"}` |
| BVA-C-007 | Min+1 (2 chars) | PUT `/api/categories/3` `{name: "XY"}` | 200 OK, category updated |
| BVA-C-008 | Nominal (11 chars) | PUT `/api/categories/3` `{name: "Phụ kiện mới"}` | 200 OK, category updated |

### id (URL Parameter — Delete/Update) (7 TC)

> Valid range: [1, max_existing_id]. Seed data: id = 1, 2, 3 → Min = 1, Max = 3.
> Min+1 = Nominal = Max-1 = 2 (do dataset nhỏ, 3 giá trị trùng nhau). Với seed size 3, BVA cho id collapse về 4-5 điểm có ý nghĩa: Min-1=0, Min=1, Max=3, Max+1=4, Negative=-1. Các TC id=2 dưới đây test cùng giá trị nhưng khác operation.
>
> **Thứ tự thực thi:** BVA-C-011 (DELETE id=2) phải chạy SAU BVA-C-012 và BVA-C-013, hoặc cần restore seed data giữa các test destructive.

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-C-009 | Min-1 (0) | DELETE `/api/categories/0` | **Expected:** 404. **CODE:** 200 OK — silent no-op (**BUG**) |
| BVA-C-010 | Min (1) | DELETE `/api/categories/1` | 200 OK, `{message: "Category deleted"}` |
| BVA-C-011 | Min+1 (2) | DELETE `/api/categories/2` | 200 OK, category deleted |
| BVA-C-012 | Nominal (2) | PUT `/api/categories/2` `{name: "Test"}` | 200 OK, category updated |
| BVA-C-013 | Max-1 (2) | GET `/api/categories/2` (verify exists) | 200 OK, category tồn tại |
| BVA-C-014 | Max (3) | DELETE `/api/categories/3` | 200 OK, category deleted — ID lớn nhất trong seed |
| BVA-C-015 | Max+1 (4) | DELETE `/api/categories/4` | **Expected:** 404. **CODE:** 200 OK — silent no-op (**BUG**) |

---

## Summary

| Category | Count | TC Range |
| --- | --- | --- |
| name length (Create) | 4 | BVA-C-001 → BVA-C-004 |
| name length (Update) | 4 | BVA-C-005 → BVA-C-008 |
| id (URL param) | 7 | BVA-C-009 → BVA-C-015 |
| **Total** | **15** | |

