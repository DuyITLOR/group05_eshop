# TC-CHECKOUT-11

## Requirement ID
FR-08

## Module / Test type / Technique
Checkout / Functional / Use Case Testing

## Test design source
Use Case/UC-CHECKOUT.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use Case Testing | FR08_UC_05 (EXC-3) |

## Detail
| ID | Test Objective | Các bước chính đi qua (Input) | Expected Output |
|---|---|---|---|
| FR08_UC_05 | Gọi API checkout với JWT sai/hết hạn bị từ chối | Bước 3 — gọi `POST /api/checkout` với token không hợp lệ | HTTP 401/403; không tạo đơn hàng |

## Preconditions
1. Backend đang chạy tại `http://localhost:3000`.
2. Có công cụ gọi API trực tiếp.

## Test data
| Field | Value |
|---|---|
| Endpoint | `POST http://localhost:3000/api/checkout` |
| Header Authorization | `Bearer invalid.jwt.token` (chuỗi token sai chữ ký / hết hạn) |
| Body | `{ "total_amount": 200000, "shipping_address": "123 Nguyễn Văn Cừ, Q5" }` |

## Test steps
1. Gửi request `POST /api/checkout` với header `Authorization: Bearer invalid.jwt.token` và body như Test data.
2. Ghi nhận HTTP status code và nội dung response.
3. Kiểm tra xem có đơn hàng mới nào được tạo không.

## Expected results
1. Response trả về HTTP 401 Unauthorized hoặc 403 Forbidden.
2. Không có đơn hàng mới nào được tạo trong hệ thống.

## Actual results
1. Đạt: Với token sai chữ ký/hết hạn, `jwt.verify` gọi callback với `err` → middleware trả về **HTTP 403 `{ error: "Forbidden" }`** (`server.js:105–106`). Nằm trong dải 401/403 mà test case chấp nhận.
2. Đạt: Request bị chặn tại middleware → không tạo đơn hàng.

## Status
Passed
