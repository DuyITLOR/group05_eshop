# Boundary Value Analysis – Feature A (FR-01: Đăng ký tài khoản)

> **Sinh viên:** Lê Nhựt Duy – 23127178
> **SUT:** EShop – Trang `/register` (Frontend Web `:5173`) → API `POST /api/register`
> **Kỹ thuật:** Boundary Value Analysis (BVA) — 3-value BVA (min−1 / min / min+1).
> **Quy ước mã:** Tiếp nối `TC-REGISTER-###` (021 là TC cuối của Domain Testing) → BVA bắt đầu từ `TC-REGISTER-022`.
> **Nguồn biên:** Từ bảng domain của `domain-testing.md` (Bước 2 & 4) và đặc tả FR-01 (SRS README.md:30–36).

**Đặc tả FR-01 (các ràng buộc có thứ tự):**
- `name`: bắt buộc, không rỗng → `length ≥ 1`.
- `password`: `length ≥ 8` **VÀ** đủ 4 nhóm:
  - uppercase_count ≥ 1
  - lowercase_count ≥ 1
  - digit_count ≥ 1
  - special_count ≥ 1 (tập `@ $ ! % * ? &`)

---

## Bước 1 – Chọn biến đủ điều kiện BVA

BVA chỉ áp dụng cho biến **có thứ tự và có cận (ordered + bounded)**. Mỗi biến được phân tích riêng:

| Biến | Có thứ tự? | Có cận? | Đưa vào BVA? | Lý do |
|------|-----------|---------|--------------|-------|
| `name.length` | | (min=1, max=unspec.) | **Có** | SRS yêu cầu ≥1 ký tự, có biên dưới rõ ràng |
| `email` | | | Không | Ràng buộc là định dạng + uniqueness, không phải dải số — đã xử lý ở EP |
| `password.length` | | (min=8, max=unspec.) | **Có** | SRS nêu "≥ 8 ký tự" — biên dưới = 8 |
| `password.uppercase_count` | | (min=1, max=unspec.) | **Có** | SRS: "≥1 chữ hoa" — biên dưới = 1 |
| `password.lowercase_count` | | (min=1, max=unspec.) | **Có** | SRS: "≥1 chữ thường" — biên dưới = 1 |
| `password.digit_count` | | (min=1, max=unspec.) | **Có** | SRS: "≥1 chữ số" — biên dưới = 1 |
| `password.special_count` | | (min=1, max=unspec.) | **Có** | SRS: "≥1 ký tự đặc biệt `@$!%*?&`" — biên dưới = 1 |
| `confirmPassword` | | | Không | Ràng buộc bằng nhau (equality), không phải dải — đã xử lý ở EP15 |

> **Tổng: 6 biến BVA**, tất cả đều dạng **"ít nhất N"** với cận **dưới đã biết, cận trên không xác định** trong SRS.

---

## Bước 2 – Xác định cận (bounds) của từng biến

| Biến | Cận dưới (lower) | Cận trên (upper) | Inclusive? | Đơn vị |
|------|-----------------|-----------------|------------|--------|
| `name.length` | **1** | Không quy định (SRS) | Inclusive (≥1) | ký tự |
| `password.length` | **8** | Không quy định (SRS) | Inclusive (≥8) | ký tự |
| `password.uppercase_count` | **1** | Không quy định | Inclusive (≥1) | chữ cái hoa |
| `password.lowercase_count` | **1** | Không quy định | Inclusive (≥1) | chữ cái thường |
| `password.digit_count` | **1** | Không quy định | Inclusive (≥1) | chữ số |
| `password.special_count` | **1** | Không quy định | Inclusive (≥1) | ký tự từ `@$!%*?&` |

> **Giả định cận trên:** SRS không đặt giới hạn trên cho bất kỳ biến nào. Mình thêm 1 TC thực tế kiểm giới hạn ẩn của hệ thống (`password.length = 129`, `name.length = 256`) — SQLite TEXT không có giới hạn cứng, nhưng backend/form có thể áp đặt silently.

