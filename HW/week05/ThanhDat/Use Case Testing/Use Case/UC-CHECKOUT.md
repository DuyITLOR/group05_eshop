# UC-FR08: Test Design — Thanh toán (Checkout)

**Phương pháp:** Use Case Testing (UC)
**Yêu cầu tham chiếu:** FR-08 (Thanh toán — Checkout)
**Nguồn tham chiếu:** README.md § FR-08 (dòng 102–108); api_specification.md §4.3 (`POST /api/checkout`); backend/server.js dòng 297–309.

> Bộ này bổ sung góc nhìn **kịch bản người dùng end-to-end** cho FR-08. Bộ State Transition có sẵn (`ST-FR08.md`, `TC-FR08-01..06`) tập trung vào vòng đời trạng thái; bộ Use Case này tập trung vào luồng tương tác (basic / alternative / exception). Test case mới đánh số tiếp từ **TC-FR08-07**.

---

## 1. Actor & Điều kiện

- **Actor chính:** User (khách hàng đã có tài khoản). **Actor phụ:** Guest (chưa đăng nhập) — chỉ ở luồng phụ/lỗi.
- **Precondition:** Giỏ hàng của người dùng có **ít nhất 1 sản phẩm**.
- **Postcondition (thành công):**
  - Một đơn hàng mới được tạo với `status = pending`.
  - `total_amount` lưu trong đơn = giá trị **server tự tính lại** từ giỏ hàng (theo spec dòng 107).
  - Giỏ hàng của người dùng bị **xóa** (rỗng).

---

## 2. Basic Flow (Main Success Scenario)

| Bước | Actor Action | System Response |
|---|---|---|
| 1 | User (đã đăng nhập) đang ở trang Giỏ hàng có ≥ 1 sản phẩm, nhấn nút **"Thanh toán"** | Kiểm tra người dùng đã đăng nhập (JWT hợp lệ) → cho phép vào trang Checkout |
| 2 | (hệ thống) | Hiển thị trang Checkout: danh sách đầy đủ sản phẩm đặt mua + **tổng tiền tính tự động, không cho chỉnh sửa trực tiếp** |
| 3 | User nhập **địa chỉ giao hàng**, nhấn nút xác nhận đặt hàng | Gửi `POST /api/checkout` kèm JWT hợp lệ |
| 4 | (hệ thống) | Backend **tự tính lại tổng tiền** từ giỏ hàng, tạo đơn hàng mới với `status = pending`, `total_amount` = giá trị server tính |
| 5 | (hệ thống) | Xóa giỏ hàng; hiển thị thông báo/màn hình đặt hàng thành công; `GET /api/cart` trả về giỏ rỗng |

---

## 3. Alternative Flows (luồng phụ hợp lệ — vẫn dẫn đến thành công)

### ALT-1: Guest được yêu cầu đăng nhập rồi tiếp tục thanh toán
- **Rẽ nhánh từ:** bước 1 của Basic Flow.
- **Mô tả:** Người dùng **chưa đăng nhập** nhấn "Thanh toán". Hệ thống chặn vào Checkout và điều hướng sang trang **Đăng nhập**. Người dùng đăng nhập thành công (`test@eshop.com` / `Test1234!`).
- **Điểm quay lại:** sau khi đăng nhập, người dùng tiếp tục vào được trang Checkout (bước 2) và hoàn tất Basic Flow tới bước 5 thành công.
- **Căn cứ:** FR-08 dòng 104 "Chỉ người dùng đã đăng nhập mới tiến hành thanh toán được".

---

## 4. Exception Flows (luồng lỗi)

### EXC-1: Truy cập trang Checkout khi chưa đăng nhập (không đăng nhập tiếp)
- **Phát sinh tại:** bước 1 (hoặc truy cập thẳng URL `/checkout`).
- **Điều kiện lỗi:** không có JWT ở client.
- **Hành vi hệ thống:** không hiển thị nội dung Checkout; điều hướng về trang Đăng nhập; **không** phát sinh yêu cầu tạo đơn hàng.
- **Căn cứ:** FR-08 dòng 104.

### EXC-2: Gọi thẳng `POST /api/checkout` KHÔNG kèm token
- **Phát sinh tại:** bước 3 (tấn công/bỏ qua UI).
- **Điều kiện lỗi:** request thiếu header `Authorization`.
- **Hành vi hệ thống:** HTTP **401 Unauthorized**, không tạo đơn hàng.
- **Căn cứ:** SEC-02; backend `authenticateToken` middleware trên `POST /api/checkout` (server.js:297).

### EXC-3: Gọi `POST /api/checkout` với JWT hết hạn / không hợp lệ
- **Phát sinh tại:** bước 3.
- **Điều kiện lỗi:** token sai chữ ký hoặc đã hết hạn.
- **Hành vi hệ thống:** HTTP **401/403**, không tạo đơn hàng.
- **Căn cứ:** SEC-02.

### EXC-4: Client gửi `total_amount` bị sửa **THẤP hơn** giá trị thật của giỏ
- **Phát sinh tại:** bước 3–4.
- **Điều kiện lỗi:** payload `total_amount` nhỏ hơn tổng thật của giỏ.
- **Hành vi hệ thống mong đợi (theo spec):** đơn hàng vẫn được tạo (`pending`) **nhưng** `total_amount` lưu = giá trị **server tính lại**, KHÔNG theo giá trị client gửi.
- **Căn cứ:** FR-08 dòng 107.
- ⚠ **Nghi vấn bug:** `backend/server.js:302` lưu thẳng `total_amount` từ `req.body` vào DB, không tính lại → nhiều khả năng test case này **Fail** (đây là bug cố ý của SUT).

