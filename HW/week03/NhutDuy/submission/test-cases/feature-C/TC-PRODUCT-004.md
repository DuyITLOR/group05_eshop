# TC-PRODUCT-004: Giá = 0

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP5 — `price` = 0)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `0` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Giá tiền** = `0`, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Từ chối tạo sản phẩm vì giá phải là số dương (> 0).

## Actual result
Ô Giá **không có `required`/`min`**, backend không validate → **tạo sản phẩm với giá 0**.

## Status / Related bugs
Fail / BUG-C1
