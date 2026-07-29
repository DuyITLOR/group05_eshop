# Bug ID: `GUI-CART-016`

## Bug description:
Giao diện giỏ hàng trống (Empty State) thiếu icon/hình minh họa, chỉ hiển thị mỗi text.

## Test case coverage: 

- `GUI-CART-016` (Kiểm tra giao diện khi giỏ hàng trống - Empty State)

## Preconditions: 
- Giỏ hàng đang không có bất kỳ sản phẩm nào.

## Test steps: 
1. Xóa toàn bộ sản phẩm khỏi giỏ hàng (hoặc truy cập lúc chưa thêm gì).
2. Quan sát nội dung trang `/cart` khi rỗng.

## Expected results: 
Màn hình hiển thị text thân thiện KÈM THEO hình minh họa (icon/hình vẽ minh họa giỏ hàng rỗng).

## Actual results: 
Chỉ hiển thị dòng chữ "Giỏ hàng của bạn đang trống" và một link "Tiếp tục mua sắm", không có hình ảnh/icon minh họa nào.

## Severity: 
Minor

## Priority: 
Low

### Bug screenshot: 

- Chụp màn hình bug và lưu tại: `./images/GUI-CART-016.png`
- Nhúng screenshot bug tại đây bằng đường dẫn tương đối (Ví dụ: `![Mô tả ảnh](./images/GUI-CART-016.png)`)