---

## Bước 3 – Sinh giá trị biên (3-value BVA)

Với mỗi cận, sinh 3 điểm: **min−1** (off/invalid), **min** (on/valid), **min+1** (in/valid).
Cận trên không xác định → không có max−1/max/max+1 (ghi "—"); thay bằng 1 giá trị thực tế lớn.

| Biến | min−1 (reject) | **min** (accept) | min+1 (accept) | max thực tế test |
|------|---------------|-----------------|----------------|-----------------|
| `name.length` | 0 (`""`) | **1** (`"A"`) | 2 (`"AB"`) | 256 (`"A"×256`) |
| `password.length` | 7 (`Aa1!bcx`) | **8** (`Aa1!bcxy`) | 9 (`Aa1!bcxyz`) | 129 (`Aa1!` + `x`×125) |
| `password.uppercase_count` | 0 (`aa1!bcxy`) | **1** (`Aa1!bcxy`) | 2 (`AAa1!bxy`) | — |
| `password.lowercase_count` | 0 (`AA1!BCXY`) | **1** (`AAa1!BCX`) | 2 (`AAab1!CX`) | — |
| `password.digit_count` | 0 (`Aaa!bcxy`) | **1** (`Aa1!bcxy`) | 2 (`Aa12!bxy`) | — |
| `password.special_count` | 0 (`Aa12bcxy`) | **1** (`Aa1!bcxy`) | 2 (`Aa1!!bxy`) | — |

> **Lưu ý thiết kế input:** Khi test một biến, **tất cả biến khác giữ ở giá trị hợp lệ theo spec** (không bị ảnh hưởng bởi biên đang test). Ví dụ: test `uppercase_count=0` → giữ length=8, lowercase≥1, digit≥1, special≥1 → `aa1!bcxy` (8 ký tự, 0 hoa, 1 thường, 1 số, 1 đặc biệt).
>
> **Biên `name.length=0`** đã được phủ bởi TC-REGISTER-002 (EP2, domain testing). Mình tái tham chiếu thay vì tạo trùng.
>
> **Biên `password.length=7,8,9`** đã có TC-REGISTER-010/011/012 từ domain testing. Đưa vào bảng dưới để đủ tài liệu BVA, không tạo trùng.

---

## Bước 4 – Thiết kế test case BVA

> Quy tắc: 1 TC / 1 điểm biên. Các biến không đang test giữ ở **giá trị hợp lệ điển hình** (`name="Nguyen Van A"`, `email="newXX@domain.com"` chưa tồn tại, `confirmPassword` = `password`).
> Dấu **\*** = "Pass nhưng đúng vì lý do sai" — hệ thống đưa ra kết quả đúng nhưng cơ chế bên trong sai (do BUG-A1). Cần chú thích rõ.

### Nhóm B1 – `name.length`

| TC ID | Tiêu đề | Biến | Điểm biên | Input password | Input name | Expected (SRS) | Actual | Result | Bug |
|-------|---------|------|-----------|---------------|-----------|----------------|--------|--------|-----|
| TC-REGISTER-002 *(tái dùng)* | name rỗng | name.length | **0** (min−1) | `Password 1` | `""` | Từ chối "Họ tên bắt buộc" | HTML5 `required` chặn submit → từ chối **đúng** | Pass † | — |
| **TC-REGISTER-022** | name đúng 1 ký tự (biên min) | name.length | **1** (min, on) | `Password 1` | `"A"` | Chấp nhận | Form tạo user (HTTP 200) | Pass | — |
| **TC-REGISTER-023** | name 2 ký tự (min+1) | name.length | **2** (min+1) | `Password 1` | `"AB"` | Chấp nhận | Form tạo user | Pass | — |
| **TC-REGISTER-036** | name rất dài (256 ký tự) | name.length | **256** (thực tế) | `Password 1` | `"A"×256` | Chấp nhận (không có giới hạn trên) | API tạo user (không chặn) | Pass | — |

