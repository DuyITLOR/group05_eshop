# TC-CART-UC-02: Thêm lại sản phẩm đã có → tăng số lượng (Extension 1a)

## Requirement ID
FR-07

## Module / Test type / Technique
Cart / Functional / Use-Case

## Test design source
Use Case/UC-CART.md — Extension 1a

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use-Case | Extension 1a (thêm lại sản phẩm đã có) |

## Detail
| ID | Test Objective | Input | Expected Output |
|---|---|---|---|
| TC-CART-UC-02 | Thêm lại SP đã có trong giỏ | SP A đã có (qty=1), thêm lại A | Cùng 1 dòng A, số lượng = 2, không tạo dòng mới |

## Preconditions
1. Giỏ hàng đang có SP A với số lượng = 1.

## Test data
| Field | Value |
|---|---|
| Sản phẩm | A (đã có trong giỏ) |

## Test steps
1. Mở lại trang chi tiết SP A, bấm **Thêm vào giỏ hàng**.
2. Mở trang Giỏ hàng.

## Expected results
1. Giỏ vẫn có **đúng 1 dòng** SP A (không phát sinh dòng thứ 2).
2. Số lượng dòng A **tăng thành 2**; Thành tiền và Tổng cộng cập nhật.

## Actual results
_(Chưa thực thi — điền khi chạy kiểm thử)_

## Status
Not Run

## Related bugs
_(điền khi chạy)_
