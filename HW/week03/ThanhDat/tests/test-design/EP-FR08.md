# EP-FR08 — Domain Testing (Equivalence Class Partitioning): Checkout

**Feature:** FR-08 — Checkout · **Module:** `CHECKOUT`
**Kỹ thuật:** ISTQB FL §4.2.1 Equivalence Partitioning (single-fault assumption; phủ valid & invalid)
**File liên quan:** [BVA-FR08.md](BVA-FR08.md) · [bug-report_CHECKOUT.md](../bug-reports/bug-report_CHECKOUT.md)

## 0. Mô tả & nguồn tham chiếu

- **Chức năng:** Đặt hàng từ giỏ: tạo đơn với tổng tiền + địa chỉ. Yêu cầu JWT. Trước checkout có thể áp mã giảm giá qua `/api/apply-coupon`.
- **Endpoint:** `POST /api/checkout` body `{ total_amount, shipping_address }` (yêu cầu JWT); `POST /api/apply-coupon` body `{ code, total_amount, user_id }` (KHÔNG yêu cầu JWT).
- **Nguồn đã đọc:**
  - api_specification.md §4.3.
  - backend/server.js:297-309: `POST /api/checkout` không validate `total_amount`/`shipping_address`; INSERT thẳng vào DB.
  - backend/server.js:363-441: `POST /api/apply-coupon`: điều kiện `total_amount > min_order_amount` (off-by-one); công thức percent sai.
  - backend/database.js:74-81, 105-111: schema `orders`; seed coupon SAVE10/BIGBUY/VIP100/EXPIRED.
- **Môi trường test:** Chrome / Windows 11 25H2.

> ⚠️ **Điểm nghi vấn trong code:**
> 1. `apply-coupon` dùng `>` thay vì `>=` (server.js:379) → đơn đúng ngưỡng bị từ chối (off-by-one).
> 2. Công thức percent server.js:399: `Math.floor(total*(1-discount_value))` với `discount_value=10` → `total*(-9)` → discount âm khổng lồ → `final > total`.
> 3. `POST /api/checkout` không validate `total_amount` (0, âm, chuỗi) và `shipping_address` (rỗng/null).
> 4. `apply-coupon` không có `authenticateToken` → caller ẩn danh bỏ `user_id` để bỏ qua `max_uses_per_user`.

## 1. Các bước áp dụng (step-by-step)

1. **Liệt kê biến:** `POST /api/checkout`: `total_amount`, `shipping_address`, JWT `token`. `POST /api/apply-coupon`: `code`, `total_amount` (so với `min_order_amount`), `user_id`.
2. **Miền & ràng buộc (từ code):** `total_amount` (checkout) không constraint tại server; `shipping_address` TEXT tự do; JWT bắt buộc (middleware); `code` phải tồn tại, active, chưa hết hạn, chưa vượt `max_uses_per_user`; `total_amount` (coupon) so bằng `>` (off-by-one).
3. **Phát hiện thêm:** `apply-coupon` không cần JWT; bỏ `user_id` → bỏ qua kiểm `max_uses`. Công thức percent sai (`1 - discount_value` thay vì `discount_value/100`).
4. **Phân vùng tương đương:** xem §2 (17 lớp).
5. **Chọn đại diện:** mỗi lớp 1 giá trị điển hình.
6. **Thiết kế TC:** single-fault; test qua Postman (direct API).

## 2. Bảng phân tích Equivalence Classes

