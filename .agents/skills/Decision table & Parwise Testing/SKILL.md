---
name: Decision table & Pairwise testing
description: Tạo test design và test cases bằng phương pháp decision table & Pairwise testing
---

# Decision table & Pairwise testing

Đọc **README.md** để hiểu đặc tả chức năng của ứng dụng.<br>
Đọc **api_specification.md** để hiểu Backend API của hệ thống EShop

Kiểm tra xem nếu chức năng đó không thể dùng phương pháp decision table testing => Báo không thể áp dụng được + lý do => Kết thúc cuộc trò chuyện

## Các bước thực hiện

### Bước 1: Xác định điều kiện & kết quả
1. **Điều kiện (Conditions)**: Liệt kê tất cả các điều kiện ảnh hưởng đến kết quả, cùng các giá trị có thể có (thường là True/False, hoặc nhiều loại giá trị)
2. **Kết quả (Actions)**: Liệt kê tất cả các kết quả/hành động có thể xảy ra

### Bước 2: Xây dựng Decision Table đầy đủ
1. Tổng số rules (cột) = Tích số lượng giá trị của tất cả các điều kiện
2. Liệt kê tất cả tổ hợp điều kiện theo thuật toán phân bổ đều (xem template)
3. Xác định kết quả cho mỗi tổ hợp điều kiện dựa trên đặc tả
4. Đánh dấu các tổ hợp không thể xảy ra trong thực tế là **Impossible**

### Bước 3: Rút gọn Decision Table
1. **Loại bỏ** các rules đánh dấu Impossible
2. **Gộp** các rules có cùng kết quả: nếu hai rules chỉ khác nhau ở 1 điều kiện mà kết quả giống nhau, gộp thành 1 rule với điều kiện đó là "don't care" (ký hiệu `-`)
3. Đánh số lại các rules sau khi rút gọn

### Bước 4: Pairwise Testing (nếu cần)

