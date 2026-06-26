---
name: Boundary Value Analysis
description: Tạo test design bằng phương pháp Boundary Value Analysis(BVA)
---

# Boundary Value Analysis

Đọc **README.md** để hiểu đặc tả chức năng của ứng dụng.

Khi tạo test design bằng phương pháp Boundary Value Analysis làm theo các bước này

## 1.Xác định miền giá trị input hợp lệ
## 2.Thiết kế các test case
Áp dụng 3-Point Boundary Value cho biên dưới và biên trên của miền giá trị hợp lệ

## Kết quả trả về
Trả về 1 file markdown có tên `BVA-<function>.md` trong thư mục `tests/test-design/`

## Sử dụng template
Làm theo template tại `.agents/skills/Boundary Value Analysis/resources/BVA_template.md`
Mẫu tham khảo tại `.agents/skills/Boundary Value Analysis/examples/BVA-FR03.md`

## Lưu ý:
ID của mỗi test case phải là duy nhất và theo mẫu như sau:
- `<function>-<boundary>-<sequence>`

Trong đó:
- `<function>` là mã function cần test (VD: FR01, FR02, FR03)
- `<boundary>` là loại biên: 
  - `MINM`: biên dưới - 1
  - `MIN`: biên dưới
  - `MINP`: biên dưới + 1
  - `MAXM`: biên trên - 1
  - `MAX`: biên trên
  - `MAXP`: biên trên + 1
- `<sequence>` là số thứ tự của test case (bắt đầu từ 1)

Ví dụ: `FR01-MINM-01`, `FR01-MIN-01`, `FR01-MINP-01`, `FR01-MAXM-01`, `FR01-MAX-01`, `FR01-MAXP-01`, ...
