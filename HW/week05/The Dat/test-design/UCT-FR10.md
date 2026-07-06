# UCT-FR10: Test Design — Trạng thái Đơn hàng (Order State Machine)

**Phương pháp:** Use Case Testing  
**Yêu cầu tham chiếu:** FR-10 (Trạng thái Đơn hàng)

---

## 1. Use Case Specification

### Use Case Name
Cập nhật trạng thái đơn hàng (Order State Machine)

### Use Case ID
UC-FR10

### Actor(s)
| Actor | Vai trò |
|---|---|
| Admin | Người quản lý hệ thống, có quyền xác nhận, giao hàng, hoàn tất và hủy đơn hàng ở mọi trạng thái chưa kết thúc |
| User | Khách hàng mua sắm, có quyền hủy đơn hàng ở trạng thái `pending` hoặc `confirmed` |
| System | Hệ thống EShop kiểm tra điều kiện chuyển đổi trạng thái và cập nhật trạng thái đơn hàng |

### Description
Use case này cho phép Admin và User thay đổi trạng thái của đơn hàng theo đúng sơ đồ State Machine đã được định nghĩa. Hệ thống sẽ chặn mọi yêu cầu chuyển đổi trạng thái không hợp lệ.

### Preconditions
1. Đơn hàng đã được tạo thành công và ở trạng thái ban đầu là `pending`.

### Postconditions
**Thành công:**
1. Trạng thái đơn hàng được cập nhật thành công sang trạng thái mới trong cơ sở dữ liệu.
2. Mọi chuyển đổi hợp lệ được thực hiện đúng quyền hạn.

**Thất bại:**
1. Hệ thống từ chối cập nhật trạng thái đơn hàng không hợp lệ hoặc sai quyền hạn, trả về thông báo lỗi phù hợp.
2. Trạng thái đơn hàng giữ nguyên trạng thái cũ.

---

### Main Flow (Basic Flow)

Luồng chính mô tả vòng đời hoàn tất đơn hàng chuẩn từ khi tạo đến khi giao hàng thành công bởi Admin.

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| S1 | Admin | Đăng nhập tài khoản Admin, truy cập trang Quản lý đơn hàng |
| S2 | Admin | Chọn đơn hàng đang ở trạng thái `pending` và nhấn nút "Xác nhận đơn hàng" |
| S3 | System | Kiểm tra trạng thái hiện tại là `pending`, cập nhật trạng thái sang `confirmed` |
| S4 | Admin | Chọn đơn hàng `confirmed` và nhấn nút "Giao hàng" |
| S5 | System | Kiểm tra trạng thái hiện tại là `confirmed`, cập nhật trạng thái sang `shipping` |
| S6 | Admin | Chọn đơn hàng `shipping` và nhấn nút "Hoàn tất giao hàng" |
| S7 | System | Kiểm tra trạng thái hiện tại là `shipping`, cập nhật trạng thái sang `delivered` |

**Kết quả:** Đơn hàng được giao thành công và chuyển sang trạng thái kết thúc là `delivered`.

---

### Alternative Flows

#### AF1: User hủy đơn hàng ở trạng thái pending

**Điểm rẽ:** Tại bước S2 của Main Flow (trước khi Admin xác nhận)  
**Điều kiện:** User muốn hủy đơn hàng đang chờ xác nhận

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| AF1.1 | User | Đăng nhập tài khoản User, truy cập Lịch sử đơn hàng |
| AF1.2 | User | Chọn đơn hàng đang ở trạng thái `pending` và nhấn nút "Hủy đơn hàng" |
| AF1.3 | System | Kiểm tra trạng thái hiện tại là `pending`, cập nhật trạng thái sang `canceled` |

**Kết quả:** Đơn hàng bị hủy thành công (chuyển sang trạng thái kết thúc `canceled`).

---

#### AF2: User hủy đơn hàng ở trạng thái confirmed

**Điểm rẽ:** Tại bước S4 của Main Flow (trước khi Admin giao hàng)  
**Điều kiện:** User muốn hủy đơn hàng đã được xác nhận nhưng chưa giao

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| AF2.1 | User | Đăng nhập tài khoản User, truy cập Lịch sử đơn hàng |
| AF2.2 | User | Chọn đơn hàng đang ở trạng thái `confirmed` và nhấn nút "Hủy đơn hàng" |
| AF2.3 | System | Kiểm tra trạng thái hiện tại là `confirmed`, cập nhật trạng thái sang `canceled` |

**Kết quả:** Đơn hàng bị hủy thành công (chuyển sang trạng thái kết thúc `canceled`).

---

#### AF3: Admin hủy đơn hàng ở trạng thái pending hoặc confirmed

**Điểm rẽ:** Tại bước S2 hoặc S4 của Main Flow  
**Điều kiện:** Admin chủ động hủy đơn hàng

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| AF3.1 | Admin | Tại trang Quản lý đơn hàng, chọn đơn hàng `pending` hoặc `confirmed` |
| AF3.2 | Admin | Nhấn nút "Hủy đơn hàng" |
| AF3.3 | System | Kiểm tra trạng thái hợp lệ, cập nhật trạng thái sang `canceled` |

