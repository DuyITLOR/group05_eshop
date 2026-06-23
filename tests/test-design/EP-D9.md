# EP-D9: Test Design — Chức năng Hủy đơn hàng (Mobile)

**Phương pháp:** Equivalence Partitioning (EP)  
**Yêu cầu tham chiếu:** FR-20 (Tính năng Mobile - Chức năng hủy đơn hàng)

---

## 1. Xác định miền giá trị Input & Output

### Thành phần 1 — Giao diện hiển thị nút "Hủy đơn" trên Mobile App

**Precondition:** Người dùng đã đăng nhập tài khoản khách hàng, truy cập mục "Hồ sơ" và xem danh sách "Lịch sử đơn hàng".

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Trạng thái đơn hàng hiện tại | 5 | CS_M1: Trạng thái `pending` (Chờ xác nhận)<br>CS_M2: Trạng thái `confirmed` (Đã xác nhận) | CS_M3: Trạng thái `shipping` (Đang giao)<br>CS_M4: Trạng thái `delivered` (Đã giao)<br>CS_M5: Trạng thái `canceled` (Đã hủy) |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Hiển thị nút "Hủy đơn" | 2 | O_M1: Có hiển thị nút "Hủy đơn" màu đỏ cạnh đơn hàng | O_M2: Không hiển thị nút "Hủy đơn" |

---

### Thành phần 2 — Thực hiện yêu cầu hủy đơn hàng qua API (từ Mobile App)

**Precondition:** Người dùng gửi yêu cầu hủy đơn hàng (`PUT /api/orders/:id/cancel`) từ Mobile App.

#### Input:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Xác thực người dùng (JWT Token) | 3 | AUTH1: JWT Token hợp lệ | AUTH2: JWT Token không hợp lệ hoặc đã hết hạn<br>AUTH3: Không có JWT Token (để trống hoặc không gửi kèm trong header) |
| Quyền sở hữu đơn hàng | 2 | OWN1: Đơn hàng thuộc sở hữu của người dùng đang đăng nhập | OWN2: Đơn hàng không thuộc sở hữu của người dùng đang đăng nhập hoặc đơn hàng không tồn tại |
| Trạng thái đơn hàng hiện tại | 5 | ST1: Trạng thái `pending`<br>ST2: Trạng thái `confirmed` | ST3: Trạng thái `shipping` (Người dùng không được phép tự hủy)<br>ST4: Trạng thái `delivered` (Trạng thái kết thúc)<br>ST5: Trạng thái `canceled` (Trạng thái kết thúc) |

#### Output:

| Tên giá trị | Số miền giá trị | Miền hợp lệ | Miền không hợp lệ |
|---|---|---|---|
| Kết quả xử lý đơn hàng | 4 | OUT1: Trạng thái đơn hàng cập nhật thành `canceled` trong CSDL<br>OUT2: Phản hồi thành công (HTTP 200 OK) và hiển thị thông báo "Hủy đơn thành công!" trên ứng dụng Mobile | OUT3: Giữ nguyên trạng thái đơn hàng cũ, phản hồi thất bại (HTTP 400 Bad Request) và thông báo lỗi phù hợp trên Mobile (VD: "Không thể hủy đơn.")<br>OUT4: Phản hồi lỗi xác thực hoặc quyền hạn (HTTP 401 Unauthorized / HTTP 403 Forbidden / HTTP 404 Not Found) |

---

## 2. Test Case

### 2.1. Test case cho miền hợp lệ

#### Thành phần 1 — Giao diện hiển thị nút "Hủy đơn" trên Mobile App (Input)

| ID | Test Objective | Trạng thái đơn hàng hiện tại (Input) | Hiển thị nút "Hủy đơn" (Output) |
|---|---|---|---|
| FR20_EP_V01 | Kiểm tra hiển thị nút "Hủy đơn" khi đơn hàng ở trạng thái `pending` | `pending` (CS_M1) | Hiển thị nút "Hủy đơn" màu đỏ (O_M1) |
| FR20_EP_V02 | Kiểm tra hiển thị nút "Hủy đơn" khi đơn hàng ở trạng thái `confirmed` | `confirmed` (CS_M2) | Hiển thị nút "Hủy đơn" màu đỏ (O_M1) |

