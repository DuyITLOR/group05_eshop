# Mini API Testing - `GET /api/users/me`

**MSSV:** 23127107  
**API đã chọn:** `GET /api/users/me` (API số 12)  
**Base URL:** `http://localhost:3000`  
**Xác thực:** bắt buộc header `Authorization: Bearer <JWT>`.

## 1. Generate with AI

### Prompt đã dùng

```text
Bạn là người thiết kế kiểm thử phần mềm. Hãy làm từng bước cho EShop API dưới đây; không dùng prompt chung chung kiểu "generate all tests".

API contract cần kiểm thử
- Method và endpoint: GET /api/users/me
- Base URL: http://localhost:3000
- Xác thực: bắt buộc Authorization: Bearer <JWT>.
- Phản hồi thành công: HTTP 200 và profile của user đã xác thực.
- Khi xác thực thất bại, implementation trả JSON error response.

Trước tiên, hãy phân vùng đầu vào Authorization: token hợp lệ, thiếu header, Bearer token rỗng, token sai định dạng, token hết hạn, token hợp lệ của user khác và scheme không hợp lệ. Sau đó, đề xuất ít nhất 12 test case độc lập. Bao gồm positive, negative, boundary, security/IDOR và response-schema. Với mỗi case, trả về đúng các cột: tc_id, input, expected status, expected fields, rationale. Không tự suy diễn requirement chưa được nêu; hãy ghi rõ mọi giả định.
```

### AI output rút gọn (12 test case được đề xuất)

| TC ID | Input | Expected status | Expected fields | Rationale |
| --- | --- | ---: | --- | --- |
| AI-01 | JWT hợp lệ của `test@eshop.com` | 200 | `id`, `name`, `email`, `role` | Luồng lấy profile khi đã xác thực. |
| AI-02 | Không có header `Authorization` | 401 | JSON `error` | Thiếu thông tin xác thực. |
| AI-03 | `Authorization: Bearer` | 401 | JSON `error` | Boundary: bearer token rỗng. |
| AI-04 | `Authorization: Bearer not-a-jwt` | 403 | JSON `error` | JWT sai định dạng. |
| AI-05 | JWT hợp lệ nhưng hết hạn | 403 | JSON `error` | Credential hết hạn. |
| AI-06 | `Authorization: Basic abc` | 401 | JSON `error` | Authentication scheme không hỗ trợ. |
| AI-07 | JWT hợp lệ của user thứ hai | 200 | Chỉ profile của chính user đó | Kiểm tra IDOR/identity isolation. |
| AI-08 | JWT hợp lệ nhưng bị sửa chữ ký | 403 | JSON `error` | Kiểm tra toàn vẹn chữ ký. |
| AI-09 | Bearer token rất dài | 403 | JSON `error` | Xử lý token không hợp lệ một cách an toàn. |
| AI-10 | JWT hợp lệ | 200 | `Content-Type` JSON và các core fields | Kiểm tra response representation và schema. |
| AI-11 | JWT hợp lệ | 200 | Không có `password`, `reset_token`, `login_attempts` | Kiểm tra lộ dữ liệu nhạy cảm. |
| AI-12 | JWT hợp lệ | 200 | Response time dưới 1.000 ms | Local performance guardrail. |

## 2. Audit (human review)

| TC | Nhãn | Nhận xét hoặc chỉnh sửa |
| --- | --- | --- |
| AI-01 | VALID | Kiểm tra luồng chuẩn theo API contract với tài khoản test đã seed và profile schema tối thiểu, ổn định. |
| AI-02 | VALID | Thiếu credential là một negative partition bắt buộc; middleware hiện tại trả 401 cùng JSON error. |
| AI-03 | VALID | Bearer scheme không có token khác với không gửi header và không được phép xác thực thành công. |
| AI-04 | VALID | Token verifier từ chối JWT sai cú pháp với 403; case này được đưa vào data-driven run. |
| AI-05 | INCOMPLETE | Cần JWT hết hạn được tạo có kiểm soát và test identity được thống nhất. Case được giữ trong thiết kế nhưng không đưa vào năm dòng runner ổn định. |
| AI-06 | INVALID | API specification yêu cầu bearer format nhưng không cam kết 401 cho mọi scheme không hỗ trợ. Sửa thành: request phải bị từ chối (401 hoặc 403) với JSON error, sau khi API owner xác nhận exact status. |
| AI-07 | VALID | `/me` phải suy ra identity từ token đã verify; token của user khác chỉ được trả profile của user đó. |
| AI-08 | VALID | Chữ ký bị thay đổi phải làm token vô hiệu và không được lộ profile. |
| AI-09 | INCOMPLETE | Đây là robustness probe hữu ích, nhưng contract chưa nêu giới hạn header hoặc exact expected status. |
| AI-10 | VALID | Bổ sung assertion khách quan cho response header và field shape của response thành công. |
| AI-11 | VALID | Password, reset token và login-attempt state là dữ liệu server-side nhạy cảm, không được xuất hiện trong client profile response. Đây là defect-revealing check riêng. |
| AI-12 | INCOMPLETE | Ngưỡng 1.000 ms là local guardrail, không phải SLO trong đề; ngưỡng này được ghi rõ phạm vi trong data file. |

