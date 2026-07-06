# TC-CHECKOUT-10

## Requirement ID
FR-08

## Module / Test type / Technique
Checkout / Functional / Use Case Testing

## Test design source
Use Case/UC-CHECKOUT.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use Case Testing | FR08_UC_04 (EXC-2) |

## Detail
| ID | Test Objective | Các bước chính đi qua (Input) | Expected Output |
|---|---|---|---|
| FR08_UC_04 | Gọi thẳng API checkout không kèm token bị từ chối | Bước 3 — gọi `POST /api/checkout` không header `Authorization` | HTTP 401 Unauthorized; không tạo đơn hàng |

## Preconditions
1. Backend đang chạy tại `http://localhost:3000`.
2. Có công cụ gọi API trực tiếp (Playwright request / curl / Postman).

## Test data
| Field | Value |
|---|---|
| Endpoint | `POST http://localhost:3000/api/checkout` |
| Header Authorization | (không gửi) |
| Body | `{ "total_amount": 200000, "shipping_address": "123 Nguyễn Văn Cừ, Q5" }` |

## Test steps
1. Gửi request `POST /api/checkout` với body như Test data, **không** kèm header `Authorization`.
2. Ghi nhận HTTP status code và nội dung response.
3. Kiểm tra danh sách đơn hàng (`GET /api/orders/my-orders` với tài khoản hợp lệ, hoặc kiểm tra DB) xem có đơn mới nào được tạo không.

## Expected results
1. Response trả về HTTP 401 Unauthorized (hoặc mã lỗi từ chối truy cập tương đương).
2. Không có đơn hàng mới nào được tạo trong hệ thống.

## Actual results
1. Đạt: `POST /api/checkout` đi qua middleware `authenticateToken`; khi không có header `Authorization`, `token == null` → trả về **HTTP 401 `{ error: "Unauthorized" }`** (`server.js:100–110, 297`).
2. Đạt: Không có lệnh `INSERT INTO orders` nào được thực thi vì request bị chặn tại middleware trước khi vào handler → không tạo đơn hàng.

## Status
Passed
