# TC-PRODUCT-003: Tên > 255 ký tự

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP3 — `name` > 255 ký tự)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `<chuỗi 256 ký tự>` (vượt 255) |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Tên sản phẩm** là chuỗi 256 ký tự, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Từ chối tạo sản phẩm vì tên vượt quá giới hạn tối đa 255 ký tự.

## Actual result
Ô `name` **không có `maxLength`**, backend không validate → **lưu cả chuỗi 256 ký tự**.

## Status / Related bugs
Fail / BUG-C3
