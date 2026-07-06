# TC-CHECKOUT-12

## Requirement ID
FR-08

## Module / Test type / Technique
Checkout / Functional / Use Case Testing

## Test design source
Use Case/UC-CHECKOUT.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use Case Testing | FR08_UC_06 (EXC-4) |

## Detail
| ID | Test Objective | Các bước chính đi qua (Input) | Expected Output |
|---|---|---|---|
| FR08_UC_06 | Client gửi `total_amount` thấp hơn thực tế → server phải tự tính lại | Bước 3→4 với payload `total_amount` bị sửa nhỏ hơn tổng giỏ thật | Đơn hàng được tạo nhưng `total_amount` lưu = giá trị **server tính lại** từ giỏ hàng, KHÔNG theo giá trị client gửi |

## Preconditions
1. Người dùng đã đăng nhập, có JWT hợp lệ.
2. Giỏ hàng có tổng giá trị thật xác định được (ví dụ 220,000₫).
3. Có công cụ gọi API trực tiếp để sửa payload.

## Test data
| Field | Value |
|---|---|
| Tài khoản | `test@eshop.com` / `Test1234!` |
| Tổng giỏ hàng thật | 220,000₫ |
| `total_amount` client gửi (sửa thấp) | 1,000₫ |
| Endpoint | `POST http://localhost:3000/api/checkout` |
| Body | `{ "total_amount": 1000, "shipping_address": "123 Nguyễn Văn Cừ, Q5" }` |

## Test steps
1. Đăng nhập, thêm sản phẩm vào giỏ sao cho tổng thật = 220,000₫.
2. Lấy JWT hợp lệ của phiên đăng nhập.
3. Gửi `POST /api/checkout` với `total_amount = 1000` (thấp hơn thực tế) kèm token hợp lệ.
4. Ghi nhận response (`orderId`).
5. Gọi `GET /api/orders/:id` (hoặc `GET /api/orders/my-orders`) để xem `total_amount` thực tế được lưu.

## Expected results
1. Đơn hàng được tạo với `status = pending`.
2. `total_amount` lưu trong đơn = **220,000₫** (server tính lại từ giỏ), KHÔNG phải 1,000₫ do client gửi.

## Actual results
1. Đạt: Đơn hàng được tạo với `status = "pending"`.
2. **Thất bại:** `POST /api/checkout` lấy thẳng `total_amount` từ `req.body` và `INSERT` nguyên giá trị đó vào bảng `orders`, **không đọc giỏ hàng, không tính lại** (`server.js:299–303`). Với payload `total_amount = 1000`, đơn hàng lưu `total_amount = 1000` thay vì 220,000 → vi phạm FR-08 dòng 107. → `FR08-bug-01` (bug nghiêm trọng: người dùng tự đặt giá tiền tùy ý).

## Status
Failed
