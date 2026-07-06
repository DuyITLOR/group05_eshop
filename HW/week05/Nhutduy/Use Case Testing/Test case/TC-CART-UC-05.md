# TC-CART-UC-05: Hủy trong dialog xác nhận xóa → giữ nguyên (Extension 8a)

## Requirement ID
FR-07 (tham chiếu FR-24)

## Module / Test type / Technique
Cart / Functional / Use-Case

## Test design source
Use Case/UC-CART.md — Extension 8a

## Coverage
| Coverage Type | Covered IDs |
|---|---|
| Use-Case | Extension 8a (hủy xóa) |

## Detail
| ID | Test Objective | Input | Expected Output |
|---|---|---|---|
| TC-CART-UC-05 | Bấm Xóa rồi Hủy trong dialog | SP A trong giỏ | Dialog đóng, SP A vẫn còn |

## Preconditions
1. Giỏ hàng có SP A.
2. Đang ở trang Giỏ hàng.

## Test steps
1. Trên dòng SP A, bấm nút **Xóa** → xuất hiện dialog xác nhận.
2. Trong dialog, bấm **Hủy**.

## Expected results
1. Dialog xác nhận **đóng lại**.
2. SP A **vẫn còn** trong giỏ (không bị xóa); tổng không đổi.

## Actual results
_(Chưa thực thi — điền khi chạy kiểm thử)_

## Status
Not Run

## Related bugs
_(điền khi chạy)_
