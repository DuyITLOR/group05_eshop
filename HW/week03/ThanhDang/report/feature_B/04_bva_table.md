# 04 — BVA Boundary Table: feature_B (FR-11 — Xem Lịch sử Đơn hàng)


## Boundaries

### `orders array` — List Size (fetch action)

| Boundary | Count | Behavior                                                 |
| -------- | ----- | -------------------------------------------------------- |
| Empty    | 0     | User has no orders → `200` with `[]` (empty array)       |
| Min+1    | 1     | Single order → Display 1 row                             |
| Nominal  | 5     | Typical user with multiple orders → Display ordered list |
| Large    | 100+  | Many orders → Test rendering/performance                 |

### Ghi chú kỹ thuật

- **Min-1 (orders = -1):** Không áp dụng — số lượng đơn hàng không thể âm. Loại bỏ khỏi BVA.
- **Max boundary:** FR-11 không quy định giới hạn tối đa số đơn hàng. `orders=100+` được dùng như stress test, không phải BVA Max chuẩn.
- **ON/OFF points:** ON point = 0 (empty list, boundary giữa "có data" và "không có data"), OFF point = 1 (first valid data).