# TC-CHECKOUT-08

## Requirement ID
FR-08

## Module / Test type / Technique
Checkout / Functional / Use Case Testing

## Test design source
Use Case/UC-CHECKOUT.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use Case Testing | FR08_UC_02 (ALT-1) |

## Detail
| ID | Test Objective | Các bước chính đi qua (Input) | Expected Output |
|---|---|---|---|
| FR08_UC_02 | Guest được điều hướng đăng nhập rồi hoàn tất thanh toán | 1→(chặn)→login→2→3→4→5 | Bị đưa về trang Đăng nhập khi nhấn Thanh toán lúc chưa đăng nhập; sau khi đăng nhập vào được Checkout và đặt hàng thành công |

## Preconditions
1. Trình duyệt ở trạng thái **chưa đăng nhập** (đã đăng xuất / xóa token phía client).
2. Giỏ hàng (ẩn danh hoặc sau khi đăng nhập) có ít nhất 1 sản phẩm.
3. Tài khoản User test tồn tại: `test@eshop.com` / `Test1234!`.

## Test data
| Field | Value |
|---|---|
| Trạng thái ban đầu | Chưa đăng nhập |
| Tài khoản đăng nhập | `test@eshop.com` / `Test1234!` |
| Giỏ hàng | ≥ 1 sản phẩm |
| Địa chỉ giao hàng | 123 Nguyễn Văn Cừ, Q5, TP.HCM |

## Test steps
1. Đảm bảo đang ở trạng thái chưa đăng nhập.
2. Thêm 1 sản phẩm vào giỏ, vào trang Giỏ hàng, nhấn "Thanh toán".
3. Quan sát hành vi điều hướng.
4. Đăng nhập bằng tài khoản `test@eshop.com`.
5. Tiếp tục vào trang Checkout, nhập địa chỉ giao hàng, xác nhận đặt hàng.
6. Kiểm tra kết quả đặt hàng và trạng thái giỏ hàng.

## Expected results
1. Ở bước 3, hệ thống không cho vào Checkout mà điều hướng về trang Đăng nhập.
2. Sau khi đăng nhập thành công (bước 4), người dùng vào được trang Checkout.
3. Đặt hàng thành công; đơn hàng mới có `status = pending`, `total_amount` khớp giỏ hàng.
4. Giỏ hàng rỗng sau khi đặt hàng thành công.

## Actual results
1. Đạt: Khi chưa đăng nhập, nhấn "Tiến hành thanh toán" ở trang Giỏ hàng → hiển thị `alert("Bạn cần đăng nhập để thanh toán!")` và điều hướng về `/login` (`Cart.jsx:11–18`).
2. Đạt: Sau khi đăng nhập, người dùng vào lại giỏ và tiến hành checkout được (giỏ hàng lưu ở client, không mất khi điều hướng — `CartContext.jsx`).
3. Đạt (một phần): Đơn hàng tạo với `status = "pending"`; total lưu theo giá trị client gửi (server không tính lại — xem TC-CHECKOUT-12/13).
4. **Thất bại:** Giỏ hàng không bị xóa sau khi đặt hàng thành công (cùng nguyên nhân TC-CHECKOUT-07 — `handleCheckout` không gọi `clearCart()`), vi phạm FR-08 dòng 108. → `FR08-bug-03`.

## Status
Failed
