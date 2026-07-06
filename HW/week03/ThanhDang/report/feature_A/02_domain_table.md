# 02 — Domain Table: feature_A (FR-02 — Login & Account Lockout)

> **Scope:** Xác định input fields + phân hoạch miền giá trị (equivalence classes). KHÔNG có boundary values — dành cho STEP 4 (BVA).

---

## STEP 1 — Identify Input Fields

| # | Field Name | Required? | Source of Constraint | Related FR |
| --- | --- | --- | --- | --- |
| 1 | `email` | Yes | Spec (FR-02, FR-22) + Code | FR-02 (login identifier), FR-22 (`type="email"`) |
| 2 | `password` | Yes | Spec (FR-02, FR-22) + Code | FR-02 (authentication), FR-22 (`type="password"`) |
| 3 | `login_attempts` | N/A (state) | Spec (FR-02) | FR-02 (lockout counter — tăng mỗi lần sai) |
| 4 | `locked_until` | N/A (state) | Spec (FR-02) | FR-02 (lock expiry — khóa tạm thời) |

> **Ghi chú:** Fields 3–4 là biến trạng thái server-side, không do user nhập trực tiếp mà được hệ thống quản lý tự động. Tuy nhiên chúng ảnh hưởng trực tiếp đến hành vi login nên cần phân hoạch miền.

---

## STEP 2 — Domain Table

### Field 1: `email`

| Attribute | Detail |
| --- | --- |
| **Data Type** | String |
| **Required** | Yes (HTML5 `required`, no server-side check) |
| **Format** | RFC 5322 email format (`local@domain`). SPEC yêu cầu `type="email"` |
| **Case** | Case-sensitive matching (SQLite TEXT comparison via `WHERE email = ?` phân biệt hoa thường) |
| **Whitespace** | Không trim ở backend `[CODE-BE]` |
| **Length** | Max 320 chars theo RFC 5321 (64 local + @ + 255 domain) |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-E-V1 | Valid | Email format hợp lệ, tồn tại trong DB, case khớp | `test@eshop.com` | Happy path — email tìm thấy, tiếp tục check password |
| EC-E-V2 | Valid | Email format hợp lệ, tồn tại trong DB, role admin | `admin@eshop.com` | Đảm bảo admin cũng login được (khác role) |
| EC-E-I1 | Invalid | Format sai — thiếu `@` | `testeshop.com` | Không đạt format RFC → reject |
| EC-E-I2 | Invalid | Format sai — thiếu domain | `test@` | Không đầy đủ domain → reject |
| EC-E-I3 | Invalid | Format sai — thiếu local part | `@eshop.com` | Không có local part → reject |
| EC-E-I4 | Invalid | Rỗng / null | `` hoặc `null` | Field bắt buộc → form block hoặc backend reject |
| EC-E-I5 | Invalid | Quá dài (vượt 320 chars) | `aaa...@test.com` (500+ chars) | Vượt giới hạn RFC → potential overflow |
| EC-E-I6 | Invalid | Chứa whitespace (không trim) | ` test@eshop.com ` | Exact match fails do spaces |
| EC-E-I7 | Invalid | Format hợp lệ nhưng không tồn tại trong DB | `unknown@eshop.com` | User not found → 401, counter NOT tăng |
| EC-E-I8 | Invalid | Format hợp lệ, tồn tại, nhưng case mismatch | `Test@Eshop.com` | Case mismatch → user not found → 401 |

**Giải thích phân lớp:**
- **V1 vs V2:** Tách vì role khác nhau (user vs admin) → JWT payload khác (`role` field), cần verify cả hai.
- **I1–I3:** Tách theo loại format violation — mỗi loại có thể bị xử lý khác nhau tùy validator.
- **I4:** Tách riêng vì behavior khác: HTML5 `required` chặn ở frontend trước khi gửi request.
- **I5:** Tách riêng vì có thể gây DB error/truncation thay vì simple 401.
- **I6 vs I7 vs I8:** Cả ba đều dẫn đến "user not found" nhưng nguyên nhân khác nhau (whitespace, not exist, case) — giúp xác định root cause khi debug.

---

### Field 2: `password`

