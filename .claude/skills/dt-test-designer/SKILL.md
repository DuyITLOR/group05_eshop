---
name: dt-test-designer
description: >-
  Sinh trọn bộ tài liệu kiểm thử cho MỘT requirement của EShop bằng kỹ thuật
  Decision Table (Bảng quyết định), theo đúng quy ước môn Software Testing
  (GitHub Test Case & Bug Management). Đọc spec từ README.md → xác định
  Conditions/Actions → dựng bảng đầy đủ (2^n) → rút gọn don't-care → sinh
  Test Design, Test Case (mã TC-[MODULE]-[NUMBER]), Test Run, Bug Report
  (khi fail) và Traceability Matrix. Dùng khi người dùng nói "viết test case
  bằng decision table", "áp dụng bảng quyết định cho FR-xx", hoặc gọi
  /dt-test-designer.
---

# Skill: Viết Test Case bằng Decision Table (chuẩn môn học)

Skill này tạo bộ test artifacts cho **một** requirement bằng kỹ thuật
**Decision Table**, tuân thủ vòng đời chuẩn của môn học:

> **Requirement → Test Case → Test Run → Bug → Fix (PR) → Retest → Close**

## Tham số đầu vào

Làm rõ trước khi chạy (nếu thiếu, hỏi ngắn gọn 1 lần):

1. **FR cần thiết kế** — vd `FR-01` (Đăng ký). Suy ra **MODULE** từ FR
   (FR-01 → `REGISTER`, FR-02 → `LOGIN`, FR-03 → `RESET-PASSWORD`…).
2. **Thư mục output** — mặc định `HW/week04/NhutDuy/`.
3. **Có chạy app để điền kết quả thật không?** Nếu không → `Status = Not Run`,
   bỏ qua Bug Report. Nếu có → thực thi, điền Actual results, sinh Bug Report
   cho các ca `Failed`.

Tham chiếu cố định:
- Spec: `README.md` (FR-01…FR-24).
- Template test case gốc: `tests/TC_template.md`.

## QUY ƯỚC BẮT BUỘC (theo tài liệu môn học)

### Mã test case — `TC-[MODULE]-[NUMBER]`
- Đúng: `TC-REGISTER-001`, `TC-REGISTER-002`… (số tăng dần, 3 chữ số).
- SAI (không dùng): `TC-FR01-01`, `test1`, `case-a`, `dt-v01`.
- Mã ổn định để giữ traceability khi đổi tiêu đề.

### Status hợp lệ
`Pass` · `Fail` · `Blocked` · `Not Run`. Khi `Fail`/`Blocked` **bắt buộc** có
`Related Bug` (số issue) hoặc lý do rõ ràng.

### Liên kết 2 chiều Test Case ↔ Bug
- Trong **Bug Report**: ghi `Found by Test Case: TC-REGISTER-00x`.
- Trong **Test Case**: điền `Related bugs: #<id>` khi có lỗi.
- Trong **Test Run**: cột `Related Bug` khi Result = Fail/Blocked.
- KHÔNG tạo bug chung chung — mỗi bug phải truy ngược về test case phát hiện.

### Labels gợi ý (ghi trong file để dễ chuyển sang GitHub Issues)
`type: test-case` · `module: register` · `technique: decision-table` ·
`result: pass|fail|blocked` · `severity: critical|major|minor|trivial` ·
`priority: P0|P1|P2|P3` · `status: new|ready for retest|verified`.

## Quy trình 9 bước

### B1 — Đọc & trích luật từ spec
Đọc FR-xx trong `README.md`, liệt kê mọi ràng buộc nghiệp vụ.

### B2 — Xác định Conditions (Causes)
Mỗi điều kiện = 1 mệnh đề T/F. Đặt mã `C1, C2,…`; ghi rõ ví dụ khi T / khi F.

### B3 — Xác định Actions (Effects/Outputs)
Tối thiểu: `A1 = thành công` (kèm hành vi: vd chuyển trang Đăng nhập),
`A2 = từ chối + thông báo lỗi`. Thêm action phụ nếu spec yêu cầu.

### B4 — Dựng BẢNG ĐẦY ĐỦ
Nêu rõ tổng số cột = **2^n**. (FR-01: 2^5 = 32.)

### B5 — RÚT GỌN (Collapsing)
- **Don't-care (`–`)**: điều kiện không ảnh hưởng kết quả thì để `–`.
- **Gộp cột cùng Action**.
Kết quả: 1 cột thành công (mọi điều kiện T) + mỗi cột lỗi cô lập đúng 1 điều
kiện sai. Trình bày **bảng rút gọn** dạng `Condition × Rule`.

