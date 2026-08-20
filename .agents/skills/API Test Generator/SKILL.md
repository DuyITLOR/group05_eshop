---
name: API Test Generator
description: Tự động phân tích đặc tả API (api_specification.md) và thiết kế bộ test case toàn diện theo quy trình 2 giai đoạn (Phase 1: Xuất Markdown Test Design có kiểm tra tính khả thi kỹ thuật Anti-Hallucination kèm bảng Audit/Extend mẫu -> Dừng chờ Human Review; Phase 2: Sau khi Human Review, nhận lệnh sinh Postman Collection JSON để chạy Newman xuất HTML report).
---

# API Test Generator Skill (Quy trình 2 Giai đoạn chuẩn)

Skill này hướng dẫn Agent tự động thực hiện quy trình kiểm thử API theo **2 Giai đoạn độc lập (2-Phase Interactive Workflow)**, đảm bảo vai trò kiểm soát chất lượng của con người (Human-in-the-loop):

* **GIAI ĐOẠN 1 (Phase 1):** Phân tích đặc tả API -> Đánh giá tính khả thi kỹ thuật (Anti-Hallucination) -> Thiết kế bộ test case Markdown chi tiết (>= 35 TCs) kèm khung Audit/Extend mẫu -> **Xuất file `.md` và DỪNG LẠI (STOP)** để chờ người dùng review.
* **GIAI ĐOẠN 2 (Phase 2):** Khi người dùng đã review xong và yêu cầu tạo file Postman -> Đọc file Markdown đã review -> Sinh file **Postman Collection v2.1.0 JSON** & **Environment JSON** -> Cung cấp lệnh Newman CLI xuất báo cáo HTML.

> ⚠️ **RÀNG BUỘC NGHIÊM NGẶT:** Ở Giai đoạn 1, Agent **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ Ý TẠO FILE JSON**. Phải xuất duy nhất file Markdown và dừng lại chờ xác nhận từ người dùng.

---

## 1. NGUYÊN TẮC CỐT LÕI: KIỂM TRA TÍNH KHẢ THI KỸ THUẬT (ANTI-HALLUCINATION)

Trước khi thiết kế bất kỳ test case nào, Agent **BẮT BUỘC** phải phân tích tính chất của API để xác định kỹ thuật kiểm thử nào áp dụng được và kỹ thuật nào **KHÔNG** áp dụng được. Tuyệt đối không tự suy diễn hoặc bịa đặt dữ liệu không có trong đặc tả.

### Ma trận điều kiện áp dụng kỹ thuật:

| Kỹ thuật kiểm thử | Điều kiện áp dụng trên API | Xử lý khi KHÔNG thỏa điều kiện |
| :--- | :--- | :--- |
| **Phân vùng tương đương (EP)** | Chỉ áp dụng khi API có tham số đầu vào (Body, Query, Path params, Custom Headers) có thể phân chia thành các miền giá trị hợp lệ (Valid) và không hợp lệ (Invalid). | Ghi rõ: *"Không áp dụng Domain Testing (EP) cho tham số đầu vào do API không nhận tham số / chỉ có Auth Header"*. Cấm tự bịa tham số. |
| **Phân tích giá trị biên (BVA)** | Chỉ áp dụng khi tham số có miền định lượng có thứ tự được quy định rõ ràng trong Spec (VD: `min <= x <= max`, `length >= 8`, `price > 0`, `quantity: 1..100`). | Ghi rõ: *"Không áp dụng BVA do tham số không có miền giá trị định lượng có thứ tự trong Spec"*. Cấm tự bịa ngưỡng biên (VD: không được tự bịa 32 chars, 254 chars). |
| **Chuyển trạng thái (State Transition)** | Chỉ áp dụng khi API có quản lý vòng đời trạng thái hoặc bộ đếm/cờ nội tại (VD: Đăng nhập sai 3 lần khóa tài khoản FR-02, Vòng đời đơn hàng: Pending -> Confirmed -> Shipping -> Delivered FR-10). | Ghi rõ: *"Không áp dụng State Transition Testing do API có tính chất Stateless / CRUD thuần túy"*. |
| **Bảo mật (SEC-01 -> SEC-07)** | Chỉ chọn các tiêu chí bảo mật liên quan trực tiếp đến tính chất của API (SQLi, IDOR, XSS, Sensitive Data Leak, JWT Validation, Brute Force / Rate Limit, Mass Assignment / Privilege Escalation). | Chọn đúng các tiêu chí phù hợp với ngữ cảnh thực tế của API. |
| **Kiểm tra cấu trúc (Schema & Header)** | Luôn áp dụng cho mọi API (Kiểm tra Response JSON Schema, HTTP Status Code, Content-Type Header). | Khớp chính xác với cấu trúc JSON trong `api_specification.md`. |

---

## 2. QUY TRÌNH THỰC HIỆN CHI TIẾT (2 GIAI ĐOẠN)

### ═══════════════════════════════════════════════════════════════════════════
### GIAI ĐOẠN 1: THIẾT KẾ & XUẤT TÀI LIỆU MARKDOWN (PHASE 1)
### ═══════════════════════════════════════════════════════════════════════════

#### Bước 1: Đọc và phân tích đặc tả API
1. Đọc file `api_specification.md` và `README.md` tại workspace.
2. Trích xuất: Endpoint, HTTP Method, Headers, Request Body / Query Params, Status Codes và Response Schema.

