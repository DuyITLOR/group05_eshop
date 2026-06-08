# Sprint 1 Test Run

## Execution information
| Field | Value |
| --- | --- |
| Sprint / Release | Sprint 1 |
| Environment | Browser on macOS, Frontend Web `http://localhost:5173`, Backend API `http://localhost:3000` |
| Tester | macos |
| Execution date | 2026-06-08 |

## Test run result
| Test Case ID | Module | Tester | Result | Related Bug | Note |
| --- | --- | --- | --- | --- | --- |
| TC-PRODUCT-SEARCH-001 | Product Listing | macos | Fail | Bug issue cần tạo | Search `laptop` không hiển thị sản phẩm; search `khongcosanphamxyz` không có empty state rõ ràng; giá sản phẩm đang hiển thị `VND` thay vì ký hiệu `₫`; input `<script>alert(1)</script>` không bị render thành script. |

## Evidence
- Screenshot 1: Danh sách sản phẩm mặc định hiển thị 5 sản phẩm.
- Screenshot 2: Search `laptop` hiển thị dòng `Kết quả tìm kiếm cho: laptop` nhưng không có sản phẩm nào.
- Screenshot 3: Search `khongcosanphamxyz` hiển thị dòng kết quả tìm kiếm nhưng không có thông báo empty state rõ ràng.
- Screenshot 4: Search `<script>alert(1)</script>` không thực thi script, nhưng phần hiển thị từ khóa sau dấu `:` bị trống.

## Retest note
Chưa retest. Sau khi developer fix bug, execute lại `TC-PRODUCT-SEARCH-001` và cập nhật kết quả ở file test run regression.
