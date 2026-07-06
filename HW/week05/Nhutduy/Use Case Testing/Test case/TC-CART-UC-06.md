# TC-CART-UC-06: Kiểm hiển thị giỏ — nhãn "Tổng cộng" & đủ cột (bước 4)

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Use-Case

## Test design source
Use Case/UC-CART.md — Main Success Scenario, bước 4 (bất biến hiển thị)

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use-Case | Bước 4 — bất biến hiển thị giỏ |

## Detail
| ID | Test Objective | Input | Expected Output |
|---|---|---|---|
| TC-CART-UC-06 | Kiểm cột hiển thị và nhãn tổng | Giỏ có ≥ 1 sản phẩm | Đủ 5 cột; nhãn tổng đúng "Tổng cộng" |

## Preconditions
1. Giỏ hàng có ít nhất 1 sản phẩm.

## Test steps
1. Mở trang **Giỏ hàng**.
2. Quan sát tiêu đề các cột và khu vực tổng tiền.

## Expected results
1. Bảng có đủ **5 cột**: Sản phẩm, Đơn giá, Số lượng (có nút +/-), Thành tiền, Thao tác.
2. Nhãn tổng tiền là **"Tổng cộng"** (đúng spec, **không** phải "Tổng tạm tính").

## Actual results
1. Nhãn tổng là **"Tổng tạm tính"** (sai, phải là "Tổng cộng") — BUG-CART-04.
2. Cột Số lượng **không có nút +/-** — BUG-CART-02.

## Status
Failed

## Related bugs
BUG-CART-04, BUG-CART-02
