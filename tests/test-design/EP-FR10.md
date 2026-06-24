# EP-FR10: Test Design — Trạng thái Đơn hàng

**Phương pháp:** Equivalence Partitioning (EP)  
**Yêu cầu tham chiếu:** FR-10 (Trạng thái Đơn hàng (Order State Machine))

---

## 1. Xác định miền giá trị Input & Output

### Thành phần 1 — Admin cập nhật trạng thái đơn hàng

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Token JWT | 3 | TOK_A1: Token Admin hợp lệ (role = 'admin') | TOK_A2: Token User thường (role = 'user')<br>TOK_A3: Token không hợp lệ, hết hạn hoặc không gửi token |
| Đơn hàng (Order ID) | 2 | ORD1: Đơn hàng tồn tại trong hệ thống | ORD2: Đơn hàng không tồn tại trong hệ thống (VD: ID = 99999) |
| Cặp trạng thái chuyển đổi (Current -> Target State) | 10 | ST1: `pending` -> `confirmed`<br>ST2: `pending` -> `canceled`<br>ST3: `confirmed` -> `shipping`<br>ST4: `confirmed` -> `canceled`<br>ST5: `shipping` -> `delivered` | ST6: Chuyển đổi không theo sơ đồ (VD: `pending` -> `shipping`, `pending` -> `delivered`, `confirmed` -> `pending`, `confirmed` -> `delivered`, `shipping` -> `pending`, `shipping` -> `confirmed`, `shipping` -> `canceled`)<br>ST7: Chuyển đổi sang chính nó (VD: `pending` -> `pending`, `confirmed` -> `confirmed`, `shipping` -> `shipping`, `delivered` -> `delivered`, `canceled` -> `canceled`)<br>ST8: Chuyển đổi từ trạng thái kết thúc `delivered` sang bất kỳ trạng thái nào khác<br>ST9: Chuyển đổi từ trạng thái kết thúc `canceled` sang bất kỳ trạng thái nào khác<br>ST10: Chuyển đổi sang trạng thái không xác định (VD: `unknown`, trống) |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Kết quả xử lý | 5 | O1: Cập nhật thành công, trạng thái đơn hàng đổi thành trạng thái mới (HTTP 200 OK) | O2: Cập nhật thất bại, giữ nguyên trạng thái cũ, báo lỗi chuyển đổi trạng thái không hợp lệ (HTTP 400 Bad Request)<br>O3: Báo lỗi không tìm thấy đơn hàng (HTTP 404 Not Found)<br>O4: Báo lỗi chưa đăng nhập hoặc token không hợp lệ (HTTP 401 Unauthorized)<br>O5: Báo lỗi không có quyền truy cập Admin (HTTP 403 Forbidden) |

---

### Thành phần 2 — Người dùng hủy đơn hàng

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Token JWT | 2 | TOK_U1: Token người dùng hợp lệ | TOK_U2: Token không hợp lệ, hết hạn hoặc không gửi token |
| Đơn hàng (Order ID) | 3 | ORD_U1: Đơn hàng tồn tại và thuộc sở hữu của chính người dùng gửi yêu cầu | ORD_U2: Đơn hàng tồn tại nhưng thuộc sở hữu của người dùng khác<br>ORD_U3: Đơn hàng không tồn tại trong hệ thống (VD: ID = 99999) |
| Trạng thái hiện tại | 5 | CS_U1: `pending`<br>CS_U2: `confirmed` | CS_U3: `shipping` (User không được phép tự hủy)<br>CS_U4: `delivered` (Trạng thái kết thúc)<br>CS_U5: `canceled` (Trạng thái kết thúc) |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Kết quả xử lý | 4 | O_U1: Hủy đơn hàng thành công, trạng thái đơn hàng chuyển thành `canceled` (HTTP 200 OK) | O_U2: Hủy đơn hàng thất bại, giữ nguyên trạng thái cũ, báo lỗi không được phép hủy (HTTP 400 Bad Request)<br>O_U3: Báo lỗi không tìm thấy đơn hàng hoặc không có quyền truy cập đơn hàng của người khác (HTTP 404 Not Found hoặc HTTP 403 Forbidden)<br>O_U4: Báo lỗi chưa đăng nhập hoặc token không hợp lệ (HTTP 401 Unauthorized) |

---

## 2. Test Case

### 2.1. Test case cho miền hợp lệ

#### Thành quan 1 — Admin cập nhật trạng thái đơn hàng (Input)

