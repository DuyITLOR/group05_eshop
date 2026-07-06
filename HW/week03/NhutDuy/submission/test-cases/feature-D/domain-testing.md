# Domain Testing – Feature D (D7 Mobile / FR-04: Quản lý hồ sơ cá nhân)

> **Sinh viên:** Lê Nhựt Duy – 23127178
> **SUT:** EShop – App **Mobile** (React Native / Expo, `frontend-mobile/App.js`) → API `PUT /api/users/me`
> **Kỹ thuật:** Domain Testing / Equivalence Partitioning (EP). Biên `phone.length` được đánh dấu để chuyển sang BVA.
> **Quy ước mã:** `TC-PROFILE-###` (module FR-04 = `PROFILE`).
> **Actual = đối chiếu source thật** (`frontend-mobile/App.js` `handleUpdateProfile`, `backend/server.js` `PUT /api/users/me`). Cần chạy lại trên app mobile / API để xác nhận (human review).

**Đặc tả đầu vào (SRS – FR-04):**
- Người dùng đã đăng nhập cập nhật được: **Họ Tên**, **Số điện thoại**, **Địa chỉ giao hàng mặc định**.
- **Số điện thoại hợp lệ:** bắt đầu bằng số **`0`**, **10–11 chữ số**.
- **Email KHÔNG được đổi** qua giao diện.
- User **chỉ cập nhật hồ sơ của chính mình**; **không thể tự đổi `role`**.

---

## Bước 1 – Xác định biến đầu vào

| # | Biến | Kiểu | Nguồn | Ghi chú |
|---|------|------|-------|---------|
| 1 | `phone` | string (số) | Ô "Số điện thoại" (`App.js`, `keyboardType="phone-pad"`) → body API | **Biến chính**; SRS: đầu `0`, 10–11 chữ số |
| 2 | `name` | string | Ô "Họ Tên" | Cập nhật được; SRS **không nêu ràng buộc format** |
| 3 | `shipping_address` | string | Ô "Địa chỉ giao hàng" (textarea) | Cập nhật được; SRS không nêu ràng buộc |
| 4 | `email` | string | Ô "Email (Không đổi)" — **disabled** | **Bất biến** (không cho đổi) |
| 5 | `role` | enum | (không có trên UI) — chỉ qua body API | **Bất biến với user** (không tự đổi) — kiểm bảo mật |

> Biến rút từ **đặc tả FR-04**, không chỉ từ UI. Nhờ vậy bắt được: regex SĐT mobile sai spec, lệch tên trường `shippingAddress`↔`shipping_address`, và backend cho đổi `role` (leo thang đặc quyền).

> **EP xét cả Input VÀ Output (B1).** Ngoài biến đầu vào ở trên, FR-04 còn có các **Output** cần phân vùng: (a) **hồ sơ được cập nhật** (`name` / `phone` / `shipping_address` lưu đúng) + **thông báo kết quả** cho người dùng; (b) **email & role phải BẤT BIẾN** (không đổi sau khi cập nhật). Các Output này được xác định miền giá trị ở Bước 2 & Bước 2b.

---

## Bước 2 – Xác định domain của từng biến

| Biến | Miền HỢP LỆ | Ràng buộc / luật |
|------|-------------|------------------|
| `phone` | Chuỗi số **bắt đầu `0`, dài 10–11 chữ số** | SRS FR-04. Cận độ dài **10–11 inclusive**. |
| `name` | Chuỗi non-blank | SRS không nêu format → giả định nên không rỗng. |
| `shipping_address` | Chuỗi bất kỳ | SRS không nêu ràng buộc. |
| `email` | = giá trị hiện tại (không đổi) | SRS: **không cho đổi qua giao diện**. |
| `role` | = giá trị hiện tại (user không tự đổi) | SRS: user **không thể tự đổi role**. |

**Miền giá trị của Output (B2 cho Output):**

| Output | Miền ĐÚNG (mong đợi) | Miền SAI (lỗi) |
|--------|----------------------|----------------|
| Hồ sơ (`name` / `phone` / `shipping_address`) | Cập nhật **thành công**, dữ liệu lưu đúng & còn sau reload | SĐT hợp lệ (đầu `0`) bị **từ chối**; hoặc SĐT sai được **chấp nhận**; địa chỉ **không lưu** (mất sau reload); backend nhận `name` rỗng / `phone` sai |
| Thông báo kết quả | Báo cập nhật thành công khi hợp lệ; báo lỗi khi không hợp lệ | Báo sai trạng thái (báo lỗi với input đúng / báo thành công với input sai) |
| `email` (bất biến) | **Giữ nguyên** sau cập nhật | `email` bị đổi |
| `role` (bất biến) | **Giữ nguyên** sau cập nhật | `role` bị đổi thành `admin` (**leo thang đặc quyền**) |

