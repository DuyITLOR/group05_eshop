# STT-FR10: Test Design — Trạng thái Đơn hàng (Order State Machine)

**Phương pháp:** State Transition Testing  
**Yêu cầu tham chiếu:** FR-10 (Trạng thái Đơn hàng)

---

## 1. Sơ đồ chuyển trạng thái (State Transition Diagram)

*Sơ đồ chuyển trạng thái dưới đây được chụp và lưu tại đường dẫn `./State Transition Diagrams/images/FR10.svg`. Code Mermaid chi tiết được lưu trong file `./State Transition Diagrams/FR10.mermaid`.*

![State Transition Diagram](./State%20Transition%20Diagrams/images/FR10.svg)

---

## 2. Xác định States & Actions

### 2.1. Danh sách các Trạng thái (States)

| State | Tên trạng thái | Mô tả ý nghĩa / Điều kiện đạt trạng thái |
|---|---|---|
| `pending` | Chờ xác nhận | Trạng thái mặc định khi đơn hàng vừa được tạo bởi User. |
| `confirmed` | Đã xác nhận | Đơn hàng đã được Admin kiểm tra và phê duyệt. |
| `shipping` | Đang giao hàng | Đơn hàng đã được Admin đóng gói và chuyển giao cho đơn vị vận chuyển. |
| `delivered` | Đã giao hàng | Khách hàng đã nhận đơn hàng thành công. Đây là trạng thái kết thúc (Final State). |
| `canceled` | Đã hủy | Đơn hàng bị hủy bởi User hoặc Admin trước khi giao. Đây là trạng thái kết thúc (Final State). |

### 2.2. Danh sách các Hành động / Sự kiện (Actions / Events)

| Action / Event | Actor | Mô tả |
|---|---|---|
| `Confirm` | Admin | Gửi request `PUT /api/admin/orders/:id/status` với body `{"status": "confirmed"}` |
| `Ship` | Admin | Gửi request `PUT /api/admin/orders/:id/status` với body `{"status": "shipping"}` |
| `Deliver` | Admin | Gửi request `PUT /api/admin/orders/:id/status` với body `{"status": "delivered"}` |
| `Cancel` | User / Admin | User gửi request `PUT /api/orders/:id/cancel` hoặc Admin gửi request `PUT /api/admin/orders/:id/status` với body `{"status": "canceled"}` |

---

## 3. Ma trận Trạng thái x Hành động (States x Actions Matrix)

| Trạng thái hiện tại | Action: Confirm (Admin) | Action: Ship (Admin) | Action: Deliver (Admin) | Action: Cancel (User/Admin) |
|---|---|---|---|---|
| **`pending`** | `confirmed` (Thành công) | Chặn (Lỗi 400 Bad Request) | Chặn (Lỗi 400 Bad Request) | `canceled` (Thành công) |
| **`confirmed`** | Chặn (Lỗi 400 Bad Request) | `shipping` (Thành công) | Chặn (Lỗi 400 Bad Request) | `canceled` (Thành công) |
| **`shipping`** | Chặn (Lỗi 400 Bad Request) | Chặn (Lỗi 400 Bad Request) | `delivered` (Thành công) | Chặn (Lỗi 400 Bad Request) |
| **`delivered`** | Chặn (Lỗi 400 Bad Request) | Chặn (Lỗi 400 Bad Request) | Chặn (Lỗi 400 Bad Request) | Chặn (Lỗi 400 Bad Request) |
| **`canceled`** | Chặn (Lỗi 400 Bad Request) | Chặn (Lỗi 400 Bad Request) | Chặn (Lỗi 400 Bad Request) | Chặn (Lỗi 400 Bad Request) |

---

## 4. Danh sách Test Cases (Scenario Matrix)

*Danh sách toàn bộ test case được sinh ra từ ma trận Trạng thái x Hành động ($5 \text{ States} \times 4 \text{ Actions} = 20$ test cases).*

| ID | Scenario / Test Case Name | Transition Path | Expected Result | Type |
|---|---|---|---|---|
| FR10-STT-01 | Admin xác nhận đơn hàng đang chờ xác nhận | `pending` --(Confirm)--> `confirmed` | Đơn hàng chuyển sang trạng thái `confirmed` thành công | Positive |
| FR10-STT-02 | Chặn Admin giao hàng nhảy cóc khi đang chờ xác nhận | `pending` --(Ship)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `pending` | Negative |
| FR10-STT-03 | Chặn Admin hoàn tất đơn hàng nhảy cóc khi đang chờ xác nhận | `pending` --(Deliver)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `pending` | Negative |
| FR10-STT-04 | User/Admin hủy đơn hàng ở trạng thái pending | `pending` --(Cancel)--> `canceled` | Đơn hàng chuyển sang trạng thái `canceled` thành công | Positive |
| FR10-STT-05 | Chặn Admin xác nhận lại đơn hàng đã xác nhận | `confirmed` --(Confirm)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `confirmed` | Negative |
| FR10-STT-06 | Admin giao đơn hàng đã xác nhận | `confirmed` --(Ship)--> `shipping` | Đơn hàng chuyển sang trạng thái `shipping` thành công | Positive |
| FR10-STT-07 | Chặn Admin hoàn tất đơn hàng nhảy cóc khi đã xác nhận nhưng chưa giao | `confirmed` --(Deliver)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `confirmed` | Negative |
| FR10-STT-08 | User/Admin hủy đơn hàng ở trạng thái confirmed | `confirmed` --(Cancel)--> `canceled` | Đơn hàng chuyển sang trạng thái `canceled` thành công | Positive |
| FR10-STT-09 | Chặn Admin xác nhận đơn hàng khi đơn hàng đang được giao | `shipping` --(Confirm)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `shipping` | Negative |
| FR10-STT-10 | Chặn Admin giao hàng lần nữa khi đang giao hàng | `shipping` --(Ship)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `shipping` | Negative |
| FR10-STT-11 | Admin hoàn tất đơn hàng đang giao | `shipping` --(Deliver)--> `delivered` | Đơn hàng chuyển sang trạng thái `delivered` thành công | Positive |
| FR10-STT-12 | Chặn User/Admin hủy đơn hàng khi đã đi giao | `shipping` --(Cancel)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `shipping` | Negative |
| FR10-STT-13 | Chặn xác nhận lại đơn hàng đã giao thành công | `delivered` --(Confirm)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `delivered` | Negative |
| FR10-STT-14 | Chặn giao lại đơn hàng đã giao thành công | `delivered` --(Ship)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `delivered` | Negative |
| FR10-STT-15 | Chặn giao thành công lại đơn hàng đã giao thành công | `delivered` --(Deliver)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `delivered` | Negative |
| FR10-STT-16 | Chặn hủy đơn hàng đã giao thành công | `delivered` --(Cancel)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `delivered` | Negative |
| FR10-STT-17 | Chặn xác nhận đơn hàng đã bị hủy | `canceled` --(Confirm)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `canceled` | Negative |
| FR10-STT-18 | Chặn giao đơn hàng đã bị hủy | `canceled` --(Ship)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `canceled` | Negative |
| FR10-STT-19 | Chặn giao thành công đơn hàng đã bị hủy | `canceled` --(Deliver)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `canceled` | Negative |
| FR10-STT-20 | Chặn hủy lại đơn hàng đã bị hủy trước đó | `canceled` --(Cancel)--> `Chặn` | Hệ thống báo lỗi 400, trạng thái giữ nguyên là `canceled` | Negative |

=> Tổng số test case: **20**
