# FR-09 Test Conditions and Test Cases

## Test Condition Table

| Test Condition ID | Requirement ID | Description | Test Technique | Priority | Source Reference |
| --- | --- | --- | --- | --- | --- |
| FR09-TCND-001 | FR09-R01 | Authenticated customer có thể nhập và trigger coupon application tại Checkout. | `USE_CASE_TESTING` | `HIGH` | README FR-09 |
| FR09-TCND-002 | FR09-R08 | Percent coupon tạo đúng `discount_amount`. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-09 formula |
| FR09-TCND-003 | FR09-R10 | Percent coupon tạo đúng `final_amount`. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-09 formula |
| FR09-TCND-004 | FR09-R09 | Fixed coupon tạo đúng `discount_amount`. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-09 formula |
| FR09-TCND-005 | FR09-R10 | Fixed coupon tạo đúng `final_amount`. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-09 formula |
| FR09-TCND-006 | FR09-R05 | `total = min_order_amount` được chấp nhận. | `BOUNDARY_VALUE_ANALYSIS` | `HIGH` | README FR-09 C3 |
| FR09-TCND-007 | FR09-R05 | `total = min_order_amount - 1` bị từ chối. | `BOUNDARY_VALUE_ANALYSIS` | `HIGH` | README FR-09 C3 |
| FR09-TCND-008 | FR09-R05 | `total > min_order_amount` được chấp nhận. | `BOUNDARY_VALUE_ANALYSIS` | `MEDIUM` | README FR-09 C3 |
| FR09-TCND-009 | FR09-R02 | Coupon không tồn tại bị từ chối. | `DECISION_TABLE` | `HIGH` | README FR-09 C1 |
| FR09-TCND-010 | FR09-R03 | Coupon inactive bị từ chối. | `DECISION_TABLE` | `HIGH` | README FR-09 C1 |
| FR09-TCND-011 | FR09-R04 | Coupon expired bị từ chối. | `DECISION_TABLE` | `HIGH` | README FR-09 C2 |
| FR09-TCND-012 | FR09-R06 | Apply coupon khi không có valid JWT bị từ chối. | `DECISION_TABLE` | `HIGH` | README FR-09 C4 |
| FR09-TCND-013 | FR09-R11 | Unauthenticated user không được tiến hành Checkout. | `ROLE_PERMISSION_TESTING` | `HIGH` | README FR-08 |
| FR09-TCND-014 | FR09-R07 | `usage_count = max_uses_per_user` bị từ chối. | `BOUNDARY_VALUE_ANALYSIS` | `HIGH` | README FR-09 C5 |
| FR09-TCND-015 | FR09-R07 | `usage_count = max_uses_per_user - 1` được chấp nhận. | `BOUNDARY_VALUE_ANALYSIS` | `HIGH` | README FR-09 C5 |
| FR09-TCND-016 | FR09-R12 | Coupon dùng checkout total tự động và không cho chỉnh trực tiếp. | `USE_CASE_TESTING` | `HIGH` | README FR-08 |

## Test Cases

### FR09-TC-001 — Coupon controls khả dụng tại Checkout

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-001` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R01 |
| Objective | Xác nhận authenticated customer có thể nhập coupon code và trigger apply action tại Checkout. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Valid authenticated session; cart có ít nhất một existing seed product; Checkout mở thành công. |
| Test Data | Existing seed product và documented coupon `SAVE10`. |
| Steps | 1. Đi từ Cart đến Checkout. 2. Xác định coupon input và apply action. 3. Nhập `SAVE10`. 4. Trigger apply action. |
| Expected Result | Coupon input cho phép nhập code; apply action có thể được trigger tại Checkout; outcome có observable applied hoặc rejected state mà không yêu cầu exact message copy. |
| Test Type | `POSITIVE` |
| Test Technique | `USE_CASE_TESTING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `VISIBILITY_OR_HIDDEN_STATE`, `ENABLED_OR_DISABLED_STATE`, `STATE_TRANSITION` |
| Automation Risks | Cần auth/cart setup độc lập; không được assert exact Vietnamese copy chưa được quy định. |
| Dependencies | Stable Checkout route; label/input/action locator; valid auth fixture. |
| Cleanup / Isolation | Tạo fresh browser context; chỉ apply, không complete checkout; reset cart/session sau case. |
| Notes | `READ_ONLY`; không tạo `coupon_usage`. |

