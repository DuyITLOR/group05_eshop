# Báo cáo Tổng hợp Nhóm 05 — EShop Testing

**Phạm vi:** các bài tập kỹ thuật thiết kế test qua các tuần — **EP, BVA, DT, PT, ST, UC** (week03 → week05).
**Nguồn số liệu:** tổng hợp từ repo `HW/week03..05/` cho **cả 5 thành viên**, quy chủ theo folder & git author.
**Thành viên (5):** Nhựt Duy · Thành Dâng · Thành Đạt · Thế Đạt · Huy Quân

> **Ánh xạ folder → thành viên:** `NhutDuy/Nhutduy` = **Nhựt Duy** · `TheDat/Dat` = **Thế Đạt** · `ThanhDat` = **Thành Đạt** · `ThanhDang` = **Thành Dâng** · `Quan` = **Huy Quân**.

---

## 1. Tổng số Test Case & phân bổ theo thành viên

**Tổng cộng: 582 test case.**

| Thành viên | Tuần | Feature (FR) | Kỹ thuật | #TC | #Bug |
|---|---|---|---|--:|--:|
| **Nhựt Duy** | week03 | FR-01, FR-07, FR-15, FR-04 | EP + BVA | 84 | 20 |
| **Nhựt Duy** | week04 | FR-01 Đăng ký | DT | 6 | 4 |
| **Nhựt Duy** | week05 | FR-07 Giỏ hàng | ST + UC | 8 | 7 |
| **Thành Dâng** | week03 | FR-02, FR-11, FR-14, FR-07 (Mobile) | EP + BVA | 146 | 29 |
| **Thành Dâng** | week04 | FR-02 Đăng nhập | DT | 6 | 3 |
| **Thành Dâng** | week05 | FR-02 Đăng nhập | ST + UC | 15 | 1 |
| **Thành Đạt** | week03 | FR-04, FR-08, FR-18, FR-01 (Mobile) | EP + BVA | 83 | 20 |
| **Thành Đạt** | week04 | FR-09 Mã giảm giá | DT + PT | 13 | 5 |
| **Thành Đạt** | week05 | FR-08 Thanh toán | UC | 8 | 4 |
| **Thế Đạt** | week03 | FR-20/D9, FR-03, FR-10, FR-16 | EP + BVA | 107 | 0 |
| **Thế Đạt** | week04 | FR-10 Trạng thái đơn | DT | 50 | 3 |
| **Thế Đạt** | week05 | FR-10 Trạng thái đơn | ST + UC | 28 | 4* |
| **Huy Quân** | week04 | FR-09 Mã giảm giá | DT | 9 | 4 |
| **Huy Quân** | week05 | FR-03 Quên mật khẩu | ST + UC | 19 | 0 |

*\*4 bug week05 của Thế Đạt là báo lại 2 lỗi FR-10 đã có ở week04.*

**Tổng theo người:**

| Thành viên | Tổng #TC | Tổng #Bug (bản ghi) |
|---|--:|--:|
| Thế Đạt | 185 | 7 (~3 độc lập) |
| Thành Dâng | 167 | 33 |
| Thành Đạt | 104 | 29 |
| Nhựt Duy | 98 | 31 |
| Huy Quân | 28 | 4 |
| **Nhóm** | **582** | **104** (~100 độc lập) |

> Ghi chú đếm TC: week03 của Thành Dâng & Thành Đạt **không tách file TC riêng** (test case gộp trong `report/feature_*` / `test-design`), nên #TC lấy theo số ca execution / số TC-id — là con số hợp lý nhất, không phải đếm file.

---

## 2. Coverage của Test Case

### 2.1. Theo Feature (Requirement) — **14 / 24 FR** được phủ