---

## Bước 2b – Miền giá trị Output (kết quả)

> Phân vùng **Output**: Thành công vs các loại Từ chối/lỗi. Đối chiếu trực tiếp với cột **Expected** trong bảng test case Bước 5 để bảo đảm nhất quán.

| Vùng Output | Mã | Mô tả kết quả | TC liên quan (cột Expected) |
|-------------|-----|---------------|------------------------------|
| **Thành công** | O1 | Cập nhật được chấp nhận, hồ sơ lưu đúng & còn sau reload; `email`/`role` giữ nguyên | TC-PROFILE-001, -002 (Expected: Chấp nhận, lưu) |
| **Từ chối do validate (đúng kỳ vọng)** | O2 | Input invalid bị từ chối hợp lệ (SĐT không đầu 0 / quá ngắn / chứa chữ / rỗng; `name` rỗng) | TC-PROFILE-003, -004, -005, -006, -011 (Expected: Từ chối) |
| **Bất biến giữ nguyên** | O3 | Thuộc tính bảo mật không đổi: `email` không đổi được, `role` không tự đổi, scope chỉ-hồ-sơ-của-mình | TC-PROFILE-007, -008, -010 (Expected: Không đổi / Từ chối / Chỉ sửa của mình) |
| **Lưu/persist đúng** | O4 | `shipping_address` được lưu và còn sau khi đăng nhập lại | TC-PROFILE-009 (Expected: Địa chỉ được lưu) |

> Các vùng Output O1–O4 phủ kín mọi giá trị trong cột Expected của Bước 5: không có dòng Expected nào nằm ngoài 4 vùng này, và mỗi vùng có ≥1 TC đại diện.

---

## Bước 3 – Phân vùng tương đương (Equivalence Partitions)

| Biến | Vùng HỢP LỆ (valid) | Vùng KHÔNG hợp lệ (invalid) |
|------|---------------------|------------------------------|
| `phone` | **EP1**: đầu `0`, 10–11 chữ số | **EP2**: không bắt đầu bằng `0` · **EP3**: < 10 chữ số · **EP4**: > 11 chữ số · **EP5**: chứa ký tự không phải số / rỗng |
| `name` | **EP6**: chuỗi non-blank | **EP6b** *(giả định, SRS không nêu)*: rỗng / chỉ khoảng trắng |
| `shipping_address` | **EP7**: chuỗi bất kỳ (kể cả rỗng) | — *(SRS không ràng buộc)* |
| `email` (bất biến) | **EP8**: giữ nguyên | **EP8b**: cố đổi email |
| `role` (bảo mật) | **EP9**: giữ nguyên | **EP9b**: user cố tự đổi `role` |

> Vùng `phone` rời nhau & phủ kín. `phone.length` (biên 10–11) là **biên số thật** → đánh dấu cho BVA.

---

## Bước 4 – Chọn điểm đại diện (representative points)

| Vùng | Đại diện | Loại điểm |
|------|----------|-----------|
| EP1 `phone` hợp lệ | `0912345678` (10 số) ; `09123456789` (11 số) | in |
| EP2 không đầu 0 | `912345678` | out |
| EP3 quá ngắn | `09123` (5 số) | out (= dưới biên min) |
| EP4 quá dài | `012345678901` (12 số) | out (= trên biên max) |
| EP5 không phải số / rỗng | `09abc45678` ; `""` | out |
| EP6 / EP6b `name` | `Test User` / `""` | in / out *(giả định)* |
| EP7 `shipping_address` | `"123 Nguyễn Văn A"` | in |
| EP8b `email` | cố đổi `email` sang giá trị khác | out |
| EP9b `role` | gửi `role="admin"` (qua API) | out |

> **Chuyển cho BVA:** biên `phone.length` tại **9 (min−1) / 10 (min) / 11 (max) / 12 (max+1)** → xử lý ở skill `boundary-value-analysis` (TC-PROFILE-012/013 + tái dùng TC-001/002).

---

## Bước 5 – Thiết kế test case (single-fault: chỉ thả 1 biến sang vùng invalid)

> Baseline hợp lệ: `name="Test User"`, `phone="0912345678"`, `shippingAddress="123 Nguyễn Văn A"`. Mỗi TC chỉ đổi 1 trường, cột Input thể hiện đủ `name / phone / shippingAddress`.

