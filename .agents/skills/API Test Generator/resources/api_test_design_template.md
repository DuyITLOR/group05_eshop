# BÁO CÁO THIẾT KẾ VÀ KIỂM THỬ API: [TÊN_API] ([MÃ_FR])

## `[HTTP_METHOD] [ENDPOINT]` ([MÔ TẢ NGẮN CHỨC NĂNG])

**Sinh viên thực hiện:** [MSSV]  
**Môn học:** Software Testing (HW06 – API Testing)  
**Hệ thống (SUT):** EShop Backend API (`http://localhost:3000`)  

---

## 1. THÔNG TIN API & ĐẶC TẢ YÊU CẦU

* **Endpoint:** `[HTTP_METHOD] [ENDPOINT]`
* **Content-Type:** `application/json` (hoặc định dạng tương ứng)
* **Authentication / Headers:** [Yêu cầu Token / Bearer hoặc Public]
* **Mô tả chức năng:** [Mô tả chi tiết nghiệp vụ của API từ đặc tả]
* **Cấu trúc Request Body / Query Params:**
  ```json
  [REQUEST_BODY_HOẶC_QUERY_MẪU]
  ```
* **Mã phản hồi HTTP theo đặc tả:**
  * **200 OK / 201 Created:** [Mô tả kết quả thành công và schema trả về]
  * **400 Bad Request:** [Mô tả các điều kiện lỗi dữ liệu đầu vào]
  * **401 Unauthorized:** [Mô tả lỗi xác thực / không có quyền]
  * **403 Forbidden:** [Mô tả lỗi bị từ chối truy cập / khóa]
  * **404 Not Found:** [Mô tả lỗi không tìm thấy tài nguyên]

---

## 2. PHÂN TÍCH TEST DESIGN CHI TIẾT (KỸ THUẬT ÁP DỤNG)

### 2.1. Phân vùng Tương đương (Domain / Equivalence Partitioning Classes)

> *Ghi chú: Nếu API không nhận tham số đầu vào hoặc chỉ nhận Token xác thực, ghi rõ lý do không áp dụng / chỉ áp dụng kiểm tra Token.*

| Tham số | Mã Lớp (Class ID) | Tên Phân Vùng Tương Đương | Điều kiện / Giá trị đại diện | Kỳ vọng |
| :--- | :---: | :--- | :--- | :---: |
| **`[param_1]`** | **`V_[PARAM]_01`** | [Tên phân vùng hợp lệ] | `[Giá trị hợp lệ]` | Hợp lệ (Status 200/201) |
| | **`IV_[PARAM]_01`** | [Tên phân vùng không hợp lệ] | `[Giá trị không hợp lệ]` | 400 Bad Request |
| | **`IV_[PARAM]_02`** | Chuỗi rỗng / Không truyền trường | `""`, `null`, không có key | 400 Bad Request |
| | **`IV_[PARAM]_03`** | Kiểu dữ liệu sai | `123456`, `true`, `[object]` | 400 Bad Request |

---

### 2.2. Phân tích Giá trị Biên (Boundary Value Analysis - BVA)

> *Ghi chú: Chỉ áp dụng cho các tham số có miền giá trị định lượng có thứ tự được quy định rõ trong Spec (VD: độ dài chuỗi có min/max, số lượng, giá tiền). Nếu không có trong Spec, ghi rõ "Không áp dụng BVA cho API này".*

| Tham số kiểm tra | Ngưỡng theo Spec | Kỹ thuật áp dụng | 3 Điểm biên cụ thể | Mã test tương ứng | Kỳ vọng |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **`[param_ordered]`** | `[Ràng buộc biên]` | **3-Point BVA** | • Min - 1: `[...]`<br>• Min: `[...]`<br>• Min + 1: `[...]` | `TC_[PREFIX]_BVA_01`<br>`TC_[PREFIX]_BVA_02`<br>`TC_[PREFIX]_BVA_03` | • Min - 1: 400 Bad Request<br>• Min: 200 OK<br>• Min + 1: 200 OK |

---

### 2.3. Sơ đồ Chuyển trạng thái (State Transition Testing)

> *Ghi chú: Chỉ áp dụng khi API có quản lý vòng đời trạng thái hoặc bộ đếm/cờ nội tại. Nếu là API CRUD/Stateless, ghi rõ "Không áp dụng State Transition Testing cho API này".*

