# EP-FR16: Test Design — Import Sản phẩm từ CSV

**Phương pháp:** Equivalence Partitioning (EP)  
**Yêu cầu tham chiếu:** FR-16 (Import Sản phẩm từ CSV)

---

## 1. Xác định miền giá trị Input & Output

### Thành phần 1 — Admin import sản phẩm từ file CSV

**Precondition:** Đăng nhập hệ thống với tài khoản Admin (`role = 'admin'`). File CSV cần import nằm trên thiết bị local của Admin. Không thực hiện kiểm thử tính hợp lệ của Token JWT trong phạm vi thiết kế này.

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Đuôi file | 3 | EXT1: Đuôi file là `.csv` (VD: `products.csv`) | EXT2: Đuôi file khác `.csv` (VD: `products.xlsx`, `products.txt`, `products.png`) <br>EXT3: File không có phần mở rộng (VD: `products`) |
| Dòng Header | 4 | HD1: Dòng đầu tiên đúng định dạng header: `name,price,description,imageUrl,category_id` | HD2: Dòng đầu tiên sai tên cột (VD: `name_product,price_val,desc,img,cat_id`) <br>HD3: Dòng đầu tiên thiếu cột bắt buộc (VD: thiếu `name` hoặc `price` trong dòng header) <br>HD4: File trống không chứa dòng header |
| CSV Format | 2 | FMT1: Các trường chứa dấu phẩy được bọc trong dấu nháy kép `""` đúng chuẩn RFC 4180 (VD: `"Bàn phím cơ, Keychron Q1"`) | FMT2: Các trường chứa dấu phẩy nhưng không được bọc trong dấu nháy kép `""` (VD: `Bàn phím cơ, Keychron Q1` - sẽ gây lệch vị trí cột tiếp theo) |
| Tên sản phẩm (`name`) | 3 | NAME1: Chuỗi không rỗng, độ dài ≤ 255 ký tự (VD: `iPhone 15 Pro Max`) | NAME2: Chuỗi trống hoặc chỉ chứa khoảng trắng (VD: `""`, `   `) <br>NAME3: Chuỗi vượt quá 255 ký tự |
| Giá sản phẩm (`price`) | 5 | PRICE1: Số dương (> 0) (VD: `30000000`, `1`) | PRICE2: Số bằng 0 (VD: `0`) <br>PRICE3: Số âm (VD: `-50000`) <br>PRICE4: Giá trị không phải là số (VD: `abc`, `10k`) <br>PRICE5: Trống / Không nhập (VD: `""`) |
| ID danh mục (`category_id`) | 4 | CAT1: Số nguyên tương ứng với danh mục đang tồn tại trong hệ thống (VD: `1`, `2`, `3`) | CAT2: ID danh mục không tồn tại trong hệ thống (VD: `9999`) <br>CAT3: Giá trị không phải là số nguyên (VD: `abc`, `1.5`) <br>CAT4: Trống / Không nhập (VD: `""`) |
| Tình trạng các dòng dữ liệu | 2 | STATE1: Tất cả các dòng dữ liệu trong file đều hợp lệ | STATE2: Có ít nhất một dòng dữ liệu bị lỗi (vi phạm validation dữ liệu hoặc cấu trúc) |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Dữ liệu trong Database | 2 | DB1: Thêm thành công toàn bộ sản phẩm trong file CSV vào cơ sở dữ liệu (Transaction Commit) | DB2: Không thêm bất kỳ sản phẩm nào vào cơ sở dữ liệu, giữ nguyên trạng thái trước khi import (Transaction Rollback) |
| Báo cáo hiển thị trên UI | 3 | REP1: Hiển thị thông báo import thành công: số dòng import thành công / tổng số dòng, số dòng lỗi là 0 (VD: "Import hoàn tất: 3/3 sản phẩm được thêm") | REP2: Hiển thị thông báo lỗi định dạng file hoặc cấu trúc header không hợp lệ <br>REP3: Hiển thị thông báo lỗi chi tiết của từng dòng bị lỗi, hiển thị số dòng thành công là 0 (do rollback toàn bộ) |

