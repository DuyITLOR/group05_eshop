---
name: uc-test-designer
description: >-
  Agent thiết kế & phát sinh test case cho EShop bằng kỹ thuật Use-Case Testing.
  Theo quy trình 4 bước: (1) đọc đặc tả README.md → gợi ý các FR áp dụng được
  use-case → user confirm; (2) sinh bản Use Case theo "Flow of Events" (Use Case
  Title, Primary actor, Level, Precondition, Minimal/Success Guarantees, Main
  Success Scenario, Extensions) + phân tích luồng → TC design analysis → user
  confirm; (3) sinh TC chi tiết (1 TC cho main flow + 1 TC mỗi extension), mỗi TC
  là 1 file markdown → user review; (4) thực thi TC → bug report (mỗi bug 1 file
  markdown). Dùng khi người dùng nói "use case testing cho FR-xx", "kiểm thử theo
  use case / scenario", hoặc gọi /uc-test-designer.
---

# Skill: Use-Case Testing (chuẩn môn học)

Agent tạo bộ test artifacts cho **một** feature EShop bằng kỹ thuật
**Use-Case Testing**: mô tả use case theo **Flow of Events** rồi phát sinh test
case theo **Main Success Scenario** và từng **Extension** (luồng thay thế/ngoại lệ).

> **Requirement → Use Case (flow of events) → Scenario → Test Case → Test Run → Bug → Retest → Close**

Nội dung tiếng Việt; giữ **mã ID / label / đường dẫn** bằng tiếng Anh.
Đặc tả gốc: `README.md` (FR-01…FR-24). Bước thiết kế là black-box (không suy diễn
từ mã nguồn); chỉ dùng mã nguồn khi thực thi tìm bug.

---

## QUY TRÌNH 4 BƯỚC (theo yêu cầu bài tập)

### BƯỚC 0 — Gợi ý đặc tả áp dụng được (⏸ chờ user confirm)
Use-Case Testing hợp với feature có **mục tiêu người dùng rõ ràng** + **luồng chính
và nhiều luồng thay thế/ngoại lệ**:

| FR | Vì sao hợp Use-Case |
|---|---|
| FR-08 Thanh toán | Luồng chính "đặt hàng" + nhiều ngoại lệ (chưa login, giỏ trống, mã lỗi…) |
| FR-09 Mã giảm giá | Main flow áp mã + 5 điều kiện → nhiều extension |
| FR-01 Đăng ký | Main "tạo TK" + ngoại lệ (email trùng, sai định dạng, MK yếu…) |
| FR-02 Đăng nhập | Main + ngoại lệ (sai MK, khóa tài khoản) |
| FR-03 Quên mật khẩu | 2 bước OTP + ngoại lệ (OTP sai/hết hạn, MK không khớp) |
| FR-16 Import CSV | Main import + ngoại lệ (sai đuôi, thiếu header, dòng lỗi → rollback) |

→ **Hỏi user chọn FR nào** trước khi làm tiếp.

### BƯỚC 1 — Use Case + TC Design Analysis (⏸ chờ user confirm)
Sinh file **Use Case** theo định dạng Flow of Events (bên dưới) + bảng phân tích
**Scenario → điều kiện → kết quả mong đợi** để dẫn ra test case. Trình user duyệt.

### BƯỚC 2 — TC chi tiết (⏸ chờ user review)
Mỗi test case = **1 file markdown** trong `Test case/`:
- **1 TC cho Main Success Scenario** (happy path).
- **1 TC cho mỗi Extension** (mỗi luồng thay thế/ngoại lệ).
- (Tùy chọn) thêm TC cho tổ hợp nhiều extension nếu spec đòi.

### BƯỚC 3 — Thực thi & Bug Report
Chạy hệ thống thật, điền Actual/Status; mỗi Fail → 1 file Bug Report; cập nhật
Traceability. Nếu "không chạy" → `Status = Not Run`, bỏ Bug Report.

---

## Định dạng Use Case — `Use Case/UC-[MODULE].md` (theo "Flow of Events")

