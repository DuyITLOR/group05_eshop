# [BUG][EShop Cart] Không có phản hồi tức thời sau khi thêm sản phẩm vào giỏ hàng

## Found by Test Case

- FIND-01 (Task 2 Usability Session — P01, P02, P03, P04, P05, P07)

## Related Requirements

FR-add-to-cart-feedback; SCOPE-ux

## Severity / Priority

High / P1

Sau khi click "Thêm vào giỏ hàng", hệ thống không hiển thị bất kỳ phản hồi tức thời nào cho người dùng — không có toast message, không có badge cập nhật trên icon giỏ hàng, không có thay đổi trạng thái nút. Lỗi này xuất hiện ở 6/7 người tham gia trong usability test và là điểm nghẽn có tần suất cao nhất trong toàn bộ nghiên cứu.

## Environment

- SUT: EShop Frontend Web
- Module: Product Listing / Product Detail / Cart Header Badge
- Browser: Chromium (Chrome), được quan sát trên nhiều hệ điều hành
- OS: Windows 11, macOS
- Frontend URL: `http://localhost:5173`
- Backend URL: `http://localhost:3000`
- Dataset/fixture: Tài khoản test đã đăng nhập, trang danh sách sản phẩm
- Ngày thực thi: 02/08/2026 – 03/08/2026
- SUT commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`

## Preconditions

1. Tài khoản người dùng đã đăng nhập.
2. Đang ở trang danh sách sản phẩm hoặc trang chi tiết sản phẩm.
3. Giỏ hàng ban đầu trống hoặc có sẵn sản phẩm.

## Steps to Reproduce

1. Ở trang chủ (danh sách sản phẩm), click nút "Thêm vào giỏ" ngay dưới sản phẩm bất kỳ.
2. Quan sát ngay lập tức sau khi click.
3. Quan sát icon giỏ hàng trên header (badge số lượng).

## Expected Result

- Ngay sau khi click thành công, xuất hiện một toast notification (ví dụ: "Đã thêm [Tên sản phẩm] vào giỏ hàng!").
- Badge số lượng trên icon giỏ hàng ở header cập nhật ngay lập tức (+1).
- Hoặc nút chuyển trạng thái rõ ràng (ví dụ: "Đã thêm ✓").

## Actual Result

- Không có toast message hay snackbar nào xuất hiện.
- Badge số lượng trên icon giỏ hàng KHÔNG cập nhật tức thì (hoặc không hiển thị badge nào).
- Nút không thay đổi trạng thái một cách nhất quán.
- Một số phiên: nút phải click 2 lần mới có tác dụng (P01, P05).
- Người dùng phải tự điều hướng sang trang Giỏ hàng để xác nhận sản phẩm đã được thêm.

## Reproducibility

Luôn tái hiện được. Quan sát ở 6/7 phiên usability test.

## Impact

Người dùng mất định hướng sau thao tác cơ bản nhất trong luồng mua hàng. Dẫn đến hành vi double-click (P01, P05) và tăng số lượng sản phẩm không mong muốn. Làm giảm trust và perceived usability (phản ánh qua Q6 SUS — "nhiều điểm không nhất quán" có điểm trung bình 3.86/5).

## Evidence

Bằng chứng từ video recording các phiên usability (lưu tại `artifacts/task2/private/recordings/`).

> P01 quote: *"Ủa sao không được... để bấm lại. À, phải bấm hai lần."*
>
> P03 quote: *"đây có thể là một cái khó chịu đầu tiên đó là khi mình bấm vô thêm giỏ hàng thì nó không có thông báo"*
>
> P03 quote: *"nút giỏ hàng này cũng khá là nhỏ... không có cái dấu 1 hay là 2"*
>
> P05 quote: *"Thêm vào giỏ hàng... Lại thêm."*

## Execution Notes

Phát hiện qua Usability Test (Task 2). Có liên kết gián tiếp với BUG-004 (Empty form vẫn gửi request) — cùng chỉ ra vấn đề feedback trạng thái của các action trên giao diện người dùng.

## Related Checklist Result

| Source     | Status | Actual Result |
| ---------- | ------ | ------------- |
| FIND-01 (Task 2) | Confirmed | 6/7 participants không nhận được phản hồi trực quan sau khi thêm vào giỏ hàng. |

## Suggested Labels

- `type:bug`
- `status:new`
- `found-by:usability-test`
- `module:cart`
- `severity:high`
- `priority:p1`

## Human Confirmation

- Confirmed by student: Pending
- Confirmation date:
- Evidence reviewed: Video P01, P03, P05 (private)
- GitHub issue: Not created
