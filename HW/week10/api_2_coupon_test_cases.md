# KỊCH BẢN THIẾT KẾ KIỂM THỬ TỰ ĐỘNG (TEST DESIGN & TEST CASES)

## API 2: Áp dụng Mã Giảm Giá (`POST /api/apply-coupon`)

---

## 1. MỤC TIÊU VÀ ĐẶC TẢ NGHIỆP VỤ (SPECIFICATION)
- **Tên chức năng:** Áp dụng mã giảm giá tại bước thanh toán (FR-09 Coupon).
- **Endpoint:** `POST /api/apply-coupon`
- **Định dạng dữ liệu:** `Content-Type: application/json` (Quy định tại Mục 5.1 `api_specification.md`).
- **Request Body (JSON):**
  ```json
  {
    "code": "SAVE10",
    "total_amount": 500000,
    "user_id": 1
  }
  ```
- **5 Ràng buộc nghiệp vụ bắt buộc:**
  * **C1 (Tồn tại & Active):** Mã tồn tại trong CSDL và `is_active = 1`.
  * **C2 (Hạn dùng):** `expired_at >= CURRENT_TIMESTAMP`.
  * **C3 (Ngưỡng tối thiểu):** `total_amount >= min_order_amount`.
  * **C4 (Định danh người dùng):** `user_id` hợp lệ đang tồn tại trong hệ thống.
  * **C5 (Lượt dùng tối đa):** `usage_count < max_uses_per_user` (tính riêng theo từng `user_id`).
  * **Công thức giảm:** 
    * Nếu `type == 'percent'`: `discount_amount = Math.floor(total_amount * discount_value / 100)`.
    * Nếu `type == 'fixed'`: `discount_amount = discount_value`.
    * `final_amount = Math.max(0, total_amount - discount_amount)`.

---

## 2. PHÂN TÍCH TEST DESIGN CHI TIẾT (CHI TIẾT KỸ THUẬT)

### 2.1. Phân vùng Tương đương (Domain / Equivalence Partitioning Classes)
Phân tích miền giá trị của các trường trong Request Body (`code`, `total_amount`, `user_id`) thành các lớp tương đương:

| Tham số | Mã Lớp (Class ID) | Tên Phân Vùng Tương Đương | Điều kiện / Giá trị đại diện | Kỳ vọng theo Đặc tả |
| :--- | :---: | :--- | :--- | :---: |
| **`code`** | **V_CD_01** | Mã giảm giá phần trăm hợp lệ đang active | `"SAVE10"` (10%, min 300k, còn hạn) | 200 OK |
| | **V_CD_02** | Mã giảm giá cố định hợp lệ đang active | `"BIGBUY"` (50k, min 500k, còn hạn) | 200 OK |
| | **IV_CD_01** | Mã không tồn tại trong hệ thống | `"NOT_EXIST_CODE_999"` | 404 Not Found |
| | **IV_CD_02** | Mã đã hết hạn sử dụng | `"EXPIRED"` (`expired_at = 2020-01-01`) | 400 Bad Request |
| | **IV_CD_03** | Mã đã bị Admin vô hiệu hóa (`is_active = 0`) | `"DISABLED_COUPON"` | 404 Not Found |
| | **IV_CD_04** | Chuỗi rỗng | `""` | 400 Bad Request |
| | **IV_CD_05** | Thiếu trường `code` trong payload | Payload không có `code` | 400 Bad Request |
| | **IV_CD_06** | Kiểu dữ liệu không phải string | `123456`, `true`, `["SAVE10"]` | 400 Bad Request |
| **`total_amount`** | **V_AMT_01** | Tổng tiền >= giá trị tối thiểu của mã | `500000` (đối với mã min 300k) | 200 OK |
| | **IV_AMT_01** | Tổng tiền < giá trị tối thiểu của mã | `200000` (đối với mã min 300k) | 400 Bad Request |
| | **IV_AMT_02** | Tổng tiền bằng 0 | `0` | 400 Bad Request |
| | **IV_AMT_03** | Tổng tiền là số âm | `-50000` | 400 Bad Request |
| | **IV_AMT_04** | Tổng tiền dạng chuỗi không parse được | `"five_hundred_k"` | 400 Bad Request |
| | **IV_AMT_05** | Thiếu trường `total_amount` | Payload không có `total_amount` | 400 Bad Request |
| **`user_id`** | **V_UID_01** | User ID nguyên dương hợp lệ tồn tại trong DB | `1`, `2` | 200 OK |
| | **IV_UID_01** | User ID không tồn tại trong hệ thống | `999999` | 404 Not Found / 400 |
| | **IV_UID_02** | User ID là số âm hoặc bằng 0 | `-1`, `0` | 400 Bad Request |
| | **IV_UID_03** | User ID sai kiểu dữ liệu (chuỗi/bool) | `"user_admin"`, `true` | 400 Bad Request |
| | **IV_UID_04** | Thiếu trường `user_id` trong payload | Payload không có `user_id` | 400 Bad Request |