### FR09-TC-002 — Percent discount_amount chính xác

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-002` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R08 |
| Objective | Xác nhận `SAVE10` tính đúng percent `discount_amount`. |
| Actor | Authenticated customer at Checkout |
| Preconditions | C1–C5 valid; user usage count cho `SAVE10` = 0; cart chứa existing `Bàn phím cơ Keychron Q1` quantity 1, total 4000000. |
| Test Data | `SAVE10`: 10%; total 4000000; expected `discount_amount` 400000. |
| Steps | 1. Mở Checkout với controlled cart total. 2. Nhập `SAVE10`. 3. Apply coupon. 4. Quan sát displayed discount. |
| Expected Result | Coupon được apply và displayed `discount_amount` bằng 400000 theo `4000000 × 10 / 100`. |
| Test Type | `POSITIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `CALCULATION`, `TEXT_OR_VALUE`, `STATE_TRANSITION` |
| Automation Risks | Current percent implementation nonconforming; currency formatting phải được parse mà không làm yếu numeric oracle. |
| Dependencies | Auth fixture; existing seed product; `SAVE10`; usage-zero isolation. |
| Cleanup / Isolation | Fresh session/cart; không complete checkout; xác nhận không có usage row mới. |
| Notes | `READ_ONLY`; primary objective chỉ là discount amount. |

### FR09-TC-003 — Percent final_amount chính xác

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-003` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R10 |
| Objective | Xác nhận final amount sau percent discount được tính đúng và hiển thị tại Checkout. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Giống FR09-TC-002 nhưng chạy độc lập trong fresh session. |
| Test Data | Total 4000000; `SAVE10`; discount 400000; expected `final_amount` 3600000. |
| Steps | 1. Mở Checkout với total 4000000. 2. Apply `SAVE10`. 3. Quan sát displayed final amount/checkout payable total. |
| Expected Result | Displayed `final_amount` và checkout payable total bằng 3600000 theo `4000000 - 400000`. |
| Test Type | `POSITIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `CALCULATION`, `TEXT_OR_VALUE`, `STATE_TRANSITION` |
| Automation Risks | Phải scope đúng final amount, không nhầm original total hoặc discount line. |
| Dependencies | Auth/cart fixture; `SAVE10`; usage-zero isolation. |
| Cleanup / Isolation | Fresh session/cart; không phụ thuộc FR09-TC-002; không complete checkout. |
| Notes | `READ_ONLY`; split khỏi discount amount vì hai output có thể fail độc lập. |

### FR09-TC-004 — Fixed discount_amount chính xác

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-004` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R09 |
| Objective | Xác nhận `BIGBUY` tạo fixed `discount_amount` đúng. |
| Actor | Authenticated customer at Checkout |
| Preconditions | C1–C5 valid; user usage count cho `BIGBUY` = 0; cart total 4000000 từ existing seed product. |
| Test Data | `BIGBUY`: fixed 50000; total 4000000; expected `discount_amount` 50000. |
| Steps | 1. Mở Checkout với total 4000000. 2. Nhập và apply `BIGBUY`. 3. Quan sát displayed discount. |
| Expected Result | Coupon được apply và displayed `discount_amount` bằng 50000. |
| Test Type | `POSITIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `CALCULATION`, `TEXT_OR_VALUE`, `STATE_TRANSITION` |
| Automation Risks | Cần tách discount line khỏi final amount; usage baseline phải ổn định. |
| Dependencies | Auth fixture; existing seed product; `BIGBUY`. |
| Cleanup / Isolation | Fresh session/cart; không complete checkout. |
| Notes | `READ_ONLY`; dùng existing seed data. |

