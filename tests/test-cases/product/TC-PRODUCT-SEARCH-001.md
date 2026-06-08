# TC-PRODUCT-SEARCH-001: Tìm kiếm sản phẩm theo tên trên trang chủ

## Requirement ID
FR-05

## Module / Test type / Technique
Product Listing / Functional / Equivalence Partitioning

## Preconditions
- Backend API đang chạy tại `http://localhost:3000`.
- Frontend Web đang chạy tại `http://localhost:5173`.
- User đang ở trang Home.
- Cơ sở dữ liệu có ít nhất một sản phẩm có tên chứa từ khóa tìm kiếm.

## Test data
| Field | Value |
| --- | --- |
| Từ khóa tìm kiếm hợp lệ | laptop |
| Từ khóa không có kết quả | khongcosanphamxyz |
| Từ khóa kiểm tra an toàn hiển thị | `<script>alert(1)</script>` |

## Test steps
1. Mở trang Home.
2. Kiểm tra trang Home chỉ có đúng một thẻ `<h1>`.
3. Quan sát danh sách sản phẩm khi tải dữ liệu.
4. Nhập từ khóa tìm kiếm hợp lệ vào thanh tìm kiếm.
5. Kiểm tra danh sách sản phẩm sau khi tìm kiếm.
6. Nhập từ khóa không có kết quả.
7. Kiểm tra trạng thái empty state.
8. Nhập từ khóa kiểm tra an toàn hiển thị.

## Expected result
Trang chủ hiển thị danh sách sản phẩm dạng lưới, mỗi sản phẩm có ảnh với alt text, tên, giá có ký hiệu `₫` và phân cách hàng nghìn. Khi tìm kiếm hợp lệ, hệ thống chỉ hiển thị sản phẩm phù hợp theo tên. Khi không có kết quả, hệ thống hiển thị empty state phù hợp. Từ khóa tìm kiếm được hiển thị an toàn, không render HTML hoặc thực thi script.

## Status / Related bugs
Not Run / None
