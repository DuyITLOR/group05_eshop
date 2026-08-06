# [BUG][EShop Cart] Giỏ hàng không được xóa sau khi thanh toán thành công

## Found by Test Case

- FIND-04 (Task 2 Usability Session — P05, P07)

## Related Requirements

FR-post-order-cart-clear; SCOPE-order-lifecycle

## Severity / Priority

High / P1

Sau khi người dùng đặt hàng và nhận màn hình "Thanh toán thành công!", các sản phẩm vừa đặt mua vẫn còn nằm nguyên trong giỏ hàng. Điều này vi phạm luồng nghiệp vụ cơ bản: sau khi tạo order thành công, cart phải được reset về trạng thái trống. Lỗi gây ra trải nghiệm thiếu tin cậy và có thể dẫn đến đặt hàng trùng lặp.

## Environment

- SUT: EShop Frontend Web
- Module: Cart / Order Completion
- Browser: Chromium (Chrome)
- OS: Windows 11
- Frontend URL: `http://localhost:5173`
- Backend URL: `http://localhost:3000`
- Dataset/fixture: Tài khoản test đã đăng nhập, giỏ hàng có sản phẩm
- Ngày thực thi: 02/08/2026 – 03/08/2026
- SUT commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`

## Preconditions

1. Tài khoản người dùng đã đăng nhập.
2. Giỏ hàng có ít nhất một sản phẩm.
3. Đã áp dụng mã giảm giá `VIP100` (hoặc không).
4. Click "Xác nhận Thanh toán" và nhận màn hình "Thanh toán thành công!".

## Steps to Reproduce

1. Thêm sản phẩm vào giỏ hàng và hoàn tất quá trình thanh toán.
2. Nhận màn hình "Thanh toán thành công!".
3. Click "Quay lại trang chủ" hoặc điều hướng thủ công.
4. Click vào icon "Giỏ hàng" trên header.

## Expected Result

- Giỏ hàng phải trống sau khi đặt hàng thành công.
- Badge số lượng trên header phải về 0.

## Actual Result

- Sản phẩm vừa thanh toán vẫn còn trong giỏ hàng với số lượng và giá như cũ.
- Badge số lượng không thay đổi.
- Người dùng bị nhầm lẫn và không chắc đơn hàng đã thực sự được ghi nhận.

## Reproducibility

Tái hiện được nhất quán. Quan sát trực tiếp tại phiên P05. Phiên P07 gặp tình trạng giỏ hàng có sẵn dữ liệu cũ từ phiên trước (session infrastructure issue liên quan).

## Impact

- Người dùng mất tin tưởng vào quá trình thanh toán (không biết đơn có được ghi nhận chưa).
- Nguy cơ đặt đơn trùng lặp.
- Session infrastructure bị ảnh hưởng: nếu cart không được reset, phiên usability test tiếp theo bị nhiễm dữ liệu (quan sát ở P07 — giỏ hàng có sẵn từ phiên trước).

## Evidence

> P05 quote: *"Ủa. Sao giỏ hàng vẫn còn ta? Thanh toán rồi mà."*

Bằng chứng từ video recording phiên P05 (lưu tại `artifacts/task2/private/recordings/P05/`).

## Execution Notes

Phát hiện qua Usability Test (Task 2). Cần kiểm tra backend: API tạo order có gọi clear cart không, hay frontend chịu trách nhiệm reset state sau khi nhận response thành công từ API.

## Related Checklist Result

| Source     | Status | Actual Result |
| ---------- | ------ | ------------- |
| FIND-04 (Task 2) | Confirmed | Giỏ hàng còn sản phẩm sau khi thanh toán thành công. P05 tự phát hiện và bày tỏ bất ngờ. |

## Suggested Labels

- `type:bug`
- `status:new`
- `found-by:usability-test`
- `module:cart`
- `module:checkout`
- `severity:high`
- `priority:p1`

## Human Confirmation

- Confirmed by student: Pending
- Confirmation date:
- Evidence reviewed: Video P05 (private)
- GitHub issue: Not created