| TC ID | Mô tả | Input (name / phone / shippingAddress) | Vùng | Expected (SRS) | Actual (từ source) | Result | Bug |
|-------|-------|----------------------------------------|------|----------------|--------------------|--------|-----|
| TC-PROFILE-001 | SĐT hợp lệ 10 số (đầu 0) | `"Test User"` / `0912345678` / `"123 NVA"` | EP1 | Chấp nhận, lưu | Mobile regex `^[1-9][0-9]{8,9}$` **đòi đầu 1-9** → báo "SĐT không hợp lệ", chặn submit | Fail | BUG-D1 |
| TC-PROFILE-002 | SĐT hợp lệ 11 số (đầu 0) | `"Test User"` / `09123456789` / `"123 NVA"` | EP1 | Chấp nhận | Mobile từ chối (đầu 0 + 11 số > "9-10") | Fail | BUG-D1 |
| TC-PROFILE-003 | SĐT không bắt đầu 0 | `"Test User"` / `912345678` / `"123 NVA"` | EP2 | **Từ chối** (phải đầu 0) | Mobile regex khớp (9 số, đầu 9) → **chấp nhận** | Fail | BUG-D1 |
| TC-PROFILE-004 | SĐT quá ngắn | `"Test User"` / `09123` / `"123 NVA"` | EP3 | Từ chối | Mobile từ chối (regex cần 9-10 số) | Pass |  — |
| TC-PROFILE-005 | SĐT chứa chữ | `"Test User"` / `09abc45678` / `"123 NVA"` | EP5 | Từ chối | Mobile từ chối (không khớp regex số) | Pass | — |
| TC-PROFILE-006 | SĐT rỗng | `"Test User"` / `""` / `"123 NVA"` | EP5 | Từ chối | Mobile từ chối (regex fail) | Pass | — |
| TC-PROFILE-007 | Email không cho đổi | (thử sửa ô Email) | EP8b | Không đổi được | Ô Email `editable={false}` (disabled); backend `PUT /users/me` **không** đọc `email` → **không đổi** | Pass | — |
| TC-PROFILE-008 | User tự đổi `role` *(qua API)* | API body `{... ,"role":"admin"}` | EP9b | **Từ chối** (không tự đổi role) | `server.js` `if (role) { query += ", role=?" }` → **đổi role thành admin** (leo thang đặc quyền) | Fail | BUG-D2 |
| TC-PROFILE-009 | Lưu địa chỉ giao hàng | `"Test User"` / `912345678`\* / `"123 Nguyễn Văn A"` → Cập nhật → đăng nhập lại | EP7 | Địa chỉ được lưu | Mobile gửi `shippingAddress` (camelCase) nhưng backend đọc `shipping_address` → lưu **NULL** → địa chỉ **mất sau reload** | Fail | BUG-D3 |
| TC-PROFILE-010 | Chỉ sửa hồ sơ của mình | API token user A, cố sửa user B | — | Chỉ sửa của mình | Backend dùng `req.user.id` từ token → **chỉ update chính mình** (không sửa được người khác) | Pass | — |
| TC-PROFILE-011 | API không validate *(qua API)* | API body `{"name":"","phone":"abc"}` | EP6b/EP5 | Từ chối (tên rỗng / SĐT sai) | Backend chèn thẳng, **không validate** → lưu tên rỗng + phone `"abc"` | Fail | BUG-D4 |

> \* TC-009 phải dùng SĐT mobile **chấp nhận** (vd `912345678`) để qua được bước validate (do BUG-D1), mới quan sát được lỗi địa chỉ; hoặc gọi thẳng API.

> **Phủ vùng `phone`:** EP1→TC-001/002 · EP2→TC-003 · EP3→TC-004 · EP4→(BVA TC-013) · EP5→TC-005/006.
> **Phủ luật/bảo mật:** email bất biến (EP8)→TC-007 · role (EP9b)→TC-008 · scope own-profile→TC-010 · backend không validate→TC-011.
> **`shipping_address` (EP7):** không có vùng invalid (SRS không ràng buộc) — test ở khía cạnh **lưu được hay không** (TC-009).

---

## Bước 5b – Rút gọn test case (B5)

> **Nguyên tắc B5:** hai test case được coi là **trùng** khi có **Input GIỐNG HỆT VÀ Expected Output GIỐNG HỆT** nhau → chỉ giữ **1** TC. Nếu khác nhau ở Input hoặc ở Expected thì **không trùng**, phải giữ cả hai.

**Kết quả rà soát bộ TC hiện tại (TC-PROFILE-001 → 011):**

