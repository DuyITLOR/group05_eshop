# EP-FR03: Test Design — Quên mật khẩu & Đặt lại mật khẩu

**Phương pháp:** Equivalence Partitioning (EP)  
**Yêu cầu tham chiếu:** FR-03 (Quên mật khẩu & Đặt lại mật khẩu)

---

## 1. Xác định miền giá trị Input & Output

### Bước 1 — Lấy mã OTP

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Email | 4 | E1: Email đúng định dạng và đã đăng ký trong hệ thống (VD: `test@eshop.com`) | E2: Email đúng định dạng nhưng chưa đăng ký trong hệ thống (VD: `notexist@eshop.com`) |
| | | | E3: Email sai định dạng (VD: `invalidemail`, `abc@`, `@domain.com`) |
| | | | E4: Email để trống |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Mã OTP | 2 | O1: Hệ thống sinh mã OTP gồm đúng 6 chữ số ngẫu nhiên và hiển thị trên màn hình | O2: Không sinh mã OTP, hiển thị thông báo lỗi phù hợp |
| Chỉ báo bước (Step Indicator) | 2 | O3: Hiển thị chỉ báo "Bước 1 / 2" | O4: Không hiển thị hoặc hiển thị sai chỉ báo bước |
| Nút quay lại đăng nhập | 2 | O5: Có hiển thị nút "Quay lại đăng nhập" và hoạt động đúng | O6: Không hiển thị nút hoặc nút không hoạt động |
| Chuyển bước | 2 | O7: Chuyển sang giao diện Bước 2 sau khi gửi OTP thành công | O8: Không chuyển bước, giữ nguyên Bước 1 |

---

### Bước 2 — Đặt lại mật khẩu

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| OTP | 4 | OTP1: Mã OTP đúng 6 chữ số, khớp với mã đã gửi cho email yêu cầu | OTP2: Mã OTP sai (không khớp với mã đã sinh) |
| | | | OTP3: Mã OTP của email khác (dùng OTP sinh cho email A nhập vào form của email B) |
| | | | OTP4: OTP để trống |
| Mật khẩu mới | 7 | PW1: Mật khẩu hợp lệ — ≥ 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 ký tự đặc biệt (`@$!%*?&`) (VD: `NewPass1!`) | PW2: Mật khẩu ngắn hơn 8 ký tự (VD: `Ab1!xyz`) |
| | | | PW3: Mật khẩu không có chữ hoa (VD: `newpass1!`) |
| | | | PW4: Mật khẩu không có chữ thường (VD: `NEWPASS1!`) |
| | | | PW5: Mật khẩu không có chữ số (VD: `NewPass!!`) |
| | | | PW6: Mật khẩu không có ký tự đặc biệt (VD: `NewPass12`) |
| | | | PW7: Mật khẩu để trống |
| Xác nhận mật khẩu mới | 3 | CF1: Xác nhận mật khẩu khớp với mật khẩu mới | CF2: Xác nhận mật khẩu không khớp với mật khẩu mới |
| | | | CF3: Xác nhận mật khẩu để trống |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Kết quả | 2 | O9: Đặt lại mật khẩu thành công, hiển thị thông báo thành công | O10: Đặt lại mật khẩu thất bại, hiển thị thông báo lỗi phù hợp |
| Chỉ báo bước (Step Indicator) | 2 | O11: Hiển thị chỉ báo "Bước 2 / 2" | O12: Không hiển thị hoặc hiển thị sai chỉ báo bước |

---

## 2. Test Case

### 2.1. Test case cho miền hợp lệ

#### Bước 1 — Lấy mã OTP (Input)

| ID | Test Objective | Email (Input) | OTP (Output) | Step Indicator (Output) | Nút quay lại (Output) | Chuyển bước (Output) |
|---|---|---|---|---|---|---|
| FR03_EP_V01 | Email hợp lệ đã đăng ký trong miền E1 | `test@eshop.com` (E1) | Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1) | Hiển thị "Bước 1 / 2" (O3) | Có hiển thị nút "Quay lại đăng nhập" (O5) | Chuyển sang Bước 2 (O7) |

#### Bước 1 — Lấy mã OTP (Output)

