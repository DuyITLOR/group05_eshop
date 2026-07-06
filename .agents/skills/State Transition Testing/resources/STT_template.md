# STT-[ID]: Test Design — [Tên chức năng]

**Phương pháp:** State Transition Testing  
**Yêu cầu tham chiếu:** [Mã chức năng (VD: FR-10)] ([Tên chức năng])

---

## 1. Sơ đồ chuyển trạng thái (State Transition Diagram)

*Sơ đồ chuyển trạng thái dưới đây được chụp và lưu tại đường dẫn `./State Transition Diagrams/images/[ID].svg` (hoặc `./State Transition Diagrams/images/[ID].png`). Code Mermaid chi tiết được lưu trong file `./State Transition Diagrams/[ID].mermaid`.*

![State Transition Diagram](./State%20Transition%20Diagrams/images/[ID].svg)

---

## 2. Xác định States & Actions

### 2.1. Danh sách các Trạng thái (States)

| State | Tên trạng thái | Mô tả ý nghĩa / Điều kiện đạt trạng thái |
|---|---|---|
| S_INIT | [Ví dụ: pending] | [Đơn hàng mới được tạo, chờ xác nhận] |
| ... | ... | ... |

### 2.2. Danh sách các Hành động / Sự kiện (Actions / Events)

| Action / Event | Actor | Mô tả |
|---|---|---|
| ACT_CONFIRM | [Ví dụ: Admin] | [Hành động phê duyệt đơn hàng] |
| ... | ... | ... |

---

## 3. Ma trận Trạng thái x Hành động (States x Actions Matrix)

*Lập bảng ánh xạ trạng thái hiện tại (dòng) và hành động (cột) để xác định sự chuyển đổi hợp lệ và không hợp lệ.*

| Trạng thái hiện tại | [Action 1] | [Action 2] | [Action N] |
|---|---|---|---|
| **[State A]** | [Next State / Thành công] | Chặn (Lỗi 400 Bad Request) | ... |
| **[State B]** | Không đổi | [Next State / Thành công] | ... |
| ... | ... | ... | ... |

---

## 4. Danh sách Test Cases (Scenario Matrix)

*Tổng hợp tất cả các kịch bản kiểm thử. Số lượng test case bắt buộc phải tuân theo công thức: **Tổng số Test Cases = Số lượng States x Số lượng Actions**. Mỗi ô trong bảng States x Actions Matrix ở Mục 3 phải tương ứng với đúng 1 Test Case dưới đây (không được bỏ sót hoặc gộp chung).*

| ID | Scenario / Test Case Name | Transition Path | Expected Result | Type |
|---|---|---|---|---|
| [function]-STT-01 | [Tên test case cho Cell 1,1] | `[State A]` --(Action 1)--> `[State B]` | [Mô tả trạng thái tiếp theo và phản hồi hệ thống] | Positive |
| [function]-STT-02 | [Tên test case cho Cell 1,2] | `[State A]` --(Action 2)--> `[Chặn / Không đổi]` | [Mô tả thông báo lỗi và trạng thái giữ nguyên] | Negative |
| ... | ... | ... | ... | ... |
| [function]-STT-[S x A] | [Tên test case cho Cell S,A] | `[State S]` --(Action A)--> `[Chặn / Không đổi]` | [Mô tả thông báo lỗi và trạng thái giữ nguyên] | Negative |

=> Tổng số test case: **[S x A]** (Ví dụ: 5 States x 4 Actions = 20 Test Cases)
