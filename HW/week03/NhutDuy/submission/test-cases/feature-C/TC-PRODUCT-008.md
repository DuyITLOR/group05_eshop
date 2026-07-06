# TC-PRODUCT-008: Sửa tên một sản phẩm (luật sửa-cô-lập)

## Requirement ID
FR-15

## Module / Test type / Technique
Product / Functional / Equivalence Partitioning (vùng EP10/EP11 — `productOp = update`, luật "chỉ sản phẩm đó đổi")

## Preconditions
- Backend `:3000`, Web Admin `:5174` đang chạy; đã đăng nhập admin.
- Trong hệ thống có **ít nhất 2 sản phẩm** (vd iPhone, Samsung, MacBook…).

## Test data
| Field | Value |
| --- | --- |
| sản phẩm sửa | SP #1 (iPhone 15 Pro Max) |
| name (mới) | `TEST` |
| các trường khác | giữ nguyên |

## Test steps
1. Tab **Sản phẩm**, bấm **Sửa** ở sản phẩm #1.
2. Đổi **Tên** thành `TEST`, bấm **Lưu sản phẩm**.
3. Quan sát toàn bộ bảng danh sách sản phẩm.

## Expected result
Chỉ sản phẩm #1 đổi tên thành `TEST`; các sản phẩm khác **giữ nguyên** tên (FR-15: "Sửa một sản phẩm → chỉ sản phẩm đó bị thay đổi").

## Actual result
**Tất cả** sản phẩm trong bảng đều đổi tên thành `TEST` (giá vẫn khác nhau). `App.jsx` `handleProductSubmit` chạy `fakeMassUpdatedProducts = products.map(p => ({...p, name: productForm.name}))` → ghi đè tên cho mọi sản phẩm.

## Status / Related bugs
Fail / BUG-C2 (`[BUG][module: product] Sửa 1 sản phẩm làm đổi tên TẤT CẢ sản phẩm (mass-update)`) — #79
