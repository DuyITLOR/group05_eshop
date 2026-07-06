# 🔄 Skill: State Transition Testing

## 🎯 Objective

Cho mot dac ta phan mem (SRS/README), thiet ke test theo ky thuat **State Transition Testing**:

1. Doc dac ta, xac dinh cac chuc nang co **hanh vi phu thuoc trang thai** (stateful).
2. Goi y cac dac ta / feature co the ap dung ky thuat.
3. Voi feature da chon: phat sinh **test design analytic** (state model + state diagram + state-transition table + N-switch coverage + E2E).
4. Phat sinh **test case chi tiet** — moi TC la **1 file `.md`** rieng.
5. **Thuc thi** test case tren SUT → **bug report** cho moi sai lech so voi spec.

---

## 📥 Input

* Duong dan tai lieu dac ta (vd `group05_eshop/README.md`)
* (Tuy chon) Feature / FR muon test — neu khong co, agent tu goi y

---

## 🧭 Step 0 — Doc dac ta & Goi y feature (Spec Scan)

Agent doc toan bo dac ta va **loc ra cac feature stateful** — dau hieu nhan biet:

* Co danh sach **trang thai** ro rang (status, state, lifecycle).
* Co **chuyen doi** giua cac trang thai theo su kien/hanh dong.
* Co **trang thai ket thuc** (final) hoac chuyen doi **bi cam**.
* Vong doi doi tuong: don hang, phien dang nhap/khoa, quy trinh duyet, gio hang, thanh toan nhieu buoc.

**Output — bang goi y (bat buoc):**

| FR | Feature | Vi sao ap dung duoc State Transition | Do phu hop |
|----|---------|--------------------------------------|:----------:|
| FR-02 | Login & Account Lockout | Idle→Entering Credentials→Failed_1→Failed_2→Locked, timeout 30s→Idle, Authenticated=final | ⭐⭐⭐ |
| FR-10 | Order State Machine | 5 trang thai + 5 chuyen doi + 2 final state | ⭐⭐⭐ |
| FR-03 | Quen mat khau (2 buoc) | Step1 → Step2, OTP valid/expired/used | ⭐⭐ |

> Agent **dung lai**, de nghi nguoi dung chon feature truoc khi sang Step 1.

---

## 🧩 Step 1 — Xac dinh State Model

* **States**: liet ke moi trang thai (id, ten, y nghia, danh dau Initial / Intermediate / **Final**).
* **Events / Triggers**: cac su kien gay chuyen doi (kem **actor** neu co rang buoc quyen).
* Ghi ro rang buoc: final state khong duoc chuyen di; chuyen doi bi cam theo actor.

---

## 🗺️ Step 2 — State Diagram + State-Transition Table

### 2.1 State Diagram

Ve so do (ASCII) mo ta State → Event → State. Danh so cac **valid transition** (T1, T2, …).

### 2.2 State-Transition Table

Bang day du **State × Event**:

* O hop le → trang thai dich (ghi ma transition).
* O khong hop le → `—` + ky vong **loi + giu nguyen state**.
* Dem so o valid va so o invalid (negative).

---

## 🔢 Step 3 — N-Switch Coverage

* **0-switch** (single transition): moi test = 1 chuyen doi.
  * Bao **tat ca** valid transition (positive).
  * Bao cac o invalid (negative — kich event sai tu moi state).
* **1-switch** (2 chuyen doi lien tiep): bao cac chuoi hop le co the di tiep.
* Kiem chung **final-state**: vao final roi thu chuyen tiep → phai bi tu choi.
* (Tuy do sau) N-switch cao hon neu vong doi phuc tap.

**Output**: danh sach sequence, moi sequence co start state → chuoi event → end state.

---

## 🧵 Step 4 — E2E Test

* Chon duong di hop le **dai nhat** qua state machine (happy path).
* Mo ta tung buoc: actor, hanh dong, state truoc → event → state sau.
* Them nhanh phu (vd cancel path).

---

## 📄 Step 5 — Sinh file Test Design + Test Case chi tiet

### 5.1 File Test Design (analytic)

Ghi `test-design/state_transition_testing.md` gom: State Model, Diagram, Transition Table, N-switch coverage, E2E, Coverage Summary + **Traceability** (State/Transition → Sequence → TC).

### 5.2 Test Case chi tiet — moi TC 1 file

Moi sequence (0-switch, 1-switch, E2E) → 1 file `test-cases/state-transition/ST_TC_<ID>.md`:

```md
# ST_TC_<ID> — <mo ta ngan>

## Preconditions
- (state ban dau + moi truong)

## Steps
1. ...

## Test Data
- ...

## Expected Result
- (state sau + thong bao)

## Mapping
- Transition: T#  | Sequence: V0-# / V1-# / E2E
- Coverage: <state/transition duoc phu>
```

---

## 🐞 Step 6 — Thuc thi & Bug Report

* Chay SUT, thuc thi tung `ST_TC_*.md`, ghi PASS/FAIL.
* Moi FAIL (hanh vi lech spec) → 1 file `bug-reports/BUG_<ID>_<slug>.md`:

```md
# BUG-<ID>: <tieu de>

## Summary
## Severity  (Critical / Major / Minor)
## Requirement  (FR-##)
## Steps to Reproduce
## Actual Result
## Expected Result
## Root Cause  (file:line neu tim duoc)
## Test Case Reference  (ST_TC_##)
## Evidence
```

---

## 📁 Folder Structure

```
week5/ThanhDang/
├── test-design/state_transition_testing.md
├── test-cases/state-transition/ST_TC_01.md ...
└── bug-reports/BUG_##_*.md
```

---

## ⚠️ Rules & Constraints

* KHONG bo qua o **invalid** trong transition table — negative test rat quan trong voi state machine.
* PHAI kiem tra rang buoc **final-state** va **actor** (vd User khong duoc huy khi shipping).
* Uu tien phu **100% valid transition (0-switch)** truoc, roi 1-switch.
* Traceability ro: State/Transition → Sequence → TC → Bug.

## ✅ Output Expectations

* Transition table day du (valid + invalid).
* Coverage 100% state + 100% valid transition, ghi ro % 1-switch.
* Moi TC 1 file, map ve transition/sequence.
* Bug report gan test case va requirement.
