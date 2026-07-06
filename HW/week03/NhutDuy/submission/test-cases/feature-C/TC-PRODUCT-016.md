# TC-PRODUCT-016: imageUrl không phải URL (giả định)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP12b — `imageUrl` không phải URL; giả định ngoài SRS)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.
- Lưu ý: ràng buộc URL là **giả định** (SRS không quy định cho `imageUrl`).

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `abc` (không phải URL) |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **URL Ảnh** = `abc`, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.
4. Quan sát hiển thị ảnh sản phẩm trong bảng / trang chi tiết.

## Expected result
(Giả định) nên validate URL hợp lệ; tối thiểu không được làm vỡ giao diện.

## Actual result
Lưu được; khi hiển thị, `onError` của ảnh kích hoạt → hiện **ảnh placeholder** (không vỡ UI) → chấp nhận được.

## Status / Related bugs
Pass\* / (giả định, ngoài SRS)
