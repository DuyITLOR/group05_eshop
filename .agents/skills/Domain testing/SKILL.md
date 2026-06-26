---
name: Domain testing
description: Tạo test design bằng phương pháp domain testing(Equivalance Partitioning)
---

# Domain testing

Đọc **README.md** để hiểu đặc tả chức năng của ứng dụng.<br>
Đọc **api_specification.md** để hiểu Backend API của hệ thống EShop

Khi tạo test design bằng phương pháp domain testing(Equivalance Partitioning) làm theo các bước này:

## Xác định miền giá trị input & output
1. **Input**: Input có miền giá trị hợp lệ và không hợp lệ nào
2. **Output**: Output có miền giá trị hợp lệ và không hợp lệ nào

## Thiết kế các test case
1. Tìm 1 giá trị đại diện cho mỗi miền giá trị của input hợp lệ/không hợp lệ => tạo 1 test case
2. Tìm 1 giá trị đại diện cho mỗi miền giá trị output hợp lệ => tạo 1 test case

## Rút gọn test case
Nếu các giá trị input/output của các test case giống nhau => gộp lại thành 1 test case

## Kết quả trả về
Trả về 1 file markdown có tên `EP-<function>.md` trong thư mục `tests/test-design/`

## Sử dụng template
Làm theo template tại `.agents/skills/Domain testing/resources/EP_template.md`
Mẫu tham khảo tại `.agents/skills/Domain testing/examples/EP-FR03.md`

## Lưu ý:
1. ID của mỗi test case phải là duy nhất và theo mẫu như sau:
- Test case có miền giá trị hợp lệ: `<function>-EP-V<sequence>`
- Test case có miền giá trị không hợp lệ: `<function>-EP-IV<sequence>`

Trong đó:
- `<function>` là mã function cần test (VD: FR01, FR02, FR03)
- `<sequence>` là số thứ tự của test case (bắt đầu từ 1)

Ví dụ: `FR01-EP-V01`, `FR01-EP-IV01`, `FR02-EP-V01`, `FR02-EP-IV01`, ...
