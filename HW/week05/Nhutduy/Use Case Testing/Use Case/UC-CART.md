# UC-CART: Quản lý giỏ hàng (Xem & chỉnh sửa giỏ)

**Phương pháp:** Use-Case Testing · **Module:** CART
**Yêu cầu tham chiếu:** FR-07 (Giỏ hàng) — tham chiếu FR-06 (Thêm vào giỏ), FR-24 (dialog xác nhận, empty state)
**Labels:** `type: test-case` · `module: cart` · `technique: use-case`

## Flow of Events

| Trường | Nội dung |
|---|---|
| **Use Case Title** | Quản lý giỏ hàng (xem, chỉnh số lượng, xóa sản phẩm) |
| **Primary actor** | Khách hàng |
| **Level** | User goal |
| **Precondition** | Đang ở ứng dụng EShop; có sản phẩm để thêm vào giỏ. |
| **Minimal Guarantees** | Giỏ hàng luôn phản ánh đúng các thao tác **đã xác nhận**; thao tác bị **hủy** không làm thay đổi giỏ. |
| **Success Guarantees** | Giỏ hiển thị đúng Sản phẩm / Đơn giá / Số lượng / Thành tiền / **Tổng cộng**; sản phẩm được thêm/sửa số lượng/xóa đúng theo thao tác. |

## Main Success Scenario

1. Khách hàng **thêm một sản phẩm** vào giỏ (từ trang chi tiết sản phẩm).
2. Hệ thống thêm sản phẩm vào giỏ và **cập nhật badge số lượng** trên thanh điều hướng.
3. Khách hàng **mở trang Giỏ hàng**.
4. Hệ thống hiển thị bảng gồm các cột: **Sản phẩm, Đơn giá, Số lượng (có nút +/-), Thành tiền, Thao tác**, và nhãn tổng **"Tổng cộng"**.
5. Khách hàng **chỉnh số lượng** bằng nút **+ / −**.
6. Hệ thống **cập nhật Thành tiền** của dòng và **Tổng cộng**.
7. Khách hàng bấm **Xóa** một sản phẩm.
8. Hệ thống hiển thị **dialog xác nhận**; khách hàng **Xác nhận**.
9. Hệ thống xóa sản phẩm khỏi giỏ và cập nhật tổng.
10. Khách hàng bấm **"Tiếp tục mua sắm"** → quay về trang chủ, **giỏ được giữ nguyên**.

## Extensions

- **1a.** **Thêm lại sản phẩm đã có** trong giỏ:
  - **1a1.** Hệ thống **tăng số lượng** của dòng đã có, **không tạo dòng mới**.
- **4a.** **Giỏ hàng trống**:
  - **4a1.** Hệ thống hiển thị **hình minh họa** + **thông báo giỏ trống** + nút **"Tiếp tục mua sắm"**.
- **5a.** **Giảm số lượng khi đang = 1**:
  - **5a1.** Hệ thống **giữ số lượng tối thiểu = 1** (không giảm về 0, không tự xóa dòng).
- **8a.** Khách hàng bấm **Hủy** trong dialog xác nhận xóa:
  - **8a1.** Hệ thống **đóng dialog** và **giữ nguyên** sản phẩm trong giỏ.

## TC Design Analysis — dẫn xuất Test Case

| # | Scenario / Flow | Điều kiện kích hoạt | Kết quả mong đợi | Test Case |
|:--:|---|---|---|---|
| 1 | Main Success Scenario | Thêm SP → xem giỏ → chỉnh số lượng → xóa (có xác nhận) → tiếp tục mua sắm | Toàn bộ luồng chạy đúng; hiển thị đủ cột + "Tổng cộng" | TC-CART-UC-01 |
| 2 | Extension 1a | Thêm lại SP đã có | Tăng số lượng, không tạo dòng mới | TC-CART-UC-02 |
| 3 | Extension 4a | Mở giỏ khi trống | Hiển thị empty state (hình minh họa + thông báo + nút tiếp tục) | TC-CART-UC-03 |
| 4 | Extension 5a | Bấm − khi số lượng = 1 | Giữ số lượng = 1 | TC-CART-UC-04 |
| 5 | Extension 8a | Bấm Hủy trong dialog xóa | Giữ nguyên sản phẩm | TC-CART-UC-05 |
| 6 | Kiểm hiển thị (bước 4) | Giỏ có hàng | Nhãn tổng đúng **"Tổng cộng"**; đủ 5 cột | TC-CART-UC-06 |

> Nguyên tắc: **1 test case cho Main Success Scenario** + **1 test case cho mỗi Extension** (phủ luồng thay thế/ngoại lệ), thêm 1 TC kiểm bất biến hiển thị của bước 4.
