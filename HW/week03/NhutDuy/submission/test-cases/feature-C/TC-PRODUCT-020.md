# TC-PRODUCT-020: giá rất lớn (giới hạn ẩn)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Boundary Value Analysis (biên `price` giá trị rất lớn — dò giới hạn ẩn / tràn số)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `999999999999` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Giá tiền** = `999999999999`, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.

## Expected result
Chấp nhận theo SRS (không quy định cận trên) — nhưng nên kiểm giá phi lý / tràn số khi tính tổng tiền.

## Actual result
Lưu OK, không chặn (không kiểm tra cận trên / tràn số).

## Status / Related bugs
Pass\* / (rủi ro: thiếu kiểm giá tối đa)
