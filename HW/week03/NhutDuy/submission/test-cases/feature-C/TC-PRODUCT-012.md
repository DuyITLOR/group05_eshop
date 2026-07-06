# TC-PRODUCT-012: name 256 ký tự (biên max+1)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Boundary Value Analysis (biên `name.length` = 256, max+1 — off)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `"A"` × 256 (vượt 255) |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Tên sản phẩm** là chuỗi 256 ký tự, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Từ chối tạo sản phẩm vì tên vượt 255 ký tự (cận trên max+1).

## Actual result
Ô `name` **không có `maxLength`**, backend không validate → **vẫn lưu** chuỗi 256 ký tự.

## Status / Related bugs
Fail / BUG-C3