| Biến                      | Lớp (EC)   | Loại    | Mô tả lớp                                            | Giá trị đại diện               |
| ------------------------- | ---------- | ------- | ---------------------------------------------------- | ------------------------------ |
| `total_amount` (checkout) | EC-TOTAL-1 | Valid   | Số nguyên dương                                      | `400000`                       |
| `total_amount` (checkout) | EC-TOTAL-2 | Invalid | Bằng 0                                               | `0`                            |
| `total_amount` (checkout) | EC-TOTAL-3 | Invalid | Âm                                                   | `-50000`                       |
| `total_amount` (checkout) | EC-TOTAL-4 | Invalid | Chuỗi không phải số                                  | `"abc"`                        |
| `total_amount` (checkout) | EC-TOTAL-5 | Invalid | Thiếu field → INSERT NULL                            | _(không gửi field)_            |
| `shipping_address`        | EC-SADDR-1 | Valid   | Địa chỉ không rỗng                                   | `123 Le Loi, Q1, TP.HCM`       |
| `shipping_address`        | EC-SADDR-2 | Invalid | Rỗng `""`                                            | `""`                           |
| `shipping_address`        | EC-SADDR-3 | Invalid | Thiếu field → INSERT NULL                            | _(không gửi field)_            |
| JWT `token` (checkout)    | EC-AUTH-1  | Valid   | Token hợp lệ                                         | JWT sau khi login              |
| JWT `token` (checkout)    | EC-AUTH-2  | Invalid | Thiếu Authorization header                           | _(không gửi header)_           |
| `code` (apply-coupon)     | EC-CODE-1  | Valid   | Mã tồn tại, active, chưa hết hạn, chưa hết lượt      | `SAVE10`                       |
| `code` (apply-coupon)     | EC-CODE-2  | Invalid | Rỗng / thiếu                                         | `""`                           |
| `code` (apply-coupon)     | EC-CODE-3  | Invalid | Mã không tồn tại                                     | `FAKE999`                      |
| `code` (apply-coupon)     | EC-CODE-4  | Invalid | Mã hết hạn (`expired_at` < now)                      | `EXPIRED`                      |
| `code` (apply-coupon)     | EC-CODE-5  | Invalid | Mã đã dùng hết `max_uses_per_user` (SAVE10, max=1)   | `SAVE10` (sau khi đã áp 1 lần) |
| `total_amount` (coupon)   | EC-CAMP-1  | Valid   | `total > min_order_amount`                           | `400000` > 300000 (SAVE10)     |
| `total_amount` (coupon)   | EC-CAMP-2  | Invalid | `total < min_order_amount`                           | `200000` < 300000 (SAVE10)     |

> _EC-CODE-1:_ `SAVE10` (percent, discount_value=10). Khi áp sẽ lộ BUG-B-02: `final_amount > total_amount`.

## 3. Test cases — Domain Testing

