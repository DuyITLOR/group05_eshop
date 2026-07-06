# TC-PRODUCT-018: name 2 ký tự (min+1)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Boundary Value Analysis (biên `name.length` = 2, min+1 — in)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `AB` (2 ký tự) |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Tên sản phẩm** = `AB` (2 ký tự), các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Chấp nhận tạo sản phẩm vì 2 ký tự nằm trong vùng hợp lệ (sát cận dưới).

## Actual result
Lưu OK; sản phẩm được tạo với tên 2 ký tự.

## Status / Related bugs
Pass / None
