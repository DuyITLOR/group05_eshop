# 🎬 Skill: Use Case Testing

## 🎯 Objective

Cho mot dac ta phan mem (SRS/README), thiet ke test theo ky thuat **Use Case Testing** (Scenario-based):

1. Doc dac ta, xac dinh cac chuc nang mo ta duoc bang **use case** (co luong tuong tac actor–he thong).
2. Goi y cac dac ta / feature co the ap dung ky thuat.
3. Voi feature da chon: phat sinh **test design analytic** (use case spec + main/alternate/exception flow + scenario matrix).
4. Phat sinh **test case chi tiet** — moi TC la **1 file `.md`** rieng (map 1:1 scenario).
5. **Thuc thi** test case tren SUT → **bug report** cho moi sai lech so voi spec.

---

## 📥 Input

* Duong dan tai lieu dac ta (vd `group05_eshop/README.md`)
* (Tuy chon) Feature / FR muon test — neu khong co, agent tu goi y

---

## 🧭 Step 0 — Doc dac ta & Goi y feature (Spec Scan)

Agent doc dac ta va **loc ra cac feature co use case ro rang** — dau hieu:

* Co **actor** (User, Admin, Guest) tuong tac voi he thong de dat mot **muc tieu**.
* Co **luong buoc** tuan tu (nhap → xu ly → phan hoi).
* Co nhieu **nhanh** re (thanh cong / that bai / dieu kien bien).
* Quy trinh nghiep vu: dang ky, dang nhap, quen mat khau, thanh toan, ap coupon, CRUD, import CSV.

**Output — bang goi y (bat buoc):**

| FR | Use Case | Vi sao ap dung duoc Use Case Testing | Do phu hop |
|----|----------|--------------------------------------|:----------:|
| FR-02 | Dang nhap & Khoa tai khoan | MSS + nhieu exception (sai pass, khoa, het han) | ⭐⭐⭐ |
| FR-08/09 | Thanh toan + Coupon | Main flow + alternate (chua login, gio trong, coupon sai) | ⭐⭐⭐ |
| FR-03 | Quen mat khau (2 buoc) | Flow 2 buoc, nhieu nhanh OTP | ⭐⭐ |
| FR-16 | Import CSV | Main + rollback khi loi dong | ⭐⭐ |

> Agent **dung lai**, de nghi nguoi dung chon use case truoc khi sang Step 1.

---

## 🧩 Step 1 — Dac ta Use Case (Use Case Specification)

Lap bang: UC ID, Ten, **Actor chinh**, Muc tieu, **Precondition**, Trigger, **Postcondition** (thanh cong + that bai).

---

## 🛤️ Step 2 — Main / Alternate / Exception Flows

### 2.1 Main Success Scenario (MSS)

Cac buoc happy path (actor ↔ system), danh so 1..n.

### 2.2 Extensions (Alternate & Exception)

Bang cac re nhanh: `<diem re>` | `<dieu kien>` | `<xu ly he thong>` | `<ket qua>`.
Moi nhanh dat ma (E1, E2, …). Bao gom ca error flow va bien nghiep vu.

---

## 🧮 Step 3 — Scenario Coverage Matrix

* Moi **scenario** = mot duong di hoan chinh (MSS + to hop cac extension).
* Muc tieu: **phu 100% flow** (moi extension xuat hien it nhat 1 scenario).
* Bang: Scenario ID | Duong di (flow) | Ky vong.

---

## 📄 Step 4 — Sinh file Test Design + Test Case chi tiet

### 4.1 File Test Design (analytic)

Ghi `test-design/usecase_testing.md` gom: Use Case Spec, MSS, Extensions, Scenario Matrix, dan xuat TC, Coverage Summary + **Traceability** (Flow → Scenario → TC).

### 4.2 Test Case chi tiet — moi TC 1 file

Moi scenario → 1 file `test-cases/use-case/UC_TC_<ID>.md`:

```md
# UC_TC_<ID> — <ten scenario>

## Preconditions
- ...

## Steps
1. ...

## Test Data
- ...

## Expected Result
- ...

## Mapping
- Scenario: SC-##  | Flows: MSS / E#
- Requirement: FR-##
```

---

## 🐞 Step 5 — Thuc thi & Bug Report

* Chay SUT, thuc thi tung `UC_TC_*.md`, ghi PASS/FAIL.
* Moi FAIL → 1 file `bug-reports/BUG_<ID>_<slug>.md`:

```md
# BUG-<ID>: <tieu de>

## Summary
## Severity  (Critical / Major / Minor)
## Requirement  (FR-##)
## Steps to Reproduce
## Actual Result
## Expected Result
## Root Cause  (file:line neu tim duoc)
## Test Case Reference  (UC_TC_##)
## Evidence
```

---

## 📁 Folder Structure

```
week5/ThanhDang/
├── test-design/usecase_testing.md
├── test-cases/use-case/UC_TC_01.md ...
└── bug-reports/BUG_##_*.md
```

---

## ⚠️ Rules & Constraints

* PHAI phu **ca happy path va cac exception flow** (khong chi test main flow).
* Moi extension trong spec phai xuat hien trong it nhat 1 scenario.
* Nhin theo **goc do nguoi dung end-to-end**, khong phai to hop dieu kien (do la Decision Table).
* Traceability ro: Flow → Scenario → TC → Bug.

## ✅ Output Expectations

* Use case spec + flow day du (main + alternate + exception).
* Scenario matrix dat 100% flow coverage.
* Moi TC 1 file, map ve scenario + FR.
* Bug report gan test case va requirement.