### Nhóm B2 – `password.length`

> TC-010/011/012 đã thiết kế ở domain-testing.md (Bước 4 — đánh dấu biên). Đưa lại vào đây để tài liệu BVA hoàn chỉnh.

| TC ID | Tiêu đề | Biến | Điểm biên | Input password | Expected (SRS) | Actual | Result | Bug |
|-------|---------|------|-----------|---------------|----------------|--------|--------|-----|
| TC-REGISTER-010 *(tái dùng)* | password 7 ký tự (min−1) | password.length | **7** (off) | `Aa1!bcx` | Từ chối (quá ngắn) | Form chặn (BUG-A1, `!` bị cấm) | Pass\* | — |
| TC-REGISTER-011 *(tái dùng)* | password 8 ký tự (biên min) | password.length | **8** (on) | `Aa1!bcxy` | **Chấp nhận** | Form chặn "yếu" | Fail | BUG-A1 |
| TC-REGISTER-012 *(tái dùng)* | password 9 ký tự (min+1) | password.length | **9** (in) | `Aa1!bcxyz` | **Chấp nhận** | Form chặn "yếu" | Fail | BUG-A1 |
| **TC-REGISTER-037** | password 129 ký tự (giới hạn ẩn) | password.length | **129** (thực tế) | `Aa1!` + `x`×125 | Chấp nhận (không có max) | API tạo user (không chặn) | Pass | — |

### Nhóm B3 – `password.uppercase_count`

| TC ID | Tiêu đề | Biến | Điểm biên | Input password | Expected (SRS) | Actual | Result | Bug |
|-------|---------|------|-----------|---------------|----------------|--------|--------|-----|
| **TC-REGISTER-024** | 0 chữ hoa (min−1) | uppercase_count | **0** (off) | `aa1!bcxy` | Từ chối (thiếu hoa) | Form chặn (không hoa + không khoảng trắng) | Pass\* | — |
| **TC-REGISTER-025** | đúng 1 chữ hoa (biên min) | uppercase_count | **1** (on) | `Aa1!bcxy` | **Chấp nhận** | Form chặn (BUG-A1, `!` bị cấm) | Fail | BUG-A1 |
| **TC-REGISTER-026** | 2 chữ hoa (min+1) | uppercase_count | **2** (in) | `AAa1!bxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |

### Nhóm B4 – `password.lowercase_count`

| TC ID | Tiêu đề | Biến | Điểm biên | Input password | Expected (SRS) | Actual | Result | Bug |
|-------|---------|------|-----------|---------------|----------------|--------|--------|-----|
| **TC-REGISTER-027** | 0 chữ thường (min−1) | lowercase_count | **0** (off) | `AA1!BCXY` | Từ chối (thiếu thường) | Form chặn (không thường + không khoảng trắng) | Pass\* | — |
| **TC-REGISTER-028** | đúng 1 chữ thường (biên min) | lowercase_count | **1** (on) | `AAa1!BCX` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |
| **TC-REGISTER-029** | 2 chữ thường (min+1) | lowercase_count | **2** (in) | `AAab1!CX` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |

### Nhóm B5 – `password.digit_count`

| TC ID | Tiêu đề | Biến | Điểm biên | Input password | Expected (SRS) | Actual | Result | Bug |
|-------|---------|------|-----------|---------------|----------------|--------|--------|-----|
| **TC-REGISTER-030** | 0 chữ số (min−1) | digit_count | **0** (off) | `Aaa!bcxy` | Từ chối (thiếu số) | Form chặn (không số + không khoảng trắng) | Pass\* | — |
| **TC-REGISTER-031** | đúng 1 chữ số (biên min) | digit_count | **1** (on) | `Aa1!bcxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |
| **TC-REGISTER-032** | 2 chữ số (min+1) | digit_count | **2** (in) | `Aa12!bxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |

### Nhóm B6 – `password.special_count`

| TC ID | Tiêu đề | Biến | Điểm biên | Input password | Expected (SRS) | Actual | Result | Bug |
|-------|---------|------|-----------|---------------|----------------|--------|--------|-----|
| **TC-REGISTER-033** | 0 ký tự đặc biệt (min−1) | special_count | **0** (off) | `Aa12bcxy` | Từ chối (thiếu đặc biệt) | Form chặn (không khoảng trắng) | Pass\* | — |
| **TC-REGISTER-034** | đúng 1 ký tự đặc biệt (biên min) | special_count | **1** (on) | `Aa1!bcxy` | **Chấp nhận** | Form chặn (BUG-A1, `!` ∈ tập hợp lệ nhưng bị cấm bởi regex) | Fail | BUG-A1 |
| **TC-REGISTER-035** | 2 ký tự đặc biệt (min+1) | special_count | **2** (in) | `Aa1!!bxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |

---

## Tổng kết test case BVA

| Nhóm | TC IDs | Số TC | Pass | Fail |
|------|--------|-------|------|------|
| B1 `name.length` | 002\*†, 022, 023, 036 | 4 | 4 | 0 |
| B2 `password.length` | 010\*, 011\*, 012\*, 037 | 4 | 2 | 2 |
| B3 `uppercase_count` | 024, 025, 026 | 3 | 1 | 2 |
| B4 `lowercase_count` | 027, 028, 029 | 3 | 1 | 2 |
| B5 `digit_count` | 030, 031, 032 | 3 | 1 | 2 |
| B6 `special_count` | 033, 034, 035 | 3 | 1 | 2 |
| **Tổng** | | **20** | **10** | **10** |

> \* TC tái dùng từ domain-testing, không đếm thêm vào tổng mới. TC mới thực sự của BVA: **TC-022 → TC-037** = **16 TC mới**.
>
> **Pass\* ("đúng vì lý do sai"):** TC-010/024/027/030/033 bị form chặn nhưng nguyên nhân là regex đòi khoảng trắng `\s` (BUG-A1), **không phải** vì thiếu hoa/thường/số/đặc biệt. Test qua API trực tiếp → backend không validate → vẫn tạo user (BUG-A2).
>
> **† TC-002 (name rỗng):** Pass thật sự — HTML `required` chặn submit khi để trống, form từ chối đúng. (Khác với Pass\*: đây đúng cả kết quả lẫn lý do.)

---

## Bước 5 – Giải thích cách áp dụng BVA cho FR-01

**Tại sao FR-01 có nhiều biến BVA?** FR-01 dùng dạng ràng buộc "ít nhất N" (at-least-N constraints) — đây đều là biến *có thứ tự có cận* nên đủ điều kiện BVA. Cụ thể:

1. **Chọn biến (Bước 1):** Loại `email` và `confirmPassword` vì chúng là ràng buộc định dạng/bằng nhau — không có dải số. Giữ lại 6 biến còn lại: `name.length` và 5 thuộc tính của `password`.

2. **Xác định cận (Bước 2):** Tất cả 6 biến đều có cận dưới rõ ràng từ SRS (`≥1` hoặc `≥8`), và **không có cận trên được nêu**. Việc không có cận trên buộc phải giả định (assumption) và thêm TC kiểm giới hạn ẩn (TC-036/037).

3. **Sinh 3 giá trị biên (Bước 3):** Áp dụng 3-value BVA: min−1 (phải bị từ chối), min (phải được chấp nhận — đây là điểm nguy hiểm nhất), min+1 (rõ ràng chấp nhận). Cận trên không xác định → chỉ test 1 giá trị lớn thực tế.