---

## 2. Test Case

### 2.1. Test case cho miền hợp lệ

#### Thành phần 1 — Admin import sản phẩm từ file CSV (Input)

| ID | Test Objective | File CSV (Input) | Database State (Output) | UI Report (Output) |
|---|---|---|---|---|
| FR16_EP_V01 | Import file CSV hợp lệ hoàn toàn với các dòng dữ liệu đúng chuẩn | File `.csv` (EXT1), Header đúng (HD1), bọc nháy kép chuẩn (FMT1), tất cả các dòng dữ liệu hợp lệ (NAME1, PRICE1, CAT1, STATE1) | Thêm thành công toàn bộ sản phẩm vào DB (DB1) | Hiển thị thông báo thành công: 2/2 sản phẩm được thêm (REP1) |

#### Thành phần 1 — Admin import sản phẩm từ file CSV (Output)

| ID | Test Objective | File CSV (Input) | Database State (Output) | UI Report (Output) |
|---|---|---|---|---|
| FR16_EP_V02 | Đảm bảo sản phẩm được lưu đúng các thuộc tính trong database sau khi import thành công | File `.csv` (EXT1) chứa sản phẩm hợp lệ: `Laptop ASUS,15000000,Laptop văn phòng,,2` | Toàn bộ sản phẩm được thêm vào DB đúng dữ liệu (DB1) | Hiển thị thông báo thành công (REP1) |
| FR16_EP_V03 | Đảm bảo UI hiển thị chính xác số dòng thành công và không có lỗi khi import thành công | File `.csv` (EXT1) chứa 3 sản phẩm hợp lệ | Thêm thành công toàn bộ sản phẩm vào DB (DB1) | Hiển thị thông báo: "Import hoàn tất: 3/3 sản phẩm được thêm" (REP1) |

---

### 2.2. Test case cho miền không hợp lệ

#### Thành phần 1 — Admin import sản phẩm từ file CSV (Input)

| ID | Test Objective | File CSV (Input) | Database State (Output) | UI Report (Output) |
|---|---|---|---|---|
| FR16_EP_IV01 | Tải lên file sai đuôi mở rộng (định dạng `.xlsx`) | File `products.xlsx` (EXT2), chứa dữ liệu hợp lệ | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi định dạng file không hợp lệ (REP2) |
| FR16_EP_IV02 | Tải lên file không có phần mở rộng (đuôi file) | File `products` (EXT3), chứa dữ liệu hợp lệ | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi định dạng file không hợp lệ (REP2) |
| FR16_EP_IV03 | File CSV có dòng header sai tên cột | Đuôi `.csv` (EXT1), dòng 1 là `ten,gia,mota,url,danhmuc` (HD2), dữ liệu hợp lệ | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi cấu trúc file không hợp lệ (REP2) |
| FR16_EP_IV04 | File CSV thiếu cột bắt buộc (`name`) trong header | Đuôi `.csv` (EXT1), dòng 1 là `price,description,imageUrl,category_id` (HD3), dữ liệu hợp lệ | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi cấu trúc file không hợp lệ (REP2) |
| FR16_EP_IV05 | File CSV trống không chứa dòng header | File `.csv` trống hoàn toàn (HD4) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi cấu trúc file không hợp lệ (REP2) |
| FR16_EP_IV06 | Dòng dữ liệu chứa dấu phẩy nhưng không được bọc trong dấu nháy kép | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Bàn phím cơ, Keychron Q1,4000000,Bàn phím,,3` (FMT2) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi dòng dữ liệu không đúng cấu trúc/lý do lỗi tương ứng (REP3) |
| FR16_EP_IV07 | Dòng dữ liệu có tên sản phẩm trống (`name` rỗng) | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `,150000,,,1` (NAME2) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng thiếu tên sản phẩm (REP3) |
| FR16_EP_IV08 | Dòng dữ liệu có tên sản phẩm vượt quá 255 ký tự | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu có tên sản phẩm dài 256 ký tự (NAME3), giá hợp lệ | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng tên sản phẩm quá dài (REP3) |
| FR16_EP_IV09 | Dòng dữ liệu có giá sản phẩm bằng 0 | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,0,,,1` (PRICE2) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng giá tiền không hợp lệ (REP3) |
| FR16_EP_IV10 | Dòng dữ liệu có giá sản phẩm là số âm | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,-50000,,,1` (PRICE3) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng giá tiền không hợp lệ (REP3) |
| FR16_EP_IV11 | Dòng dữ liệu có giá sản phẩm không phải là số | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,abc,,,1` (PRICE4) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng giá tiền không hợp lệ (REP3) |
| FR16_EP_IV12 | Dòng dữ liệu để trống giá sản phẩm | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,,,,1` (PRICE5) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng thiếu giá tiền sản phẩm (REP3) |
| FR16_EP_IV13 | Dòng dữ liệu có ID danh mục không tồn tại trong hệ thống | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,100000,,,9999` (CAT2) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng danh mục không tồn tại (REP3) |
| FR16_EP_IV14 | Dòng dữ liệu có ID danh mục không phải số nguyên | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,100000,,,abc` (CAT3) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng danh mục không hợp lệ (REP3) |
| FR16_EP_IV15 | Dòng dữ liệu để trống ID danh mục | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,100000,,,` (CAT4) | Không có sản phẩm nào được thêm vào DB (DB2) | Báo lỗi hàng thiếu danh mục sản phẩm (REP3) |
| FR16_EP_IV16 | Giao dịch nguyên tử (All-or-Nothing Rollback) khi có ít nhất một dòng dữ liệu bị lỗi trong số nhiều dòng dữ liệu đúng | File `.csv` (EXT1) với header đúng (HD1), chứa 4 dòng dữ liệu: <br>- Hàng 2: hợp lệ <br>- Hàng 3: hợp lệ <br>- Hàng 4: không hợp lệ (giá âm) (STATE2) <br>- Hàng 5: hợp lệ | Không có sản phẩm nào trong file (kể cả hàng 2, 3, 5) được lưu vào DB (DB2) | Hiển thị thông báo import thất bại: Chỉ rõ lý do lỗi tại Hàng 4, số dòng thành công hiển thị là 0 (REP3) |

