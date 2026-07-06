# TC-CART-UC-01: Luồng chính — xem & chỉnh sửa giỏ hàng (Main Success Scenario)

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Use-Case

## Test design source
Use Case/UC-CART.md — Main Success Scenario

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use-Case | Main Success Scenario (bước 1–10) |

## Detail
| ID | Test Objective | Input | Expected Output |
|---|---|---|---|
| TC-CART-UC-01 | Thực hiện trọn luồng: thêm → xem → chỉnh số lượng → xóa (xác nhận) → tiếp tục mua sắm | SP A, SP B | Giỏ phản ánh đúng từng thao tác; hiển thị đủ cột + "Tổng cộng" |

## Preconditions
1. Backend (`:3000`) và frontend-web (`:5173`) đang chạy.
2. Có sẵn ít nhất 2 sản phẩm A, B.
3. Giỏ hàng đang trống.

## Test data
| Field | Value |
|---|---|
| Sản phẩm | A, B |
| Số lượng ban đầu | A = 1 |

## Test steps
1. Mở trang chi tiết SP A, bấm **Thêm vào giỏ hàng**.
2. Kiểm tra **badge số lượng** trên navbar tăng.
3. Mở trang **Giỏ hàng**.
4. Kiểm tra bảng có đủ cột: Sản phẩm, Đơn giá, Số lượng (có +/-), Thành tiền, Thao tác; và nhãn **"Tổng cộng"**.
5. Bấm **+** trên dòng A → số lượng = 2.
6. Bấm **Xóa** trên dòng A → xuất hiện **dialog xác nhận** → bấm **Xác nhận**.
7. Bấm **"Tiếp tục mua sắm"**.

## Expected results
1. SP A được thêm; badge số lượng cập nhật (bước 2).
2. Trang giỏ hiển thị **đủ 5 cột** và nhãn **"Tổng cộng"** (bước 4).
3. Bấm **+** → số lượng A = 2, Thành tiền và Tổng cộng cập nhật đúng (bước 5–6).
4. Bấm **Xóa** → có **dialog xác nhận**; sau **Xác nhận** SP A bị xóa, tổng cập nhật (bước 7–9).
5. Bấm **"Tiếp tục mua sắm"** → quay về trang chủ (bước 10).

## Actual results
_(Chưa thực thi — điền khi chạy kiểm thử. Ghi rõ bước đầu tiên bị sai nếu có.)_

## Status
Not Run

## Related bugs
_(điền khi chạy)_
