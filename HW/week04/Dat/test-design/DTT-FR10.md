# DTT-FR10: Test Design — Trạng thái Đơn hàng (Order State Machine)

**Phương pháp:** Decision table & Pairwise testing  
**Yêu cầu tham chiếu:** FR-10 (Trạng thái Đơn hàng)

---

## 1. Xác định điều kiện & kết quả

### Chuyển đổi trạng thái đơn hàng (Order Status Transition)

#### Điều kiện (Conditions):

| Tên điều kiện | Số loại giá trị | Chi tiết giá trị |
|---|---|---|
| C1: Trạng thái hiện tại | 5 | **P**: pending (đang chờ)<br>**CF**: confirmed (đã xác nhận)<br>**S**: shipping (đang giao)<br>**D**: delivered (đã giao)<br>**C**: canceled (đã hủy) |
| C2: Trạng thái mong muốn | 5 | **P**: pending<br>**CF**: confirmed<br>**S**: shipping<br>**D**: delivered<br>**C**: canceled |
| C3: Vai trò người thực hiện | 2 | **User**: Khách hàng sở hữu đơn hàng<br>**Admin**: Quản trị viên hệ thống |

#### Kết quả (Actions):

| Tên kết quả | Mô tả |
|---|---|
| R1: Chuyển trạng thái thành công | Hệ thống cập nhật trạng thái đơn hàng thành công |
| R2: Lỗi — Chuyển trạng thái không hợp lệ | Trả về lỗi 400 và thông báo không cho phép chuyển đổi trạng thái |
| R3: Lỗi — Không có quyền thực hiện | Trả về lỗi 401/403 do User cố tình gọi API Admin hoặc thao tác bị cấm |

=> Tổng số rules = 5 (C1) × 5 (C2) × 2 (C3) = 50 rules.

---

## 2. Decision Table (đầy đủ)

Do số lượng rule lớn (50 rules), bảng được chia làm 5 phần tương ứng với các trạng thái hiện tại (C1).

### Bảng 1: C1 = pending (Rules 1–10)

| ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|----|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | |
| C1: Trạng thái hiện tại | P | P | P | P | P | P | P | P | P | P |
| C2: Trạng thái mong muốn | P | P | CF | CF | S | S | D | D | C | C |
| C3: Vai trò người thực hiện | User | Admin | User | Admin | User | Admin | User | Admin | User | Admin |
| **Kết quả** | | | | | | | | | | |
| R1: Thành công | | | | X | | | | | X | X |
| R2: Chuyển trạng thái sai | | X | | | | X | | X | | |
| R3: Không có quyền | X | | X | | X | | X | | | |
| Impossible | | | | | | | | | | |

### Bảng 2: C1 = confirmed (Rules 11–20)

| ID | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|----|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | |
| C1: Trạng thái hiện tại | CF | CF | CF | CF | CF | CF | CF | CF | CF | CF |
| C2: Trạng thái mong muốn | P | P | CF | CF | S | S | D | D | C | C |
| C3: Vai trò người thực hiện | User | Admin | User | Admin | User | Admin | User | Admin | User | Admin |
| **Kết quả** | | | | | | | | | | |
| R1: Thành công | | | | | | X | | | X | X |
| R2: Chuyển trạng thái sai | | X | | X | | | | X | | |
| R3: Không có quyền | X | | X | | X | | X | | | |
| Impossible | | | | | | | | | | |

### Bảng 3: C1 = shipping (Rules 21–30)

| ID | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|----|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | |
| C1: Trạng thái hiện tại | S | S | S | S | S | S | S | S | S | S |
| C2: Trạng thái mong muốn | P | P | CF | CF | S | S | D | D | C | C |
| C3: Vai trò người thực hiện | User | Admin | User | Admin | User | Admin | User | Admin | User | Admin |
| **Kết quả** | | | | | | | | | | |
| R1: Thành công | | | | | | | | X | | |
| R2: Chuyển trạng thái sai | | X | | X | | X | | | | X |
| R3: Không có quyền | X | | X | | X | | X | | X | |
| Impossible | | | | | | | | | | |

