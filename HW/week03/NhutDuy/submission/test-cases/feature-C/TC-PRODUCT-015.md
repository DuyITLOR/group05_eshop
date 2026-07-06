# TC-PRODUCT-015: giá = 1 (hợp lệ nhỏ nhất)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Boundary Value Analysis (biên `price` = 1, min+1 — in)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `1` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Giá tiền** = `1`, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Chấp nhận tạo sản phẩm vì 1 là giá dương hợp lệ nhỏ nhất (> 0).

## Actual result
Lưu OK; sản phẩm được tạo với giá 1.

## Status / Related bugs
Pass / None