| Feature | Kỹ thuật | Người phụ trách |
|---|---|---|
| FR-01 Đăng ký | EP, BVA, DT | Nhựt Duy (+ Thành Đạt: mobile) |
| FR-02 Đăng nhập | EP, BVA, DT, ST, UC | Thành Dâng |
| FR-03 Quên mật khẩu | EP, BVA, ST, UC | Thế Đạt, Huy Quân |
| FR-04 Hồ sơ cá nhân | EP, BVA | Nhựt Duy, Thành Đạt |
| FR-07 Giỏ hàng | EP, BVA, ST, UC | Nhựt Duy (+ Thành Dâng: mobile) |
| FR-08 Thanh toán | EP, BVA, UC | Thành Đạt |
| FR-09 Mã giảm giá | DT, PT | Thành Đạt, Huy Quân |
| FR-10 Trạng thái đơn | EP, BVA, DT, ST, UC | Thế Đạt |
| FR-11 Lịch sử đơn hàng | EP, BVA | Thành Dâng |
| FR-14 Quản lý Danh mục | EP, BVA | Thành Dâng |
| FR-15 Quản lý Sản phẩm | EP, BVA | Nhựt Duy |
| FR-16 Import CSV | EP, BVA | Thế Đạt |
| FR-18 Quản lý đơn (Admin) | EP, BVA | Thành Đạt |
| FR-20 Hủy đơn (Mobile) | EP, BVA | Thế Đạt |

### 2.2. Theo Kỹ thuật thiết kế — **đủ 6 / 6**

| Kỹ thuật | Người áp dụng |
|---|---|
| **EP** — Equivalence Partitioning | Nhựt Duy, Thành Dâng, Thành Đạt, Thế Đạt |
| **BVA** — Boundary Value Analysis | Nhựt Duy, Thành Dâng, Thành Đạt, Thế Đạt |
| **DT** — Decision Table | Nhựt Duy, Thành Dâng, Thành Đạt, Thế Đạt, Huy Quân |
| **PT** — Pairwise Testing | Thành Đạt |
| **ST** — State Transition | Nhựt Duy, Thành Dâng, Thế Đạt, Huy Quân |
| **UC** — Use-Case | Nhựt Duy, Thành Dâng, Thành Đạt, Thế Đạt, Huy Quân |

---

## 3. Status của Test Case

Số liệu tổng hợp **chỉ từ nơi có bảng test-run/execution rõ**; nhiều bộ TC ghi status rải trong từng file nên chưa gộp được toàn bộ:

| Nguồn có thống kê | Passed | Failed | Khác |
|---|--:|--:|---|
| Thành Dâng — week03 | 99 | 47 | — |
| Nhựt Duy — week03 | ≈ 25 | ≈ 43 | (một số biến thể Pass\*) |
| Nhựt Duy — week04 | 2 | 4 | — |
| Nhựt Duy — week05 (ST+UC) | 0 | 6 | 2 Blocked |
| Thành Đạt — week05 (UC) | 3 | 5 | — |

*Ghi chú:* phần còn lại (Thế Đạt, Huy Quân, Thành Đạt wk03/04, Thành Dâng wk05…) status nằm trong từng test case, **chưa tổng hợp** → cần chuẩn hóa để có con số toàn nhóm. Tỷ lệ Failed cao vì SUT có nhiều lỗi cài sẵn.

---

## 4. Tổng số Bug & phân bổ theo thành viên

**Ghi nhận 104 bản ghi bug — tương đương ≈ 100 lỗi độc lập** (sau khi trừ phần Thế Đạt báo lại FR-10 ở week05).

| Thành viên | Bug theo tuần | Tổng |
|---|---|--:|
| **Thành Dâng** | wk03: 29 · wk04: 3 · wk05: 1 | 33 |
| **Nhựt Duy** | wk03: 20 · wk04: 4 · wk05: 7 | 31 |
| **Thành Đạt** | wk03: 20 · wk04: 5 · wk05: 4 | 29 |
| **Thế Đạt** | wk03: 0 · wk04: 3 · wk05: 4* | 7 (~3) |
| **Huy Quân** | wk04: 4 · wk05: 0 | 4 |
| **Nhóm** | | **104** |