| ID | Test Objective | Token (Input) | Order ID (Input) | State Transition (Input) | Kết quả (Output) |
|---|---|---|---|---|---|
| FR10_EP_V01 | Admin cập nhật trạng thái đơn hàng `pending` -> `confirmed` | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `confirmed` (ST1) | Cập nhật thành công, trạng thái mới là `confirmed` (O1) |
| FR10_EP_V02 | Admin cập nhật trạng thái đơn hàng `pending` -> `canceled` | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `canceled` (ST2) | Cập nhật thành công, trạng thái mới là `canceled` (O1) |
| FR10_EP_V03 | Admin cập nhật trạng thái đơn hàng `confirmed` -> `shipping` | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `confirmed` -> `shipping` (ST3) | Cập nhật thành công, trạng thái mới là `shipping` (O1) |
| FR10_EP_V04 | Admin cập nhật trạng thái đơn hàng `confirmed` -> `canceled` | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `confirmed` -> `canceled` (ST4) | Cập nhật thành công, trạng thái mới là `canceled` (O1) |
| FR10_EP_V05 | Admin cập nhật trạng thái đơn hàng `shipping` -> `delivered` | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `shipping` -> `delivered` (ST5) | Cập nhật thành công, trạng thái mới là `delivered` (O1) |

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng (Output)

| ID | Test Objective | Token (Input) | Order ID (Input) | State Transition (Input) | Kết quả (Output) |
|---|---|---|---|---|---|
| FR10_EP_V06 | Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `confirmed` (ST1) | Cập nhật thành công, trạng thái mới là `confirmed` (O1) |

#### Thành phần 2 — Người dùng hủy đơn hàng (Input)

| ID | Test Objective | Token (Input) | Order ID (Input) | Current State (Input) | Kết quả (Output) |
|---|---|---|---|---|---|
| FR10_EP_V07 | Người dùng hủy đơn hàng của chính mình ở trạng thái `pending` | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `pending` (CS_U1) | Hủy thành công, trạng thái chuyển sang `canceled` (O_U1) |
| FR10_EP_V08 | Người dùng hủy đơn hàng của chính mình ở trạng thái `confirmed` | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `confirmed` (CS_U2) | Hủy thành công, trạng thái chuyển sang `canceled` (O_U1) |

#### Thành phần 2 — Người dùng hủy đơn hàng (Output)

| ID | Test Objective | Token (Input) | Order ID (Input) | Current State (Input) | Kết quả (Output) |
|---|---|---|---|---|---|
| FR10_EP_V09 | Cập nhật trạng thái đơn hàng thành `canceled` trong DB và trả về phản hồi HTTP 200 trong miền O_U1 | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `pending` (CS_U1) | Hủy thành công, trạng thái chuyển sang `canceled` (O_U1) |

---

### 2.2. Test case cho miền không hợp lệ

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng (Input)