| Cặp xét | Input giống? | Expected giống? | Kết luận |
|---------|--------------|-----------------|----------|
| TC-001 vs TC-002 | Khác (`phone` 10 số vs 11 số) | Giống (Chấp nhận) | **Không trùng** (khác Input) |
| TC-005 vs TC-006 | Khác (`phone` chứa chữ vs rỗng) | Giống (Từ chối) | **Không trùng** (khác Input) |
| TC-006 vs TC-011 | Khác (chỉ `phone` rỗng vs `name=""`+`phone="abc"` qua API) | Giống-loại (Từ chối) | **Không trùng** (khác Input, khác lý do/đường đi) |
| Các TC còn lại | Mỗi TC thả 1 biến/luật khác nhau (single-fault) | Khác nhau theo vùng Output | **Không trùng** |

**Kết luận:** Bộ TC hiện tại được thiết kế theo **single-fault**, mỗi TC khác nhau ở **Input** và/hoặc **Expected Output** (ánh xạ tới các vùng Output O1–O4 ở Bước 2b), nên **không có cặp TC nào trùng cần loại bỏ**. Không phát hiện cặp gần-trùng (các cặp cùng Expected đều khác Input rõ rệt). → Giữ nguyên đủ **11 TC**.

---

## Bước 6 – Giải thích từng bước (áp dụng cho FR-04)

1. **Xác định biến (Bước 1):** màn Hồ sơ nhận 3 trường sửa được (`phone`, `name`, `shipping_address`) + 2 thuộc tính **bất biến** (`email`, `role`) cần kiểm chặn.
2. **Domain (Bước 2):** chỉ `phone` có ràng buộc format/độ dài rõ trong SRS (đầu 0, 10–11 số); `name`/`address` không ràng buộc; `email`/`role` là **luật bất biến**.
3. **Phân vùng (Bước 3):** `phone` chia 1 valid + 4 invalid; thêm vùng "cố đổi" cho `email`/`role` để bắt lỗi bất biến/bảo mật.
4. **Đại diện (Bước 4):** mỗi vùng 1 giá trị; `phone.length` có thứ tự → đánh dấu biên 9/10/11/12 cho BVA.
5. **Sinh test case (Bước 5):** single-fault cho `phone`; thêm nhóm luật (email/role/scope) và lỗi tích hợp (địa chỉ không lưu). Lỗi backend (role, không validate) phải gọi **API trực tiếp** vì UI không gửi `role` và che bằng regex.
6. **Thực thi:** chạy trên app Mobile (Expo) + đối chiếu; phần API dùng Postman/cURL với token.

**Giả định:** (a) `name` nên non-blank (SRS không nêu → EP6b là giả định); (b) `phone` là bắt buộc khi cập nhật (mobile validate ⇒ coi rỗng là invalid); (c) `shipping_address` không ràng buộc định dạng.

---

## Ghi chú cho AI Gap Analysis (ứng viên)

| Test case / lỗi AI dễ bỏ sót | Vì sao AI sót |
|------------------------------|----------------|
| Regex SĐT sai spec (TC-001→003) | AI thấy "có validate SĐT" là cho qua; không đối chiếu **đầu 0 + 10–11 số** với regex thật `^[1-9][0-9]{8,9}$`. |
| Leo thang đặc quyền `role` (TC-008) | Chỉ lộ khi gửi `role` qua API; UI không có ô role nên AI dễ bỏ. **Lỗi bảo mật nghiêm trọng.** |
| Địa chỉ không lưu do lệch tên trường (TC-009) | `shippingAddress` (FE) ≠ `shipping_address` (BE) — AI khó thấy nếu không đọc cả 2 phía. |
| Backend không validate (TC-011) | AI test qua UI thấy mobile chặn → tưởng ổn; quên backend rỗng validate. |

---

## Bước 7 – Human review checkpoint (đề nghị sinh viên rà soát)

1. **Chạy thật trên app Mobile** để xác nhận Actual (đặc biệt TC-001: nhập `0912345678` xem có bị chặn "SĐT không hợp lệ" không).
2. **Bug bảo mật D2:** gọi API `PUT /users/me` với `{"role":"admin"}` bằng token user thường → kiểm DB xem `role` có đổi không.
3. **Bug D3:** nhập địa chỉ → Cập nhật → **đăng nhập lại** → xem địa chỉ còn không.
4. **Biến đủ chưa?** Có cần test `name`/`address` siêu dài (giới hạn DB) không?
5. **Bug:** xác nhận BUG-D1→D4 là thật trước khi viết bug report + tạo issue.

> Sau khi duyệt + chạy xác nhận: làm tiếp **BVA** (biên `phone.length` 10–11), rồi **bug report** (BUG-D1→D4).