> **Trùng lặp cùng người (test lại feature qua nhiều tuần/kỹ thuật):** Nhựt Duy FR-01 (wk03↔wk04), FR-07 (wk03↔wk05); Thành Dâng FR-02 (wk03↔wk04↔wk05, bug "+2" lặp mỗi tuần); Thế Đạt FR-10 (wk04↔wk05, 2 lỗi báo lại 2 lần) → nhiều bản ghi là "test lại", không phải lỗi mới.

---

## 5. Coverage của Bug

### 5.1. Theo Feature (nhóm lỗi tiêu biểu)

| Feature | Người | Lỗi tiêu biểu |
|---|---|---|
| FR-01 Đăng ký | Nhựt Duy | Regex MK sai, API không validate, email trùng, thiếu field xác nhận, MK plaintext |
| FR-02 Đăng nhập | Thành Dâng | Sai `type` email/password, bộ đếm đăng nhập **+2** |
| FR-04 Hồ sơ | Nhựt Duy, Thành Đạt | Validate SĐT sai, leo thang `role`, không lưu địa chỉ |
| FR-07 Giỏ hàng | Nhựt Duy | Không gộp SP, thiếu +/-, thiếu dialog xác nhận, nhãn "Tổng tạm tính", trống thiếu ảnh, bấm 2 lần |
| FR-08 Thanh toán | Thành Đạt | Tổng tiền client sửa được, không xóa giỏ sau thanh toán |
| FR-09 Mã giảm giá | Thành Đạt, Huy Quân | Off-by-one ngưỡng, sai công thức %, giả mạo user_id, bypass giới hạn lượt |
| FR-10 Trạng thái đơn | Thế Đạt | Chuyển trạng thái không hợp lệ (canceled→delivered), user hủy đơn shipping, bypass phân quyền admin |
| FR-11 / FR-14 / FR-15 / FR-18 | Thành Dâng, Nhựt Duy, Thành Đạt | Sản phẩm: mass-update, giá không validate; danh mục/lịch sử/admin order (chi tiết trong bug-report từng người) |

### 5.2. Theo Severity (từ các bảng có gắn nhãn)

| Severity | Số lượng (đã tổng hợp) |
|---|--:|
| 🔴 Critical | ≈ 15 |
| 🟠 Major / High | ≈ 40 |
| 🟡 Minor / Medium | ≈ 30 |
| ⚪ Trivial / Low | ≈ 8 |
| ❔ Chưa gắn nhãn | phần còn lại |

*Ghi chú:* nhóm dùng **2 thang severity khác nhau** (Critical/Major/Minor/Trivial và Critical/High/Medium/Low). Cần **thống nhất 1 thang** và gắn nhãn cho các bug còn thiếu (nhất là Thế Đạt) để bảng chính xác tuyệt đối.

---

## 6. Nhận xét & việc cần bổ sung

- **Đủ 6/6 kỹ thuật**; phủ **14/24 FR**; **582 TC**; **~100 lỗi độc lập**. Cả nhóm đều đã làm ST & UC ở week05.
- **Đóng góp:** Thế Đạt (185 TC) và Thành Dâng (167 TC) nhiều nhất; Thành Đạt 104, Nhựt Duy 98, Huy Quân 28.
- ⚠️ **Cần bổ sung / gaps:**
  - **Thế Đạt — week03**: 107 TC nhưng **0 bug report** (chưa viết bug dù có test) → cần bổ sung bug report.
  - **Huy Quân**: **thiếu week03**; và **week05 (19 TC) chưa có bug report**.
  - **Status & Severity** chưa tổng hợp toàn nhóm (định dạng khác nhau) → cần chuẩn hóa để ra con số chính xác.
- **Trùng lặp** (cùng người test lại, hoặc 2 người cùng feature FR-09/FR-03/FR-08) là **có chủ đích** (đổi kỹ thuật) — nên ghi rõ để không bị hiểu là đếm trùng.
