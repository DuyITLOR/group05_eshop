# DTT-FR09: Test Design — Mã Giảm Giá (Coupon)

**Phương pháp:** Decision table & Pairwise testing  
**Yêu cầu tham chiếu:** FR-09 (Mã Giảm Giá)

---

## 1. Xác định điều kiện & kết quả

### Áp dụng mã giảm giá tại Checkout

#### Điều kiện:

| Tên điều kiện | Số loại giá trị | Chi tiết giá trị |
|---|---|---|
| C1: Mã tồn tại và đang hoạt động | 2 | T: Mã có trong CSDL và `is_active = 1`<br>F: Mã không tồn tại hoặc `is_active = 0` |
| C2: Còn hạn sử dụng | 2 | T: Ngày hiện tại trước `expired_at`<br>F: Ngày hiện tại >= `expired_at` |
| C3: Đủ ngưỡng đơn hàng | 2 | T: Tổng đơn hàng >= `min_order_amount`<br>F: Tổng đơn hàng < `min_order_amount` |
| C4: Đã đăng nhập | 2 | T: Người dùng có JWT Token hợp lệ<br>F: Không có JWT Token hoặc token không hợp lệ |
| C5: Chưa dùng hết lượt | 2 | T: Số lần đã dùng < `max_uses_per_user`<br>F: Số lần đã dùng >= `max_uses_per_user` |

#### Kết quả:

| Tên kết quả | Mô tả |
|---|---|
| R1: Áp dụng giảm giá thành công | Hệ thống tính `discount_amount` và `final_amount` theo công thức, hiển thị giá sau giảm |
| R2: Từ chối — mã không tồn tại/không hoạt động | Hiển thị thông báo lỗi mã không hợp lệ |
| R3: Từ chối — mã hết hạn | Hiển thị thông báo lỗi mã đã hết hạn |
| R4: Từ chối — chưa đủ ngưỡng đơn hàng | Hiển thị thông báo lỗi đơn hàng chưa đạt ngưỡng tối thiểu |
| R5: Từ chối — chưa đăng nhập | Yêu cầu đăng nhập trước khi áp dụng mã |
| R6: Từ chối — đã dùng hết lượt | Hiển thị thông báo lỗi đã sử dụng hết số lần cho phép |

=> Tổng số rules = 2 × 2 × 2 × 2 × 2 = 32

---

## 2. Decision Table (đầy đủ)

### Bảng 1 (Rules 1–10)

| ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|----|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | |
| C1: Mã tồn tại | T | T | T | T | T | T | T | T | T | T |
| C2: Còn hạn | T | T | T | T | T | T | T | T | F | F |
| C3: Đủ ngưỡng | T | T | T | T | F | F | F | F | T | T |
| C4: Đã đăng nhập | T | T | F | F | T | T | F | F | T | T |
| C5: Chưa hết lượt | T | F | T | F | T | F | T | F | T | F |
| **Kết quả** | | | | | | | | | | |
| R1: Áp dụng thành công | X | | | | | | | | | |
| R2: Mã không tồn tại | | | | | | | | | | |
| R3: Mã hết hạn | | | | | | | | | X | X |
| R4: Chưa đủ ngưỡng | | | | | X | X | | | | |
| R5: Chưa đăng nhập | | | X | X | | | X | X | | |
| R6: Hết lượt | | X | | | | | | | | |
| Impossible | | | | X | | X | | X | | X |

### Bảng 2 (Rules 11–20)

| ID | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|----|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | |
| C1: Mã tồn tại | T | T | T | T | T | T | F | F | F | F |
| C2: Còn hạn | F | F | F | F | F | F | T | T | T | T |
| C3: Đủ ngưỡng | T | T | F | F | F | F | T | T | T | T |
| C4: Đã đăng nhập | F | F | T | T | F | F | T | T | F | F |
| C5: Chưa hết lượt | T | F | T | F | T | F | T | F | T | F |
| **Kết quả** | | | | | | | | | | |
| R1: Áp dụng thành công | | | | | | | | | | |
| R2: Mã không tồn tại | | | | | | | | | | |
| R3: Mã hết hạn | | | X | X | | | | | | |
| R4: Chưa đủ ngưỡng | | | | | | | | | | |
| R5: Chưa đăng nhập | X | X | | | X | X | | | X | X |
| R6: Hết lượt | | | | | | | | | | |
| Impossible | | X | | X | | X | | | | |

