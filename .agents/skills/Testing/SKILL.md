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

---

## 🐙 Tự động tạo Issue trên GitHub từ Bug Report

Sau khi hoàn tất tạo các file bug report trong thư mục `./bugs/<function>/`, Agent thực hiện tự động tạo GitHub Issue cho từng bug report:

1. **Định dạng Tiêu đề Issue (Title)**:
   - Format: `[HW03][BUG][screen: <screen>] [<Bug_ID>] <Short Bug Description>`
   - Ví dụ: `[HW03][BUG][screen: forgot-password] [FR03-bug-01] Không hiển thị thông báo phản hồi khi gửi yêu cầu quên mật khẩu`

2. **Quy đổi Đường dẫn Hình ảnh (Image URL)**:
   - Chuyển đổi tất cả đường dẫn ảnh tương đối (ví dụ `images/FR03-bug-01.png` hoặc `./images/...`) thành URL raw trên GitHub của branch đang làm việc:
     `https://raw.githubusercontent.com/<owner>/<repo>/<branch>/bugs/<function>/images/<filename>`
     *(ví dụ: `https://raw.githubusercontent.com/DuyITLOR/group05_eshop/HW02/Dat/bugs/FR03/images/FR03-bug-01.png`)*

3. **Gán Labels Chuẩn**:
   - `type: bug`
   - `found-by: test-case`
   - `severity: ...` (`severity: critical` / `severity: major` / `severity: minor` / `severity: trivial`)
   - `priority: ...` (`priority: P0` / `priority: P1` / `priority: P2` / `priority: P3`)
   - `module: <function_name>` hoặc `screen: <screen_name>`

4. **Đăng Issue qua GitHub REST API**:
   - Gửi yêu cầu `POST /repos/{owner}/{repo}/issues` với mã UTF-8 chuẩn để đảm bảo tiếng Việt không bị lỗi font.

