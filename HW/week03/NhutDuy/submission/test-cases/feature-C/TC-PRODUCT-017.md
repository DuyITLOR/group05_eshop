# TC-PRODUCT-017: description chứa HTML/script (XSS probe, giả định)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP13b — `description` chứa HTML/script; giả định ngoài SRS)

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy.
- Đã đăng nhập admin (`admin@eshop.com` / `Admin123!`).
- Đang ở tab **Sản phẩm**.
- Lưu ý: ràng buộc escape HTML là **giả định** (SRS không quy định cho `description`).

## Test data
| Field | Value |
| --- | --- |
| name | `Laptop Test` |
| price | `1000000` |
| category_id | `1` (danh mục tồn tại) |
| imageUrl | `https://img.co` |
| description | `<script>alert(1)</script>` |

## Test steps
1. Mở tab **Sản phẩm** → form "Thêm sản phẩm mới".
2. Nhập **Mô tả** = `<script>alert(1)</script>`, các trường còn lại theo Test data.
3. Bấm **Lưu sản phẩm**.
4. Mở trang chi tiết sản phẩm và quan sát phần mô tả.

## Expected result
(Giả định) escape nội dung, không thực thi script.

## Actual result
ProductDetail render `{description}` (JSX **auto-escape**) → hiện nguyên văn, **không chạy script** → an toàn.

## Status / Related bugs
Pass / (XSS thật ở `shipping_address`/`search` — ngoài FR-15)