#### Bước 2: Đánh giá tính khả thi kỹ thuật (Anti-Hallucination)
Dựa trên Mục 1, xác định rõ từng kỹ thuật:
* EP: Lập bảng phân tích các lớp tương đương hợp lệ (`V_...`) và không hợp lệ (`IV_...`).
* BVA: Áp dụng **3-Point BVA** (`Min - 1`, `Min`, `Min + 1` hoặc `Max - 1`, `Max`, `Max + 1`) nếu có miền thứ tự. Nếu không -> Ghi rõ không áp dụng.
* State Transition: Lập ma trận `States x Actions` nếu có trạng thái nội tại. Nếu không -> Ghi rõ không áp dụng.
* Security: Chọn lọc payload SEC-01 đến SEC-07 phù hợp.
* Schema: Định nghĩa Schema cho Status 200/201 và các mã lỗi.

#### Bước 3: Thiết kế danh sách Test Cases chi tiết (Target >= 35 TCs)
* Nhóm A: Domain & Input Validation Test Cases (`TC_<PREFIX>_DOM_xx`, `TC_<PREFIX>_BVA_xx`).
* Nhóm B: State Transition Test Cases (`TC_<PREFIX>_ST_xx` - nếu có).
* Nhóm C: Security Test Cases (`TC_<PREFIX>_SEC_xx`).
* Nhóm D: Schema & Status Code Validation Test Cases (`TC_<PREFIX>_SCH_xx`).

#### Bước 4: Tạo Khung Bảng Mẫu Audit & Human Review
Tạo sẵn bảng để người dùng tự đánh giá (`VALID`, `INVALID`, `INCOMPLETE` kèm lý do & hành động sửa đổi).

#### Bước 5: Tạo Khung Bảng Mẫu Extend (Human Extension >= 5 TCs)
Tạo sẵn bảng gồm 5 test cases nâng cao (Mass Assignment, HTTP Verb Tampering, Unicode, DoS, Case-Insensitive, v.v.) kèm phân tích nguyên nhân `Root Cause Analysis`.

#### Bước 6: Xuất duy nhất file Markdown và DỪNG LẠI (STOP)
1. Ghi toàn bộ nội dung ra file Markdown theo template `resources/api_test_design_template.md`.
2. **DỪNG LẠI VÀ THÔNG BÁO CHO NGƯỜI DÙNG:**
   > *"Tôi đã tạo xong tài liệu Markdown thiết kế test case cho API tại `<path_to_file.md>`. Vui lòng xem lại (Human Review), audit và chỉnh sửa nếu cần. Khi đã sẵn sàng, hãy bảo tôi tạo file Postman Collection JSON để chạy kiểm thử."*

---

### ⏸️ CHỐT CHẶN: CON NGƯỜI THẨM ĐỊNH (HUMAN REVIEW CHECKPOINT)
* Sinh viên mở file Markdown, thẩm định từng ca kiểm thử, điền bảng Audit và hoàn thiện các ca Extend.
* Khi đã chốt xong, sinh viên gửi yêu cầu: *"Hãy tạo file Postman JSON từ file test case đã review"*.

---

### ═══════════════════════════════════════════════════════════════════════════
### GIAI ĐOẠN 2: SINH POSTMAN COLLECTION JSON & CHẠY NEWMAN (PHASE 2)
### ═══════════════════════════════════════════════════════════════════════════

*Chỉ thực hiện khi nhận được yêu cầu rõ ràng từ người dùng ở Giai đoạn 2.*

#### Bước 7: Đọc file Markdown đã review và sinh Postman Collection v2.1.0
1. Đọc lại file Markdown đã được người dùng chốt.
2. Sinh file **Postman Collection v2.1.0 (`.json`)**:
   * **Pre-request Scripts cấp Collection (Anti-Cheat Header):**
     ```javascript
     pm.request.headers.upsert({
         key: 'X-Student-Id',
         value: pm.environment.get('studentId') || '23127340'
     });
     console.log('[X-Student-Id: ' + (pm.environment.get('studentId') || '23127340') + '] Request:', pm.request.method, pm.request.url.toString());
     ```
   * **Tổ chức thư mục:** Chia theo từng nhóm kịch bản rõ ràng (Domain, BVA, Security, Schema, Extension).
   * **Email động:** Sử dụng `Date.now()` trong Pre-request script cho các ca hợp lệ để chạy lặp lại không bị trùng email.
   * **Assertions đầy đủ (`pm.test`):** Status code, response time, schema properties, tiêu chuẩn bảo mật.
3. Sinh file **Postman Environment (`.json`)**: Chứa `baseUrl`, `studentId`, tokens.

#### Bước 8: Hướng dẫn / Thực thi Newman CLI xuất HTML Report
Cung cấp lệnh chạy tự động và xuất báo cáo:
```bash
npx newman run <collection.json> -e <environment.json> --reporters cli,htmlextra --reporter-htmlextra-export <report.html>
```

---

## 3. TÀI NGUYÊN THAM KHẢO (EXAMPLES & TEMPLATES)
* **Template Markdown:** [resources/api_test_design_template.md](file:///d:/group05_eshop/.agents/skills/API%20Test%20Generator/resources/api_test_design_template.md)
* **Ví dụ Markdown Test Cases (API Login):** [examples/api_1_login_test_cases.md](file:///d:/group05_eshop/.agents/skills/API%20Test%20Generator/examples/api_1_login_test_cases.md)
* **Ví dụ Postman Collection JSON mẫu:** [examples/sample_collection.postman_collection.json](file:///d:/group05_eshop/.agents/skills/API%20Test%20Generator/examples/sample_collection.postman_collection.json)
* **Ví dụ Postman Environment JSON mẫu:** [examples/sample_environment.postman_environment.json](file:///d:/group05_eshop/.agents/skills/API%20Test%20Generator/examples/sample_environment.postman_environment.json)
