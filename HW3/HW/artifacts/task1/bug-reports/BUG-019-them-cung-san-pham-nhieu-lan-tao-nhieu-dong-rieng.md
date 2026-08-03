# [BUG][EShop Cart] Thêm cùng một sản phẩm nhiều lần tạo ra nhiều dòng riêng biệt thay vì cộng dồn số lượng

## Found by Test Case

- FIND-05 (Task 2 Usability Session — P04)

## Related Requirements

FR-cart-item-aggregation; SCOPE-cart-logic

## Severity / Priority

Medium / P2

Khi người dùng click "Thêm vào giỏ hàng" nhiều lần với cùng một sản phẩm, hệ thống tạo ra nhiều line item riêng biệt thay vì cộng dồn số lượng vào một dòng duy nhất. Hành vi này vi phạm quy tắc UX cơ bản của giỏ hàng thương mại điện tử và gây nhầm lẫn khi người dùng cố ý hoặc vô tình thêm cùng sản phẩm nhiều lần.

## Environment

- SUT: EShop Frontend Web
- Module: Cart / Add to Cart
- Browser: Google Chrome
- OS: Windows 11
- Frontend URL: `http://localhost:5173`
- Backend URL: `http://localhost:3000`
- Dataset/fixture: Tài khoản test đã đăng nhập, trang danh sách hoặc chi tiết sản phẩm
- Ngày thực thi: 02/08/2026 – 03/08/2026
- SUT commit: `85af3ba875c88283615e22cb108f13e2fccaf0e9`

## Preconditions

1. Tài khoản người dùng đã đăng nhập.
2. Đang ở trang danh sách hoặc chi tiết sản phẩm.

## Steps to Reproduce

1. Click nút "Thêm vào giỏ hàng" của cùng một sản phẩm 2 lần liên tiếp.
2. Điều hướng đến trang Giỏ hàng.
3. Quan sát danh sách sản phẩm trong giỏ.

## Expected Result

- Giỏ hàng hiển thị 1 dòng với sản phẩm đó, số lượng = 2.
- Tổng tiền được tính theo số lượng cộng dồn.

## Actual Result

- Giỏ hàng hiển thị 2 dòng riêng biệt với cùng sản phẩm, mỗi dòng số lượng = 1.
- Người dùng bị nhầm lẫn về tổng số lượng thực sự muốn mua.

## Reproducibility

Tái hiện được nhất quán khi thêm cùng sản phẩm từ trang danh sách (nút "Thêm vào giỏ" dưới mỗi sản phẩm).

## Impact

- Trải nghiệm giỏ hàng không trực quan, khó quản lý khi có nhiều dòng trùng nhau.
- Tổng tiền và số lượng hiển thị có thể gây nhầm lẫn.
- Người dùng phải tự xóa từng dòng thừa.

## Evidence

> P04 quote (câu trả lời mở): *"mua cùng 1 sản phẩm nhiều lần nhưng lại bị tách ra riêng"*

Bằng chứng từ video recording phiên P04 (lưu tại `artifacts/task2/private/recordings/P04/`).

## Execution Notes

Phát hiện qua Usability Test (Task 2). Cần kiểm tra backend API: endpoint `POST /cart/add` có thực hiện upsert (tìm line item trùng và cộng dồn qty) hay luôn tạo document/record mới.

## Related Checklist Result

| Source     | Status | Actual Result |
| ---------- | ------ | ------------- |
| FIND-05 (Task 2) | Confirmed | Thêm cùng sản phẩm 2 lần tạo 2 dòng riêng biệt trong giỏ hàng thay vì 1 dòng qty=2. |

## Suggested Labels

- `type:bug`
- `status:new`
- `found-by:usability-test`
- `module:cart`
- `severity:medium`
- `priority:p2`

## Human Confirmation

- Confirmed by student: Pending
- Confirmation date:
- Evidence reviewed: Video P04 (private)
- GitHub issue: Not created
