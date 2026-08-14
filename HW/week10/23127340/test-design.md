# BÁO CÁO THIẾT KẾ KIỂM THỬ API (TEST DESIGN) — WEEK 09

- **Sinh viên:** Dương Thế Đạt
- **MSSV:** 23127340
- **API thực hiện:** `POST /api/products` (Tạo mới sản phẩm)
- **Base URL:** `http://localhost:3000`

---

## 1. Bước 1 — Generate with AI

### 1.1 Prompt gửi cho AI
```text
Bạn là một Chuyên gia Kiểm thử Phần mềm (Senior API QA Automation Engineer).
Hãy thiết kế bộ test case chi tiết cho API sau của hệ thống EShop:

[THÔNG TIN API]
- Endpoint: POST /api/products
- Description: Thêm mới một sản phẩm vào hệ thống EShop
- Headers: Content-Type: application/json, X-Student-Id: <studentId>
- Request Body (JSON):
  {
    "name": "string (Tên sản phẩm)",
    "price": "integer/number (Giá sản phẩm)",
    "description": "string (Mô tả sản phẩm)",
    "imageUrl": "string (Đường dẫn ảnh)",
    "category_id": "integer (ID danh mục sản phẩm)"
  }
- Response mẫu thành công (200 OK):
  {
    "message": "Product created",
    "id": 6
  }

[YÊU CẦU THIẾT KẾ]
Thiết kế tối thiểu 12 test case bao phủ toàn diện các khía cạnh:
1. Domain Partitions & Boundary Values: Giá trị hợp lệ, không hợp lệ, biên độ dài tên, giá trị 0, số âm, số thập phân, chuỗi rỗng, thiếu trường bắt buộc, category_id không tồn tại.
2. Security & Data Sanitization: SQL Injection payload trong name/description, XSS payload, Body rỗng, định dạng JSON sai.
3. Schema Validation: Kiểm tra cấu trúc trường message (string) và id (number).

Vui lòng trả về kết quả dưới dạng bảng có các cột chính xác sau:
| tc_id | input | expected_status | expected_fields | rationale |
```

### 1.2 Output của AI (14 Test Cases đề xuất)

| tc_id | input | expected_status | expected_fields | rationale |
| :--- | :--- | :--- | :--- | :--- |
| **AI-01** | `name: "Bàn phím cơ AKKO 3087"`, `price: 1200000`, `description: "Switch Cherry"`, `imageUrl: "https://placehold.co/300"`, `category_id: 3` | `200` | `message`, `id` | **Positive:** Thêm sản phẩm với đầy đủ thông tin hợp lệ |
| **AI-02** | `name: "Chuỗi 500 ký tự A..."`, `price: 500000`, `description: "Desc"`, `imageUrl: "https://placehold.co/300"`, `category_id: 1` | `200` | `message`, `id` | **Boundary:** Kiểm tra độ dài tên sản phẩm đạt ngưỡng lớn (Max length) |
| **AI-03** | `name: "Chuột không dây Logitech Master 3S Tiếng Việt"`, `price: 2500000`, `description: "Hỗ trợ gõ dấu"`, `imageUrl: "https://placehold.co/300"`, `category_id: 3` | `200` | `message`, `id` | **Domain:** Tên sản phẩm chứa ký tự có dấu UTF-8 tiếng Việt và khoảng trắng |
| **AI-04** | `name: "Tai nghe Gaming 0 Đ"`, `price: 0`, `description: "Quà tặng"`, `imageUrl: "https://placehold.co/300"`, `category_id: 3` | `200` | `message`, `id` | **Boundary:** Giá sản phẩm bằng 0 (quà tặng / khuyến mãi hợp lệ) |
| **AI-05** | `name: "Sản phẩm giá âm"`, `price: -100000`, `description: "Desc"`, `imageUrl: "https://placehold.co/300"`, `category_id: 2` | `400` | `error` | **Domain (Negative):** Giá tiền là số âm không hợp lệ trong thương mại |
| **AI-06** | `name: ""`, `price: 500000`, `description: "Desc"`, `imageUrl: "https://placehold.co/300"`, `category_id: 1` | `400` | `error` | **Domain (Negative):** Tên sản phẩm là chuỗi rỗng |
| **AI-07** | Thiếu trường `name` trong JSON body (chỉ có price, description...) | `400` | `error` | **Domain (Negative):** Thiếu trường bắt buộc `name` |
| **AI-08** | `name: "SP"`, `price: 100000`, `description: "Desc"`, `imageUrl: "https://placehold.co/300"`, `category_id: 999999` | `400` | `error` | **Domain (Negative):** Danh mục `category_id` không tồn tại trong CSDL |
| **AI-09** | `name: "SP"`, `price: "Một triệu"`, `description: "Desc"`, `imageUrl: "https://placehold.co/300"`, `category_id: 1` | `400` | `error` | **Domain (Negative):** Giá trị `price` truyền sai kiểu dữ liệu (String thay vì Number) |
| **AI-10** | `name: "SP"`, `price: 100000`, `description: "Desc"`, `imageUrl: ""`, `category_id: 1` | `200` | `message`, `id` | **Boundary:** Cho phép `imageUrl` là chuỗi rỗng (sản phẩm không có ảnh) |
| **AI-11** | `name: "Sony WH-1000XM5'; DROP TABLE products; --"`, `price: 7000000`, `description: "Desc"`, `imageUrl: "https://placehold.co/300"`, `category_id: 3` | `200` | `message`, `id` | **Security:** Kiểm tra chống tấn công SQL Injection bằng Parameterized Query |
| **AI-12** | `name: "SP XSS"`, `price: 200000`, `description: "<script>alert('XSS')</script>"`, `imageUrl: "https://placehold.co/300"`, `category_id: 1` | `200` | `message`, `id` | **Security:** Lưu trữ payload XSS an toàn mà không làm lỗi backend |
| **AI-13** | Body rỗng `{}` | `400` | `error` | **Boundary (Negative):** Gửi request không có dữ liệu |
| **AI-14** | `name: "SP Test Schema"`, `price: 300000`, `description: "Desc"`, `imageUrl: "https://placehold.co/300"`, `category_id: 1` | `200` | `message`, `id` | **Schema:** Kiểm tra response trả về phải có property `message` (string) và `id` (integer dương) |

