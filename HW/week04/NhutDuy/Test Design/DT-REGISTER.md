# DT-REGISTER: Test Design — Đăng ký tài khoản

**Phương pháp:** Decision Table (Bảng quyết định)
**Yêu cầu tham chiếu:** FR-01 (Đăng ký tài khoản)
**Module:** REGISTER
**Labels:** `type: test-case` · `module: register` · `technique: decision-table`

---

## 1. Điều kiện (Conditions / Causes)

Mỗi điều kiện là một mệnh đề **Đúng (T) / Sai (F)** rút ra từ luật của FR-01.

| Mã | Điều kiện | Khi T (ví dụ) | Khi F (ví dụ) |
|---|---|---|---|
| C1 | Họ tên hợp lệ (không để trống) | `Nguyen Van A` | *(để trống)* |
| C2 | Email đúng định dạng `user@domain.com` | `newuser@eshop.com` | `abc`, `a@`, `@eshop.com` |
| C3 | Email là duy nhất (chưa tồn tại trong hệ thống) | `newuser@eshop.com` | `test@eshop.com` (đã đăng ký) |
| C4 | Mật khẩu mạnh: ≥ 8 ký tự, ≥ 1 hoa, 1 thường, 1 số, 1 ký tự đặc biệt (`@$!%*?&`) | `Pass123!` | `pass` (yếu) |
| C5 | Xác nhận mật khẩu khớp với mật khẩu | `Pass123!` ≡ `Pass123!` | `Pass123!` ≠ `Pass999!` |

---

## 2. Hành động (Actions / Effects / Outputs)

| Mã | Hành động |
|---|---|
| A1 | Đăng ký **thành công** → hiển thị thông báo thành công và **chuyển sang trang Đăng nhập** |
| A2 | **Từ chối** đăng ký + hiển thị **thông báo lỗi** tương ứng với điều kiện vi phạm |

---

## 3. Bảng quyết định đầy đủ

Có **5 điều kiện nhị phân** → bảng đầy đủ là **2⁵ = 32 cột (rule)**. Liệt kê đầy đủ cả 32 tổ hợp (T = điều kiện đúng, F = điều kiện sai):

| Rule | C1 (Tên) | C2 (Định dạng email) | C3 (Email duy nhất) | C4 (Mật khẩu mạnh) | C5 (Xác nhận khớp) | Kết quả | Điều kiện vi phạm |
|:--:|:--:|:--:|:--:|:--:|:--:|---|---|
| R01 | T | T | T | T | T | A1 — Thành công | — |
| R02 | T | T | T | T | F | A2 — Từ chối | Xác nhận không khớp |
| R03 | T | T | T | F | T | A2 — Từ chối | Mật khẩu yếu |
| R04 | T | T | T | F | F | A2 — Từ chối | Mật khẩu yếu; Xác nhận không khớp |
| R05 | T | T | F | T | T | A2 — Từ chối | Email đã tồn tại |
| R06 | T | T | F | T | F | A2 — Từ chối | Email đã tồn tại; Xác nhận không khớp |
| R07 | T | T | F | F | T | A2 — Từ chối | Email đã tồn tại; Mật khẩu yếu |
| R08 | T | T | F | F | F | A2 — Từ chối | Email đã tồn tại; Mật khẩu yếu; Xác nhận không khớp |
| R09 | T | F | T | T | T | A2 — Từ chối | Email sai định dạng |
| R10 | T | F | T | T | F | A2 — Từ chối | Email sai định dạng; Xác nhận không khớp |
| R11 | T | F | T | F | T | A2 — Từ chối | Email sai định dạng; Mật khẩu yếu |
| R12 | T | F | T | F | F | A2 — Từ chối | Email sai định dạng; Mật khẩu yếu; Xác nhận không khớp |
| R13 | T | F | F | T | T | A2 — Từ chối | Email sai định dạng; Email đã tồn tại |
| R14 | T | F | F | T | F | A2 — Từ chối | Email sai định dạng; Email đã tồn tại; Xác nhận không khớp |
| R15 | T | F | F | F | T | A2 — Từ chối | Email sai định dạng; Email đã tồn tại; Mật khẩu yếu |
| R16 | T | F | F | F | F | A2 — Từ chối | Email sai định dạng; Email đã tồn tại; Mật khẩu yếu; Xác nhận không khớp |
| R17 | F | T | T | T | T | A2 — Từ chối | Tên trống |
| R18 | F | T | T | T | F | A2 — Từ chối | Tên trống; Xác nhận không khớp |
| R19 | F | T | T | F | T | A2 — Từ chối | Tên trống; Mật khẩu yếu |
| R20 | F | T | T | F | F | A2 — Từ chối | Tên trống; Mật khẩu yếu; Xác nhận không khớp |
| R21 | F | T | F | T | T | A2 — Từ chối | Tên trống; Email đã tồn tại |
| R22 | F | T | F | T | F | A2 — Từ chối | Tên trống; Email đã tồn tại; Xác nhận không khớp |
| R23 | F | T | F | F | T | A2 — Từ chối | Tên trống; Email đã tồn tại; Mật khẩu yếu |
| R24 | F | T | F | F | F | A2 — Từ chối | Tên trống; Email đã tồn tại; Mật khẩu yếu; Xác nhận không khớp |
| R25 | F | F | T | T | T | A2 — Từ chối | Tên trống; Email sai định dạng |
| R26 | F | F | T | T | F | A2 — Từ chối | Tên trống; Email sai định dạng; Xác nhận không khớp |
| R27 | F | F | T | F | T | A2 — Từ chối | Tên trống; Email sai định dạng; Mật khẩu yếu |
| R28 | F | F | T | F | F | A2 — Từ chối | Tên trống; Email sai định dạng; Mật khẩu yếu; Xác nhận không khớp |
| R29 | F | F | F | T | T | A2 — Từ chối | Tên trống; Email sai định dạng; Email đã tồn tại |
| R30 | F | F | F | T | F | A2 — Từ chối | Tên trống; Email sai định dạng; Email đã tồn tại; Xác nhận không khớp |
| R31 | F | F | F | F | T | A2 — Từ chối | Tên trống; Email sai định dạng; Email đã tồn tại; Mật khẩu yếu |
| R32 | F | F | F | F | F | A2 — Từ chối | Tên trống; Email sai định dạng; Email đã tồn tại; Mật khẩu yếu; Xác nhận không khớp |