| TC ID           | Mô tả                                              | Phủ EC                            | Test data (Body JSON)                                                    | Expected result                                                                             | Status |
| --------------- | -------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ------ |
| TC-CHECKOUT-001 | Checkout hợp lệ (happy path)                       | EC-TOTAL-1, EC-SADDR-1, EC-AUTH-1 | `{"total_amount":400000,"shipping_address":"123 Le Loi, Q1, TP.HCM"}`    | 200 `{"message":"Checkout successful","orderId":<id>}`; đơn mới `status=pending`             | PASS   |
| TC-CHECKOUT-002 | total_amount = 0                                   | EC-TOTAL-2                        | `{"total_amount":0,"shipping_address":"123 Le Loi"}`                     | Kỳ vọng 400. Thực tế (BUG-B-03): 200, tạo đơn total=0                                        | FAIL   |
| TC-CHECKOUT-003 | total_amount âm                                    | EC-TOTAL-3                        | `{"total_amount":-50000,"shipping_address":"123 Le Loi"}`               | Kỳ vọng 400. Thực tế (BUG-B-03): 200, tạo đơn total=-50000                                   | FAIL   |
| TC-CHECKOUT-004 | total_amount là chuỗi                              | EC-TOTAL-4                        | `{"total_amount":"abc","shipping_address":"123 Le Loi"}`                | Kỳ vọng 400. Thực tế (BUG-B-03): 200, SQLite lưu 0 (coercion)                                | FAIL   |
| TC-CHECKOUT-005 | Thiếu field total_amount                           | EC-TOTAL-5                        | `{"shipping_address":"123 Le Loi"}`                                     | Kỳ vọng 400. Thực tế (BUG-B-03): 200, đơn total=NULL                                         | FAIL   |
| TC-CHECKOUT-006 | shipping_address rỗng                              | EC-SADDR-2                        | `{"total_amount":400000,"shipping_address":""}`                         | Kỳ vọng 400. Thực tế (BUG-B-03): 200, đơn address=""                                         | FAIL   |
| TC-CHECKOUT-007 | Thiếu field shipping_address                       | EC-SADDR-3                        | `{"total_amount":400000}`                                               | Kỳ vọng 400. Thực tế (BUG-B-03): 200, đơn address=NULL                                       | FAIL   |
| TC-CHECKOUT-008 | Không có Authorization header                      | EC-AUTH-2                         | `{"total_amount":400000,"shipping_address":"123 Le Loi"}` (không header) | 401 `{"error":"Unauthorized"}`                                                              | PASS   |
| TC-CHECKOUT-009 | Áp SAVE10 (percent 10%) — kiểm công thức discount  | EC-CODE-1, EC-CAMP-1              | `{"code":"SAVE10","total_amount":400000,"user_id":2}`                   | Kỳ vọng discount=40000, final=360000. Thực tế (BUG-B-02): discount=-3600000, final=4000000   | FAIL   |
| TC-CHECKOUT-010 | code rỗng                                          | EC-CODE-2                         | `{"code":"","total_amount":400000}`                                     | 400 `{"error":"Vui lòng nhập mã giảm giá"}`                                                 | PASS   |
| TC-CHECKOUT-011 | code không tồn tại                                 | EC-CODE-3                         | `{"code":"FAKE999","total_amount":400000}`                              | 404 `{"error":"Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa"}`                          | PASS   |
| TC-CHECKOUT-012 | code hết hạn (EXPIRED)                              | EC-CODE-4                         | `{"code":"EXPIRED","total_amount":200000}`                              | 400 `{"error":"Mã giảm giá đã hết hạn"}`                                                    | PASS   |
| TC-CHECKOUT-013 | total dưới ngưỡng tối thiểu của coupon             | EC-CAMP-2                         | `{"code":"SAVE10","total_amount":200000}`                               | 400 `{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300.000 ₫..."}`                           | PASS   |
| TC-CHECKOUT-014 | code đã dùng hết lượt (SAVE10 max=1)               | EC-CODE-5                         | `{"code":"SAVE10","total_amount":400000,"user_id":2}` (lần 2)           | 400 `{"error":"Bạn đã sử dụng mã này 1 lần (đã đạt giới hạn)"}`                             | PASS   |

## 4. Truy vết coverage (EC ↔ TC)

| Lớp (EC)   | Phủ bởi TC      | Ghi chú                                          |
| ---------- | --------------- | ------------------------------------------------ |
| EC-TOTAL-1 | TC-CHECKOUT-001 |                                                  |
| EC-TOTAL-2 | TC-CHECKOUT-002 | BUG-B-03                                         |
| EC-TOTAL-3 | TC-CHECKOUT-003 | BUG-B-03                                         |
| EC-TOTAL-4 | TC-CHECKOUT-004 | BUG-B-03; coerce "abc"→0                          |
| EC-TOTAL-5 | TC-CHECKOUT-005 | BUG-B-03; INSERT NULL                            |
| EC-SADDR-1 | TC-CHECKOUT-001 |                                                  |
| EC-SADDR-2 | TC-CHECKOUT-006 | BUG-B-03                                         |
| EC-SADDR-3 | TC-CHECKOUT-007 | BUG-B-03; INSERT NULL                            |
| EC-AUTH-1  | TC-CHECKOUT-001 | Precondition mọi TC checkout                     |
| EC-AUTH-2  | TC-CHECKOUT-008 |                                                  |
| EC-CODE-1  | TC-CHECKOUT-009 | Cũng lộ BUG-B-02                                  |
| EC-CODE-2  | TC-CHECKOUT-010 |                                                  |
| EC-CODE-3  | TC-CHECKOUT-011 |                                                  |
| EC-CODE-4  | TC-CHECKOUT-012 |                                                  |
| EC-CODE-5  | TC-CHECKOUT-014 | Precondition: đã dùng SAVE10 1 lần + ghi usage    |
| EC-CAMP-1  | TC-CHECKOUT-009 | total > min → pass điều kiện buggy `>`            |
| EC-CAMP-2  | TC-CHECKOUT-013 | total < min → từ chối đúng                        |