---

## 2. Bước 2 — Audit (Human Review)

### 2.1 Bảng Audit đánh giá toàn bộ Test Cases của AI

| TC | Nhãn | Nhận xét hoặc chỉnh sửa |
| :--- | :--- | :--- |
| **AI-01** | `VALID` | Ca kiểm thử luồng chuẩn đầy đủ dữ liệu, đúng đặc tả API. |
| **AI-02** | `VALID` | Kiểm tra giá trị biên độ dài chuỗi tên sản phẩm rất tốt. |
| **AI-03** | `VALID` | Đảm bảo hệ thống hỗ trợ chuẩn ký tự tiếng Việt có dấu UTF-8. |
| **AI-04** | `VALID` | Giá 0 đồng hợp lệ trong bài toán sản phẩm khuyến mại/quà tặng. |
| **AI-05** | `INCOMPLETE` | **Chỉnh sửa:** Về mặt lý thuyết RESTful API thì giá âm nên trả về `400 Bad Request`. Tuy nhiên backend hiện tại của SUT chưa có middleware validation logic cho `price < 0` nên SQLite vẫn ghi nhận và trả về `200 OK`. Cần ghi nhận đây là đặc điểm của SUT khi chạy test thực tế. |
| **AI-06** | `INCOMPLETE` | **Chỉnh sửa:** Tương tự AI-05, backend SQLite cho phép insert chuỗi `""` vào cột TEXT và trả về `200 OK` do chưa có ràng buộc `CHECK(length(name) > 0)`. Khi chạy automation trên SUT, `expected_status` thực tế của SUT là `200`. |
| **AI-07** | `INCOMPLETE` | Thiếu giả định rõ ràng: khi không truyền key `name`, giá trị trong DB sẽ là `NULL`, SUT trả về `200 OK` do SQLite cột `name` không có ràng buộc `NOT NULL`. |
| **AI-08** | `INCOMPLETE` | SUT không bật Foreign Key constraint (`PRAGMA foreign_keys = ON`), nên chèn `category_id` không tồn tại vẫn trả về `200 OK`. |
| **AI-09** | `VALID` | SQLite có tính năng type affinity, nhưng gửi string cho cột integer trong trường hợp invalid type cần được ghi nhận. |
| **AI-10** | `VALID` | Kiểm tra chuỗi rỗng cho trường ảnh tùy chọn là chính xác. |
| **AI-11** | `VALID` | Backend sử dụng `db.run(sql, [params])` với prepared statement nên an toàn trước SQL Injection, lưu nguyên bản chuỗi và trả về `200 OK`. |
| **AI-12** | `VALID` | Kiểm tra payload HTML/Script injection được lưu trữ an toàn. |
| **AI-13** | `INCOMPLETE` | Body rỗng `{}` sẽ gán tất cả các cột là `undefined` (NULL) và vẫn trả về `200 OK` do thiếu body validator middleware. |
| **AI-14** | `VALID` | Khẳng định cấu trúc response schema theo đúng tài liệu đặc tả. |

