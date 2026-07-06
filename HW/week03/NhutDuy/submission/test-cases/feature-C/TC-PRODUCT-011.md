# TC-PRODUCT-011: name 255 ký tự (biên max)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Boundary Value Analysis (biên `name.length` = 255, max — on)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `"A"` × 255 (đúng 255 ký tự) |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Tên sản phẩm** là chuỗi đúng 255 ký tự, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Chấp nhận tạo sản phẩm vì 255 là đúng giới hạn tối đa (cận trên inclusive).

## Actual result
Lưu OK; sản phẩm được tạo với tên 255 ký tự.

## Status / Related bugs
Pass / None