### Bảng 3 (Rules 21–30)

| ID | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|----|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | |
| C1: Mã tồn tại | F | F | F | F | F | F | F | F | F | F |
| C2: Còn hạn | T | T | T | T | F | F | F | F | F | F |
| C3: Đủ ngưỡng | F | F | F | F | T | T | T | T | F | F |
| C4: Đã đăng nhập | T | T | F | F | T | T | F | F | T | T |
| C5: Chưa hết lượt | T | F | T | F | T | F | T | F | T | F |
| **Kết quả** | | | | | | | | | | |
| R1: Áp dụng thành công | | | | | | | | | | |
| R2: Mã không tồn tại | X | X | | | X | X | | | | |
| R3: Mã hết hạn | | | | | | | | | | |
| R4: Chưa đủ ngưỡng | | | | | | | | | | |
| R5: Chưa đăng nhập | | | X | X | | | X | X | X | X |
| R6: Hết lượt | | | | | | | | | | |
| Impossible | | | | | | | | | | |

### Bảng 4 (Rules 31–32)

| ID | 31 | 32 |
|----|---|---|
| **Điều kiện** | | |
| C1: Mã tồn tại | F | F |
| C2: Còn hạn | F | F |
| C3: Đủ ngưỡng | F | F |
| C4: Đã đăng nhập | F | F |
| C5: Chưa hết lượt | T | F |
| **Kết quả** | | |
| R1: Áp dụng thành công | | |
| R2: Mã không tồn tại | | |
| R3: Mã hết hạn | | |
| R4: Chưa đủ ngưỡng | | |
| R5: Chưa đăng nhập | X | X |
| R6: Hết lượt | | |
| Impossible | | |

---

## 3. Rút gọn Decision Table

**Quá trình rút gọn:**

1. **Loại bỏ Impossible**: Loại bỏ rules 4, 6, 8, 10, 12, 14, 16 (tổ hợp có C4=F kết hợp C5=F — khi chưa đăng nhập thì không thể kiểm tra được lượt sử dụng).
2. **Gộp rules có cùng kết quả:**
   - Các rules có C4=F (chưa đăng nhập) → đều cho R5, C5 trở thành don't care → gộp lại.
   - Các rules có C1=F (mã không tồn tại), C4=T → đều cho R2, các điều kiện C2, C3, C5 trở thành don't care → gộp lại.

**Bảng rút gọn:**

| ID | 1 | 2 | 3 | 4 | 5 | 6 |
|----|---|---|---|---|---|---|
| **Điều kiện** | | | | | | |
| C1: Mã tồn tại | T | T | T | T | T | F |
| C2: Còn hạn | T | T | T | F | - | - |
| C3: Đủ ngưỡng | T | T | F | - | - | - |
| C4: Đã đăng nhập | T | T | T | T | F | T |
| C5: Chưa hết lượt | T | F | - | - | - | - |
| **Kết quả** | | | | | | |
| R1: Áp dụng thành công | X | | | | | |
| R2: Mã không tồn tại | | | | | | X |
| R3: Mã hết hạn | | | | X | | |
| R4: Chưa đủ ngưỡng | | | X | | | |
| R5: Chưa đăng nhập | | | | | X | |
| R6: Hết lượt | | X | | | | |

**Ký hiệu:**
- `X`: Kết quả xảy ra
- `-`: Điều kiện không ảnh hưởng đến kết quả (don't care)
- `T`: Điều kiện đúng (True)
- `F`: Điều kiện sai (False)

=> Tổng số test case sau rút gọn: **6** (từ 32 rules ban đầu)

---

## 4. Pairwise Testing (mở rộng don't care)

### Kiểm tra: Có cần áp dụng Pairwise không?

Nhìn vào bảng rút gọn → **CÓ** ô chứa `-` ở các rules 3, 4, 5, 6 → **CẦN** áp dụng Pairwise.

Các rules cần xử lý:
- **Rule 1** (C1=T, C2=T, C3=T, C4=T, C5=T → R1): Không có `-` → **Giữ nguyên**
- **Rule 2** (C1=T, C2=T, C3=T, C4=T, C5=F → R6): Không có `-` → **Giữ nguyên**
- **Rule 3** (C1=T, C2=T, C3=F, C4=T, C5=`-` → R4): Có 1 ô `-` → Chỉ có 1 ĐK don't care nên **không cần Pairwise**, liệt kê hết 2 giá trị
- **Rule 4** (C1=T, C2=F, C3=`-`, C4=T, C5=`-` → R3): Có 2 ô `-` → Chỉ có 1 cặp nên **không cần Pairwise**, liệt kê hết 2×2 = 4 giá trị
- **Rule 5** (C1=T, C2=`-`, C3=`-`, C4=F, C5=`-` → R5): Có 3 ô `-` → **CẦN Pairwise**
- **Rule 6** (C1=F, C2=`-`, C3=`-`, C4=T, C5=`-` → R2): Có 3 ô `-` → **CẦN Pairwise**

> **Lưu ý:** Pairwise chỉ thực sự có ý nghĩa khi có **từ 3 điều kiện don't care trở lên**.
> - 1 ĐK don't care → chỉ có 1 ĐK, không có "cặp" nào → liệt kê hết.
> - 2 ĐK don't care → chỉ có 1 cặp → liệt kê hết tất cả tổ hợp = pairwise coverage.
> - 3+ ĐK don't care → Pairwise giúp giảm số test case.

---

### Rule 3: C5 = `-` (1 ĐK don't care → liệt kê hết)

| TC | C1 | C2 | C3 | C4 | C5 | Kết quả |
|----|----|----|----|----|----|---------|
| 3a | T | T | F | T | T | R4 |
| 3b | T | T | F | T | F | R4 |

---

### Rule 4: C3 = `-`, C5 = `-` (2 ĐK don't care → liệt kê hết)

| TC | C1 | C2 | C3 | C4 | C5 | Kết quả |
|----|----|----|----|----|----|---------|
| 4a | T | F | T | T | T | R3 |
| 4b | T | F | T | T | F | R3 |
| 4c | T | F | F | T | T | R3 |
| 4d | T | F | F | T | F | R3 |

---

### Rule 5: C2 = `-`, C3 = `-`, C5 = `-` (3 ĐK don't care → Pairwise)

**Bước 4.1:** Các điều kiện don't care: C2 (T/F), C3 (T/F), C5 (T/F)

**Bước 4.2:** Các cặp: (C2,C3), (C2,C5), (C3,C5) → 3 cặp

**Bước 4.3:** Mỗi cặp cần cover 4 tổ hợp: (T,T), (T,F), (F,T), (F,F)

**Bước 4.4:** Bảng Pairwise:

| TC | C2 | C3 | C5 | Các cặp được cover |
|----|----|----|----|--------------------|
| 5a | T  | T  | T  | (C2,C3)=TT, (C2,C5)=TT, (C3,C5)=TT |
| 5b | T  | F  | F  | (C2,C3)=TF, (C2,C5)=TF, (C3,C5)=FF |
| 5c | F  | T  | F  | (C2,C3)=FT, (C2,C5)=FF, (C3,C5)=TF |
| 5d | F  | F  | T  | (C2,C3)=FF, (C2,C5)=FT, (C3,C5)=FT |

→ 4 test case cover hết 12 tổ hợp cặp (thay vì 2×2×2 = 8 nếu liệt kê hết)

**Bước 4.5:** Ghép với điều kiện cố định (C1=T, C4=F):

| TC | C1 | C2 | C3 | C4 | C5 | Kết quả |
|----|----|----|----|----|----|---------|
| 5a | T | T | T | F | T | R5 |
| 5b | T | T | F | F | F | R5 |
| 5c | T | F | T | F | F | R5 |
| 5d | T | F | F | F | T | R5 |

**Bước 4.6:** Kiểm tra coverage:

| Cặp | Tổ hợp | Xuất hiện ở TC |
|-----|--------|----------------|
| (C2,C3) | (T,T) | 5a ✅ |
| (C2,C3) | (T,F) | 5b ✅ |
| (C2,C3) | (F,T) | 5c ✅ |
| (C2,C3) | (F,F) | 5d ✅ |
| (C2,C5) | (T,T) | 5a ✅ |
| (C2,C5) | (T,F) | 5b ✅ |
| (C2,C5) | (F,T) | 5d ✅ |
| (C2,C5) | (F,F) | 5c ✅ |
| (C3,C5) | (T,T) | 5a ✅ |
| (C3,C5) | (T,F) | 5c ✅ |
| (C3,C5) | (F,T) | 5d ✅ |
| (C3,C5) | (F,F) | 5b ✅ |

✅ 12/12 tổ hợp cặp đã cover.

---

### Rule 6: C2 = `-`, C3 = `-`, C5 = `-` (3 ĐK don't care → Pairwise)

**Bước 4.1:** Các điều kiện don't care: C2 (T/F), C3 (T/F), C5 (T/F)

**Bước 4.2:** Các cặp: (C2,C3), (C2,C5), (C3,C5) → 3 cặp

**Bước 4.3–4.4:** Bảng Pairwise (cùng cấu trúc với Rule 5):

| TC | C2 | C3 | C5 | Các cặp được cover |
|----|----|----|----|--------------------|
| 6a | T  | T  | T  | (C2,C3)=TT, (C2,C5)=TT, (C3,C5)=TT |
| 6b | T  | F  | F  | (C2,C3)=TF, (C2,C5)=TF, (C3,C5)=FF |
| 6c | F  | T  | F  | (C2,C3)=FT, (C2,C5)=FF, (C3,C5)=TF |
| 6d | F  | F  | T  | (C2,C3)=FF, (C2,C5)=FT, (C3,C5)=FT |

**Bước 4.5:** Ghép với điều kiện cố định (C1=F, C4=T):

| TC | C1 | C2 | C3 | C4 | C5 | Kết quả |
|----|----|----|----|----|----|---------|
| 6a | F | T | T | T | T | R2 |
| 6b | F | T | F | T | F | R2 |
| 6c | F | F | T | T | F | R2 |
| 6d | F | F | F | T | T | R2 |

**Bước 4.6:** Coverage kiểm tra tương tự Rule 5 → ✅ 12/12 tổ hợp cặp đã cover.

---

### Kết quả cuối cùng

| ID | C1 | C2 | C3 | C4 | C5 | Kết quả | Nguồn |
|----|----|----|----|----|----|---------|-------|
| FR09-DTT-01 | T | T | T | T | T | R1: Áp dụng thành công | Rule 1 |
| FR09-DTT-02 | T | T | T | T | F | R6: Hết lượt | Rule 2 |
| FR09-DTT-03 | T | T | F | T | T | R4: Chưa đủ ngưỡng | Rule 3a |
| FR09-DTT-04 | T | T | F | T | F | R4: Chưa đủ ngưỡng | Rule 3b |
| FR09-DTT-05 | T | F | T | T | T | R3: Mã hết hạn | Rule 4a |
| FR09-DTT-06 | T | F | T | T | F | R3: Mã hết hạn | Rule 4b |
| FR09-DTT-07 | T | F | F | T | T | R3: Mã hết hạn | Rule 4c |
| FR09-DTT-08 | T | F | F | T | F | R3: Mã hết hạn | Rule 4d |
| FR09-DTT-09 | T | T | T | F | T | R5: Chưa đăng nhập | Rule 5a |
| FR09-DTT-10 | T | T | F | F | F | R5: Chưa đăng nhập | Rule 5b |
| FR09-DTT-11 | T | F | T | F | F | R5: Chưa đăng nhập | Rule 5c |
| FR09-DTT-12 | T | F | F | F | T | R5: Chưa đăng nhập | Rule 5d |
| FR09-DTT-13 | F | T | T | T | T | R2: Mã không tồn tại | Rule 6a |
| FR09-DTT-14 | F | T | F | T | F | R2: Mã không tồn tại | Rule 6b |
| FR09-DTT-15 | F | F | T | T | F | R2: Mã không tồn tại | Rule 6c |
| FR09-DTT-16 | F | F | F | T | T | R2: Mã không tồn tại | Rule 6d |

=> Tổng số test case cuối cùng: **16** (từ 32 rules ban đầu → rút gọn 6 → mở rộng Pairwise 16)