| ID | Test Objective | Token (Input) | Order ID (Input) | State Transition (Input) | Kết quả (Output) |
|---|---|---|---|---|---|
| FR10_EP_IV01 | Admin cập nhật trạng thái cho đơn hàng không tồn tại | Admin Token (TOK_A1) | Đơn không tồn tại (ORD2) | `pending` -> `confirmed` (ST1) | Báo lỗi không tìm thấy đơn hàng (O3) |
| FR10_EP_IV02 | Admin thực hiện chuyển đổi không theo sơ đồ (`pending` -> `shipping`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `shipping` (ST6) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV03 | Admin thực hiện chuyển đổi trạng thái sang chính nó (`pending` -> `pending`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `pending` (ST7) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV04 | Admin cập nhật từ trạng thái kết thúc `delivered` sang trạng thái khác (`delivered` -> `shipping`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `delivered` -> `shipping` (ST8) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV05 | Admin cập nhật từ trạng thái kết thúc `canceled` sang trạng thái khác (`canceled` -> `confirmed`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `canceled` -> `confirmed` (ST9) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV06 | Admin cập nhật sang trạng thái không xác định (`pending` -> `unknown`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `unknown` (ST10) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV07 | Người dùng thường thực hiện thao tác cập nhật của Admin | User Token (TOK_A2) | Đơn hàng tồn tại (ORD1) | `pending` -> `confirmed` (ST1) | Báo lỗi không có quyền truy cập Admin (O5) |
| FR10_EP_IV08 | Thực hiện cập nhật trạng thái khi chưa đăng nhập hoặc token sai | Token không hợp lệ (TOK_A3) | Đơn hàng tồn tại (ORD1) | `pending` -> `confirmed` (ST1) | Báo lỗi chưa đăng nhập (O4) |

#### Thành phần 2 — Người dùng hủy đơn hàng (Input)

| ID | Test Objective | Token (Input) | Order ID (Input) | Current State (Input) | Kết quả (Output) |
|---|---|---|---|---|---|
| FR10_EP_IV09 | Hủy đơn hàng khi chưa đăng nhập hoặc token không hợp lệ | Token không hợp lệ (TOK_U2) | Đơn hàng của User (ORD_U1) | `pending` (CS_U1) | Báo lỗi chưa đăng nhập (O_U4) |
| FR10_EP_IV10 | Người dùng hủy đơn hàng thuộc sở hữu của tài khoản khác | User Token (TOK_U1) | Đơn của người khác (ORD_U2) | `pending` (CS_U1) | Báo lỗi không tìm thấy đơn hoặc không có quyền (O_U3) |
| FR10_EP_IV11 | Người dùng hủy đơn hàng không tồn tại trong hệ thống | User Token (TOK_U1) | Đơn không tồn tại (ORD_U3) | `pending` (CS_U1) | Báo lỗi không tìm thấy đơn hàng (O_U3) |
| FR10_EP_IV12 | Người dùng tự hủy đơn hàng khi đã ở trạng thái `shipping` | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `shipping` (CS_U3) | Báo lỗi không được phép tự hủy (O_U2) |
| FR10_EP_IV13 | Người dùng tự hủy đơn hàng đã ở trạng thái kết thúc `delivered` | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `delivered` (CS_U4) | Báo lỗi không được phép hủy (O_U2) |
| FR10_EP_IV14 | Người dùng tự hủy đơn hàng đã ở trạng thái kết thúc `canceled` | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `canceled` (CS_U5) | Báo lỗi không được phép hủy (O_U2) |

---

## 3. Rút gọn TC

Gộp các test case có chung giá trị Input và Output thành một test case duy nhất với nhiều test objective.

### 3.1. Test case hợp lệ (rút gọn)

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng

| ID | Test Objective (gộp) | Token (Input) | Order ID (Input) | State Transition (Input) | Expected Output |
|---|---|---|---|---|---|
| FR10_EP_V01 | Gộp: FR10_EP_V01, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `pending` -> `confirmed` trong miền ST1<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `confirmed` (ST1) | - Cập nhật thành công, trạng thái mới là `confirmed` (O1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V02 | Gộp: FR10_EP_V02, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `pending` -> `canceled` trong miền ST2<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `canceled` (ST2) | - Cập nhật thành công, trạng thái mới là `canceled` (O1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V03 | Gộp: FR10_EP_V03, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `confirmed` -> `shipping` trong miền ST3<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `confirmed` -> `shipping` (ST3) | - Cập nhật thành công, trạng thái mới là `shipping` (O1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V04 | Gộp: FR10_EP_V04, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `confirmed` -> `canceled` trong miền ST4<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `confirmed` -> `canceled` (ST4) | - Cập nhật thành công, trạng thái mới là `canceled` (O1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V05 | Gộp: FR10_EP_V05, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `shipping` -> `delivered` trong miền ST5<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `shipping` -> `delivered` (ST5) | - Cập nhật thành công, trạng thái mới là `delivered` (O1)<br>- Trả về HTTP 200 OK |

#### Thành phần 2 — Người dùng hủy đơn hàng

| ID | Test Objective (gộp) | Token (Input) | Order ID (Input) | Current State (Input) | Expected Output |
|---|---|---|---|---|---|
| FR10_EP_V06 | Gộp: FR10_EP_V07, FR10_EP_V09<br>- Người dùng hủy đơn hàng của chính mình ở trạng thái `pending` trong miền CS_U1<br>- Trạng thái đơn hàng chuyển thành `canceled` trong DB và trả về HTTP 200 trong miền O_U1 | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `pending` (CS_U1) | - Hủy thành công, trạng thái mới là `canceled` (O_U1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V07 | Gộp: FR10_EP_V08, FR10_EP_V09<br>- Người dùng hủy đơn hàng của chính mình ở trạng thái `confirmed` trong miền CS_U2<br>- Trạng thái đơn hàng chuyển thành `canceled` trong DB và trả về HTTP 200 trong miền O_U1 | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `confirmed` (CS_U2) | - Hủy thành công, trạng thái mới là `canceled` (O_U1)<br>- Trả về HTTP 200 OK |

---

### 3.2. Test case không hợp lệ (rút gọn)

Các test case không hợp lệ đều có input khác nhau nên không thể gộp thêm, giữ nguyên từ mục 2.2.

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng

| ID | Test Objective | Token (Input) | Order ID (Input) | State Transition (Input) | Expected Output |
|---|---|---|---|---|---|
| FR10_EP_IV01 | Admin cập nhật trạng thái cho đơn hàng không tồn tại | Admin Token (TOK_A1) | Đơn không tồn tại (ORD2) | `pending` -> `confirmed` (ST1) | - Báo lỗi không tìm thấy đơn hàng (O3)<br>- Trả về HTTP 404 Not Found |
| FR10_EP_IV02 | Admin thực hiện chuyển đổi không theo sơ đồ (`pending` -> `shipping`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `shipping` (ST6) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV03 | Admin thực hiện chuyển đổi trạng thái sang chính nó (`pending` -> `pending`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `pending` (ST7) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV04 | Admin cập nhật từ trạng thái kết thúc `delivered` sang trạng thái khác (`delivered` -> `shipping`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `delivered` -> `shipping` (ST8) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV05 | Admin cập nhật từ trạng thái kết thúc `canceled` sang trạng thái khác (`canceled` -> `confirmed`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `canceled` -> `confirmed` (ST9) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV06 | Admin cập nhật sang trạng thái không xác định (`pending` -> `unknown`) | Admin Token (TOK_A1) | Đơn hàng tồn tại (ORD1) | `pending` -> `unknown` (ST10) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV07 | Người dùng thường thực hiện thao tác cập nhật của Admin | User Token (TOK_A2) | Đơn hàng tồn tại (ORD1) | `pending` -> `confirmed` (ST1) | - Báo lỗi không có quyền truy cập Admin (O5)<br>- Trả về HTTP 403 Forbidden |
| FR10_EP_IV08 | Thực hiện cập nhật trạng thái khi chưa đăng nhập hoặc token sai | Token không hợp lệ (TOK_A3) | Đơn hàng tồn tại (ORD1) | `pending` -> `confirmed` (ST1) | - Báo lỗi chưa đăng nhập (O4)<br>- Trả về HTTP 401 Unauthorized |

#### Thành phần 2 — Người dùng hủy đơn hàng

| ID | Test Objective | Token (Input) | Order ID (Input) | Current State (Input) | Expected Output |
|---|---|---|---|---|---|
| FR10_EP_IV09 | Hủy đơn hàng khi chưa đăng nhập hoặc token không hợp lệ | Token không hợp lệ (TOK_U2) | Đơn hàng của User (ORD_U1) | `pending` (CS_U1) | - Báo lỗi chưa đăng nhập (O_U4)<br>- Trả về HTTP 401 Unauthorized |
| FR10_EP_IV10 | Người dùng hủy đơn hàng thuộc sở hữu của tài khoản khác | User Token (TOK_U1) | Đơn của người khác (ORD_U2) | `pending` (CS_U1) | - Báo lỗi không tìm thấy đơn hoặc không có quyền (O_U3)<br>- Trả về HTTP 404 Not Found hoặc HTTP 403 Forbidden |
| FR10_EP_IV11 | Người dùng hủy đơn hàng không tồn tại trong hệ thống | User Token (TOK_U1) | Đơn không tồn tại (ORD_U3) | `pending` (CS_U1) | - Báo lỗi không tìm thấy đơn hàng (O_U3)<br>- Trả về HTTP 404 Not Found |
| FR10_EP_IV12 | Người dùng tự hủy đơn hàng khi đã ở trạng thái `shipping` | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `shipping` (CS_U3) | - Báo lỗi không được phép tự hủy (O_U2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV13 | Người dùng tự hủy đơn hàng đã ở trạng thái kết thúc `delivered` | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `delivered` (CS_U4) | - Báo lỗi không được phép hủy (O_U2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV14 | Người dùng tự hủy đơn hàng đã ở trạng thái kết thúc `canceled` | User Token (TOK_U1) | Đơn hàng của User (ORD_U1) | `canceled` (CS_U5) | - Báo lỗi không được phép hủy (O_U2)<br>- Trả về HTTP 400 Bad Request |
