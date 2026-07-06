# TC-PRODUCT-005: Giá âm

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP6 — `price` âm < 0)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.
- Lưu ý: nếu UI ô số chặn dấu trừ, kiểm trực tiếp qua API `POST /api/products`.

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `-1000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Giá tiền** = `-1000`, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm** (hoặc gửi request API).

## Expected result
Từ chối tạo sản phẩm vì giá phải là số dương (> 0).

## Actual result
Không validate → **tạo sản phẩm với giá âm**.

## Status / Related bugs
Fail / BUG-C1
