---
name: st-test-designer
description: >-
  Agent thiết kế & phát sinh test case cho EShop bằng kỹ thuật State Transition
  Testing (Kiểm thử chuyển trạng thái). Theo quy trình 4 bước: (1) đọc đặc tả
  README.md → gợi ý các FR áp dụng được máy trạng thái → user confirm; (2) sinh
  TC design analysis (states, actions, bảng State×Actions, sơ đồ mermaid) → user
  confirm; (3) sinh TC chi tiết (End-to-End), mỗi TC là 1 file markdown → user
  review; (4) thực thi TC → bug report (mỗi bug 1 file markdown). Dùng khi người
  dùng nói "state transition testing cho FR-xx", "kiểm thử chuyển trạng thái",
  hoặc gọi /st-test-designer.
---

# Skill: State Transition Testing (chuẩn môn học)

Agent tạo bộ test artifacts cho **một** feature EShop bằng kỹ thuật
**State Transition Testing**, tuân thủ vòng đời:

> **Requirement → State model → Test Case → Test Run → Bug → Fix → Retest → Close**

Nội dung tiếng Việt; giữ **mã ID / label / đường dẫn** bằng tiếng Anh.
Đặc tả gốc: `README.md` (FR-01…FR-24). KHÔNG suy diễn từ mã nguồn ở bước thiết kế
(black-box) — chỉ dùng mã nguồn ở bước thực thi để tìm bug.

---

## QUY TRÌNH 4 BƯỚC (theo yêu cầu bài tập)

### BƯỚC 0 — Gợi ý đặc tả áp dụng được (⏸ chờ user confirm)
Đọc `README.md`, liệt kê các FR **hợp** với State Transition (hành vi phụ thuộc
**trạng thái hiện tại + sự kiện**, có vòng đời/khóa/luồng nhiều bước), kèm lý do:

| FR | Vì sao hợp State Transition |
|---|---|
| FR-07 Giỏ hàng | Giỏ có vòng đời: trống ↔ có hàng, dialog xác nhận, thanh toán kết thúc |
| FR-02 Đăng nhập & khóa TK | Bộ đếm sai → khóa 30s → mở lại (phụ thuộc lịch sử) |
| FR-03 Quên/Đặt lại MK | Wizard 2 bước + vòng đời OTP (valid → used/expired) |
| FR-10 Trạng thái đơn hàng | Máy trạng thái tường minh (pending→confirmed→shipping→delivered / canceled) |
| FR-08 Thanh toán | Cổng auth + vòng đời giỏ→đơn→xóa giỏ |

→ **Hỏi user chọn FR nào** trước khi làm tiếp.

### BƯỚC 1 — TC Design Analysis (⏸ chờ user confirm)
Sinh file **Test Design** (mục "Định dạng Test Design" bên dưới): States, Actions,
Bảng State × Actions (C1), sơ đồ mermaid. Trình cho user duyệt.

### BƯỚC 2 — TC chi tiết (⏸ chờ user review)
Mỗi test case = **1 file markdown** trong `Test case/`. Mặc định dùng độ phủ
**End-to-End** (mỗi TC là 1 kịch bản xuyên suốt Khởi tạo → Kết thúc). Có thể đổi
sang **0-switch** (mỗi transition 1 TC) nếu user yêu cầu.

### BƯỚC 3 — Thực thi & Bug Report
Chạy hệ thống thật (`frontend-web` :5173, `backend` :3000), điền **Actual/Status**;
mỗi ca Fail → **1 file Bug Report** trong `Bug Report/`; cập nhật Traceability.
Nếu user chọn "không chạy" → để `Status = Not Run`, bỏ qua Bug Report.

---

## QUY ƯỚC BẮT BUỘC

### Đặt tên trạng thái — GHI RÕ TÊN, KHÔNG dùng ký hiệu S0/S1
- Đúng: `Giỏ trống`, `Giỏ 1 dòng`, `Dialog xác nhận`, `Đã thanh toán`.
- SAI: `S0`, `S1`, `S3` trong nội dung trình bày (chỉ được dùng làm id nội bộ
  trong code mermaid, không hiển thị cho người đọc).
- Luôn có **trạng thái khởi tạo** (Initial) và, nếu luồng có điểm dừng,
  **trạng thái kết thúc** (Final).

### Sơ đồ — LUÔN vẽ bằng **mermaid** (`stateDiagram-v2`)
Không dùng ASCII art. Chuyển tiếp khởi tạo `[*] → Init` và kết thúc `Final → [*]`.

