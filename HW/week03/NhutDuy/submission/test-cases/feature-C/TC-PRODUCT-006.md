# TC-PRODUCT-006: Giá rỗng / không phải số

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP7 — `price` rỗng / không phải số)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `""` (rỗng) |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Để trống ô **Giá tiền**, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Từ chối tạo sản phẩm vì giá là trường bắt buộc và phải là số dương.

## Actual result
Ô Giá **không có `required`** → lưu được sản phẩm với `price` rỗng / `NULL`.

## Status / Related bugs
Fail / BUG-C1
