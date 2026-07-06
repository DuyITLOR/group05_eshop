# Decision Table Testing — FR-02: Login & Account Lockout

## 1. Conditions & Actions

### Conditions

| ID | Condition | Description |
|----|-----------|-------------|
| C1 | Email co dinh dang hop le | Dung format `user@domain.com` (HTML5 type="email") |
| C2 | Email ton tai trong he thong | Email da dang ky trong database |
| C3 | Tai khoan dang bi khoa | `failed_attempts >= 3` va chua het 30 giay |
| C4 | Mat khau dung | Password khop voi account |

### Actions

| ID | Action | Description |
|----|--------|-------------|
| A1 | Login thanh cong | Tra ve JWT Token + user info |
| A2 | Loi: sai thong tin dang nhap | Thong bao loi chung (khong tiet lo chi tiet) |
| A3 | Tang failed_attempts += 1 | Bo dem tang dung 1 don vi |
| A4 | Khoa tai khoan 30s | Tam khoa khi failed_attempts >= 3 |
| A5 | Loi: tai khoan bi khoa | Thong bao account locked |
| A6 | Reset failed_attempts = 0 | Reset bo dem sau login thanh cong |
| A7 | Loi: email format khong hop le | Client-side validation reject |

---

## 2. Full Decision Table

16 rules (2^4 combinations):

| Rule | C1 | C2 | C3 | C4 | Actions |
|------|----|----|----|----|---------|
| R01 | F | F | F | F | A7 |
| R02 | F | F | F | T | A7 |
| R03 | F | F | T | F | A7 |
| R04 | F | F | T | T | A7 |
| R05 | F | T | F | F | A7 |
| R06 | F | T | F | T | A7 |
| R07 | F | T | T | F | A7 |
| R08 | F | T | T | T | A7 |
| R09 | T | F | F | F | A2 |
| R10 | T | F | F | T | A2 |
| R11 | T | F | T | F | A2 |
| R12 | T | F | T | T | A2 |
| R13 | T | T | T | F | A5 |
| R14 | T | T | T | T | A5 |
| R15 | T | T | F | F | A2, A3, A4* |
| R16 | T | T | F | T | A1, A6 |

> `*` A4 chi trigger khi failed_attempts dat nguong >= 3

---

## 3. Reduced Decision Table

### Reduced Table

| Rule | C1: Email format | C2: Email exists | C3: Locked | C4: Password | Actions | Merged from |
|------|:----------------:|:----------------:|:----------:|:------------:|---------|-------------|
| **R1** | F | - | - | - | A7 | R01–R08 |
| **R2** | T | F | - | - | A2 | R09–R12 |
| **R3** | T | T | T | - | A5 | R13–R14 |
| **R4a** | T | T | F | F | A2, A3 | R15 (attempts < 2) |
| **R4b** | T | T | F | F | A2, A3, A4 | R15 (attempts = 2) |
| **R5** | T | T | F | T | A1, A6 | R16 |

### Reduction Explanation

| Merge | Rules | Technique | Reason |
|-------|-------|-----------|--------|
| R01–R08 → R1 | 8 rules | Don't care | C1=F → reject ngay, C2/C3/C4 irrelevant |
| R09–R12 → R2 | 4 rules | Don't care | C2=F → khong co account, C3/C4 irrelevant |
| R13–R14 → R3 | 2 rules | Don't care | C3=T → block, C4 irrelevant |
| R15 → R4a, R4b | 1 rule split | Threshold | Tach theo nguong failed_attempts |

**Result: 16 → 6 rules (62.5% reduction)**

### Action Matrix

| Rule | A1 | A2 | A3 | A4 | A5 | A6 | A7 |
|------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| R1 | | | | | | | X |
| R2 | | X | | | | | |
| R3 | | | | | X | | |
| R4a | | X | X | | | | |
| R4b | | X | X | X | | | |
| R5 | X | | | | | X | |

---

## 4. Pairwise Analysis

- **Needed**: No
- **Reason**: Conditions co dependency chain tuyen tinh (C1 → C2 → C3 → C4). Khong co independent parameters tuong tac phuc tap. Reduced table 6 rules da dat 100% condition coverage va 100% action coverage.

### Coverage Verification

| Condition | T tested in | F tested in |
|-----------|-------------|-------------|
| C1 | R2, R3, R4a, R4b, R5 | R1 |
| C2 | R3, R4a, R4b, R5 | R2 |
| C3 | R3 | R4a, R4b, R5 |
| C4 | R5 | R4a, R4b |

| Action | Triggered in |
|--------|-------------|
| A1 | R5 |
| A2 | R2, R4a, R4b |
| A3 | R4a, R4b |
| A4 | R4b |
| A5 | R3 |
| A6 | R5 |
| A7 | R1 |

**100% condition coverage. 100% action coverage.**

---

## 5. Coverage Summary

| Metric | Value |
|--------|-------|
| Rules before reduction | 16 |
| Rules after reduction | 6 |
| Pairwise cases | 0 (not needed) |
| Test cases generated | 6 (1:1 mapping to reduced rules) |
| Condition coverage | 100% |
| Action coverage | 100% |