#### Thành phần 1 — Giao diện hiển thị nút "Hủy đơn" trên Mobile App (Output)

| ID | Test Objective | Trạng thái đơn hàng hiện tại (Input) | Hiển thị nút "Hủy đơn" (Output) |
|---|---|---|---|
| FR20_EP_V03 | Xác nhận nút "Hủy đơn" màu đỏ hiển thị cạnh thông tin đơn hàng trong miền O_M1 | `pending` (CS_M1) | Hiển thị nút "Hủy đơn" màu đỏ (O_M1) |

#### Thành phần 2 — Thực hiện yêu cầu hủy đơn hàng qua API (Input)

| ID | Test Objective | JWT Token (Input) | Quyền sở hữu (Input) | Trạng thái đơn hàng hiện tại (Input) | Kết quả xử lý đơn hàng (Output) |
|---|---|---|---|---|---|
| FR20_EP_V04 | Người dùng hủy đơn hàng hợp lệ ở trạng thái `pending` | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `pending` (ST1) | Trạng thái chuyển thành `canceled` trong CSDL (OUT1), thông báo thành công (OUT2) |
| FR20_EP_V05 | Người dùng hủy đơn hàng hợp lệ ở trạng thái `confirmed` | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `confirmed` (ST2) | Trạng thái chuyển thành `canceled` trong CSDL (OUT1), thông báo thành công (OUT2) |

#### Thành phần 2 — Thực hiện yêu cầu hủy đơn hàng qua API (Output)

| ID | Test Objective | JWT Token (Input) | Quyền sở hữu (Input) | Trạng thái đơn hàng hiện tại (Input) | Kết quả xử lý đơn hàng (Output) |
|---|---|---|---|---|---|
| FR20_EP_V06 | Xác nhận phản hồi thành công và cập nhật DB khi hủy đơn thành công trong miền OUT1 & OUT2 | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `pending` (ST1) | Trạng thái chuyển thành `canceled` trong CSDL (OUT1), thông báo thành công (OUT2) |

---

### 2.2. Test case cho miền không hợp lệ

#### Thành phần 1 — Giao diện hiển thị nút "Hủy đơn" trên Mobile App (Input)

| ID | Test Objective | Trạng thái đơn hàng hiện tại (Input) | Hiển thị nút "Hủy đơn" (Output) |
|---|---|---|---|
| FR20_EP_IV01 | Kiểm tra ẩn nút "Hủy đơn" khi đơn hàng ở trạng thái `shipping` | `shipping` (CS_M3) | Không hiển thị nút "Hủy đơn" (O_M2) |
| FR20_EP_IV02 | Kiểm tra ẩn nút "Hủy đơn" khi đơn hàng ở trạng thái `delivered` | `delivered` (CS_M4) | Không hiển thị nút "Hủy đơn" (O_M2) |
| FR20_EP_IV03 | Kiểm tra ẩn nút "Hủy đơn" khi đơn hàng ở trạng thái `canceled` | `canceled` (CS_M5) | Không hiển thị nút "Hủy đơn" (O_M2) |

#### Thành phần 2 — Thực hiện yêu cầu hủy đơn hàng qua API (Input)

