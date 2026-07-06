# Format Output — Decision Table Testing Report

---

## Quy ước bắt buộc

- **Mã test case:** `TC-<MODULE>-<NNN>` — MODULE viết HOA, NNN 3 chữ số. Ví dụ: `TC-LOGIN-001`.
- **Technique** ghi: `Decision Table Testing`.
- **Status** ban đầu: `Not Run`. **Related bugs**: `None`.
- Mỗi test case phải đủ để người khác execute lại được.

---

## Khung report tổng thể

```markdown
# Decision Table Testing Report — <Tên feature>

## 0. Thông tin & nguồn
- Feature: <tên>
- Module: <MODULE>
- Nguồn: <spec / tài liệu yêu cầu / mô tả trực tiếp>
- Người thực hiện / ngày: <điền>

## 1. Conditions & Actions

**Conditions:**
| Mã | Mô tả | Giá trị |
|----|-------|---------|
| C1 | User đã đăng nhập | Y / N |
| C2 | Email tồn tại trong hệ thống | Y / N |
| C3 | Mật khẩu đúng | Y / N |

**Actions:**
| Mã | Mô tả |
|----|-------|
| A1 | Đăng nhập thành công, trả về token |
| A2 | Báo lỗi "Tài khoản không tồn tại" |
| A3 | Báo lỗi "Mật khẩu không đúng" |
| A4 | Báo lỗi "Đã đăng nhập rồi" |

## 2. Decision Table (đầy đủ)

| | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| **C1: Đã đăng nhập** | Y | N | N | N | N |
| **C2: Email tồn tại** | - | Y | Y | N | N |
| **C3: Mật khẩu đúng** | - | Y | N | Y | N |
| **A1: Thành công** | ✗ | ✓ | ✗ | ✗ | ✗ |
| **A2: Lỗi tài khoản** | ✗ | ✗ | ✗ | ✓ | ✓ |
| **A3: Lỗi mật khẩu** | ✗ | ✗ | ✓ | ✗ | ✗ |
| **A4: Đã đăng nhập** | ✓ | ✗ | ✗ | ✗ | ✗ |

> *Impossible rule: C2=N, C3=Y (email không tồn tại nhưng mật khẩu đúng) — không thể xảy ra, đã loại.*
> *R4+R5 có thể gộp vì C3 không ảnh hưởng khi C2=N — giữ tách để rõ ràng.*

## 3. Decision Table (sau rút gọn)

| | R1 | R2 | R3 | R4+R5 |
|---|---|---|---|---|
| **C1: Đã đăng nhập** | Y | N | N | N |
| **C2: Email tồn tại** | - | Y | Y | N |
| **C3: Mật khẩu đúng** | - | Y | N | - |
| **A1: Thành công** | ✗ | ✓ | ✗ | ✗ |
| **A2: Lỗi tài khoản** | ✗ | ✗ | ✗ | ✓ |
| **A3: Lỗi mật khẩu** | ✗ | ✗ | ✓ | ✗ |
| **A4: Đã đăng nhập** | ✓ | ✗ | ✗ | ✗ |

**Giải thích rút gọn:**
- R1: khi C1=Y (đã đăng nhập), C2 và C3 không quan trọng → don't care (-).
- R4+R5: khi C2=N (email không tồn tại), C3 không có nghĩa → don't care (-).

## 4. Bộ Test Case

<các test case theo format dưới>

## 5. Truy vết coverage (Rule ↔ Test Case)

| Rule | Tóm tắt | Test case |
|------|---------|-----------|
| R1 | Đã đăng nhập | TC-LOGIN-001 |
| R2 | Email đúng + mật khẩu đúng | TC-LOGIN-002 |
| R3 | Email đúng + mật khẩu sai | TC-LOGIN-003 |
| R4+R5 | Email không tồn tại | TC-LOGIN-004 |

> Tổng: 4 rule (sau rút gọn) / 4 test case.

## 6. Nghi vấn bug
- [ ] <mô tả nghi vấn>
- [ ] Impossible rule đã loại: C2=N + C3=Y — hệ thống có xử lý case này không?
```

---

## Format MỘT test case

```markdown
### TC-LOGIN-002: Đăng nhập thành công

**Requirement ID:** <FR-ID hoặc tên yêu cầu>
**Module / Test type / Technique:** Login / Functional / Decision Table Testing
**Phủ Rule:** R2 (C1=N, C2=Y, C3=Y) → A1

**Preconditions:**
- User chưa đăng nhập
- Tài khoản `user@example.com` tồn tại trong hệ thống

**Test data:**
| Trường | Giá trị |
|--------|---------|
| email | user@example.com |
| password | Correct@123 |

**Test steps:**
1. Mở màn hình đăng nhập
2. Nhập email và password hợp lệ
3. Bấm Đăng nhập

**Expected result:**
Hệ thống xác thực thành công, trả về token và chuyển về trang chủ.

**Status / Related bugs:** Not Run / None
```

---

## Ghi chú

- Happy path đặt trước, sau đó đến các trường hợp lỗi.
- Với rule "don't care (-)": ghi rõ trong test data đã chọn giá trị gì cho điều kiện đó.
- Với **extended entry** (điều kiện có nhiều hơn 2 giá trị): mỗi giá trị khác nhau dẫn đến hành động khác → tạo cột riêng, không gộp chung Y/N.
