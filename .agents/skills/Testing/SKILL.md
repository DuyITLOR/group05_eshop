---
name: Testing
description: Thực hiện hành động test các test case có sẵn của function, update actual result + status và report bug
---

# Testing

Đọc **README.md** để:
- Hiểu đặc tả chức năng của ứng dụng.
- Lấy thông tin tài khoản để test ứng dụng

Đọc **api_specification.md** để hiểu Backend API của hệ thống EShop

Đọc **setup_guide.md** để hiểu cách chạy ứng dụng

Thực hiện test các test case nằm trong folder `./tests/test-cases/<function>`

Trong đó:
- `<function>`: Tên chức năng cần test (Ví dụ: FR01, FR02)

## Cách thực hiện test
1. Mở trình duyệt và truy cập URL ứng dụng
2. Thực hiện từng test step trong test case
3. So sánh kết quả thực tế với expected results
4. Chụp screenshot nếu phát hiện bug

Sau khi test xong thì cập nhật actual result + status trong file mới test
Trong đó:
- `Actual result`: Kết quả test thực tế
- `Status`: Trạng thái test (Pass/Fail/Blocked)

Sau khi xong test xong hết thì hãy tạo các file bug tương ứng nằm trong folder `./bugs/<function>` với tên format như sau: `<function>-bug-<sequence>`
Nếu chưa có folder `bugs` thì hãy tạo folder `./bugs` (ngang hàng với `backend`, `tests`).
Trong folder `<function>` hãy tạo thêm folder `images` và lưu screenshot tại đó.

Ví dụ:
```text
bugs/
├── FR01/
│   ├── FR01-bug-01.md
│   ├── images/
│   │   ├── FR01-bug-01.png
│   │   └── ...
│   └── ...
├── FR02/
│   ├── FR02-bug-01.md
│   ├── images/
│   │   ├── FR02-bug-01.png
│   │   └── ...
│   └── ...
└── ...
```

Áp dụng template tại: `.agents/skills/Testing/resources/Bug_report_template.md`