Bám đúng khung mẫu (giống slide "Flow of Events"):

```
# UC-[MODULE]: <Tên use case>

| Trường | Nội dung |
|---|---|
| **Use Case Title** | <Tên use case> |
| **Primary actor** | <Tác nhân chính> |
| **Level** | User goal / Subfunction / Summary |
| **Precondition** | <điều kiện trước khi bắt đầu> |
| **Minimal Guarantees** | <đảm bảo tối thiểu kể cả khi thất bại> |
| **Success Guarantees** | <đảm bảo khi thành công> |

## Main Success Scenario
1. <bước 1>
2. <bước 2>
...

## Extensions
- **2a.** <điều kiện rẽ nhánh ở bước 2>:
  - **2a1.** <hệ thống xử lý gì>
- **3a.** <điều kiện>:
  - **3a1.** <xử lý>
...
```

Quy ước Extension: đánh số theo **bước phát sinh** + chữ cái (2a, 2b, 3a…), luồng
con dùng số (2a1, 2a2…), giống mẫu. Mỗi extension mô tả **điều kiện** và **cách hệ
thống phản ứng** (báo lỗi / yêu cầu nhập lại / quay về bước n…).

## TC Design Analysis (trong file Use Case hoặc `Test Design/UC-[MODULE]-analysis.md`)
Bảng dẫn xuất test case:
`| Scenario/Flow | Điều kiện kích hoạt | Kết quả mong đợi | Test Case |`
- 1 dòng cho Main Success Scenario.
- 1 dòng cho mỗi Extension.

## Định dạng Test Case — `Test case/TC-[MODULE]-NNN.md`
Theo `tests/TC_template.md`. Trường:
`Requirement ID` (FR-xx) · `Module / Test type / Technique` = `<Module> / Functional / Use-Case` ·
`Test design source` = `Use Case/UC-[MODULE].md` · `Coverage` (ghi Scenario/Extension phủ) ·
`Detail` · `Preconditions` · `Test data` · `Test steps` (bám các bước của scenario) ·
`Expected results` · `Actual results` (trống nếu Not Run) · `Status` · `Related bugs`.

Đặt tên: `TC-[MODULE]-001` = Main flow; các số kế tiếp = từng extension (ghi rõ
extension nào trong Coverage, vd "Extension 2a").

## Định dạng Bug Report — `Bug Report/BUG-[MODULE]-NN.md`
`# [BUG][<Module>] <mô tả>` · `Found by Test Case` · `Requirement liên quan` ·
`Severity / Priority` · `Environment` · `Steps to reproduce` · `Expected result` ·
`Actual result` · `Evidence` · `Labels`.

## Traceability — `test-summary/traceability-matrix.md`
`| Scenario / Extension | Requirement | Test Case | Result | Bug | Status |` +
tổng kết (số scenario/extension phủ, số TC, cross-reference FR).

---

## Cấu trúc thư mục output (để nộp)
```
<output>/                          (mặc định HW/week05/<Tên>/Use Case Testing/)
├── Use Case/
│   └── UC-[MODULE].md
├── Test Design/
│   └── UC-[MODULE]-analysis.md    (nếu tách riêng phần dẫn xuất TC)
├── Test case/
│   ├── TC-[MODULE]-001.md         (Main Success Scenario)
│   └── TC-[MODULE]-002.md …       (mỗi Extension 1 TC)
├── Bug Report/                    (chỉ khi có ca Fail)
│   └── BUG-[MODULE]-01.md …
└── test-summary/
    └── traceability-matrix.md
```

## Nguyên tắc chất lượng
- Use case **bám spec** (README), đủ 6 trường header + Main Scenario + Extensions.
- **Mỗi extension → tối thiểu 1 test case** (phủ luồng thay thế/ngoại lệ).
- Main flow test đúng "happy path"; extension test đúng điều kiện kích hoạt + phản
  ứng hệ thống.
- Bug phải có Steps/Expected/Actual/Evidence; liên kết ngược về test case.
- Mỗi bước ⏸ **dừng chờ user confirm** trước khi sang bước sau.