### FR09-TC-005 — Fixed final_amount chính xác

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-005` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R10 |
| Objective | Xác nhận final amount sau fixed discount được tính đúng và hiển thị tại Checkout. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Giống FR09-TC-004 nhưng chạy độc lập trong fresh session. |
| Test Data | Total 4000000; `BIGBUY`; discount 50000; expected `final_amount` 3950000. |
| Steps | 1. Mở Checkout với total 4000000. 2. Apply `BIGBUY`. 3. Quan sát displayed final amount/checkout payable total. |
| Expected Result | Displayed `final_amount` và checkout payable total bằng 3950000. |
| Test Type | `POSITIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `CALCULATION`, `TEXT_OR_VALUE`, `STATE_TRANSITION` |
| Automation Risks | Phải scope đúng final amount; test không được phụ thuộc FR09-TC-004. |
| Dependencies | Auth/cart fixture; `BIGBUY`; usage-zero isolation. |
| Cleanup / Isolation | Fresh session/cart; không complete checkout. |
| Notes | `READ_ONLY`; independent fixed final oracle. |

### FR09-TC-006 — Total đúng bằng minimum được chấp nhận

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-006` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R05 |
| Objective | Xác nhận inclusive boundary `total = min_order_amount` là valid. |
| Actor | Authenticated customer at Checkout |
| Preconditions | C1, C2, C4, C5 valid; controlled cart total = 300000; no usage for `SAVE10`. |
| Test Data | `SAVE10`; total/minimum 300000; expected discount 30000; final 270000. |
| Steps | 1. Tạo isolated Checkout cart total 300000. 2. Apply `SAVE10`. 3. Quan sát application state và amounts. |
| Expected Result | Coupon được chấp nhận tại exact minimum; discount 30000 và final 270000. |
| Test Type | `EDGE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `STATE_TRANSITION`, `CALCULATION`, `TEXT_OR_VALUE` |
| Automation Risks | Existing product seed không tạo total 300000; cần controlled cart fixture không mutate database. |
| Dependencies | Controlled frontend cart/item fixture; auth; `SAVE10`; usage-zero state. |
| Cleanup / Isolation | Fresh browser context và controlled route/fixture cleanup; không complete checkout. |
| Notes | `READ_ONLY`; Expected Result giữ `>=` dù current backend dùng `>`. |

### FR09-TC-007 — Total thấp hơn minimum một đơn vị bị từ chối

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-007` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R05 |
| Objective | Xác nhận lower boundary `total = min_order_amount - 1` không đủ điều kiện. |
| Actor | Authenticated customer at Checkout |
| Preconditions | C1, C2, C4, C5 valid; controlled cart total = 299999. |
| Test Data | `SAVE10`; total 299999; minimum 300000. |
| Steps | 1. Mở isolated Checkout với total 299999. 2. Apply `SAVE10`. 3. Quan sát coupon/final-total state. |
| Expected Result | Coupon không được apply; không có discount/final amount từ coupon và checkout payable total vẫn 299999. Không assert exact error copy. |
| Test Type | `EDGE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE` |
| Automation Risks | Cần observable rejected state không phụ thuộc exact message; controlled total fixture. |
| Dependencies | Auth; `SAVE10`; controlled cart fixture; usage-zero state. |
| Cleanup / Isolation | Fresh context; cleanup controlled routes/fixture. |
| Notes | `READ_ONLY`; single false decision condition C3. |

### FR09-TC-008 — Total cao hơn minimum được chấp nhận

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-008` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R05 |
| Objective | Xác nhận representative upper-side boundary `total > min_order_amount` là valid. |
| Actor | Authenticated customer at Checkout |
| Preconditions | C1, C2, C4, C5 valid; controlled cart total = 500001; no usage for `BIGBUY`. |
| Test Data | `BIGBUY`; total 500001; minimum 500000; discount 50000; final 450001. |
| Steps | 1. Mở isolated Checkout với total 500001. 2. Apply `BIGBUY`. 3. Quan sát application state. |
| Expected Result | Coupon được chấp nhận; discount 50000 và final amount 450001. |
| Test Type | `EDGE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `MEDIUM` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `STATE_TRANSITION`, `CALCULATION`, `TEXT_OR_VALUE` |
| Automation Risks | Controlled cart total không có trong seed catalog; cần test fixture không mutate DB. |
| Dependencies | Auth; `BIGBUY`; controlled cart fixture; usage-zero state. |
| Cleanup / Isolation | Fresh context; cleanup controlled route/fixture. |
| Notes | `READ_ONLY`; không tạo unrelated total maximum boundary. |

### FR09-TC-009 — Coupon không tồn tại bị từ chối

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-009` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R02 |
| Objective | Xác nhận coupon code absent khỏi controlled catalog không được apply. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Auth valid; checkout total đủ cao; reserved code được verify absent; no prior applied coupon. |
| Test Data | Reserved absent code `FR09-NOT-FOUND-7F3C`; existing cart total 4000000. |
| Steps | 1. Mở Checkout. 2. Nhập reserved absent code. 3. Trigger apply. 4. Quan sát coupon/final-total state. |
| Expected Result | Coupon không được apply; không có coupon discount/final amount và original payable total không đổi. Không assert exact error copy. |
| Test Type | `NEGATIVE` |
| Test Technique | `DECISION_TABLE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE` |
| Automation Risks | Reserved code phải được revalidate absent trước future run. |
| Dependencies | Auth/cart setup; controlled catalog oracle. |
| Cleanup / Isolation | Fresh context; no database mutation. |
| Notes | `READ_ONLY`; không kiểm tra case sensitivity hoặc code length. |

