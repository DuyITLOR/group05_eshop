# Báo cáo Tổng hợp Nhóm 05 — EShop Testing

**Phạm vi:** bài tập các kỹ thuật thiết kế test — **EP, BVA, DT, PT, ST, UC**
**Nguồn số liệu:** tổng hợp từ repo (thư mục `HW/`, `tests/`), quy chủ theo git author.
**Thành viên (5):** Nhựt Duy · Thành Dâng · Thành Đạt · Thế Đạt · Huy Quân

> Quy chủ git → thành viên: `DuyITLOR / Lê Nhựt Duy` = **Nhựt Duy**; `NGO THE DAT` = **Thế Đạt**; `trwng-thdat / Thanh Dat` = **Thành Đạt**; `ThanhDang-Vn / Thanh_Dang` = **Thành Dâng**. **Huy Quân**: chưa có commit/artifact nào trong repo.

---

## 1. Tổng số Test Case & phân bổ theo thành viên

**Tổng cộng: 190 test case.**

| Thành viên | Feature (FR) | Kỹ thuật | Số TC | Vị trí |
|---|---|---|--:|---|
| **Nhựt Duy** | FR-01 Đăng ký | Decision Table | 6 | `HW/week04/NhutDuy/` |
| **Nhựt Duy** | FR-07 Giỏ hàng | State Transition | 2 | `HW/week05/Nhutduy/State Transition Testing/` |
| **Nhựt Duy** | FR-07 Giỏ hàng | Use-Case | 6 | `HW/week05/Nhutduy/Use Case Testing/` |
| **Thế Đạt** | FR-10 Trạng thái đơn | Decision Table / Pairwise | 50 | `HW/week04/Dat/` |
| **Thế Đạt** | FR-03, FR-10, FR-16, FR-20 | EP + BVA | 107 | `tests/test-cases/` (FR03 43, FR16 30, FR10 21, D9/FR20 13) |
| **Thành Đạt** | FR-09 Mã giảm giá | Decision Table + Pairwise | 13 | `HW/week04/ThanhDat/` |
| **Thành Dâng** | FR-02 Đăng nhập | Decision Table | 6 | `HW/week04/ThanhDang/` |
| **Huy Quân** | — | — | 0 | *(chưa có trong repo)* |

**Tổng theo người:**

| Thành viên | Tổng TC |
|---|--:|
| Thế Đạt | 157 |
| Nhựt Duy | 14 |
| Thành Đạt | 13 |
| Thành Dâng | 6 |
| Huy Quân | 0 |
| **Nhóm** | **190** |

---

## 2. Coverage của Test Case

### 2.1. Theo Feature (Requirement)

| Feature | Kỹ thuật đã áp dụng | Số TC | Người phụ trách |
|---|---|--:|---|
| FR-01 Đăng ký | DT | 6 | Nhựt Duy |
| FR-02 Đăng nhập | DT | 6 | Thành Dâng |
| FR-03 Quên/Đặt lại MK | EP, BVA | 43 | Thế Đạt |
| FR-07 Giỏ hàng | ST, UC | 8 | Nhựt Duy |
| FR-09 Mã giảm giá | DT, PT | 13 | Thành Đạt |
| FR-10 Trạng thái đơn hàng | EP, DT/PT | 71 | Thế Đạt |
| FR-16 Import CSV | EP, BVA | 30 | Thế Đạt |
| FR-20 Hủy đơn (Mobile) | EP | 13 | Thế Đạt |

→ **8 / 24 FR** được phủ bởi test case.

### 2.2. Theo Kỹ thuật thiết kế

| Kỹ thuật | Feature phủ | Người | Ghi chú |
|---|---|---|---|
| **EP** — Equivalence Partitioning | FR-03, FR-10, FR-16, FR-20 | Thế Đạt | design `tests/test-design/EP-*.md` |
| **BVA** — Boundary Value Analysis | FR-03, FR-16 | Thế Đạt | design `tests/test-design/BVA-*.md` |
| **DT** — Decision Table | FR-01, FR-02, FR-09 | Nhựt Duy, Thành Dâng, Thành Đạt | |
| **PT** — Pairwise Testing | FR-09, FR-10 | Thành Đạt, Thế Đạt | tổ hợp điều kiện |
| **ST** — State Transition | FR-07 | Nhựt Duy | + Thành Dâng có bản design nháp |
| **UC** — Use-Case | FR-07 | Nhựt Duy | + Thành Dâng có bản design nháp |

