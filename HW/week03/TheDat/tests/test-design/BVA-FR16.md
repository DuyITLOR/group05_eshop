# BVA-FR16: Test Design — Import Sản phẩm từ CSV

**Phương pháp:** 3-Point Boundary Values (BVA)  
**Yêu cầu tham chiếu:** FR-16 (Import Sản phẩm từ CSV)

---

## 1. Xác định input

Bảng dưới đây trình bày các miền giá trị input hợp lệ và các điểm biên tương ứng được xác định từ yêu cầu chức năng FR-16 và tài liệu thiết kế test case EP.

| Tham số/Trường input | Thuộc tính biên | Miền giá trị hợp lệ | Biên dưới (Min) | Biên trên (Max) | Các điểm biên cần kiểm thử (3-point BVA) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tên sản phẩm (`name`)** | Độ dài chuỗi | `[1, 255]` ký tự | 1 | 255 | - MINM: 0 ký tự (để trống)<br>- MIN: 1 ký tự<br>- MINP: 2 ký tự<br>- MAXM: 254 ký tự<br>- MAX: 255 ký tự<br>- MAXP: 256 ký tự |
| **Giá sản phẩm (`price`)** | Giá trị số | `[1, +∞)` | 1 | N/A | - MINM: 0<br>- MIN: 1<br>- MINP: 2<br>*(Kiểm tra thêm biên ngoài số âm: -1)* |
| **Số lượng dòng dữ liệu** | Số dòng dữ liệu trong file | `[1, +∞)` | 1 | N/A | - MINM: 0 dòng dữ liệu (chỉ có dòng header)<br>- MIN: 1 dòng dữ liệu<br>- MINP: 2 dòng dữ liệu |

*Ghi chú:*
- *Độ dài tối đa của `name` (255 ký tự) dựa trên ràng buộc của chức năng Product CRUD (FR-15).*
- *Giá trị nhỏ nhất của `price` là 1 do quy định giá phải là số dương (> 0) và có kiểu số nguyên (INTEGER) trong CSDL.*
- *Số lượng dòng dữ liệu tối thiểu là 1 dòng dữ liệu (không tính dòng header) để chức năng import có thể thực hiện.*

---

## 2. Test Case

### 2.1. Thành phần 1 — Admin import sản phẩm từ file CSV

| ID | Partition Tested | File CSV (Input) | Expected Output |
|---|---|---|---|
| FR16_BVA_01 | Độ dài `name` = Min - 1 (0 ký tự) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`,100000,,,1` | - Không thêm sản phẩm nào vào DB (DB2)<br>- Hiển thị thông báo lỗi: "Hàng 2: Thiếu tên sản phẩm" (REP3) |
| FR16_BVA_02 | Độ dài `name` = Min (1 ký tự) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`A,100000,,,1` | - Thêm thành công sản phẩm tên "A" vào DB (DB1)<br>- Hiển thị thông báo thành công: "Import hoàn tất: 1/1 sản phẩm được thêm" (REP1) |
| FR16_BVA_03 | Độ dài `name` = Min + 1 (2 ký tự) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`AB,100000,,,1` | - Thêm thành công sản phẩm tên "AB" vào DB (DB1)<br>- Hiển thị thông báo thành công: "Import hoàn tất: 1/1 sản phẩm được thêm" (REP1) |
| FR16_BVA_04 | Độ dài `name` = Max - 1 (254 ký tự) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`[Chuỗi 254 ký tự],100000,,,1` | - Thêm thành công sản phẩm với tên dài 254 ký tự vào DB (DB1)<br>- Hiển thị thông báo thành công: "Import hoàn tất: 1/1 sản phẩm được thêm" (REP1) |
| FR16_BVA_05 | Độ dài `name` = Max (255 ký tự) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`[Chuỗi 255 ký tự],100000,,,1` | - Thêm thành công sản phẩm với tên dài 255 ký tự vào DB (DB1)<br>- Hiển thị thông báo thành công: "Import hoàn tất: 1/1 sản phẩm được thêm" (REP1) |
| FR16_BVA_06 | Độ dài `name` = Max + 1 (256 ký tự) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`[Chuỗi 256 ký tự],100000,,,1` | - Không thêm sản phẩm nào vào DB (DB2)<br>- Hiển thị thông báo lỗi: "Hàng 2: Tên sản phẩm quá dài (tối đa 255 ký tự)" (REP3) |
| FR16_BVA_07 | Giá trị `price` = Min - 1 (Giá trị 0) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`Sản phẩm A,0,,,1` | - Không thêm sản phẩm nào vào DB (DB2)<br>- Hiển thị thông báo lỗi: "Hàng 2: Giá tiền không hợp lệ (phải là số dương)" (REP3) |
| FR16_BVA_08 | Giá trị `price` = Min (Giá trị 1) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`Sản phẩm A,1,,,1` | - Thêm thành công sản phẩm với giá = 1 vào DB (DB1)<br>- Hiển thị thông báo thành công: "Import hoàn tất: 1/1 sản phẩm được thêm" (REP1) |
| FR16_BVA_09 | Giá trị `price` = Min + 1 (Giá trị 2) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`Sản phẩm A,2,,,1` | - Thêm thành công sản phẩm với giá = 2 vào DB (DB1)<br>- Hiển thị thông báo thành công: "Import hoàn tất: 1/1 sản phẩm được thêm" (REP1) |
| FR16_BVA_10 | Giá trị `price` < 0 (Số âm, biên ngoài) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`Sản phẩm A,-1,,,1` | - Không thêm sản phẩm nào vào DB (DB2)<br>- Hiển thị thông báo lỗi: "Hàng 2: Giá tiền không hợp lệ (phải là số dương)" (REP3) |
| FR16_BVA_11 | Số dòng dữ liệu = Min - 1 (0 dòng dữ liệu) | File `.csv` (EXT1) chỉ chứa dòng header:<br>`name,price,description,imageUrl,category_id` | - Không thêm sản phẩm nào vào DB (DB2)<br>- Hiển thị thông báo lỗi: "Không có dữ liệu để import" (REP2) |
| FR16_BVA_12 | Số dòng dữ liệu = Min (1 dòng dữ liệu) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`Sản phẩm A,100000,,,1` | - Thêm thành công 1 sản phẩm vào DB (DB1)<br>- Hiển thị thông báo thành công: "Import hoàn tất: 1/1 sản phẩm được thêm" (REP1) |
| FR16_BVA_13 | Số dòng dữ liệu = Min + 1 (2 dòng dữ liệu) | File `.csv` (EXT1), Header đúng (HD1), dòng dữ liệu:<br>`Sản phẩm A,100000,,,1`<br>`Sản phẩm B,200000,,,2` | - Thêm thành công 2 sản phẩm vào DB (DB1)<br>- Hiển thị thông báo thành công: "Import hoàn tất: 2/2 sản phẩm được thêm" (REP1) |

*Lưu ý:*
- *Các test case kiểm định độ dài chuỗi tên `name` dài 254, 255, 256 ký tự có thể được sinh thủ công bằng cách sử dụng các công cụ đếm ký tự hoặc script sinh chuỗi.*
- *Trong tất cả các test case trên, giả định tài khoản Admin đã đăng nhập thành công.*
