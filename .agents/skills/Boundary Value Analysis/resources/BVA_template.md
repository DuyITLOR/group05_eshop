# BVA-[ID]: Test Design — [Tên chức năng]

**Phương pháp:** 3-Point Boundary Values (BVA)  
**Yêu cầu tham chiếu:** [Mã chức năng (VD: FR-03)] ([Tên chức năng])

---

## 1. Xác định input

Bảng dưới đây trình bày các miền giá trị input hợp lệ và các điểm biên tương ứng được xác định từ yêu cầu chức năng và tài liệu thiết kế test case EP.

| Tham số/Trường input | Thuộc tính biên | Miền giá trị hợp lệ | Biên dưới (Min) | Biên trên (Max) | Các điểm biên cần kiểm thử (3-point BVA) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[Tên input 1]** | [Thuộc tính biên (VD: Độ dài chuỗi/Giá trị số)] | [Miền giá trị hợp lệ (VD: [A, B])] | [Giá trị Min] | [Giá trị Max] | - MINM: [Giá trị Min - 1]<br>- MIN: [Giá trị Min]<br>- MINP: [Giá trị Min + 1]<br>- MAXM: [Giá trị Max - 1]<br>- MAX: [Giá trị Max]<br>- MAXP: [Giá trị Max + 1] |
| **[Tên input 2]** | [Thuộc tính biên] | [Miền giá trị hợp lệ] | [Giá trị Min] | N/A (hoặc ngược lại) | - MINM: [Giá trị Min - 1]<br>- MIN: [Giá trị Min]<br>- MINP: [Giá trị Min + 1] |

*Ghi chú:*
- *[Các ghi chú giải thích về nguồn gốc biên, giả định thiết kế nếu có]*

---

## 2. Test Case

### 2.1. [Bước 1 / Thành phần 1] — [Tên bước hoặc thành phần chức năng]

| ID | Partition Tested | [Tên cột Input 1] | [Tên cột Input 2] | Expected Output |
|---|---|---|---|---|
| [ID_MINM_01] | [Biên kiểm thử, VD: Độ dài Input 1 = Min - 1] | [Giá trị biên] | [Giá trị biên] | - [Kết quả mong đợi 1]<br>- [Kết quả mong đợi 2] |
| [ID_MIN_01] | [Biên kiểm thử, VD: Độ dài Input 1 = Min] | [Giá trị biên] | [Giá trị biên] | - [Kết quả mong đợi 1]<br>- [Kết quả mong đợi 2] |
| [ID_MINP_01] | [Biên kiểm thử, VD: Độ dài Input 1 = Min + 1] | [Giá trị biên] | [Giá trị biên] | - [Kết quả mong đợi 1]<br>- [Kết quả mong đợi 2] |
| [ID_MAXM_01] | [Biên kiểm thử, VD: Độ dài Input 1 = Max - 1] | [Giá trị biên] | [Giá trị biên] | - [Kết quả mong đợi 1]<br>- [Kết quả mong đợi 2] |
| [ID_MAX_01] | [Biên kiểm thử, VD: Độ dài Input 1 = Max] | [Giá trị biên] | [Giá trị biên] | - [Kết quả mong đợi 1]<br>- [Kết quả mong đợi 2] |
| [ID_MAXP_01] | [Biên kiểm thử, VD: Độ dài Input 1 = Max + 1] | [Giá trị biên] | [Giá trị biên] | - [Kết quả mong đợi 1]<br>- [Kết quả mong đợi 2] |

*Lưu ý:* [Các ghi chú, giả định đặc thù khi thực hiện kiểm thử giá trị biên cho thành phần này]
