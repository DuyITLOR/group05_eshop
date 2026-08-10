# Bằng chứng GitHub Actions bắt buộc

Hai ảnh bắt buộc phải được chụp từ các lần chạy GitHub Actions thật trên nhánh của sinh viên. Tệp này chủ ý không tạo ảnh giả ở máy local.

1. Chép thư mục này vào thư mục gốc của group fork và đổi tên thành `mini-api-testing`.
2. Chép `newman-api-test.yml` vào `.github/workflows/newman-api-test.yml` trong group fork.
3. Commit và push các tệp đúng. Khi workflow **Newman API tests** có màu xanh, chụp trang Actions thành `ci-pass.png` và đặt ảnh vào thư mục này.
4. Đổi một `expected_status` trong `mini-users-me.data.json` từ `200` thành `999`, commit và push. Chụp workflow thất bại màu đỏ thành `ci-fail.png`.
5. Khôi phục status thành `200`, commit và push lần cuối. Commit cuối phải xanh.
6. Nếu cần, tải artifact `mini-newman-report.json` của lần chạy cuối, thay báo cáo local bằng báo cáo đó, rồi zip thư mục thành `23127107_Mini_API_Testing.zip`.

Không nộp placeholder hoặc ảnh đã chỉnh sửa để thay cho bằng chứng CI.
