# TD-POOL-A: Test Design cho Authentication, Categories, and Products

## Scope
Thiết kế test cho Pool A theo yêu cầu bài tập:

| Requirement | Feature |
| --- | --- |
| FR-01 | Account registration |
| FR-02 | Login and account lockout |
| FR-03 | Forgot password and password reset two steps |
| FR-05 | Product listing and search |

## Test design objective
- Xác định các điều kiện kiểm thử chính từ requirement.
- Chọn kỹ thuật thiết kế test phù hợp cho từng feature.
- Sinh ra test case có mã ổn định để liên kết với test run, bug issue và traceability matrix.

## Test design technique
| Requirement | Module | Technique | Reason |
| --- | --- | --- | --- |
| FR-01 | Register | Equivalence Partitioning | Dữ liệu đăng ký có nhóm hợp lệ và không hợp lệ: email, password, confirm password. |
| FR-02 | Login | Equivalence Partitioning, Boundary Value Analysis | Login có dữ liệu đúng/sai và ngưỡng khóa tài khoản sau 3 lần sai. |
| FR-03 | Forgot Password | Scenario Testing, Equivalence Partitioning | Quy trình gồm 2 bước liên tiếp và có dữ liệu OTP/password hợp lệ hoặc không hợp lệ. |
| FR-05 | Product Listing | Equivalence Partitioning, Security Testing | Search có nhóm có kết quả, không có kết quả và input nguy hiểm như HTML/script. |

## FR-01 Test Design: Account registration
| Condition | Valid class | Invalid class |
| --- | --- | --- |
| Họ tên | Không rỗng | Rỗng |
| Email format | `user@domain.com` | Sai format email |
| Email uniqueness | Email chưa tồn tại | Email đã tồn tại |
| Password strength | Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt | Thiếu một hoặc nhiều điều kiện |
| Confirm password | Trùng password | Không trùng password |

### Test cases derived
| Test Case ID | Purpose | Priority |
| --- | --- | --- |
| TC-REGISTER-001 | Đăng ký tài khoản thành công với dữ liệu hợp lệ | High |

## FR-02 Test Design: Login and account lockout
| Condition | Valid class | Invalid class / Boundary |
| --- | --- | --- |
| Email | Email đã tồn tại, đúng format | Email sai format hoặc chưa tồn tại |
| Password | Đúng password | Sai password |
| Login attempts | 0-2 lần sai chưa bị khóa | Từ 3 lần sai trở lên bị khóa |
| Lock duration | Hết 30 giây được thử lại | Trong 30 giây không được đăng nhập |
| Token | Login thành công có JWT | Login thất bại không có JWT |

### Test cases derived
| Test Case ID | Purpose | Priority |
| --- | --- | --- |
| TC-LOGIN-001 | Đăng nhập thành công với tài khoản hợp lệ | High |

## FR-03 Test Design: Forgot password and password reset
| Flow / Condition | Valid class | Invalid class |
| --- | --- | --- |
| Step indicator | Hiển thị rõ bước 1/2 và 2/2 | Không hiển thị hoặc hiển thị sai bước |
| Email request OTP | Email đã đăng ký | Email chưa đăng ký |
| OTP format | OTP 6 chữ số | OTP không đủ 6 chữ số hoặc sai OTP |
| OTP ownership | OTP đúng với email đã yêu cầu | OTP của email khác |
| New password | Password mạnh | Password yếu |
| Confirm password | Trùng new password | Không trùng new password |

### Test cases derived
| Test Case ID | Purpose | Priority |
| --- | --- | --- |
| TC-FORGOT-PASSWORD-001 | Quên mật khẩu và đặt lại mật khẩu thành công theo quy trình 2 bước | High |

## FR-05 Test Design: Product listing and search
| Condition | Valid class | Invalid / Special class |
| --- | --- | --- |
| Product list | Có sản phẩm trong hệ thống | Không có sản phẩm |
| Product card | Có ảnh, alt text, tên, giá đúng định dạng `₫` | Thiếu ảnh/alt text/tên/giá hoặc sai đơn vị tiền |
| Search keyword | Keyword khớp tên sản phẩm | Keyword không khớp sản phẩm nào |
| Search display | Keyword được hiển thị an toàn | Render HTML/script hoặc làm mất nội dung hiển thị |
| Page heading | Đúng một thẻ `<h1>` | Không có hoặc nhiều hơn một `<h1>` |
| Loading/empty state | Có trạng thái loading và empty state rõ ràng | Không có phản hồi phù hợp |

### Test cases derived
| Test Case ID | Purpose | Priority |
| --- | --- | --- |
| TC-PRODUCT-SEARCH-001 | Tìm kiếm sản phẩm theo tên trên trang chủ | High |

## Traceability from design to test case
| Test Design ID | Requirement | Test Case ID | Test Case File |
| --- | --- | --- | --- |
| TD-POOL-A | FR-01 | TC-REGISTER-001 | `tests/test-cases/auth/TC-REGISTER-001.md` |
| TD-POOL-A | FR-02 | TC-LOGIN-001 | `tests/test-cases/auth/TC-LOGIN-001.md` |
| TD-POOL-A | FR-03 | TC-FORGOT-PASSWORD-001 | `tests/test-cases/auth/TC-FORGOT-PASSWORD-001.md` |
| TD-POOL-A | FR-05 | TC-PRODUCT-SEARCH-001 | `tests/test-cases/product/TC-PRODUCT-SEARCH-001.md` |
