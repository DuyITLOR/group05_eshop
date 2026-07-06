# TC-PRODUCT-014: giá = 0 (biên dưới, exclusive)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Boundary Value Analysis (biên `price` = 0, cận dưới exclusive — off)

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
Từ chối tạo sản phẩm vì giá phải > 0 (cận dưới 0 là exclusive).

## Actual result
Không validate → **lưu sản phẩm với giá 0**.

## Status / Related bugs
Fail / BUG-C1
