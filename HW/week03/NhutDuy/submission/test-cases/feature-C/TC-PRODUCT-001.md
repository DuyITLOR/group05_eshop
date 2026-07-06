# TC-PRODUCT-001: Thêm sản phẩm hợp lệ (mốc)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng hợp lệ EP1+EP4+EP8)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập Test data ở trên.
3. Bấm **Lưu sản phẩm**.

## Expected result
Tạo sản phẩm thành công; sản phẩm mới xuất hiện trong bảng danh sách với đúng tên/giá/danh mục.

## Actual result
`POST /api/products` tạo sản phẩm thành công, hiển thị trong bảng.

## Status / Related bugs
Pass / None