**Chỉnh sửa bắt buộc đã thực hiện:** exact status của AI-06 được đổi thành yêu cầu "bị từ chối" vì public contract không quy định cách phân loại mọi scheme không hỗ trợ. Provider hiện tại xử lý `Basic abc` như token sai và trả 403.

## 3. Extend - test case tự viết

| TC ID | Input / kiểm tra | Kết quả mong đợi | Lý do AI bỏ sót |
| --- | --- | --- | --- |
| EX-13 | Với mọi request, kiểm tra `Content-Type`. | Header chứa `application/json`, kể cả error 401/403. | AI output tập trung vào status và body fields nên dễ xem nhẹ header validation. |
| EX-14 | Với valid token, kiểm tra toàn bộ profile body để tìm secrets. | Response không có `password`, `reset_token`, `login_attempts`, `locked_until`. | Prompt ban đầu nêu schema fields nhưng chưa gọi tên rõ data minimisation/security fields. |

**Quan sát từ source:** provider local dùng `SELECT * FROM users` trong `/api/users/me`. Vì vậy EX-14 dự kiến phát hiện defect lộ dữ liệu nhạy cảm cho đến khi provider được sửa. EX-14 không thuộc năm checkpoint iterations xanh và không được ghi là `Passed`.

## 4. Execute - lựa chọn dữ liệu và assertion

Collection trước hết đăng nhập bằng tài khoản non-admin đã seed `test@eshop.com` / `Test1234!`, lưu JWT cho iteration hiện tại, rồi gọi API đã chọn đúng một lần trong mỗi iteration. Năm case ổn định của API đã chọn là:

| Data case | Auth mode | Expected status | Mục đích |
| --- | --- | ---: | --- |
| RUN-01 | `valid` | 200 | Lấy profile cơ sở. |
| RUN-02 | `missing` | 401 | Từ chối khi thiếu header. |
| RUN-03 | `malformed` | 403 | Từ chối JWT không hợp lệ. |
| RUN-04 | `empty_bearer` | 401 | Boundary: bearer token rỗng. |
| RUN-05 | `valid` | 200 | Lặp lại request hợp lệ và kiểm tra identity field. |

Mỗi request của API đã chọn upsert `X-Student-Id: {{studentId}}`, assert status theo data file, assert JSON `Content-Type`, kiểm tra JSON response shape phù hợp và local response-time guardrail. Collection không coi EX-14 là một assertion phải pass.

## 5. Postman features đã dùng

| Feature | Đã dùng? | Ghi chú |
| --- | --- | --- |
| Collections | Có | `mini-users-me.postman_collection.json` chứa login setup và request API đã chọn. |
| Environment variables | Có | `baseUrl`, `studentId` và runtime `authToken` nằm trong environment. |
| Collection variables | Không | Token ngắn hạn được giữ trong local environment. |
| Pre-request scripts | Có | Request API đã chọn upsert `X-Student-Id` và chọn header từ từng data row. |
| Test scripts (assertions) | Có | Tự động kiểm tra login, status, header, profile/error schema, identity và response time. |
| Data-driven runs (Collection Runner + data file) | Có | Năm JSON row tạo năm iteration. |
| Newman CLI | Có | Chạy headless collection và export JSON report. |
| Monitors | Không | Scheduled cloud monitoring nằm ngoài phạm vi mini exercise. |
| Mock servers | Không | Dùng provider EShop local thực tế. |
| Workspaces | Có | Collection và environment export có thể import vào Postman workspace của sinh viên. |

**Số feature đã dùng:** 7 (đạt yêu cầu tối thiểu 6).

## 6. Bằng chứng còn cần từ GitHub repository của sinh viên

`ci-pass.png` và `ci-fail.png` phải là ảnh chụp từ GitHub Actions thật trên nhánh của sinh viên. Làm theo `CI_EVIDENCE_REQUIRED.md`; không dùng ảnh sinh tự động hoặc ảnh chỉnh sửa.
