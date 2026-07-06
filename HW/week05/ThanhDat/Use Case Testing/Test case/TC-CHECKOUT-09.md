# TC-CHECKOUT-09

## Requirement ID
FR-08

## Module / Test type / Technique
Checkout / Functional / Use Case Testing

## Test design source
Use Case/UC-CHECKOUT.md

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use Case Testing | FR08_UC_03 (EXC-1) |

## Detail
| ID | Test Objective | Các bước chính đi qua (Input) | Expected Output |
|---|---|---|---|
| FR08_UC_03 | Chưa đăng nhập không vào được trang/luồng Checkout | 1 (nhấn Thanh toán) và truy cập thẳng URL `/checkout` | Không hiển thị nội dung Checkout; điều hướng về trang Đăng nhập; không phát sinh yêu cầu tạo đơn hàng |

## Preconditions
1. Trình duyệt ở trạng thái chưa đăng nhập (không có JWT ở client).
2. Giỏ hàng có ít nhất 1 sản phẩm (hoặc truy cập thẳng URL Checkout).

## Test data
| Field | Value |
|---|---|
| Trạng thái đăng nhập | Chưa đăng nhập (không có JWT) |
| URL thử truy cập trực tiếp | `/checkout` |

## Test steps
1. Đảm bảo chưa đăng nhập (xóa token trong localStorage nếu cần).
2. Vào trang Giỏ hàng, nhấn nút "Thanh toán".
3. Quan sát hành vi điều hướng.
4. Thử nhập thẳng URL trang Checkout trên thanh địa chỉ trình duyệt.

## Expected results
1. Ở bước 2, hệ thống không cho vào Checkout mà điều hướng về trang Đăng nhập.
2. Ở bước 4, truy cập thẳng URL Checkout cũng bị chặn tương tự (không hiển thị nội dung Checkout).
3. Không có yêu cầu tạo đơn hàng nào được gửi lên server trong toàn bộ kịch bản.

## Actual results
1. **Thất bại:** Route `/checkout` **không có route guard** (`App.jsx:58` — khai báo trần, không bọc bảo vệ) và component `Checkout.jsx` không kiểm tra đăng nhập. Truy cập thẳng URL `/checkout` khi chưa đăng nhập vẫn **render trang Checkout**, không điều hướng về Đăng nhập — vi phạm FR-08 dòng 104. → `FR08-bug-04`.
2. **Thất bại:** Truy cập trực tiếp URL không bị chặn (như mục 1).
3. Đạt (một phần): Nếu người dùng bấm "Xác Nhận Thanh Toán" khi không có token, request gửi không kèm `Authorization` (`Checkout.jsx:50`) → backend trả 401 → không tạo đơn hàng. Nhưng bản thân trang Checkout vẫn truy cập được, nên guard ở tầng UI đã thất bại.

## Status
Failed