### FR09-TC-010 — Coupon inactive bị từ chối

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-010` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R03 |
| Objective | Xác nhận coupon tồn tại nhưng `is_active = 0` không được apply. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Isolated test DB/transaction có controlled coupon fixture với valid expiry/minimum/usage nhưng inactive; auth/cart valid. |
| Test Data | Controlled inactive coupon fixture; no production/business record is created in this phase. |
| Steps | 1. Establish isolated inactive fixture. 2. Mở Checkout với valid total. 3. Nhập fixture code và apply. 4. Quan sát state. |
| Expected Result | Coupon không được apply; không có discount/final amount và original payable total không đổi. |
| Test Type | `NEGATIVE` |
| Test Technique | `DECISION_TABLE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE` |
| Automation Risks | Current seed không có inactive coupon; setup protocol chưa approved. |
| Dependencies | Approved isolated test DB seed/transaction fixture và cleanup. |
| Cleanup / Isolation | Roll back/delete only the controlled fixture within isolated test DB; never target shared/production data. |
| Notes | `STATEFUL_SETUP_REQUIRED`; không phụ thuộc test order. |

### FR09-TC-011 — Coupon hết hạn bị từ chối

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-011` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R04 |
| Objective | Xác nhận coupon có `expired_at` trong quá khứ không được apply. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Auth valid; usage count = 0; controlled total 100001 để C3 valid độc lập; current time sau 2020-01-01. |
| Test Data | Documented `EXPIRED`; total 100001. |
| Steps | 1. Mở Checkout với total 100001. 2. Apply `EXPIRED`. 3. Quan sát coupon/final-total state. |
| Expected Result | Coupon không được apply do expired; không có discount/final amount và original total không đổi. Không assert exact message copy. |
| Test Type | `NEGATIVE` |
| Test Technique | `DECISION_TABLE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE` |
| Automation Risks | Total phải > 100000 trong current implementation để failure không bị che bởi known C3 defect; Expected Result vẫn dựa requirement. |
| Dependencies | Auth; controlled cart fixture; `EXPIRED`. |
| Cleanup / Isolation | Fresh context; no database mutation. |
| Notes | `READ_ONLY`; exact-time expiry boundary deferred due timezone gap. |

