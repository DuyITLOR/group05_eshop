# Domain Testing – Feature A (FR-01: Đăng ký tài khoản)

> **Sinh viên:** Lê Nhựt Duy – 23127178
> **SUT:** EShop – Trang `/register` (Frontend Web `:5173`) → API `POST /api/register`
> **Kỹ thuật:** Domain Testing / Equivalence Partitioning (EP). Phần Boundary Value Analysis (BVA) nằm ở file riêng (`boundary-value-analysis.md` / mục A.2 của main-report); ở đây chỉ **đánh dấu** các biên để chuyển sang BVA.
> **Quy ước mã:** Tái sử dụng tiền tố `TC-REGISTER-###` (module của FR-01 = `REGISTER`) thay cho `DT-FR01-###` để **truy vết liên file** đồng nhất với main-report, bug-report, traceability-matrix và test-run.

**Đặc tả đầu vào (FR-01 – SRS):**
- Bắt buộc: **Họ tên (`name`)**, **Email (`email`)**, **Mật khẩu (`password`)**.
- `email`: đúng định dạng `local@domain.tld` **và duy nhất** trong hệ thống.
- `password` mạnh: **≥ 8 ký tự**, có ≥1 chữ **hoa**, ≥1 chữ **thường**, ≥1 **số**, ≥1 **ký tự đặc biệt** thuộc tập `@ $ ! % * ? &`.
- Có trường **Xác nhận mật khẩu (`confirmPassword`)** — từ chối nếu **không khớp**.
- Thành công → chuyển trang `/login`.

---

## Bước 1 – Xác định biến đầu vào

| # | Biến | Kiểu | Nguồn | Ghi chú |
|---|------|------|-------|---------|
| 1 | `name` | string | Form field "Họ Tên" → body `name` | Bắt buộc |
| 2 | `email` | string | Form field "Email" → body `email` | Bắt buộc; định dạng + duy nhất |
| 3 | `password` | string | Form field "Mật khẩu" → body `password` | Bắt buộc; ràng buộc độ mạnh |
| 4 | `confirmPassword` | string | Form field "Xác nhận mật khẩu" (SRS yêu cầu) | Bắt buộc; **ràng buộc liên biến** với `password` |

> Biến rút từ **đặc tả nghiệp vụ FR-01**, không phải từ UI thực tế. (Thực tế form `Register.jsx` **thiếu** trường `confirmPassword` — đây chính là một khiếm khuyết, xem BUG-A4.)

> **EP xét cả Input VÀ Output (Week 03 – Bước 1):** Ngoài 4 biến đầu vào ở trên, kỹ thuật EP còn phân vùng **đầu ra (Output)** của feature. Output của FR-01 gồm 2 nhóm: **(1) Thành công** → tạo user + chuyển trang `/login`; **(2) Từ chối** kèm thông báo lỗi tương ứng (`Họ tên bắt buộc`, `Email không hợp lệ`, `Email đã tồn tại`, `Mật khẩu quá yếu`, `Mật khẩu không khớp`). Miền giá trị chi tiết của Output xem **Bước 2** và **Bước 2b**.

---

## Bước 2 – Xác định domain (miền hợp lệ) của từng biến

| Biến | Miền HỢP LỆ | Ràng buộc / luật |
|------|-------------|------------------|
| `name` | Chuỗi **không rỗng, không chỉ gồm khoảng trắng** (1…n ký tự) | Bắt buộc. SRS không nêu cận trên → coi mọi chuỗi non-blank là hợp lệ. |
| `email` | Đúng định dạng `local@domain.tld` **VÀ** chưa tồn tại trong DB | Bắt buộc, **duy nhất**. |
| `password` | `length ≥ 8` **VÀ** đủ 4 nhóm: 1 hoa `[A-Z]`, 1 thường `[a-z]`, 1 số `[0-9]`, 1 ký tự đặc biệt thuộc `@$!%*?&` | Bắt buộc. Ký tự đặc biệt **phải nằm trong tập** đã quy định. |
| `confirmPassword` | Bằng **đúng** giá trị `password` (so khớp tuyệt đối) | Bắt buộc; phụ thuộc `password`. |

