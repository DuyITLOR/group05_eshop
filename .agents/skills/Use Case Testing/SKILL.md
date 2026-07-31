---
name: Use Case Testing
description: Tạo test design bằng phương pháp Use Case Testing — xây dựng Use Case từ đặc tả chức năng, tạo test scenarios và test cases, thực hiện kiểm thử và báo cáo lỗi
---

# Use Case Testing

Đọc **README.md** để hiểu đặc tả chức năng của ứng dụng.<br>
Đọc **api_specification.md** để hiểu Backend API của hệ thống EShop

Kiểm tra xem nếu chức năng đó không thể dùng phương pháp use case testing (ví dụ: chức năng quá đơn giản, chỉ có 1 bước duy nhất, không có luồng thay thế hay ngoại lệ) => Báo không thể áp dụng được + lý do => Kết thúc cuộc trò chuyện

## Các bước thực hiện

### Bước 1: Xây dựng Use Case Specification

Từ đặc tả chức năng trong README.md, xây dựng Use Case bao gồm:

1. **Use Case Name**: Tên use case (VD: "Quản lý trạng thái đơn hàng")
2. **Use Case ID**: Mã use case theo format `UC-<function>` (VD: `UC-FR10`)
3. **Actor(s)**: Liệt kê các tác nhân tham gia (VD: User, Admin, System)
4. **Description**: Mô tả ngắn gọn mục đích của use case
5. **Preconditions**: Các điều kiện tiên quyết phải thỏa mãn trước khi use case bắt đầu
6. **Postconditions**: Trạng thái hệ thống sau khi use case kết thúc thành công
7. **Main Flow (Basic Flow)**: Luồng chính — chuỗi các bước thực hiện khi mọi thứ đều đúng, dẫn đến kết quả thành công. Đánh số từ S1, S2, S3...
8. **Alternative Flows**: Các luồng thay thế — các nhánh rẽ hợp lệ từ Main Flow (vẫn dẫn đến kết quả thành công nhưng theo cách khác). Đánh số AF1, AF2...
9. **Exception Flows**: Các luồng ngoại lệ — các trường hợp lỗi, vi phạm điều kiện, dẫn đến kết quả thất bại hoặc bị chặn. Đánh số EF1, EF2...

**Quy tắc:**
- Main Flow phải mô tả đầy đủ từng bước, từ hành động của Actor đến phản hồi của hệ thống
- Alternative Flow phải chỉ rõ "Tại bước Sx của Main Flow" để biết nhánh rẽ ở đâu
- Exception Flow phải chỉ rõ điều kiện gây lỗi và phản hồi lỗi của hệ thống
- Mỗi flow phải có kết quả rõ ràng (thành công hoặc thất bại)

### Bước 2: Tạo Use Case Test Scenarios

Từ Use Case Specification ở Bước 1, liệt kê tất cả các kịch bản kiểm thử (Test Scenarios). Mỗi scenario là một **đường đi (path)** qua Use Case:

1. **Main Flow scenario**: Đi qua toàn bộ Main Flow từ đầu đến cuối → kết quả thành công
2. **Alternative Flow scenarios**: Đi qua Main Flow đến điểm rẽ, sau đó đi theo Alternative Flow → kết quả thành công (theo cách khác)
3. **Exception Flow scenarios**: Đi qua Main Flow đến điểm rẽ (hoặc ngay từ Precondition), sau đó đi theo Exception Flow → kết quả thất bại

**Quy trình:**
1. Liệt kê tất cả các scenario theo bảng Scenario Matrix
2. Mỗi scenario phải có: ID, Tên scenario, Đường đi (path) qua Use Case, Kết quả mong đợi
3. ID theo format: `<function>-UCT-<sequence>` (VD: `FR10-UCT-01`)

**Scenario Matrix:**

| ID | Scenario Name | Path | Expected Result |
|---|---|---|---|
| `<function>-UCT-01` | [Tên scenario] | Main Flow: S1 → S2 → ... → Sn | [Kết quả] |
| `<function>-UCT-02` | [Tên scenario] | Main Flow: S1 → S2 → AF1 | [Kết quả] |
| `<function>-UCT-03` | [Tên scenario] | EF1 (tại Precondition) | [Kết quả] |

### Bước 3: Tạo Test Cases

Sau khi hoàn thành test design (Bước 1–2), tạo các file test case chi tiết từ Scenario Matrix.

**Quy trình:**
1. Lấy danh sách test case ID từ Scenario Matrix ở Bước 2
2. Ứng với **mỗi scenario ID**, tạo **1 file test case** riêng biệt theo template TC
3. Mỗi file test case phải bao gồm đầy đủ các trường: Requirement ID, Module/Test type/Technique, Test design source, Coverage, Detail, Preconditions, Test data, Test steps, Expected results, Actual results, Status

**Các trường cần điền:**
- **Requirement ID**: Mã chức năng (VD: FR10)
- **Module / Test type / Technique**: [Tên module] / Functional / Use Case Testing
- **Test design source**: `HW/week05/The Dat/test-design/UCT-<function>.md`
- **Coverage**: Liệt kê ID scenario trong test design mà TC này bao phủ
- **Detail**: Bảng chi tiết gồm ID, Test Objective, Path qua Use Case, và kết quả mong đợi
- **Test data**: Dữ liệu cụ thể dùng để test
- **Test steps**: Các bước thực hiện kiểm thử chi tiết (dựa trên path trong scenario)
- **Expected results**: Kết quả mong đợi tương ứng với test steps
- **Actual results**: Để trống hoặc ghi "Chưa thực hiện" (vì chưa test)
- **Status**: Mặc định `Not Run`

