# EP-FR10: Test Design — Trạng thái Đơn hàng

**Phương pháp:** Equivalence Partitioning (EP)  
**Yêu cầu tham chiếu:** FR-10 (Trạng thái Đơn hàng (Order State Machine))

---

## 1. Xác định miền giá trị Input & Output

### Thành phần 1 — Admin cập nhật trạng thái đơn hàng

**Precondition:** Đăng nhập hệ thống với tài khoản Admin (`role = 'admin'`), đơn hàng cần cập nhật tồn tại trong hệ thống.

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Cặp trạng thái chuyển đổi (Current -> Target State) | 10 | ST1: `pending` -> `confirmed`<br>ST2: `pending` -> `canceled`<br>ST3: `confirmed` -> `shipping`<br>ST4: `confirmed` -> `canceled`<br>ST5: `shipping` -> `delivered` | ST6: Chuyển đổi không theo sơ đồ (VD: `pending` -> `shipping`, `pending` -> `delivered`, `confirmed` -> `pending`, `confirmed` -> `delivered`, `shipping` -> `pending`, `shipping` -> `confirmed`, `shipping` -> `canceled`)<br>ST7: Chuyển đổi sang chính nó (VD: `pending` -> `pending`, `confirmed` -> `confirmed`, `shipping` -> `shipping`, `delivered` -> `delivered`, `canceled` -> `canceled`)<br>ST8: Chuyển đổi từ trạng thái kết thúc `delivered` sang bất kỳ trạng thái nào khác<br>ST9: Chuyển đổi từ trạng thái kết thúc `canceled` sang bất kỳ trạng thái nào khác<br>ST10: Chuyển đổi sang trạng thái không xác định (VD: `unknown`, trống) |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Kết quả xử lý | 2 | O1: Cập nhật thành công, trạng thái đơn hàng đổi thành trạng thái mới (HTTP 200 OK) | O2: Cập nhật thất bại, giữ nguyên trạng thái cũ, báo lỗi chuyển đổi trạng thái không hợp lệ (HTTP 400 Bad Request) |

---

### Thành phần 2 — Người dùng hủy đơn hàng

**Precondition:** Đăng nhập hệ thống với tài khoản User sở hữu đơn hàng, đơn hàng cần hủy tồn tại trong danh sách đơn hàng của User.

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Trạng thái hiện tại | 5 | CS_U1: `pending`<br>CS_U2: `confirmed` | CS_U3: `shipping` (User không được phép tự hủy)<br>CS_U4: `delivered` (Trạng thái kết thúc)<br>CS_U5: `canceled` (Trạng thái kết thúc) |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Kết quả xử lý | 2 | O_U1: Hủy đơn hàng thành công, trạng thái đơn hàng chuyển thành `canceled` (HTTP 200 OK) | O_U2: Hủy đơn hàng thất bại, giữ nguyên trạng thái cũ, báo lỗi không được phép hủy (HTTP 400 Bad Request) |

---

## 2. Test Case

### 2.1. Test case cho miền hợp lệ

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng (Input)

| ID | Test Objective | State Transition (Input) | Kết quả (Output) |
|---|---|---|---|
| FR10_EP_V01 | Admin cập nhật trạng thái đơn hàng `pending` -> `confirmed` | `pending` -> `confirmed` (ST1) | Cập nhật thành công, trạng thái mới là `confirmed` (O1) |
| FR10_EP_V02 | Admin cập nhật trạng thái đơn hàng `pending` -> `canceled` | `pending` -> `canceled` (ST2) | Cập nhật thành công, trạng thái mới là `canceled` (O1) |
| FR10_EP_V03 | Admin cập nhật trạng thái đơn hàng `confirmed` -> `shipping` | `confirmed` -> `shipping` (ST3) | Cập nhật thành công, trạng thái mới là `shipping` (O1) |
| FR10_EP_V04 | Admin cập nhật trạng thái đơn hàng `confirmed` -> `canceled` | `confirmed` -> `canceled` (ST4) | Cập nhật thành công, trạng thái mới là `canceled` (O1) |
| FR10_EP_V05 | Admin cập nhật trạng thái đơn hàng `shipping` -> `delivered` | `shipping` -> `delivered` (ST5) | Cập nhật thành công, trạng thái mới là `delivered` (O1) |

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng (Output)