**Miền giá trị của Output (kết quả trả về của feature):** EP (Week 03 – Bước 2) yêu cầu xác định miền giá trị **cho cả Input lẫn Output**. Miền Output của FR-01 là tập rời nhau:

> **Output domain** = { **Thành công** → tạo user + chuyển `/login` } ∪ { **Từ chối**: `"Họ tên bắt buộc"`, `"Email không hợp lệ"`, `"Email đã tồn tại"`, `"Mật khẩu quá yếu"`, `"Mật khẩu không khớp (confirm)"` }.

---

## Bước 2b – Miền giá trị Output (kết quả)

Phân vùng tương đương trên **đầu ra**: mỗi giá trị Output rơi vào đúng một vùng. Đây là cơ sở để xác định cột **Expected** trong bảng test case ở Bước 5 (mỗi Expected phải khớp một vùng Output dưới đây).

| Vùng Output | Loại | Thông báo / hành vi mong đợi | Biến input gây ra (vùng invalid) |
|-------------|------|------------------------------|----------------------------------|
| **O1 – Thành công** | hợp lệ | Tạo user thành công + **chuyển trang `/login`** | Tất cả input ở vùng valid (EP1,3,7,14) |
| **O2 – Từ chối: tên** | invalid | `"Họ tên bắt buộc"` (hoặc tên không hợp lệ) | `name` ∈ {EP2, EP2b, EP2c, EP2d} |
| **O3 – Từ chối: email sai định dạng** | invalid | `"Email không hợp lệ"` | `email` ∈ {EP4a–g, EP6} |
| **O4 – Từ chối: email trùng** | invalid | `"Email đã tồn tại"` | `email` ∈ {EP5} |
| **O5 – Từ chối: mật khẩu yếu** | invalid | `"Mật khẩu quá yếu"` | `password` ∈ {EP8–EP13, EP12b, EP-NUM} |
| **O6 – Từ chối: confirm không khớp** | invalid | `"Mật khẩu không khớp"` | `confirmPassword` ∈ {EP15} |

> **Nhất quán Input↔Output:** cột "Expected (SRS)" ở Bước 5 đối chiếu trực tiếp với các vùng O1–O6 trên. Ví dụ: TC-001 → **O1**; TC-002/015/016/017 → **O2**; TC-003/005/018/019 → **O3**; TC-004 → **O4**; TC-006/007/008/013/014/020/021 → **O5**; TC-009 → **O6**.

---

## Bước 3 – Phân vùng tương đương (Equivalence Partitions)

Các vùng được thiết kế **rời nhau (disjoint)** và **phủ kín (complete)** — mọi giá trị đầu vào rơi vào đúng một vùng. Vùng KHÔNG hợp lệ được **tách nhỏ tối đa** để tìm được nhiều trường hợp lỗi (mỗi luật con của spec = một lớp riêng).

| Biến | Vùng HỢP LỆ (valid) | Vùng KHÔNG hợp lệ (invalid) |
|------|---------------------|------------------------------|
| `name` | **EP1**: chuỗi chữ cái non-blank (`Nguyen Van A`) | **EP2**: rỗng `""` · **EP2b**: chỉ khoảng trắng `"   "` · **EP2c**: chỉ gồm **chữ số** `"12345"` · **EP2d**: chứa ký tự đặc biệt / thẻ HTML `"<b>x</b>"`, `"@@@"` |
| `email` | **EP3**: đúng định dạng `local@domain.tld` & chưa tồn tại | **EP4**: sai định dạng *(xem 7 đại diện con bên dưới)* · **EP5**: trùng (`test@eshop.com`) · **EP6**: rỗng `""` |
| `password` | **EP7**: ≥8 ký tự & đủ 4 nhóm | **EP8**: <8 ký tự · **EP9**: thiếu **hoa** · **EP10**: thiếu **thường** · **EP11**: thiếu **số** · **EP12**: thiếu ký tự **đặc biệt** · **EP12b**: dùng ký tự đặc biệt **ngoài** tập `@$!%*?&` (`Password123#`) · **EP13**: rỗng `""` · **EP-NUM**: chỉ gồm **chữ số** `"12345678"` (vi phạm đồng thời EP9+EP10+EP12) |
| `confirmPassword` | **EP14**: khớp `password` | **EP15**: không khớp |

