---
name: test case
description: Tạo các file test case cho 1 chức năng 
---

# Test case 

Đọc **README.md** để hiểu đặc tả chức năng của ứng dụng.<br>
Đọc **api_specification.md** để hiểu Backend API của hệ thống EShop

Tạo test case theo các bước sau đây:

## Dựa vào test design để tạo test case
Dựa vào 2 file test design trong thư mục `tests/test-design/` để tạo test case:
- `BVA-<function>.md`: Test design bằng phương pháp Boundary Value Analysis (nếu có)
- `EP-<function>.md`: Test design bằng phương pháp Equivalence Partitioning (nếu có) => Lấy các test case ID đã được tinh gọn ở phần `3. Rút gọn TC`

Ứng với mỗi `test case ID` trong test design, tạo 1 file test case tương ứng với các trường sau:
1. **Requirement ID**: ID của yêu cầu chức năng được kiểm thử.
2. **Module / Test type / Technique**: Tên Module, Loại kiểm thử (Functional, Performance, Security, Usability, Compatibility, Reliability, Accessibility), Kỹ thuật kiểm thử.
3. **Test design source**: Nguồn test case (VD: `test-design/EP-FR16.md`).
4. **Coverage**: Phạm vi bao phủ của test case.
5. **Detail**: Mô tả chi tiết về test case.
6. **Preconditions**: Điều kiện tiên quyết cần có để kiểm thử.
7. **Test data**: Dữ liệu kiểm thử cụ thể (nếu có).
8. **Test steps**: Các bước thực hiện chi tiết.
9. **Expected results**: Kết quả mong đợi tương ứng với các bước.
10. **Actual results**: Vì đây là bước tạo test case mới (chưa thực thi), hãy để trống hoặc ghi "Chưa thực hiện".
11. **Status**: Trạng thái mặc định khi tạo mới là `Not Run`.

## Kết quả trả về
Trả về các file markdown có tên `TC-<function>-<sequence>.md` trong thư mục `tests/test-cases/<function>/`

Trong đó:
- `<function>`: là mã yêu cầu chức năng (VD: FR01, FR02,...)
- `<sequence>`: là số thứ tự của test case (VD: 01, 02,...)

Ví dụ: `tests/test-cases/FR16/TC-FR16-01.md`

## Sử dụng template & ví dụ
- Bắt buộc đọc và áp dụng đúng cấu trúc bảng từ file template tại: `.agents/skills/Test case/resources/TC_template.md` (nằm trong thư mục của skill này).
- Tham khảo định dạng mẫu tại: `.agents/skills/Test case/examples/TC-FR16-01.md`
