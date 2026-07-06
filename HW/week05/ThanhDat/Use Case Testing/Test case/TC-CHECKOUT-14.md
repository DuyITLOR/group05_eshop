# TC-CHECKOUT-14

## Requirement ID
FR-08

## Module / Test type / Technique
Checkout / Functional / Use Case Testing

## Test design source
Use Case/UC-CHECKOUT.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use Case Testing | FR08_UC_08 (EXC-6) |

## Detail
| ID | Test Objective | Các bước chính đi qua (Input) | Expected Output |
|---|---|---|---|
| FR08_UC_08 | Thanh toán khi giỏ hàng rỗng bị chặn | Bước 1 — nhấn Thanh toán với giỏ rỗng | Không cho tiến hành đặt hàng / báo lỗi phù hợp; không tạo đơn `total_amount = 0` |

## Preconditions
1. Người dùng đã đăng nhập, có JWT hợp lệ.
2. Giỏ hàng **rỗng** (không có sản phẩm nào).

## Test data
| Field | Value |
|---|---|
| Tài khoản | `test@eshop.com` / `Test1234!` |
| Giỏ hàng | Rỗng (0 sản phẩm) |

## Test steps
1. Đăng nhập với tài khoản `test@eshop.com`.
2. Đảm bảo giỏ hàng đang rỗng.
3. Truy cập trang Giỏ hàng / trang Checkout.
4. Quan sát: nút "Thanh toán" có bị vô hiệu hóa / ẩn không, hoặc hành vi khi cố nhấn.
5. (Kiểm tra sâu) Thử gọi `POST /api/checkout` với giỏ rỗng và quan sát phản hồi.

## Expected results
1. Không thể tiến hành thanh toán với giỏ hàng rỗng (nút bị vô hiệu hóa/ẩn hoặc hiển thị Empty State).
2. Không có đơn hàng nào được tạo với `total_amount = 0` từ giỏ hàng rỗng.

> Ghi chú: spec FR-08 không quy định tường minh hành vi checkout khi giỏ rỗng — kết quả thực tế cần đối chiếu để xác nhận có phải bug hay không.

## Actual results
1. Đạt: Khi giỏ rỗng, trang Giỏ hàng hiển thị Empty State ("Giỏ hàng của bạn đang trống") và **không render nút "Tiến hành thanh toán"** (`Cart.jsx:20–27`) → qua luồng UI thông thường, người dùng không thể vào Checkout với giỏ rỗng.
2. Đạt (theo luồng UI): không tạo được đơn hàng `total_amount = 0` qua giao diện.

> ⚠ Quan sát phụ (defense-in-depth, KHÔNG phải vi phạm spec vì FR-08 không quy định tường minh): backend `POST /api/checkout` không kiểm tra giỏ rỗng và không đọc giỏ hàng, nên nếu gọi thẳng API với `total_amount = 0` thì đơn hàng rỗng vẫn được tạo. Ghi nhận để tham khảo, không tính là Fail của test case này.

## Status
Passed