**Tách nhỏ EP4 (email sai định dạng)** — cùng một lớp tương đương "sai định dạng" nhưng nhiều đại diện để dò nhiều kiểu lỗi parser:

| ID con | Mô tả | Ví dụ |
|--------|-------|-------|
| EP4a | thiếu ký tự `@` | `abcdomain.com` |
| EP4b | thiếu local-part | `@domain.com` |
| EP4c | thiếu domain | `user@` |
| EP4d | thiếu TLD | `user@domain` |
| EP4e | nhiều `@` | `a@b@c.com` |
| EP4f | chứa khoảng trắng | `user name@domain.com` |
| EP4g | chỉ gồm **chữ số**, không cấu trúc email | `12345` |

> **Phân biệt spec-grounded vs giả định:**
> - Bám SRS trực tiếp: EP2, EP4 (a–g), EP5, EP6, EP8–EP13, EP12b, EP15.
> - **Theo giả định nghiệp vụ** (SRS FR-01 không quy định format `name`): **EP2c** (tên toàn số), **EP2d** (tên chứa ký tự đặc biệt/HTML). Vẫn đưa vào vì (1) form đăng ký thật cần chặn, (2) phơi bày việc backend **không hề** validate (BUG-A2) và rủi ro **stored XSS** với EP2d.

---

## Bước 4 – Chọn điểm đại diện (representative points)

Mỗi vùng chọn tối thiểu 1 đại diện. Với biến **có thứ tự** (`password.length`) phân loại điểm **in / on / off / out** để bắc cầu sang BVA.

| Vùng | Đại diện đã chọn | Loại điểm |
|------|------------------|-----------|
| EP1 `name` hợp lệ | `Nguyen Van A` | typical (in) |
| EP2 `name` rỗng | `""` | out |
| EP2b `name` chỉ khoảng trắng | `"   "` | out |
| EP2c `name` toàn chữ số | `"12345"` | out *(giả định)* |
| EP2d `name` ký tự đặc biệt/HTML | `"<b>x</b>"` | out *(giả định, XSS)* |
| EP3 `email` hợp lệ | `new01@domain.com` | in |
| EP4a `email` thiếu `@` | `abcdomain.com` | out |
| EP4b `email` thiếu local-part | `@domain.com` | out |
| EP4c `email` thiếu domain | `user@` | out |
| EP4d `email` thiếu TLD | `user@domain` | out |
| EP4e `email` nhiều `@` | `a@b@c.com` | out |
| EP4f `email` có khoảng trắng | `user name@d.com` | out |
| EP4g `email` toàn chữ số | `"12345"` | out |
| EP5 `email` trùng | `test@eshop.com` (seed sẵn) | out |
| EP6 `email` rỗng | `""` | out |
| EP7 `password` hợp lệ | `Password123!` (12 ký tự, đủ 4 nhóm) | in |
| EP8 `password` <8 | `Pass12!` (**7** ký tự) | **off** (= biên min−1) |
| — biên độ dài | **8** = `Pass123!` | **on** (biên min hợp lệ) |
| — biên độ dài | **9** = `Pass1234!` | **in** (min+1) |
| EP9 thiếu hoa | `password123!` | out |
| EP10 thiếu thường | `PASSWORD123!` | out |
| EP11 thiếu số | `Password!` | out |
| EP12 thiếu đặc biệt | `Password 1` (có k.trắng) ; `Password123` (không k.trắng) | out |
| EP12b đặc biệt ngoài tập | `Password123#` (`#` ∉ `@$!%*?&`) | out |
| EP13 `password` rỗng | `""` | out |
| EP-NUM `password` toàn số | `"12345678"` | out |
| EP14 confirm khớp | = `password` | in |
| EP15 confirm lệch | `Khac1` | out |

> **Chuyển cho BVA:** biên `password.length` tại **7 (off) / 8 (on) / 9 (in)** → xử lý trong skill `boundary-value-analysis` (TC-REGISTER-010/011/012).

---

