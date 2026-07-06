# Conditions & Actions Analysis — FR-02: Login & Account Lockout

## 1. Spec Reference

**FR-02 (README.md - EShop SRS):**
- Nguoi dung nhap Email va Mat khau.
- Sau moi lan dang nhap sai, he thong tang bo dem len **dung 1 don vi**.
- Neu dang nhap sai tu **3 lan tro len** lien tiep, tai khoan bi tam khoa **30 giay**.
- He thong tra ve thong bao loi phu hop; khong de lo chi tiet nguyen nhan.
- Dang nhap thanh cong tra ve JWT Token.
- Truong email phai dung `type="email"` (co validate HTML5 format).

**FR-22 (Form Requirements):**
- Truong Email phai dung `type="email"`.
- Truong Mat khau phai dung `type="password"`.

---

## 2. Conditions

| ID | Condition | Domain | Description |
|----|-----------|--------|-------------|
| C1 | Email co dinh dang hop le | T / F | Dung format `user@domain.com` (HTML5 type="email" validate) |
| C2 | Email ton tai trong he thong | T / F | Email da dang ky trong DB |
| C3 | Tai khoan dang bi khoa | T / F | `failed_attempts >= 3` va chua het 30s |
| C4 | Mat khau dung | T / F | Password khop voi account trong DB |

### Dependency Chain

```
C1 (email format) → C2 (email exists) → C3 (account locked) → C4 (password correct)
```

- C1 = F → C2, C3, C4 khong duoc evaluate (reject tai client validation)
- C2 = F → C3, C4 khong co y nghia (khong co account de check)
- C3 = T → C4 khong co y nghia (block truoc khi check password)

---

## 3. Actions

| ID | Action | Description |
|----|--------|-------------|
| A1 | Login thanh cong | Tra ve JWT Token + thong tin user, redirect vao he thong |
| A2 | Loi: sai thong tin dang nhap | Thong bao loi chung, KHONG tiet lo email hay password sai |
| A3 | Tang failed_attempts += 1 | Bo dem tang dung 1 don vi (khong phai 2) |
| A4 | Khoa tai khoan 30s | Khi failed_attempts >= 3, tam khoa |
| A5 | Loi: tai khoan bi khoa | Thong bao tai khoan dang bi khoa, cho 30s |
| A6 | Reset failed_attempts = 0 | Sau login thanh cong, reset bo dem ve 0 |
| A7 | Loi: email format khong hop le | Client-side validation reject (HTML5) |

### Notes

- A3 questionable khi C2 = F: Neu email khong ton tai, khong co account nao de tang counter. Can verify thuc te.
- A4 chi trigger khi failed_attempts dat nguong >= 3 SAU lan sai hien tai.
- Spec yeu cau: thong bao loi KHONG duoc tiet lo nguyen nhan cu the (security requirement).