---

### 2.2. Phân tích Giá trị Biên (Boundary Value Analysis - BVA)

#### A. Bảng Giá Trị Biên Cụ Thể (Dựa trên Thuộc Tính Động của Từng Mã Trong CSDL)
*Lưu ý: Các ngưỡng kiểm tra dưới đây là **thuộc tính động của từng bản ghi coupon trong CSDL** (không phải hằng số cố định toàn cục của hệ thống). Để thiết kế test case cụ thể, ta chọn các mã giảm giá mẫu trong [README.md](file:///d:/group05_eshop/README.md) làm dữ liệu kiểm thử đại diện:*
1. **Ngưỡng đơn hàng tối thiểu (`coupon.min_order_amount`):** Chọn mã mẫu `SAVE10` có `min_order_amount = 300,000 ₫` làm đại diện.
2. **Ngưỡng số lượt sử dụng tối đa (`coupon.max_uses_per_user`):** Chọn mã mẫu `VIP100` có `max_uses_per_user = 2` làm đại diện.
3. **Ngưỡng tiền giảm cố định (`coupon.discount_value`):** Chọn mã mẫu `BIGBUY` có `discount_value = 50,000 ₫` làm đại diện.

| Tham số & Ràng buộc nghiệp vụ | Điểm Biên | Kỹ thuật BVA | Giá trị kiểm thử cụ thể | Mã test tương ứng | Kỳ vọng theo Đặc tả |
| :--- | :---: | :---: | :--- | :---: | :--- |
| **Total Amount vs Min Order**<br>*(Đại diện mã `SAVE10` min = 300k)* | 299,999 ₫ | **3-point BVA (Min - 1)** | `{"code": "SAVE10", "total_amount": 299999, "user_id": 1}` | `TC_CPN_BVA_01` | `400 Bad Request` |
| | 300,000 ₫ | **3-point BVA (Min)** | `{"code": "SAVE10", "total_amount": 300000, "user_id": 1}` | `TC_CPN_BVA_02` | `200 OK` (Giảm 30,000 ₫) |
| | 300,001 ₫ | **3-point BVA (Min + 1)** | `{"code": "SAVE10", "total_amount": 300001, "user_id": 1}` | `TC_CPN_BVA_03` | `200 OK` (Giảm 30,000 ₫) |
| **Usage Count vs Max Uses**<br>*(Đại diện mã `VIP100` max = 2 lượt)* | 1 lượt | **3-point BVA (Max - 1)** | Đã dùng 1 lần, áp dụng lần 2 (`usage_count = 1`) | `TC_CPN_BVA_07` | `200 OK` (Áp dụng lần 2 thành công, giảm 100k) |
| | 2 lượt | **3-point BVA (Max)** | Đã dùng 2 lần, thử áp dụng lần 3 (`usage_count = 2`) | `TC_CPN_BVA_08` | `400 Bad Request` (Báo lỗi hết lượt dùng) |
| | 3 lượt | **3-point BVA (Max + 1)** | Đã dùng 3 lần, thử áp dụng lần 4 (`usage_count = 3`) | `TC_CPN_BVA_09` | `400 Bad Request` (Báo lỗi hết lượt dùng) |
| **Discount vs Total Amount**<br>*(Đại diện mã `BIGBUY` fixed = 50k)* | 49,999 ₫ | **3-point BVA (Total < Fixed)** | Đơn 49,999 ₫ áp dụng voucher 50k | `TC_CPN_BVA_04` | `final_amount = 0` (Chặn âm) |
| | 50,000 ₫ | **3-point BVA (Total == Fixed)** | Đơn 50,000 ₫ áp dụng voucher 50k | `TC_CPN_BVA_05` | `final_amount = 0` |
| | 50,001 ₫ | **3-point BVA (Total > Fixed)** | Đơn 50,001 ₫ áp dụng voucher 50k | `TC_CPN_BVA_06` | `final_amount = 1 ₫` |

#### B. Lý do Lựa chọn Phương pháp 3-point BVA:
1. **Tại sao BẮT BUỘC chọn 3-point BVA cho `coupon.min_order_amount`:**
   - Trong bài toán giảm giá thương mại điện tử, lỗi toán tử quan hệ giữa `>` và `>=` là lỗi kinh điển phổ biến nhất. Nếu chỉ kiểm tra 2 điểm ({299999, 300001}), ta sẽ **hoàn toàn bỏ lọt lỗi** khi lập trình viên viết nhầm `total_amount > min_order_amount` thay vì `total_amount >= min_order_amount`. 
   - Kiểm tra đầy đủ bộ ba {299999, 300000, 300001} chứng minh trực tiếp rằng hệ thống tại `backend/server.js:379` bị dính lỗi **BUG-CPN-01 (Off-by-one Error)** vì từ chối đơn hàng có giá trị đúng 300,000 ₫!
2. **Tại sao chọn 3-point BVA cho hạn mức lượt dùng (`coupon.max_uses_per_user`):**
   - Giúp xác định chính xác hành vi của hệ thống tại điểm chuyển giao giữa trạng thái "Còn lượt" (`usage_count = 1 < 2`) và "Hết lượt" (`usage_count >= 2`), ngăn chặn nguy cơ người dùng lạm dụng voucher nhiều lần do lỗi điều kiện `<= vs <`.
3. **Tại sao chọn 3-point BVA cho tương quan tiền giảm cố định vs tổng tiền (`<`, `=`, `>`):**
   - Kiểm thử toàn diện cả 3 kịch bản: `Total < Fixed` (đảm bảo không bị âm tiền), `Total == Fixed` (tiền bằng 0) và `Total > Fixed` (tiền thanh toán dương).

---

## 3. DANH SÁCH BỘ TEST CASES CHI TIẾT (>= 35 CASES)

### Nhóm A: Domain & BVA Test Cases (26 TCs)

| TC ID | Miền kiểm thử (Target Class / BVA) | Input Request Body | Expected Status | Expected Output & Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_CPN_DOM_01` | **`V_CD_01` & `V_AMT_01` & `V_UID_01`** (Mã % SAVE10 hợp lệ) | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` | `200 OK` | `discount_amount = 50000, final_amount = 450000` |
| `TC_CPN_DOM_02` | **`V_CD_02` & `V_AMT_01` & `V_UID_01`** (Mã cố định BIGBUY hợp lệ) | `{"code": "BIGBUY", "total_amount": 800000, "user_id": 1}` | `200 OK` | `discount_amount = 50000, final_amount = 750000` |
| `TC_CPN_DOM_03` | **`IV_CD_01`** (Mã không tồn tại trong hệ thống) | `{"code": "NON_EXISTENT_999", "total_amount": 500000, "user_id": 1}` | `404 Not Found` | Báo lỗi mã không tồn tại |
| `TC_CPN_DOM_04` | **`IV_CD_02`** (Mã đã hết hạn sử dụng) | `{"code": "EXPIRED", "total_amount": 500000, "user_id": 1}` | `400 Bad Request` | Báo lỗi mã giảm giá đã hết hạn |
| `TC_CPN_DOM_05` | **`IV_CD_03`** (Mã bị vô hiệu hóa is_active = 0) | `{"code": "DISABLED_COUPON", "total_amount": 500000, "user_id": 1}` | `404 Not Found` | Báo lỗi mã giảm giá bị vô hiệu hóa |
| `TC_CPN_DOM_06` | **`IV_CD_04`** (Mã là chuỗi rỗng `""`) | `{"code": "", "total_amount": 500000, "user_id": 1}` | `400 Bad Request` | Báo lỗi mã giảm giá không được để trống |
| `TC_CPN_DOM_07` | **`IV_CD_05`** (Thiếu trường `code`) | `{"total_amount": 500000, "user_id": 1}` | `400 Bad Request` | Báo lỗi thiếu trường mã giảm giá |
| `TC_CPN_DOM_08` | **`IV_CD_06`** (Kiểu dữ liệu `code` sai - Number) | `{"code": 123456, "total_amount": 500000, "user_id": 1}` | `400 Bad Request` | Báo lỗi kiểu dữ liệu mã sai |
| `TC_CPN_DOM_09` | **`IV_AMT_01`** (Tổng tiền < min_order_amount 300k) | `{"code": "SAVE10", "total_amount": 200000, "user_id": 1}` | `400 Bad Request` | Báo lỗi chưa đạt giá trị đơn hàng tối thiểu |
| `TC_CPN_DOM_10` | **`IV_AMT_02`** (Tổng tiền bằng 0) | `{"code": "SAVE10", "total_amount": 0, "user_id": 1}` | `400 Bad Request` | Báo lỗi giá trị đơn hàng không hợp lệ |
| `TC_CPN_DOM_11` | **`IV_AMT_03`** (Tổng tiền là số âm) | `{"code": "SAVE10", "total_amount": -100000, "user_id": 1}` | `400 Bad Request` | Báo lỗi giá trị đơn hàng không được âm |
| `TC_CPN_DOM_12` | **`IV_AMT_04`** (Tổng tiền dạng chuỗi không parse được) | `{"code": "SAVE10", "total_amount": "five_hundred_k", "user_id": 1}` | `400 Bad Request` | Báo lỗi kiểu dữ liệu tổng tiền sai |
| `TC_CPN_DOM_13` | **`IV_AMT_05`** (Thiếu trường `total_amount`) | `{"code": "SAVE10", "user_id": 1}` | `400 Bad Request` | Báo lỗi thiếu trường tổng tiền |
| `TC_CPN_DOM_14` | **`IV_UID_01`** (User ID không tồn tại trong hệ thống) | `{"code": "SAVE10", "total_amount": 500000, "user_id": 999999}` | `404 Not Found` / `400` | Báo lỗi người dùng không tồn tại |
| `TC_CPN_DOM_15` | **`IV_UID_02`** (User ID là số âm hoặc bằng 0) | `{"code": "SAVE10", "total_amount": 500000, "user_id": -1}` | `400 Bad Request` | Báo lỗi ID người dùng không hợp lệ |
| `TC_CPN_DOM_16` | **`IV_UID_03`** (User ID sai kiểu dữ liệu - String) | `{"code": "SAVE10", "total_amount": 500000, "user_id": "user_one"}` | `400 Bad Request` | Báo lỗi kiểu dữ liệu user_id sai |
| `TC_CPN_DOM_17` | **`IV_UID_04`** (Thiếu trường `user_id` trong body) | `{"code": "SAVE10", "total_amount": 500000}` | `400 Bad Request` | Báo lỗi thiếu trường user_id |
| `TC_CPN_BVA_01` | **3-point BVA: Min - 1 (299,999 ₫)** | `{"code": "SAVE10", "total_amount": 299999, "user_id": 1}` | `400 Bad Request` | Báo lỗi chưa đủ giá trị tối thiểu 300k |
| `TC_CPN_BVA_02` | **3-point BVA: Min (300,000 ₫)** | `{"code": "SAVE10", "total_amount": 300000, "user_id": 1}` | `200 OK` | Áp dụng thành công, giảm 30k (còn 270k) |
| `TC_CPN_BVA_03` | **3-point BVA: Min + 1 (300,001 ₫)** | `{"code": "SAVE10", "total_amount": 300001, "user_id": 1}` | `200 OK` | Áp dụng thành công, giảm 30k |
| `TC_CPN_BVA_04` | **3-point BVA: Total < Fixed Discount (49,999 ₫)** | `{"code": "BIGBUY", "total_amount": 49999, "user_id": 1}` | `200 OK` / `400` | `final_amount = 0` *(chặn âm, phát hiện **`BUG-CPN-05`**)* |
| `TC_CPN_BVA_05` | **3-point BVA: Total == Fixed Discount (50,000 ₫)** | `{"code": "BIGBUY", "total_amount": 50000, "user_id": 1}` | `200 OK` | `discount_amount = 50000, final_amount = 0` |
| `TC_CPN_BVA_06` | **3-point BVA: Total > Fixed Discount (50,001 ₫)** | `{"code": "BIGBUY", "total_amount": 50001, "user_id": 1}` | `200 OK` | `discount_amount = 50000, final_amount = 1 ₫` |
| `TC_CPN_BVA_07` | **3-point BVA: Max Uses - 1 (VIP100 dùng lần 2)** | `{"code": "VIP100", "total_amount": 500000, "user_id": 1}` *(Đã dùng 1 lần, áp dụng lần 2)* | `200 OK` | `discount_amount = 100000, final_amount = 400000` |
| `TC_CPN_BVA_08` | **3-point BVA: Max Uses (VIP100 thử dùng lần 3)** | `{"code": "VIP100", "total_amount": 500000, "user_id": 1}` *(Đã dùng 2 lần, thử dùng lần 3)* | `400 Bad Request` | Báo lỗi đã sử dụng hết số lần cho phép (2/2) |
| `TC_CPN_BVA_09` | **3-point BVA: Max Uses + 1 (VIP100 thử dùng lần 4)** | `{"code": "VIP100", "total_amount": 500000, "user_id": 1}` *(Đã dùng 3 lần, thử dùng lần 4)* | `400 Bad Request` | Báo lỗi đã sử dụng hết số lần cho phép |

### Nhóm B: Security Test Cases (`SEC-01` đến `SEC-07`) — 7 TCs

| TC ID | Mục tiêu bảo mật | Payload & Header kiểm thử | Expected Status | Tiêu chí bảo mật & Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_CPN_SEC_01` | **SEC-02 (Missing Auth Token)** | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` *(Không gửi Header `Authorization`)* | `401 Unauthorized` | Chặn truy cập từ khách chưa đăng nhập theo README.md C4 *(Phát hiện **`BUG-CPN-03`** khi server trả `200`)* |
| `TC_CPN_SEC_02` | **SEC-01 (Invalid JWT Token)** | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` *(Header `Authorization: Bearer invalid_jwt`)* | `401 Unauthorized` | Từ chối token giả mạo hoặc hết hạn |
| `TC_CPN_SEC_03` | **SEC-04 (SQLi in Code)** | `{"code": "SAVE10' OR '1'='1", "total_amount": 500000, "user_id": 1}` | `404` / `400` | Sử dụng tham số hóa, không dính SQLi |
| `TC_CPN_SEC_04` | **SEC-04 (SQLi in user_id)** | `{"code": "SAVE10", "total_amount": 500000, "user_id": "1 OR 1=1"}` | `400 Bad Request` | Ép kiểu số nguyên, chặn SQLi qua user_id |
| `TC_CPN_SEC_05` | **SEC-05 (XSS in Code)** | `{"code": "<script>alert(1)</script>", "total_amount": 500000, "user_id": 1}` | `404 Not Found` | Xử lý an toàn chuỗi script XSS |
| `TC_CPN_SEC_06` | **SEC-06 (IDOR / Bypass Quota)** | `{"code": "SAVE10", "total_amount": 500000, "user_id": 999}` *(Thay đổi `user_id` để dùng lại mã đã hết)* | `403` / `400` | Kiểm tra tính chính danh của user_id *(Phát hiện **`BUG-CPN-04`**)* |
| `TC_CPN_SEC_07` | **SEC-07 (Parameter Pollution)** | `code=SAVE10&code=EXPIRED&total_amount=500000&user_id=1` | `400 Bad Request` | Xử lý an toàn không bị nhầm lẫn tham số |

### Nhóm C: Schema & Response Validation (5 TCs)

| TC ID | Kịch bản Schema | Payload kiểm thử (Request Body) | Expected Status | JSON Schema Assertion |
| :--- | :--- | :--- | :---: | :--- |
| `TC_CPN_SCH_01` | Success Response Shape | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` | `200 OK` | Schema có `success` (bool), `coupon_id` (int), `discount_amount` (num), `final_amount` (num), `message` (str) |
| `TC_CPN_SCH_02` | Error 400 Shape | `{"code": "SAVE10", "total_amount": 200000, "user_id": 1}` | `400 Bad Request` | Format JSON `{"error": "string"}` |
| `TC_CPN_SCH_03` | Error 404 Shape | `{"code": "NON_EXISTENT", "total_amount": 500000, "user_id": 1}` | `404 Not Found` | Format JSON `{"error": "string"}` |
| `TC_CPN_SCH_04` | Header Content-Type | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` | `200 OK` | Header `Content-Type: application/json` |
| `TC_CPN_SCH_05` | Numeric Types | `{"code": "SAVE10", "total_amount": 500000, "user_id": 1}` | `200 OK` | `discount_amount` và `final_amount` là số nguyên dương >= 0 |

---

## 4. AUDIT & HUMAN REVIEW

| Test Case ID / Nhóm | Nhãn Đánh Giá | Nhận định của Con Người đối chiếu theo Đặc tả (api_specification.md & README.md) | Hành động hiệu chỉnh (Human Correction) |
| :--- | :---: | :--- | :--- |
| `TC_CPN_DOM_01` - `02` | **VALID** | Thiết kế chính xác theo đặc tả FR-09: Giảm 10% cho `SAVE10`, giảm 50k cho `BIGBUY`. | Giữ nguyên trong test suite. Khi chạy phát hiện backend bị bug công thức tính % (**`BUG-CPN-02`**). |
| `TC_CPN_DOM_03` - `17` | **VALID** | Thiết kế đúng chuẩn REST API theo `api_specification.md` mục 5.1: Mã không tồn tại/tắt trả `404`, thiếu/sai `user_id`, `code` hoặc `total_amount` trả `400 Bad Request`. | Đưa vào kịch bản kiểm thử tự động. |
| `TC_CPN_BVA_01` - `03` | **VALID** | Thiết kế đúng 3-point BVA cho ngưỡng đơn hàng tối thiểu `min_order_amount = 300,000 ₫` ({299999, 300000, 300001}). | Giữ nguyên test case. Khi chạy phát hiện backend dùng sai toán tử `>` thay vì `>=` (**`BUG-CPN-01`**). |
| `TC_CPN_SEC_01` | **VALID** | Thiết kế chuẩn theo yêu cầu xác thực tại `README.md` (FR-09 Điều kiện C4): Bắt buộc kiểm tra JWT Token để chặn truy cập ẩn danh (`401 Unauthorized`). | Giữ nguyên test case. Khi chạy phát hiện backend thiếu middleware `authenticateToken` (**`BUG-CPN-03`**). |
| `TC_CPN_SEC_02` - `07` | **VALID** | Thiết kế chuẩn bảo mật OWASP: Chống SQLi, XSS, Parameter Pollution và chống IDOR thay đổi `user_id` để bypass lượt dùng. | Giữ nguyên test suite. Khi chạy phát hiện backend dính lỗ hổng IDOR (**`BUG-CPN-04`**). |
| `TC_CPN_SCH_01` - `05` | **VALID** | Thiết kế đúng chuẩn Schema JSON, kiểm tra đủ các trường `success`, `discount_amount`, `final_amount`, `message`. | Đưa vào kịch bản kiểm thử tự động. |
| *BVA Extreme Boundaries (1 tỷ ₫ / Float 0.5 do AI tự sinh)* | **INVALID** | AI tự suy diễn các giá trị cực trị trần 1,000,000,000 ₫ và số thập phân lẻ 0.5 không hề có trong đặc tả `api_specification.md` hay `README.md`. | **Loại bỏ hoàn toàn** các ca kiểm thử giả định vô căn cứ này khỏi bộ test design. |
| *State Transition Model cho Coupon API do AI tự sinh* | **INVALID** | AI tự vẽ sơ đồ và lập ma trận chuyển trạng thái không cần thiết cho endpoint stateless chỉ kiểm tra điều kiện (Accept/Reject). | **Loại bỏ hoàn toàn** phần State Transition để tài liệu gọn gàng, đúng trọng tâm. |
| `TC_CPN_BVA_04` - `06` | **INCOMPLETE** | AI ban đầu bỏ sót trường hợp mã giảm giá cố định lớn hơn tổng tiền đơn hàng, khiến `final_amount` bị âm. | **Bổ sung trọn bộ 3 test cases biên BVA** (`<`, `=`, `>`) và ghi nhận lỗi backend tại `server.js:406` (**`BUG-CPN-05`**). |
| `TC_CPN_BVA_07` - `09` | **INCOMPLETE** | AI ban đầu chưa kiểm thử biên BVA đa điểm cho giới hạn lượt sử dụng `max_uses_per_user`. | **Bổ sung trọn bộ 3 test cases biên BVA** sử dụng mã `VIP100` (`max = 2`) kiểm thử ranh giới {1, 2, 3 lượt}. |

---

## 5. MỞ RỘNG TEST CASES (HUMAN EXTENSION — 5 TCs)

| TC ID | Kỹ thuật & Tên Test Case | Mô tả & Dữ liệu Request | Lý do AI bỏ sót (Root Cause Analysis) |
| :--- | :--- | :--- | :--- |
| `TC_CPN_EXT_01` | **Race Condition / Concurrency** | Gửi đồng thời 10 requests cùng 1ms với mã max 1 lượt (`SAVE10`) | AI chỉ tư duy đơn luồng, bỏ sót nguy cơ bất đồng bộ DB khi không có Transaction lock. |
| `TC_CPN_EXT_02` | **Float Precision Rounding** | Gửi `total_amount = 333333.33` với coupon 33% (kiểm tra làm tròn số) | AI chỉ test số nguyên tròn trăm, bỏ qua sai số dấu phẩy động trong thanh toán. |
| `TC_CPN_EXT_03` | **Negative Discount Injection** | Giả lập hacker gửi mã có giá trị giảm âm để tăng tiền đơn hàng | AI chỉ test dữ liệu chuẩn, không lường trước can thiệp trái phép CSDL. |
| `TC_CPN_EXT_04` | **Timezone Mismatch at 23:59:59** | Kiểm tra áp dụng mã tại giây cuối cùng của ngày hết hạn so với GMT+7 | AI không chú ý vấn đề sai lệch múi giờ khi so sánh `new Date()`. |
| `TC_CPN_EXT_05` | **Coupon with Shipping Fee** | Kiểm tra giảm giá áp dụng trên tổng giá trị hàng hay cả tiền ship | AI chỉ nhìn cục bộ endpoint đơn lẻ, không liên kết luồng thanh toán tổng thể. |

**TỔNG CỘNG TEST CASES API 2:** **43 Test Cases** (AI: 38, Human Extend: 5).
