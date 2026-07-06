# TC-PRODUCT-007: Danh mục không tồn tại

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP9 — `category_id` không tồn tại / không chọn)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.
- Chỉ kiểm được qua API `POST /api/products` (UI là `<select>` danh mục có sẵn, không nhập số được).

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `1000000` |
| category_id | `9999` (không tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Gửi request API `POST /api/products` với body chứa `category_id = 9999`.
2. Quan sát phản hồi và kiểm tra bảng sản phẩm.

## Expected result
Từ chối tạo sản phẩm vì danh mục phải thuộc danh sách có sẵn (chống sản phẩm mồ côi).

## Actual result
`category_id INTEGER` **không có ràng buộc FK**, không bật `PRAGMA foreign_keys`, POST không validate → tạo **sản phẩm mồ côi** danh mục.

## Status / Related bugs
Fail / BUG-C4
