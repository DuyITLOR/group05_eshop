# Decision Table Reduction Notes — FR-02: Login & Account Lockout

## 1. Full Table Size

- 4 conditions × 2 values = 2^4 = **16 rules**

## 2. Reduction Techniques Applied

### Merge 1: R01–R08 → R1 (8 rules merged)

- **Condition**: C1 = F (email format sai)
- **Rationale**: Khi email format khong hop le, he thong reject ngay tai client-side validation. Cac conditions C2, C3, C4 khong duoc evaluate.
- **Result**: `C1=F, C2=-, C3=-, C4=-` → A7
- **Reduction**: 8 rules → 1 rule

### Merge 2: R09–R12 → R2 (4 rules merged)

- **Condition**: C1=T, C2=F (email hop le nhung khong ton tai)
- **Rationale**: Khi email khong ton tai trong DB, khong co account de check locked status hay password. C3, C4 khong co y nghia.
- **Result**: `C1=T, C2=F, C3=-, C4=-` → A2
- **Reduction**: 4 rules → 1 rule
- **Note**: A3 (tang counter) la questionable — khong co account de tang counter.

### Merge 3: R13–R14 → R3 (2 rules merged)

- **Condition**: C1=T, C2=T, C3=T (account dang bi khoa)
- **Rationale**: Khi tai khoan bi khoa, he thong block ngay. Password dung hay sai (C4) khong anh huong ket qua.
- **Result**: `C1=T, C2=T, C3=T, C4=-` → A5
- **Reduction**: 2 rules → 1 rule

### No Merge: R15 → R4a, R4b (split by threshold)

- **Condition**: C1=T, C2=T, C3=F, C4=F (password sai, account chua khoa)
- **Rationale**: Cung action co ban (A2, A3) nhung A4 (khoa account) chi trigger khi failed_attempts dat nguong. Can tach:
  - **R4a**: failed_attempts < 2 truoc do → A2, A3 (chua khoa)
  - **R4b**: failed_attempts = 2 truoc do → A2, A3, A4 (lan thu 3 → khoa)

### No Merge: R16 → R5

- **Condition**: C1=T, C2=T, C3=F, C4=T (happy path)
- **Unique**: Day la truong hop duy nhat login thanh cong → khong merge duoc.

## 3. Reduction Summary

| Metric | Value |
|--------|-------|
| Rules truoc reduction | 16 |
| Rules sau reduction | 5 (R1, R2, R3, R4a/R4b gop, R5) |
| Rules sau tach threshold | **6** (R1, R2, R3, R4a, R4b, R5) |
| Reduction ratio | 16 → 6 = **62.5% reduction** |
| Impossible combinations removed | 0 (tat ca combinations deu co the xay ra) |
| Don't-care merges | 3 (Merge 1, 2, 3) |

## 4. Pairwise Decision

- **Needed**: No
- **Reason**: Conditions co dependency chain (waterfall logic), khong co independent interactions. 6 rules da dat 100% condition coverage va 100% action coverage.