### FR09-TC-012 — Apply coupon không có valid JWT bị từ chối

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-012` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R06 |
| Objective | Xác nhận coupon application không thành công khi request/session không có valid JWT. |
| Actor | Unauthenticated or invalid-token customer at Checkout |
| Preconditions | Fresh context không có valid JWT; controlled cart/Checkout state; C1, C2, C3, C5 otherwise valid. |
| Test Data | `SAVE10`; total 4000000; missing hoặc invalid JWT fixture. |
| Steps | 1. Establish Checkout state without valid JWT. 2. Nhập `SAVE10`. 3. Trigger apply. 4. Quan sát coupon/final-total state. |
| Expected Result | Coupon không được apply; không hiển thị coupon discount/final amount và payable total không đổi. Exact authentication response copy không được giả định. |
| Test Type | `NEGATIVE` |
| Test Technique | `DECISION_TABLE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `PERMISSION`, `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Current endpoint lacks auth middleware and may expose product defect; future automation phải stay UI-driven. |
| Dependencies | Controlled unauthenticated/invalid-token context; cart fixture. |
| Cleanup / Isolation | New browser context per variant; clear localStorage/context afterward. |
| Notes | `READ_ONLY`; API `user_id` example không thay thế JWT oracle. |

### FR09-TC-013 — Unauthenticated user không được tiến hành Checkout

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-013` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R11 |
| Objective | Xác nhận direct Checkout access không cung cấp functional coupon flow cho unauthenticated user. |
| Actor | Unauthenticated customer |
| Preconditions | Fresh browser context; không có JWT/user session. |
| Test Data | None; route `/checkout`. |
| Steps | 1. Truy cập trực tiếp Checkout route trong fresh unauthenticated context. 2. Quan sát access state và coupon controls. |
| Expected Result | User không được tiến hành Checkout; functional coupon application UI không usable. Không yêu cầu exact redirect URL hoặc message vì source không quy định mechanism. |
| Test Type | `NEGATIVE` |
| Test Technique | `ROLE_PERMISSION_TESTING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_SUITABLE` |
| Assertion Candidates | `PERMISSION`, `URL_OR_NAVIGATION`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Assertion phải chấp nhận mọi conforming denial mechanism, không hardcode redirect chưa được quy định. |
| Dependencies | Stable Checkout route and observable access boundary. |
| Cleanup / Isolation | Fresh browser context, no shared state. |
| Notes | `READ_ONLY`; distinct from FR09-TC-012 because route access và apply authorization có thể fail độc lập. |

### FR09-TC-014 — Usage count đúng bằng maximum bị từ chối

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-014` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R07 |
| Objective | Xác nhận upper usage boundary `usage_count = max_uses_per_user` không valid. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Isolated Test User có exactly 1 usage cho `SAVE10` (max=1); C1–C4 valid; cart chứa existing `Bàn phím cơ Keychron Q1` quantity 1, total 4000000. |
| Test Data | Existing seed product `Bàn phím cơ Keychron Q1`; `SAVE10`; Test User; usage count 1; max 1; total 4000000. |
| Steps | 1. Establish exact usage state independently. 2. Login user. 3. Thêm existing seed product quantity 1 và mở Checkout với total 4000000. 4. Apply `SAVE10`. 5. Quan sát coupon và payable-total state. |
| Expected Result | Coupon bị từ chối vì per-user usage condition `1 < 1` không thỏa; không apply coupon discount/final amount và original checkout payable total vẫn là 4000000. Không assert exact error copy hoặc suy luận rejection reason chỉ từ visible text chưa được quy định. |
| Test Type | `EDGE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `PERMISSION`, `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE` |
| Automation Risks | Cần exact per-user usage fixture và reliable cleanup; controlled pre-state là oracle cô lập C5, không dựa vào exact visible rejection reason; current endpoint can bypass when user identity absent. |
| Dependencies | Approved-with-constraints isolated `coupon_usage` transaction/fixture; auth; existing seed product/cart setup. |
| Cleanup / Isolation | Restore/roll back usage rows for only the isolated test user/coupon; không dựa vào FR09-TC-015. |
| Notes | `STATEFUL_SETUP_REQUIRED`; no test-order dependency. Boundary objective remains C5 at `usage_count = max_uses_per_user`; total 4000000 is only a positive control that keeps C3 valid. |