#### A. Danh sách Trạng thái & Hành động (States & Actions)
* **States:** `State_1`, `State_2`, `State_3`...
* **Actions:** `Action_1`, `Action_2`...

#### B. Ma trận Trạng thái x Hành động (States x Actions Matrix)

| Trạng thái xuất phát | Action 1: `[Tên_Action_1]` | Action 2: `[Tên_Action_2]` |
| :--- | :--- | :--- |
| **`State_1`** | `State_Target_A` (Status 200) | `State_Target_B` (Status 400/401) |
| **`State_2`** | `State_Target_C` (Status 200) | `State_Target_D` (Status 403) |

---

## 3. DANH SÁCH BỘ TEST CASES CHI TIẾT

### Nhóm A: Domain & Input Validation Test Cases

| TC ID | Miền kiểm thử (Target Class / BVA) | Input Request (Body / Params / Headers) | Expected Status | Expected Output & Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_[PREFIX]_DOM_01` | **`V_[PARAM]_01`** (Tham số hợp lệ) | `{ ... }` | `200 OK` | Xử lý thành công, trả về dữ liệu đúng |
| `TC_[PREFIX]_DOM_02` | **`IV_[PARAM]_01`** (Giá trị không hợp lệ) | `{ ... }` | `400 Bad Request` | Báo lỗi validation tương ứng |
| `TC_[PREFIX]_DOM_03` | **`IV_[PARAM]_02`** (Chuỗi rỗng / Thiếu trường) | `{ ... }` | `400 Bad Request` | Báo lỗi thiếu trường bắt buộc |
| `TC_[PREFIX]_DOM_04` | **`IV_[PARAM]_03`** (Sai kiểu dữ liệu) | `{ ... }` | `400 Bad Request` | Báo lỗi kiểu dữ liệu sai |

---

### Nhóm B: Boundary Value Analysis Test Cases (Nếu có)

| TC ID | Miền kiểm thử | Input Request | Expected Status | Expected Output & Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_[PREFIX]_BVA_01` | **3-point BVA: Min - 1** | `{ ... }` | `400 Bad Request` | Báo lỗi giá trị dưới ngưỡng tối thiểu |
| `TC_[PREFIX]_BVA_02` | **3-point BVA: Min** | `{ ... }` | `200 OK` | Chấp nhận giá trị đúng tại ngưỡng biên |
| `TC_[PREFIX]_BVA_03` | **3-point BVA: Min + 1** | `{ ... }` | `200 OK` | Chấp nhận giá trị trên ngưỡng biên |

---

### Nhóm C: State Transition Test Cases (Nếu có)

| TC ID | Ánh xạ Ma trận Chuyển trạng thái | Bước chuyển & Kịch bản kiểm thử | Expected Status | Kỳ vọng Database / State |
| :--- | :--- | :--- | :---: | :--- |
| `TC_[PREFIX]_ST_01` | **Cell (State_1, Action_1)** | `State_1` ──(Action_1)──> `State_Target_A` | `200 OK` | Trạng thái chuyển đúng trong DB |
| `TC_[PREFIX]_ST_02` | **Cell (State_1, Action_2)** | `State_1` ──(Action_2)──> `State_Target_B` | `400 / 401` | Không đổi trạng thái, báo lỗi |

---

### Nhóm D: Security Test Cases (SEC-01 đến SEC-07)

| TC ID | Mục tiêu bảo mật | Payload kiểm thử (Request Body / Header) | Expected Status | Tiêu chí bảo mật & Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_[PREFIX]_SEC_01` | SEC-04 (SQL Injection) | `{"param": "' OR 1=1 --"}` | `400` / `401` | Không bị bypass dữ liệu hoặc lộ lỗi SQL |
| `TC_[PREFIX]_SEC_02` | SEC-05 (XSS Payload) | `{"param": "<script>alert(1)</script>"}` | `400` / `200` | Khử khuẩn thẻ script an toàn |
| `TC_[PREFIX]_SEC_03` | SEC-01 (Sensitive Data Leak) | Request hợp lệ | `200 OK` | Response không chứa password/token bí mật |
| `TC_[PREFIX]_SEC_04` | SEC-02 (JWT Validation) | Header Token sai format / hết hạn | `401 Unauthorized` | Từ chối truy cập với token không hợp lệ |
| `TC_[PREFIX]_SEC_05` | SEC-03 (Brute-force / Rate Limit) | Gửi request lặp lại liên tục nhiều lần | `429` / `403` | Giới hạn tần suất request bảo vệ hệ thống |

---

### Nhóm E: Schema & Status Code Validation Test Cases

| TC ID | Kịch bản Schema | Payload kiểm thử | Expected Status | JSON Schema Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_[PREFIX]_SCH_01` | Success Response Shape | Request hợp lệ | `200 OK` | Khớp đúng định dạng JSON Schema thành công |
| `TC_[PREFIX]_SCH_02` | Error Response Shape | Request không hợp lệ | `400` / `401` | Khớp định dạng lỗi chuẩn `{"error": "string"}` |
| `TC_[PREFIX]_SCH_03` | Header Content-Type | Request hợp lệ | `200 OK` | Header trả về `Content-Type: application/json` |
| `TC_[PREFIX]_SCH_04` | Invalid Content-Type | Payload không phải JSON (XML/Text) | `400` / `415` | Từ chối payload không phải JSON |

