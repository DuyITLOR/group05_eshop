# TC-CART-009: Nhãn tổng tiền của giỏ

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Specification-based (sinh trực tiếp từ đặc tả, không từ phân vùng EP)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập; giỏ hàng có ít nhất 1 sản phẩm.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max (có trong giỏ) |
| Mục kiểm | Nhãn tổng tiền hiển thị ở `/cart` |

## Test steps
1. Mở `/cart` khi giỏ có hàng.
2. Quan sát nhãn hiển thị bên cạnh tổng tiền.

## Expected result
Nhãn tổng tiền hiển thị **"Tổng cộng"** (theo SRS FR-07).

## Actual result
Nhãn hiển thị **"Tổng tạm tính"** thay vì "Tổng cộng".

## Status / Related bugs
Fail / BUG-B4 (#54)