### FR09-TC-015 — Usage count ngay dưới maximum được chấp nhận

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-015` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R07 |
| Objective | Xác nhận lower usage boundary `usage_count = max_uses_per_user - 1` vẫn valid. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Isolated Test User có exactly 1 usage cho `VIP100` (max=2); C1–C4 valid; cart chứa existing `Bàn phím cơ Keychron Q1` quantity 1, total 4000000. |
| Test Data | Existing seed product `Bàn phím cơ Keychron Q1`; `VIP100`; usage 1; max 2; total 4000000; discount 100000; final 3900000. |
| Steps | 1. Establish exact usage state independently. 2. Login user. 3. Thêm existing seed product quantity 1 và mở Checkout với total 4000000. 4. Apply `VIP100`. 5. Quan sát discount/final amount; không complete Checkout. |
| Expected Result | Coupon được apply vì `1 < 2`; displayed `discount_amount` = 100000 và displayed `final_amount` = 3900000. Không complete Checkout. |
| Test Type | `EDGE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `PERMISSION`, `STATE_TRANSITION`, `CALCULATION`, `TEXT_OR_VALUE` |
| Automation Risks | Cần exact usage fixture; apply-only test không được complete checkout hoặc increment usage. |
| Dependencies | Approved-with-constraints isolated `coupon_usage` transaction/fixture; existing seed product/cart setup; auth. |
| Cleanup / Isolation | Roll back usage fixture and browser state; không phụ thuộc FR09-TC-014. |
| Notes | `STATEFUL_SETUP_REQUIRED`; independent C5 max−1 boundary. Total 4000000 is only a positive control that keeps C3 valid. |

### FR09-TC-016 — Checkout total tự động và không chỉnh trực tiếp

| Field | Value |
| --- | --- |
| Test Case ID | `FR09-TC-016` |
| Feature ID | `FR-09` |
| Requirement ID | FR09-R12 |
| Objective | Xác nhận total dùng cho coupon context được tính từ cart và user không thể chỉnh trực tiếp. |
| Actor | Authenticated customer at Checkout |
| Preconditions | Cart chứa existing `Bàn phím cơ Keychron Q1` quantity 1; authenticated session. |
| Test Data | Existing seed price 4000000; expected checkout total 4000000. |
| Steps | 1. Add seed product quantity 1. 2. Đi đến Checkout. 3. Quan sát checkout total. 4. Thử chỉnh trực tiếp control/value nếu có. |
| Expected Result | Checkout total bằng 4000000 được tính từ cart và không thể bị user chỉnh trực tiếp; coupon evaluation context giữ trusted total. |
| Test Type | `POSITIVE` |
| Test Technique | `USE_CASE_TESTING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `CALCULATION`, `TEXT_OR_VALUE`, `ENABLED_OR_DISABLED_STATE`, `ATTRIBUTE_OR_CLASS` |
| Automation Risks | Current UI exposes editable input; assertion phải giữ FR-08 oracle và có stable total control locator. |
| Dependencies | Existing seed product; cart/auth setup; Checkout route. |
| Cleanup / Isolation | Fresh cart/session; no checkout submission or database mutation. |
| Notes | `READ_ONLY`; trực tiếp hỗ trợ trusted total cho FR-09, không mở rộng sang toàn bộ FR-08. |

## Inventory Summary

| Metric | Count |
| --- | ---: |
| Test Conditions | 16 |
| Test Cases | 16 |
| `POSITIVE` | 6 |
| `NEGATIVE` | 5 |
| `EDGE` | 5 |
| `AUTOMATION_SUITABLE` | 1 |
| `AUTOMATION_POSSIBLE_WITH_SETUP` | 15 |
| `MANUAL_RECOMMENDED` | 0 |
| `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION` | 0 |
| `NEEDS_CLARIFICATION` | 0 |
| Automation Candidate Count | 16 |

Minimum gates: Test Case Count `16 >= 12` — `PASS`; Automation Candidate Count `16 >= 13` — `PASS`.