*Lưu ý ở Rule 29: Theo đặc tả, khi ở trạng thái shipping, User không được phép tự hủy (R3), và sơ đồ không có nhánh từ shipping sang canceled nên Admin cũng không thể hủy (R2).*

### Bảng 4: C1 = delivered (Rules 31–40)

| ID | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
|----|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | |
| C1: Trạng thái hiện tại | D | D | D | D | D | D | D | D | D | D |
| C2: Trạng thái mong muốn | P | P | CF | CF | S | S | D | D | C | C |
| C3: Vai trò người thực hiện | User | Admin | User | Admin | User | Admin | User | Admin | User | Admin |
| **Kết quả** | | | | | | | | | | |
| R1: Thành công | | | | | | | | | | |
| R2: Chuyển trạng thái sai | | X | | X | | X | | X | | X |
| R3: Không có quyền | X | | X | | X | | X | | X | |
| Impossible | | | | | | | | | | |

### Bảng 5: C1 = canceled (Rules 41–50)

| ID | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 |
|----|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | |
| C1: Trạng thái hiện tại | C | C | C | C | C | C | C | C | C | C |
| C2: Trạng thái mong muốn | P | P | CF | CF | S | S | D | D | C | C |
| C3: Vai trò người thực hiện | User | Admin | User | Admin | User | Admin | User | Admin | User | Admin |
| **Kết quả** | | | | | | | | | | |
| R1: Thành công | | | | | | | | | | |
| R2: Chuyển trạng thái sai | | X | | X | | X | | X | | X |
| R3: Không có quyền | X | | X | | X | | X | | X | |
| Impossible | | | | | | | | | | |

---

## 3. Rút gọn Decision Table

### Các quy tắc gộp:
1. **R1 (Thành công)**:
   - Thay đổi thành `canceled` từ `pending` hoặc `confirmed` đều được chấp nhận đối với cả User và Admin. Gộp vai trò người thực hiện C3 = `-`.
2. **R2 (Lỗi chuyển trạng thái sai cho Admin)**:
   - Khi C1 = `delivered` hoặc `canceled`, Admin không thể chuyển sang bất cứ trạng thái nào khác (tất cả 5 đích đến đều lỗi). Gộp trạng thái mong muốn C2 = `-`.
3. **R3 (Lỗi không có quyền cho User)**:
   - User không được phép gọi API chuyển trạng thái mong muốn sang `pending`, `confirmed`, `shipping`, `delivered` từ bất kỳ trạng thái hiện tại nào. Gộp trạng thái hiện tại C1 = `-`.

### Bảng rút gọn:

| ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|----|---|---|---|---|---|---|---|---|---|---|---|---|
| **Điều kiện** | | | | | | | | | | | | |
| C1: Trạng thái hiện tại | P | P | CF | CF | S | P | CF | S | D | C | - | S, D, C |
| C2: Trạng thái mong muốn | CF | C | S | C | D | P, S, D | P, CF, D | P, CF, S, C | - | - | P, CF, S, D | C |
| C3: Vai trò người thực hiện | Admin | - | Admin | - | Admin | Admin | Admin | Admin | Admin | Admin | User | User |
| **Kết quả** | | | | | | | | | | | | |
| R1: Thành công | X | X | | X | | | | | | | | |
| R2: Chuyển trạng thái sai | | | | | | X | X | X | X | X | | |
| R3: Không có quyền | | | | | | | | | | | X | X |

---

## 4. Pairwise Testing (mở rộng don't care)

### Phân tích áp dụng Pairwise:
Do hệ thống chỉ có tối đa **3 điều kiện**, một rule rút gọn chỉ có tối đa **2 điều kiện mang giá trị don't care (`-`)** hoặc tập hợp giá trị (ví dụ: Rule 9, 10, 11). 
Theo hướng dẫn, khi chỉ có tối đa 2 điều kiện biến đổi độc lập (chỉ tạo ra 1 cặp duy nhất), việc áp dụng Pairwise tương đương với việc liệt kê đầy đủ tổ hợp (Cartesian Product) để đảm bảo không bị sót kịch bản kiểm thử nào.