→ Nhóm đã áp dụng **đủ 6/6 kỹ thuật** yêu cầu.

---

## 3. Status của Test Case

Tổng hợp từ trường `Status` trong từng file test case:

| Status | Số lượng |
|---|--:|
| ✅ Passed | ≈ 100 |
| ❌ Failed | 75 |
| ⏸ Not Run | 9 |
| ⚠ Không ghi rõ | ≈ 6 |
| **Tổng** | **190** |

*Ghi chú:* 9 ca **Not Run** là bộ ST + UC cho FR-07 (thiết kế black-box, chưa thực thi). Một số file COUPON của Thành Đạt ghi `Status` dạng inline nên gộp vào "Passed".

---

## 4. Tổng số Bug & phân bổ theo thành viên

**Tổng cộng: 15 bug.**

| Thành viên | Feature | Số bug | Vị trí |
|---|---|--:|---|
| **Thành Đạt** | FR-09 Mã giảm giá | 5 | `HW/week04/ThanhDat/bug-report_COUPON.md` (BUG-01..05) |
| **Nhựt Duy** | FR-01 Đăng ký | 4 | `HW/week04/NhutDuy/Bug Report/` (BUG-REGISTER-01..04) |
| **Thế Đạt** | FR-10 Trạng thái đơn | 3 | `HW/week04/Dat/bugs/FR10/` (FR10-bug-01..03) |
| **Thành Dâng** | FR-02 Đăng nhập | 3 | `HW/week04/ThanhDang/bug-reports/` (BUG_01..03) |
| **Huy Quân** | — | 0 | *(chưa có trong repo)* |
| **Nhóm** | | **15** | |

---

## 5. Coverage của Bug

### 5.1. Theo Feature (Requirement)

| Feature | Số bug | Ví dụ lỗi tiêu biểu |
|---|--:|---|
| FR-01 Đăng ký | 4 | Regex mật khẩu sai, không kiểm định dạng email, cho email trùng, thiếu ô xác nhận MK |
| FR-02 Đăng nhập | 3 | Sai `type` input email/password, bộ đếm đăng nhập sai **+2** |
| FR-09 Mã giảm giá | 5 | Off-by-one ngưỡng tối thiểu, sai công thức % giảm giá, thiếu auth, bypass giới hạn lượt, sai thứ tự kiểm tra |
| FR-10 Trạng thái đơn | 3 | Chuyển trạng thái không hợp lệ được chấp nhận |

→ Bug tập trung ở **4 feature** (FR-01, FR-02, FR-09, FR-10).

### 5.2. Theo Severity

| Severity | Số lượng |
|---|--:|
| 🔴 Critical | 3 |
| 🟠 Major | 5 |
| 🟡 Minor | 1 |
| ⚪ Chưa gắn nhãn severity | 6 |
| **Tổng** | **15** |

*Ghi chú:* 6 bug (chủ yếu nhóm COUPON/FR-10) chưa ghi trường Severity rõ ràng — cần bổ sung để hoàn thiện.

---

## 6. Nhận xét & việc cần bổ sung

- **Đủ 6/6 kỹ thuật** (EP, BVA, DT, PT, ST, UC); phủ **8/24 FR**.
- **Phân bổ lệch:** Thế Đạt đóng góp phần lớn TC (157 — chủ yếu bộ EP/BVA trong `tests/`); các thành viên khác 6–14 TC.
- **Huy Quân chưa có artifact** trong repo → cần bổ sung hoặc xác nhận phần đóng góp.
- **Cần chuẩn hóa:** thống nhất trường `Status` (một số file dùng format inline) và **gắn Severity** cho 6 bug còn thiếu để bảng coverage bug đầy đủ.
- Một số TC COUPON (Thành Đạt) ghi `Pass` nhưng vẫn phát hiện 5 bug → nên cập nhật lại `Status = Failed` cho các ca dính bug để nhất quán TC ↔ Bug.