## Bước 5 – Thiết kế test case (luật single-fault: chỉ thả 1 biến sang vùng không hợp lệ, các biến còn lại giữ hợp lệ)

| Test Case ID | Tiêu đề | Biến đang test | Input (name / email / password / confirm) | Vùng phủ | Expected (SRS) | Actual | Result | Bug |
|--------------|---------|----------------|--------------------------------------------|----------|----------------|--------|--------|-----|
| TC-REGISTER-001 | Tất cả hợp lệ (mốc) | — | `Nguyen Van A` / `new01@domain.com` / `Password123!` / khớp | EP1,3,7,14 | Đăng ký thành công → `/login` | Form **chặn** "Mật khẩu quá yếu!" dù đúng spec | Fail | BUG-A1 |
| TC-REGISTER-002 | Tên rỗng | `name` | `""` / `new02@domain.com` / `Password 1` / khớp | EP2 | Từ chối "Họ tên bắt buộc" | Trình duyệt chặn submit bằng HTML5 `required` ("Please fill out this field") → form từ chối **đúng**, API không được gọi | Pass † | — |
| TC-REGISTER-003 | Email sai định dạng | `email` | `Nguyen Van A` / `abc` / `Password 1` / khớp | EP4 | Từ chối "Email không hợp lệ" | Tạo user với email `abc` (HTTP 200) | Fail | BUG-A2 |
| TC-REGISTER-004 | Email trùng | `email` | `Nguyen Van A` / `test@eshop.com` / `Password 1` / khớp | EP5 | Từ chối "Email đã tồn tại" | Tạo thêm user trùng email (HTTP 200, id mới) | Fail | BUG-A3 |
| TC-REGISTER-005 | Email rỗng | `email` | `Nguyen Van A` / `""` / `Password 1` / khớp | EP6 | Từ chối | HTML5 `required` chặn submit ("Please fill out this field") → form từ chối **đúng** | Pass † | — |
| TC-REGISTER-006 | Mật khẩu thiếu đặc biệt (**có** khoảng trắng) | `password` | `Nguyen Van A` / `new06@domain.com` / `Password 1` / khớp | EP12 | Từ chối (yếu) | Form **chấp nhận** → tạo user mật khẩu yếu | Fail | BUG-A1 |
| TC-REGISTER-007 | Mật khẩu thiếu chữ hoa | `password` | `Nguyen Van A` / `new07@domain.com` / `password123!` / khớp | EP9 | Từ chối | Form chặn "yếu" | Pass\* | — |
| TC-REGISTER-008 | Mật khẩu rỗng | `password` | `Nguyen Van A` / `new08@domain.com` / `""` / khớp | EP13 | Từ chối | HTML5 `required` chặn submit ("Please fill out this field") → form từ chối **đúng** | Pass † | — |
| TC-REGISTER-009 | Xác nhận mật khẩu không khớp | `confirmPassword` | `Nguyen Van A` / `new09@domain.com` / `Password 1` / `Khac1` | EP15 | Từ chối "Mật khẩu không khớp" | Form **không có** trường Xác nhận mật khẩu | Fail | BUG-A4 |
| **TC-REGISTER-013** *(mới)* | Mật khẩu thiếu chữ thường | `password` | `Nguyen Van A` / `new13@domain.com` / `PASSWORD123!` / khớp | EP10 | Từ chối | Form chặn "yếu" (đúng kết quả) | Pass\* | — |
| **TC-REGISTER-014** *(mới)* | Mật khẩu thiếu chữ số | `password` | `Nguyen Van A` / `new14@domain.com` / `Password!` / khớp | EP11 | Từ chối | Form chặn "yếu" (đúng kết quả) | Pass\* | — |
| **TC-REGISTER-015** *(mới)* | Tên chỉ gồm khoảng trắng | `name` | `"   "` / `new15@domain.com` / `Password 1` / khớp | EP2b | Từ chối (tên rỗng sau trim) | `required` không chặn được khoảng trắng → API tạo user name=`"   "` | Fail | BUG-A2 |
| **TC-REGISTER-016** *(mới)* | Tên toàn chữ số | `name` | `"12345"` / `new16@domain.com` / `Password 1` / khớp | EP2c | Từ chối (tên không hợp lệ) | API tạo user name=`12345` (HTTP 200) | Fail | BUG-A2 |
| **TC-REGISTER-017** *(mới)* | Tên chứa thẻ HTML (XSS) | `name` | `"<b>x</b>"` / `new17@domain.com` / `Password 1` / khớp | EP2d | Từ chối / khử HTML | API lưu nguyên `<b>x</b>` → nguy cơ stored XSS khi render | Fail | BUG-A2 |
| **TC-REGISTER-018** *(mới)* | Email thiếu TLD | `email` | `Nguyen Van A` / `user@domain` / `Password 1` / khớp | EP4d | Từ chối "Email không hợp lệ" | API tạo user email `user@domain` (HTTP 200) | Fail | BUG-A2 |
| **TC-REGISTER-019** *(mới)* | Email toàn chữ số | `email` | `Nguyen Van A` / `12345` / `Password 1` / khớp | EP4g | Từ chối "Email không hợp lệ" | API tạo user email `12345` (HTTP 200) | Fail | BUG-A2 |
| **TC-REGISTER-020** *(mới)* | Mật khẩu dùng ký tự đặc biệt ngoài tập | `password` | `Nguyen Van A` / `new20@domain.com` / `Password123#` / khớp | EP12b | Từ chối (`#` ∉ `@$!%*?&`) | Form chặn "yếu" (đúng kết quả) | Pass\* | — |
| **TC-REGISTER-021** *(mới)* | Mật khẩu toàn chữ số | `password` | `Nguyen Van A` / `new21@domain.com` / `12345678` / khớp | EP-NUM | Từ chối (thiếu hoa/thường/đặc biệt) | Form chặn "yếu" (đúng kết quả) | Pass\* | — |

