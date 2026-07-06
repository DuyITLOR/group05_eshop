# TC-PRODUCT-002: Tên rỗng

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP2 — `name` rỗng / chỉ khoảng trắng)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.
- Lưu ý: UI có thuộc tính `required` chặn submit. Để kiểm hành vi backend cần gọi thẳng API `POST /api/products`.

## Test data
| Field | Value |
| --- | --- |
| name | `""` (rỗng) |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `Mô tả` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Để trống ô **Tên sản phẩm**, nhập các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm** (hoặc gửi request API `POST /api/products` với `name=""`).

## Expected result
Từ chối tạo sản phẩm vì tên là trường bắt buộc.

## Actual result
UI `required` chặn submit → từ chối **đúng**; nhưng khi gọi **API trực tiếp**, backend **vẫn tạo** sản phẩm với tên rỗng.

## Status / Related bugs
Pass † / (API: BUG-C4)