### EXC-5: Client gửi `total_amount` bị sửa **CAO hơn** giá trị thật của giỏ
- **Phát sinh tại:** bước 3–4.
- **Điều kiện lỗi:** payload `total_amount` lớn hơn tổng thật của giỏ.
- **Hành vi hệ thống mong đợi:** như EXC-4 — `total_amount` lưu phải là giá trị server tính lại.
- **Căn cứ:** FR-08 dòng 107. ⚠ Cùng nghi vấn bug với EXC-4.

### EXC-6: Thanh toán khi giỏ hàng rỗng
- **Phát sinh tại:** bước 1.
- **Điều kiện lỗi:** giỏ hàng không có sản phẩm nào (vi phạm precondition).
- **Hành vi hệ thống mong đợi:** không cho tiến hành đặt hàng / báo lỗi phù hợp; không tạo đơn `total_amount = 0`.
- **Căn cứ:** suy ra từ precondition FR-08 + FR-07. **cần xác minh** (spec không quy định tường minh hành vi checkout giỏ rỗng).

---

## 5. Bảng tổng hợp Scenario

| Scenario ID | Mô tả ngắn | Loại |
|---|---|---|
| Basic | Đăng nhập → Checkout → đặt hàng (total đúng) → giỏ hàng bị xóa | Thành công |
| ALT-1 | Guest nhấn Thanh toán → bị đưa về Đăng nhập → đăng nhập → tiếp tục đặt hàng thành công | Thành công (luồng phụ) |
| EXC-1 | Chưa đăng nhập, truy cập thẳng trang Checkout → bị chặn | Lỗi |
| EXC-2 | `POST /api/checkout` không token → 401 | Lỗi |
| EXC-3 | `POST /api/checkout` token hết hạn/sai → 401/403 | Lỗi |
| EXC-4 | `total_amount` client sửa thấp hơn → server phải tính lại | Lỗi (nghi vấn bug) |
| EXC-5 | `total_amount` client sửa cao hơn → server phải tính lại | Lỗi (nghi vấn bug) |
| EXC-6 | Checkout khi giỏ rỗng → chặn/báo lỗi | Lỗi (cần xác minh) |

---

## 6. Danh sách Test Case (trước khi rút gọn)

| ID | Scenario | Test Objective | Các bước chính đi qua | Expected Output |
|---|---|---|---|---|
| FR08_UC_01 | Basic | Đặt hàng thành công end-to-end với tổng tiền đúng | 1→2→3→4→5 | Trang Checkout hiển thị đủ sản phẩm + tổng tiền không sửa được; đơn tạo `status=pending`, `total_amount` đúng; giỏ hàng rỗng sau đó |
| FR08_UC_02 | ALT-1 | Guest được điều hướng đăng nhập rồi hoàn tất thanh toán | 1→(chặn)→login→2→3→4→5 | Bị đưa về trang Đăng nhập; sau đăng nhập vào được Checkout và đặt hàng thành công |
| FR08_UC_03 | EXC-1 | Chưa đăng nhập không vào được Checkout | 1 (hoặc URL trực tiếp) | Không hiển thị Checkout; điều hướng Đăng nhập; không tạo đơn |
| FR08_UC_04 | EXC-2 | API checkout không token bị từ chối | 3 (gọi API trực tiếp) | HTTP 401; không tạo đơn hàng |
| FR08_UC_05 | EXC-3 | API checkout token sai/hết hạn bị từ chối | 3 (gọi API trực tiếp) | HTTP 401/403; không tạo đơn hàng |
| FR08_UC_06 | EXC-4 | `total_amount` sửa thấp hơn → server tính lại | 3→4 (payload sửa) | Đơn tạo với `total_amount` = giá trị server tính, không theo client |
| FR08_UC_07 | EXC-5 | `total_amount` sửa cao hơn → server tính lại | 3→4 (payload sửa) | Đơn tạo với `total_amount` = giá trị server tính, không theo client |
| FR08_UC_08 | EXC-6 | Checkout giỏ rỗng bị chặn | 1 | Không cho đặt hàng / báo lỗi; không tạo đơn `total_amount=0` |

---

## 7. Rút gọn Test Case

Mỗi scenario có input/expected-output khác nhau — không gộp được; mỗi exception flow giữ riêng 1 test case để cô lập nguyên nhân. Ánh xạ sang mã Test Case chính thức (tiếp nối TC-FR08-06 của bộ ST cũ):

| ID Test Design | Test Case | Module |
|---|---|---|
| FR08_UC_01 | TC-CHECKOUT-07 | CHECKOUT |
| FR08_UC_02 | TC-CHECKOUT-08 | CHECKOUT |
| FR08_UC_03 | TC-CHECKOUT-09 | CHECKOUT |
| FR08_UC_04 | TC-CHECKOUT-10 | CHECKOUT |
| FR08_UC_05 | TC-CHECKOUT-11 | CHECKOUT |
| FR08_UC_06 | TC-CHECKOUT-12 | CHECKOUT |
| FR08_UC_07 | TC-CHECKOUT-13 | CHECKOUT |
| FR08_UC_08 | TC-CHECKOUT-14 | CHECKOUT |

> **Lưu ý mã module:** bộ ST cũ đặt tên file `TC-FR08-0x.md` nhưng bên trong ghi `Module = Checkout`. Bộ Use Case này dùng mã `TC-CHECKOUT-NN` cho đúng quy ước `TC-<MODULE>-<NNN>` của môn học. Nếu bạn muốn thống nhất theo cách đặt tên `TC-FR08-NN` như bộ cũ (07..14) để cùng nằm gọn trong thư mục `FR08/`, báo tôi ở điểm dừng để đổi trước khi sinh file.