> † **Đính chính (2026-06-27):** TC-002/005/008 trước đây bị ghi nhầm là *Fail*. Thực tế cả 3 input `name`/`email`/`password` đều có thuộc tính HTML `required` ([Register.jsx:42,52,62](../../group05_eshop/frontend-web/src/pages/Register.jsx#L42)). Khi để trống, trình duyệt **chặn submit** và hiện "Please fill out this field" → `handleSubmit` không chạy → API không được gọi → form **từ chối đúng** → **Pass**. Lỗi backend không validate (BUG-A2) **chỉ lộ khi gọi thẳng API** (bỏ qua form), nên cần test ở mức API riêng; qua form thì 3 ca này hợp lệ.
>
> **Phủ vùng `password`:** EP7→TC-001 · EP8→TC-REGISTER-010 (BVA, len=7) · EP9→TC-007 · EP10→TC-013 · EP11→TC-014 · EP12→TC-006 · EP12b→TC-020 · EP13→TC-008 · EP-NUM→TC-021.
>
> **Phủ vùng `name`:** EP1→TC-001 · EP2→TC-002 · EP2b→TC-015 · EP2c→TC-016 · EP2d→TC-017.
> **Phủ vùng `email`:** EP3→TC-001 · EP4(a–g)→TC-003 (`abc`, thiếu @), TC-018 (thiếu TLD), TC-019 (toàn số) · EP5→TC-004 · EP6→TC-005.
>
> \* **"Pass nhưng đúng vì lý do sai":** TC-007/013/014/020/021 đều bị form chặn → khớp kết quả mong đợi (từ chối), **nhưng** nguyên nhân chặn là regex lỗi đòi khoảng trắng `\s` và cấm ký tự đặc biệt, **không phải** vì thiếu hoa/thường/số/ký-tự-ngoài-tập. Nếu test trực tiếp qua API thì backend không validate → vẫn tạo user (liên quan BUG-A2). Đây là điểm chỉ phát hiện khi đọc source `Register.jsx:15`.
>
> **Lưu ý EP12b (TC-020):** form chặn `Password123#` là *trùng hợp đúng* — nó cũng sẽ chặn cả mật khẩu hợp lệ có ký tự đặc biệt **đúng** tập (`Password123!`, xem TC-001). Tức là form **không** phân biệt được "đặc biệt trong tập" vs "ngoài tập"; chỉ backend mới đáng tin để kiểm luật này, mà backend lại không kiểm.

---

## Bước 5b – Rút gọn test case (B5)

**Nguyên tắc B5 (Week 03):** Hai test case được coi là **trùng** và phải rút gọn (chỉ giữ lại 1) khi và chỉ khi chúng có **Input giống hệt nhau VÀ Expected Output giống hệt nhau**. Nếu chỉ giống Expected nhưng khác Input (hoặc ngược lại) thì **không** trùng — vì chúng phủ vùng/biến khác nhau và cần giữ để bảo toàn coverage.

**Kết luận sau khi rà soát bộ TC hiện tại (TC-REGISTER-001…021, trừ các TC BVA 010–012 ở file riêng):**

- Bộ TC được thiết kế theo **single-fault**: mỗi TC thả **đúng một** biến sang một vùng invalid khác nhau, các biến còn lại giữ valid → **bộ Input của mọi TC đều khác nhau** (khác ở chính giá trị biến đang test, và ở email duy nhất `new0x@domain.com`).
- Do Input đã đôi một khác nhau, **không tồn tại cặp TC nào trùng cả Input lẫn Expected** → **không có TC cần loại bỏ** theo B5.
- **Các cặp "gần trùng" (giống Expected nhưng KHÁC Input)** vẫn được giữ vì phủ vùng/biến khác nhau:
  - TC-007 / TC-013 / TC-014 / TC-020 / TC-021 cùng Expected "Từ chối – mật khẩu yếu" (O5) nhưng khác **vùng password** (EP9 / EP10 / EP11 / EP12b / EP-NUM) → giữ cả 5.
  - TC-002 / TC-015 / TC-016 / TC-017 cùng Expected nhóm "Từ chối – tên" (O2) nhưng khác **vùng name** (EP2 / EP2b / EP2c / EP2d) → giữ cả 4.
  - TC-003 / TC-018 / TC-019 cùng Expected "Email không hợp lệ" (O3) nhưng khác **đại diện EP4** (thiếu @ / thiếu TLD / toàn số) → giữ cả 3.
- **Tóm lại:** bộ TC hiện tại đã ở dạng tối giản; **không có TC trùng** (cùng Input + cùng Expected) nên **không loại bỏ TC nào** sau bước B5.

---

## Bước 6 – Giải thích từng bước (cách áp dụng kỹ thuật cho FR-01)

1. **Xác định biến (Bước 1):** Đọc đặc tả FR-01 và rút ra 4 biến đầu vào dựa trên *yêu cầu nghiệp vụ*, không phụ thuộc UI. Việc này giúp phát hiện sớm rằng `confirmPassword` *được spec yêu cầu* nhưng *không có trên form* → ứng viên bug (BUG-A4).
2. **Xác định domain (Bước 2):** Với mỗi biến, ghi rõ miền hợp lệ và toàn bộ ràng buộc — đặc biệt 2 ràng buộc dễ bị bỏ sót: email **duy nhất** (ràng buộc liên-dữ-liệu) và ký tự đặc biệt **phải thuộc tập** `@$!%*?&` (không phải mọi ký tự đặc biệt).
3. **Phân vùng (Bước 3):** Chia mỗi biến thành các lớp tương đương rời nhau & phủ kín. `password` có nhiều luật con nên tách thành 6 vùng invalid (EP8–EP13) để mỗi luật được kiểm riêng — đây là chỗ bộ test cũ còn thiếu (chưa phủ EP8/EP10/EP11), nay đã bổ sung.
4. **Chọn đại diện (Bước 4):** Mỗi vùng lấy 1 giá trị đại diện; với `password.length` (biến có thứ tự) phân loại in/on/off/out và **đánh dấu biên 7/8/9 để chuyển sang BVA**, tránh trùng lặp giữa hai kỹ thuật.
5. **Sinh test case theo single-fault (Bước 5):** Giữ tất cả biến ở vùng hợp lệ, chỉ thả **một** biến sang một vùng không hợp lệ → cô lập nguyên nhân lỗi. Thêm TC-001 "tất cả hợp lệ" làm mốc tham chiếu. Với các ca chạm tới ràng buộc backend (tên/email/mật khẩu rỗng), **đối chiếu chéo qua API bằng curl** vì UI có thể che lỗi bằng `required`.
6. **Thực thi & đối chiếu:** Chạy trên form `/register`, ghi Actual, so với Expected suy ra từ SRS (không đoán). Kết quả: 12 ca thiết kế ở đây + 3 ca BVA → lộ ra 4 nhóm lỗi (BUG-A1..A4) và 2 lỗi bổ sung (A5/A6) khi soi sâu.

**Giả định (do spec mơ hồ):** (a) SRS không nêu cận trên độ dài `name`/`password` → coi không giới hạn trên ở phần domain testing; (b) `name` chỉ gồm khoảng trắng được xem là **không hợp lệ** (rỗng-về-mặt-ngữ-nghĩa sau trim).

---

## Ghi chú cho mục AI Gap Analysis (ứng viên)

| Test case / lỗi AI dễ bỏ sót | Vì sao AI sót |
|------------------------------|----------------|
| Mật khẩu đúng spec (`Password123!`) **bị từ chối** (TC-001) | Prompt chung chung "tạo test case đăng ký" khiến AI chỉ kiểm chiều "mật khẩu yếu bị chặn", quên chiều ngược (mật khẩu mạnh bị chặn sai). Phải chủ động thêm ca all-valid làm mốc. |
| "Pass vì lý do sai" (TC-007/013/014) | AI chấm theo *kết quả* (bị chặn = đúng) mà bỏ qua *nguyên nhân* (chặn nhầm do regex đòi khoảng trắng). Chỉ thấy khi đọc source regex. |
| Thiếu phủ EP8/EP10/EP11 của `password` | AI thường dừng ở 1–2 đại diện mật khẩu yếu, không tách đủ 6 luật con → coverage thưa. |
| Thiếu trường Xác nhận mật khẩu (TC-009) | AI test theo API spec (chỉ name/email/password) nên không thấy thiếu field UI; cần đối chiếu lại đặc tả FR-01. |
| Email trùng / plaintext (BUG-A3/A6) | AI dễ bỏ ràng buộc *liên dữ liệu* (uniqueness) và yêu cầu *bảo mật* (SEC-01) nếu prompt không nhắc rõ. |
| Tên chỉ-khoảng-trắng vượt `required` (TC-015) | AI hay coi `required` là đủ; bỏ qua việc HTML `required` không trim khoảng trắng. |
| Tên toàn số / chứa HTML (TC-016/017) | SRS không nêu format `name` → AI bỏ qua; cần *giả định nghiệp vụ* + nghĩ tới stored XSS. |
| Email tách 7 kiểu sai định dạng (EP4a–g, TC-018/019) | AI thường chỉ thử 1 email sai (`abc`); không liệt kê thiếu TLD / nhiều `@` / toàn số. |
| Ký tự đặc biệt **ngoài** tập `@$!%*?&` (EP12b, TC-020) | AI dễ hiểu "có ký tự đặc biệt là đạt"; bỏ qua ràng buộc *tập ký tự cho phép* trong spec. |

---

## Bước 7 – Human review checkpoint (đề nghị sinh viên rà soát)

Trước khi chốt, vui lòng xác nhận:

1. **Đủ vùng chưa?** Có còn biến/luật nào của FR-01 chưa phân vùng? (vd: cận trên độ dài, ký tự Unicode trong `name`, email phân biệt hoa/thường?)
2. **Đại diện hợp lý chưa?** Các giá trị `Password 1`, `PASSWORD123!`, `Password!` có phản ánh đúng vùng định nhắm?
3. **Expected có bám SRS không?** Có chỗ nào tôi suy ra expected sai so với FR-01?
4. **Giả định chấp nhận được?** (name chỉ-khoảng-trắng = invalid; không giới hạn độ dài trên.)
5. **Mã & truy vết:** Có muốn tôi tạo file TC rời cho TC-013/014/015 (giống 001/004/006/011) và cập nhật `traceability-matrix.md` + `test-run` cho khớp không?

> HW02 yêu cầu **mỗi bước của quy trình test = 1 git commit**. Sau khi bạn duyệt, mình có thể commit file này với message kiểu `test(feature-A): domain testing (EP) for FR-01 register`.
