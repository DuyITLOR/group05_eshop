---
name: State Transition Testing
description: Tạo test design bằng phương pháp State Transition Testing — vẽ diagram, xác định states & actions, lập bảng transition table và thiết kế các test case
---

# State Transition Testing

Đọc **README.md** để hiểu đặc tả chức năng của ứng dụng.<br>
Đọc **api_specification.md** để hiểu Backend API của hệ thống EShop.

Kiểm tra xem nếu chức năng đó không thể dùng phương pháp state transition testing (ví dụ: chức năng quá đơn giản, không có trạng thái rõ ràng, không có sự chuyển đổi giữa các trạng thái dựa trên sự kiện) => Báo không thể áp dụng được + lý do => Kết thúc cuộc trò chuyện.

## Các bước thực hiện

### Bước 1: Vẽ State Transition Diagram (Sơ đồ chuyển trạng thái)

Từ đặc tả chức năng trong README.md:
1. Xác định tất cả các trạng thái có thể có của đối tượng (ví dụ: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`).
2. Xác định các hành động/sự kiện (actions/events) gây ra sự chuyển đổi trạng thái (ví dụ: Admin xác nhận, Admin giao hàng, User hủy).
3. Tạo thư mục `State Transition Diagrams/` trong thư mục `HW/week05/Dat/State Transition Testing/test-design/`.
4. Tạo file `<function>.mermaid` chứa mã nguồn code Mermaid (`stateDiagram-v2`) mô tả chi tiết sơ đồ chuyển trạng thái.
5. Chụp ảnh sơ đồ Mermaid đó và lưu dưới dạng `<function>.svg` (hoặc `<function>.png`) trong thư mục `State Transition Diagrams/images/`.
6. Nhúng hình ảnh sơ đồ chuyển trạng thái này vào file test design `STT-<function>.md` bằng cú pháp: `![State Transition Diagram](./State%20Transition%20Diagrams/images/<function>.svg)`.

### Bước 2: Xác định States và Actions

Liệt kê danh sách chi tiết:
1. **States (Các trạng thái)**: Liệt kê tên và mô tả chi tiết của từng trạng thái trong hệ thống.
2. **Actions/Events (Các hành động / Sự kiện kích hoạt)**: Liệt kê các hành động của tác nhân (Actor) hoặc sự kiện hệ thống làm thay đổi trạng thái, kèm theo vai trò/quyền hạn tương ứng (ví dụ: Admin, User).

### Bước 3: Áp dụng phương pháp States x Actions (State Transition Table)

Xây dựng bảng ma trận chuyển đổi trạng thái (States x Actions Matrix):
- **Hàng (Rows)**: Trạng thái hiện tại (Current State).
- **Cột (Columns)**: Hành động / Sự kiện kích hoạt (Action / Event).
- **Ô giao nhau (Cells)**: Trạng thái tiếp theo (Next State) và kết quả/phản hồi mong đợi của hệ thống.
  - Nếu chuyển đổi hợp lệ: Ghi trạng thái tiếp theo (ví dụ: `confirmed`).
  - Nếu chuyển đổi không hợp lệ: Ghi `Chặn (Lỗi 400 Bad Request)` hoặc `Không đổi` để thiết kế test case phủ định (Negative Test Cases).

### Bước 4: Tạo danh sách Test Cases (Scenario Matrix)

Từ bảng ma trận chuyển đổi trạng thái (States x Actions Matrix) ở Bước 3, lập danh sách đầy đủ tất cả các test case:
1. **Quy tắc bắt buộc**: Số lượng test case phải bằng **Số lượng States x Số lượng Actions**. Mỗi ô trong bảng ma trận tương ứng với đúng 1 Test Case (bao gồm cả các trường hợp chuyển đổi hợp lệ (Positive) và không hợp lệ (Negative)). Không được gộp chung hoặc bỏ sót bất kỳ ô nào.
2. Đánh số ID test case theo format: `<function>-STT-<sequence>` (VD: `FR10-STT-01` đến `FR10-STT-20` nếu có 5 States và 4 Actions).

### Bước 5: Tạo các file Test Case chi tiết

Ứng với **mỗi test case ID** trong Scenario Matrix ở Bước 4, tạo **1 file test case** riêng biệt theo template TC.

**Các trường cần điền:**
- **Requirement ID**: Mã chức năng (VD: FR10)
- **Module / Test type / Technique**: [Tên module] / Functional / State Transition Testing
- **Test design source**: `HW/week05/Dat/State Transition Testing/test-design/STT-<function>.md`
- **Coverage**: Liệt kê ID test case trong test design mà TC này bao phủ (VD: `FR10-STT-01`)
- **Detail**: Bảng chi tiết gồm ID, Test Objective, Trạng thái hiện tại, Hành động kích hoạt, và Trạng thái tiếp theo mong đợi
- **Test data**: Dữ liệu cụ thể dùng để test
- **Test steps**: Các bước thực hiện kiểm thử chi tiết (để đưa đối tượng về trạng thái hiện tại, thực hiện hành động và kiểm tra trạng thái mới)
- **Expected results**: Kết quả mong đợi tương ứng với các bước
- **Actual results**: Mặc định ghi "Chưa thực hiện"
- **Status**: Mặc định `Not Run`

### Bước 6: Thực hiện kiểm thử (Testing) & Báo cáo lỗi (Bug Report)

Sau khi tạo xong các test case, tiến hành thực hiện kiểm thử ứng dụng để tìm ra lỗi so với đặc tả (README.md).

**Quy trình thực hiện:**
1. Khởi động ứng dụng theo hướng dẫn trong `setup_guide.md` (nếu kiểm thử UI/API thủ công).
2. Thực hiện từng bước kiểm thử (test steps) trong mỗi test case.
3. So sánh kết quả thực tế với kết quả mong đợi (Expected results).
4. Cập nhật các trường sau trong file test case vừa chạy:
   - `Actual results`: Kết quả thực tế đạt được sau khi chạy test case.
   - `Status`: Cập nhật thành `Passed` (nếu đạt) hoặc `Failed` (nếu có lỗi/không khớp mong đợi) hoặc `Blocked` (nếu bị chặn).
5. Nếu test case có trạng thái `Failed`, hãy tạo file báo cáo lỗi (Bug Report) cho lỗi đó theo template Bug report.
   - Các file bug report được đặt trong folder `HW/week05/Dat/State Transition Testing/bugs/<function>/` với tên có format: `<function>-bug-<sequence>.md` (VD: `FR10-bug-01.md`).
   - Nếu phát hiện bug trên giao diện hoặc cần minh chứng, chụp ảnh màn hình lỗi, lưu vào thư mục `HW/week05/Dat/State Transition Testing/bugs/<function>/images/` và nhúng vào báo cáo lỗi bằng đường dẫn tương đối (VD: `![Mô tả](./images/<function>-bug-01.png)`).

## Kết quả trả về

### File test design và Diagram:
- Trả về 1 file markdown có tên `STT-<function>.md` trong thư mục `HW/week05/Dat/State Transition Testing/test-design/`
- Trả về 1 thư mục có tên `State Transition Diagrams` nằm trong thư mục `HW/week05/Dat/State Transition Testing/test-design/` bao gồm:
  - File `<function>.mermaid` chứa mã nguồn code Mermaid vẽ sơ đồ chuyển trạng thái.
  - Thư mục con `images/` chứa file hình ảnh `<function>.svg` (hoặc `<function>.png`) chụp từ sơ đồ chuyển trạng thái tương ứng.

### File test cases:
- Trả về các file markdown có tên `TC-<function>-<sequence>.md` trong thư mục `HW/week05/Dat/State Transition Testing/test-cases/<function>/`

Trong đó:
- `<function>`: là mã yêu cầu chức năng (VD: FR01, FR02, FR10)
- `<sequence>`: là số thứ tự của test case (VD: 01, 02,...)

Ví dụ: `HW/week05/Dat/State Transition Testing/test-cases/FR10/TC-FR10-01.md`

### File báo cáo lỗi (nếu có):
- Trả về các file markdown báo cáo lỗi có tên `<function>-bug-<sequence>.md` trong thư mục `HW/week05/Dat/State Transition Testing/bugs/<function>/` và hình ảnh đính kèm (nếu có) trong thư mục `HW/week05/Dat/State Transition Testing/bugs/<function>/images/`

## Sử dụng template & ví dụ

### Test design:
- Template: `.agents/skills/State Transition Testing/resources/STT_template.md`
- Ví dụ: `.agents/skills/State Transition Testing/examples/STT-FR10.md` (bao gồm sơ đồ Mermaid mẫu tại `.agents/skills/State Transition Testing/examples/State Transition Diagrams/FR10.mermaid` và ảnh chụp sơ đồ mẫu tại `.agents/skills/State Transition Testing/examples/State Transition Diagrams/images/FR10.svg`)

### Test cases:
- Template: `.agents/skills/Test case/resources/TC_template.md`
- Ví dụ: `.agents/skills/State Transition Testing/examples/TC-FR10-01.md`

### Báo cáo lỗi (Bug Report):
- Template: `.agents/skills/Decision table & Parwise Testing/resources/Bug_report_template.md`
- Ví dụ: `.agents/skills/State Transition Testing/examples/FR10-bug-01.md`

## Lưu ý:
1. ID test case trong test design theo mẫu: `<function>-STT-<sequence>` (VD: `FR10-STT-01`)
2. Tên file test case theo mẫu: `TC-<function>-<sequence>.md` (VD: `TC-FR10-01.md`)
3. ID của Bug theo mẫu: `<function>-bug-<sequence>` (VD: `FR10-bug-01`)
4. Tên file báo cáo lỗi theo mẫu: `<function>-bug-<sequence>.md` (VD: `FR10-bug-01.md`)
5. Phải vẽ đầy đủ sơ đồ trạng thái (Mermaid stateDiagram-v2) lưu trong folder `State Transition Diagrams` để làm cơ sở phân tích.
6. Bảng ma trận States x Actions phải liệt kê đầy đủ tất cả các trạng thái ở các dòng và hành động ở các cột. Mọi ô giao nhau đều phải được xác định rõ là valid hay invalid.
7. Số lượng test case trong Scenario Matrix bắt buộc phải bằng **States x Actions**. Mỗi ô trong bảng States x Actions Matrix tương ứng với đúng 1 Test Case.
8. Luôn cập nhật trạng thái thực tế của tất cả các file test case sau khi kiểm thử xong. Không để trống trường `Actual results` và `Status` khi đã hoàn thành bước kiểm thử.
9. Khi thiết kế diagram và table, phải bám sát đặc tả trong README.md, không tự ý sáng tạo thêm các trạng thái hoặc hành động không được mô tả.