| Attribute | Detail |
| --- | --- |
| **Data Type** | String |
| **Required** | Yes (HTML5 `required`) |
| **Comparison** | Plaintext exact match: `user.password === password` `[CODE-BE]` |
| **Case** | Case-sensitive (do `===` comparison) |
| **Whitespace** | Không trim ở backend |
| **Length** | Không quy định min/max cho login (chính sách mật khẩu mạnh chỉ áp dụng cho đăng ký FR-01) |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-P-V1 | Valid | Exact match với password trong DB | `Test1234!` (cho `test@eshop.com`) | So khớp chuỗi tuyệt đối → login thành công |
| EC-P-I1 | Invalid | Sai ký tự / chuỗi hoàn toàn khác | `WrongPass123!` | Bất kỳ string ≠ stored → 401 + counter tăng |
| EC-P-I2 | Invalid | Case mismatch | `test1234!` (lowercase `t`) | Case-sensitive → exact match fails |
| EC-P-I3 | Invalid | Có whitespace thừa | `Test1234! ` (trailing space) | Không trim → match fails |
| EC-P-I4 | Invalid | Rỗng / null | `` hoặc `null` | String rỗng ≠ stored password → 401 + counter tăng |

**Giải thích phân lớp:**
- **V1:** Chỉ có 1 valid class — phải exact match, không có "partially valid".
- **I1:** Sai hoàn toàn — đại diện cho mọi password khác (generic wrong).
- **I2–I3:** Tách riêng vì đây là "gần đúng nhưng sai" — dễ bị user nhầm, và hệ thống có behavior đặc thù (case-sensitive, no trim) khiến input "gần đúng" vẫn bị reject. Cần test riêng để phát hiện UX issue.
- **I4:** Tách riêng vì có khả năng bị chặn ở frontend (`required`) trước khi tới backend.

---

### Field 3: `login_attempts` (state variable)

| Attribute | Detail |
| --- | --- |
| **Data Type** | Integer |
| **Default** | `0` |
| **Managed by** | Backend tự động (tăng khi sai password, reset khi login đúng) |
| **Increment** | +2 mỗi lần sai `[CODE-BE]` (SPEC nói +1) |
| **Threshold** | `>= 3` → trigger lock `[CODE-BE]` |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-LA-V1 | Valid | Counter = 0 (fresh, chưa sai lần nào) | `0` | Tài khoản bình thường, không bị ảnh hưởng lockout |
| EC-LA-V2 | Valid | Counter > 0 nhưng < 3 (đã sai nhưng chưa đạt ngưỡng) | `2` | Gần ngưỡng nhưng chưa bị khóa |
| EC-LA-I1 | Invalid | Counter >= 3 (đạt/vượt ngưỡng khóa) | `4` | Đã vượt ngưỡng → account bị khóa (kết hợp `locked_until`) |

**Giải thích phân lớp:**
- **V1 vs V2:** Tách vì V2 đang "gần ngưỡng" — 1 lần sai nữa sẽ vượt (0→2 an toàn, 2→4 khóa). Hành vi hệ thống khác nhau ở lần sai tiếp theo.
- **I1:** Counter đã vượt ngưỡng — luôn đi kèm `locked_until` được set.

---

### Field 4: `locked_until` (state variable)

| Attribute | Detail |
| --- | --- |
| **Data Type** | DATETIME (nullable) |
| **Default** | `NULL` |
| **Managed by** | Backend tự động (set khi counter >= 3, clear khi login đúng) |
| **Lock duration** | 180s `[CODE-BE]` (SPEC nói 30s) |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-LU-V1 | Valid | `NULL` — chưa bao giờ bị khóa | `NULL` | Account bình thường |
| EC-LU-V2 | Valid | Timestamp trong quá khứ — khóa đã hết hạn | `2020-01-01T00:00:00` | Hết hạn → cho phép login lại |
| EC-LU-I1 | Invalid | Timestamp trong tương lai — đang bị khóa | `2099-12-31T23:59:59` | Đang khóa → 403, chặn mọi login attempt |

**Giải thích phân lớp:**
- **V1 vs V2:** Tách vì V2 có nghĩa account *đã từng* bị khóa — counter có thể vẫn cao (không reset khi hết hạn). Hành vi khác V1 khi login sai tiếp.
- **I1:** Đang khóa → hệ thống check trước password → 403 bất kể mật khẩu đúng/sai.

---

## Tổng hợp Equivalence Classes

| Field | Valid ECs | Invalid ECs | Total |
| --- | --- | --- | --- |
| `email` | 2 (EC-E-V1, V2) | 8 (EC-E-I1–I8) | 10 |
| `password` | 1 (EC-P-V1) | 4 (EC-P-I1–I4) | 5 |
| `login_attempts` | 2 (EC-LA-V1, V2) | 1 (EC-LA-I1) | 3 |
| `locked_until` | 2 (EC-LU-V1, V2) | 1 (EC-LU-I1) | 3 |
| **Tổng** | **7** | **14** | **21** |

