# 01 — Specification Analysis: feature_B (FR-11 — Xem Lịch sử Đơn hàng)


## 1. Functional Description

**Purpose:** User xem lịch sử đơn hàng cá nhân (Mã ĐH, Ngày đặt, Tổng tiền, Trạng thái) và có thể hủy đơn.

### Main Business Flow

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | User | Đăng nhập, vào trang Hồ sơ | — |
| 2 | System | Fetch orders | `GET /api/orders/my-orders` (JWT required) → `SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC` |
| 3 | System | Return data | Danh sách orders (hoặc rỗng nếu chưa có đơn) |
| 4 | Frontend | Render table | Hiển thị: Mã ĐH (#id), Ngày đặt, Tổng tiền (₫), Trạng thái (Việt), Nút Hủy |

### Cancel Order Sub-flow

| Condition | Behavior | Expected Result |
| --- | --- | --- |
| Click "Hủy đơn" trên order | `PUT /api/orders/{id}/cancel` (JWT required) | Status updated → `200` success |
| Order owned by different user | Backend check fails | `404` Not found |
| Order status = `delivered` hoặc `canceled` | Backend blocks cancel | `400` "Cannot cancel this order" |
| Cancel success | Refresh list | Show "Hủy đơn thành công!" |

---

## 2. Key Input Fields & State

### Implicit Inputs (affect behavior, not user-entered)

| Input | Type | Valid | Invalid |
| --- | --- | --- | --- |
| JWT Token | String | Valid, not expired | Missing, expired, malformed |
| user_id (from token) | Integer | Valid user in DB | Invalid/missing |
| orderId (cancel only) | Integer | Valid order, owned by user | Non-existent, different user |
| order.status | Enum | {pending, confirmed, shipping, delivered, canceled} | — |

---

## 3. Critical Constraints (SPEC vs CODE)

| Constraint | SPEC | CODE | Match? |
| --- | --- | --- | --- |
| **User isolation** | User chỉ xem đơn của chính mình | Query filter: `user_id = ?` from token | ✅ |
| **Display fields** | Mã đơn, Ngày đặt, Tổng tiền, Trạng thái | All 4 rendered in table | ✅ |
| **Status in Vietnamese** | Phải dịch sang tiếng Việt + phân biệt màu | `statusLabel()` map + color styling | ✅ |
| **Cancel when shipping** | "User KHÔNG được hủy khi shipping (chỉ Admin)" (FR-10) | Code allow cancel: `if status ≠ delivered AND status ≠ canceled` → **allows shipping** | ❌ **MISMATCH** |
| **Empty state** | Phải có thông báo rõ ràng | "Bạn chưa có đơn hàng nào." | ✅ |

---

## 4. Core Dependencies

| Field A | → | Field B | Impact |
| --- | --- | --- | --- |
| JWT Token | → | orders query | Token must be valid before accessing DB |
| user_id (from token) | → | orders filtered | Query scoped to current user only |
| orderId | → | status check | Before cancel, must verify order ownership + check status |
| status | → | cancel button | Show cancel button only if `status ≠ delivered AND canceled` |