## 5. AI Gap Analysis (bổ sung sau review)

Đọc lại code (server.js:297-441, database.js:73-111). 4 gap; đáng chú ý AI đã ghi nghi vấn bypass `max_uses` ở §0 nhưng không tạo EC/TC.

| #  | AI bỏ sót                                                                                       | Bổ sung                                        | Nguyên nhân |
| -- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| G1 | Không TC cho bypass `max_uses_per_user` (nhánh `if (user_id)` server.js:386); thiếu EC present/absent | EC-UID-1/2, TC-CHECKOUT-015, BUG-B-04          | `user_id` là biến điều khiển luồng/auth, cần trạng thái nhiều bước |
| G2 | Nhánh `type="fixed"` không test (chỉ dùng SAVE10 percent)                                        | EC-TYPE-1/2, TC-CHECKOUT-016 (VIP100)          | Prompt chung chung, AI bám coupon đầu danh sách |
| G3 | `total_amount` của apply-coupon không phân lớp invalid riêng (`undefined`/`"abc"` → so `>` false → báo nhầm) | TC-CHECKOUT-017                                | Cùng field ở 2 endpoint, AI gộp làm một |
| G4 | Lỗi thứ tự kiểm tra (hết hạn + số lần lồng trong `total > min`) → lỗi tương tác 2 biến           | Ghi nhận: cần decision table, ngoài phạm vi EP/BVA | Giới hạn kỹ thuật ECP single-fault |

**EC bổ sung:** EC-UID-1 (gửi `user_id`=`2`, Valid) · EC-UID-2 (omit `user_id`, Invalid) · EC-TYPE-1 (`percent`=SAVE10) · EC-TYPE-2 (`fixed`=VIP100).

### Test case bổ sung (015–017)

| TC ID           | Mô tả                                                                 | Phủ EC              | Test data (Body JSON)                                            | Expected result                                                                                                                          | Status |
| --------------- | --------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| TC-CHECKOUT-015 | Bypass giới hạn lượt, áp lại SAVE10 mà không gửi `user_id`            | EC-UID-2, EC-CODE-5 | `{"code":"SAVE10","total_amount":400000}` (không `user_id`)      | Kỳ vọng 400 (đã đạt giới hạn). Thực tế (BUG-B-04): 200, `if(user_id)`=false nên bỏ qua kiểm số lần dùng                                    | FAIL   |
| TC-CHECKOUT-016 | Đối chứng nhánh `fixed` VIP100 (giảm 100k) áp đúng                     | EC-TYPE-2, EC-CODE-1 | `{"code":"VIP100","total_amount":400000,"user_id":2}`            | 200, `discount_amount=100000`, `final_amount=300000` (đúng). Cho thấy BUG-B-02 chỉ xảy ra ở `type=percent`                                | PASS   |
| TC-CHECKOUT-017 | apply-coupon thiếu `total_amount`, kiểm thông báo lỗi                  | EC-TYPE-1            | `{"code":"SAVE10"}` (thiếu `total_amount`)                       | Kỳ vọng 400 lỗi thiếu total. Thực tế: 400 báo nhầm "Đơn hàng chưa đủ giá trị tối thiểu..." vì `undefined > 300000` = false                 | FAIL   |

> Tổng TC Feature B: 20 = 14 (Domain 001–014) + 3 (BVA 101–103, xem [BVA-FR08.md](BVA-FR08.md)) + 3 (Domain bổ sung 015–017).
