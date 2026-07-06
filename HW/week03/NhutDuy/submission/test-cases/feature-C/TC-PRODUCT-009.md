# TC-PRODUCT-009: Xóa 1 sản phẩm

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng `productOp = delete`)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.
- Trong hệ thống có **ít nhất 2 sản phẩm**.

## Test data
| Field | Value |
| --- | --- |
| name | `—` |
| price | `—` |
| category_id | `—` |
| imageUrl | `—` |
| description | `—` |
| sản phẩm xóa | SP #2 |

## Test steps
1. Tab **Sản phẩm**, xác định SP #2 trong bảng danh sách.
2. Bấm **Xóa** ở sản phẩm #2 (hoặc gửi request `DELETE /api/products/2`).
3. Quan sát bảng danh sách sản phẩm.

## Expected result
SP #2 biến mất khỏi danh sách, các sản phẩm khác vẫn còn.

## Actual result
`DELETE /api/products/2` → xóa đúng sản phẩm #2, các sản phẩm khác giữ nguyên.

## Status / Related bugs
Pass / None
