# TC-PRODUCT-010: Xem danh sách sản phẩm

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng `productOp = read`)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Trong hệ thống có sẵn các sản phẩm.

## Test data
| Field | Value |
| --- | --- |
| name | `—` |
| price | `—` |
| category_id | `—` |
| imageUrl | `—` |
| description | `—` |

## Test steps
1. Mở tab **Sản phẩm**.
2. Quan sát bảng danh sách sản phẩm.

## Expected result
Hiển thị đầy đủ danh sách sản phẩm hiện có (tên/giá/danh mục).

## Actual result
`GET /api/products` render đầy đủ danh sách sản phẩm.

## Status / Related bugs
Pass / None