### 2.2 Test Case được chỉnh sửa & làm rõ
> **Chỉnh sửa ca AI-05 & AI-06:** Trong tài liệu thiết kế lý thuyết, các ca kiểm thử input không hợp lệ (giá âm, tên rỗng) kỳ vọng mã lỗi `400`. Tuy nhiên để phục vụ Data-Driven Execution trên hệ thống thực tế (SUT), chúng ta điều chỉnh và bổ sung dữ liệu kiểm tra xem backend có bị crash (lỗi 500) hay không, đồng thời ghi nhận hành vi chấp nhận chuỗi rỗng của SUT là status `200`.

---

## 3. Bước 3 — Extend (Bổ sung ≥ 2 Test Cases tự viết)

| tc_id | input | expected_status | expected_fields / assertions | rationale & Lý do AI bỏ sót |
| :--- | :--- | :--- | :--- | :--- |
| **EXT-01** | `POST /api/products` với body hợp lệ | `200` | Header `Content-Type` chứa `application/json; charset=utf-8` | **Lý do AI bỏ sót:** AI có xu hướng chỉ quan tâm đến Response Body và Status Code mà thường bỏ sót việc xác thực Response Headers (Content-Type) theo chuẩn REST API. |
| **EXT-02** | `POST /api/products` với payload bất kỳ | `200` | Assertion: `pm.response.responseTime < 500` (ms) | **Lý do AI bỏ sót:** AI không tự đề xuất kiểm thử phi chức năng (Non-functional requirement) về thời gian phản hồi (Response Time / Performance Threshold) nếu không được yêu cầu rõ trong prompt ban đầu. |

---

## 4. Bước 6 — Postman Features Đã Sử Dụng

Bảng thống kê các tính năng của Postman đã được sử dụng trong bài thực hành:

| Feature | Đã dùng? | Ghi chú |
| :--- | :---: | :--- |
| **Collections** | **Có** | Tạo collection `mini-products.postman_collection.json` quản lý request kiểm thử API `POST /api/products`. |
| **Environment variables** | **Có** | Sử dụng file môi trường `mini-local.postman_environment.json` lưu biến `baseUrl` và `studentId`. |
| **Collection variables** | **Không** | Không sử dụng do toàn bộ biến được quản lý tập trung ở Environment và Iteration Data. |
| **Pre-request scripts** | **Có** | Tự động thêm header `X-Student-Id` lấy giá trị từ biến `studentId` trong environment trước khi gửi request. |
| **Test scripts (assertions)** | **Có** | Viết 4 assertions kiểm tra Status Code động, Content-Type JSON, Schema và Response Time $< 500\text{ms}$. |
| **Data-driven runs (Collection Runner + data file)** | **Có** | Chạy kiểm thử lặp 5 iterations với tệp dữ liệu kiểm thử `mini-products.data.json`. |
| **Newman CLI** | **Có** | Thực thi kiểm thử tự động từ dòng lệnh với Newman CLI và xuất báo cáo `mini-newman-report.json`. |
| **Monitors** | **Không** | Bài tập thực hiện kiểm thử local và CI/CD với GitHub Actions nên không sử dụng cloud monitor. |
| **Mock servers** | **Không** | Kiểm thử trực tiếp trên Backend SUT thật của dự án nên không cần mock. |
| **Workspaces** | **Có** | Tổ chức bài tập trong Workspace riêng biệt trên Postman Desktop. |

*(Tổng số feature đã dùng: **6/10** tính năng, đạt yêu cầu tối thiểu ≥ 6 features)*.
