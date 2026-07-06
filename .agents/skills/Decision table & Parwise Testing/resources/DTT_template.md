# DTT-[ID]: Test Design — [Tên chức năng]

**Phương pháp:** Decision table & Pairwise testing  
**Yêu cầu tham chiếu:** [Mã chức năng (VD: FR-09)] ([Tên chức năng])

---

## 1. Xác định điều kiện & kết quả

### [Bước 1 / Thành phần 1] — [Tên bước hoặc thành phần chức năng]

#### Điều kiện:

| Tên điều kiện | Số loại giá trị | Chi tiết giá trị |
|---|---|---|
| [Tên điều kiện 1] | [Tổng số loại giá trị] | [Loại 1: giá trị 1, Loại 2: giá trị 2, ... ] |
| [Tên điều kiện 2] | [Tổng số loại giá trị] | [Loại 1: giá trị 1, Loại 2: giá trị 2, ... ] |

#### Kết quả:

| Tên kết quả | Mô tả |
|---|---|
| [Tên kết quả 1] | [Mô tả kết quả 1] |
| [Tên kết quả 2] | [Mô tả kết quả 2] |

=> Tổng số rules = Tích số lượng giá trị của các điều kiện = [Số ĐK1] × [Số ĐK2] × ... = N

---

## 2. Decision Table (đầy đủ)

| ID | 1 | 2 | 3 | ... | n |
|----|---|---|---|-----|---|
| **Điều kiện** | | | | | |
| Điều kiện 1 | Loại 1 | Loại 1 | Loại 2 | ... | Loại n |
| Điều kiện 2 | Loại 1 | Loại 2 | Loại 1 | ... | Loại n |
| Điều kiện n | Loại 1 | Loại 1 | Loại 1 | ... | Loại n |
| **Kết quả** | | | | | |
| Kết quả 1 | X | | | | |
| Kết quả 2 | | X | X | | |
| Kết quả n | | | | | X |
| Impossible | | | | | |

**Cách xác định kết quả cho mỗi rule:**
- Với mỗi cột (tổ hợp điều kiện), đối chiếu với đặc tả để xác định kết quả nào xảy ra.
- Đánh dấu `X` ở hàng kết quả tương ứng. Một cột có thể có nhiều `X` nếu nhiều kết quả đồng thời xảy ra.
- Nếu tổ hợp điều kiện không thể xảy ra trong thực tế, đánh dấu `X` ở hàng **Impossible**.

**Thuật toán phân bổ đều (liệt kê tất cả tổ hợp):**

1. **Xác định quy mô:**
   - Tổng số rules (N) = Tích số lượng giá trị của tất cả các điều kiện.
   - Ví dụ: 3 điều kiện, mỗi điều kiện có 2 giá trị = $2 \times 2 \times 2 = 8$ rules.

2. **Thuật toán phân bổ (sắp xếp giá trị theo cột):**

   Với mỗi hàng điều kiện, tính **kích thước nhóm lặp** = N ÷ (tích số giá trị từ ĐK1 đến ĐK hiện tại):

   - **Điều kiện 1**: Kích thước nhóm = $N / (\text{Số giá trị ĐK1})$.
     - Lặp mỗi giá trị liên tiếp theo kích thước nhóm.
   - **Điều kiện 2**: Kích thước nhóm = $N / (\text{Số giá trị ĐK1} \times \text{Số giá trị ĐK2})$.
     - Trong mỗi nhóm của ĐK1, lặp mỗi giá trị ĐK2 liên tiếp theo kích thước nhóm mới.
   - **Điều kiện k**: Tiếp tục cho đến hết. Điều kiện cuối cùng sẽ có kích thước nhóm = 1, tức xoay vòng từng giá trị.

   **Ví dụ** (3 ĐK, mỗi cái 2 giá trị T/F, N=8):

   | ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
   |----|---|---|---|---|---|---|---|---|
   | ĐK1 | T | T | T | T | F | F | F | F |
   | ĐK2 | T | T | F | F | T | T | F | F |
   | ĐK3 | T | F | T | F | T | F | T | F |

   - ĐK1: nhóm = 8/2 = 4 → 4 cột T, 4 cột F
   - ĐK2: nhóm = 4/2 = 2 → trong mỗi nhóm 4, viết 2 cột T, 2 cột F
   - ĐK3: nhóm = 2/2 = 1 → xoay vòng T, F

Mỗi table chỉ chứa tối đa **10 cột rule**. Nếu nhiều hơn => tách thành nhiều table liên tiếp.

---

## 3. Rút gọn Decision Table

**Quy tắc rút gọn:**

