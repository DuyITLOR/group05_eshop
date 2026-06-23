# BVA-FR03: Test Design — Quên mật khẩu & Đặt lại mật khẩu

Phương pháp: 3-Point Boundary Values (BVA)  
Yêu cầu tham chiếu: FR-03 (Quên mật khẩu & Đặt lại mật khẩu)

---

## 1. Xác định input

Bảng dưới đây trình bày các miền giá trị input hợp lệ và các điểm biên tương ứng được xác định từ yêu cầu chức năng FR-03 và tài liệu thiết kế test case EP.

| Tham số/Trường input | Thuộc tính biên | Miền giá trị hợp lệ | Biên dưới (Min) | Biên trên (Max) | Các điểm biên cần kiểm thử (3-point BVA) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Email** | Độ dài chuỗi | [5, 254] ký tự *(giả định)* | 5 | 254 | - MINM: 4 ký tự<br>- MIN: 5 ký tự<br>- MINP: 6 ký tự<br>- MAXM: 253 ký tự<br>- MAX: 254 ký tự<br>- MAXP: 255 ký tự |
| **OTP** | Độ dài chuỗi | [6, 6] ký tự | 6 | 6 | - MINM/MAXM: 5 ký tự<br>- MIN/MAX: 6 ký tự<br>- MINP/MAXP: 7 ký tự |
| | Giá trị số | [000000, 999999] | `000000` (giá trị 0) | `999999` (giá trị 999999) | - MINM: N/A (không có số âm dạng OTP)<br>- MIN: `000000`<br>- MINP: `000001`<br>- MAXM: `999998`<br>- MAX: `999999`<br>- MAXP: N/A (trùng với độ dài 7 ký tự) |
| **Mật khẩu mới** | Độ dài chuỗi | [8, 255] ký tự *(giả định)* | 8 | 255 | - MINM: 7 ký tự<br>- MIN: 8 ký tự<br>- MINP: 9 ký tự<br>- MAXM: 254 ký tự<br>- MAX: 255 ký tự<br>- MAXP: 256 ký tự |
| | Số chữ hoa | [1, +∞) | 1 | N/A | - MINM: 0 chữ hoa<br>- MIN: 1 chữ hoa<br>- MINP: 2 chữ hoa |
| | Số chữ thường | [1, +∞) | 1 | N/A | - MINM: 0 chữ thường<br>- MIN: 1 chữ thường<br>- MINP: 2 chữ thường |
| | Số chữ số | [1, +∞) | 1 | N/A | - MINM: 0 chữ số<br>- MIN: 1 chữ số<br>- MINP: 2 chữ số |
| | Số ký tự đặc biệt | [1, +∞) | 1 | N/A | - MINM: 0 ký tự đặc biệt<br>- MIN: 1 ký tự đặc biệt<br>- MINP: 2 ký tự đặc biệt |
| **Xác nhận mật khẩu** | Khớp mật khẩu mới | Trùng với Mật khẩu mới | N/A | N/A | Không áp dụng phân tích giá trị biên (kiểm tra định tính khớp/không khớp bằng EP) |

*Ghi chú:*
- *Độ dài tối đa của Email (254 ký tự) dựa trên chuẩn RFC 5321.*
- *Độ dài tối thiểu của Email (5 ký tự) giả định định dạng ngắn nhất hợp lệ là `a@b.c`.*
- *Độ dài tối đa của Mật khẩu mới (255 ký tự) giả định theo giới hạn lưu trữ/nhập liệu chuẩn của hệ thống.*

---

## 2. Test case

### 2.1. Bước 1 — Lấy mã OTP

| ID | Partition Tested | Email (Input) | Expected Output |
|---|---|---|---|
| FR03_MINM_01 | Độ dài Email = [5, 254] | `a@.c` (độ dài 4) | - Không sinh OTP, hiển thị thông báo lỗi (O2)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Giữ nguyên Bước 1 (O8) |
| FR03_MIN_01 | Độ dài Email = [5, 254] | `a@b.c` (độ dài 5, đã đăng ký) | - Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Chuyển sang Bước 2 (O7) |
| FR03_MINP_01 | Độ dài Email = [5, 254] | `ab@b.c` (độ dài 6, đã đăng ký) | - Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Chuyển sang Bước 2 (O7) |
| FR03_MAXM_01 | Độ dài Email = [5, 254] | `a` (lặp lại 243 lần) + `@eshop.com` (tổng độ dài 253, đã đăng ký) | - Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Chuyển sang Bước 2 (O7) |
| FR03_MAX_01 | Độ dài Email = [5, 254] | `a` (lặp lại 244 lần) + `@eshop.com` (tổng độ dài 254, đã đăng ký) | - Sinh mã OTP đúng 6 chữ số và hiển thị trên màn hình (O1)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Chuyển sang Bước 2 (O7) |
| FR03_MAXP_01 | Độ dài Email = [5, 254] | `a` (lặp lại 245 lần) + `@eshop.com` (tổng độ dài 255) | - Không sinh OTP, hiển thị thông báo lỗi (O2)<br>- Hiển thị "Bước 1 / 2" (O3)<br>- Có hiển thị nút "Quay lại đăng nhập" (O5)<br>- Giữ nguyên Bước 1 (O8) |

