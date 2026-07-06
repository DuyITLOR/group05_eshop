# HW02 – Domain Testing & Boundary Value Analysis Report

> Sinh viên: **Lê Nhựt Duy** – MSSV: **23127178**
> SUT: EShop (https://github.com/ttbhanh/eshop-sut) — commit nhóm fork
> Môi trường test: Backend `:3000`, Frontend Web `:5173`, Web Admin `:5174`, Mobile (Expo)

---

## Mục lục
- [Feature A – FR-01: Đăng ký tài khoản](#feature-a)
- [Feature B – FR-07: Giỏ hàng](#feature-b)
- [Feature C – FR-15: Quản lý sản phẩm (CRUD)](#feature-c)
- [Feature D – D7 Mobile: Hồ sơ cá nhân (FR-04)](#feature-d)

> **Quy ước (theo slide quản lý Test Case / Bug của môn):**
> - Mã test case: `TC-[MODULE]-[NUMBER]` (module của FR-01 = `REGISTER`).
> - Mỗi test case có `Requirement ID`, `Technique` (EP = Equivalence Partitioning / BVA), `Expected`, `Actual`, `Result` (Pass/Fail/Blocked/Not Run), `Related Bug`.
> - `Result = Fail/Blocked` **bắt buộc** có Related Bug. Bug truy ngược được "Found by Test Case".
> - File test case rời (supporting): [test-cases/feature-A/](../test-cases/feature-A/) · Test run: [test-cases/test-runs/](../test-cases/test-runs/) · Traceability: [test-cases/test-summary/traceability-matrix.md](../test-cases/test-summary/traceability-matrix.md).

---

<a name="feature-a"></a>
## Feature A – FR-01: Đăng ký tài khoản

- **Requirement ID:** FR-01
- **Module:** `REGISTER`
- **SUT:** Trang `/register` (Frontend Web `:5173`) → API `POST /api/register`

### A.0. Mô tả feature & đặc tả đầu vào/đầu ra

Chức năng cho phép người dùng tạo tài khoản mới.

**Đặc tả đúng (SRS – FR-01):**
- Bắt buộc: **Họ tên**, **Email**, **Mật khẩu**.
- **Email**: đúng định dạng `local@domain.tld` và **duy nhất** trong hệ thống.
- **Mật khẩu mạnh**: ≥ **8 ký tự**, có ≥1 **hoa**, ≥1 **thường**, ≥1 **số**, ≥1 **ký tự đặc biệt** thuộc tập `@ $ ! % * ? &`.
- Có trường **Xác nhận mật khẩu** — từ chối nếu hai trường không khớp.
- Thành công → chuyển trang Đăng nhập (`/login`).

**Biến đầu vào:** `name`, `email`, `password`, `confirmPassword`. **Đầu ra:** thành công (tạo user, `→ /login`) hoặc lỗi tương ứng.

---

### A.1. Domain Testing (Technique: Equivalence Partitioning)

#### Bước 1 – Xác định biến đầu vào

| # | Biến | Kiểu | Nguồn | Ghi chú |
|---|------|------|-------|---------|
| 1 | `name` | string | Form field "Họ Tên" → body `name` | Bắt buộc |
| 2 | `email` | string | Form field "Email" → body `email` | Bắt buộc; định dạng + duy nhất |
| 3 | `password` | string | Form field "Mật khẩu" → body `password` | Bắt buộc; ràng buộc độ mạnh |
| 4 | `confirmPassword` | string | Form field "Xác nhận mật khẩu" (SRS yêu cầu) | Bắt buộc; **ràng buộc liên biến** với `password` |

> Biến rút từ **đặc tả nghiệp vụ FR-01**, **không** phải từ UI thực tế. Nhờ vậy phát hiện được: form `Register.jsx` **thiếu** trường `confirmPassword` (xem BUG-A4). Nếu chỉ nhìn UI để liệt kê biến thì sẽ bỏ sót lỗi thiếu chức năng này.

#### Bước 2 – Xác định domain (miền hợp lệ) của từng biến

| Biến | Miền HỢP LỆ | Ràng buộc / luật |
|------|-------------|------------------|
| `name` | Chuỗi **không rỗng, không chỉ gồm khoảng trắng** (1…n ký tự) | Bắt buộc. SRS không nêu cận trên → coi mọi chuỗi non-blank là hợp lệ. |
| `email` | Đúng định dạng `local@domain.tld` **VÀ** chưa tồn tại trong DB | Bắt buộc, **duy nhất**. |
| `password` | `length ≥ 8` **VÀ** đủ 4 nhóm: 1 hoa `[A-Z]`, 1 thường `[a-z]`, 1 số `[0-9]`, 1 ký tự đặc biệt thuộc `@$!%*?&` | Bắt buộc. Ký tự đặc biệt **phải nằm trong tập** đã quy định. |
| `confirmPassword` | Bằng **đúng** giá trị `password` (so khớp tuyệt đối) | Bắt buộc; phụ thuộc `password`. |

#### Bước 3 – Phân vùng tương đương (Equivalence Partitions)

Các vùng **rời nhau (disjoint)** và **phủ kín (complete)**. Vùng KHÔNG hợp lệ được tách nhỏ tối đa (mỗi luật con của spec = một lớp riêng).

| Biến | Vùng HỢP LỆ (valid) | Vùng KHÔNG hợp lệ (invalid) |
|------|---------------------|------------------------------|
| `name` | **EP1**: chuỗi chữ cái non-blank | **EP2**: rỗng `""` · **EP2b**: chỉ khoảng trắng · **EP2c**: toàn **chữ số** `"12345"` · **EP2d**: ký tự đặc biệt/HTML `"<b>x</b>"` |
| `email` | **EP3**: đúng định dạng & chưa tồn tại | **EP4**: sai định dạng *(7 đại diện con bên dưới)* · **EP5**: trùng (`test@eshop.com`) · **EP6**: rỗng |
| `password` | **EP7**: ≥8 ký tự & đủ 4 nhóm | **EP8**: <8 ký tự · **EP9**: thiếu hoa · **EP10**: thiếu thường · **EP11**: thiếu số · **EP12**: thiếu đặc biệt · **EP12b**: đặc biệt **ngoài** tập `@$!%*?&` · **EP13**: rỗng · **EP-NUM**: toàn **chữ số** `"12345678"` |
| `confirmPassword` | **EP14**: khớp | **EP15**: không khớp |

**Tách nhỏ EP4 (email sai định dạng):**

| ID con | Mô tả | Ví dụ |
|--------|-------|-------|
| EP4a | thiếu `@` | `abcdomain.com` |
| EP4b | thiếu local-part | `@domain.com` |
| EP4c | thiếu domain | `user@` |
| EP4d | thiếu TLD | `user@domain` |
| EP4e | nhiều `@` | `a@b@c.com` |
| EP4f | chứa khoảng trắng | `user name@domain.com` |
| EP4g | toàn **chữ số** | `12345` |

> **Spec-grounded vs giả định:** Bám SRS trực tiếp: EP2, EP4(a–g), EP5, EP6, EP8–EP13, EP12b, EP15. **Theo giả định nghiệp vụ** (SRS không quy định format `name`): EP2c (tên toàn số), EP2d (tên chứa HTML) — vẫn đưa vào vì form thật cần chặn + phơi bày backend không validate (BUG-A2) và rủi ro stored XSS.

#### Bước 4 – Chọn điểm đại diện (representative points)

Với biến **có thứ tự** (`password.length`) phân loại **in / on / off / out** để bắc cầu sang BVA.

| Vùng | Đại diện | Loại điểm |
|------|----------|-----------|
| EP1 `name` hợp lệ | `Nguyen Van A` | in |
| EP2 / EP2b / EP2c / EP2d | `""` / `"   "` / `"12345"` / `"<b>x</b>"` | out |
| EP3 `email` hợp lệ | `new01@domain.com` | in |
| EP4a–g `email` sai định dạng | `abcdomain.com`, `@domain.com`, `user@`, `user@domain`, `a@b@c.com`, `user name@d.com`, `12345` | out |
| EP5 / EP6 `email` | `test@eshop.com` (trùng) / `""` (rỗng) | out |
| EP7 `password` hợp lệ | `Password123!` (12 ký tự, đủ 4 nhóm) | in |
| EP8 `password` <8 | `Pass12!` (7) | **off** (= biên min−1) |
| — biên độ dài | **8** = `Pass123!` (on) · **9** = `Pass1234!` (in) | on / in |
| EP9 / EP10 / EP11 / EP12 / EP12b / EP13 / EP-NUM | `password123!` / `PASSWORD123!` / `Password!` / `Password123` / `Password123#` / `""` / `12345678` | out |
| EP14 / EP15 confirm | `= password` / `Khac1` | in / out |

> Biên `password.length` tại **7 / 8 / 9** được chuyển sang phần **A.2 (BVA)** — TC-REGISTER-010/011/012.

#### Bước 5 – Thiết kế test case (single-fault) & kết quả thực thi

Luật **single-fault**: giữ mọi biến ở vùng hợp lệ, chỉ thả **một** biến sang một vùng không hợp lệ.

| Test Case ID | Mô tả | Input (name / email / password / confirm) | Vùng phủ | Expected (SRS) | Actual | Result | Bug |
|--------------|-------|--------------------------------------------|----------|----------------|--------|--------|-----|
| TC-REGISTER-001 | Tất cả hợp lệ (mốc) | `Nguyen Van A` / `new01@domain.com` / `Password123!` / khớp | EP1,3,7,14 | Thành công → `/login` | Form **chặn** "Mật khẩu quá yếu!" dù đúng spec | Fail | BUG-A1 |
| TC-REGISTER-002 | Tên rỗng | `""` / `new02@domain.com` / `Password 1` | EP2 | Từ chối "Họ tên bắt buộc" | HTML5 `required` chặn submit → từ chối **đúng** | Pass † | — |
| TC-REGISTER-003 | Email sai định dạng | `A` / `abc` / `Password 1` | EP4a | Từ chối "email không hợp lệ" | Tạo user với email `abc` (HTTP 200) | Fail | BUG-A2 |
| TC-REGISTER-004 | Email trùng | `A` / `test@eshop.com` / `Password 1` | EP5 | Từ chối "email đã tồn tại" | Tạo thêm user trùng email (200) | Fail | BUG-A3 |
| TC-REGISTER-005 | Email rỗng | `A` / `""` / `Password 1` | EP6 | Từ chối | HTML5 `required` chặn submit → từ chối **đúng** | Pass † | — |
| TC-REGISTER-006 | Mật khẩu yếu (có khoảng trắng) | `A` / `new06@domain.com` / `Password 1` | EP12 | Từ chối (yếu) | Form **chấp nhận** → tạo user mật khẩu yếu | Fail | BUG-A1 |
| TC-REGISTER-007 | Mật khẩu thiếu chữ hoa | `A` / `new07@domain.com` / `password123!` | EP9 | Từ chối | Form chặn "yếu" | Pass\* | — |
| TC-REGISTER-008 | Mật khẩu rỗng | `A` / `new08@domain.com` / `""` | EP13 | Từ chối | HTML5 `required` chặn submit → từ chối **đúng** | Pass † | — |
| TC-REGISTER-009 | Xác nhận mật khẩu không khớp | `A` / `new09@domain.com` / `Password 1` / `Khac1` | EP15 | Từ chối "mật khẩu không khớp" | Form **không có** trường Xác nhận mật khẩu | Fail | BUG-A4 |
| TC-REGISTER-013 | Mật khẩu thiếu chữ thường | `A` / `new13@domain.com` / `PASSWORD123!` | EP10 | Từ chối | Form chặn "yếu" | Pass\* | — |
| TC-REGISTER-014 | Mật khẩu thiếu chữ số | `A` / `new14@domain.com` / `Password!` | EP11 | Từ chối | Form chặn "yếu" | Pass\* | — |
| TC-REGISTER-015 | Tên chỉ gồm khoảng trắng | `"   "` / `new15@domain.com` / `Password 1` | EP2b | Từ chối (rỗng sau trim) | `required` không chặn khoảng trắng → API tạo user (200) | Fail | BUG-A2 |
| TC-REGISTER-016 | Tên toàn chữ số | `"12345"` / `new16@domain.com` / `Password 1` | EP2c | Từ chối | API tạo user name=`12345` (200) | Fail | BUG-A2 |
| TC-REGISTER-017 | Tên chứa thẻ HTML (XSS) | `"<b>x</b>"` / `new17@domain.com` / `Password 1` | EP2d | Từ chối / khử HTML | API lưu nguyên (stored XSS) | Fail | BUG-A2 |
| TC-REGISTER-018 | Email thiếu TLD | `A` / `user@domain` / `Password 1` | EP4d | Từ chối | API tạo user (200) | Fail | BUG-A2 |
| TC-REGISTER-019 | Email toàn chữ số | `A` / `12345` / `Password 1` | EP4g | Từ chối | API tạo user email=`12345` (200) | Fail | BUG-A2 |
| TC-REGISTER-020 | Mật khẩu ký tự đặc biệt ngoài tập | `A` / `new20@domain.com` / `Password123#` | EP12b | Từ chối (`#` ∉ tập) | Form chặn "yếu" | Pass\* | — |
| TC-REGISTER-021 | Mật khẩu toàn chữ số | `A` / `new21@domain.com` / `12345678` | EP-NUM | Từ chối | Form chặn "yếu" | Pass\* | — |

> *\*Pass nhưng "đúng vì lý do sai":* TC-007/013/014/020/021 bị form chặn (khớp Expected "từ chối"), nhưng nguyên nhân là **regex lỗi** (đòi khoảng trắng, cấm ký tự đặc biệt — xem A.3 & BUG-A1), không phải vì thiếu hoa/thường/số. Qua API thì backend không validate → vẫn tạo user (BUG-A2).
>
> *† Đính chính:* TC-002/005/008 (trường rỗng) là **Pass** vì 3 input đều có HTML `required` → trình duyệt chặn submit ("Please fill out this field"), form từ chối đúng. BUG-A2 (backend không validate) chỉ tái hiện khi gọi **thẳng API** (TC-003/015/016/017/018/019).

**Giải thích từng bước cách áp dụng kỹ thuật:**
1. **Liệt kê biến (Bước 1)** từ đặc tả FR-01 (4 biến), theo *yêu cầu nghiệp vụ*, không theo UI → phát hiện thiếu `confirmPassword`.
2. **Xác định domain (Bước 2):** ghi rõ ràng buộc, đặc biệt 2 cái dễ sót: email **duy nhất** (ràng buộc liên-dữ-liệu) và ký tự đặc biệt **phải thuộc tập** `@$!%*?&`.
3. **Phân vùng (Bước 3):** tách `password` thành nhiều vùng invalid để mỗi luật con được kiểm riêng (bộ test sơ khởi thiếu EP8/EP10/EP11, nay đã bổ sung TC-013/014 + BVA).
4. **Chọn đại diện (Bước 4):** mỗi vùng 1 giá trị; `password.length` phân in/on/off/out và đánh dấu biên 7/8/9 chuyển sang BVA.
5. **Sinh test case single-fault (Bước 5):** chỉ thả 1 biến sang vùng invalid → cô lập nguyên nhân; thêm TC-001 "tất cả hợp lệ" làm mốc; đối chiếu chéo qua API vì UI có thể che lỗi bằng `required`.
6. **Thực thi & đối chiếu** trên `/register`, ghi Actual, so với Expected suy từ SRS → lộ ra BUG-A1..A4 (+ A5/A6 khi soi sâu).

**Giả định:** (a) SRS không nêu cận trên độ dài `name`/`password` → coi không giới hạn trên; (b) `name` chỉ-khoảng-trắng = không hợp lệ (rỗng sau trim).

#### Output & miền kết quả (Output partitions – EP B1/B2)

Ngoài việc phân vùng **Input**, EP B1/B2 yêu cầu xác định cả **Output VÀ miền giá trị của Output**. Các vùng Output của FR-01:

| Vùng Output | Điều kiện kích hoạt | Đại diện kết quả |
|-------------|---------------------|------------------|
| **Thành công** | 4 trường hợp lệ + email duy nhất + mật khẩu đủ mạnh + confirm khớp | Tạo user, chuyển trang `→ /login` |
| **Từ chối – email sai** | email sai định dạng (EP4a–g) hoặc rỗng (EP6) | Thông báo "email không hợp lệ", không tạo user |
| **Từ chối – email trùng** | email đã tồn tại (EP5) | Thông báo "email đã tồn tại", không tạo user |
| **Từ chối – mật khẩu yếu** | thiếu 1 trong 4 nhóm / <8 ký tự / đặc biệt ngoài tập (EP8–EP12b, EP-NUM) | Thông báo "mật khẩu yếu", không tạo user |
| **Từ chối – thiếu confirm / không khớp** | thiếu trường xác nhận hoặc confirm ≠ password (EP15) | Thông báo "mật khẩu không khớp", không tạo user |
| **Từ chối – trường rỗng** | `name`/`email`/`password` rỗng (EP2, EP6, EP13) | Chặn submit / "trường bắt buộc", không tạo user |

> **Rút gọn TC (B5):** đã rà — không có TC trùng (mỗi TC khác nhau ở Input và/hoặc Expected Output).

---

### A.2. Boundary Value Analysis (Technique: BVA)

#### Bước 1 – Chọn biến đủ điều kiện BVA

BVA chỉ áp dụng cho biến **có thứ tự + có cận**. FR-01 dùng nhiều ràng buộc dạng "ít nhất N" → có tới **6 biến BVA**:

| Biến | Có thứ tự + cận? | Đưa vào BVA? | Lý do |
|------|------------------|--------------|-------|
| `name.length` | (min=1) | **** | SRS: ≥1 ký tự |
| `password.length` | (min=8) | **** | SRS: ≥8 ký tự |
| `password.uppercase_count` | (min=1) | **** | SRS: ≥1 chữ hoa |
| `password.lowercase_count` | (min=1) | **** | SRS: ≥1 chữ thường |
| `password.digit_count` | (min=1) | **** | SRS: ≥1 chữ số |
| `password.special_count` | (min=1) | **** | SRS: ≥1 ký tự đặc biệt `@$!%*?&` |
| `email` | | | Ràng buộc định dạng/uniqueness — đã xử lý ở EP |
| `confirmPassword` | | | Ràng buộc bằng nhau — đã xử lý ở EP15 |

#### Bước 2 – Xác định cận (bounds)

| Biến | Cận dưới (min) | Cận trên | Inclusive? |
|------|---------------|----------|------------|
| `name.length` | **1** | Không quy định | Inclusive (`≥`) |
| `password.length` | **8** | Không quy định | Inclusive (`≥`) |
| `password.uppercase_count` | **1** | Không quy định | Inclusive (`≥`) |
| `password.lowercase_count` | **1** | Không quy định | Inclusive (`≥`) |
| `password.digit_count` | **1** | Không quy định | Inclusive (`≥`) |
| `password.special_count` | **1** | Không quy định | Inclusive (`≥`) |

> SRS không đặt cận trên → thêm TC kiểm **giới hạn ẩn** của hệ thống (`name.length=256`, `password.length=129`).

#### Bước 3 – Sinh giá trị biên (3-value BVA)

| Biến | min−1 (reject) | **min** (accept) | min+1 (accept) | giá trị lớn (giới hạn ẩn) |
|------|---------------|-----------------|----------------|---------------------------|
| `name.length` | 0 (`""`) | **1** (`"A"`) | 2 (`"AB"`) | 256 (`"A"×256`) |
| `password.length` | 7 (`Aa1!bcx`) | **8** (`Aa1!bcxy`) | 9 (`Aa1!bcxyz`) | 129 (`Aa1!`+`x`×125) |
| `password.uppercase_count` | 0 (`aa1!bcxy`) | **1** (`Aa1!bcxy`) | 2 (`AAa1!bxy`) | — |
| `password.lowercase_count` | 0 (`AA1!BCXY`) | **1** (`AAa1!BCX`) | 2 (`AAab1!CX`) | — |
| `password.digit_count` | 0 (`Aaa!bcxy`) | **1** (`Aa1!bcxy`) | 2 (`Aa12!bxy`) | — |
| `password.special_count` | 0 (`Aa12bcxy`) | **1** (`Aa1!bcxy`) | 2 (`Aa1!!bxy`) | — |

> Khi test 1 biến, mọi biến khác giữ hợp lệ. Ví dụ test `uppercase_count=0` → `aa1!bcxy` (8 ký tự, 0 hoa, đủ thường/số/đặc biệt).

#### Bước 4 – Test case BVA & kết quả thực thi

| TC ID | Nhóm | Biên | Input password | Expected | Actual | Result | Bug |
|-------|------|------|----------------|----------|--------|--------|-----|
| TC-REGISTER-002 † | B1 name | len=0 (min−1) | `Password 1` (name=`""`) | Từ chối | HTML5 `required` chặn → đúng | Pass † | — |
| TC-REGISTER-022 | B1 name | len=1 (min) | `Password 1` (name=`"A"`) | Chấp nhận | Tạo user (200) | Pass | — |
| TC-REGISTER-023 | B1 name | len=2 (min+1) | `Password 1` (name=`"AB"`) | Chấp nhận | Tạo user | Pass | — |
| TC-REGISTER-036 | B1 name | len=256 | `Password 1` (name 256 ký tự) | Chấp nhận | API tạo user | Pass | — |
| TC-REGISTER-010 | B2 pwd.len | len=7 (min−1) | `Aa1!bcx` | Từ chối (quá ngắn) | Form chặn | Pass\* | — |
| TC-REGISTER-011 | B2 pwd.len | len=8 (min) | `Aa1!bcxy` | **Chấp nhận** | Form chặn "yếu" | Fail | BUG-A1 |
| TC-REGISTER-012 | B2 pwd.len | len=9 (min+1) | `Aa1!bcxyz` | **Chấp nhận** | Form chặn "yếu" | Fail | BUG-A1 |
| TC-REGISTER-037 | B2 pwd.len | len=129 | `Aa1!`+`x`×125 | Chấp nhận | API tạo user | Pass | — |
| TC-REGISTER-024 | B3 upper | count=0 (min−1) | `aa1!bcxy` | Từ chối | Form chặn | Pass\* | — |
| TC-REGISTER-025 | B3 upper | count=1 (min) | `Aa1!bcxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |
| TC-REGISTER-026 | B3 upper | count=2 (min+1) | `AAa1!bxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |
| TC-REGISTER-027 | B4 lower | count=0 (min−1) | `AA1!BCXY` | Từ chối | Form chặn | Pass\* | — |
| TC-REGISTER-028 | B4 lower | count=1 (min) | `AAa1!BCX` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |
| TC-REGISTER-029 | B4 lower | count=2 (min+1) | `AAab1!CX` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |
| TC-REGISTER-030 | B5 digit | count=0 (min−1) | `Aaa!bcxy` | Từ chối | Form chặn | Pass\* | — |
| TC-REGISTER-031 | B5 digit | count=1 (min) | `Aa1!bcxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |
| TC-REGISTER-032 | B5 digit | count=2 (min+1) | `Aa12!bxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |
| TC-REGISTER-033 | B6 special | count=0 (min−1) | `Aa12bcxy` | Từ chối | Form chặn | Pass\* | — |
| TC-REGISTER-034 | B6 special | count=1 (min) | `Aa1!bcxy` | **Chấp nhận** | Form chặn (BUG-A1, `!` ∈ tập hợp lệ nhưng bị regex cấm) | Fail | BUG-A1 |
| TC-REGISTER-035 | B6 special | count=2 (min+1) | `Aa1!!bxy` | **Chấp nhận** | Form chặn (BUG-A1) | Fail | BUG-A1 |

> † TC-002/010/011/012 tái dùng từ Domain Testing (biên có sẵn). **16 TC mới của BVA: TC-022 → TC-037.**
> \* Pass\* = đúng kết quả nhưng sai lý do (regex lỗi BUG-A1, không phải vì thiếu nhóm ký tự).

**Giải thích từng bước:**
1. **Chọn biến (Bước 1):** loại `email`/`confirmPassword` (không phải dải số); giữ 6 biến "ít nhất N".
2. **Xác định cận (Bước 2):** mọi cận đều **inclusive** (`≥`). Nhầm thành `>` sẽ xem min=8 là invalid → sai cả bộ. Không có cận trên → thêm TC giới hạn ẩn.
3. **Sinh 3 giá trị biên (Bước 3):** min−1 (reject), min (accept — **điểm nguy hiểm nhất**), min+1 (accept).
4. **Single-variable (Bước 4):** mỗi TC chỉ đẩy 1 biến sang biên, giữ biến khác hợp lệ.
5. **Phát hiện chính:** BVA phơi bày rõ nhất **BUG-A1** — **10/10 điểm biên min (hợp lệ, lẽ ra PASS)** của nhóm B2–B6 đều bị form từ chối sai. Đây là bằng chứng mạnh nhất cho mức Critical/P0.
6. **Đối chiếu lớp API:** gửi thẳng các giá trị biên qua API → backend trả `200` cho **tất cả** (kể cả len=7, thiếu nhóm) → backend không enforce luật mật khẩu nào (liên quan BUG-A2). Log: [test-cases/run-tests.sh](../test-cases/run-tests.sh).

**Giả định:** (a) không có cận trên `name`/`password` → test 1 giá trị lớn dò giới hạn ẩn; (b) `special_count` chỉ đếm ký tự trong `@$!%*?&`; (c) `name.length` đo sau khi trim.

---

### A.3. AI Gap Analysis

| Test case / bug AI dễ bỏ sót | Vì sao AI sót |
|------------------------------|----------------|
| Mật khẩu đúng spec (`Password123!`) bị **từ chối** (TC-001) | Prompt chung chung khiến AI chỉ kiểm "mật khẩu yếu bị chặn", quên chiều ngược (mật khẩu mạnh bị chặn sai). Con người phải chủ động thêm ca all-valid. |
| "Pass vì lý do sai" (TC-007/013/014/020/021) | AI chấm theo *kết quả* (bị chặn = đúng) mà bỏ qua *nguyên nhân* (chặn nhầm do regex). Phải đọc source `Register.jsx:15`. |
| Thiếu phủ EP8/EP10/EP11 của `password` | AI thường dừng ở 1–2 đại diện mật khẩu yếu, không tách đủ các luật con → coverage thưa. |
| Thiếu trường Xác nhận mật khẩu (TC-009) | AI test theo API spec (chỉ name/email/password) nên không thấy thiếu field UI; phải đối chiếu SRS FR-01. |
| Email trùng / plaintext (BUG-A3/A6) | AI dễ bỏ ràng buộc *liên dữ liệu* (uniqueness) và yêu cầu *bảo mật* (SEC-01) nếu prompt không nhắc. |
| Tên chỉ-khoảng-trắng vượt `required` (TC-015) | AI coi `required` là đủ; bỏ qua việc HTML `required` không trim khoảng trắng. |
| Tên toàn số / chứa HTML (TC-016/017) | SRS không nêu format `name` → AI bỏ qua; cần giả định nghiệp vụ + nghĩ tới stored XSS. |
| BVA: chỉ test `password.length`, bỏ 5 biến count | AI hiểu "BVA password" = chỉ độ dài; không tách "≥1 hoa/thường/số/đặc biệt" thành 5 biến BVA riêng. |
| BVA: `name.length` min=1, giới hạn ẩn (TC-022/036/037) | AI bỏ biến `name` vì "không có dải số"; không thêm TC dò giới hạn ẩn khi spec không nêu max. |
| BVA: inclusive vs exclusive | AI dễ viết `> 8` thay vì `≥ 8` → sai toàn bộ 3-value set. |

---

### A.4. Bug phát hiện (định dạng theo slide: `[BUG][module] …` + Found by Test Case)

| Bug ID | Tiêu đề GitHub Issue | Found by | Severity | Priority | Vị trí | Issue |
|--------|----------------------|----------|----------|----------|--------|-------|
| BUG-A1 | `[BUG][module: register] Regex mật khẩu đòi khoảng trắng & cấm ký tự đặc biệt` | TC-REGISTER-001, 006, 011, 012, 025–035 | Critical | P0 | `frontend-web/src/pages/Register.jsx:15` | [#17](https://github.com/DuyITLOR/group05_eshop/issues/17) |
| BUG-A2 | `[BUG][module: register] API /register không validate đầu vào` | TC-REGISTER-003, 015, 016, 017, 018, 019 | Critical | P1 | `backend/server.js:20` | [#18](https://github.com/DuyITLOR/group05_eshop/issues/18) |
| BUG-A3 | `[BUG][module: register] Email không duy nhất (cho phép trùng)` | TC-REGISTER-004 | Major | P1 | `backend/database.js:50`, `server.js:20` | [#19](https://github.com/DuyITLOR/group05_eshop/issues/19) |
| BUG-A4 | `[BUG][module: register] Form thiếu trường Xác nhận mật khẩu` | TC-REGISTER-009 | Major | P2 | `frontend-web/src/pages/Register.jsx` | [#20](https://github.com/DuyITLOR/group05_eshop/issues/20) |
| BUG-A5 | `[BUG][module: register] Email field dùng type="text" thay vì type="email"` | (kiểm tra UI/source) | Minor | P3 | `frontend-web/src/pages/Register.jsx:48` | [#21](https://github.com/DuyITLOR/group05_eshop/issues/21) |
| BUG-A6 | `[BUG][module: register] Mật khẩu lưu plaintext (SEC-01)` | TC-REGISTER-001 (kiểm bảo mật) | Critical | P1 | `backend/server.js:23,52,114`, DB | [#22](https://github.com/DuyITLOR/group05_eshop/issues/22) |

> **Lưu ý phạm vi:** BUG-A1..A4 tìm bằng **Domain Testing / BVA**; BUG-A5 (kiểm tra thuộc tính HTML) và BUG-A6 (kiểm thử bảo mật) là *findings ngoài 2 kỹ thuật chính*, vẫn báo theo yêu cầu "report all discovered bugs". Chi tiết steps/evidence: [bug-report/bug-report.md](../bug-report/bug-report.md). Mỗi bug tạo Issue trên repo fork nhóm rồi điền số `#`.

---
---

<a name="feature-b"></a>
## Feature B – FR-07: Giỏ hàng

- **Requirement ID:** FR-07 (kèm FR-06 cho ô Số lượng)
- **Module:** `CART`
- **SUT:** `/products/:id` (ô Số lượng) → `/cart` → API `POST/GET /api/cart`
- Actual = dự đoán từ source (giỏ là React state `CartContext`); cần chạy UI xác nhận + chụp ảnh.

### B.0. Mô tả feature & đặc tả

Cho phép thêm sản phẩm vào giỏ, chỉnh số lượng, xóa, xem tổng tiền.
**Đặc tả (SRS FR-07 + FR-06):** ô Số lượng nhận **số nguyên ≥ 1**; thêm cùng SP → **gộp** (không tạo dòng mới); cột số lượng có **+/-**; nút Xóa có **dialog xác nhận**; nhãn **"Tổng cộng"**; giỏ trống có **hình minh họa**; có nút **Tiếp tục mua sắm**.

> **Phạm vi & biên FR-06 ↔ FR-07:** ô **nhập** Số lượng + luật "≥ 1" thuộc **FR-06** (`/products/:id`); **hệ quả** (thành tiền, tổng giỏ) và **chỉnh +/-** thuộc **FR-07** (`/cart`). Nút +/- bị thiếu (BUG-B5) nên `quantity` chỉ nhập được ở FR-06 nhưng **lỗi lộ ra ở FR-07** → các TC `quantity` là **biên liên FR-06↔FR-07** (đi theo dòng dữ liệu).

### B.1. Domain Testing (Equivalence Partitioning)

#### Bước 1 – Xác định biến đầu vào

| # | Biến | Kiểu | Nguồn | Ghi chú |
|---|------|------|-------|---------|
| 1 | `quantity` | integer | Ô "Số lượng" (`ProductDetail.jsx`, `type="number"`) → `addToCart` → dòng giỏ | **Biến chính**; FR-06: nguyên ≥ 1 |
| 2 | `product` | object {id, name, price} | Chọn từ trang sản phẩm | Dùng cho **luật gộp** trùng (FR-07) |
| 3 | `cartOp` | enum | add / increase(+) / decrease(−) / remove / **continueShopping** | Hành vi giỏ (FR-07) |

> Biến rút từ **đặc tả FR-07/FR-06**, không từ UI. Nhờ vậy phát hiện UI thiếu nút +/- và không validate `quantity`.

#### Bước 2 – Xác định domain (miền hợp lệ)

| Biến | Miền HỢP LỆ | Ràng buộc / luật |
|------|-------------|------------------|
| `quantity` | Số nguyên ≥ 1 | FR-06 ("số nguyên dương, tối thiểu 1"); SRS không nêu cận trên (không kiểm tồn kho). |
| `product` | Sản phẩm tồn tại | Thêm trùng → phải gộp (FR-07). |
| `cartOp` | add / + / − / remove / continueShopping | remove cần dialog xác nhận; continueShopping → về trang chủ. |

#### Bước 3 – Phân vùng tương đương (Equivalence Partitions)

| Biến | Vùng HỢP LỆ (valid) | Vùng KHÔNG hợp lệ (invalid) |
|------|---------------------|------------------------------|
| `quantity` | **EP1**: số nguyên ≥ 1 | **EP2**: = 0 · **EP3**: âm (<0) · **EP4**: thập phân (`2.5`) · **EP5**: không phải số / rỗng |
| `product` (luật gộp) | **EP6**: sản phẩm **mới** | **EP7**: sản phẩm **đã có** → phải gộp, không tạo dòng mới |
| `cartOp` (hành vi FR-07) | **EP8**: thao tác hợp lệ (remove / +/- / continueShopping) | **EP9**: thao tác ngoài tập (không khả thi từ UI) |

#### Bước 4 – Chọn điểm đại diện

| Vùng | Đại diện | Loại điểm |
|------|----------|-----------|
| EP1 `quantity` hợp lệ | `1` (min) ; `5` (typical) | **on** (1) / in (5) |
| EP2 / EP3 / EP4 / EP5 | `0` / `-3` / `2.5` / `""` | out (EP2 = **off** = biên min−1) |
| EP6 / EP7 `product` | iPhone (mới) / iPhone (thêm lần 2) | in / combination |
| EP8 `cartOp` | remove · +/- · continueShopping | mỗi thao tác 1 đại diện |

> **Chuyển cho BVA:** biên `quantity` tại **0 (off) / 1 (on) / 2 (in)** → xử lý ở mục B.2 (TC-CART-014/015).

**Bước 5 – Test case & kết quả:**

| TC ID | Biến/Thao tác | Input | Vùng | Expected (SRS) | Actual (từ source) | Result | Bug |
|-------|---------------|-------|------|----------------|--------------------|--------|-----|
| TC-CART-001 | quantity | `1` | EP1 | Thêm, qty=1 | Thêm OK | Pass | — |
| TC-CART-002 | quantity | `5` | EP1 | Thêm, qty=5 | Thêm OK | Pass | — |
| TC-CART-003 | quantity | `0` | EP2 | Từ chối | Thêm qty=0 | Fail | BUG-B1 |
| TC-CART-004 | quantity | `-3` | EP3 | Từ chối | Thêm qty âm → tổng âm | Fail | BUG-B1 |
| TC-CART-005 | quantity | `2.5` | EP4 | Từ chối (phải nguyên) | `parseInt`→2 (cắt thầm) | Fail | BUG-B1 |
| TC-CART-006 | quantity | `""` | EP5 | Từ chối | `parseInt`→NaN → tổng NaN | Fail | BUG-B1 |
| TC-CART-007 | gộp trùng | add iPhone ×2 | EP7 | 1 dòng, qty=2 | 2 dòng trùng | Fail | BUG-B2 |
| TC-CART-008 | xóa (cartOp=remove) | bấm Xóa | EP8 | Có dialog xác nhận | Xóa ngay | Fail | BUG-B3 |
| TC-CART-009 | nhãn tổng *(spec-based)* | mở giỏ | — | "Tổng cộng" | "Tổng tạm tính" | Fail | BUG-B4 |
| TC-CART-010 | +/- (cartOp=incr/decr) | chỉnh qty trong giỏ | EP8 | Có nút +/- | Không có | Fail | BUG-B5 |
| TC-CART-011 | giỏ trống *(spec-based)* | mở `/cart` rỗng | — | Hình + thông báo | Chỉ text | Fail | BUG-B6 |
| TC-CART-013 | Tiếp tục mua sắm (cartOp=continueShopping) | bấm nút ở `/cart` | EP8 | Về trang chủ `/`, nhãn "Tiếp tục mua sắm" | Về trang chủ OK; nhãn "← Mua tiếp" lệch khi giỏ có hàng | Pass | (ứng viên B7, cosmetic) |

**Giải thích:** Biến trọng tâm `quantity` (single-fault qua 5 vùng EP1–EP5, là **biên liên FR-06↔FR-07**); `product` (EP6/EP7) kiểm luật gộp; `cartOp` (EP8) kiểm remove/+−/continueShopping. Riêng **nhãn tổng (TC-009), giỏ trống (TC-011)** là **specification-based** — sinh trực tiếp từ đặc tả, **không từ phân vùng** (FR-07 chủ yếu là luật hành vi/hiển thị). Expected suy từ SRS. *(TC-CART-012 "1-click" đã loại — thuộc FR-06, ngoài phạm vi.)*

#### Output & miền kết quả (Output partitions – EP B1/B2)

EP B1/B2 yêu cầu phân vùng cả **Output**. Các vùng kết quả của giỏ hàng (FR-07):

| Vùng Output | Giỏ ĐÚNG (kỳ vọng SRS) | Giỏ SAI (lỗi quan sát được) |
|-------------|------------------------|------------------------------|
| Thêm trùng SP | **Gộp** 1 dòng, qty cộng dồn | Dòng **trùng** (2 dòng cùng SP) |
| Tổng tiền | Tổng **đúng** (= Σ qty×giá) | Tổng **âm / NaN** (qty âm/rỗng) |
| Xóa SP | Có **dialog xác nhận** trước khi xóa | Xóa **ngay**, không hỏi |
| Nhãn tổng | Hiển thị **"Tổng cộng"** | Hiển thị **"Tổng tạm tính"** |
| Chỉnh số lượng | Có nút **+/-** trong giỏ | **Thiếu** nút +/- |
| Giỏ trống | **Có hình minh họa** + thông báo | **Thiếu hình** (chỉ text) |

> **Rút gọn TC (B5):** đã rà — không có TC trùng (mỗi TC khác nhau ở Input và/hoặc Expected Output).

### B.2. Boundary Value Analysis

Biến BVA **duy nhất** đủ điều kiện = `quantity` (biên dưới **inclusive = 1**; không có cận trên). Chi tiết: [test-cases/feature-B/boundary-value-analysis.md](../test-cases/feature-B/boundary-value-analysis.md).

**Cận (bounds):**

| Biến | Cận dưới | Cận trên | Inclusive? |
|------|----------|----------|------------|
| `quantity` | **1** | không quy định | cận dưới inclusive (`quantity ≥ 1`) |

**Sinh giá trị biên (3-value BVA):**

| Biến | min−1 | **min** | min+1 | giá trị lớn (giới hạn ẩn) |
|------|-------|---------|-------|---------------------------|
| `quantity` | 0 (reject) | **1** (accept) | 2 (accept) | 1.000.000 (Pass\*) |

**Test case BVA & kết quả:**

| TC ID | Biên | Input | Expected | Actual | Result | Bug |
|-------|------|-------|----------|--------|--------|-----|
| TC-CART-003 | 0 (min−1) | `0` | Từ chối | Thêm qty=0 | Fail | BUG-B1 |
| TC-CART-001 | 1 (min) | `1` | Chấp nhận | Thêm OK | Pass | — |
| TC-CART-014 | 2 (min+1) | `2` | Chấp nhận | Thêm OK | Pass | — |
| TC-CART-015 | 1 000 000 | lớn | Chấp nhận (no max) | Thêm OK (không kiểm tồn kho) | Pass\* | rủi ro tồn kho |

> Chỉ áp BVA cho `quantity` (biên số thật); `product`/`price` không phải dải → không ép BVA. BVA phơi bày BUG-B1 ngay tại biên 0.

### B.3. AI Gap Analysis

| AI dễ bỏ sót | Vì sao |
|--------------|--------|
| quantity 0/âm/thập phân/NaN | AI chỉ test "số dương"; quên ô `type=number` không chặn `min`. |
| Không gộp SP trùng (FR-07) | AI dừng ở "thêm được vào giỏ", không đối chiếu luật gộp. |
| Thiếu dialog xóa / nút +/- / sai nhãn | AI test theo API, bỏ qua chi tiết UI/UX trong SRS. |
| Nhãn nút "← Mua tiếp" ≠ "Tiếp tục mua sắm" | Lỗi từ ngữ nhỏ, chỉ sai khi giỏ có hàng (giỏ trống lại đúng) → dễ bỏ sót. |

### B.4. Bug phát hiện

| Bug ID | Tiêu đề | Found by | Severity | Priority | Vị trí | Issue |
|--------|---------|----------|----------|----------|--------|-------|
| BUG-B1 | Ô số lượng không validate (0/âm/thập phân/rỗng) | TC-CART-003/004/005/006 | Major | P1 | `ProductDetail.jsx` (input thiếu `min`), `parseInt` | [#51](https://github.com/DuyITLOR/group05_eshop/issues/51) |
| BUG-B2 | Thêm cùng SP không gộp (dòng trùng) | TC-CART-007 | Major | P2 | `CartContext.jsx` `addToCart` | [#52](https://github.com/DuyITLOR/group05_eshop/issues/52) |
| BUG-B3 | Nút Xóa không có dialog xác nhận | TC-CART-008 | Minor | P2 | `Cart.jsx` `removeFromCart` | [#53](https://github.com/DuyITLOR/group05_eshop/issues/53) |
| BUG-B4 | Nhãn "Tổng tạm tính" thay vì "Tổng cộng" | TC-CART-009 | Minor | P3 | `Cart.jsx` | [#54](https://github.com/DuyITLOR/group05_eshop/issues/54) |
| BUG-B5 | Thiếu nút +/- chỉnh số lượng | TC-CART-010 | Major | P2 | `Cart.jsx`, `CartContext.jsx` | [#55](https://github.com/DuyITLOR/group05_eshop/issues/55) |
| BUG-B6 | Giỏ trống thiếu hình minh họa | TC-CART-011 | Trivial | P3 | `Cart.jsx` | [#56](https://github.com/DuyITLOR/group05_eshop/issues/56) |

> Chi tiết: [bug-report/bug-report.md](../bug-report/bug-report.md). Tạo Issue trên repo nhóm rồi điền số `#`.

---

<a name="feature-c"></a>
## Feature C – FR-15: Quản lý sản phẩm (CRUD)

- **Requirement ID:** FR-15
- **Module:** `PRODUCT`
- **SUT:** Admin `http://localhost:5174` (tab Sản phẩm) → API `POST/PUT/DELETE /api/products`
- Actual = dự đoán từ source (`frontend-admin/src/App.jsx`, `backend/server.js`); cần chạy Admin UI xác nhận + chụp ảnh.

### C.0. Mô tả feature & đặc tả

Admin Thêm / Xem / Sửa / Xóa sản phẩm.
**Đặc tả (SRS FR-15):** **Tên** bắt buộc, **≤ 255 ký tự**; **Giá** bắt buộc, **số dương > 0**; **Danh mục** bắt buộc, **chọn từ danh sách có sẵn**; **Sửa 1 sản phẩm → chỉ sản phẩm đó đổi**, sản phẩm khác giữ nguyên.

### C.1. Domain Testing (Equivalence Partitioning)

#### Bước 1 – Xác định biến đầu vào

| # | Biến | Kiểu | Nguồn | Ghi chú |
|---|------|------|-------|---------|
| 1 | `name` | string | Ô "Tên sản phẩm" (`App.jsx`, `required`) → body API | bắt buộc, ≤ 255 ký tự |
| 2 | `price` | number | Ô "Giá tiền" (`type="number"`) → body API | bắt buộc, > 0 |
| 3 | `category_id` | enum (FK) | `<select>` từ danh mục có sẵn | bắt buộc, thuộc list |
| 4 | `imageUrl` | string | Ô "URL Ảnh" | SRS không ràng buộc → **ràng buộc giả định** (nên là URL hợp lệ) → TC-016 ngoài SRS |
| 5 | `description` | string | Ô "Mô tả" | SRS không ràng buộc → **ràng buộc giả định** (nên escape HTML) → TC-017 ngoài SRS |
| 6 | `productOp` | enum | CRUD: create / read / update / delete | chứa luật **sửa-cô-lập** |

#### Bước 2 – Xác định domain (miền hợp lệ)

| Biến | Miền HỢP LỆ | Ràng buộc |
|------|-------------|-----------|
| `name` | chuỗi 1–255 ký tự | bắt buộc, không rỗng |
| `price` | số > 0 | cận dưới **0 exclusive** |
| `category_id` | id thuộc danh mục có sẵn | FK hợp lệ |
| `imageUrl` / `description` | URL hợp lệ / text đã escape | **giả định** (SRS không quy định): imageUrl nên là URL, description nên escape |
| `productOp` | create/read/update/delete | update: chỉ SP được sửa đổi |

#### Bước 3 – Phân vùng tương đương (Equivalence Partitions)

| Biến | Vùng HỢP LỆ | Vùng KHÔNG hợp lệ |
|------|-------------|-------------------|
| `name` | **EP1**: 1–255 ký tự | **EP2**: rỗng/khoảng trắng · **EP3**: > 255 |
| `price` | **EP4**: > 0 | **EP5**: = 0 · **EP6**: âm · **EP7**: rỗng/không phải số |
| `category_id` | **EP8**: id tồn tại | **EP9**: id không tồn tại |
| `imageUrl` / `description` | **EP12 / EP13**: URL hợp lệ / text thường | **EP12b / EP13b** *(giả định)*: không phải URL / chứa HTML(XSS) |
| `productOp` (luật sửa) | **EP10**: sửa 1 SP → chỉ SP đó đổi | **EP11**: sửa lan sang SP khác |

#### Bước 4 – Chọn điểm đại diện

| Vùng | Đại diện | Loại |
|------|----------|------|
| EP1 / EP2 / EP3 `name` | `"Laptop Test"` / `""` / chuỗi 256 ký tự | in / out / **off (max+1)** |
| EP4 / EP5 / EP6 / EP7 `price` | `1000000` / `0` / `-1000` / `""` | in / **on (biên exclusive)** / out / out |
| EP8 / EP9 `category_id` | `1` / `9999` | in / out |
| EP12b / EP13b `imageUrl` / `description` | `"abc"` / `"<script>alert(1)</script>"` | out *(giả định)* |
| EP10 / EP11 `productOp` | sửa SP #1 → kỳ vọng chỉ #1 đổi | (rule) |

> **Chuyển cho BVA:** `name.length` (255/256/1) và `price` (0 exclusive / 1) → mục C.2 (TC-PRODUCT-011→015).

**Bước 5 – Test case & kết quả:**

> Baseline: `name="Laptop Test"` / `price=1000000` / `category_id=1` / `imageUrl="https://img.co"` / `description="Mô tả"`; mỗi TC đổi 1 trường.

| TC ID | Biến/Thao tác | Input (name / price / category_id / imageUrl / description) | Vùng | Expected (SRS) | Actual (từ source) | Result | Bug |
|-------|---------------|------------------------------------------------------------|------|----------------|--------------------|--------|-----|
| TC-PRODUCT-001 | thêm hợp lệ | `"Laptop Test"` / `1000000` / `1` / `"https://img.co"` / `"Mô tả"` | EP1+EP4+EP8 | Tạo OK | Tạo OK | Pass | — |
| TC-PRODUCT-002 | name rỗng | `""` / `1000000` / `1` / `"https://img.co"` / `"Mô tả"` | EP2 | Từ chối | UI `required` chặn (API thì backend nhận) | Pass † | (API: BUG-C4) |
| TC-PRODUCT-003 | name > 255 | `<256 ký tự>` / `1000000` / `1` / `"https://img.co"` / `"Mô tả"` | EP3 | Từ chối | Không `maxLength`/validate → lưu | Fail | BUG-C3 |
| TC-PRODUCT-004 | giá = 0 | `"Laptop Test"` / `0` / `1` / `"https://img.co"` / `"Mô tả"` | EP5 | Từ chối (>0) | Lưu giá 0 | Fail | BUG-C1 |
| TC-PRODUCT-005 | giá âm | `"Laptop Test"` / `-1000` / `1` / `"https://img.co"` / `"Mô tả"` | EP6 | Từ chối | Lưu giá âm | Fail | BUG-C1 |
| TC-PRODUCT-006 | giá rỗng | `"Laptop Test"` / `""` / `1` / `"https://img.co"` / `"Mô tả"` | EP7 | Từ chối | Ô Giá không `required` → lưu rỗng | Fail | BUG-C1 |
| TC-PRODUCT-007 | danh mục lạ *(chỉ API — UI dropdown)* | `"Laptop Test"` / `1000000` / `9999` / `"https://img.co"` / `"Mô tả"` (API) | EP9 | Từ chối | `category_id INTEGER` không FK, POST không validate → SP mồ côi | Fail | BUG-C4 |
| TC-PRODUCT-008 | sửa 1 SP (đổi tên) | sửa SP#1: `name→"TEST"` (4 trường giữ nguyên) | EP10/EP11 | Chỉ SP #1 đổi | `fakeMassUpdatedProducts` đổi tên **tất cả** SP | Fail | BUG-C2 |
| TC-PRODUCT-009 | xóa 1 SP | xóa SP#2 ( `—`/`—`/`—`/`—`/`—` ) | — | SP #2 mất, SP khác còn | Xóa đúng | Pass | — |
| TC-PRODUCT-010 | xem danh sách | mở tab ( `—`/`—`/`—`/`—`/`—` ) | — | Hiển thị đủ SP | Render đủ | Pass | — |
| TC-PRODUCT-016 | *(giả định)* imageUrl ≠ URL | `"Laptop Test"` / `1000000` / `1` / `"abc"` / `"Mô tả"` | EP12b | *(giả định)* nên validate URL | Lưu được; `onError` → ảnh placeholder (không vỡ UI) | Pass\* | (giả định, ngoài SRS) |
| TC-PRODUCT-017 | *(giả định)* description chứa script | `"Laptop Test"` / `1000000` / `1` / `"https://img.co"` / `"<script>…</script>"` | EP13b | *(giả định)* escape, không chạy | `{description}` auto-escape → hiện nguyên văn, không chạy | Pass | (XSS thật ở shipping_address/search — ngoài FR-15) |

**Giải thích:** 3 biến có ràng buộc SRS (`name`, `price`, `category_id`) test single-fault; `productOp` (EP10/EP11) kiểm luật **sửa-cô-lập** → bắt mass-update. 2 trường SRS không quy định (`imageUrl`/`description`) test bằng **ràng buộc giả định** (TC-016/017, ngoài SRS). `name.length` và `price` có biên số thật → chuyển BVA. Expected bám SRS; lỗi backend (name rỗng, category lạ) phải gọi API trực tiếp vì UI che bằng `required`/`select`.

#### Output & miền kết quả (Output partitions – EP B1/B2)

EP B1/B2 yêu cầu phân vùng cả **Output**. Các vùng kết quả của CRUD sản phẩm (FR-15):

| Vùng Output | OK (kỳ vọng SRS) | SAI (lỗi quan sát được) |
|-------------|------------------|-------------------------|
| Tạo / Sửa / Xóa | Tạo / sửa / xóa **thành công**, đúng SP | — |
| Sửa **cô lập** | Sửa 1 SP → **chỉ SP đó** đổi | **Mass-update**: đổi tên **tất cả** SP |
| Giá | Lưu giá **> 0** | Lưu **giá ≤ 0** (0/âm/rỗng) |
| Độ dài tên | Lưu tên **≤ 255** ký tự | Lưu **tên > 255** ký tự |
| Danh mục | FK thuộc danh mục có sẵn | **SP mồ côi danh mục** (category_id lạ, không FK) |

> **Rút gọn TC (B5):** đã rà — không có TC trùng (mỗi TC khác nhau ở Input và/hoặc Expected Output).

### C.2. Boundary Value Analysis

2 biến BVA đủ điều kiện: `name.length` (1–255, **inclusive cả 2 cận**) và `price` (cận dưới **0 exclusive**, không có cận trên). Chi tiết: [test-cases/feature-C/boundary-value-analysis.md](../test-cases/feature-C/boundary-value-analysis.md).

**Cận (bounds):**

| Biến | Cận dưới | Cận trên | Inclusive? |
|------|----------|----------|------------|
| `name.length` | **1** | **255** | cả 2 inclusive (`1 ≤ len ≤ 255`) |
| `price` | **0** | không quy định | cận dưới exclusive (`price > 0`) |

**Sinh giá trị biên (3-value BVA):**

| Biến | min−1 | **min** | min+1 | max−1 | **max** | max+1 | giá trị lớn (giới hạn ẩn) |
|------|-------|---------|-------|-------|---------|-------|---------------------------|
| `name.length` | 0 (reject) | **1** (accept) | 2 (accept) | 254 (accept) | **255** (accept) | 256 (reject) | — (đã có cận trên) |
| `price` | −1 (reject) | **0** (reject, exclusive) | 1 (accept) | — | (no max) | — | 999.999.999.999 (Pass\*) |

**Test case BVA & kết quả:**

| TC ID | Biến | Biên | Input | Expected | Actual | Result | Bug |
|-------|------|------|-------|----------|--------|--------|-----|
| TC-PRODUCT-013 | name.length | 1 (min) | `"A"` | Chấp nhận | Lưu OK | Pass | — |
| TC-PRODUCT-018 | name.length | 2 (min+1) | `"AB"` | Chấp nhận | Lưu OK | Pass | — |
| TC-PRODUCT-019 | name.length | 254 (max−1) | 254 ký tự | Chấp nhận | Lưu OK | Pass | — |
| TC-PRODUCT-011 | name.length | 255 (max) | 255 ký tự | Chấp nhận | Lưu OK | Pass | — |
| TC-PRODUCT-012 | name.length | 256 (max+1) | 256 ký tự | **Từ chối** | Vẫn lưu | Fail | BUG-C3 |
| TC-PRODUCT-005 *(tái dùng)* | price | −1 (min−1) | `-1000` | Từ chối | Lưu giá âm | Fail | BUG-C1 |
| TC-PRODUCT-014 | price | 0 (exclusive) | `0` | **Từ chối** (>0) | Lưu giá 0 | Fail | BUG-C1 |
| TC-PRODUCT-015 | price | 1 (hợp lệ nhỏ nhất) | `1` | Chấp nhận | Lưu OK | Pass | — |
| TC-PRODUCT-020 | price | giá trị lớn (giới hạn ẩn) | `999999999999` | Chấp nhận (no max) — nên kiểm tràn số | Lưu OK, không chặn | Pass\* | rủi ro giá tối đa |

> Chỉ áp BVA cho `name.length` & `price` (biên số thật); `category_id`/`productOp` rời rạc → giữ EP. BVA phơi bày BUG-C3 (256) và BUG-C1 (giá 0, biên exclusive).

### C.3. AI Gap Analysis

| AI dễ bỏ sót | Vì sao |
|--------------|--------|
| Giá 0/âm/rỗng | AI chỉ test "giá hợp lệ"; quên ô Giá thiếu `required`/`min` + backend không validate. |
| Tên > 255 ký tự | AI ít test biên độ dài; ô không `maxLength`. |
| **Tên dài làm tràn bảng, không có scroll → mất nút Sửa/Xóa** | AI chỉ kiểm "lưu được không", bỏ qua hệ quả hiển thị: `<table>` không có `overflow-x:auto` → cột Hành động bị đẩy ra ngoài viewport (phát hiện khi chạy TC-003 trên UI, liên quan BUG-C3). |
| Mass-update khi sửa | Bug ẩn `fakeMassUpdatedProducts`; AI không đối chiếu luật "chỉ SP đó đổi". |
| Endpoint thiếu auth admin | `POST/PUT/DELETE /api/products` không `authenticateToken` (bảo mật, ngoài phạm vi FR-15 — ghi nhận). |
| imageUrl/description không validate (TC-016/017, giả định) | Trường không ràng buộc SRS dễ bị bỏ; thực tế `onError` fallback + auto-escape → an toàn (Pass). |

### C.4. Bug phát hiện

| Bug ID | Tiêu đề | Found by | Severity | Priority | Vị trí | Issue |
|--------|---------|----------|----------|----------|--------|-------|
| BUG-C1 | Giá không validate (0/âm/rỗng) | TC-PRODUCT-004/005/006, 014 | Major | P1 | `App.jsx` (ô Giá thiếu `required`/`min`), `server.js` | [#78](https://github.com/DuyITLOR/group05_eshop/issues/78) |
| BUG-C2 | Sửa 1 SP đổi tên TẤT CẢ SP (mass-update) | TC-PRODUCT-008 | Critical | P1 | `App.jsx` `fakeMassUpdatedProducts` | [#79](https://github.com/DuyITLOR/group05_eshop/issues/79) |
| BUG-C3 | Tên không giới hạn 255 ký tự | TC-PRODUCT-003, 012 | Minor | P2 | `App.jsx` (no `maxLength`), `server.js` | [#80](https://github.com/DuyITLOR/group05_eshop/issues/80) |
| BUG-C4 | API không validate server-side (tên rỗng / danh mục lạ) | TC-PRODUCT-002(API), 007 | Major | P1 | `server.js` `POST/PUT /api/products` | [#81](https://github.com/DuyITLOR/group05_eshop/issues/81) |

> Chi tiết: [bug-report/bug-report.md](../bug-report/bug-report.md). Tạo Issue trên repo nhóm sau khi xác nhận UI rồi điền số `#`.

---

<a name="feature-d"></a>
## Feature D – Pool D (Mobile App): Hồ sơ cá nhân

- **Pool:** D — **Mobile App** · **Requirement (nghiệp vụ):** FR-04 · **Module:** `PROFILE` · **Mã nhóm:** D7
- **SUT:** App **Mobile** (React Native/Expo, `frontend-mobile/App.js`) → API `PUT /api/users/me`
- *Pool D trong đề là "Mobile App" (không liệt kê FR cụ thể) → đây là màn Hồ sơ trên app mobile, dùng lại ràng buộc nghiệp vụ FR-04.*
- Actual = đối chiếu source thật (`App.js` `handleUpdateProfile`, `server.js`); cần chạy app Mobile/API xác nhận + chụp ảnh.

### D.0. Mô tả feature & đặc tả

User đã đăng nhập cập nhật **Họ Tên / Số điện thoại / Địa chỉ giao hàng**.
**Đặc tả (SRS FR-04):** SĐT **bắt đầu `0`, 10–11 chữ số**; **Email không đổi** được; user **chỉ sửa hồ sơ của mình**, **không tự đổi `role`**.

### D.1. Domain Testing (Equivalence Partitioning)

#### Bước 1 – Xác định biến đầu vào

| # | Biến | Kiểu | Nguồn | Ghi chú |
|---|------|------|-------|---------|
| 1 | `phone` | string số | Ô "Số điện thoại" → body API | **Biến chính**; SRS: đầu `0`, 10–11 số |
| 2 | `name` | string | Ô "Họ Tên" | SRS không nêu ràng buộc |
| 3 | `shipping_address` | string | Ô "Địa chỉ giao hàng" | SRS không nêu ràng buộc |
| 4 | `email` | string | Ô Email (disabled) | **Bất biến** |
| 5 | `role` | enum | (chỉ qua body API) | **Bất biến với user** (bảo mật) |

#### Bước 2 – Xác định domain

| Biến | Miền HỢP LỆ | Ràng buộc |
|------|-------------|-----------|
| `phone` | đầu `0`, 10–11 chữ số | SRS FR-04; cận độ dài 10–11 inclusive |
| `name` | chuỗi non-blank | SRS không nêu (giả định non-blank) |
| `shipping_address` | chuỗi bất kỳ | không ràng buộc |
| `email` | giữ nguyên | không cho đổi |
| `role` | giữ nguyên | user không tự đổi |

#### Bước 3 – Phân vùng tương đương

| Biến | Vùng HỢP LỆ | Vùng KHÔNG hợp lệ |
|------|-------------|-------------------|
| `phone` | **EP1**: đầu `0`, 10–11 số | **EP2**: không đầu 0 · **EP3**: <10 số · **EP4**: >11 số · **EP5**: chứa chữ/rỗng |
| `name` | **EP6**: non-blank | **EP6b** *(giả định)*: rỗng/khoảng trắng |
| `shipping_address` | **EP7**: bất kỳ | — *(không ràng buộc)* |
| `email` (bất biến) | **EP8**: giữ nguyên | **EP8b**: cố đổi |
| `role` (bảo mật) | **EP9**: giữ nguyên | **EP9b**: user cố đổi `role` |

#### Bước 4 – Chọn điểm đại diện

| Vùng | Đại diện | Loại |
|------|----------|------|
| EP1 `phone` | `0912345678` (10) / `09123456789` (11) | in |
| EP2 / EP3 / EP4 / EP5 | `912345678` / `09123` / `012345678901` / `09abc45678`,`""` | out |
| EP6 / EP6b `name` | `Test User` / `""` | in / out |
| EP8b `email` / EP9b `role` | cố đổi email / gửi `role="admin"` | out |

> **Chuyển cho BVA:** `phone.length` tại **9/10/11/12** → mục D.2.

**Bước 5 – Test case & kết quả:**

| TC ID | Biến/Thao tác | Input (name / phone / shippingAddress) | Vùng | Expected (SRS) | Actual (từ source) | Result | Bug |
|-------|---------------|----------------------------------------|------|----------------|--------------------|--------|-----|
| TC-PROFILE-001 | SĐT 10 số đầu 0 | `"Test User"` / `0912345678` / `"123 NVA"` | EP1 | Chấp nhận | Mobile regex `^[1-9]…` từ chối (đòi đầu 1-9) | Fail | BUG-D1 |
| TC-PROFILE-002 | SĐT 11 số đầu 0 | `"Test User"` / `09123456789` / `"123 NVA"` | EP1 | Chấp nhận | Mobile từ chối | Fail | BUG-D1 |
| TC-PROFILE-003 | SĐT không đầu 0 | `"Test User"` / `912345678` / `"123 NVA"` | EP2 | **Từ chối** | Mobile **chấp nhận** (regex khớp) | Fail | BUG-D1 |
| TC-PROFILE-004 | SĐT quá ngắn | `"Test User"` / `09123` / `"123 NVA"` | EP3 | Từ chối | Mobile từ chối | Pass | — |
| TC-PROFILE-005 | SĐT chứa chữ | `"Test User"` / `09abc45678` / `"123 NVA"` | EP5 | Từ chối | Mobile từ chối | Pass | — |
| TC-PROFILE-006 | SĐT rỗng | `"Test User"` / `""` / `"123 NVA"` | EP5 | Từ chối | Mobile từ chối | Pass | — |
| TC-PROFILE-007 | Email không đổi | (thử sửa Email) | EP8b | Không đổi được | Ô disabled + backend không update email | Pass | — |
| TC-PROFILE-008 | User tự đổi role *(API)* | body `{"role":"admin"}` | EP9b | **Từ chối** | `if(role) UPDATE role` → thành admin | Fail | BUG-D2 |
| TC-PROFILE-009 | Lưu địa chỉ | nhập địa chỉ → Cập nhật → reload | EP7 | Địa chỉ được lưu | `shippingAddress`≠`shipping_address` → lưu NULL → mất sau reload | Fail | BUG-D3 |
| TC-PROFILE-010 | Chỉ sửa của mình | API token A sửa user B | — | Chỉ của mình | Backend dùng `req.user.id` → đúng | Pass | — |
| TC-PROFILE-011 | API không validate *(API)* | body `{"name":"","phone":"abc"}` | EP6b/EP5 | Từ chối | Backend lưu thẳng, không validate | Fail | BUG-D4 |

**Giải thích:** Biến chính `phone` (đầu 0, 10–11 số) test single-fault qua EP1–EP5; `email`/`role` là **luật bất biến/bảo mật**. Lỗi backend (`role`, không validate) chỉ lộ qua **API trực tiếp** (UI không gửi `role`, lại che bằng regex). `phone.length` có biên số thật → chuyển BVA. `name`/`address` SRS không ràng buộc.

#### Output & miền kết quả (Output partitions – EP B1/B2)

EP B1/B2 yêu cầu phân vùng cả **Output**. Các vùng kết quả của Hồ sơ cá nhân (FR-04):

| Vùng Output | OK (kỳ vọng SRS) | SAI (lỗi quan sát được) |
|-------------|------------------|-------------------------|
| Cập nhật hồ sơ | Lưu thành công Họ tên/SĐT/Địa chỉ | — |
| `email` / `role` bất biến | Email & role **giữ nguyên** | **Role bị đổi** (user tự leo quyền `admin`) |
| SĐT hợp lệ | SĐT đầu `0`, 10–11 số → **chấp nhận** | SĐT **hợp lệ bị từ chối** (regex đòi đầu 1-9) |
| SĐT không hợp lệ | SĐT sai (không đầu 0…) → **từ chối** | SĐT **sai được nhận** (không đầu 0 vẫn qua) |
| Địa chỉ | Địa chỉ **được lưu** & còn sau reload | Địa chỉ **không lưu** (lệch tên trường → NULL) |
| Validate phía server | Backend **validate** đầu vào | Backend **không validate** (lưu thẳng name rỗng/phone chữ) |

> **Rút gọn TC (B5):** đã rà — không có TC trùng (mỗi TC khác nhau ở Input và/hoặc Expected Output).

### D.2. Boundary Value Analysis

Biến BVA **duy nhất** = `phone.length` (cận **10–11, inclusive cả 2**). Chi tiết: [test-cases/feature-D/boundary-value-analysis.md](../test-cases/feature-D/boundary-value-analysis.md).

**Cận (bounds):**

| Biến | Cận dưới | Cận trên | Inclusive? |
|------|----------|----------|------------|
| `phone.length` | **10** | **11** | cả 2 inclusive (`10 ≤ len ≤ 11`) |

**Sinh giá trị biên (3-value BVA):** *(dải hẹp → 4 điểm duy nhất)*

| Biến | min−1 | **min** | **max** | max+1 |
|------|-------|---------|---------|-------|
| `phone.length` | 9 (`012345678` → reject) | **10** (`0912345678` → accept) | **11** (`09123456789` → accept) | 12 (`012345678901` → reject) |

**Test case BVA & kết quả:**

| TC ID | Biên | Input phone | Expected | Actual | Result | Bug |
|-------|------|-------------|----------|--------|--------|-----|
| TC-PROFILE-012 | 9 (min−1) | `012345678` | Từ chối | Mobile từ chối | Pass | — |
| TC-PROFILE-001 | 10 (min) | `0912345678` | Chấp nhận | Mobile **từ chối** (đầu 0) | Fail | BUG-D1 |
| TC-PROFILE-002 | 11 (max) | `09123456789` | Chấp nhận | Mobile **từ chối** | Fail | BUG-D1 |
| TC-PROFILE-013 | 12 (max+1) | `012345678901` | Từ chối | Mobile từ chối | Pass | — |

> BVA phơi bày BUG-D1 **ngay tại biên hợp lệ** (10/11 đáng PASS nhưng mobile từ chối) — giống cách Feature A lộ BUG-A1 tại biên.

### D.3. AI Gap Analysis

| AI dễ bỏ sót | Vì sao |
|--------------|--------|
| Regex SĐT lệch cận (9–10 thay vì 10–11, đầu 1-9 thay vì 0) | AI thấy "có validate" là cho qua, không so từng con số với SRS. |
| Leo thang đặc quyền `role` (TC-008) | Chỉ lộ qua API; UI không có ô role → dễ bỏ. **Bảo mật nghiêm trọng.** |
| Địa chỉ không lưu do lệch tên trường | `shippingAddress` (FE) ≠ `shipping_address` (BE) — phải đọc cả 2 phía. |
| Backend không validate | UI chặn → tưởng ổn; quên backend rỗng validate. |

### D.4. Bug phát hiện

| Bug ID | Tiêu đề | Found by | Severity | Priority | Vị trí | Issue |
|--------|---------|----------|----------|----------|--------|-------|
| BUG-D1 | Validate SĐT sai spec (đầu 1-9 + 9-10 số) | TC-PROFILE-001/002/003, 012-013 | Major | P1 | `App.js:287` regex | [#82](https://github.com/DuyITLOR/group05_eshop/issues/82) |
| BUG-D2 | Leo thang đặc quyền: user tự đổi `role` | TC-PROFILE-008 | Critical | P0 | `server.js:124` PUT /users/me | [#83](https://github.com/DuyITLOR/group05_eshop/issues/83) |
| BUG-D3 | Địa chỉ không lưu (lệch `shippingAddress`↔`shipping_address`) | TC-PROFILE-009 | Major | P1 | `App.js:302` / `server.js:119` | [#84](https://github.com/DuyITLOR/group05_eshop/issues/84) |
| BUG-D4 | API /users/me không validate server-side | TC-PROFILE-011 | Major | P1 | `server.js:118` | [#85](https://github.com/DuyITLOR/group05_eshop/issues/85) |

> Chi tiết: [bug-report/bug-report.md](../bug-report/bug-report.md). Tạo Issue sau khi xác nhận trên app/API rồi điền số `#`.
