# KỊCH BẢN THIẾT KẾ KIỂM THỬ TỰ ĐỘNG (TEST DESIGN & TEST CASES)

## API 3: Cập nhật Trạng thái Đơn hàng (`PUT /api/admin/orders/:id/status`)

---

## 1. MỤC TIÊU VÀ ĐẶC TẢ NGHIỆP VỤ (SPECIFICATION)
- **Tên chức năng:** Cập nhật trạng thái đơn hàng (FR-10 Order State Machine).
- **Endpoint:** `PUT /api/admin/orders/:id/status`
- **Quyền hạn truy cập:** Bắt buộc có quyền Quản trị viên (`role = 'admin'`, Header `Authorization: Bearer <token>`).
- **Path Parameter:**
  - `:id` (Integer): Mã định danh duy nhất của đơn hàng cần cập nhật.
- **Request Body (JSON):**
  ```json
  {
    "status": "confirmed"
  }
  ```
  *(Các giá trị hợp lệ: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`)*
- **Quy tắc chuyển đổi trạng thái hợp lệ:**
  - `pending` -> `confirmed` (Admin duyệt) hoặc `canceled` (Hủy đơn).
  - `confirmed` -> `shipping` (Giao hàng) hoặc `canceled` (Hủy đơn).
  - `shipping` -> `delivered` (Giao thành công) hoặc `canceled` (Admin hủy).
  - `delivered` và `canceled` là **Final States (Bất biến)**: Không được phép chuyển sang bất kỳ trạng thái nào khác.

---

## 2. PHÂN TÍCH TEST DESIGN: STATE TRANSITION TESTING (VÒNG ĐỜI TRẠNG THÁI ĐƠN HÀNG)

### 2.1. Sơ đồ Chuyển Trạng Thái (State Transition Diagram)

*Sơ đồ chuyển trạng thái dưới đây được thiết kế theo cấu trúc khối chữ nhật chuẩn hóa và lưu tại đường dẫn `./images/FR10.svg`.*

![State Transition Diagram](./images/FR10.svg)

---

### 2.2. Xác định States & Actions

#### A. Danh sách các Trạng thái (States):

| State | Tên trạng thái | Mô tả ý nghĩa / Điều kiện đạt trạng thái |
| :--- | :--- | :--- |
| `pending` | Chờ xác nhận | Trạng thái mặc định khi đơn hàng vừa được tạo bởi User. |
| `confirmed` | Đã xác nhận | Đơn hàng đã được Admin kiểm tra và phê duyệt. |
| `shipping` | Đang giao hàng | Đơn hàng đã được bàn giao cho đơn vị vận chuyển. |
| `delivered` | Đã giao hàng | Khách hàng đã nhận đơn hàng thành công (Final State - Bất biến). |
| `canceled` | Đã hủy | Đơn hàng bị hủy bởi User hoặc Admin trước khi giao (Final State - Bất biến). |

#### B. Danh sách các Hành động / Sự kiện (Actions / Events):

| Action / Event | Actor | Mô tả |
| :--- | :--- | :--- |
| `Confirm` | Admin | Gửi `PUT /api/admin/orders/:id/status` với body `{"status": "confirmed"}`. |
| `Ship` | Admin | Gửi `PUT /api/admin/orders/:id/status` với body `{"status": "shipping"}`. |
| `Deliver` | Admin | Gửi `PUT /api/admin/orders/:id/status` với body `{"status": "delivered"}`. |
| `Cancel` | Admin | Gửi yêu cầu hủy đơn hàng `{"status": "canceled"}`. |

---

### 2.3. Ma trận Chuyển Trạng Thái Toàn Diện 5 x 5 = 25 Bước Chuyển

| Trạng thái hiện tại | Target: `pending` | Target: `confirmed` | Target: `shipping` | Target: `delivered` | Target: `canceled` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`pending`** | ❌ 400 (Trùng) | ✅ **200 OK** | ❌ 400 (Nhảy cóc) | ❌ 400 (Nhảy cóc) | ✅ **200 OK** |
| **`confirmed`** | ❌ 400 (Quay lui) | ❌ 400 (Trùng) | ✅ **200 OK** | ❌ 400 (Nhảy cóc) | ✅ **200 OK** |
| **`shipping`** | ❌ 400 (Quay lui) | ❌ 400 (Quay lui) | ❌ 400 (Trùng) | ✅ **200 OK** | ✅ **200 OK** *(Admin - `BUG-ORD-03`)* |
| **`delivered`** *(Final)* | ❌ 400 | ❌ 400 | ❌ 400 | ❌ 400 | ❌ 400 |
| **`canceled`** *(Final)* | ❌ 400 | ❌ 400 | ❌ 400 | ❌ **400** *(Bị dính `BUG-ORD-01` trả 200)* | ❌ 400 |

---

## 3. DANH SÁCH BỘ TEST CASES CHI TIẾT (>= 35 CASES)

### Nhóm A: State Transition Test Cases (25 TCs — Bao phủ 100% Ma trận 5x5)

| TC ID | Ánh xạ Ma trận (Từ -> Tới) | Bước chuyển trạng thái | Tính hợp lệ theo Đặc tả | Expected Status | Chi tiết hành vi & Kỳ vọng |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Từ trạng thái `pending`:** | | | | | |
| `TC_ORD_ST_01` | **Cell (pending -> pending)** | `pending` ──(Set pending)──> `pending` | Không hợp lệ | `400 Bad Request` | Chặn cập nhật trạng thái trùng lặp |
| `TC_ORD_ST_02` | **Cell (pending -> confirmed)** | `pending` ──(Confirm)──> `confirmed` | **Hợp lệ** | `200 OK` | Duyệt đơn hàng thành công |
| `TC_ORD_ST_03` | **Cell (pending -> shipping)** | `pending` ──(Ship)──> `shipping` | Không hợp lệ | `400 Bad Request` | Chặn nhảy cóc khi chưa xác nhận |
| `TC_ORD_ST_04` | **Cell (pending -> delivered)** | `pending` ──(Deliver)──> `delivered` | Không hợp lệ | `400 Bad Request` | Chặn nhảy cóc khi chưa giao hàng |
| `TC_ORD_ST_05` | **Cell (pending -> canceled)** | `pending` ──(Cancel)──> `canceled` | **Hợp lệ** | `200 OK` | Hủy đơn hàng ở trạng thái chờ |
| **Từ trạng thái `confirmed`:** | | | | | |
| `TC_ORD_ST_06` | **Cell (confirmed -> pending)** | `confirmed` ──(Set pending)──> `pending` | Không hợp lệ | `400 Bad Request` | Chặn quay lui trạng thái |
| `TC_ORD_ST_07` | **Cell (confirmed -> confirmed)** | `confirmed` ──(Set confirmed)──> `confirmed` | Không hợp lệ | `400 Bad Request` | Chặn cập nhật trạng thái trùng lặp |
| `TC_ORD_ST_08` | **Cell (confirmed -> shipping)** | `confirmed` ──(Ship)──> `shipping` | **Hợp lệ** | `200 OK` | Bàn giao bên vận chuyển |
| `TC_ORD_ST_09` | **Cell (confirmed -> delivered)** | `confirmed` ──(Deliver)──> `delivered` | Không hợp lệ | `400 Bad Request` | Chặn nhảy cóc qua bước giao hàng |
| `TC_ORD_ST_10` | **Cell (confirmed -> canceled)** | `confirmed` ──(Cancel)──> `canceled` | **Hợp lệ** | `200 OK` | Hủy đơn hàng sau khi duyệt |
| **Từ trạng thái `shipping`:** | | | | | |
| `TC_ORD_ST_11` | **Cell (shipping -> pending)** | `shipping` ──(Set pending)──> `pending` | Không hợp lệ | `400 Bad Request` | Chặn quay lui trạng thái |
| `TC_ORD_ST_12` | **Cell (shipping -> confirmed)** | `shipping` ──(Set confirmed)──> `confirmed` | Không hợp lệ | `400 Bad Request` | Chặn quay lui trạng thái |
| `TC_ORD_ST_13` | **Cell (shipping -> shipping)** | `shipping` ──(Set shipping)──> `shipping` | Không hợp lệ | `400 Bad Request` | Chặn cập nhật trạng thái trùng lặp |
| `TC_ORD_ST_14` | **Cell (shipping -> delivered)** | `shipping` ──(Deliver)──> `delivered` | **Hợp lệ** | `200 OK` | Giao hàng thành công (Final State) |
| `TC_ORD_ST_15` | **Cell (shipping -> canceled)** | `shipping` ──(Cancel)──> `canceled` | **Hợp lệ (Admin)** | `200 OK` | Admin có quyền hủy khi đang giao *(Phát hiện **`BUG-ORD-03`**)* |
| **Từ trạng thái `delivered` (Final State - Bất biến):** | | | | | |
| `TC_ORD_ST_16` | **Cell (delivered -> pending)** | `delivered` ──(Set pending)──> `pending` | Không hợp lệ | `400 Bad Request` | Final State - Bất biến, không thể sửa đổi |
| `TC_ORD_ST_17` | **Cell (delivered -> confirmed)** | `delivered` ──(Set confirmed)──> `confirmed` | Không hợp lệ | `400 Bad Request` | Final State - Bất biến, không thể sửa đổi |
| `TC_ORD_ST_18` | **Cell (delivered -> shipping)** | `delivered` ──(Set shipping)──> `shipping` | Không hợp lệ | `400 Bad Request` | Final State - Bất biến, không thể sửa đổi |
| `TC_ORD_ST_19` | **Cell (delivered -> delivered)** | `delivered` ──(Set delivered)──> `delivered` | Không hợp lệ | `400 Bad Request` | Final State - Chặn cập nhật trùng lặp |
| `TC_ORD_ST_20` | **Cell (delivered -> canceled)** | `delivered` ──(Set canceled)──> `canceled` | Không hợp lệ | `400 Bad Request` | Final State - Không thể hủy đơn đã giao |
| **Từ trạng thái `canceled` (Final State - Bất biến):** | | | | | |
| `TC_ORD_ST_21` | **Cell (canceled -> pending)** | `canceled` ──(Set pending)──> `pending` | Không hợp lệ | `400 Bad Request` | Final State - Không thể mở lại đơn |
| `TC_ORD_ST_22` | **Cell (canceled -> confirmed)** | `canceled` ──(Set confirmed)──> `confirmed` | Không hợp lệ | `400 Bad Request` | Final State - Không thể duyệt đơn đã hủy |
| `TC_ORD_ST_23` | **Cell (canceled -> shipping)** | `canceled` ──(Set shipping)──> `shipping` | Không hợp lệ | `400 Bad Request` | Final State - Không thể giao đơn đã hủy |
| `TC_ORD_ST_24` | **Cell (canceled -> delivered)** | `canceled` ──(Set delivered)──> `delivered` | **Nghiêm cấm** | `400 Bad Request` | Không được giao đơn đã hủy *(Phát hiện **`BUG-ORD-01`**)* |
| `TC_ORD_ST_25` | **Cell (canceled -> canceled)** | `canceled` ──(Set canceled)──> `canceled` | Không hợp lệ | `400 Bad Request` | Final State - Chặn cập nhật trùng lặp |

### Nhóm B: Security Test Cases (`SEC-01` đến `SEC-07`) — 5 TCs

| TC ID | Mục tiêu bảo mật | Kịch bản kiểm thử (Request Payload & Header) | Expected Status | Tiêu chí bảo mật & Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_ORD_SEC_01` | SEC-03 (BFLA / Privilege Escalation) | Token của User thường (`role = 'user'`) gọi `PUT /api/admin/orders/1/status` | `403 Forbidden` | Chặn user thường cập nhật trạng thái *(Phát hiện **`BUG-ORD-02`**)* |
| `TC_ORD_SEC_02` | SEC-02 (Missing Auth Token) | Gọi API không kèm Header `Authorization` | `401 Unauthorized` | Chặn truy cập ẩn danh |
| `TC_ORD_SEC_03` | SEC-01 (Invalid Token) | Gửi Token giả mạo hoặc hết hạn | `401` / `403` | Từ chối token không hợp lệ |
| `TC_ORD_SEC_04` | SEC-04 (SQLi in Path Param) | `PUT /api/admin/orders/1' OR '1'='1/status` với body `{"status": "confirmed"}` | `400` / `404` | Tham số hóa, không dính SQLi |
| `TC_ORD_SEC_05` | SEC-05 (XSS in status field) | `PUT /api/admin/orders/1/status` với body `{"status": "<script>alert(1)</script>"}` | `400 Bad Request` | Khử khuẩn an toàn chuỗi XSS |

### Nhóm C: Schema & Status Code Validation (4 TCs)

| TC ID | Kịch bản Schema | Input Payload | Expected Status | JSON Schema Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_ORD_SCH_01` | Success Response Shape | `{"status": "confirmed"}` | `200 OK` | Schema có `{"message": "Order status updated"}` |
| `TC_ORD_SCH_02` | Error 400 Response Shape | `{"status": "delivered"}` (nhảy cóc từ pending) | `400 Bad Request` | Schema dạng `{"error": "string"}` |
| `TC_ORD_SCH_03` | Error 404 Response Shape | `PUT /api/admin/orders/999999/status` | `404 Not Found` | Schema dạng `{"error": "string"}` |
| `TC_ORD_SCH_04` | Header Content-Type | `{"status": "confirmed"}` | `200 OK` | Header `Content-Type: application/json` |

---

## 4. AUDIT & HUMAN REVIEW

| Test Case ID / Nhóm | Nhãn Đánh Giá | Nhận định của Con Người đối chiếu theo Đặc tả (api_specification.md & README.md) | Hành động hiệu chỉnh (Human Correction) |
| :--- | :---: | :--- | :--- |
| `TC_ORD_ST_01` - `25` | **VALID** | Thiết kế chính xác theo toàn bộ 25 ô của Ma trận Chuyển trạng thái 5x5: Đúng quy trình trả `200 OK`, chuyển sai, trùng lặp hoặc nhảy cóc trả `400 Bad Request`. | Giữ nguyên bộ 25 test cases. Khi chạy phát hiện backend bị bug nghiêm trọng cho phép `canceled -> delivered` (**`BUG-ORD-01`**) và chặn nhầm Admin hủy đơn khi đang giao (**`BUG-ORD-03`**). |
| `TC_ORD_SEC_01` | **VALID** | Thiết kế chuẩn theo yêu cầu phân quyền quản trị (BFLA): User thường tuyệt đối không được gọi API của Admin. | Giữ nguyên test case. Khi chạy phát hiện backend thiếu kiểm tra quyền `role === 'admin'` (**`BUG-ORD-02`**). |
| `TC_ORD_SEC_02` - `05` | **VALID** | Thiết kế chuẩn bảo mật OWASP: Bắt buộc Auth Token, chống SQLi và XSS. | Đưa vào kịch bản kiểm thử tự động. |
| `TC_ORD_SCH_01` - `04` | **VALID** | Thiết kế đúng chuẩn JSON Schema của REST API. | Đưa vào kịch bản kiểm thử tự động. |
| *Domain & BVA Testing cho API 3 do AI tự sinh* | **INVALID** | Bản chất chức năng `PUT /status` là một State Machine thuần túy. Việc AI cố tình thêm phân vùng Domain/BVA làm loãng trọng tâm kiểm thử trạng thái. | **Loại bỏ hoàn toàn** Domain và BVA testing, tập trung trọn vẹn vào Ma trận Chuyển trạng thái 5x5 (State Transition). |
| *BVA Extreme ID Boundary (2^31 - 1 do AI tự sinh)* | **INVALID** | AI tự suy diễn giới hạn trần cực trị 2,147,483,647 không hề có trong đặc tả `api_specification.md` hay `README.md`. | **Loại bỏ hoàn toàn** khỏi bộ test design. |
| *Security Case giả định (Admin cập nhật đơn user khác do AI tự gán nhãn)* | **INVALID** | AI tự gán nhãn một ca kiểm thử chức năng thông thường vào nhóm bảo mật Security. | **Loại bỏ hoàn toàn** khỏi nhóm Security để đảm bảo tính chặt chẽ. |
| *5 bước chuyển trạng thái sang chính nó (Cell trùng lặp)* | **INCOMPLETE** | AI ban đầu chỉ thiết kế 20 bước chuyển và bỏ sót 5 bước chuyển trạng thái sang chính nó (`pending -> pending`, `confirmed -> confirmed`, v.v.). | **Bổ sung đầy đủ 5 test cases** để hoàn thiện trọn vẹn 25 test cases bao phủ 100% Ma trận 5x5. |

---

## 5. MỞ RỘNG TEST CASES (HUMAN EXTENSION — 5 TCs)

| TC ID | Kỹ thuật & Tên Test Case | Mô tả & Dữ liệu Request | Lý do AI bỏ sót (Root Cause Analysis) |
| :--- | :--- | :--- | :--- |
| `TC_ORD_EXT_01` | **State: Concurrent Transition Race Condition** | Gửi đồng thời 2 request đổi trạng thái (`confirmed` và `canceled`) cho cùng 1 đơn `pending` | AI chỉ tư duy đơn luồng, bỏ sót nguy cơ tranh chấp dữ liệu khi không có lock DB. |
| `TC_ORD_EXT_02` | **Business Logic: Stock Reversion upon Cancel** | Kiểm tra khi đơn chuyển sang `canceled`, số lượng tồn kho sản phẩm có được hoàn lại không | AI chỉ nhìn cục bộ bảng `orders`, không kiểm tra tác động liên bảng `products`. |
| `TC_ORD_EXT_03` | **Security: Admin Conflict of Interest** | Admin tự đổi trạng thái đơn hàng do chính Admin đặt mua | AI không xét đến các ràng buộc kiểm soát gian lận nội bộ. |
| `TC_ORD_EXT_04` | **Audit Trail Verification** | Kiểm tra sau khi đổi trạng thái, trường `updated_at` hoặc log có ghi nhận đúng thời gian/admin | AI chỉ quan tâm HTTP code mà bỏ qua kiểm tra vết kiểm toán (Audit Trail). |
| `TC_ORD_EXT_05` | **Security: Nested Object Injection** | Gửi body dạng nested object `{"status": {"$ne": "delivered"}}` | AI mặc định body là flat JSON, không kiểm thử tấn công cấu trúc đối tượng phức tạp. |

**TỔNG CỘNG TEST CASES API 3:** **39 Test Cases** (AI: 34, Human Extend: 5).