| ID | Test Objective | Email (Input) | OTP (Output) | Step Indicator (Output) | Nút quay lại (Output) | Chuyển bước (Output) |
|---|---|---|---|---|---|---|
| FR03_EP_V02 | Mã OTP sinh ra gồm đúng 6 chữ số ngẫu nhiên trong miền O1 | `test@eshop.com` (E1) | Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1) | Hiển thị "Bước 1 / 2" (O3) | Có hiển thị nút "Quay lại đăng nhập" (O5) | Chuyển sang Bước 2 (O7) |
| FR03_EP_V03 | Chỉ báo bước hiển thị đúng "Bước 1 / 2" trong miền O3 | `test@eshop.com` (E1) | Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1) | Hiển thị "Bước 1 / 2" (O3) | Có hiển thị nút "Quay lại đăng nhập" (O5) | Chuyển sang Bước 2 (O7) |
| FR03_EP_V04 | Nút "Quay lại đăng nhập" hiển thị và hoạt động đúng trong miền O5 | `test@eshop.com` (E1) | Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1) | Hiển thị "Bước 1 / 2" (O3) | Có hiển thị nút "Quay lại đăng nhập" (O5) | Chuyển sang Bước 2 (O7) |
| FR03_EP_V05 | Chuyển sang giao diện Bước 2 sau khi gửi OTP thành công trong miền O7 | `test@eshop.com` (E1) | Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1) | Hiển thị "Bước 1 / 2" (O3) | Có hiển thị nút "Quay lại đăng nhập" (O5) | Chuyển sang Bước 2 (O7) |

#### Bước 2 — Đặt lại mật khẩu (Input)

| ID | Test Objective | OTP (Input) | Mật khẩu mới (Input) | Xác nhận mật khẩu (Input) | Kết quả (Output) | Step Indicator (Output) |
|---|---|---|---|---|---|---|
| FR03_EP_V06 | OTP đúng trong miền OTP1, mật khẩu hợp lệ trong miền PW1, xác nhận khớp trong miền CF1 | Mã OTP đúng đã được sinh (OTP1) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | Đặt lại mật khẩu thành công (O9) | Hiển thị "Bước 2 / 2" (O11) |

#### Bước 2 — Đặt lại mật khẩu (Output)

| ID | Test Objective | OTP (Input) | Mật khẩu mới (Input) | Xác nhận mật khẩu (Input) | Kết quả (Output) | Step Indicator (Output) |
|---|---|---|---|---|---|---|
| FR03_EP_V07 | Đặt lại mật khẩu thành công, hiển thị thông báo thành công trong miền O9 | Mã OTP đúng đã được sinh (OTP1) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | Đặt lại mật khẩu thành công (O9) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_V08 | Chỉ báo bước hiển thị đúng "Bước 2 / 2" trong miền O11 | Mã OTP đúng đã được sinh (OTP1) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | Đặt lại mật khẩu thành công (O9) | Hiển thị "Bước 2 / 2" (O11) |

---

### 2.2. Test case cho miền không hợp lệ

#### Bước 1 — Lấy mã OTP (Input)

| ID | Test Objective | Email (Input) | OTP (Output) | Step Indicator (Output) | Nút quay lại (Output) | Chuyển bước (Output) |
|---|---|---|---|---|---|---|
| FR03_EP_IV01 | Email đúng định dạng nhưng chưa đăng ký trong miền E2 | `notexist@eshop.com` (E2) | Không sinh OTP, hiển thị thông báo lỗi (O2) | Hiển thị "Bước 1 / 2" (O3) | Có hiển thị nút "Quay lại đăng nhập" (O5) | Giữ nguyên Bước 1 (O8) |
| FR03_EP_IV02 | Email sai định dạng trong miền E3 | `invalidemail` (E3) | Không sinh OTP, hiển thị thông báo lỗi định dạng email (O2) | Hiển thị "Bước 1 / 2" (O3) | Có hiển thị nút "Quay lại đăng nhập" (O5) | Giữ nguyên Bước 1 (O8) |
| FR03_EP_IV03 | Email để trống trong miền E4 | *(để trống)* (E4) | Không sinh OTP, hiển thị thông báo lỗi yêu cầu nhập email (O2) | Hiển thị "Bước 1 / 2" (O3) | Có hiển thị nút "Quay lại đăng nhập" (O5) | Giữ nguyên Bước 1 (O8) |

#### Bước 2 — Đặt lại mật khẩu (Input)