### Bước 4: Thực hiện kiểm thử (Testing) & Báo cáo lỗi (Bug Report)

Sau khi tạo xong các test case, tiến hành thực hiện kiểm thử ứng dụng để tìm ra lỗi so với đặc tả (README.md).

**Quy trình thực hiện:**
1. Khởi động ứng dụng theo hướng dẫn trong `setup_guide.md` (nếu kiểm thử UI/API thủ công).
2. Thực hiện từng bước kiểm thử (test steps) trong mỗi test case.
3. So sánh kết quả thực tế với kết quả mong đợi (Expected results).
4. Cập nhật các trường sau trong file test case vừa chạy:
   - `Actual results`: Kết quả thực tế đạt được sau khi chạy test case.
   - `Status`: Cập nhật thành `Passed` (nếu đạt) hoặc `Failed` (nếu có lỗi/không khớp mong đợi) hoặc `Blocked` (nếu bị chặn).
5. Nếu test case có trạng thái `Failed`, hãy tạo file báo cáo lỗi (Bug Report) cho lỗi đó theo template Bug report.
   - Các file bug report được đặt trong folder `HW/week05/The Dat/bugs/<function>/` với tên có format: `<function>-bug-<sequence>.md` (VD: `FR10-bug-01.md`).
   - Nếu phát hiện bug trên giao diện hoặc cần minh chứng, chụp ảnh màn hình lỗi (bug screenshot), lưu vào thư mục `HW/week05/The Dat/bugs/<function>/images/` và nhúng vào báo cáo lỗi bằng đường dẫn tương đối (VD: `![Mô tả](./images/<function>-bug-01.png)`).
6. **Tự động tạo Issue trên GitHub từ Bug Report**:
   - **Định dạng Tiêu đề Issue (Title)**: `[HW03][BUG][screen: <screen>] [<Bug_ID>] <Short Bug Description>`
   - **Quy đổi Đường dẫn Hình ảnh (Image URL)**: Chuyển đổi đường dẫn ảnh tương đối thành URL Raw trên GitHub của branch đang làm việc (`https://raw.githubusercontent.com/<owner>/<repo>/<branch>/bugs/<function>/images/<filename>`).
   - **Gán Labels Chuẩn**: `type: bug`, `found-by: test-case`, `severity: ...`, `priority: ...`, `module: <function_name>`.
   - **Đăng Issue**: Gửi yêu cầu qua GitHub REST API (`POST /repos/{owner}/{repo}/issues`) để đăng Issue lên GitHub repository.

## Kết quả trả về

### File test design:
Trả về 1 file markdown có tên `UCT-<function>.md` trong thư mục `HW/week05/The Dat/test-design/`

### File test cases:
Trả về các file markdown có tên `TC-<function>-<sequence>.md` trong thư mục `HW/week05/The Dat/test-cases/<function>/`

Trong đó:
- `<function>`: là mã yêu cầu chức năng (VD: FR01, FR02, FR10)
- `<sequence>`: là số thứ tự của test case (VD: 01, 02,...)

Ví dụ: `HW/week05/The Dat/test-cases/FR10/TC-FR10-01.md`

### File báo cáo lỗi (nếu có):
Trả về các file markdown báo cáo lỗi có tên `<function>-bug-<sequence>.md` trong thư mục `HW/week05/The Dat/bugs/<function>/` và hình ảnh đính kèm (nếu có) trong thư mục `HW/week05/The Dat/bugs/<function>/images/`

## Sử dụng template & ví dụ

### Test design:
- Template: `.agents/skills/Use Case Testing/resources/UCT_template.md`
- Ví dụ: `.agents/skills/Use Case Testing/examples/UCT-FR10.md`

### Test cases:
- Template: `.agents/skills/Test case/resources/TC_template.md`
- Ví dụ: `.agents/skills/Use Case Testing/examples/TC-FR10-01.md`

### Báo cáo lỗi (Bug Report):
- Template: `.agents/skills/Decision table & Parwise Testing/resources/Bug_report_template.md`
- Ví dụ: `.agents/skills/Use Case Testing/examples/FR10-bug-01.md`

## Lưu ý:
1. ID scenario trong test design theo mẫu: `<function>-UCT-<sequence>` (VD: `FR10-UCT-01`)
2. Tên file test case theo mẫu: `TC-<function>-<sequence>.md` (VD: `TC-FR10-01.md`)
3. ID của Bug theo mẫu: `<function>-bug-<sequence>` (VD: `FR10-bug-01`)
4. Tên file báo cáo lỗi theo mẫu: `<function>-bug-<sequence>.md` (VD: `FR10-bug-01.md`)
5. Mỗi scenario trong Scenario Matrix phải có đường đi (path) rõ ràng qua Use Case
6. Main Flow phải được test trước, sau đó mới đến Alternative và Exception Flows
7. Mỗi Alternative/Exception Flow phải chỉ rõ điểm rẽ từ Main Flow
8. Mỗi scenario ID trong Scenario Matrix phải có đúng 1 file test case tương ứng
9. Luôn cập nhật trạng thái thực tế của tất cả các file test case sau khi kiểm thử xong. Không để trống trường `Actual results` và `Status` when đã hoàn thành bước kiểm thử.
10. Khi xây dựng Use Case, phải dựa hoàn toàn vào đặc tả trong README.md, không tự suy diễn thêm yêu cầu không có trong đặc tả.