---

## 3. Rút gọn TC

Gộp các test case có chung giá trị Input và Output thành một test case duy nhất với nhiều test objective.

### 3.1. Test case hợp lệ (rút gọn)

#### Thành quan 1 — Admin import sản phẩm từ file CSV

| ID | Test Objective (gộp) | File CSV (Input) | Expected Output |
|---|---|---|---|
| FR16_EP_V01 | Gộp: FR16_EP_V01, FR16_EP_V02, FR16_EP_V03 <br>- Import file CSV hợp lệ hoàn toàn với các dòng dữ liệu đúng chuẩn trong miền EXT1, HD1, FMT1, NAME1, PRICE1, CAT1, STATE1 <br>- Đảm bảo sản phẩm được lưu đúng các thuộc tính trong database sau khi import thành công (DB1) <br>- Đảm bảo UI hiển thị chính xác số dòng thành công và không có lỗi khi import thành công (REP1) | File `.csv` chứa 2 sản phẩm mẫu: <br>- Hàng 2: `iPhone 15 Pro Max,30000000,Điện thoại Apple,,1` <br>- Hàng 3: `"Bàn phím cơ, Keychron Q1",4000000,Bàn phím cơ cao cấp,,3` | - Thêm thành công toàn bộ sản phẩm vào DB (DB1) với đúng các thuộc tính <br>- Hiển thị thông báo: "Import hoàn tất: 2/2 sản phẩm được thêm" (REP1) |

---

### 3.2. Test case không hợp lệ (rút gọn)

Các test case không hợp lệ đều có input khác nhau nên không thể gộp thêm, giữ nguyên từ mục 2.2.

#### Thành phần 1 — Admin import sản phẩm từ file CSV