**Kết quả:** Đơn hàng chuyển sang trạng thái kết thúc `canceled`.

---

### Exception Flows

#### EF1: Chuyển trạng thái từ trạng thái kết thúc (delivered hoặc canceled)

**Điểm rẽ:** Tại bất kỳ bước nào sau khi đơn hàng đã đạt trạng thái kết thúc  
**Điều kiện lỗi:** Cố gắng thay đổi trạng thái của đơn hàng đã `delivered` hoặc `canceled`

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| EF1.1 | Admin/User | Gửi yêu cầu cập nhật trạng thái đơn hàng đã ở `delivered` hoặc `canceled` sang trạng thái bất kỳ khác (VD: `pending`, `confirmed`, `shipping`) |
| EF1.2 | System | Kiểm tra thấy trạng thái hiện tại là trạng thái kết thúc, từ chối yêu cầu, trả về lỗi "Không thể thay đổi trạng thái của đơn hàng đã kết thúc" |

**Kết quả:** Yêu cầu bị chặn, trạng thái đơn hàng giữ nguyên.

---

#### EF2: User tự hủy đơn hàng khi đang giao (shipping)

**Điểm rẽ:** Tại bước S6 của Main Flow (khi đơn hàng đang giao)  
**Điều kiện lỗi:** User cố gắng hủy đơn hàng đã ở trạng thái `shipping`

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| EF2.1 | User | Truy cập lịch sử đơn hàng, cố gắng gửi request hủy đơn hàng đang ở trạng thái `shipping` |
| EF2.2 | System | Kiểm tra thấy trạng thái là `shipping` và actor là User, từ chối yêu cầu, trả về thông báo lỗi hoặc không hiển thị nút hủy trên giao diện của User |

**Kết quả:** User bị chặn không cho hủy đơn hàng.

---

#### EF3: Chuyển trạng thái bỏ bước (nhảy cóc)

**Điểm rẽ:** Tại bất kỳ bước nào trong Main Flow  
**Điều kiện lỗi:** Cố gắng cập nhật trạng thái bỏ qua các bước trung gian (VD: `pending` -> `shipping` hoặc `confirmed` -> `delivered`)

| Step | Actor | Hành động / Phản hồi hệ thống |
|------|-------|-------------------------------|
| EF3.1 | Admin | Cố cập nhật trạng thái đơn hàng `pending` thẳng lên `shipping` hoặc `confirmed` thẳng lên `delivered` |
| EF3.2 | System | Kiểm tra thấy sự chuyển đổi không tuân thủ State Machine, từ chối yêu cầu, trả về lỗi |

**Kết quả:** Yêu cầu bị chặn, trạng thái đơn hàng giữ nguyên.

---

## 2. Scenario Matrix (Danh sách Test Cases)

Mỗi kịch bản kiểm thử (Scenario) đại diện cho một đường đi (path) qua Use Case và tương ứng với 1 Test Case cuối cùng.

| ID | Scenario / Test Case Name | Path | Expected Result |
|---|---|---|---|
| FR10-UCT-01 | Quy trình hoàn tất đơn hàng chuẩn (Admin) | Main Flow: S1 -> S2 -> S3 -> S4 -> S5 -> S6 -> S7 | Đơn hàng chuyển trạng thái thành công và kết thúc ở `delivered` |
| FR10-UCT-02 | User hủy đơn hàng đang chờ xác nhận | AF1: AF1.1 -> AF1.2 -> AF1.3 | Đơn hàng chuyển sang `canceled` thành công |
| FR10-UCT-03 | User hủy đơn hàng đã xác nhận | AF2: AF2.1 -> AF2.2 -> AF2.3 | Đơn hàng chuyển sang `canceled` thành công |
| FR10-UCT-04 | Admin hủy đơn hàng đang chờ xác nhận/đã xác nhận | AF3: AF3.1 -> AF3.2 -> AF3.3 | Đơn hàng chuyển sang `canceled` thành công |
| FR10-UCT-05 | Chuyển trạng thái từ đơn hàng đã giao (delivered) | EF1: EF1.1 -> EF1.2 | Hệ thống báo lỗi, chặn cập nhật, trạng thái giữ nguyên là `delivered` |
| FR10-UCT-06 | Chuyển trạng thái từ đơn hàng đã hủy (canceled) | EF1: EF1.1 -> EF1.2 | Hệ thống báo lỗi, chặn cập nhật, trạng thái giữ nguyên là `canceled` |
| FR10-UCT-07 | User hủy đơn hàng khi đang giao (shipping) | EF2: EF2.1 -> EF2.2 | Hệ thống chặn hủy đơn, báo lỗi, trạng thái giữ nguyên là `shipping` |
| FR10-UCT-08 | Chuyển trạng thái nhảy cóc (nhảy từ pending lên shipping) | EF3: EF3.1 -> EF3.2 | Hệ thống báo lỗi, chặn cập nhật, trạng thái giữ nguyên là `pending` |

=> Tổng số test case: **8**
