# State Transition Testing — FR-10: Order State Machine

> **SUT**: EShop — quan ly trang thai don hang (Order State Machine)
> **Nguon dac ta**: `group05_eshop/README.md` — FR-10, FR-18, FR-20
> **Ky thuat**: State Transition Testing (State diagram → State-transition table → N-switch coverage → E2E)

---

## 1. Xac dinh mo hinh trang thai (State Model)

### 1.1 States (Trang thai)

Don hang co **5 trang thai**. `delivered` va `canceled` la **final states** (khong co chuyen doi di ra).

| ID | State | Y nghia | Loai |
|----|-------|---------|------|
| S1 | `pending` | Don moi tao, cho Admin xac nhan | Initial |
| S2 | `confirmed` | Da xac nhan, cho giao hang | Intermediate |
| S3 | `shipping` | Dang giao hang | Intermediate |
| S4 | `delivered` | Da giao thanh cong | **Final** |
| S5 | `canceled` | Da huy | **Final** |

### 1.2 Events / Triggers (Su kien kich hoat)

| ID | Event | Actor | Mo ta |
|----|-------|-------|-------|
| E1 | `confirm` | Admin | Admin xac nhan don hang |
| E2 | `ship` | Admin | Admin giao hang |
| E3 | `deliver` | Admin | Admin hoan tat don hang |
| E4 | `cancel` | User / Admin | Huy don hang |

> **Rang buoc actor (FR-10, FR-20):** `cancel` chi hop le khi don o `pending` hoac `confirmed`. Khi don da `shipping`, **User khong duoc tu huy** — chi Admin thao tac (giao/hoan tat). Cac event E1/E2/E3 la thao tac cua Admin.

### 1.3 State Diagram

```
            E1: confirm            E2: ship             E3: deliver
  ┌─────────┐ ─────────► ┌───────────┐ ─────────► ┌──────────┐ ─────────► ┌───────────┐
  │ pending │            │ confirmed │            │ shipping │            │ delivered │ (final)
  │  (S1)   │            │   (S2)    │            │  (S3)    │            │   (S4)    │
  └─────────┘            └───────────┘            └──────────┘            └───────────┘
       │                       │
       │ E4: cancel            │ E4: cancel
       ▼                       ▼
  ┌──────────┐            ┌──────────┐
  │ canceled │            │ canceled │  (final)
  │  (S5)    │            │  (S5)    │
  └──────────┘            └──────────┘
```

Cac chuyen doi hop le (valid transitions) — **5 chuyen doi**:

| # | From | Event | To |
|---|------|-------|----|
| T1 | pending | confirm | confirmed |
| T2 | pending | cancel | canceled |
| T3 | confirmed | ship | shipping |
| T4 | confirmed | cancel | canceled |
| T5 | shipping | deliver | delivered |

---

## 2. State-Transition Table (bang chuyen trang thai)

Bang day du **State × Event** (5 states × 4 events = 20 o). O hop le → trang thai dich; o khong hop le → `— (invalid)` (he thong phai tra loi va **giu nguyen** trang thai hien tai).

| State \ Event | E1: confirm | E2: ship | E3: deliver | E4: cancel |
|---------------|:-----------:|:--------:|:-----------:|:----------:|
| **S1 pending**   | **confirmed** (T1) | — | — | **canceled** (T2) |
| **S2 confirmed** | — | **shipping** (T3) | — | **canceled** (T4) |
| **S3 shipping**  | — | — | **delivered** (T5) | — *(User cam; Admin cung khong theo diagram)* |
| **S4 delivered** | — | — | — | — *(final)* |
| **S5 canceled**  | — | — | — | — *(final)* |

**Doc bang:**
- 5 o **hop le** → 5 valid transitions (T1–T5).
- 15 o **khong hop le** → 15 negative transitions (moi o phai tra loi "chuyen doi khong hop le" + giu nguyen state).
- Hang S4 va S5 toan bo la invalid → dac ta **final state** (khong duoc chuyen di dau).

---

## 3. N-Switch Coverage (do phu chuyen doi)

State transition testing dung khai niem **N-switch**: mot test bao phu mot chuoi gom **(N+1) chuyen doi** lien tiep.

- **0-switch** (single transition / branch coverage): moi test = 1 chuyen doi.
- **1-switch**: moi test = chuoi 2 chuyen doi lien tiep (bat cap tuong tac giua 2 buoc).