| ID | Test Objective | File CSV (Input) | Expected Output |
|---|---|---|---|
| FR16_EP_IV01 | Tải lên file sai đuôi mở rộng (định dạng `.xlsx`) | File `products.xlsx` (EXT2), chứa dữ liệu hợp lệ | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi định dạng file không hợp lệ (REP2) |
| FR16_EP_IV02 | Tải lên file không có phần mở rộng (đuôi file) | File `products` (EXT3), chứa dữ liệu hợp lệ | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi định dạng file không hợp lệ (REP2) |
| FR16_EP_IV03 | File CSV có dòng header sai tên cột | Đuôi `.csv` (EXT1), dòng 1 là `ten,gia,mota,url,danhmuc` (HD2) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi cấu trúc file không hợp lệ (REP2) |
| FR16_EP_IV04 | File CSV thiếu cột bắt buộc (`name`) trong header | Đuôi `.csv` (EXT1), dòng 1 là `price,description,imageUrl,category_id` (HD3) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi cấu trúc file không hợp lệ (REP2) |
| FR16_EP_IV05 | File CSV trống không chứa dòng header | File `.csv` trống hoàn toàn (HD4) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi cấu trúc file không hợp lệ (REP2) |
| FR16_EP_IV06 | Dòng dữ liệu chứa dấu phẩy nhưng không được bọc trong dấu nháy kép | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Bàn phím cơ, Keychron Q1,4000000,Bàn phím,,3` (FMT2) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi dòng dữ liệu không đúng cấu trúc/lý do lỗi tương ứng (REP3) |
| FR16_EP_IV07 | Dòng dữ liệu có tên sản phẩm trống (`name` rỗng) | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `,150000,,,1` (NAME2) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng thiếu tên sản phẩm (REP3) |
| FR16_EP_IV08 | Dòng dữ liệu có tên sản phẩm vượt quá 255 ký tự | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu có tên sản phẩm dài 256 ký tự (NAME3) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng tên sản phẩm quá dài (REP3) |
| FR16_EP_IV09 | Dòng dữ liệu có giá sản phẩm bằng 0 | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,0,,,1` (PRICE2) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng giá tiền không hợp lệ (REP3) |
| FR16_EP_IV10 | Dòng dữ liệu có giá sản phẩm là số âm | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,-50000,,,1` (PRICE3) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng giá tiền không hợp lệ (REP3) |
| FR16_EP_IV11 | Dòng dữ liệu có giá sản phẩm không phải là số | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,abc,,,1` (PRICE4) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng giá tiền không hợp lệ (REP3) |
| FR16_EP_IV12 | Dòng dữ liệu để trống giá sản phẩm | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,,,,1` (PRICE5) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng thiếu giá tiền sản phẩm (REP3) |
| FR16_EP_IV13 | Dòng dữ liệu có ID danh mục không tồn tại trong hệ thống | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,100000,,,9999` (CAT2) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng danh mục không tồn tại (REP3) |
| FR16_EP_IV14 | Dòng dữ liệu có ID danh mục không phải số nguyên | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,100000,,,abc` (CAT3) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng danh mục không hợp lệ (REP3) |
| FR16_EP_IV15 | Dòng dữ liệu để trống ID danh mục | Đuôi `.csv` (EXT1), header đúng (HD1), dòng dữ liệu: `Sản phẩm A,100000,,,` (CAT4) | - Không có sản phẩm nào được thêm vào DB (DB2) <br>- Báo lỗi hàng thiếu danh mục sản phẩm (REP3) |
| FR16_EP_IV16 | Giao dịch nguyên tử (All-or-Nothing Rollback) khi có ít nhất một dòng dữ liệu bị lỗi trong số nhiều dòng dữ liệu đúng | File `.csv` (EXT1) với header đúng (HD1), chứa 4 dòng dữ liệu: <br>- Hàng 2: hợp lệ <br>- Hàng 3: hợp lệ <br>- Hàng 4: không hợp lệ (giá âm) (STATE2) <br>- Hàng 5: hợp lệ | - Không có sản phẩm nào trong file (kể cả hàng 2, 3, 5) được lưu vào DB (DB2) <br>- Hiển thị thông báo import thất bại: Chỉ rõ lý do lỗi tại Hàng 4, số dòng thành công hiển thị là 0 (REP3) |
