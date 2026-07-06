# Pairwise Testing — FR-09: Apply Coupon

**Technique:** Pairwise (All-Pairs) — bổ sung cho Decision Table  
**Tham chiếu:** `03-decision-table.md`

---

## 1. Vì sao Decision Table KHÔNG dùng pairwise được cho các điều kiện guard

6 điều kiện C1–C6 trong decision table là **guard clause tuần tự, phụ thuộc nhau theo thứ tự**:

```
C1 → C2 → C3 → C4 → C5 → C6   (mỗi guard fail thì return ngay)
```

C3 chỉ có nghĩa khi C1=Y ∧ C2=Y; C4 chỉ khi C1–C3 đều Y... Nếu áp pairwise lên C1–C6, công cụ sẽ sinh các cặp như `C1=N ∧ C3=Y` hay `C2=N ∧ C4=Y` — đều là **impossible rules** (không thể xảy ra trong runtime). Vì vậy:

> Trên các điều kiện guard: **decision table đã là tập tối thiểu (7 rule)**, pairwise không áp dụng.

## 2. Vùng pairwise áp dụng được: các tham số ĐỘC LẬP trong "áp dụng thành công"

Khi coupon đã qua hết các guard (tồn tại, active, đủ min_order, chưa hết hạn), kết quả phụ thuộc vào **các tham số độc lập** — mỗi tham số tự do nhận giá trị của mình mà không ràng buộc tham số khác:

| Factor | Mô tả | Levels | Vì sao độc lập |
|--------|-------|--------|----------------|
| **F1 — type** | Loại coupon | `percent` / `fixed` | Quyết định nhánh công thức discount (`server.js:398` vs `402`) |
| **F2 — user_id** | Có gửi `user_id` trong body không | `provided` / `omitted` | Quyết định nhánh có/không kiểm tra usage (`server.js:386`) |
| **F3 — max_uses_per_user** | Cấu hình giới hạn lượt dùng của coupon | `1` / `2` | Thuộc tính của coupon, độc lập với type và user_id |

→ Cả 3 factor đều **không ràng buộc lẫn nhau** và đều nằm trong vùng success → đây mới là nơi pairwise có ý nghĩa.

## 3. Không gian tổ hợp & lý do dùng pairwise

- Full combinatorial: 2 (type) × 2 (user_id) × 2 (max_uses) = **8 tổ hợp**.
- Pairwise (all-pairs) cho 3 factor 2-level → chỉ cần **4 test case** (mảng trực giao L4) mà vẫn phủ **mọi cặp giá trị** của từng đôi factor.
- Giảm 8 → 4 (50%), vẫn đảm bảo: nếu lỗi do **tương tác của 2 factor bất kỳ** thì sẽ bị bắt.

## 4. Bảng Pairwise (mảng trực giao L4)

| Test | F1 type | F2 user_id | F3 max_uses | Coupon dùng |
|------|---------|-----------|-------------|-------------|
| PW1 | percent | provided | 1 | `SAVE10` (seed) |
| PW2 | percent | omitted | 2 | `PWPCT2` (tạo qua admin) |
| PW3 | fixed | provided | 2 | `VIP100` (seed) |
| PW4 | fixed | omitted | 1 | `BIGBUY` (seed) |

### Kiểm tra phủ đủ mọi cặp (all-pairs coverage)

| Cặp factor | Các giá trị cần phủ | Test phủ |
|-----------|---------------------|----------|
| (F1, F2) | (percent,prov) (percent,omit) (fixed,prov) (fixed,omit) | PW1, PW2, PW3, PW4 ✓ |
| (F1, F3) | (percent,1) (percent,2) (fixed,1) (fixed,2) | PW1, PW2, PW4, PW3 ✓ |
| (F2, F3) | (prov,1) (prov,2) (omit,1) (omit,2) | PW1, PW3, PW4, PW2 ✓ |

→ **Tất cả 12 cặp giá trị đều được phủ trong 4 test case.**

## 5. Data setup cần thiết

Seed data thiếu 1 coupon `percent` + `max_uses=2` còn hạn → tạo qua `POST /api/admin/coupons` (cần admin token):

```json
{
  "code": "PWPCT2",
  "type": "percent",
  "discount_value": 10,
  "min_order_amount": 300000,
  "expired_at": "2099-12-31",
  "max_uses_per_user": 2
}
```
*(Schema `is_active DEFAULT 1` → coupon tạo ra tự động active.)*

Với các test `user_id=provided` (PW1, PW3): đảm bảo user **chưa dùng** coupon đó (DB vừa reset, `coupon_usage` trống).

## 6. Truy vết Pairwise ↔ Test Case

| Pairwise | Test Case | Kết quả |
|----------|-----------|---------|
| PW1 | [TC-COUPON-101](../TestCase/TC-COUPON-101.md) | Pass (re-confirm BUG-02) |
| PW2 | [TC-COUPON-102](../TestCase/TC-COUPON-102.md) | Pass (re-confirm BUG-02) |
| PW3 | [TC-COUPON-103](../TestCase/TC-COUPON-103.md) | Pass |
| PW4 | [TC-COUPON-104](../TestCase/TC-COUPON-104.md) | Pass |

## 7. Kết quả chạy Playwright

`playwright-tests/tests/coupon-pairwise.spec.js` — **4/4 passed** (2026-06-29, 655ms)

| Test | Coupon | discount_amount (actual) | final_amount (actual) | Ghi nhận |
|------|--------|--------------------------|------------------------|----------|
| PW1 | SAVE10 (percent) | −3,600,000 *(đúng phải 40,000)* | 4,000,000 *(đúng phải 360,000)* | BUG-02 confirmed |
| PW2 | PWPCT2 (percent) | −3,600,000 *(đúng phải 40,000)* | 4,000,000 *(đúng phải 360,000)* | BUG-02 confirmed |
| PW3 | VIP100 (fixed) | 100,000 | 300,000 | Đúng |
| PW4 | BIGBUY (fixed) | 50,000 | 550,000 | Đúng |

## 8. Ghi chú quan trọng

- Pairwise ở đây **không thay thế** decision table — nó **bổ sung**: kiểm tra tương tác giữa các tham số độc lập trong vùng success, mà decision table (vốn gom cả vùng success vào R5/R7) không bóc tách.
- 2 test percent (PW1, PW2) **tái xác nhận BUG-02** (công thức percent sai) trên nhiều tổ hợp khác nhau → tăng độ tin cậy của bug.
- F3 (max_uses) với user fresh không làm đổi kết quả success, nhưng pairwise vẫn giữ nó để chứng minh hành vi type×user_id **ổn định bất kể cấu hình max_uses** — đúng tinh thần "phủ tương tác".