4. **Thiết kế TC single-variable (Bước 4):** Mỗi TC chỉ đẩy **1 biến sang biên**, giữ tất cả biến khác ở giá trị hợp lệ an toàn. Ví dụ khi test `uppercase_count=0`: giữ length=8, lowercase≥1, digit≥1, special≥1 → `aa1!bcxy`.

5. **Phát hiện chính:** BVA phơi bày **rõ nhất** BUG-A1: tất cả điểm biên **min** (biên hợp lệ = lẽ ra PASS) đều bị form từ chối sai — riêng `password.length=8`, `uppercase=1`, `lowercase=1`, `digit=1`, `special=1` đều là điểm biên hợp lệ nhưng bị chặn. Đây là điều EP không thể thấy rõ bằng BVA.

6. **Inclusive vs exclusive:** Tất cả cận trong FR-01 đều là **inclusive** (`≥`, không phải `>`). Nếu nhầm thành exclusive, điểm biên min=8 sẽ bị xem là invalid → test case thiếu. Đây là lỗi BVA phổ biến nhất.

**Giả định được ghi nhận:**
- (a) SRS không nêu cận trên `name.length` và `password.length` → coi là không giới hạn; test 1 giá trị lớn để dò giới hạn ẩn.
- (b) `special_count` đếm **chỉ ký tự trong tập `@$!%*?&`**, không phải mọi non-alphanumeric.
- (c) `name.length` đo sau khi **trim** khoảng trắng đầu/cuối — assumption này khiến `"A"` (1 ký tự) là biên min hợp lệ, còn `"   "` (3 khoảng trắng) = length 0 sau trim = invalid.

---

## AI Gap Analysis (ứng viên)

| Điểm BVA AI dễ bỏ sót | Vì sao AI sót |
|-----------------------|----------------|
| Chỉ test `password.length`, bỏ qua 5 biến count còn lại | AI hay hiểu "BVA password" = chỉ kiểm độ dài; không tách từng luật "≥1 hoa/thường/số/đặc biệt" thành biến BVA riêng |
| `name.length` min=1 (biên TC-022) | AI hay bỏ biến `name` vì "không có dải số"; cần nhận ra `length ≥ 1` là ràng buộc có thứ tự |
| Cận trên không xác định → giới hạn ẩn (TC-036/037) | AI không thêm TC giới hạn ẩn nếu spec không nêu max; cần suy luận từ DB/backend |
| "Biên hợp lệ bị từ chối sai" (TC-011/025/028/031/034) | AI đôi khi mark Pass\* vì kết quả "bị chặn" khớp với expected EP invalid; BVA phải phân biệt rõ điểm min (on) lẽ ra PASS |
| Inclusive vs exclusive (tất cả biên) | AI dễ viết `> 8` thay vì `>= 8`, dẫn đến min sai → sai toàn bộ 3-value set |

---

## Bước 6 – Human review checkpoint

Trước khi chốt, bạn xác nhận:

1. **Inclusive đúng không?** Tất cả cận đều `≥` (inclusive) theo SRS — bạn thấy có cận nào là `>` (exclusive) không?
2. **Có biên ẩn nào không?** Ví dụ DB có ràng buộc độ dài TEXT không? Frontend có `maxLength` trên input không?
3. **`name.length` sau trim hay raw?** Mình giả định sau trim (semantic empty). Bạn muốn thêm TC test `" A "` (khoảng trắng hai bên, 3 ký tự raw nhưng 1 ký tự sau trim) không?
4. **Cận trên cần test thêm không?** TC-036 (`name`=256) và TC-037 (`password`=129) — muốn tăng lên 1000 hay đủ rồi?
5. **Đồng bộ traceability:** Có muốn mình cập nhật `traceability-matrix.md`, `test-run`, và `main-report.md` mục A.2 với 16 TC mới không?

> Sau khi bạn duyệt, commit theo HW02 yêu cầu: `test(feature-A): boundary value analysis for FR-01 register`.