| ID | Test Objective | JWT Token (Input) | Quyền sở hữu (Input) | Trạng thái đơn hàng hiện tại (Input) | Kết quả xử lý đơn hàng (Output) |
|---|---|---|---|---|---|
| FR20_EP_IV04 | Người dùng hủy đơn hàng với token không hợp lệ | Không hợp lệ (AUTH2) | Của người dùng (OWN1) | `pending` (ST1) | Thất bại, trả về HTTP 401/403 (OUT4), không thay đổi CSDL |
| FR20_EP_IV05 | Người dùng hủy đơn hàng khi không đăng nhập | Trống (AUTH3) | Của người dùng (OWN1) | `pending` (ST1) | Thất bại, trả về HTTP 401 (OUT4), không thay đổi CSDL |
| FR20_EP_IV06 | Người dùng hủy đơn hàng của người khác hoặc không tồn tại | Hợp lệ (AUTH1) | Không sở hữu/Không tồn tại (OWN2) | `pending` (ST1) | Thất bại, trả về HTTP 404 (OUT4), không thay đổi CSDL |
| FR20_EP_IV07 | Người dùng cố gắng hủy đơn hàng ở trạng thái `shipping` bằng API | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `shipping` (ST3) | Thất bại, giữ nguyên trạng thái cũ, trả về HTTP 400 và lỗi không được phép hủy (OUT3) |
| FR20_EP_IV08 | Người dùng cố gắng hủy đơn hàng đã `delivered` bằng API | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `delivered` (ST4) | Thất bại, giữ nguyên trạng thái cũ, trả về HTTP 400 và lỗi không được phép hủy (OUT3) |
| FR20_EP_IV09 | Người dùng cố gắng hủy đơn hàng đã `canceled` bằng API | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `canceled` (ST5) | Thất bại, giữ nguyên trạng thái cũ, trả về HTTP 400 và lỗi không được phép hủy (OUT3) |

---

## 3. Rút gọn TC

Gộp các test case có chung giá trị Input và Output thành một test case duy nhất với nhiều test objective.

### 3.1. Test case hợp lệ (rút gọn)

#### Thành phần 1 — Giao diện hiển thị nút "Hủy đơn" trên Mobile App

| ID | Test Objective (gộp) | Trạng thái đơn hàng hiện tại (Input) | Expected Output |
|---|---|---|---|
| FR20_EP_V01 | Gộp: FR20_EP_V01, FR20_EP_V03<br>- Kiểm tra hiển thị nút "Hủy đơn" khi đơn hàng ở trạng thái `pending` (CS_M1)<br>- Xác nhận nút "Hủy đơn" màu đỏ hiển thị cạnh thông tin đơn hàng trong miền O_M1 | `pending` (CS_M1) | - Hiển thị nút "Hủy đơn" màu đỏ cạnh đơn hàng (O_M1) |
| FR20_EP_V02 | Gộp: FR20_EP_V02, FR20_EP_V03<br>- Kiểm tra hiển thị nút "Hủy đơn" khi đơn hàng ở trạng thái `confirmed` (CS_M2)<br>- Xác nhận nút "Hủy đơn" màu đỏ hiển thị cạnh thông tin đơn hàng trong miền O_M1 | `confirmed` (CS_M2) | - Hiển thị nút "Hủy đơn" màu đỏ cạnh đơn hàng (O_M1) |

#### Thành phần 2 — Thực hiện yêu cầu hủy đơn hàng qua API

| ID | Test Objective (gộp) | JWT Token (Input) | Quyền sở hữu (Input) | Trạng thái đơn hàng hiện tại (Input) | Expected Output |
|---|---|---|---|---|---|
| FR20_EP_V04 | Gộp: FR20_EP_V04, FR20_EP_V06<br>- Người dùng hủy đơn hàng hợp lệ ở trạng thái `pending` trong miền ST1<br>- Xác nhận phản hồi thành công và cập nhật DB khi hủy đơn thành công trong miền OUT1 & OUT2 | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `pending` (ST1) | - Trạng thái đơn hàng cập nhật thành `canceled` trong CSDL (OUT1)<br>- Trả về HTTP 200 OK và hiển thị thông báo "Hủy đơn thành công!" (OUT2) |
| FR20_EP_V05 | Gộp: FR20_EP_V05, FR20_EP_V06<br>- Người dùng hủy đơn hàng hợp lệ ở trạng thái `confirmed` trong miền ST2<br>- Xác nhận phản hồi thành công và cập nhật DB khi hủy đơn thành công trong miền OUT1 & OUT2 | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `confirmed` (ST2) | - Trạng thái đơn hàng cập nhật thành `canceled` trong CSDL (OUT1)<br>- Trả về HTTP 200 OK và hiển thị thông báo "Hủy đơn thành công!" (OUT2) |