Chúng ta tiến hành mở rộng các rule rút gọn có chứa `-` hoặc tập giá trị như sau:

- **Rule 2 mở rộng (C3 = `-`)**:
  - `pending` -> `canceled` bởi User (FR10-DTT-02)
  - `pending` -> `canceled` bởi Admin (FR10-DTT-03)
- **Rule 4 mở rộng (C3 = `-`)**:
  - `confirmed` -> `canceled` bởi User (FR10-DTT-05)
  - `confirmed` -> `canceled` bởi Admin (FR10-DTT-06)
- **Rule 6 mở rộng (tập giá trị C2)**:
  - `pending` -> `pending` bởi Admin (FR10-DTT-08)
  - `pending` -> `shipping` bởi Admin (FR10-DTT-09)
  - `pending` -> `delivered` bởi Admin (FR10-DTT-10)
- **Rule 7 mở rộng (tập giá trị C2)**:
  - `confirmed` -> `pending` bởi Admin (FR10-DTT-11)
  - `confirmed` -> `confirmed` bởi Admin (FR10-DTT-12)
  - `confirmed` -> `delivered` bởi Admin (FR10-DTT-13)
- **Rule 8 mở rộng (tập giá trị C2)**:
  - `shipping` -> `pending` bởi Admin (FR10-DTT-14)
  - `shipping` -> `confirmed` bởi Admin (FR10-DTT-15)
  - `shipping` -> `shipping` bởi Admin (FR10-DTT-16)
  - `shipping` -> `canceled` bởi Admin (FR10-DTT-17)
- **Rule 9 mở rộng (C2 = `-`)**:
  - `delivered` -> `pending` bởi Admin (FR10-DTT-18)
  - `delivered` -> `confirmed` bởi Admin (FR10-DTT-19)
  - `delivered` -> `shipping` bởi Admin (FR10-DTT-20)
  - `delivered` -> `delivered` bởi Admin (FR10-DTT-21)
  - `delivered` -> `canceled` bởi Admin (FR10-DTT-22)
- **Rule 10 mở rộng (C2 = `-`)**:
  - `canceled` -> `pending` bởi Admin (FR10-DTT-23)
  - `canceled` -> `confirmed` bởi Admin (FR10-DTT-24)
  - `canceled` -> `shipping` bởi Admin (FR10-DTT-25)
  - `canceled` -> `delivered` bởi Admin (FR10-DTT-26) *(Lưu ý: đây là điểm lỗi trong backend server.js cho phép chuyển đổi này, cần test kỹ)*
  - `canceled` -> `canceled` bởi Admin (FR10-DTT-27)
- **Rule 11 mở rộng (C1 = `-`, C2 là tập giá trị)**:
  Với C1 có 5 giá trị, C2 có 4 giá trị, C3 = User cố định. Có 2 điều kiện biến đổi tạo thành 1 cặp (C1, C2) cần cover 5 × 4 = 20 trường hợp lỗi bảo mật:
  - `pending/confirmed/shipping/delivered/canceled` sang các trạng thái `pending/confirmed/shipping/delivered` bởi User -> Đều trả về lỗi không có quyền. (FR10-DTT-28 đến FR10-DTT-47)
- **Rule 12 mở rộng (C1 là tập giá trị)**:
  - `shipping` -> `canceled` bởi User (FR10-DTT-48) *(Lưu ý: kiểm thử quy tắc cấm tự hủy khi đang giao)*
  - `delivered` -> `canceled` bởi User (FR10-DTT-49)
  - `canceled` -> `canceled` bởi User (FR10-DTT-50)

### Bảng kết quả kiểm thử cuối cùng:

| ID | C1: Hiện tại | C2: Mong muốn | C3: Người thực hiện | Kết quả mong đợi | Nguồn gốc |
|---|---|---|---|---|---|
| FR10-DTT-01 | pending | confirmed | Admin | R1: Thành công | Rule 1 |
| FR10-DTT-02 | pending | canceled | User | R1: Thành công | Rule 2 (User) |
| FR10-DTT-03 | pending | canceled | Admin | R1: Thành công | Rule 2 (Admin) |
| FR10-DTT-04 | confirmed | shipping | Admin | R1: Thành công | Rule 3 |
| FR10-DTT-05 | confirmed | canceled | User | R1: Thành công | Rule 4 (User) |
| FR10-DTT-06 | confirmed | canceled | Admin | R1: Thành công | Rule 4 (Admin) |
| FR10-DTT-07 | shipping | delivered | Admin | R1: Thành công | Rule 5 |
| FR10-DTT-08 | pending | pending | Admin | R2: Lỗi chuyển đổi | Rule 6 |
| FR10-DTT-09 | pending | shipping | Admin | R2: Lỗi chuyển đổi | Rule 6 |
| FR10-DTT-10 | pending | delivered | Admin | R2: Lỗi chuyển đổi | Rule 6 |
| FR10-DTT-11 | confirmed | pending | Admin | R2: Lỗi chuyển đổi | Rule 7 |
| FR10-DTT-12 | confirmed | confirmed | Admin | R2: Lỗi chuyển đổi | Rule 7 |
| FR10-DTT-13 | confirmed | delivered | Admin | R2: Lỗi chuyển đổi | Rule 7 |
| FR10-DTT-14 | shipping | pending | Admin | R2: Lỗi chuyển đổi | Rule 8 |
| FR10-DTT-15 | shipping | confirmed | Admin | R2: Lỗi chuyển đổi | Rule 8 |
| FR10-DTT-16 | shipping | shipping | Admin | R2: Lỗi chuyển đổi | Rule 8 |
| FR10-DTT-17 | shipping | canceled | Admin | R2: Lỗi chuyển đổi | Rule 8 |
| FR10-DTT-18 | delivered | pending | Admin | R2: Lỗi chuyển đổi | Rule 9 |
| FR10-DTT-19 | delivered | confirmed | Admin | R2: Lỗi chuyển đổi | Rule 9 |
| FR10-DTT-20 | delivered | shipping | Admin | R2: Lỗi chuyển đổi | Rule 9 |
| FR10-DTT-21 | delivered | delivered | Admin | R2: Lỗi chuyển đổi | Rule 9 |
| FR10-DTT-22 | delivered | canceled | Admin | R2: Lỗi chuyển đổi | Rule 9 |
| FR10-DTT-23 | canceled | pending | Admin | R2: Lỗi chuyển đổi | Rule 10 |
| FR10-DTT-24 | canceled | confirmed | Admin | R2: Lỗi chuyển đổi | Rule 10 |
| FR10-DTT-25 | canceled | shipping | Admin | R2: Lỗi chuyển đổi | Rule 10 |
| FR10-DTT-26 | canceled | delivered | Admin | R2: Lỗi chuyển đổi | Rule 10 *(Báo lỗi vì canceled là trạng thái kết thúc)* |
| FR10-DTT-27 | canceled | canceled | Admin | R2: Lỗi chuyển đổi | Rule 10 |
| FR10-DTT-28 | pending | pending | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-29 | pending | confirmed | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-30 | pending | shipping | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-31 | pending | delivered | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-32 | confirmed | pending | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-33 | confirmed | confirmed | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-34 | confirmed | shipping | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-35 | confirmed | delivered | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-36 | shipping | pending | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-37 | shipping | confirmed | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-38 | shipping | shipping | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-39 | shipping | delivered | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-40 | delivered | pending | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-41 | delivered | confirmed | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-42 | delivered | shipping | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-43 | delivered | delivered | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-44 | canceled | pending | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-45 | canceled | confirmed | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-46 | canceled | shipping | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-47 | canceled | delivered | User | R3: Không có quyền | Rule 11 |
| FR10-DTT-48 | shipping | canceled | User | R3: Không có quyền | Rule 12 |
| FR10-DTT-49 | delivered | canceled | User | R3: Không có quyền | Rule 12 |
| FR10-DTT-50 | canceled | canceled | User | R3: Không có quyền | Rule 12 |