---

## 4. AUDIT & HUMAN REVIEW (BẢNG ĐÁNH GIÁ MẪU ĐỂ NGƯỜI DÙNG TỰ ĐIỀN)

| Test Case ID / Nhóm | Nhãn Đánh Giá | Nhận định của Con Người đối chiếu theo Đặc tả | Hành động hiệu chỉnh (Human Correction) |
| :--- | :---: | :--- | :--- |
| `TC_[PREFIX]_DOM_01` - `xx` | **VALID** | Thiết kế đúng theo đặc tả: Thành công trả 200/201, dữ liệu sai trả 400. | Giữ nguyên trong bộ test suite chuẩn. |
| `TC_[PREFIX]_BVA_xx` | **INVALID** | AI tự suy diễn biên không có trong `api_specification.md`. | **Loại bỏ hoàn toàn** khỏi bộ test suite. |
| `TC_[PREFIX]_BVA_yy` | **INCOMPLETE** | AI chỉ kiểm tra 1 điểm biên thay vì áp dụng đúng kỹ thuật 3-point BVA. | **Bổ sung đầy đủ 3 điểm biên** theo chuẩn ISO 29119-4. |
| `TC_[PREFIX]_SEC_01` - `xx` | **VALID** | Bao phủ đúng các tiêu chuẩn bảo mật theo đặc tả môn học. | Đưa vào bộ kiểm thử bảo mật. |

---

## 5. MỞ RỘNG TEST CASES (HUMAN EXTENSION — >= 5 TCs MẪU ĐỂ NGƯỜI DÙNG TỰ ĐIỀN)

| TC ID | Kỹ thuật & Tên Test Case | Mô tả & Dữ liệu Request | Expected Status | Lý do AI bỏ sót (Root Cause Analysis) |
| :--- | :--- | :--- | :---: | :--- |
| `TC_[PREFIX]_EXT_01` | **Security: Mass Assignment** | Gửi kèm trường nhạy cảm `{"role": "admin"}` | `200 OK` | AI chỉ kiểm tra các trường có trong spec, không phòng ngừa hacker inject thêm trường để leo thang đặc quyền. |
| `TC_[PREFIX]_EXT_02` | **Security: HTTP Verb Tampering** | Gửi `GET` / `DELETE` vào endpoint `POST` | `404` / `405` | AI chỉ tập trung vào verb chính trong spec, bỏ sót kiểm tra các HTTP methods khác. |
| `TC_[PREFIX]_EXT_03` | **Domain: Unicode Homoglyph / Special Chars** | Gửi dữ liệu chứa ký tự Unicode đặc biệt / Zero-width | `400` / `200` | AI chỉ sinh dữ liệu ASCII tiêu chuẩn thông thường. |
| `TC_[PREFIX]_EXT_04` | **Security: Timing Discrepancy** | Đo độ lệch thời gian phản hồi giữa các trường hợp khác nhau | `401 Unauthorized` | AI thiếu góc nhìn về side-channel attack và phân tích thời gian xử lý DB. |
| `TC_[PREFIX]_EXT_05` | **State: Reset Condition / Boundary Flow** | Kiểm tra reset bộ đếm hoặc trạng thái khi thực hiện luồng đan xen | `200 OK` | AI chỉ test luồng tuyến tính một chiều, không kiểm tra điều kiện hoàn nguyên trạng thái. |
