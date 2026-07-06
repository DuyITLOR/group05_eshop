# Decision Table — FR-09: Apply Coupon

---

## Bảng đầy đủ

Do cấu trúc guard clause tuần tự, 57 trong 64 tổ hợp là impossible. Chỉ có **7 rule có nghĩa**:

| | **R1** | **R2** | **R3** | **R4** | **R5** | **R6** | **R7** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **C1: code cung cấp** | **N** | Y | Y | Y | Y | Y | Y |
| **C2: coupon tồn tại & active** | - | **N** | Y | Y | Y | Y | Y |
| **C3: total > min_order** | - | - | **N** | Y | Y | Y | Y |
| **C4: coupon chưa hết hạn** | - | - | - | **N** | Y | Y | Y |
| **C5: user_id cung cấp** | - | - | - | - | **N** | Y | Y |
| **C6: usage < max_uses** | - | - | - | - | - | **N** | Y |
| **A1: 400 "Nhập mã"** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **A2: 404 "Không tồn tại"** | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **A3: 400 "Chưa đủ tối thiểu"** | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| **A4: 400 "Hết hạn"** | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| **A5: 400 "Đã đạt giới hạn"** | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| **A6: 200 Thành công** | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ |

**Impossible rules đã loại (57 rules):**  
- C1=N → C2–C6 đều don't care (endpoint dừng tại guard C1)
- C2=N → C3–C6 đều don't care; v.v. theo từng tầng guard

---

## Sau rút gọn

Bảng **không rút gọn thêm được** — mỗi rule có đúng một action riêng biệt, không có cặp nào chia sẻ cùng tập action mà chỉ khác don't-care.

> **Kết quả: 7 rule → 7 test case tối thiểu.**

---

## Truy vết Rule ↔ Test Case

| Rule | Tóm tắt tổ hợp | Test Case |
|------|----------------|-----------|
| R1 | code bị thiếu | [TC-COUPON-001](../TestCase/TC-COUPON-001.md) |
| R2 | code không tồn tại hoặc đã vô hiệu hoá | [TC-COUPON-002](../TestCase/TC-COUPON-002.md) |
| R3 | Coupon hợp lệ nhưng đơn hàng chưa đủ tối thiểu | [TC-COUPON-003](../TestCase/TC-COUPON-003.md) |
| R4 | Coupon hợp lệ, đơn đủ tiền, nhưng coupon hết hạn | [TC-COUPON-004](../TestCase/TC-COUPON-004.md) |
| R5 | Coupon hợp lệ, đơn đủ tiền, chưa hết hạn, không có user_id | [TC-COUPON-005](../TestCase/TC-COUPON-005.md) |
| R6 | Coupon hợp lệ, đơn đủ tiền, chưa hết hạn, user đã dùng hết lượt | [TC-COUPON-006](../TestCase/TC-COUPON-006.md) |
| R7 | Tất cả điều kiện hợp lệ — happy path | [TC-COUPON-007](../TestCase/TC-COUPON-007.md) |