---

### 3.2. Test case không hợp lệ (rút gọn)

Các test case không hợp lệ đều có input khác nhau nên không thể gộp thêm, giữ nguyên từ mục 2.2.

#### Thành phần 1 — Giao diện hiển thị nút "Hủy đơn" trên Mobile App

| ID | Test Objective | Trạng thái đơn hàng hiện tại (Input) | Expected Output |
|---|---|---|---|
| FR20_EP_IV01 | Kiểm tra ẩn nút "Hủy đơn" khi đơn hàng ở trạng thái `shipping` | `shipping` (CS_M3) | Không hiển thị nút "Hủy đơn" (O_M2) |
| FR20_EP_IV02 | Kiểm tra ẩn nút "Hủy đơn" khi đơn hàng ở trạng thái `delivered` | `delivered` (CS_M4) | Không hiển thị nút "Hủy đơn" (O_M2) |
| FR20_EP_IV03 | Kiểm tra ẩn nút "Hủy đơn" khi đơn hàng ở trạng thái `canceled` | `canceled` (CS_M5) | Không hiển thị nút "Hủy đơn" (O_M2) |

#### Thành phần 2 — Thực hiện yêu cầu hủy đơn hàng qua API

| ID | Test Objective | JWT Token (Input) | Quyền sở hữu (Input) | Trạng thái đơn hàng hiện tại (Input) | Expected Output |
|---|---|---|---|---|---|
| FR20_EP_IV04 | Người dùng hủy đơn hàng với token không hợp lệ | Không hợp lệ (AUTH2) | Của người dùng (OWN1) | `pending` (ST1) | - Trả về HTTP 401 hoặc 403 Unauthorized (OUT4)<br>- Giữ nguyên trạng thái đơn hàng cũ, không đổi CSDL |
| FR20_EP_IV05 | Người dùng hủy đơn hàng khi không đăng nhập | Trống (AUTH3) | Của người dùng (OWN1) | `pending` (ST1) | - Trả về HTTP 401 Unauthorized (OUT4)<br>- Giữ nguyên trạng thái đơn hàng cũ, không đổi CSDL |
| FR20_EP_IV06 | Người dùng hủy đơn hàng của người khác hoặc không tồn tại | Hợp lệ (AUTH1) | Không sở hữu/Không tồn tại (OWN2) | `pending` (ST1) | - Trả về HTTP 404 Not Found (OUT4)<br>- Giữ nguyên trạng thái đơn hàng cũ, không đổi CSDL |
| FR20_EP_IV07 | Người dùng cố gắng hủy đơn hàng ở trạng thái `shipping` bằng API | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `shipping` (ST3) | - Trả về HTTP 400 Bad Request và thông báo lỗi không được phép hủy (OUT3)<br>- Giữ nguyên trạng thái đơn hàng cũ là `shipping` |
| FR20_EP_IV08 | Người dùng cố gắng hủy đơn hàng đã `delivered` bằng API | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `delivered` (ST4) | - Trả về HTTP 400 Bad Request và thông báo lỗi không được phép hủy (OUT3)<br>- Giữ nguyên trạng thái đơn hàng cũ là `delivered` |
| FR20_EP_IV09 | Người dùng cố gắng hủy đơn hàng đã `canceled` bằng API | Hợp lệ (AUTH1) | Của người dùng (OWN1) | `canceled` (ST5) | - Trả về HTTP 400 Bad Request và thông báo lỗi không được phép hủy (OUT3)<br>- Giữ nguyên trạng thái đơn hàng cũ là `canceled` |
