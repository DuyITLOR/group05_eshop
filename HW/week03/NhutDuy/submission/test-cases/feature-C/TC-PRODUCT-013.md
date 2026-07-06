# TC-PRODUCT-013: name 1 ký tự (biên min)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Boundary Value Analysis (biên `name.length` = 1, min — on)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `A` (1 ký tự) |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Tên sản phẩm** = `A` (1 ký tự), các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Chấp nhận tạo sản phẩm vì 1 ký tự là cận dưới hợp lệ (`1 ≤ length`).

## Actual result
Lưu OK; sản phẩm được tạo với tên 1 ký tự.

## Status / Related bugs
Pass / None
