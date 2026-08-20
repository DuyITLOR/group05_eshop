# BÁO CÁO TỔNG KẾT KIỂM THỬ API VÀ TÍCH HỢP CI/CD (HW06 MAIN REPORT)

**Học phần:** Kiểm thử phần mềm (Software Testing)  
**Bài tập:** HW06 – API Testing (AI-Assisted Testing & CI/CD Integration)  
**Mã bài tập (Exercise ID):** HW06_AI  
**Sinh viên thực hiện:** Ngô Thế Đạt – **MSSV:** 23127340  
**Repository GitHub:** [https://github.com/DuyITLOR/group05_eshop](https://github.com/DuyITLOR/group05_eshop)  
**Branch thực hiện:** `feature/23127340`  
**Hệ thống kiểm thử (SUT):** EShop Web Backend REST API (`http://localhost:3000`)

---

## BẢNG TỰ ĐÁNH GIÁ ĐIỂM (SELF-ASSESSMENT TEMPLATE)

| STT | Tiêu chí đánh giá (Criteria) | Điểm tối đa | Điểm tự đánh giá | Minh chứng & Ghi chú |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **API 1 — POST /api/login (Full Pipeline)**<br>• Generate (>=35 TCs) + Human Audit<br>• 5 Human Extended TCs<br>• Newman Execute (X-Student-Id)<br>• Bug Reports + GitHub Issues | 30 | **30** | Đầy đủ 44 test cases, phát hiện 7 bugs nghiêm trọng, đã log GitHub Issues #359 - #365. |
| **2** | **API 2 — POST /api/apply-coupon (Full Pipeline)**<br>• Generate (>=35 TCs) + Human Audit<br>• 5 Human Extended TCs<br>• Newman Execute (X-Student-Id)<br>• Bug Reports + GitHub Issues | 30 | **30** | Đầy đủ 43 test cases, phát hiện 7 bugs logic giảm giá và bảo mật, đã log GitHub Issues #366 - #372. |
| **3** | **API 3 — PUT /api/admin/orders/:id/status (Full Pipeline)**<br>• Generate (>=35 TCs) + Human Audit<br>• 5 Human Extended TCs<br>• Newman Execute (X-Student-Id)<br>• Bug Reports + GitHub Issues | 30 | **30** | Đầy đủ 48 test cases, phủ toàn diện 16 chuyển trạng thái (4x4 matrix), phát hiện 4 bugs, đã log GitHub Issues #373 - #376. |
| **4** | **Agent Skill & Postman Features & CI/CD**<br>• Thiết kế AI-driven API Test Generator (Diagram + Pseudocode)<br>• Khai thác toàn diện Postman Features<br>• CI/CD Pipeline (2 Sample Runs: Green & Red)<br>• AI Critique & AI Audit Report | 10 | **10** | Thiết kế Agent Skill hoàn chỉnh, pipeline GitHub Actions chạy thực tế 2 runs, audit và critique đầy đủ. |
| **TỔNG** | **TỔNG ĐIỂM TỰ ĐÁNH GIÁ (TOTAL GRADE)** | **100** | **100** | **100 / 100** |

---

## 1. TỔNG QUAN HỆ THỐNG VÀ 3 APIS ĐÃ LỰA CHỌN

Theo yêu cầu của đề bài, sinh viên chọn 3 APIs thuộc 3 Pool tính năng khác nhau từ tài liệu đặc tả `api_specification.md`:

```
+-------------------------------------------------------------------------------+
|                             EShop REST API (SUT)                             |
+-----------------------+-------------------------------+-----------------------+
|  Pool A: Auth/Core    |  Pool B: Cart & Checkout      |  Pool C: Web Admin    |
|  POST /api/login      |  POST /api/apply-coupon       |  PUT /api/admin/...   |
|  (FR-02: Đăng nhập)   |  (FR-09: Mã giảm giá)         |  (FR-10,18: Cập nhật) |
+-----------------------+-------------------------------+-----------------------+
```

| Pool | Feature ID | Endpoint API | Phương thức | Mục đích nghiệp vụ |
| :---: | :---: | :--- | :---: | :--- |
| **Pool A** | **FR-02** | `/api/login` | `POST` | Xác thực người dùng, trả JWT Token, quản lý cơ chế khóa tài khoản khi sai mật khẩu. |
| **Pool B** | **FR-09** | `/api/apply-coupon` | `POST` | Kiểm tra tính hợp lệ và áp dụng mã giảm giá (Fixed / Percent) vào tổng tiền đơn hàng. |
| **Pool C** | **FR-10, FR-18** | `/api/admin/orders/:id/status` | `PUT` | Phân quyền Admin chuyển trạng thái đơn hàng theo máy trạng thái hữu hạn (State Machine). |

---

## 2. BÁO CÁO TỔNG HỢP THỰC THI KIỂM THỬ (TEST SUMMARY REPORT)

* **Tổng số APIs kiểm thử:** 3 APIs
* **Tổng số Test Cases thực thi:** 139 requests (gồm 4 request setup tiền đề)
* **Tổng số Assertions kiểm tra:** 145 assertions
* **Số Assertions Passed:** 109 Passed (75.17%)
* **Số Assertions Failed:** 36 Failed (24.83% — Do bắt đúng các lỗi logic và bảo mật của SUT)
* **Tổng số Bug thực tế (Distinct Genuine Bugs):** **18 Bugs**
* **Số Issue đã đẩy lên GitHub:** 18 Issues ([#359 đến #376](https://github.com/DuyITLOR/group05_eshop/issues))

### Bảng phân bố Test Cases theo từng API:

| Nhóm API | AI Generated | Human Validated | Human Extended | Tổng số TCs | Số Bugs phát hiện |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **00. Auth & Pre-requisites** | 0 | 4 | 0 | 4 | 0 |
| **API 1: POST /api/login** | 39 | 39 | 5 | **44** | **7 Bugs** (`BUG-LOG-01..07`) |
| **API 2: POST /api/apply-coupon** | 38 | 38 | 5 | **43** | **7 Bugs** (`BUG-CPN-01..07`) |
| **API 3: PUT /api/admin/orders/:id/status** | 43 | 43 | 5 | **48** | **4 Bugs** (`BUG-ORD-01..04`) |
| **TỔNG CỘNG** | **120** | **124** | **15** | **139** | **18 Bugs** |

---

## 3. CHI TIẾT QUY TRÌNH KIỂM THỬ TỪNG API

### 3.1. API 1: POST /api/login (Xác thực & Khóa tài khoản)

1. **Kỹ thuật thiết kế áp dụng:**
   * **Domain Testing & Equivalance Partitioning (EP):** Phân hoạch Email (hợp lệ, sai định dạng, email chưa đăng ký, email rỗng) và Password (đúng, sai, rỗng, ngắn < 6 ký tự, ký tự đặc biệt).
   * **Boundary Value Analysis (BVA):** Kiểm tra độ dài email (tối đa 255 ký tự), mật khẩu biên (6 ký tự, 5 ký tự).
   * **State Transition Testing:** Kiểm tra máy trạng thái khóa tài khoản khi nhập sai 3 lần liên tiếp và thời gian mở khóa sau 30 giây.
   * **Security Testing (SEC-01..07):** SQL Injection payload (`' OR '1'='1`), NoSQL injection, rò rỉ trường nhạy cảm trong response, kiểm tra hashing Bcrypt.
2. **AI Generation & Human Audit:**
   * AI sinh ban đầu 39 test cases.
   * Sinh viên phát hiện và chỉnh sửa 4 test cases AI tạo sai logic (AI nhầm lẫn thời gian khóa là 60s thay vì 30s theo đặc tả).
3. **5 Human Extended Test Cases:**
   * `TC_LOG_EXT_01`: SQL Injection Bypass (`admin@eshop.com'--`)
   * `TC_LOG_EXT_02`: Password Truncation Attack (Mật khẩu cực dài > 10,000 ký tự)
   * `TC_LOG_EXT_03`: Case-Insensitive Email Login (`TEST@eshop.com` thay vì chữ thường)
   * `TC_LOG_EXT_04`: Account Lockout Reset on Successful Login (Đăng nhập đúng ở lần 2 phải reset bộ đếm lỗi về 0)
   * `TC_LOG_EXT_05`: Sensitive Info Leakage in Error Message
4. **Các Bug phát hiện được trên API 1:**
   * `BUG-LOG-01` (#359): Khóa tài khoản sau 2 lần thử sai thay vì 3 lần theo đặc tả.
   * `BUG-LOG-02` (#360): Thời gian khóa tài khoản bị hardcode 180s thay vì 30s.
   * `BUG-LOG-03` (#361): Rò rỉ mật khẩu dạng plaintext (`password`) và `reset_token` trong JSON response.
   * `BUG-LOG-04` (#362): Mật khẩu được lưu trực tiếp dạng plaintext trong cơ sở dữ liệu (không qua băm Bcrypt).
   * `BUG-LOG-05` (#363): Thiếu trường bắt buộc trả 401 Unauthorized thay vì 400 Bad Request.
   * `BUG-LOG-06` (#364): Email sai định dạng hoặc mật khẩu ngắn trả về 401 thay vì 400.
   * `BUG-LOG-07` (#365): Hệ thống phân biệt hoa/thường khi so khớp Email dẫn đến không đăng nhập được.

---

### 3.2. API 2: POST /api/apply-coupon (Áp dụng mã giảm giá)

1. **Kỹ thuật thiết kế áp dụng:**
   * **Equivalance Partitioning (EP):** Kiểm tra mã Fixed Discount (`BIGBUY` giảm 50k), Percent Discount (`DISCOUNT10` giảm 10%), mã hết hạn, mã không tồn tại, đơn hàng chưa đạt giá trị tối thiểu.
   * **Boundary Value Analysis (BVA):** Kiểm tra ngưỡng giá trị đơn hàng tối thiểu 300,000 ₫ (Biên: 299,999 ₫, 300,000 ₫, 300,001 ₫), kiểm tra giảm giá tối đa (Max discount cap: 100,000 ₫).
   * **Security Testing:** IDOR (Áp mã của user khác), Missing JWT Authorization token, Tampering `user_id`.
2. **AI Generation & Human Audit:**
   * AI sinh 38 test cases.
   * Sinh viên audit và hoàn thiện các assertion kiểm tra cấu trúc JSON trả về (`discount_amount`, `final_total`).
3. **5 Human Extended Test Cases:**
   * `TC_CPN_EXT_01`: Case-Insensitive Coupon Code (`bigbuy` vs `BIGBUY`)
   * `TC_CPN_EXT_02`: Floating-point Total Amount Precision (`300000.99 ₫`)
   * `TC_CPN_EXT_03`: Negative Discount Exploitation (Cố tình nhập coupon có giá trị âm)
   * `TC_CPN_EXT_04`: Race Condition / Replay Attack (Áp mã cùng lúc trên 2 request)
   * `TC_CPN_EXT_05`: Zero Order Amount Bypass (`total_amount = 0`)
4. **Các Bug phát hiện được trên API 2:**
   * `BUG-CPN-01` (#366): Đơn hàng đúng 300,000 ₫ bị từ chối sai (nghiệp vụ dùng `>` thay vì `>=`).
   * `BUG-CPN-02` (#367): Lỗi công thức tính giảm giá phần trăm bị đảo ngược làm tăng tiền thay vì giảm tiền.
   * `BUG-CPN-03` (#368): API cho phép áp mã thành công 200 OK ngay cả khi không có JWT Token xác thực.
   * `BUG-CPN-04` (#369): Lỗ hổng IDOR - Cho phép user này áp mã và xem dữ liệu của user khác.
   * `BUG-CPN-05` (#370): Mã cố định `BIGBUY` bị ép kiểm tra đơn hàng 500k thay vì áp dụng đúng quy định.
   * `BUG-CPN-06` (#371): Mã giảm giá bị bắt buộc chữ hoa, không chấp nhận chữ thường.
   * `BUG-CPN-07` (#372): Mã giảm giá kiểu số trả về 404 thay vì 400 Bad Request.

---

### 3.3. API 3: PUT /api/admin/orders/:id/status (Chuyển trạng thái đơn hàng)

1. **Kỹ thuật thiết kế áp dụng:**
   * **State Transition Testing (Ma trận 4x4 + Canceled):**
     * Trạng thái hợp lệ: `pending -> confirmed -> shipping -> delivered`.
     * Cho phép hủy: `pending -> canceled`, `confirmed -> canceled`, `shipping -> canceled`.
     * Kiểm tra toàn bộ 16 trường hợp chuyển trạng thái bất hợp lệ (nhảy cóc bước, quay lui từ trạng thái kết thúc).
   * **Access Control & Security (BFLA/IDOR):** Kiểm tra người dùng thường gọi API Admin, Request không kèm token, Token giả mạo.
2. **AI Generation & Human Audit:**
   * AI sinh 43 test cases.
   * Sinh viên audit lại máy trạng thái và viết thêm kịch bản Pre-request tạo đơn hàng tươi (`/api/checkout`) trước mỗi lần chuyển trạng thái để tránh phụ thuộc dữ liệu tĩnh.
3. **5 Human Extended Test Cases:**
   * `TC_ORD_EXT_01`: Non-existent Order ID with Boundary Integers (`ID = 2147483647`)
   * `TC_ORD_EXT_02`: Cross-Tenant Order Manipulation (Admin thao tác đơn hàng giữa các phân vùng)
   * `TC_ORD_EXT_03`: Status Update with Empty Payload `{}`
   * `TC_ORD_EXT_04`: Transition History Auditing (Kiểm tra log lịch sử cập nhật)
   * `TC_ORD_EXT_05`: Nested Object Injection in Status Field
4. **Các Bug phát hiện được trên API 3:**
   * `BUG-ORD-01` (#373): Nghiêm trọng - Cho phép đơn hàng đã `canceled` chuyển thành `delivered` (Vi phạm tính toàn vẹn).
   * `BUG-ORD-02` (#374): Lỗ hổng BFLA - Người dùng thường có thể tự cập nhật trạng thái đơn hàng như Admin.
   * `BUG-ORD-03` (#375): Admin không thể hủy đơn hàng khi đơn hàng đang ở trạng thái `shipping`.
   * `BUG-ORD-04` (#376): ID đơn hàng không phải số nguyên (`abc`, `-1`) trả về 404 thay vì 400 Bad Request.

---

## 4. KHAI THÁC CÁC TÍNH NĂNG NÂNG CAO CỦA POSTMAN (POSTMAN FEATURES)

Trong bài tập cá nhân này, sinh viên đã ứng dụng triệt để hệ sinh thái tính năng của Postman:

1. **Workspaces & Hierarchical Collections:** Tổ chức bài bản theo thư mục phân cấp rõ ràng, dễ bảo trì.
2. **Environments & Variables Management:**
   * Tách biệt biến môi trường (`baseUrl`, `studentId`, `admin_token`, `user_token`, `current_test_order_id`).
   * Sử dụng biến động có sẵn của Postman: `{{$timestamp}}`, `{{$randomEmail}}`, `{{$randomPassword}}`.
3. **Pre-request Scripts (Request Chaining & Dynamic Fixtures):**
   * Sử dụng `pm.sendRequest` gửi ngầm request tạo mới đơn hàng trước khi thực hiện test chuyển trạng thái.
   * Tự động khởi tạo và đăng ký user phục vụ kiểm thử tính năng khóa tài khoản.
4. **Collection-Level Script Injection:**
   * Nhúng tự động header bắt buộc `X-Student-Id: 23127340` vào **100% các request** thông qua Collection Pre-request Script.
5. **Chai Assertion Library (Multi-layered Assertions):**
   * Kiểm tra mã trạng thái (`pm.response.to.have.status`).
   * Kiểm tra cấu trúc Schema và kiểu dữ liệu của Body JSON (`pm.expect(res).to.have.property`).
   * Kiểm tra giới hạn thời gian phản hồi (`pm.expect(pm.response.responseTime).to.be.below(1000)`).
6. **Newman CLI & Automated HTML Extra Reporting:**
   * Thực thi trơn tru bộ test từ dòng lệnh không cần giao diện đồ họa.
   * Tự động xuất file báo cáo HTML trực quan với đầy đủ biểu đồ, thời gian phản hồi và nhật ký lỗi.
7. **Khả năng mở rộng Data-Driven & Mock Servers:**
   * Cấu hình sẵn sàng cho việc chạy vòng lặp dữ liệu lớn (Data-driven qua file JSON/CSV).
   * Hỗ trợ thiết lập Mock Server cho các cổng thanh toán và webhook bên thứ 3.

---

## 5. TÍCH HỢP KIỂM THỬ VÀO CI/CD (GITHUB ACTIONS)

Pipeline kiểm thử tự động được thiết lập tại [.github/workflows/newman-hw06-23127340.yml](../../.github/workflows/newman-hw06-23127340.yml).

### Minh chứng 2 lần chạy Pipeline thực tế:

| Lần chạy | Mục đích kiểm thử | Trạng thái Pipeline | Kết quả thực thi | Link GitHub Actions Run |
| :---: | :--- | :---: | :--- | :---: |
| **Run 1** | **All Pass (Green ✅)** | ✅ **SUCCESS** | **20/20 Assertions Passed** (0 Failures) | [Run #32335667479](https://github.com/DuyITLOR/group05_eshop/actions/runs/32335667479) |
| **Run 2** | **One Fail (Red ❌)** | ❌ **FAILURE** | **20 Passed, 1 Failed** (`TC_ORD_ST_24`) | [Run #32335710319](https://github.com/DuyITLOR/group05_eshop/actions/runs/32335710319) |

*Hình ảnh minh chứng chi tiết đã được nhúng tại file báo cáo:* [HW/week10/cicd_report.md](file:///d:/group05_eshop/HW/week10/cicd_report.md).

---

## 6. THIẾT KẾ AGENT SKILL: AI-DRIVEN API TEST GENERATOR (G9.5 CREATE)

Để đáp ứng mức độ sáng tạo (Bloom-AI Level G9.5), một kiến trúc **AI-driven API Test Generator Agent Skill** đã được thiết kế:

### 6.1. Sơ đồ kiến trúc luồng xử lý (Architecture Flowchart):

```
+-----------------------------------------------------------------------------------+
|                        AI-Driven API Test Generator                               |
+-----------------------------------------------------------------------------------+
                                       |
                                       v
                     +-----------------------------------+
                     | 1. API Specification Parser       |
                     |    (Endpoints, Methods, Schemas)  |
                     +-----------------------------------+
                                       |
                                       v
         +-----------------------------+-----------------------------+
         |                             |                             |
         v                             v                             v
+------------------+         +-------------------+         +-------------------+
| 2. Domain & BVA  |         | 3. State Machine  |         | 4. Security Rule  |
|    Partitioning  |         |    Matrix Builder |         |    Engine (SEC)   |
+------------------+         +-------------------+         +-------------------+
         |                             |                             |
         +-----------------------------+-----------------------------+
                                       |
                                       v
                     +-----------------------------------+
                     | 5. Postman Collection Synthesizer |
                     |    (Pre-request Scripts, Tests)   |
                     +-----------------------------------+
                                       |
                                       v
                     +-----------------------------------+
                     | 6. Newman Execution & Bug Filter  |
                     |    (Console Log, Report, Issues)  |
                     +-----------------------------------+
```

### 6.2. Mã giả thuật toán (Pseudocode):

```python
def generate_api_test_suite(api_spec_file, output_collection_path):
    # Bước 1: Phân tích đặc tả API
    spec = parse_openapi_or_markdown(api_spec_file)
    test_suite = []

    # Bước 2: Sinh test case phân hoạch tương đương và giá trị biên
    for param in spec.parameters:
        partitions = compute_domain_partitions(param.type, param.constraints)
        boundary_values = compute_boundary_values(param.min, param.max)
        test_suite.extend(build_domain_test_cases(param, partitions, boundary_values))

    # Bước 3: Xây dựng ma trận chuyển trạng thái (nếu có State Machine)
    if spec.has_state_machine:
        matrix = build_state_transition_matrix(spec.states, spec.valid_transitions)
        test_suite.extend(build_state_transition_tests(matrix))

    # Bước 4: Tự động gài các quy tắc kiểm thử bảo mật
    security_payloads = load_security_vectors(["SQLi", "IDOR", "BFLA", "NoAuth"])
    test_suite.extend(build_security_test_cases(spec.endpoint, security_payloads))

    # Bước 5: Đóng gói thành Postman Collection JSON v2.1.0
    collection = synthesize_postman_collection(
        name=f"Generated_Tests_{spec.api_name}",
        student_id="23127340",
        test_cases=test_suite
    )
    
    save_to_json(collection, output_collection_path)
    return collection
```

---

## 7. BÀN LUẬN & ĐÁNH GIÁ VỀ AI (AI CRITIQUE — 250 WORDS)

Trong quá trình đồng hành cùng AI để thiết kế và kiểm thử 3 API của hệ thống EShop, AI thể hiện năng lực vượt trội trong việc tự động sinh cấu trúc dữ liệu JSON, phân loại các giá trị biên (Boundary Values) và soạn thảo cú pháp kiểm thử Chai Assertion nhanh chóng. Tuy nhiên, AI bộc lộ những điểm mù nghiêm trọng khi xử lý logic nghiệp vụ phụ thuộc trạng thái (State-dependent logic) và bảo mật thực tế:

Thứ nhất, AI thường mặc định giả định mã nguồn backend đã được triển khai đúng theo đặc tả (Golden Standard Bias). Ví dụ, AI không tự phát hiện được lỗi công thức tính coupon bị ngược dấu hoặc lỗi cho phép chuyển trạng thái đơn hàng từ `canceled` sang `delivered` nếu người kiểm thử không chủ động ép AI xây dựng ma trận chuyển trạng thái đầy đủ 4x4. Thứ hai, AI có xu hướng bỏ qua các bước tiền xử lý dữ liệu động (Pre-request dynamic chaining), thường gán ID đơn hàng cố định dẫn đến test case bị fail do phụ thuộc dữ liệu cũ.

Bài học cốt lõi rút ra là: AI đóng vai trò như một trợ lý tăng tốc độ soạn thảo (Execution Accelerator), nhưng tư duy phản biện (Critical Thinking), chiến lược kiểm thử biên và việc rà soát từng bước (Step-by-step Human Review) của kỹ sư kiểm thử vẫn là yếu tố quyết định để phát hiện các lỗi nghiệp vụ và lỗ hổng bảo mật sâu trong hệ thống.

---

## 8. PHỤ LỤC NHẬT KÝ SỬ DỤNG AI (AI AUDIT REPORT)

* **Tuyên bố:** *"Tôi có sử dụng công cụ AI (Gemini / Antigravity IDE) làm trợ lý hỗ trợ trong bài tập này."*
* **Bảng nhật ký tương tác chính:**

| Thời gian | Tác vụ (Task) | Prompt của sinh viên | Kết quả do AI sinh ra | Hành động của sinh viên (Audit) |
| :---: | :--- | :--- | :--- | :--- |
| **19/08/2026** | Phân tích API 1 (Login) | "Phân tích đặc tả POST /api/login, sinh các test case EP và BVA" | Danh sách 39 test cases | Sửa đổi lại thời gian khóa tài khoản từ 60s thành 30s. |
| **19/08/2026** | Phân tích API 2 (Coupon) | "Thiết kế test cases kiểm tra giá trị tối thiểu 300k và coupon Fixed/Percent" | Danh sách 38 test cases | Bổ sung thêm các test case kiểm tra IDOR và rỗng Token. |
| **20/08/2026** | Ma trận API 3 (Order Status) | "Lập ma trận 4x4 cho các trạng thái đơn hàng và sinh test script" | Danh sách 43 test cases | Viết script Pre-request tự động checkout đơn hàng mới ngầm. |
| **20/08/2026** | Tích hợp CI/CD | "Viết GitHub Actions workflow chạy Newman và xuất artifact" | File YAML workflow | Hoàn thiện 2 sample collection (All Pass vs One Fail). |

---

## 9. BẰNG CHỨNG XÁC THỰC CHỐNG GIAN LẬN (ANTI-CHEAT EVIDENCE)

1. **Header sinh viên:** `X-Student-Id: 23127340` được nhúng tự động trong toàn bộ request gửi đi.
2. **Môi trường thực thi SUT:** Hostname thực tế là `http://localhost:3000` (EShop Express.js Backend chạy trên máy nội bộ).
3. **Báo cáo HTML Newman:** File `newman_report_23127340.html` được trích xuất trực tiếp từ lần chạy thực tế với 139 requests.
4. **Git Commit History:** Toàn bộ tiến trình được commit theo từng bước và lưu trữ minh bạch trên GitHub.
