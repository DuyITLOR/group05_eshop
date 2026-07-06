# TC-CART-UC-04: Giảm số lượng khi đang = 1 → giữ 1 (Extension 5a)

## Requirement ID
FR-07 (tham chiếu FR-06: số lượng tối thiểu = 1)

## Module / Test type / Technique
Cart / Functional / Use-Case

## Test design source
Use Case/UC-CART.md — Extension 5a

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use-Case | Extension 5a (giảm số lượng tại biên = 1) |

## Detail
| ID | Test Objective | Input | Expected Output |
|---|---|---|---|
| TC-CART-UC-04 | Bấm − khi số lượng dòng = 1 | SP A, qty = 1 | Số lượng giữ nguyên 1, không về 0, không xóa dòng |

## Preconditions
1. Giỏ hàng có SP A với số lượng = 1.
2. Đang ở trang Giỏ hàng.

## Test steps
1. Trên dòng SP A, bấm nút **−**.

## Expected results
1. Số lượng **giữ nguyên 1** (không giảm về 0).
2. Nút **−** vô hiệu hoặc không có tác dụng tại biên = 1.
3. Dòng A **vẫn còn** trong giỏ (không tự xóa).

## Actual results
1. **Không có nút −** trong giỏ → không thực hiện được thao tác giảm số lượng (không kiểm được biên = 1).

## Status
Blocked

## Related bugs
BUG-CART-02