| ID | Test Objective | OTP (Input) | Mật khẩu mới (Input) | Xác nhận mật khẩu (Input) | Kết quả (Output) | Step Indicator (Output) |
|---|---|---|---|---|---|---|
| FR03_EP_IV04 | OTP sai trong miền OTP2 | `000000` (OTP2) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | Đặt lại mật khẩu thất bại, thông báo lỗi OTP không hợp lệ (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV05 | OTP của email khác trong miền OTP3 | OTP sinh cho email khác (OTP3) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | Đặt lại mật khẩu thất bại, thông báo lỗi OTP không hợp lệ (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV06 | OTP để trống trong miền OTP4 | *(để trống)* (OTP4) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | Đặt lại mật khẩu thất bại, thông báo lỗi yêu cầu nhập OTP (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV07 | Mật khẩu ngắn hơn 8 ký tự trong miền PW2 | Mã OTP đúng (OTP1) | `Ab1!xyz` (PW2) | `Ab1!xyz` (CF1) | Đặt lại mật khẩu thất bại, thông báo lỗi mật khẩu quá ngắn (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV08 | Mật khẩu không có chữ hoa trong miền PW3 | Mã OTP đúng (OTP1) | `newpass1!` (PW3) | `newpass1!` (CF1) | Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ hoa (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV09 | Mật khẩu không có chữ thường trong miền PW4 | Mã OTP đúng (OTP1) | `NEWPASS1!` (PW4) | `NEWPASS1!` (CF1) | Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ thường (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV10 | Mật khẩu không có chữ số trong miền PW5 | Mã OTP đúng (OTP1) | `NewPass!!` (PW5) | `NewPass!!` (CF1) | Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ số (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV11 | Mật khẩu không có ký tự đặc biệt trong miền PW6 | Mã OTP đúng (OTP1) | `NewPass12` (PW6) | `NewPass12` (CF1) | Đặt lại mật khẩu thất bại, thông báo lỗi thiếu ký tự đặc biệt (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV12 | Mật khẩu để trống trong miền PW7 | Mã OTP đúng (OTP1) | *(để trống)* (PW7) | *(để trống)* (CF3) | Đặt lại mật khẩu thất bại, thông báo lỗi yêu cầu nhập mật khẩu (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV13 | Xác nhận mật khẩu không khớp trong miền CF2 | Mã OTP đúng (OTP1) | `NewPass1!` (PW1) | `DiffPass1!` (CF2) | Đặt lại mật khẩu thất bại, thông báo lỗi mật khẩu xác nhận không khớp (O10) | Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV14 | Xác nhận mật khẩu để trống trong miền CF3 | Mã OTP đúng (OTP1) | `NewPass1!` (PW1) | *(để trống)* (CF3) | Đặt lại mật khẩu thất bại, thông báo lỗi yêu cầu xác nhận mật khẩu (O10) | Hiển thị "Bước 2 / 2" (O11) |

---

## 3. Rút gọn TC

Gộp các test case có chung giá trị Input và Output thành một test case duy nhất với nhiều test objective.

### 3.1. Test case hợp lệ (rút gọn)

#### Bước 1 — Lấy mã OTP

| ID | Test Objective (gộp) | Email (Input) | Expected Output |
|---|---|---|---|
| FR03_EP_V01 | Gộp: FR03_EP_V01,FR03_EP_V02,FR03_EP_V03,FR03_EP_V04,FR03_EP_V05<br>- Email hợp lệ đã đăng ký trong miền E1<br>- Mã OTP sinh ra gồm đúng 6 chữ số ngẫu nhiên trong miền O1<br>- Chỉ báo bước hiển thị đúng "Bước 1 / 2" trong miền O3<br>- Nút "Quay lại đăng nhập" hiển thị và hoạt động đúng trong miền O5<br>- Chuyển sang giao diện Bước 2 sau khi gửi OTP thành công trong miền O7 | `test@eshop.com` (E1) | - Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Chuyển sang Bước 2 (O7) |

#### Bước 2 — Đặt lại mật khẩu

| ID | Test Objective (gộp) | OTP (Input) | Mật khẩu mới (Input) | Xác nhận mật khẩu (Input) | Expected Output |
|---|---|---|---|---|---|
| FR03_EP_V02 | Gộp: FR03_EP_V06,FR03_EP_V07,FR03_EP_V08<br>- OTP đúng trong miền OTP1, mật khẩu hợp lệ trong miền PW1, xác nhận khớp trong miền CF1<br>- Đặt lại mật khẩu thành công, hiển thị thông báo thành công trong miền O9<br>- Chỉ báo bước hiển thị đúng "Bước 2 / 2" trong miền O11 | Mã OTP đúng đã được sinh (OTP1) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |

---

### 3.2. Test case không hợp lệ (rút gọn)

Các test case không hợp lệ đều có input khác nhau nên không thể gộp thêm, giữ nguyên từ mục 2.2.

#### Bước 1 — Lấy mã OTP

| ID | Test Objective | Email (Input) | Expected Output |
|---|---|---|---|
| FR03_EP_IV01 | Email đúng định dạng nhưng chưa đăng ký trong miền E2 | `notexist@eshop.com` (E2) | - Không sinh OTP, hiển thị thông báo lỗi (O2)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Giữ nguyên Bước 1 (O8) |
| FR03_EP_IV02 | Email sai định dạng trong miền E3 | `invalidemail` (E3) | - Không sinh OTP, hiển thị thông báo lỗi định dạng email (O2)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Giữ nguyên Bước 1 (O8) |
| FR03_EP_IV03 | Email để trống trong miền E4 | *(để trống)* (E4) | - Không sinh OTP, hiển thị thông báo lỗi yêu cầu nhập email (O2)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Giữ nguyên Bước 1 (O8) |

#### Bước 2 — Đặt lại mật khẩu

| ID | Test Objective | OTP (Input) | Mật khẩu mới (Input) | Xác nhận mật khẩu (Input) | Expected Output |
|---|---|---|---|---|---|
| FR03_EP_IV04 | OTP sai trong miền OTP2 | `000000` (OTP2) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | - Đặt lại mật khẩu thất bại, thông báo lỗi OTP không hợp lệ (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV05 | OTP của email khác trong miền OTP3 | OTP sinh cho email khác (OTP3) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | - Đặt lại mật khẩu thất bại, thông báo lỗi OTP không hợp lệ (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV06 | OTP để trống trong miền OTP4 | *(để trống)* (OTP4) | `NewPass1!` (PW1) | `NewPass1!` (CF1) | - Đặt lại mật khẩu thất bại, thông báo lỗi yêu cầu nhập OTP (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV07 | Mật khẩu ngắn hơn 8 ký tự trong miền PW2 | Mã OTP đúng (OTP1) | `Ab1!xyz` (PW2) | `Ab1!xyz` (CF1) | - Đặt lại mật khẩu thất bại, thông báo lỗi mật khẩu quá ngắn (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV08 | Mật khẩu không có chữ hoa trong miền PW3 | Mã OTP đúng (OTP1) | `newpass1!` (PW3) | `newpass1!` (CF1) | - Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ hoa (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV09 | Mật khẩu không có chữ thường trong miền PW4 | Mã OTP đúng (OTP1) | `NEWPASS1!` (PW4) | `NEWPASS1!` (CF1) | - Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ thường (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV10 | Mật khẩu không có chữ số trong miền PW5 | Mã OTP đúng (OTP1) | `NewPass!!` (PW5) | `NewPass!!` (CF1) | - Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ số (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV11 | Mật khẩu không có ký tự đặc biệt trong miền PW6 | Mã OTP đúng (OTP1) | `NewPass12` (PW6) | `NewPass12` (CF1) | - Đặt lại mật khẩu thất bại, thông báo lỗi thiếu ký tự đặc biệt (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV12 | Mật khẩu để trống trong miền PW7 | Mã OTP đúng (OTP1) | *(để trống)* (PW7) | *(để trống)* (CF3) | - Đặt lại mật khẩu thất bại, thông báo lỗi yêu cầu nhập mật khẩu (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV13 | Xác nhận mật khẩu không khớp trong miền CF2 | Mã OTP đúng (OTP1) | `NewPass1!` (PW1) | `DiffPass1!` (CF2) | - Đặt lại mật khẩu thất bại, thông báo lỗi mật khẩu xác nhận không khớp (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_EP_IV14 | Xác nhận mật khẩu để trống trong miền CF3 | Mã OTP đúng (OTP1) | `NewPass1!` (PW1) | *(để trống)* (CF3) | - Đặt lại mật khẩu thất bại, thông báo lỗi yêu cầu xác nhận mật khẩu (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |


