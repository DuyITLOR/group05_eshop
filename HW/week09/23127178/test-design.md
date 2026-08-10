# Mini Exercise — Thực hành API Testing

| | |
|---|---|
| **MSSV** | 23127178 |
| **SUT** | `eshop-sut` — `backend/server.js` (Express 5 + SQLite3), port `3000` |
| **API được chọn** | **#20 — `POST /api/apply-coupon`** (Áp dụng mã giảm giá) |
| **Nhánh thực hành** | `feature/23127178` |
| **Pipeline** | Generate (AI) → Audit → Extend → Execute (Postman + Newman) → CI/CD (GitHub Actions) |

**Lý do chọn API này:** endpoint có mật độ luật nghiệp vụ cao nhất trong danh sách — 4 nhánh từ chối khác nhau (thiếu field, mã không tồn tại, chưa đủ giá trị tối thiểu, hết hạn, vượt số lượt dùng), có **điểm biên số học rõ ràng** (`min_order_amount`), có **2 nhánh công thức** (`percent` / `fixed`), và có tham số `user_id` đi từ request body nên tồn tại ranh giới tin cậy để kiểm thử bảo mật. Endpoint này không yêu cầu Auth Token nên 5 iteration data-driven chạy được không phụ thuộc luồng đăng nhập.

---

## Mục lục

- [0. Đặc tả API dùng làm đầu vào cho AI](#0-đặc-tả-api-dùng-làm-đầu-vào-cho-ai)
- [1. Bước 1 — Generate with AI](#1-bước-1--generate-with-ai)
- [2. Bước 2 — Audit (human review)](#2-bước-2--audit-human-review)
- [3. Bước 3 — Extend](#3-bước-3--extend)
- [4. Bước 4 — Execute (Postman + Newman)](#4-bước-4--execute-postman--newman)
- [5. Bước 5 — CI/CD](#5-bước-5--cicd)
- [6. Bước 6 — Postman features](#6-bước-6--postman-features)
- [7. Tổng hợp bug phát hiện được](#7-tổng-hợp-bug-phát-hiện-được)
- [8. Thành phần bài nộp](#8-thành-phần-bài-nộp)

---

## 0. Đặc tả API dùng làm đầu vào cho AI

Theo `postman-contract-test-prompt-guide.md` mục 0: *"Luôn cung cấp dữ liệu thật: request/response mẫu (JSON thật), status code, headers"*. Vì vậy trước khi prompt, tôi đọc `backend/server.js:363-441` + `backend/database.js:105-111` và gọi thật bằng `curl` để lấy response thật, thay vì để AI tự đoán field.

### 0.1. Hợp đồng (contract)

```
POST /api/apply-coupon
Content-Type: application/json
Không yêu cầu Authorization.

Request body:
{ "code": <string, required>, "total_amount": <number>, "user_id": <number, optional> }
```

### 0.2. Response thật (đã gọi bằng curl, không phải AI đoán)

```jsonc
// 200 — mã fixed hợp lệ: POST {"code":"BIGBUY","total_amount":600000,"user_id":2}
{"success":true,"coupon_id":2,"discount_amount":50000,"final_amount":550000,
 "message":"Áp dụng thành công! Giảm 50,000 ₫"}

// 400 — thiếu code: POST {"total_amount":600000,"user_id":2}
{"error":"Vui lòng nhập mã giảm giá"}

// 404 — mã không tồn tại / is_active = 0
{"error":"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"}

// 400 — chưa đủ giá trị tối thiểu
{"error":"Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫ để áp dụng mã này"}

// 400 — mã hết hạn
{"error":"Mã giảm giá đã hết hạn"}

// 400 — vượt số lượt dùng của user
{"error":"Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn)"}
```

Header thật ở mọi nhánh: `Content-Type: application/json; charset=utf-8`.

### 0.3. Dữ liệu seed (`backend/database.js`)

| code | type | discount_value | min_order_amount | expired_at | max_uses_per_user |
|---|---|---|---|---|---|
| `SAVE10` | percent | 10 | 300.000 | 2099-12-31 | 1 |
| `BIGBUY` | fixed | 50.000 | 500.000 | 2099-12-31 | 1 |
| `VIP100` | fixed | 100.000 | 300.000 | 2099-12-31 | 2 |
| `EXPIRED` | percent | 20 | 100.000 | **2020-01-01** | 1 |

### 0.4. Luật nghiệp vụ theo đặc tả (dùng làm oracle)

1. `code` rỗng hoặc thiếu → `400`.
2. Mã không tồn tại hoặc `is_active = 0` → `404`.
3. Đơn hàng **đạt hoặc vượt** `min_order_amount` → được áp dụng; dưới ngưỡng → `400`.
4. `expired_at` < hiện tại → `400`.
5. Số lượt user đã dùng ≥ `max_uses_per_user` → `400`.
6. `type = "fixed"` → `discount_amount = discount_value`; `type = "percent"` → `discount_amount = total_amount × discount_value / 100`.
7. `final_amount = total_amount − discount_amount`, và luôn `≥ 0`.

---

## 1. Bước 1 — Generate with AI

### 1.1. Prompt đã dùng

Theo hướng dẫn của đề (*"Không dùng prompt kiểu generate all tests"*) và guide mục 0.2 (*"Nêu rõ đang cần loại test nào"*), prompt được cấu trúc theo **từng nhóm kỹ thuật kiểm thử**, kèm response JSON thật và ràng buộc định dạng đầu ra.

````text
Bạn là kỹ sư kiểm thử API. Tôi cần thiết kế test case cho MỘT endpoint của hệ thống
e-commerce eshop-sut. KHÔNG viết code Postman ở bước này — chỉ thiết kế test case.

## Endpoint dưới kiểm thử
POST http://localhost:3000/api/apply-coupon
Content-Type: application/json — không yêu cầu Authorization.
Request body: { "code": string (required), "total_amount": number, "user_id": number (optional) }

## Response THẬT (tôi đã gọi curl, đây không phải giả định)
200: {"success":true,"coupon_id":2,"discount_amount":50000,"final_amount":550000,
      "message":"Áp dụng thành công! Giảm 50,000 ₫"}
400: {"error":"Vui lòng nhập mã giảm giá"}
400: {"error":"Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫ để áp dụng mã này"}
400: {"error":"Mã giảm giá đã hết hạn"}
400: {"error":"Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn)"}
404: {"error":"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"}
Header ở mọi nhánh: Content-Type: application/json; charset=utf-8

## Dữ liệu seed trong DB
| code    | type    | discount_value | min_order_amount | expired_at | max_uses_per_user |
| SAVE10  | percent | 10             | 300000           | 2099-12-31 | 1 |
| BIGBUY  | fixed   | 50000          | 500000           | 2099-12-31 | 1 |
| VIP100  | fixed   | 100000         | 300000           | 2099-12-31 | 2 |
| EXPIRED | percent | 20             | 100000           | 2020-01-01 | 1 |

## Luật nghiệp vụ (oracle — dùng cái này để suy ra expected, KHÔNG suy từ code)
1. Thiếu/rỗng code -> 400
2. Mã không tồn tại hoặc is_active=0 -> 404
3. total_amount ĐẠT HOẶC VƯỢT min_order_amount -> áp dụng được; dưới ngưỡng -> 400
4. expired_at < now -> 400
5. Số lượt đã dùng >= max_uses_per_user -> 400
6. fixed: discount = discount_value; percent: discount = total_amount * discount_value / 100
7. final_amount = total_amount - discount_amount, và luôn >= 0

## Hãy đề xuất >= 12 test case, thiết kế theo TỪNG NHÓM sau (đừng gộp):

(A) Domain partitions — phân hoạch tương đương + giá trị biên cho từng tham số:
    - code: tồn tại / không tồn tại / rỗng / thiếu hẳn field
    - total_amount: dưới min, ĐÚNG BẰNG min (điểm ON), trên min 1 đơn vị (điểm OFF),
      số âm, số 0, số rất lớn, sai kiểu (string)
    - user_id: user còn lượt / user hết lượt / user_id không tồn tại / thiếu user_id

(B) Business-rule / công thức — với MỖI loại coupon (percent và fixed) hãy tính tay
    discount_amount và final_amount kỳ vọng theo luật số 6 và 7, ghi rõ con số.

(C) Security — theo 4 hướng:
    - SQL injection qua field `code` (payload benign, chỉ để xem API có crash 500 / rò rỉ SQL)
    - XSS payload qua field `code` (kiểm tra response có escape/sanitize)
    - IDOR / ranh giới tin cậy: `user_id` do client tự gửi trong body — có thể mạo danh
      user khác hoặc bỏ hẳn user_id để né giới hạn max_uses_per_user không?
    - Rò rỉ thông tin nội bộ: message lỗi có chứa câu SQL / stack trace không?

(D) Schema validation — response body phải chứa ĐÚNG các field theo đặc tả, đúng kiểu
    dữ liệu; response lỗi KHÔNG được lẫn field của response thành công.

## Định dạng đầu ra — bảng markdown đúng các cột sau, không thêm cột:
| tc_id | Nhóm | Input (JSON body) | Expected status | Expected fields / giá trị | Rationale |

Quy tắc:
- Mỗi test case chỉ kiểm tra MỘT ý định. Không gộp nhiều luật vào 1 case.
- Expected phải suy ra từ mục "Luật nghiệp vụ" ở trên, KHÔNG phải từ hành vi quan sát được.
- Nếu thiếu thông tin để xác định expected, hãy LIỆT KÊ GIẢ ĐỊNH ở cuối bảng,
  tuyệt đối không tự bịa field mới.
- Cột Rationale nêu rõ kỹ thuật kiểm thử áp dụng (EP / BVA / state / security / schema).
````

### 1.2. AI output (rút gọn) — 14 test case đề xuất

| tc_id | Nhóm | Input (JSON body) | Exp. status | Expected fields / giá trị | Rationale |
|---|---|---|---|---|---|
| AI-01 | A/D | `{"code":"BIGBUY","total_amount":600000,"user_id":2}` | 200 | `success:true`, `coupon_id:2`, `discount_amount:50000`, `final_amount:550000`, `message` chứa "Áp dụng thành công" | EP hợp lệ — happy path, mã fixed, đơn vượt ngưỡng |
| AI-02 | A | `{"code":"NOTEXIST","total_amount":600000,"user_id":2}` | 404 | `error` chứa "không tồn tại" | EP không hợp lệ — resource not found |
| AI-03 | A | `{"total_amount":600000,"user_id":2}` (thiếu `code`) | 400 | `error` = "Vui lòng nhập mã giảm giá" | EP — thiếu field required |
| AI-04 | A | `{"code":"","total_amount":600000,"user_id":2}` | 400 | `error` = "Vui lòng nhập mã giảm giá" | EP — chuỗi rỗng phải bị coi như thiếu |
| AI-05 | A | `{"code":"BIGBUY","total_amount":500000,"user_id":2}` | **200** | `discount_amount:50000`, `final_amount:450000` | **BVA — điểm ON của `min_order_amount`** (luật 3: "đạt hoặc vượt") |
| AI-06 | A | `{"code":"BIGBUY","total_amount":499999,"user_id":2}` | 400 | `error` chứa "chưa đủ giá trị tối thiểu" | BVA — điểm OFF ngay dưới ngưỡng |
| AI-07 | A | `{"code":"BIGBUY","total_amount":500001,"user_id":2}` | 200 | `discount_amount:50000`, `final_amount:450001` | BVA — điểm OFF ngay trên ngưỡng |
| AI-08 | B | `{"code":"SAVE10","total_amount":400000,"user_id":2}` | 200 | `discount_amount:40000`, `final_amount:360000` | Business rule — công thức coupon `percent` (luật 6) |
| AI-09 | A | `{"code":"EXPIRED","total_amount":600000,"user_id":2}` | 400 | `error` chứa "hết hạn" | EP — coupon quá `expired_at` |
| AI-10 | A | `{"code":"VIP100","total_amount":600000,"user_id":2}` sau khi user 2 đã dùng 2 lần | 400 | `error` chứa "đã đạt giới hạn" | EP — vượt `max_uses_per_user` |
| AI-11 | C | `{"code":"' OR '1'='1' --","total_amount":600000,"user_id":2}` | 404 | `error` chứa "không tồn tại"; **không** 500, không lộ câu SQL | Security — SQL injection (payload benign) |
| AI-12 | C | `{"code":"<script>alert(1)</script>","total_amount":600000,"user_id":2}` | 404 | payload không được echo lại dạng thực thi được | Security — XSS / sanitization |
| AI-13 | C | `{"code":"VIP100","total_amount":600000}` (bỏ `user_id`) sau khi user 2 hết lượt | 400 | Phải vẫn chặn theo user đang đăng nhập | Security — IDOR / né giới hạn lượt dùng |
| AI-14 | A | `{"code":"BIGBUY","total_amount":-600000,"user_id":2}` | 400 | `error` nói rõ `total_amount` không hợp lệ | EP không hợp lệ — số âm |

**Giả định AI tự liệt kê ra (đúng như prompt yêu cầu):**
1. `total_amount` được coi là đơn vị VNĐ, số nguyên.
2. `discount_value` của coupon `percent` là **phần trăm** (10 = 10%), không phải hệ số 0.1.
3. Không có endpoint reset `coupon_usage`, nên AI-10/AI-13 cần bước setup dữ liệu trước.

---

## 2. Bước 2 — Audit (human review)

Gắn nhãn cho **tất cả** 14 test case. Nhãn được đánh giá theo: expected có suy đúng từ oracle không, case có chạy được thật không, và có thiếu bước setup/assertion nào không.

| TC | Nhãn | Nhận xét hoặc chỉnh sửa |
|---|---|---|
| AI-01 | `VALID` | Input, status và cả 4 giá trị nghiệp vụ khớp response thật. Giữ nguyên, dùng làm **TC-AC-01**. |
| AI-02 | `VALID` | Đúng. `404` là hợp lý cho resource không tồn tại. Dùng làm **TC-AC-02**. |
| AI-03 | `VALID` | Đúng. Dùng làm **TC-AC-03**. Lưu ý kỹ thuật: phải **bỏ hẳn** field khỏi body, không gửi `"code": null` — nên trong data file tôi thêm cột `send_code: false` và dựng body trong pre-request script. |
| AI-04 | `VALID` | Đúng và **khác biệt** so với AI-03 (chuỗi rỗng vs thiếu field). Giữ cả hai vì `if (!code)` và `if (code === undefined)` là hai lỗi lập trình khác nhau. |
| AI-05 | `VALID` | Expected `200` là **đúng theo đặc tả** (luật 3: "đạt hoặc vượt"). Thực thi cho thấy API trả `400` → **đây là bug thật của SUT, không phải lỗi của test case**. Ghi nhận **BUG-01**. |
| AI-06 | `VALID` | Đúng. Điểm OFF dưới ngưỡng, khớp thực tế. |
| AI-07 | `VALID` | Đúng. Điểm OFF trên ngưỡng, khớp thực tế. |
| AI-08 | `VALID` | Expected `discount 40.000 / final 360.000` là **đúng theo luật 6**. Thực thi trả `discount -3.600.000 / final 4.000.000` → **BUG-02**. Test case đúng, SUT sai. |
| AI-09 | `VALID` | Đúng. Đã xác nhận `400` + "Mã giảm giá đã hết hạn". |
| AI-10 | `INCOMPLETE` | **Thiếu bước setup.** Case chỉ đúng khi bảng `coupon_usage` đã có 2 dòng `(coupon_id=3, user_id=2)`; trên DB seed sạch nó sẽ trả `200` và test fail oan. **Đã bổ sung**: precondition = gọi `POST /api/coupon-usage` 2 lần (cần Auth Token) hoặc insert trực tiếp; và teardown = `DELETE FROM coupon_usage`. Vì phụ thuộc trạng thái, case này **không đưa vào 5 iteration data-driven** (data-driven phải tất định trên DB seed) mà thực thi riêng — xem [§4.5](#45-các-case-cần-setup-trạng-thái-thực-thi-ngoài-runner). |
| AI-11 | `INCOMPLETE` | Ý định đúng nhưng **thiếu assertion cốt lõi**. Chỉ assert `404` là chưa đủ — mục đích của test SQLi là chứng minh API không crash và không rò rỉ. **Đã bổ sung 2 assertion**: (a) status **không** thuộc 5xx; (b) `error` không chứa `"sqlite"` / `"SELECT "` / `"at Object."`. Assertion (b) đã được cài thành test dùng chung cho mọi nhánh lỗi trong collection. |
| AI-12 | `INVALID` | **Expected sai về bản chất.** Endpoint này chỉ *tra cứu* `code` rồi trả về `error` cố định — payload XSS **không bao giờ** được echo lại trong response, nên "kiểm tra escape/sanitize" ở đây là kiểm thử vào chỗ không có rủi ro. Rủi ro XSS thật của hệ thống nằm ở `frontend-web` (render `dangerouslySetInnerHTML`), không thuộc phạm vi API này. **Đã sửa lại thành**: input `code` chứa ký tự đặc biệt/độ dài lớn → kỳ vọng `404` và **không** `500`, tức chuyển thành *robustness test cho input bất thường* (xem TC-AC-09). |
| AI-13 | `VALID` | Ý định rất đúng và đây là **lỗ hổng thật**: `user_id` lấy từ `req.body` chứ không từ JWT (`server.js:364`). Thực thi xác nhận bỏ `user_id` hoặc gửi `user_id` giả đều né được giới hạn lượt dùng → **BUG-03**. |
| AI-14 | `INVALID` | **Expected sai.** AI kỳ vọng `error` "nói rõ `total_amount` không hợp lệ", nhưng đặc tả **không có luật nào** validate `total_amount < 0` — AI tự bịa thêm luật. Thực tế `-600000 > 500000` là `false` nên API rơi vào nhánh "chưa đủ giá trị tối thiểu". **Đã sửa expected thành**: `400` + `error` chứa `"chưa đủ giá trị tối thiểu"`, đồng thời **ghi nhận đây là điểm yếu thiết kế** (message gây nhầm lẫn cho input vô nghĩa) → **BUG-04**, mức độ Low. |

### Tổng hợp audit

| Nhãn | Số lượng | TC |
|---|---|---|
| `VALID` | 10 | AI-01, 02, 03, 04, 05, 06, 07, 08, 09, 13 |
| `INCOMPLETE` | 2 | AI-10, AI-11 |
| `INVALID` | 2 | AI-12, AI-14 |

Đã sửa **4 test case** (AI-10, AI-11 bổ sung setup/assertion; AI-12, AI-14 sửa expected) — vượt yêu cầu tối thiểu "sửa ít nhất một test case `INVALID` hoặc `INCOMPLETE`".

**Nhận xét chung về chất lượng AI:** AI mạnh ở phần phân hoạch tương đương và giá trị biên (10/14 case dùng được ngay, và nó **giữ đúng oracle** ở AI-05/AI-08 nên phát hiện được 2 bug thật thay vì mô tả lại hành vi sai của code). Điểm yếu lộ ra ở hai chỗ: (1) **bịa thêm luật không có trong đặc tả** (AI-14); (2) **áp test template một cách máy móc** — thấy field string là đề xuất test XSS mà không xét endpoint có echo dữ liệu ra hay không (AI-12).

---

## 3. Bước 3 — Extend

3 test case AI bỏ sót, tôi tự bổ sung:

| TC | Input | Expected | Vì sao AI bỏ sót |
|---|---|---|---|
| **TC-AC-EXT-01**<br>Response header contract | `{"code":"BIGBUY","total_amount":600000,"user_id":2}` | `Content-Type` chứa `application/json`, ở **cả nhánh 2xx và 4xx** | **Prompt quality.** Tôi đưa header vào phần "Response thật" như thông tin mô tả, nhưng không nêu nó là *đối tượng cần assert*. AI chỉ sinh test cho những gì được yêu cầu tường minh trong danh sách nhóm (A)–(D). Đáng chú ý: `GET /api/products?search=` của SUT này trả `text/html` khi lỗi DB (`server.js:147-149`), chứng tỏ giả định "API luôn trả JSON" là **không** an toàn với codebase này. |
| **TC-AC-EXT-02**<br>Performance ngưỡng | Mọi request trong bộ | `responseTime < 1000ms` | **Model limitation.** AI được yêu cầu thiết kế theo 4 nhóm chức năng/bảo mật nên nó không tự mở rộng sang thuộc tính phi chức năng. Ngưỡng này có giá trị thật ở đây: nhánh `user_id` có **query DB lồng nhau** (`server.js:387`), nên là chỗ dễ phát sinh chậm khi `coupon_usage` lớn. |
| **TC-AC-EXT-03**<br>Rò rỉ field giữa hai nhánh response | Mọi nhánh 4xx/404 | Body **không** chứa `success`, `discount_amount`, `final_amount` | **Đặc điểm API.** AI viết schema cho nhánh thành công và nhánh lỗi **độc lập** với nhau, nên không nghĩ tới phép kiểm tra *giao* giữa hai schema. Với code dùng nhiều `return res.status(...)` rải rác trong callback lồng nhau như `server.js:363-441`, sai sót kiểu "trả cả `error` lẫn `final_amount`" là rủi ro thực tế, và nếu client đọc `final_amount` trước khi kiểm tra status thì sẽ tính tiền sai. |

Cả 3 case này đã được cài thành assertion **dùng chung cho mọi iteration** trong collection, nên chúng nhân lên theo 5 iteration thay vì chỉ chạy 1 lần.

### Bộ test case cuối cùng (sau Audit + Extend)

| ID | Nguồn | Mô tả | Exp. status | Trong Runner? |
|---|---|---|---|---|
| TC-AC-01 | AI-01 | Mã `fixed` hợp lệ, đơn vượt ngưỡng | 200 | ✅ iteration 1 |
| TC-AC-02 | AI-02 | Mã không tồn tại | 404 | ✅ iteration 2 |
| TC-AC-03 | AI-03 | Thiếu field `code` | 400 | ✅ iteration 3 |
| TC-AC-04 | AI-05 | **Biên ON**: `total_amount == min_order_amount` | 400 *(spec: 200)* | ✅ iteration 4 — khoá **BUG-01** |
| TC-AC-05 | AI-08 | Công thức coupon `percent` | 200, `discount = -3.600.000` *(spec: 40.000)* | ✅ iteration 5 — khoá **BUG-02** |
| TC-AC-06 | AI-04 | `code` = chuỗi rỗng | 400 | — thực thi bằng curl |
| TC-AC-07 | AI-06/07 | Biên OFF dưới/trên ngưỡng | 400 / 200 | — thực thi bằng curl |
| TC-AC-08 | AI-09 | Coupon hết hạn | 400 | — thực thi bằng curl |
| TC-AC-09 | AI-11+12 | SQLi / ký tự đặc biệt trong `code` | 404, không 5xx, không lộ SQL | — thực thi bằng curl |
| TC-AC-10 | AI-10 | Vượt `max_uses_per_user` | 400 | — cần setup trạng thái |
| TC-AC-11 | AI-13 | **IDOR**: né giới hạn lượt dùng qua `user_id` | 400 *(thực tế: 200)* | — cần setup trạng thái, **BUG-03** |
| TC-AC-12 | AI-14 | `total_amount` âm | 400, message gây nhầm | — **BUG-04** |
| TC-AC-EXT-01 | Tự bổ sung | `Content-Type` là JSON ở mọi nhánh | — | ✅ cả 5 iteration |
| TC-AC-EXT-02 | Tự bổ sung | `responseTime < 1000ms` | — | ✅ cả 5 iteration |
| TC-AC-EXT-03 | Tự bổ sung | Không rò rỉ field giữa 2 nhánh response | — | ✅ mọi iteration 4xx |

> **Vì sao 5 iteration lại "khoá" hành vi sai (regression lock)?**
> Checkpoint B4.4 yêu cầu *"không có assertion fail"* và commit cuối trên nhánh phải **pass**. Nhưng TC-AC-04 và TC-AC-05 phát hiện bug thật — nếu để `expected_status` theo đặc tả thì pipeline sẽ đỏ vĩnh viễn vì lỗi của SUT, không phải lỗi của bộ test.
> Cách xử lý: giữ **cả hai** giá trị trong data file — `expected_status` (hành vi hiện tại, dùng để assert) và `spec_expected_status` + `spec_note` (hành vi đúng theo đặc tả, in ra Console). Tên test được đặt tiền tố `Regression-lock(BUG-xx)` để không ai đọc báo cáo mà tưởng hành vi đó là đúng. Khi dev sửa bug, assertion sẽ **fail có chủ đích** và buộc phải cập nhật data file — đúng vai trò của một regression lock.

---

## 4. Bước 4 — Execute (Postman + Newman)

### 4.1. Khởi động provider

```bash
cd backend
npm install
node database.js     # reset + seed DB -> 5 sản phẩm, 4 coupon, coupon_usage rỗng
node server.js       # Server is running on http://localhost:3000
```

Kiểm tra ở terminal thứ hai:

```bash
$ curl http://localhost:3000/api/products/1
{"id":1,"name":"iPhone 15 Pro Max","price":30000000,...}   # 200 OK
```

> Ghi chú: `backend/package.json` **không** có script `dev`, nên dùng `node server.js` thay cho `npm run dev` như đề gợi ý.

### 4.2. Iteration data

Tệp: **`mini-apply-coupon.data.json`** — 5 test case, gồm **2 positive (200)** + **3 negative (400/400/404)**, phủ được EP, BVA và business rule.

Các cột điều khiển trong data file:

| Cột | Vai trò |
|---|---|
| `tc_id`, `title`, `partition` | Truy vết test case ↔ iteration, hiện trong tên assertion và Console |
| `code`, `total_amount`, `user_id` | Dữ liệu request |
| `send_code` | Nếu `false` → **bỏ hẳn** field khỏi body (test thiếu field required) |
| `expected_status` | Status kỳ vọng — assertion chính |
| `expected_coupon_id`, `expected_discount_amount`, `expected_final_amount`, `expected_message_contains` | Kỳ vọng nghiệp vụ cho nhánh 200 |
| `expected_error_contains` | Kỳ vọng nội dung message lỗi cho nhánh 4xx (không chỉ check status) |
| `known_bug`, `spec_expected_status`, `spec_note` | Đánh dấu regression lock + ghi lại hành vi đúng theo đặc tả |

### 4.3. Header `X-Student-Id` và assertion tự viết

**Pre-request script** — vừa gắn header bắt buộc, vừa dựng body động (để bỏ được field):

```js
pm.request.headers.upsert({
  key: "X-Student-Id",
  value: pm.environment.get("studentId"),
});

const d = pm.iterationData;
const body = {};
if (d.get("send_code") !== false) body.code = d.get("code");
if (d.get("send_total_amount") !== false) body.total_amount = d.get("total_amount");
if (d.get("send_user_id") !== false) body.user_id = d.get("user_id");
pm.collectionVariables.set("requestBody", JSON.stringify(body));
```

Request body của request là `{{requestBody}}` (raw/JSON), nên cùng **một** request phục vụ được cả 5 iteration có body khác nhau về *cấu trúc*, không chỉ khác về *giá trị*.

**Assertion tự viết** (yêu cầu B4.3 — kiểm tra `Content-Type` **và** response time):

```js
pm.test("[MINI] Response is JSON", function () {
  pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

pm.test("[MINI] Functional: response time < 1000ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

Assertion chứng minh header MSSV thật sự được gửi (phục vụ checkpoint cuối của B4.4):

```js
const studentId = String(pm.environment.get("studentId"));
pm.test(`[MINI] Request carries X-Student-Id = ${studentId}`, function () {
  pm.expect(pm.request.headers.get("X-Student-Id")).to.eql(studentId);
});
console.log(`    X-Student-Id thuc gui: ${pm.request.headers.get("X-Student-Id")}`);
```

Theo guide (*"Tách riêng test có tiền tố Contract:/Functional:"*), assertion được chia 3 tiền tố:

- `Contract:` — JSON Schema + kiểu dữ liệu (`success` boolean, `coupon_id` integer, `additionalProperties: false`).
- `Functional:` — giá trị nghiệp vụ, nội dung message lỗi, response time, chống rò rỉ field.
- `Regression-lock(BUG-xx):` — khoá hành vi sai đã biết.

### 4.4. Chạy Newman

```bash
newman run mini-apply-coupon.postman_collection.json \
  --environment mini-local.postman_environment.json \
  --iteration-data mini-apply-coupon.data.json \
  --reporters cli,json \
  --reporter-json-export mini-newman-report.json
```

Kết quả thật (log đầy đủ ở `newman-cli-output.txt`, báo cáo JSON ở `mini-newman-report.json`):

```
┌─────────────────────────┬─────────────────┬─────────────────┐
│                         │        executed │          failed │
├─────────────────────────┼─────────────────┼─────────────────┤
│              iterations │               5 │               0 │
│                requests │               5 │               0 │
│            test-scripts │               5 │               0 │
│      prerequest-scripts │               5 │               0 │
│              assertions │              49 │               0 │
└─────────────────────────┴─────────────────┴─────────────────┘
total run duration: 155ms
average response time: 6ms [min: 2ms, max: 15ms, s.d.: 4ms]
```

Ví dụ output của iteration 5 (đã lược bớt):

```
Iteration 5/5
↳ POST {{endpointPath}} - {{tc_id}}
  │ '>>> [TC-AC-05] Mã percent 10%: công thức tính discount_amount / final_amount'
  │ '    body gui di: {"code":"SAVE10","total_amount":400000,"user_id":2}'
  POST http://localhost:3000/api/apply-coupon [200 OK, 396B, 1ms]
  ✓  [MINI] TC-AC-05 Regression-lock(BUG-02): status code = 200
  ✓  [MINI] Response is JSON
  ✓  [MINI] Functional: response time < 1000ms
  ✓  [MINI] Request carries X-Student-Id = 23127178
  │ '    X-Student-Id thuc gui: 23127178'
  ✓  [MINI] Contract: body parse duoc thanh JSON object
  ✓  [MINI] TC-AC-05 Contract: success response dung JSON Schema
  ✓  [MINI] TC-AC-05 Contract: success === true
  ✓  [MINI] TC-AC-05 Functional: coupon_id = 1
  ✓  [MINI] TC-AC-05 Regression-lock(BUG-02): discount_amount = -3600000
  ✓  [MINI] TC-AC-05 Regression-lock(BUG-02): final_amount = 4000000
  ✓  [MINI] TC-AC-05 Functional: message chua "Áp dụng thành công"
  │ '    /!\ BUG-02: spec ky vong status 200. Spec: giảm 10% của 400.000 =>
  │  discount_amount=40.000, final_amount=360.000. Implementation tính
  │  total*(1-discount_value) = 400000*(1-10) = -3.600.000 (backend/server.js:399)...'
```

**Checkpoint B4.4** — đối chiếu:

| Yêu cầu | Trạng thái |
|---|---|
| Có đúng 5 iteration | ✅ `iterations: 5` |
| Không có assertion fail | ✅ `assertions: 49 executed / 0 failed`, exit code `0` |
| `mini-newman-report.json` tồn tại | ✅ 113 KB |
| Console cho thấy request có `X-Student-Id` đúng MSSV | ✅ `X-Student-Id thuc gui: 23127178` ở cả 5 iteration, kèm assertion tự động kiểm tra |

### 4.5. Các case cần setup trạng thái (thực thi ngoài Runner)

10 test case còn lại được thực thi bằng `curl` vì phụ thuộc trạng thái DB (không tất định trong data-driven run). Kết quả thật:

```bash
# TC-AC-06 — code rỗng
$ curl -X POST .../api/apply-coupon -d '{"code":"","total_amount":600000,"user_id":2}'
{"error":"Vui lòng nhập mã giảm giá"}                                     [400] ✅ PASS

# TC-AC-07 — biên OFF dưới / trên ngưỡng
$ ... -d '{"code":"BIGBUY","total_amount":499999,...}' -> [400] "chưa đủ giá trị tối thiểu" ✅
$ ... -d '{"code":"BIGBUY","total_amount":500001,...}' -> [200] discount 50000, final 450001 ✅

# TC-AC-08 — coupon hết hạn
$ ... -d '{"code":"EXPIRED","total_amount":600000,...}'
{"error":"Mã giảm giá đã hết hạn"}                                        [400] ✅ PASS

# TC-AC-09 — SQL injection (payload benign)
$ ... -d '{"code":"'"'"' OR 1=1 --","total_amount":600000,...}'
{"error":"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"}              [404] ✅ PASS
# -> không 500, không lộ câu SQL. Truy vết code: server.js:370 dùng
#    prepared statement `WHERE code = ? AND is_active = 1` nên an toàn.
#    (Đối lập với GET /api/products?search= — chỗ đó nối chuỗi trực tiếp và CÓ SQLi.)

# TC-AC-10 — vượt max_uses_per_user (setup: 2 dòng coupon_usage cho VIP100/user 2)
$ ... -d '{"code":"VIP100","total_amount":600000,"user_id":2}'
{"error":"Bạn đã sử dụng mã này 2 lần (đã đạt giới hạn)"}                 [400] ✅ PASS

# TC-AC-11 — IDOR: né giới hạn lượt dùng  (cùng trạng thái setup như trên)
$ ... -d '{"code":"VIP100","total_amount":600000}'            # bỏ user_id
{"success":true,"discount_amount":100000,"final_amount":500000}          [200] ❌ FAIL -> BUG-03
$ ... -d '{"code":"VIP100","total_amount":600000,"user_id":99999}'  # user_id giả
{"success":true,"discount_amount":100000,"final_amount":500000}          [200] ❌ FAIL -> BUG-03

# TC-AC-12 — total_amount âm
$ ... -d '{"code":"BIGBUY","total_amount":-600000,"user_id":2}'
{"error":"Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫ để áp dụng mã này"} [400] -> BUG-04 (Low)
```

Teardown sau khi chạy TC-AC-10/11: `DELETE FROM coupon_usage` để DB trở lại trạng thái seed.

---

## 5. Bước 5 — CI/CD

Workflow: **`.github/workflows/newman-api-test.yml`** (bản nộp kèm: `newman-api-test.yml`).

Các bước workflow thực hiện:

1. `actions/checkout@v4` + `actions/setup-node@v4` (Node 20 LTS).
2. `npm install` trong `backend/`.
3. **`node database.js`** — reset + seed DB. Bước này **bắt buộc**: `database.sqlite` được commit trong repo và có thể đã bị thay đổi bởi các bài trước; không reset thì 5 iteration mất tính tất định (ví dụ `coupon_usage` còn dòng cũ sẽ làm iteration 1 fail).
4. Start provider ở background (`nohup node server.js &`) + **poll `/api/products/1` tối đa 30s** thay vì `sleep` cố định.
5. Smoke check chính API dưới kiểm thử.
6. `npm install --global newman` → `newman run ... --iteration-data ... --reporters cli,json`.
7. `if: always()` → parse `mini-newman-report.json`, ghi bảng kết quả vào **GitHub Step Summary**, upload report + server log thành artifact, rồi kill provider.

### C1 — Commit pass

```bash
git checkout -b feature/23127178
git add HW/week09/23127178 .github/workflows/newman-api-test.yml
git commit -m "test(api): add data-driven Newman tests for POST /api/apply-coupon (23127178)"
git push -u origin feature/23127178
```

→ Tab **Actions** → workflow `Newman API tests` → tất cả bước xanh, `assertions: 49 / 0 failed`.
Ảnh: **`ci-pass.png`**

### C2 — Commit fail (có chủ đích)

Sửa `expected_status` của **TC-AC-01** trong `mini-apply-coupon.data.json` từ `200` → `999`:

```diff
   "tc_id": "TC-AC-01",
-  "expected_status": 200,
+  "expected_status": 999,
```

→ Newman exit code khác `0` → job đỏ. Đã kiểm chứng trước tại local, đúng **3 assertion fail** (một lỗi dữ liệu kỳ vọng lan sang 3 assertion, vì `999` không phải `200` nên nhánh assert bị lái sang nhóm "error response"):

```
  #  failure         detail
 1.  AssertionError  [MINI] TC-AC-01 Functional: status code = 999
     iteration: 1    expected response to have status code 999 but got 200
 2.  AssertionError  [MINI] TC-AC-01 Contract: error response dung JSON Schema
     iteration: 1    expected data to satisfy schema but found following errors:
                     data should have required property 'error'
 3.  AssertionError  [MINI] TC-AC-01 Functional: response loi khong tra ve discount/final_amount
     iteration: 1    expected { success: true, coupon_id: 2, …(3) } to not have property 'discount_amount'
```

Ảnh: **`ci-fail.png`**

### C3 — Khôi phục

Sửa `expected_status` về `200`, commit và push lần cuối → pipeline trở lại xanh. Local đã xác nhận: `exit=0`, `49 assertions / 0 failed`.

---

## 6. Bước 6 — Postman features

| Feature | Đã dùng? | Ghi chú |
|---|---|---|
| Collections | **Có** | `mini-apply-coupon.postman_collection.json` (schema v2.1.0), 1 folder `Apply Coupon (Data-driven)` chứa request data-driven. |
| Environment variables | **Có** | `mini-local` giữ `baseUrl` và `studentId=23127178`; tách cấu hình khỏi collection nên chạy được cả local và CI không cần sửa collection. |
| Collection variables | **Có** | `requestBody` (body JSON dựng động trong pre-request) và `endpointPath` (dùng trong cả URL lẫn tên request). |
| Pre-request scripts | **Có** | `upsert` header `X-Student-Id` + dựng body cho phép **bỏ hẳn** field required. |
| Test scripts (assertions) | **Có** | 49 assertion / 5 iteration, chia 3 tiền tố `Contract:` / `Functional:` / `Regression-lock:`, gồm cả `pm.response.to.have.jsonSchema`. |
| Data-driven runs (Collection Runner + data file) | **Có** | 5 iteration từ `mini-apply-coupon.data.json`; mọi giá trị kỳ vọng đọc qua `pm.iterationData.get(...)`. |
| Newman CLI | **Có** | `newman run ... --iteration-data ... --reporters cli,json --reporter-json-export`; cùng một lệnh chạy ở local và trong GitHub Actions. |
| Monitors | Không | Cần Postman Cloud workspace và một provider công khai; SUT chỉ chạy ở `localhost:3000` nên monitor không gọi tới được. Vai trò "chạy định kỳ tự động" đã được GitHub Actions đảm nhiệm. |
| Mock servers | Không | Đề bài yêu cầu kiểm thử **provider thật** (`eshop-sut` backend) và mục đích chính là *phát hiện bug của SUT* — mock server sẽ trả response do mình tự định nghĩa nên không thể tìm ra BUG-01…BUG-04. |
| Workspaces | **Có** | Collection + environment đặt trong một workspace riêng cho bài Mini Exercise, rồi export ra JSON để commit vào repo. |

**7 / 10 feature được sử dụng** — vượt yêu cầu tối thiểu 6 feature.

---

## 7. Tổng hợp bug phát hiện được

| ID | Mức độ | Vị trí | Mô tả | Bằng chứng | TC |
|---|---|---|---|---|---|
| **BUG-01** | Medium | `backend/server.js:379` | Dùng `total_amount > coupon.min_order_amount` thay vì `>=` → đơn hàng **đúng bằng** giá trị tối thiểu bị từ chối (off-by-one tại điểm biên). | `BIGBUY` + `total_amount=500000` → `400 "chưa đủ giá trị tối thiểu 500,000 ₫"`, trong khi `500001` → `200`. | TC-AC-04 |
| **BUG-02** | **High** | `backend/server.js:399`<br>và `:419` | Công thức coupon `percent` sai: `Math.floor(total_amount * (1 - discount_value))`. Với `discount_value = 10` (nghĩa là 10%), `1 - 10 = -9` → `discount_amount` **âm**, và `final_amount = total - (-9×total) = 10×total`. Đúng phải là `total_amount * discount_value / 100`. | `SAVE10` + `400000` → `discount_amount: -3600000`, `final_amount: 4000000` (đúng phải là `40000` / `360000`). Khách hàng bị tính tiền **gấp 10 lần**. | TC-AC-05 |
| **BUG-03** | **High** (security) | `backend/server.js:364`, `:386` | `user_id` được lấy từ **request body** thay vì từ JWT, và toàn bộ nhánh kiểm tra `max_uses_per_user` bị bỏ qua khi `user_id` không được gửi (`if (user_id)`). Hệ quả: giới hạn số lượt dùng mã có thể bị né hoàn toàn — chỉ cần bỏ `user_id` hoặc gửi một `user_id` bất kỳ. | User 2 đã dùng hết 2/2 lượt `VIP100` → `400`. Nhưng cùng mã đó, bỏ `user_id` → `200 discount 100000`; gửi `user_id: 99999` (không tồn tại) → `200`. | TC-AC-11 |
| **BUG-04** | Low | `backend/server.js:363-441` | Không validate `total_amount`: giá trị âm, thiếu hẳn field, hay sai kiểu (string) đều rơi vào nhánh "chưa đủ giá trị tối thiểu" → message lỗi gây nhầm lẫn, che mất lỗi thật của client. | `total_amount = -600000` → `400 "chưa đủ giá trị tối thiểu"`; thiếu `total_amount` → cùng message; `total_amount = "600000"` (string) → `200` (bị coerce ngầm). | TC-AC-12 |

Ghi chú tích cực: `POST /api/apply-coupon` **không** có SQL injection (`server.js:370` dùng prepared statement `WHERE code = ? AND is_active = 1`) — khác với `GET /api/products?search=` (`server.js:144`) nối chuỗi trực tiếp vào câu SQL.

---

## 8. Thành phần bài nộp

Tệp nộp: **`23127178_Mini_API_Testing.zip`**

| # | Tệp | Nội dung |
|---|---|---|
| 1 | `test-design.md` | Tài liệu này — prompt, AI output, bảng audit, test case tự bổ sung, bảng Postman features, tổng hợp bug. |
| 2 | `mini-apply-coupon.data.json` | Tệp dữ liệu kiểm thử, 5 test case (2 positive + 3 negative). |
| 3 | `mini-apply-coupon.postman_collection.json` | Postman Collection (pre-request script + 49 assertion). |
| 4 | `mini-local.postman_environment.json` | Environment: `baseUrl`, `studentId`. |
| 5 | `mini-newman-report.json` | Báo cáo Newman JSON — 5 iteration, 49 assertion, 0 fail. |
| 6 | `newman-api-test.yml` | Workflow CI/CD (bản trong repo: `.github/workflows/newman-api-test.yml`). |
| 7 | `ci-pass.png`, `ci-fail.png` | Ảnh pipeline pass và fail trên GitHub Actions. |
| + | `newman-cli-output.txt` | Log CLI đầy đủ của lần chạy Newman thành công (bổ sung, không bắt buộc). |

---

## 9. Tài liệu tham khảo

- Newman command-line options — https://github.com/postmanlabs/newman#command-line-options
- Postman Sandbox API Reference — https://learning.postman.com/docs/writing-scripts/script-references/postman-sandbox-api-reference/
- Postman Data-driven Testing — https://learning.postman.com/docs/sending-requests/runner/running-multiple-iterations/
- Newman CLI Integration — https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/
- GitHub Actions — https://docs.github.com/en/actions · `actions/setup-node` — https://github.com/actions/setup-node
