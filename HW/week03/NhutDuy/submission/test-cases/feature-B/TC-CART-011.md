# TC-CART-011: Giỏ hàng trống

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Specification-based (sinh trực tiếp từ đặc tả, không từ phân vùng EP)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập; giỏ hàng đang **trống**.

## Test data
| Field | Value |
| --- | --- |
| Trạng thái giỏ | Trống (không có sản phẩm) |
| Mục kiểm | Hiển thị khi giỏ trống ở `/cart` |

## Test steps
1. Mở `/cart` khi giỏ đang trống.
2. Quan sát nội dung trang.

## Expected result
Có **hình minh họa** kèm thông báo rõ ràng cho trạng thái giỏ trống.

## Actual result
Chỉ hiển thị text "Giỏ hàng trống" — **thiếu hình minh họa**.

## Status / Related bugs
Fail / BUG-B6 (#56)
