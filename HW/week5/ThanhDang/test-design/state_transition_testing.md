# State Transition Testing — FR-02: Login & Account Lockout

> **SUT**: EShop — chuc nang Dang nhap & Khoa tai khoan
> **Nguon dac ta**: `group05_eshop/README.md` — FR-02
> **Ky thuat**: State Transition Testing (State diagram → State-transition table → N-switch coverage → E2E)

---

## 1. Xac dinh mo hinh trang thai (State Model)

### 1.1 States (Trang thai)

| ID | State | Y nghia | Loai |
|----|-------|---------|------|
| S0 | `Idle` | Chua nhap gi | **Initial** |
| S1 | `Entering Credentials` | Dang nhap email & password |  |
| S2 | `Failed_1` | Da submit sai **1 lan** |  |
| S3 | `Failed_2` | Da submit sai **2 lan** |  |
| S4 | `Locked` | Bi khoa **30 giay** |  |
| S5 | `Authenticated` | Dang nhap thanh cong → cap token | **Final** |

### 1.2 Events / Triggers (Su kien)

| ID | Event | Mo ta |
|----|-------|-------|
| E1 | `input` | Nhap email & password (Idle→EC) hoac thay doi thong tin (EC self-loop) |
| E2 | `submit_valid` | Submit voi thong tin **dung** |
| E3 | `submit_invalid` | Submit voi thong tin **sai** |
| E4 | `retry` | Quay lai man nhap de thu lai (tu Failed_1/Failed_2) |
| E5 | `login_attempt` | Thu dang nhap **khi dang bi khoa** → bi tu choi |
| E6 | `timeout` | Het **30 giay** khoa → tro ve Idle |

### 1.3 State Diagram (theo so do)

```
   Start
     │ 
     ▼
  ┌──────┐  input (nhap email & password)   ┌───────────────────────┐  input (thay doi thong tin)
  │ Idle │ ───────────────────────────────► │ Entering Credentials  │◄──┐ (self-loop)
  └──────┘                                   └───────────────────────┘ ──┘
     ▲                                          │        │
     │                          submit_valid    │        │ submit_invalid
     │                                (dung)     ▼        ▼
     │                            ┌──────────────────┐  ┌──────────┐  ◄── retry ── ┐
     │                            │  Authenticated   │  │ Failed_1 │               │
     │                            │  (FINAL) → End   │  └──────────┘               │
     │                            └──────────────────┘        │ submit_invalid     │
     │                                                         ▼                    │
     │                                                   ┌──────────┐  ◄── retry ──┘
     │                                                   │ Failed_2 │
     │                                                   └──────────┘
     │                                                         │ submit_invalid
     │   timeout (30 giay) → tro ve Idle                       ▼
     └──────────────────────────────────────────────── ┌──────────┐ ◄─ login_attempt
                                                         │  Locked  │ ─┐ (tu choi, van Locked)
                                                         └──────────┘ ◄┘
```

Cac chuyen doi hop le (valid transitions):

| # | From | Event | To | Ghi chu |
|---|------|-------|----|---------|
| T1 | Idle | input | Entering Credentials | bat dau nhap |
| T2 | Entering Credentials | input | Entering Credentials | thay doi thong tin (self) |
| T3 | Entering Credentials | submit_valid | Authenticated | login OK → cap token (final) |
| T4 | Entering Credentials | submit_invalid | Failed_1 | sai lan 1 |
| T5 | Failed_1 | submit_invalid | Failed_2 | sai lan 2 |
| T6 | Failed_2 | submit_invalid | Locked | sai lan 3 → khoa 30s |
| T7 | Failed_1 | retry | Entering Credentials | thu lai |
| T8 | Failed_2 | retry | Entering Credentials | thu lai |
| T9 | Locked | login_attempt | Locked | dang khoa → tu choi |
| T10 | Locked | timeout | Idle | het 30s → ve Idle |

---

## 2. State-Transition Table

Bang **State × Event** (6 states × 6 events). O hop le → state dich; `—` = khong hop le / khong xay ra.