### 3.1 0-Switch Coverage — chuyen doi hop le (Valid)

Bao phu 5 valid transitions, moi cai 1 lan:

| Seq | Start state | Event | End state | Transition |
|-----|-------------|-------|-----------|------------|
| V0-1 | pending | confirm | confirmed | T1 |
| V0-2 | pending | cancel | canceled | T2 |
| V0-3 | confirmed | ship | shipping | T3 |
| V0-4 | confirmed | cancel | canceled | T4 |
| V0-5 | shipping | deliver | delivered | T5 |

### 3.2 0-Switch Coverage — chuyen doi khong hop le (Invalid / Negative)

Bao phu 15 o invalid. Test kich event khong hop le tu tung state → ky vong **loi + giu nguyen state**. Nhom lai:

| Seq | State | Event(s) kich sai | Ky vong |
|-----|-------|-------------------|---------|
| I0-1 | pending | ship, deliver | Loi, van `pending` |
| I0-2 | confirmed | confirm, deliver | Loi, van `confirmed` |
| I0-3 | shipping | confirm, ship, cancel | Loi, van `shipping` (User cancel bi cam) |
| I0-4 | delivered | confirm, ship, deliver, cancel | Loi, van `delivered` (final) |
| I0-5 | canceled | confirm, ship, deliver, cancel | Loi, van `canceled` (final) |

### 3.3 1-Switch Coverage — chuoi 2 chuyen doi hop le

Cac duong di hop le gom **2 chuyen doi lien tiep** (chi tinh path co the di tiep — final state khong di duoc nua):

| Seq | Duong di | Chuoi event |
|-----|----------|-------------|
| V1-1 | pending → confirmed → shipping | confirm, ship |
| V1-2 | pending → confirmed → canceled | confirm, cancel |
| V1-3 | confirmed → shipping → delivered | ship, deliver |

> Cac chuoi bat dau bang T2 (pending→canceled) hoac T4 (confirmed→canceled) **khong the ke tiep** vi `canceled` la final → khong sinh 1-switch hop le.

### 3.4 1-Switch — kiem chung final state (negative sau khi vao final)

Bao phu tinh chat "final khong the roi": vao final roi thu chuyen tiep.

| Seq | Duong di | Ky vong |
|-----|----------|---------|
| N1-1 | pending → canceled → (thu confirm) | Bi tu choi, van `canceled` |
| N1-2 | shipping → delivered → (thu cancel) | Bi tu choi, van `delivered` |

---

## 4. E2E Test — vong doi day du (Happy Path)

Kich ban end-to-end di het vong doi hop le dai nhat: **pending → confirmed → shipping → delivered** (3 chuyen doi lien tiep). Ket hop 1-switch V1-1 + T5.

| Buoc | Actor | Hanh dong | State truoc | Event | State sau (ky vong) |
|------|-------|-----------|-------------|-------|---------------------|
| 1 | User | Dat hang (checkout thanh cong) | — | create | `pending` |
| 2 | Admin | Xac nhan don | pending | confirm | `confirmed` |
| 3 | Admin | Giao hang | confirmed | ship | `shipping` |
| 4 | Admin | Hoan tat | shipping | deliver | `delivered` |
| 5 | Admin | Thu chuyen tiep (bat ky) | delivered | any | **Tu choi** — van `delivered` |

**E2E phu (cancel path):** User → checkout (`pending`) → User huy (`canceled`) → thu confirm → bi tu choi, van `canceled`.

---

## 5. Coverage Summary

| Metric | Value |
|--------|-------|
| So states | 5 (2 final) |
| So events | 4 |
| Valid transitions | 5 |
| Invalid transitions (o bang) | 15 |
| 0-switch valid test | 5 (V0-1 … V0-5) |
| 0-switch invalid (nhom) | 5 nhom (bao 15 o) |
| 1-switch valid path | 3 (V1-1 … V1-3) |
| Final-state negative | 2 (N1-1, N1-2) |
| E2E happy path | 1 (4 buoc) |
| **Coverage muc tieu** | 100% state, 100% valid transition (0-switch), 100% 1-switch hop le, 100% final-state constraint |

**Traceability:** State/Transition → N-switch sequence → Test case (moi seq → 1 file `TC_*.md` trong buoc thiet ke chi tiet).
