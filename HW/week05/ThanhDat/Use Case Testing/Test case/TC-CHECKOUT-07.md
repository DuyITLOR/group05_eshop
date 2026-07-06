# TC-CHECKOUT-07

## Requirement ID
FR-08

## Module / Test type / Technique
Checkout / Functional / Use Case Testing

## Test design source
Use Case/UC-CHECKOUT.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use Case Testing | FR08_UC_01 (Basic Flow) |

## Detail
| ID | Test Objective | Các bước chính đi qua (Input) | Expected Output |
|---|---|---|---|
| FR08_UC_01 | Đặt hàng thành công end-to-end với tổng tiền đúng | 1→2→3→4→5 (login → Checkout → nhập địa chỉ, đặt hàng → tạo đơn → xóa giỏ) | Trang Checkout hiển thị đủ sản phẩm + tổng tiền không sửa được; đơn tạo `status=pending`, `total_amount` đúng theo giỏ; giỏ hàng rỗng sau đó |

## Preconditions
1. Tài khoản User test tồn tại: `test@eshop.com` / `Test1234!`.
2. Người dùng đã đăng nhập thành công (có JWT hợp lệ).
3. Giỏ hàng có ít nhất 2 sản phẩm với số lượng khác nhau.

## Test data
| Field | Value |
|---|---|
| Tài khoản | `test@eshop.com` / `Test1234!` |
| Giỏ hàng | 2 sản phẩm (ví dụ: SP A x2, SP B x1) |
| Địa chỉ giao hàng | 123 Nguyễn Văn Cừ, Q5, TP.HCM |

## Test steps
1. Đăng nhập với tài khoản `test@eshop.com`.
2. Thêm 2 sản phẩm vào giỏ hàng như Test data.
3. Vào trang Giỏ hàng, nhấn "Thanh toán".
4. Quan sát trang Checkout: danh sách sản phẩm và tổng tiền.
5. Thử chỉnh sửa trực tiếp ô tổng tiền (nếu có).
6. Nhập địa chỉ giao hàng, nhấn nút xác nhận đặt hàng.
7. Sau khi đặt hàng thành công, quay lại trang Giỏ hàng (hoặc gọi `GET /api/cart`).

## Expected results
1. Trang Checkout hiển thị đầy đủ các sản phẩm với đơn giá và số lượng khớp giỏ hàng.
2. Tổng tiền hiển thị đúng và không có ô cho phép chỉnh sửa trực tiếp.
3. Đặt hàng thành công; đơn hàng mới có `status = pending` và `total_amount` khớp tổng giỏ hàng.
4. Giỏ hàng sau khi đặt hàng thành công là rỗng (cả trên UI lẫn qua API).

## Actual results
1. Đạt: Trang Checkout hiển thị đầy đủ danh sách sản phẩm (`frontend-web/src/pages/Checkout.jsx:84–88`).
2. **Thất bại:** Tổng tiền được render trong ô `<input type="number">` **cho phép chỉnh sửa trực tiếp** (`Checkout.jsx:93–102`), vi phạm FR-08 dòng 105 ("không cho phép người dùng chỉnh sửa trực tiếp"). → `FR08-bug-02`.
3. Đạt (một phần): Đơn hàng tạo với `status = "pending"` (`server.js:303`); nếu người dùng không sửa tổng thì `total_amount` lưu khớp giỏ hàng. Tuy nhiên backend KHÔNG tự tính lại tổng (xem TC-CHECKOUT-12/13).
4. **Thất bại:** Giỏ hàng **không** bị xóa sau khi thanh toán — `handleCheckout` không gọi `clearCart()` (`Checkout.jsx:40–66`) và backend không xóa `userCarts` (`server.js:297–309`), vi phạm FR-08 dòng 108. → `FR08-bug-03`.

## Status
Failed