### B6 — Sinh danh sách test case từ Rule
Mỗi cột rule → 1 test case `TC-[MODULE]-NNN`. Gán giá trị thật cho `–` (chọn
giá trị hợp lệ để cô lập đúng nguyên nhân).

### B7 — Xuất file TEST DESIGN
Tạo `<output>/Test Design/DT-[MODULE].md` gồm:
1. Phương pháp + Requirement tham chiếu + Labels gợi ý
2. Bảng Conditions (mã, ý nghĩa, ví dụ T/F)
3. Bảng Actions
4. Số cột bảng đầy đủ (2^n) + giải thích rút gọn
5. **Bảng rút gọn** (Condition × Rule)
6. **Bảng test case** (ID, Rule, Input, Expected Output)

### B8 — Xuất các file TEST CASE
Mỗi rule → `<output>/Test case/TC-[MODULE]-NNN.md` theo cấu trúc
`tests/TC_template.md`, trong đó:
- Tiêu đề: `# TC-[MODULE]-NNN: <mô tả ngắn>`
- `Requirement ID` → `FR-xx`
- `Module / Test type / Technique` → `<Module> / Functional / Decision Table`
- `Test design source` → `Test Design/DT-[MODULE].md`
- `Coverage` → `| Decision Table | TC-[MODULE]-NNN |`
- `Detail` → cột Input/Output lấy từ bảng B7
- `Preconditions`, `Test data`, `Test steps`, `Expected results`
- `Actual results` → để trống/`Not Run` nếu chưa chạy; điền thật nếu đã chạy
- `Status` → Pass/Fail/Blocked/Not Run
- Thêm dòng cuối `## Related bugs` → `None` hoặc `#<id>`

### B9 — (Khi có chạy app) TEST RUN + BUG REPORT + TRACEABILITY
**Test Run** — `<output>/test-runs/sprint-1-[module].md`, bảng:
`| Test Case ID | Module | Tester | Result | Related Bug | Note |`

**Bug Report** — mỗi ca Fail tạo `<output>/Bug Report/BUG-[MODULE]-NN.md`:
```
# [BUG][<Module>] <mô tả lỗi ngắn>
## Found by Test Case
TC-[MODULE]-NNN
## Requirement liên quan
FR-xx
## Severity / Priority
<Major/Minor/...> / <P0..P3>
## Environment
Browser, OS, URL (http://localhost:5173), build/commit
## Steps to reproduce
1. ...
## Expected result
...
## Actual result
...
## Evidence
Screenshot / console log / network response
## Labels
type: bug, module: <module>, severity: ..., priority: ..., status: new, found-by: test-case
```

**Traceability Matrix** — `<output>/test-summary/traceability-matrix.md`:
`| Requirement | Test Case | Result | Bug Issue | Status |`

## Cấu trúc thư mục output (để nộp)
```
<output>/                         (mặc định HW/week04/NhutDuy/)
├── Test Design/
│   └── DT-REGISTER.md
├── Test case/
│   ├── TC-REGISTER-001.md … TC-REGISTER-006.md
├── test-runs/                    (nếu có chạy app)
│   └── sprint-1-register.md
├── Bug Report/                   (optional — chỉ khi có ca Fail)
│   └── BUG-REGISTER-01.md …
└── test-summary/                 (nếu có chạy app)
    └── traceability-matrix.md
```

## Mẫu tham chiếu nhanh — FR-01 (Đăng ký), MODULE = REGISTER
Conditions: C1 Họ tên không trống · C2 Email đúng định dạng · C3 Email duy nhất ·
C4 Mật khẩu mạnh (≥8 ký tự, ≥1 hoa/thường/số/ký tự đặc biệt `@$!%*?&`) ·
C5 Xác nhận khớp. Actions: A1 thành công → trang Đăng nhập · A2 lỗi.
Bảng đầy đủ 2^5 = 32 cột → rút gọn **6 rule** → `TC-REGISTER-001..006`.

## Nguyên tắc chất lượng
- Thiết kế **bám spec** (README), không bịa luật.
- Mỗi test case lỗi chỉ để **một** điều kiện sai (cô lập nguyên nhân).
- Bug phải có **Steps / Expected / Actual / Evidence** — thiếu là không hợp lệ.
- Bug chỉ `Close` sau khi tester retest pass.
- Tiếng Việt cho nội dung; giữ mã ID/label/đường dẫn bằng tiếng Anh.
- KHÔNG sửa file trong `tests/` — chỉ ghi vào `<output>`.