**Nhận xét:** Chỉ có **1 rule thành công** (R01 — mọi điều kiện T), còn lại **31 rule đều cho cùng kết quả A2 (Từ chối)**. Đăng ký tuân theo nguyên tắc logic **"chỉ cần 1 điều kiện sai → đăng ký thất bại"**, nên 31 cột lỗi này **trùng kết quả** và có thể gộp bằng giá trị **don't-care (`–`)** → rút gọn còn 6 rule ở mục 4.

---

## 4. Bảng quyết định rút gọn (Collapsing)

Áp dụng 2 luật: (a) đánh dấu `–` cho điều kiện không ảnh hưởng kết quả; (b) gộp các cột cùng Action. Còn lại **6 rule**:

| Điều kiện | R1 | R2 | R3 | R4 | R5 | R6 |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| C1 — Họ tên hợp lệ | T | **F** | – | – | – | – |
| C2 — Email đúng định dạng | T | – | **F** | T | – | – |
| C3 — Email duy nhất | T | – | – | **F** | – | – |
| C4 — Mật khẩu mạnh | T | – | – | – | **F** | – |
| C5 — Xác nhận khớp | T | – | – | – | – | **F** |
| **A1 — Thành công** | ✔ | | | | | |
| **A2 — Lỗi** | | ✔ | ✔ | ✔ | ✔ | ✔ |
| **Loại thông báo lỗi** | – | Lỗi họ tên | Lỗi định dạng email | Email đã tồn tại | Mật khẩu yếu | Xác nhận không khớp |

> Ghi chú logic: C3 (email duy nhất) chỉ có ý nghĩa khi C2 = T (định dạng đúng), nên ở **R4** đặt `C2 = T, C3 = F`.

---

## 5. Danh sách Test Case

Mỗi rule → 1 test case. Gán giá trị thật cho các `–` (chọn giá trị **hợp lệ** để cô lập đúng nguyên nhân lỗi).

| ID | Rule | Họ tên | Email | Mật khẩu | Xác nhận | Expected Output |
|---|:--:|---|---|---|---|---|
| TC-REGISTER-001 | R1 | `Nguyen Van A` | `newuser@eshop.com` | `Pass123!` | `Pass123!` | Đăng ký thành công → chuyển trang Đăng nhập (A1) |
| TC-REGISTER-002 | R2 | *(để trống)* | `newuser@eshop.com` | `Pass123!` | `Pass123!` | Từ chối, báo lỗi yêu cầu nhập Họ tên (A2) |
| TC-REGISTER-003 | R3 | `Nguyen Van A` | `abc` | `Pass123!` | `Pass123!` | Từ chối, báo lỗi Email sai định dạng (A2) |
| TC-REGISTER-004 | R4 | `Nguyen Van A` | `test@eshop.com` | `Pass123!` | `Pass123!` | Từ chối, báo lỗi Email đã tồn tại (A2) |
| TC-REGISTER-005 | R5 | `Nguyen Van A` | `newuser@eshop.com` | `pass` | `pass` | Từ chối, báo lỗi Mật khẩu chưa đủ mạnh (A2) |
| TC-REGISTER-006 | R6 | `Nguyen Van A` | `newuser@eshop.com` | `Pass123!` | `Pass999!` | Từ chối, báo lỗi Xác nhận mật khẩu không khớp (A2) |
