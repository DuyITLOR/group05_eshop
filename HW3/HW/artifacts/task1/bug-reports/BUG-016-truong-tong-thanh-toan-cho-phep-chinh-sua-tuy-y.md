# [BUG][EShop Checkout] Trường tổng thanh toán cho phép chỉnh sửa tùy ý — lỗi bảo mật nghiêm trọng

## Found by Test Case

- FIND-02 (Task 2 Usability Session — P01, P03, P06, P07)

## Related Requirements

FR-checkout-integrity; SCOPE-security

## Severity / Priority

Critical / P0

Trường "Tổng thanh toán (VNĐ)" trên trang Checkout là một input field có thể chỉnh sửa tự do. Người dùng có thể nhập bất kỳ giá trị nào và hệ thống vẫn xác nhận đơn hàng thành công với giá trị đó — bao gồm cả 0 VND hoặc một con số bất thường. Đây là lỗi bảo mật cấp Critical vì nó cho phép người dùng thao túng giá trị thanh toán từ phía client mà không có server-side validation.

## Environment

- SUT: EShop Frontend Web
- Module: Checkout / Order Confirmation
- Browser: Chromium (Chrome), macOS Chrome (quan sát trên nhiều phiên)
- OS: Windows 11, macOS
- Admin URL: N/A (trang người dùng)
- Frontend URL: `http://localhost:5173`
- Backend URL: `http://localhost:3000`
- Dataset/fixture: Tài khoản test đã đăng nhập, giỏ hàng có sản phẩm điện thoại
- Ngày thực thi: 02/08/2026 – 03/08/2026
- SUT commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`

## Preconditions

1. Tài khoản người dùng đã đăng nhập.
2. Có ít nhất một sản phẩm trong giỏ hàng.
3. Điều hướng đến trang Xác nhận Đơn hàng (Checkout).

## Steps to Reproduce

1. Thêm bất kỳ sản phẩm nào vào giỏ hàng.
2. Click "Tiến hành thanh toán".
3. Trên trang Xác nhận Đơn hàng, click trực tiếp vào ô "Tổng thanh toán (VNĐ)".
4. Xóa giá trị hiện tại và nhập một giá trị tùy ý (ví dụ: `0`, `1`, hoặc `01200000000`).
5. Click "Xác nhận Thanh toán".

## Expected Result

- Trường tổng tiền phải là `readonly` — không cho phép click hay gõ phím.
- Backend phải validate và tính lại tổng tiền server-side dựa trên line items thực tế.
- Nếu giá trị gửi lên không khớp với tổng được tính server-side, request phải bị từ chối.

## Actual Result

- Ô "Tổng thanh toán (VNĐ)" là một `<input>` thông thường — có thể click, xóa và nhập giá trị bất kỳ.
- Sau khi thay đổi giá trị và click "Xác nhận Thanh toán", hệ thống vẫn tạo đơn hàng thành công với giá trị mà người dùng tự nhập.
- Ví dụ thực tế: P06 nhập `01200000000` → đơn được tạo với giá trị `1,199,900,000 đ` trên trang Lịch sử đơn hàng.

## Reproducibility

Luôn tái hiện được. Quan sát và khai thác trực tiếp bởi P06 (Nguyễn Thành Dâng) trong phiên usability test ngày 03/08/2026.

## Impact

Người dùng có thể tự đặt đơn hàng với giá trị thanh toán bằng 0 hoặc bất kỳ số nào. Đây là lỗ hổng bảo mật nghiêm trọng có thể dẫn đến thiệt hại tài chính trực tiếp nếu triển khai production với payment gateway thật.

## Evidence

Lỗi được phát hiện và ghi nhận qua phiên usability test. Bằng chứng dưới dạng video recording từ phiên P06 (lưu tại `artifacts/task2/private/recordings/P06/`).

> P06 quote: *"Giả sử tôi giảm giá trị xuống... giữ lại 120 ngàn thì sao"* → sau đó nhập `01200000000` và xác nhận thành công.
>
> P06 quote: *"Wow, cái này là tôi cũng được tự giảm giá cho chính mình luôn"*

Kết quả quan sát trên trang Lịch sử đơn hàng: Đơn hàng #1 đang "Chờ xác nhận" với tổng tiền bị thao túng.

## Execution Notes

Phát hiện qua Usability Test (Task 2). Không nằm trong checklist Task 1. Cần xác nhận thêm bằng cách kiểm tra source code React component Checkout và backend API endpoint tạo order xem có validate payload không.

## Related Checklist Result

| Source     | Status | Actual Result |
| ---------- | ------ | ------------- |
| FIND-02 (Task 2) | Confirmed | Ô tổng tiền là input field có thể chỉnh sửa. Đơn được tạo thành công với giá trị bất kỳ do người dùng nhập. |

## Suggested Labels

- `type:bug`
- `type:security`
- `status:new`
- `found-by:usability-test`
- `module:checkout`
- `severity:critical`
- `priority:p0`

## Human Confirmation

- Confirmed by student: Pending
- Confirmation date:
- Evidence reviewed: Video P06 (private)
- GitHub issue: Not created