| ID | Test Objective | State Transition (Input) | Kết quả (Output) |
|---|---|---|---|
| FR10_EP_V06 | Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | `pending` -> `confirmed` (ST1) | Cập nhật thành công, trạng thái mới là `confirmed` (O1) |

#### Thành phần 2 — Người dùng hủy đơn hàng (Input)

| ID | Test Objective | Current State (Input) | Kết quả (Output) |
|---|---|---|---|
| FR10_EP_V07 | Người dùng hủy đơn hàng ở trạng thái `pending` | `pending` (CS_U1) | Hủy thành công, trạng thái chuyển sang `canceled` (O_U1) |
| FR10_EP_V08 | Người dùng hủy đơn hàng ở trạng thái `confirmed` | `confirmed` (CS_U2) | Hủy thành công, trạng thái chuyển sang `canceled` (O_U1) |

#### Thành phần 2 — Người dùng hủy đơn hàng (Output)

| ID | Test Objective | Current State (Input) | Kết quả (Output) |
|---|---|---|---|
| FR10_EP_V09 | Cập nhật trạng thái đơn hàng thành `canceled` trong DB và trả về phản hồi HTTP 200 trong miền O_U1 | `pending` (CS_U1) | Hủy thành công, trạng thái chuyển sang `canceled` (O_U1) |

---

### 2.2. Test case cho miền không hợp lệ

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng (Input)

| ID | Test Objective | State Transition (Input) | Kết quả (Output) |
|---|---|---|---|
| FR10_EP_IV01 | Admin thực hiện chuyển đổi không theo sơ đồ (`pending` -> `shipping`) | `pending` -> `shipping` (ST6) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV02 | Admin thực hiện chuyển đổi trạng thái sang chính nó (`pending` -> `pending`) | `pending` -> `pending` (ST7) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV03 | Admin cập nhật từ trạng thái kết thúc `delivered` sang trạng thái khác (`delivered` -> `shipping`) | `delivered` -> `shipping` (ST8) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV04 | Admin cập nhật từ trạng thái kết thúc `canceled` sang trạng thái khác (`canceled` -> `confirmed`) | `canceled` -> `confirmed` (ST9) | Báo lỗi chuyển đổi không hợp lệ (O2) |
| FR10_EP_IV05 | Admin cập nhật sang trạng thái không xác định (`pending` -> `unknown`) | `pending` -> `unknown` (ST10) | Báo lỗi chuyển đổi không hợp lệ (O2) |

#### Thành phần 2 — Người dùng hủy đơn hàng (Input)

| ID | Test Objective | Current State (Input) | Kết quả (Output) |
|---|---|---|---|
| FR10_EP_IV06 | Người dùng tự hủy đơn hàng khi đã ở trạng thái `shipping` | `shipping` (CS_U3) | Báo lỗi không được phép tự hủy (O_U2) |
| FR10_EP_IV07 | Người dùng tự hủy đơn hàng đã ở trạng thái kết thúc `delivered` | `delivered` (CS_U4) | Báo lỗi không được phép hủy (O_U2) |
| FR10_EP_IV08 | Người dùng tự hủy đơn hàng đã ở trạng thái kết thúc `canceled` | `canceled` (CS_U5) | Báo lỗi không được phép hủy (O_U2) |

---

## 3. Rút gọn TC

Gộp các test case có chung giá trị Input và Output thành một test case duy nhất với nhiều test objective.

### 3.1. Test case hợp lệ (rút gọn)

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng

| ID | Test Objective (gộp) | State Transition (Input) | Expected Output |
|---|---|---|---|
| FR10_EP_V01 | Gộp: FR10_EP_V01, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `pending` -> `confirmed` trong miền ST1<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | `pending` -> `confirmed` (ST1) | - Cập nhật thành công, trạng thái mới là `confirmed` (O1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V02 | Gộp: FR10_EP_V02, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `pending` -> `canceled` trong miền ST2<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | `pending` -> `canceled` (ST2) | - Cập nhật thành công, trạng thái mới là `canceled` (O1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V03 | Gộp: FR10_EP_V03, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `confirmed` -> `shipping` trong miền ST3<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | `confirmed` -> `shipping` (ST3) | - Cập nhật thành công, trạng thái mới là `shipping` (O1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V04 | Gộp: FR10_EP_V04, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `confirmed` -> `canceled` trong miền ST4<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | `confirmed` -> `canceled` (ST4) | - Cập nhật thành công, trạng thái mới là `canceled` (O1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V05 | Gộp: FR10_EP_V05, FR10_EP_V06<br>- Admin cập nhật trạng thái đơn hàng `shipping` -> `delivered` trong miền ST5<br>- Cập nhật trạng thái thành công trong DB và trả về phản hồi HTTP 200 trong miền O1 | `shipping` -> `delivered` (ST5) | - Cập nhật thành công, trạng thái mới là `delivered` (O1)<br>- Trả về HTTP 200 OK |

#### Thành phần 2 — Người dùng hủy đơn hàng

| ID | Test Objective (gộp) | Current State (Input) | Expected Output |
|---|---|---|---|
| FR10_EP_V06 | Gộp: FR10_EP_V07, FR10_EP_V09<br>- Người dùng hủy đơn hàng ở trạng thái `pending` trong miền CS_U1<br>- Trạng thái đơn hàng chuyển thành `canceled` trong DB và trả về HTTP 200 trong miền O_U1 | `pending` (CS_U1) | - Hủy thành công, trạng thái mới là `canceled` (O_U1)<br>- Trả về HTTP 200 OK |
| FR10_EP_V07 | Gộp: FR10_EP_V08, FR10_EP_V09<br>- Người dùng hủy đơn hàng ở trạng thái `confirmed` trong miền CS_U2<br>- Trạng thái đơn hàng chuyển thành `canceled` trong DB và trả về HTTP 200 trong miền O_U1 | `confirmed` (CS_U2) | - Hủy thành công, trạng thái mới là `canceled` (O_U1)<br>- Trả về HTTP 200 OK |

---

### 3.2. Test case không hợp lệ (rút gọn)

Các test case không hợp lệ đều có input khác nhau nên không thể gộp thêm, giữ nguyên từ mục 2.2.

#### Thành phần 1 — Admin cập nhật trạng thái đơn hàng

| ID | Test Objective | State Transition (Input) | Expected Output |
|---|---|---|---|
| FR10_EP_IV01 | Admin thực hiện chuyển đổi không theo sơ đồ (VD: `pending` -> `shipping`) | `pending` -> `shipping` (ST6) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV02 | Admin thực hiện chuyển đổi trạng thái sang chính nó (VD: `pending` -> `pending`) | `pending` -> `pending` (ST7) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV03 | Admin cập nhật từ trạng thái kết thúc `delivered` sang trạng thái khác (`delivered` -> `shipping`) | `delivered` -> `shipping` (ST8) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV04 | Admin cập nhật từ trạng thái kết thúc `canceled` sang trạng thái khác (`canceled` -> `confirmed`) | `canceled` -> `confirmed` (ST9) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV05 | Admin cập nhật sang trạng thái không xác định (`pending` -> `unknown`) | `pending` -> `unknown` (ST10) | - Báo lỗi chuyển đổi không hợp lệ (O2)<br>- Trả về HTTP 400 Bad Request |

#### Thành phần 2 — Người dùng hủy đơn hàng

| ID | Test Objective | Current State (Input) | Expected Output |
|---|---|---|---|
| FR10_EP_IV06 | Người dùng tự hủy đơn hàng khi đã ở trạng thái `shipping` | `shipping` (CS_U3) | - Báo lỗi không được phép tự hủy (O_U2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV07 | Người dùng tự hủy đơn hàng đã ở trạng thái kết thúc `delivered` | `delivered` (CS_U4) | - Báo lỗi không được phép hủy (O_U2)<br>- Trả về HTTP 400 Bad Request |
| FR10_EP_IV08 | Người dùng tự hủy đơn hàng đã ở trạng thái kết thúc `canceled` | `canceled` (CS_U5) | - Báo lỗi không được phép hủy (O_U2)<br>- Trả về HTTP 400 Bad Request |