> **Khi nào cần áp dụng Pairwise?**
> Sau khi rút gọn Decision Table ở Bước 3, kiểm tra xem trong bảng rút gọn có rule nào chứa ký hiệu `-` (don't care) hay không.
> - Nếu **KHÔNG có** dấu `-` nào → **KHÔNG cần** Pairwise. Giữ nguyên kết quả từ Bước 3.
> - Nếu **CÓ** dấu `-` → **CẦN** áp dụng Pairwise để mở rộng các ô `-` thành giá trị cụ thể.

**Quy trình Pairwise:**
1. Tìm tất cả các rules có chứa `-` trong bảng rút gọn
2. Liệt kê tất cả các **cặp điều kiện** có thể (pairs) từ các điều kiện trong rule đó
3. Với mỗi rule có `-`, tạo ra **tập con test case nhỏ nhất** sao cho mọi cặp giá trị giữa 2 điều kiện bất kỳ đều xuất hiện ít nhất 1 lần
4. Thay thế rule gốc (có `-`) bằng tập test case pairwise vừa tạo
5. Các rules không có `-` thì giữ nguyên

### Bước 5: Tạo Test Cases

Sau khi hoàn thành test design (Bước 1–4), tạo các file test case chi tiết từ bảng kết quả cuối cùng.

**Quy trình:**
1. Lấy danh sách test case ID từ bảng kết quả cuối cùng ở Mục 4 (hoặc Mục 3 nếu không cần Pairwise)
2. Ứng với **mỗi test case ID**, tạo **1 file test case** riêng biệt theo template TC
3. Mỗi file test case phải bao gồm đầy đủ các trường: Requirement ID, Module/Test type/Technique, Test design source, Coverage, Detail, Preconditions, Test data, Test steps, Expected results, Actual results, Status

**Các trường cần điền:**
- **Requirement ID**: Mã chức năng (VD: FR09)
- **Module / Test type / Technique**: [Tên module] / Functional / Decision Table & Pairwise Testing
- **Test design source**: `HW/week04/Dat/test-design/DTT-<function>.md`
- **Coverage**: Liệt kê ID test case trong test design mà TC này bao phủ
- **Detail**: Bảng chi tiết gồm ID, Test Objective, các điều kiện (C1–Cn) với giá trị cụ thể, và kết quả mong đợi
- **Test data**: Dữ liệu cụ thể dùng để test (mã coupon, email, giá trị đơn hàng, ...)
- **Test steps**: Các bước thực hiện kiểm thử chi tiết
- **Expected results**: Kết quả mong đợi tương ứng với test steps
- **Actual results**: Để trống hoặc ghi "Chưa thực hiện" (vì chưa test)
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
   - Các file bug report được đặt trong folder `HW/week04/Dat/bugs/<function>/` với tên có format: `<function>-bug-<sequence>.md` (VD: `FR09-bug-01.md`).
   - Nếu phát hiện bug trên giao diện hoặc cần minh chứng, chụp ảnh màn hình lỗi, lưu vào thư mục `HW/week04/Dat/bugs/<function>/images/` và nhúng vào báo cáo lỗi bằng đường dẫn tương đối (VD: `![Mô tả](./images/<function>-bug-01.png)`).

## Kết quả trả về

### File test design:
Trả về 1 file markdown có tên `DTT-<function>.md` trong thư mục `HW/week04/Dat/test-design/`

### File test cases:
Trả về các file markdown có tên `TC-<function>-<sequence>.md` trong thư mục `HW/week04/Dat/test-cases/<function>/`

Trong đó:
- `<function>`: là mã yêu cầu chức năng (VD: FR01, FR02, FR09)
- `<sequence>`: là số thứ tự của test case (VD: 01, 02,...)

Ví dụ: `HW/week04/Dat/test-cases/FR09/TC-FR09-01.md`

### File báo cáo lỗi (nếu có):
Trả về các file markdown báo cáo lỗi có tên `<function>-bug-<sequence>.md` trong thư mục `HW/week04/Dat/bugs/<function>/` và hình ảnh đính kèm (nếu có) trong thư mục `HW/week04/Dat/bugs/<function>/images/`

## Sử dụng template & ví dụ

### Test design:
- Template: `.agents/skills/Decision table & Parwise Testing/resources/DTT_template.md`
- Ví dụ: `.agents/skills/Decision table & Parwise Testing/examples/DTT-FR09.md`

### Test cases:
- Template: `.agents/skills/Test case/resources/TC_template.md`
- Ví dụ: `.agents/skills/Decision table & Parwise Testing/examples/TC-FR09-01.md`

### Báo cáo lỗi (Bug Report):
- Template: `.agents/skills/Decision table & Parwise Testing/resources/Bug_report_template.md`
- Ví dụ: `.agents/skills/Decision table & Parwise Testing/examples/FR10-bug-01.md`

## Lưu ý:
1. ID test case trong test design theo mẫu: `<function>-DTT-<sequence>` (VD: `FR09-DTT-01`)
2. Tên file test case theo mẫu: `TC-<function>-<sequence>.md` (VD: `TC-FR09-01.md`)
3. ID của Bug theo mẫu: `<function>-bug-<sequence>` (VD: `FR09-bug-01`)
4. Tên file báo cáo lỗi theo mẫu: `<function>-bug-<sequence>.md` (VD: `FR09-bug-01.md`)
5. Mỗi tổ hợp điều kiện phải được xác định kết quả dựa trên đặc tả trong README.md
6. Nếu một tổ hợp điều kiện không thể xảy ra trong thực tế, đánh dấu là Impossible và loại bỏ khi rút gọn
7. Khi có nhiều kết quả đồng thời xảy ra cho 1 rule, đánh dấu X ở tất cả các hàng kết quả tương ứng
8. Pairwise chỉ áp dụng cho các rules có dấu `-`. Nếu bảng rút gọn không có `-` nào thì bỏ qua Bước 4
9. Mỗi test case ID trong bảng kết quả cuối cùng phải có đúng 1 file test case tương ứng
10. Luôn cập nhật trạng thái thực tế của tất cả các file test case sau khi kiểm thử xong. Không để trống trường `Actual results` và `Status` khi đã hoàn thành bước kiểm thử.