| State \ Event | input | submit_valid | submit_invalid | retry | login_attempt | timeout |
|---------------|:-----:|:------------:|:--------------:|:-----:|:-------------:|:-------:|
| **S0 Idle** | **EC** (T1) | — | — | — | — | — |
| **S1 Entering Credentials** | **EC** (T2) | **Authenticated** (T3) | **Failed_1** (T4) | — | — | — |
| **S2 Failed_1** | — | — | **Failed_2** (T5) | **EC** (T7) | — | — |
| **S3 Failed_2** | — | — | **Locked** (T6) | **EC** (T8) | — | — |
| **S4 Locked** | — | — | — | — | **Locked** (T9) | **Idle** (T10) |
| **S5 Authenticated** | — | — | — | — | — | — *(final)* |

- 10 o **hop le** (T1–T10).
- Hang **Authenticated** toan bo `—` → dac ta **final state**.
- O **T9** (Locked + login_attempt) quan trong: dang khoa thi moi thu login deu bi tu choi.

---

## 3. N-Switch Coverage

### 3.1 0-Switch (single transition)

| Seq | Start | Event | End | Transition |
|-----|-------|-------|-----|------------|
| V0-1 | Idle | input | EC | T1 |
| V0-2 | EC | input | EC | T2 |
| V0-3 | EC | submit_valid | Authenticated | T3 |
| V0-4 | EC | submit_invalid | Failed_1 | T4 |
| V0-5 | Failed_1 | submit_invalid | Failed_2 | T5 |
| V0-6 | Failed_2 | submit_invalid | Locked | T6 |
| V0-7 | Failed_1 | retry | EC | T7 |
| V0-8 | Failed_2 | retry | EC | T8 |
| V0-9 | Locked | login_attempt | Locked | T9 |
| V0-10 | Locked | timeout | Idle | T10 |

### 3.2 1-Switch (chuoi 2 chuyen doi lien tiep)

| Seq | Duong di | Chuoi event |
|-----|----------|-------------|
| V1-1 | Idle → EC → Authenticated | input, submit_valid |
| V1-2 | EC → Failed_1 → Failed_2 | submit_invalid, submit_invalid |
| V1-3 | Failed_2 → Locked → Idle | submit_invalid, timeout |
| V1-4 | Failed_1 → EC → Authenticated | retry, submit_valid |
| V1-5 | EC → Failed_1 → EC | submit_invalid, retry |
| V1-6 | Locked → Locked → Idle | login_attempt, timeout |

### 3.3 E2E — vong doi day du (lockout & recovery)

Chuoi dai nhat: nhap → sai 3 lan → khoa → thu login (bi tu choi) → cho 30s → ve Idle → nhap lai → dung → Authenticated.

| Buoc | State truoc | Event | State sau (ky vong) |
|------|-------------|-------|---------------------|
| 1 | Idle | input | Entering Credentials |
| 2 | Entering Credentials | submit_invalid | Failed_1 (sai 1) |
| 3 | Failed_1 | submit_invalid | Failed_2 (sai 2) |
| 4 | Failed_2 | submit_invalid | Locked (sai 3, khoa 30s) |
| 5 | Locked | login_attempt (pass dung) | Locked (tu choi 403) |
| 6 | Locked | timeout (>30s) | Idle |
| 7 | Idle | input | Entering Credentials |
| 8 | Entering Credentials | submit_valid | Authenticated (cap token) |

---

## 4. Coverage Summary

| Metric | Value |
|--------|-------|
| So states | 6 (Idle, EC, Failed_1, Failed_2, Locked, Authenticated=final) |
| So events | 6 (input, submit_valid, submit_invalid, retry, login_attempt, timeout) |
| Valid transitions | 10 (T1–T10) |
| 0-switch test | 10 (V0-1 … V0-10) |
| 1-switch test | 6 (V1-1 … V1-6) |
| E2E | 1 (8 buoc: lockout & recovery) |
| **Coverage muc tieu** | 100% state, 100% valid transition (0-switch), phu cac 1-switch chinh, kiem chung final-state |

**Traceability:** State/Transition → N-switch sequence → Test case (`ST_TC_*.md`).

> **Luu y:** Cac event `input`, `retry`, `timeout→Idle` mang tinh **UI/client-side** (chuyen man/reset form); `submit_valid`, `submit_invalid`, `login_attempt` anh xa toi API `POST /api/login`.
> Bug `failed_attempts += 2` lam **T4 di sai** (EC submit_invalid nhay thang trang thai "sai 2 lan" thay vi Failed_1) va **T6 kich som** (Locked chi sau 2 lan submit sai) → phat hien qua V0-4, V0-6, V1-2. Bug lock 180s lam **T10** sai (khong ve Idle sau 30s).
