# Use Case Testing — UC-Login: Dang nhap & Khoa tai khoan

> **SUT**: EShop — chuc nang Dang nhap
> **Nguon dac ta**: `group05_eshop/README.md` — FR-02 (+ FR-22, FR-24 lien quan giao dien form)
> **Ky thuat**: Use Case Testing (mo ta use case → main/alternate/exception flow → scenario → test case theo tung kich ban)

Use Case Testing sinh test case tu **cac luong (flow) cua use case**, khong tu to hop dieu kien. Moi **scenario** = mot duong di qua use case (main success + cac re nhanh alternate/exception). Muc tieu: **phu 100% cac flow** da dinh nghia.

---

## 1. Dac ta Use Case (Use Case Specification)

| Muc | Noi dung |
|-----|----------|
| **UC ID** | UC-Login |
| **Ten** | Dang nhap he thong (co co che khoa tai khoan) |
| **Actor chinh** | Khach da co tai khoan (Guest → User) |
| **Muc tieu** | Xac thuc nguoi dung va cap JWT token de truy cap chuc nang can dang nhap |
| **Precondition** | Nguoi dung da co tai khoan; dang o trang Dang nhap (`/login`); backend hoat dong |
| **Trigger** | Nguoi dung bam nut "Dang nhap" |
| **Postcondition (thanh cong)** | Cap JWT token, luu phia client, gui kem header `Authorization: Bearer`; `failed_attempts` reset ve 0; chuyen sang trang da dang nhap |
| **Postcondition (that bai)** | `failed_attempts` tang **dung 1**; neu >= 3 lan lien tiep → khoa **30 giay** |

### 1.1 Main Success Scenario (MSS)

| Buoc | Actor | System |
|------|-------|--------|
| 1 | Nhap Email (truong `type="email"`) | |
| 2 | Nhap Mat khau (truong `type="password"`) | |
| 3 | Bam "Dang nhap" | |
| 4 | | Validate dinh dang email (HTML5) |
| 5 | | Kiem tra tai khoan **khong** bi khoa |
| 6 | | Xac thuc email + mat khau **dung** |
| 7 | | Reset `failed_attempts = 0`, cap JWT token |
| 8 | | Chuyen sang trang da dang nhap |

### 1.2 Extensions — Alternate & Exception Flows

| Flow | Diem re | Dieu kien | Xu ly he thong | Ket qua |
|------|---------|-----------|----------------|---------|
| **E1** Email sai dinh dang | tai buoc 4 | Email khong dung format `user@domain.com` | HTML5 validation chan submit | Bao loi format, khong goi API |
| **E2** Email chua dang ky | tai buoc 6 | Email khong ton tai trong CSDL | Tang `failed_attempts += 1`, tra **loi chung** (khong tiet lo email khong ton tai) | "Sai thong tin dang nhap" |
| **E3** Sai mat khau (chua toi nguong) | tai buoc 6 | Mat khau sai, `failed_attempts` sau tang **< 3** | Tang `failed_attempts += 1`, tra loi chung | "Sai thong tin dang nhap" |
| **E4** Sai mat khau (cham nguong) | tai buoc 6 | Mat khau sai, `failed_attempts` sau tang **>= 3** | Tang += 1 → **khoa tai khoan 30s** | "Tai khoan tam khoa 30 giay" |
| **E5** Tai khoan dang bi khoa | tai buoc 5 | `failed_attempts >= 3` va chua het 30s | Tu choi ngay, **khong** kiem tra mat khau | "Tai khoan bi khoa" (ke ca mat khau dung) |
| **E6** Khoa het han → thu lai | sau E5 | Da qua 30s ke tu luc khoa | Cho phep dang nhap lai binh thuong | Ve MSS |

---

## 2. Scenario Coverage Matrix

Moi scenario la mot duong di hoan chinh qua use case (ket hop MSS + cac extension).

| Scenario | Duong di (flow) | Ky vong |
|----------|-----------------|---------|
| **SC-01** | MSS (1→8) | Dang nhap thanh cong, cap token, reset counter |
| **SC-02** | MSS 1-3 → E1 | Bi chan boi HTML5 email validation |
| **SC-03** | MSS 1-5 → E2 | Loi chung; `failed_attempts += 1` |
| **SC-04** | MSS 1-5 → E3 | Loi chung; `failed_attempts += 1` (van < 3) |
| **SC-05** | MSS 1-5 → E4 | Sau lan sai thu 3 → khoa 30s |
| **SC-06** | E5 (vao khi da khoa) | Tu choi ke ca mat khau dung |
| **SC-07** | E6 (het 30s → MSS) | Sau 30s dang nhap lai thanh cong |

**Phu flow:** MSS ✓, E1 ✓, E2 ✓, E3 ✓, E4 ✓, E5 ✓, E6 ✓ → **100% flow coverage**.

---

## 3. Dan xuat Test Case theo Scenario

Moi scenario → it nhat 1 test case (buoc thiet ke chi tiet se tach thanh file `TC_*.md`).

| Test | Scenario | Test data chinh | Ket qua ky vong |
|------|----------|-----------------|-----------------|
| UC-TC-01 | SC-01 | `test@eshop.com` / `Test1234!` (dung, chua khoa) | 200 + JWT token; counter = 0; vao trang chu |
| UC-TC-02 | SC-02 | `abc` (thieu `@domain`) / bat ky | Truong email chan submit (HTML5), khong goi API |
| UC-TC-03 | SC-03 | `nobody@eshop.com` / `Whatever1!` | 401 loi chung; **khong** noi "email khong ton tai" |
| UC-TC-04 | SC-04 | `test@eshop.com` / `WrongPass1!` (lan 1) | 401 loi chung; `failed_attempts = 1` |
| UC-TC-05 | SC-05 | `test@eshop.com` / sai lien tiep den lan 3 | Lan 3 → khoa 30s; counter moi lan **+1** |
| UC-TC-06 | SC-06 | Account da khoa → nhap mat khau **dung** `Test1234!` | 403 "tai khoan bi khoa"; khong cap token |
| UC-TC-07 | SC-07 | Cho > 30s sau khoa → `test@eshop.com` / `Test1234!` | 200 + token; khoa da het han |

---

## 4. Coverage Summary

| Metric | Value |
|--------|-------|
| So flow (main + extension) | 7 (MSS + E1..E6) |
| So scenario | 7 (SC-01 … SC-07) |
| Test case dan xuat | 7 (UC-TC-01 … UC-TC-07) |
| Flow coverage | 100% |
| Bao gom happy path | ✓ (SC-01) |
| Bao gom exception path | ✓ (SC-03 … SC-06) |

**Traceability:** Flow → Scenario → Test case. Moi scenario map 1:1 toi mot file test case chi tiet trong buoc thiet ke chi tiet.

> **Luu y ky thuat:** Use Case Testing tap trung vao **luong hanh vi/kich ban** (goc nhin nguoi dung end-to-end), khac voi Decision Table (to hop dieu kien) da lam cho cung FR-02. Hai ky thuat bo tro nhau: bug lien quan bo dem (`failed_attempts += 2` thay vi +1) se lam **SC-05** that bai vi khoa som sau 2 lan thay vi 3.