*Lưu ý cho Bước 1:* Các test case trên giả định địa chỉ email (ngoại trừ trường hợp vượt biên) đã được đăng ký trên hệ thống để kiểm tra khả năng sinh mã OTP.

### 2.2. Bước 2 — Đặt lại mật khẩu

| ID | Partition Tested | OTP (Input) | Mật khẩu mới (Input) | Xác nhận mật khẩu (Input) | Expected Output |
|---|---|---|---|---|---|
| FR03_MINM_02 | Độ dài OTP = [6, 6] | `12345` | `NewPass1!` | `NewPass1!` | - Đặt lại mật khẩu thất bại, thông báo lỗi OTP không hợp lệ (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MIN_02 | Độ dài OTP = [6, 6] | `123456` *(mã đúng)* | `NewPass1!` | `NewPass1!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINP_02 | Độ dài OTP = [6, 6] | `1234567` | `NewPass1!` | `NewPass1!` | - Đặt lại mật khẩu thất bại, thông báo lỗi OTP không hợp lệ (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MIN_03 | Giá trị OTP = [000000, 999999] | `000000` *(mã đúng)* | `NewPass1!` | `NewPass1!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINP_03 | Giá trị OTP = [000000, 999999] | `000001` *(mã đúng)* | `NewPass1!` | `NewPass1!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MAXM_02 | Giá trị OTP = [000000, 999999] | `999998` *(mã đúng)* | `NewPass1!` | `NewPass1!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MAX_02 | Giá trị OTP = [000000, 999999] | `999999` *(mã đúng)* | `NewPass1!` | `NewPass1!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINM_03 | Độ dài Mật khẩu mới = [8, 255] | `123456` *(mã đúng)* | `Abc123!` (đoạn mã 7 ký tự) | `Abc123!` | - Đặt lại mật khẩu thất bại, thông báo lỗi mật khẩu quá ngắn (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MIN_04 | Độ dài Mật khẩu mới = [8, 255] | `123456` *(mã đúng)* | `Abc1234!` (đoạn mã 8 ký tự) | `Abc1234!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINP_04 | Độ dài Mật khẩu mới = [8, 255] | `123456` *(mã đúng)* | `Abc12345!` (đoạn mã 9 ký tự) | `Abc12345!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MAXM_03 | Độ dài Mật khẩu mới = [8, 255] | `123456` *(mã đúng)* | `A` + `b` (lặp lại 250 lần) + `1!` | `A` + `b` (lặp lại 250 lần) + `1!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MAX_03 | Độ dài Mật khẩu mới = [8, 255] | `123456` *(mã đúng)* | `A` + `b` (lặp lại 251 lần) + `1!` | `A` + `b` (lặp lại 251 lần) + `1!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MAXP_02 | Độ dài Mật khẩu mới = [8, 255] | `123456` *(mã đúng)* | `A` + `b` (lặp lại 252 lần) + `1!` | `A` + `b` (lặp lại 252 lần) + `1!` | - Đặt lại mật khẩu thất bại, thông báo lỗi mật khẩu quá dài (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINM_04 | Số chữ hoa trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `abc12345!` | `abc12345!` | - Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ hoa (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MIN_05 | Số chữ hoa trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `Abc12345!` | `Abc12345!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINP_05 | Số chữ hoa trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `ABc12345!` | `ABc12345!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINM_05 | Số chữ thường trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `ABC12345!` | `ABC12345!` | - Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ thường (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MIN_06 | Số chữ thường trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `aBC12345!` | `aBC12345!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINP_06 | Số chữ thường trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `abC12345!` | `abC12345!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINM_06 | Số chữ số trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `Abcdefgh!` | `Abcdefgh!` | - Đặt lại mật khẩu thất bại, thông báo lỗi thiếu chữ số (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MIN_07 | Số chữ số trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `Abcdefg1!` | `Abcdefg1!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINP_07 | Số chữ số trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `Abcdef12!` | `Abcdef12!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINM_07 | Số ký tự đặc biệt trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `Abc12345` | `Abc12345` | - Đặt lại mật khẩu thất bại, thông báo lỗi thiếu ký tự đặc biệt (O10)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MIN_08 | Số ký tự đặc biệt trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `Abc1234!` | `Abc1234!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
| FR03_MINP_08 | Số ký tự đặc biệt trong Mật khẩu mới = [1, +∞) | `123456` *(mã đúng)* | `Abc1234!!` | `Abc1234!!` | - Đặt lại mật khẩu thành công (O9)<br>- Hiển thị "Bước 2 / 2" (O11) |