1. **Loại bỏ Impossible**: Xóa tất cả các cột đã đánh dấu Impossible.
2. **Gộp rules có cùng kết quả**: Nếu 2 rules chỉ khác nhau ở **đúng 1 điều kiện** mà tất cả kết quả giống nhau → gộp thành 1 rule, điều kiện khác nhau đó ghi `-` (don't care / không ảnh hưởng).
3. **Lặp lại bước 2** cho đến khi không thể gộp thêm.
4. **Đánh số lại** các rules sau khi rút gọn.

**Bảng rút gọn:**

| ID | 1 | 2 | ... | m |
|----|---|---|-----|---|
| **Điều kiện** | | | | |
| Điều kiện 1 | Loại 1 | - | ... | Loại n |
| Điều kiện 2 | Loại 1 | Loại 2 | ... | Loại n |
| Điều kiện n | - | Loại 1 | ... | Loại n |
| **Kết quả** | | | | |
| Kết quả 1 | X | | | |
| Kết quả 2 | | X | | |
| Kết quả n | | | | X |

**Ký hiệu:**
- `X`: Kết quả xảy ra
- `-`: Điều kiện không ảnh hưởng đến kết quả (don't care)
- Ô trống: Kết quả không xảy ra

=> Tổng số test case sau rút gọn = m (số cột còn lại)

---

## 4. Pairwise Testing (mở rộng don't care)

> **Khi nào cần bước này?**
>
> Nhìn vào bảng rút gọn ở Mục 3:
> - Nếu **KHÔNG có** ô nào chứa `-` → **BỎ QUA** mục này. Bảng rút gọn chính là kết quả cuối cùng.
> - Nếu **CÓ** ô chứa `-` → **CẦN** thực hiện bước này.

### Tại sao cần Pairwise?

Khi rút gọn Decision Table, ô `-` (don't care) nghĩa là "điều kiện này có giá trị gì cũng không ảnh hưởng kết quả". Tuy nhiên, khi viết test case thật, ta **không thể để trống** — ta phải điền giá trị cụ thể vào.

**Vấn đề:** Nếu 1 rule có 3 ô `-`, mỗi ô có 2 giá trị → có 2×2×2 = 8 cách điền. Nếu test hết thì quay lại bảng đầy đủ, không còn ý nghĩa rút gọn.

**Giải pháp — Pairwise:** Thay vì test hết tất cả tổ hợp, chỉ cần đảm bảo **mỗi cặp 2 điều kiện** (pair) đã xuất hiện đủ mọi tổ hợp giá trị ít nhất 1 lần. Điều này giảm đáng kể số test case nhưng vẫn phát hiện được phần lớn lỗi.

### Quy trình thực hiện

**Với mỗi rule có chứa `-`:**

**Bước 4.1:** Xác định các điều kiện don't care và giá trị có thể có

Ví dụ: Rule 4 có C2=`-`, C3=`-`, C5=`-` (mỗi cái có 2 giá trị T/F)

**Bước 4.2:** Liệt kê tất cả các cặp (pairs) điều kiện don't care

Ví dụ với 3 điều kiện don't care: (C2,C3), (C2,C5), (C3,C5) → 3 cặp

**Bước 4.3:** Liệt kê tất cả tổ hợp giá trị cần cover cho mỗi cặp

Mỗi cặp 2 điều kiện (mỗi cái 2 giá trị) cần cover 2×2 = 4 tổ hợp:
- (T,T), (T,F), (F,T), (F,F)

**Bước 4.4:** Tạo bảng Pairwise — tìm số test case TỐI THIỂU mà cover hết tất cả các cặp

| TC | C2 | C3 | C5 | Các cặp được cover |
|----|----|----|----|--------------------|
| a  | T  | T  | T  | (C2,C3)=TT, (C2,C5)=TT, (C3,C5)=TT |
| b  | T  | F  | F  | (C2,C3)=TF, (C2,C5)=TF, (C3,C5)=FF |
| c  | F  | T  | F  | (C2,C3)=FT, (C2,C5)=FF, (C3,C5)=TF |
| d  | F  | F  | T  | (C2,C3)=FF, (C2,C5)=FT, (C3,C5)=FT |

→ 4 test case đã cover hết 3×4 = 12 tổ hợp cặp (thay vì 8 test case nếu liệt kê hết)

**Bước 4.5:** Ghép lại với các điều kiện cố định của rule gốc

Rule gốc: C1=T, C2=`-`, C3=`-`, C4=T, C5=`-` → Kết quả: R3

| TC | C1 | C2 | C3 | C4 | C5 | Kết quả |
|----|----|----|----|----|----|---------|
| a  | T  | T  | T  | T  | T  | R3      |
| b  | T  | T  | F  | T  | F  | R3      |
| c  | T  | F  | T  | T  | F  | R3      |
| d  | T  | F  | F  | T  | T  | R3      |

**Bước 4.6:** Kiểm tra coverage — xác nhận mọi cặp giá trị đều xuất hiện ít nhất 1 lần

### Bảng kiểm tra Pairwise coverage

| Cặp | Tổ hợp | Xuất hiện ở TC |
|-----|--------|----------------|
| (C2,C3) | (T,T) | a |
| (C2,C3) | (T,F) | b |
| (C2,C3) | (F,T) | c |
| (C2,C3) | (F,F) | d |
| (C2,C5) | (T,T) | a |
| (C2,C5) | (T,F) | b |
| (C2,C5) | (F,T) | d |
| (C2,C5) | (F,F) | c |
| (C3,C5) | (T,T) | a |
| (C3,C5) | (T,F) | c |
| (C3,C5) | (F,T) | d |
| (C3,C5) | (F,F) | b |

✅ Tất cả 12 tổ hợp cặp đều được cover.

### Kết quả cuối cùng

Bảng test case cuối cùng = Rules không có `-` (giữ nguyên) + Rules có `-` (đã mở rộng bằng Pairwise)

| ID | C1 | C2 | C3 | C4 | C5 | Kết quả |
|----|----|----|----|----|----|----|
| (Liệt kê tất cả test case cuối cùng ở đây) | | | | | | |

=> Tổng số test case cuối cùng = [Số rules không có `-`] + [Tổng số TC pairwise từ các rules có `-`]
