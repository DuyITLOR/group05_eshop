# TC-CART-015: Số lượng cực lớn (giới hạn ẩn)

## Requirement ID
FR-07 (kèm FR-06 cho ô Số lượng)

## Module / Test type / Technique
Cart / Functional / Boundary Value Analysis (biên `quantity`: giá trị lớn dò giới hạn ẩn — SRS không có cận trên)

## Preconditions
- Backend `:3000`, Frontend Web `:5173` đang chạy.
- Đã đăng nhập (`test@eshop.com`).
- Đang ở trang chi tiết sản phẩm `/products/:id`.

## Test data
| Field | Value |
| --- | --- |
| product | iPhone 15 Pro Max |
| quantity | `1000000` |

## Test steps
1. Mở trang chi tiết iPhone `/products/1`.
2. Nhập ô **Số lượng** = `1000000`.
3. Bấm **Thêm vào giỏ hàng**.
4. Mở `/cart`.

## Expected result
Chấp nhận (SRS không quy định cận trên) — nhưng **nên có kiểm tồn kho**.

## Actual result
Thêm vào giỏ OK, không chặn (hệ thống **không kiểm tồn kho**) → phơi bày rủi ro thiếu kiểm tồn kho.

## Status / Related bugs
Pass\* / None (rủi ro: thiếu kiểm tồn kho, không tính bug bắt buộc vì SRS không yêu cầu)