### Bảng C1 (State × Actions) — ĐÚNG nguyên tắc số ô = |States| × |Actions|
- Số dòng **đúng bằng** |States| × |Actions| (vd 6 × 6 = 36). **KHÔNG thêm dòng.**
- **KHÔNG dùng cột Guard** để tách dòng (tách dòng làm vượt quá số ô → sai nguyên tắc).
- Ô **End = "—"** khi action **không hợp lệ** ở trạng thái đó (không xảy ra chuyển
  tiếp — KHÔNG ghi tự quay về chính nó).
- Với tổ hợp mà End **phụ thuộc điều kiện** (vd xóa dòng cuối/không cuối): ghi các
  End khả dĩ trong 1 ô + giải thích điều kiện ở cột **Ghi chú** (vẫn giữ 1 dòng).

### Mã test case
- End-to-End: `TC-[MODULE]-E2E-NN` (vd `TC-CART-E2E-01`).
- 0-switch (nếu dùng): `TC-[MODULE]-NNN`.
- Status hợp lệ: `Pass · Fail · Blocked · Not Run`. Fail/Blocked bắt buộc có
  `Related bugs`.

### Liên kết 2 chiều Test Case ↔ Bug
Bug ghi `Found by Test Case`; Test Case ghi `Related bugs`; Traceability nối lại.

---

## Định dạng Test Design — `Test Design/ST-[MODULE].md`

**B1 — States & Actions**
- Bảng **States** (cột: Trạng thái | Định nghĩa) — tên đầy đủ, có Initial & Final.
- Bảng **Actions** (cột: Mã Ax | Action | Mô tả theo spec).
- Ghi chú các **chuyển tiếp biên** (khởi tạo tự động, trạng thái kết thúc) và các
  điều kiện đặc biệt (vd số lượng tối thiểu = 1) bằng lời — **không** lập "guard".
- **Sơ đồ mermaid** `stateDiagram-v2`.

**B2 — State Transition Table (Cách 1: States × Actions)**
- Bảng đủ |States|×|Actions| dòng, cột: `# | Start (State) | Action | End (State) | Valid/Invalid | Ghi chú`.
- Quy ước End = "—" cho Invalid; End theo điều kiện ghi kèm Ghi chú.
- **Thống kê**: tổng tổ hợp, số Valid, số Invalid, + chuyển tiếp khởi tạo.
- 1 sơ đồ **mermaid flowchart** minh họa Valid/Invalid.
- *(Chỉ làm Cách 1. Không làm Cách 2 States × States trừ khi user yêu cầu.)*

**B3 — Thiết kế Test Case (End-to-End)**
- Mỗi kịch bản: bảng đường đi `Bước | State trước | Sự kiện | State sau | Chuyển tiếp phủ`.
- Bảng **phủ chuyển tiếp** cho biết mỗi transition được kịch bản nào phủ.
- Đảm bảo phủ hết tổ hợp Valid + mọi nhánh kết quả của tổ hợp có điều kiện + lối
  vào trạng thái kết thúc.

## Định dạng Test Case — `Test case/TC-[MODULE]-E2E-NN.md`
Theo `tests/TC_template.md`, thêm bảng **Kịch bản (đường đi trạng thái)**. Trường:
`Requirement ID` (FR-xx) · `Module / Test type / Technique` = `<Module> / End-to-End / State Transition` ·
`Test design source` · `Coverage` · bảng kịch bản · `Preconditions` · `Test steps` ·
`Expected results` · `Actual results` (trống nếu Not Run) · `Status` · `Related bugs`.

## Định dạng Bug Report — `Bug Report/BUG-[MODULE]-NN.md`
`# [BUG][<Module>] <mô tả>` · `Found by Test Case` · `Requirement liên quan` ·
`Severity / Priority` · `Environment` · `Steps to reproduce` · `Expected result` ·
`Actual result` · `Evidence` · `Labels`.

## Traceability — `test-summary/traceability-matrix.md`
`| Chuyển tiếp (From → To) | Action | Test Case | Result | Bug | Status |` +
tổng kết độ phủ (states, transitions, số TC, cross-reference FR liên quan).

---

## Cấu trúc thư mục output (để nộp)
```
<output>/                          (mặc định HW/week05/<Tên>/)
├── Test Design/
│   └── ST-[MODULE].md
├── Test case/
│   └── TC-[MODULE]-E2E-01.md …
├── Bug Report/                    (chỉ khi có ca Fail)
│   └── BUG-[MODULE]-01.md …
└── test-summary/
    └── traceability-matrix.md
```

## Nguyên tắc chất lượng
- Bám spec (README), không bịa luật; bước thiết kế là black-box.
- Sơ đồ **luôn mermaid**; trạng thái **ghi tên đầy đủ**, không S0/S1.
- Bảng C1 giữ đúng |States|×|Actions| dòng; Invalid End = "—".
- Bug phải có Steps/Expected/Actual/Evidence; liên kết ngược về test case.
- Mỗi bước ⏸ **dừng chờ user confirm** trước khi sang bước sau.
