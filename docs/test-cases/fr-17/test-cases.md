# FR-17 Test Conditions and Test Cases

## Test Condition Table

| Test Condition ID | Requirement ID | Description | Test Technique | Priority | Source Reference |
| --- | --- | --- | --- | --- | --- |
| FR17-TCND-001 | FR17-R01 | Valid admin xem complete controlled coupon list. | `USE_CASE_TESTING` | `HIGH` | README FR-17 |
| FR17-TCND-002 | FR17-R16 | Sáu required coupon fields có visible `*` indicator. | `USE_CASE_TESTING` | `MEDIUM` | README FR-22 |
| FR17-TCND-003 | FR17-R06 | `type` control luôn chọn một value thuộc `{percent, fixed}`. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-17 |
| FR17-TCND-004 | FR17-R02, FR17-R07–R13 | Admin tạo valid fixed coupon tại các lower valid numeric boundaries. | `BOUNDARY_VALUE_ANALYSIS` | `HIGH` | README FR-17 |
| FR17-TCND-005 | FR17-R05 | Duplicate `code` bị reject và không tạo record thứ hai. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-17 |
| FR17-TCND-006 | FR17-R04 | Missing `code` không tạo coupon. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-17 |
| FR17-TCND-007 | FR17-R07 | Missing `discount_value` không tạo coupon. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-17 |
| FR17-TCND-008 | FR17-R08 | `discount_value = 0` bị reject. | `BOUNDARY_VALUE_ANALYSIS` | `HIGH` | README FR-17 |
| FR17-TCND-009 | FR17-R09 | Missing `expired_at` không tạo coupon. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-17 |
| FR17-TCND-010 | FR17-R10 | Missing `min_order_amount` không tạo coupon. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-17 |
| FR17-TCND-011 | FR17-R11 | `min_order_amount = -1` bị reject. | `BOUNDARY_VALUE_ANALYSIS` | `HIGH` | README FR-17 |
| FR17-TCND-012 | FR17-R12 | Missing `max_uses_per_user` không tạo coupon. | `EQUIVALENCE_PARTITIONING` | `HIGH` | README FR-17 |
| FR17-TCND-013 | FR17-R13 | `max_uses_per_user = 0` bị reject. | `BOUNDARY_VALUE_ANALYSIS` | `HIGH` | README FR-17 |
| FR17-TCND-014 | FR17-R03 | Admin xóa đúng controlled owned coupon và record biến mất khỏi list. | `USE_CASE_TESTING` | `HIGH` | README FR-17 |
| FR17-TCND-015 | FR17-R14 | User không có valid JWT không có usable coupon-management surface. | `DECISION_TABLE` | `HIGH` | README FR-12, SEC-02 |
| FR17-TCND-016 | FR17-R15 | Valid non-admin JWT không có usable coupon-management surface. | `DECISION_TABLE` | `HIGH` | README FR-12, SEC-03 |

## Test Cases

### FR17-TC-001 — Admin xem complete controlled coupon list

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-001` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R01 |
| Test Condition ID | FR17-TCND-001 |
| Objective | Xác nhận valid admin xem được complete controlled coupon list. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated database ở verified four-seed baseline; Coupon Management mở thành công. |
| Test Data | Existing seed oracle: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`; expected count `4`. |
| Steps | 1. Mở Web Admin bằng valid admin session. 2. Chọn coupon-management surface. 3. Quan sát coupon results table/list. |
| Expected Result | Coupon result count bằng 4 và complete expected code set gồm đúng `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`. |
| Test Type | `POSITIVE` |
| Test Technique | `USE_CASE_TESTING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Table rows không có stable test IDs; locator cần scope bằng coupon heading/table và code cell text. |
| Dependencies | Valid admin auth fixture; verified seed snapshot; stable coupon tab/table locator. |
| Cleanup / Isolation | `READ_ONLY`; fresh browser context; không submit create/delete; verify baseline before use. |
| Demo Suitability | `SECONDARY_DEMO_CANDIDATE` |
| Notes | Complete controlled set/count tách khỏi create/delete để failure attribution rõ. |

### FR17-TC-002 — Required coupon fields có visible indicator

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-002` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R16 |
| Test Condition ID | FR17-TCND-002 |
| Objective | Xác nhận mỗi required coupon field có ký hiệu `*` bên cạnh field label. |
| Actor | Admin |
| Preconditions | Valid admin session; coupon create form visible. |
| Test Data | Required fields: `code`, `type`, `discount_value`, `expired_at`, `min_order_amount`, `max_uses_per_user`. |
| Steps | 1. Mở Coupon Management. 2. Xác định label của từng required field. 3. Kiểm tra required indicator tương ứng. |
| Expected Result | Cả sáu required field labels đều có visible `*` indicator bên cạnh; không yêu cầu style hoặc exact localized label ngoài field identity. |
| Test Type | `POSITIVE` |
| Test Technique | `USE_CASE_TESTING` |
| Priority | `MEDIUM` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Current form dùng placeholders thay cho labels; thiếu stable label association có thể block locator và đồng thời reveal discrepancy. |
| Dependencies | Valid admin auth fixture; observable labels/required indicators. |
| Cleanup / Isolation | `READ_ONLY`; fresh browser context; không submit form. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Objective là objective UI requirement riêng, không gộp với business validation. |

### FR17-TC-003 — Type control chỉ cho phép percent hoặc fixed

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-003` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R06 |
| Test Condition ID | FR17-TCND-003 |
| Objective | Xác nhận required `type` control luôn có selected value và selectable domain chỉ gồm `percent`, `fixed`. |
| Actor | Admin |
| Preconditions | Valid admin session; coupon create form visible. |
| Test Data | Allowed values: `percent`, `fixed`; expected option count `2`. |
| Steps | 1. Mở create form. 2. Locate `type` control. 3. Liệt kê option values. 4. Chọn lần lượt mỗi allowed value và đọc selected value. |
| Expected Result | Control có đúng hai option values `percent`, `fixed`; không có empty option; sau mỗi selection, selected value đúng allowed value đã chọn. |
| Test Type | `POSITIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `TEXT_OR_VALUE`, `ATTRIBUTE_OR_CLASS` |
| Automation Risks | Select thiếu explicit label; locator có thể phải scope trong create form và tìm native select ổn định. |
| Dependencies | Valid admin auth fixture; native select remains observable. |
| Cleanup / Isolation | `READ_ONLY`; fresh browser context; không submit form. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Không đưa arbitrary third type vào UI; backend validation discrepancy được ghi riêng. |

### FR17-TC-004 — Tạo valid coupon ở lower valid boundaries

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-004` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R02, FR17-R07, FR17-R08, FR17-R09, FR17-R10, FR17-R11, FR17-R12, FR17-R13 |
| Test Condition ID | FR17-TCND-004 |
| Objective | Xác nhận admin tạo được một valid fixed coupon và record mới xuất hiện trong list. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated database at verified baseline; controlled unique code absent. |
| Test Data | Future external dataset: code `FR17FIXED01`, type `fixed`, `discount_value=1`, non-empty `expired_at=2099-12-31`, `min_order_amount=0`, `max_uses_per_user=1`. |
| Steps | 1. Mở create form. 2. Điền controlled values. 3. Submit. 4. Locate new list row by unique code. 5. Quan sát stored/displayed field values. |
| Expected Result | Exactly one `FR17FIXED01` record xuất hiện; type và submitted values tương ứng được hiển thị. `discount_value=1`, `min_order_amount=0`, `max_uses_per_user=1` được chấp nhận. |
| Test Type | `POSITIVE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `STATE_TRANSITION`, `COUNT`, `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Create feedback chỉ dựa vào refreshed list; exact success copy không defined; cần unique deterministic code và stable row scoping. |
| Dependencies | Admin auth; isolated DB copy; external dataset; observable list refresh. |
| Cleanup / Isolation | `STATEFUL_CREATE_CLEANUP`; create owned record, assert primary outcome, then delete only that record or restore isolated snapshot. |
| Demo Suitability | `PRIMARY_DEMO_CANDIDATE` |
| Notes | Cleanup không phải second objective; demo có thể cho thấy form submit và visible list transition. |

### FR17-TC-005 — Duplicate code bị reject

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-005` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R05 |
| Test Condition ID | FR17-TCND-005 |
| Objective | Xác nhận không thể tạo record thứ hai với existing coupon code. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated seed baseline contains exactly one `SAVE10`. |
| Test Data | `code=SAVE10`; các field còn lại dùng valid controlled values. |
| Steps | 1. Ghi baseline count của code `SAVE10`. 2. Submit create form với duplicate code và các field khác valid. 3. Quan sát list/state sau submit. |
| Expected Result | Coupon create bị reject theo uniqueness rule; count của code `SAVE10` vẫn bằng 1; không có duplicate record. Exact error copy không được assert. |
| Test Type | `NEGATIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Backend hiện trả generic database error; test không được phụ thuộc exact error text. |
| Dependencies | Admin auth; verified `SAVE10`; isolated DB snapshot. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; submit only in isolated DB; assert baseline unchanged; restore snapshot after case. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Negative demo candidate có deterministic count oracle và không cần invent UI copy. |

### FR17-TC-006 — Missing code không tạo coupon

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-006` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R04 |
| Test Condition ID | FR17-TCND-006 |
| Objective | Xác nhận create không hoàn tất khi `code` bị bỏ trống. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB baseline; create form visible. |
| Test Data | `code=""`; all other fields valid. |
| Steps | 1. Ghi baseline count. 2. Để `code` trống và điền valid values còn lại. 3. Trigger submit. 4. Quan sát form/list. |
| Expected Result | Không có coupon record mới; result count vẫn bằng baseline; exact validation message không được yêu cầu. |
| Test Type | `NEGATIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION` |
| Automation Risks | Native browser validation có thể chặn request; assertion phải chấp nhận mechanism nhưng giữ business outcome. |
| Dependencies | Admin auth; isolated DB; external omission dataset. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; verify isolated snapshot unchanged and restore after case. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Không giả định trim/case normalization. |

### FR17-TC-007 — Missing discount_value không tạo coupon

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-007` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R07 |
| Test Condition ID | FR17-TCND-007 |
| Objective | Xác nhận create không hoàn tất khi `discount_value` bị bỏ trống. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB baseline; create form visible. |
| Test Data | `discount_value=""`; all other fields valid và unique code controlled. |
| Steps | 1. Ghi baseline count và confirm unique code absent. 2. Submit form với missing discount value. 3. Quan sát list/state. |
| Expected Result | Không có record mang controlled code; total coupon count không tăng; exact error copy không được assert. |
| Test Type | `NEGATIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION` |
| Automation Risks | Native `required` may block submit before API; use web-first state assertions, không wait cố định. |
| Dependencies | Admin auth; isolated DB; external omission dataset. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; verify no record created; restore isolated snapshot. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Primary objective là requiredness, tách khỏi positivity boundary. |

### FR17-TC-008 — discount_value bằng 0 bị reject

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-008` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R08 |
| Test Condition ID | FR17-TCND-008 |
| Objective | Xác nhận exact invalid lower boundary `discount_value=0` không được tạo. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB baseline; controlled unique code absent. |
| Test Data | `discount_value=0`; all other fields valid. |
| Steps | 1. Điền create form với controlled unique code và discount 0. 2. Submit. 3. Quan sát list/state. |
| Expected Result | Coupon bị reject vì `discount_value` không dương; controlled code không xuất hiện; count không tăng. |
| Test Type | `EDGE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION` |
| Automation Risks | Current UI has no `min`; backend may create invalid record, nên isolated DB và post-case restore bắt buộc. |
| Dependencies | Admin auth; isolated DB; external boundary dataset. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; restore snapshot even if nonconforming SUT creates the record. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Valid side `1` được covered bởi FR17-TC-004. |

### FR17-TC-009 — Missing expired_at không tạo coupon

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-009` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R09 |
| Test Condition ID | FR17-TCND-009 |
| Objective | Xác nhận create không hoàn tất khi `expired_at` bị bỏ trống. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB baseline; create form visible. |
| Test Data | `expired_at=""`; all other fields valid và controlled code unique. |
| Steps | 1. Điền all valid fields trừ expiry. 2. Trigger submit. 3. Quan sát list/state. |
| Expected Result | Không có coupon record mới với controlled code; coupon count không tăng; không assert exact error copy. |
| Test Type | `NEGATIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION` |
| Automation Risks | Native date `required` behavior phải sync bằng state assertion; không invent future-date semantics. |
| Dependencies | Admin auth; isolated DB; external omission dataset. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; verify no mutation and restore isolated snapshot. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Chỉ requiredness được test; timezone/future-date remains a gap. |

### FR17-TC-010 — Missing min_order_amount không tạo coupon

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-010` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R10 |
| Test Condition ID | FR17-TCND-010 |
| Objective | Xác nhận create không hoàn tất khi `min_order_amount` bị bỏ trống. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB baseline; controlled unique code absent. |
| Test Data | Clear `min_order_amount` to empty; all other fields valid. |
| Steps | 1. Clear minimum-order input. 2. Fill remaining fields with valid values. 3. Submit. 4. Observe list/state. |
| Expected Result | Không có controlled coupon record mới; total count không tăng; exact message không required. |
| Test Type | `NEGATIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION` |
| Automation Risks | Current field defaults to 0 but can be cleared; backend may accept empty, nên rollback must handle unexpected mutation. |
| Dependencies | Admin auth; isolated DB; external omission dataset. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; restore snapshot regardless of current SUT outcome. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Requiredness tách khỏi valid/invalid numeric boundary. |

### FR17-TC-011 — min_order_amount bằng -1 bị reject

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-011` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R11 |
| Test Condition ID | FR17-TCND-011 |
| Objective | Xác nhận value ngay dưới minimum, `min_order_amount=-1`, bị reject. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB baseline; controlled unique code absent. |
| Test Data | `min_order_amount=-1`; all other fields valid. |
| Steps | 1. Fill form with controlled data and minimum order -1. 2. Submit. 3. Observe list/state. |
| Expected Result | Coupon bị reject vì minimum order nhỏ hơn 0; controlled code không xuất hiện; count không tăng. |
| Test Type | `EDGE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION` |
| Automation Risks | UI/backend currently lack lower-bound enforcement; isolated rollback required if invalid record appears. |
| Dependencies | Admin auth; isolated DB; external boundary dataset. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; restore snapshot even after nonconforming creation. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Valid exact boundary 0 được covered trong FR17-TC-004. |

### FR17-TC-012 — Missing max_uses_per_user không tạo coupon

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-012` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R12 |
| Test Condition ID | FR17-TCND-012 |
| Objective | Xác nhận create không hoàn tất khi `max_uses_per_user` bị bỏ trống. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB baseline; controlled unique code absent. |
| Test Data | Clear `max_uses_per_user` to empty; all other fields valid. |
| Steps | 1. Clear max-uses input. 2. Fill remaining valid values. 3. Submit. 4. Observe list/state. |
| Expected Result | Không có controlled coupon record mới; total count không tăng; exact message không asserted. |
| Test Type | `NEGATIVE` |
| Test Technique | `EQUIVALENCE_PARTITIONING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION` |
| Automation Risks | Backend currently defaults missing value to 1; current discrepancy may create a record. |
| Dependencies | Admin auth; isolated DB; external omission dataset. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; restore snapshot regardless of observed outcome. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Requiredness tách khỏi numeric boundary. |

### FR17-TC-013 — max_uses_per_user bằng 0 bị reject

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-013` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R13 |
| Test Condition ID | FR17-TCND-013 |
| Objective | Xác nhận exact invalid lower boundary `max_uses_per_user=0` bị reject. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB baseline; controlled unique code absent. |
| Test Data | `max_uses_per_user=0`; all other fields valid. |
| Steps | 1. Fill form with max uses 0. 2. Trigger submit. 3. Observe list/state. |
| Expected Result | Coupon bị reject vì max uses nhỏ hơn 1; controlled code không xuất hiện; count không tăng. |
| Test Type | `EDGE` |
| Test Technique | `BOUNDARY_VALUE_ANALYSIS` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `STATE_TRANSITION` |
| Automation Risks | Native input may reject 0 or backend may silently convert 0 to 1; assertion remains requirement-based. |
| Dependencies | Admin auth; isolated DB; external boundary dataset. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; restore isolated snapshot if nonconforming record is created. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Valid exact boundary 1 được covered trong FR17-TC-004. |

### FR17-TC-014 — Xóa đúng controlled coupon

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-014` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R03 |
| Test Condition ID | FR17-TCND-014 |
| Objective | Xác nhận admin xóa đúng controlled owned coupon và record biến mất khỏi list. |
| Actor | Admin |
| Preconditions | Valid admin session; isolated DB; setup owns exactly one coupon `FR17DELETE01` và baseline seed records remain. |
| Test Data | Controlled setup record `FR17DELETE01` with otherwise valid fields. |
| Steps | 1. Open coupon list. 2. Scope row by exact controlled code. 3. Trigger that row's delete action. 4. Observe list after response/refresh. |
| Expected Result | `FR17DELETE01` count transitions from 1 to 0; other baseline coupon codes remain present. No confirmation-dialog behavior is assumed. |
| Test Type | `POSITIVE` |
| Test Technique | `USE_CASE_TESTING` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `STATE_TRANSITION`, `COUNT`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Repeated text/buttons require exact row scoping; current UI has no stable row test ID. |
| Dependencies | Admin auth; isolated DB; owned setup record; stable row/button scoping. |
| Cleanup / Isolation | `STATEFUL_SETUP_REQUIRED`; setup one owned record per test; after assertion restore isolated snapshot if any residue remains. |
| Demo Suitability | `SECONDARY_DEMO_CANDIDATE` |
| Notes | Delete is separate from create; test does not delete shared seed data. |

### FR17-TC-015 — Không có valid JWT thì không dùng được Coupon Management

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-015` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R14 |
| Test Condition ID | FR17-TCND-015 |
| Objective | Xác nhận unauthenticated user không có usable coupon-management surface. |
| Actor | Unauthenticated user |
| Preconditions | Fresh browser context; no admin token/JWT in browser storage or headers. |
| Test Data | No credentials; no JWT. |
| Steps | 1. Open Web Admin entry point in fresh context. 2. Attempt to reach coupon-management controls through available UI. |
| Expected Result | Coupon list/create/delete controls không khả dụng; user được giữ tại hoặc đưa tới an authentication boundary. Không yêu cầu exact URL hay denial copy. |
| Test Type | `NEGATIVE` |
| Test Technique | `DECISION_TABLE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_SUITABLE` |
| Assertion Candidates | `VISIBILITY_OR_HIDDEN_STATE`, `ENABLED_OR_DISABLED_STATE`, `STATE_TRANSITION` |
| Automation Risks | SPA has no dedicated coupon route; assertion must remain mechanism-neutral and avoid fixed redirect assumption. |
| Dependencies | Stable Web Admin entry point and observable auth boundary. |
| Cleanup / Isolation | `READ_ONLY`; new context; clear storage after case. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Không gửi create/delete API; tách khỏi non-admin role case. |

### FR17-TC-016 — Non-admin không dùng được Coupon Management

| Field | Value |
| --- | --- |
| Test Case ID | `FR17-TC-016` |
| Feature ID | `FR-17` |
| Requirement ID | FR17-R15 |
| Test Condition ID | FR17-TCND-016 |
| Objective | Xác nhận valid JWT của role khác `admin` không cấp usable coupon-management surface. |
| Actor | Authenticated non-admin user |
| Preconditions | Fresh browser context; valid controlled non-admin JWT obtained through approved setup; no admin JWT. |
| Test Data | Existing verified `user` role account alias; credentials/token externalized at runtime. |
| Steps | 1. Establish controlled non-admin session in Web Admin context. 2. Load/refresh Admin surface. 3. Attempt to access coupon list/create/delete controls. |
| Expected Result | Coupon list/create/delete controls không khả dụng và no coupon-management operation can be performed; exact redirect/denial copy is not required. |
| Test Type | `NEGATIVE` |
| Test Technique | `DECISION_TABLE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `VISIBILITY_OR_HIDDEN_STATE`, `ENABLED_OR_DISABLED_STATE`, `STATE_TRANSITION` |
| Automation Risks | Client login has a role check but API routes lack server-side role guard; setup must prove the browser truly uses only non-admin token. |
| Dependencies | Controlled non-admin auth fixture; token-role verification; stable Admin entry point. |
| Cleanup / Isolation | `READ_ONLY`; fresh context; no coupon mutation; remove token/storage afterward. |
| Demo Suitability | `NOT_RECOMMENDED_FOR_DEMO` |
| Notes | Security objective tests role independently from missing JWT. |

## Inventory Summary

| Metric | Count |
| --- | ---: |
| Test Conditions | 16 |
| Test Cases | 16 |
| `POSITIVE` | 5 |
| `NEGATIVE` | 8 |
| `EDGE` | 3 |
| `AUTOMATION_SUITABLE` | 1 |
| `AUTOMATION_POSSIBLE_WITH_SETUP` | 15 |
| `MANUAL_RECOMMENDED` | 0 |
| `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION` | 0 |
| `NEEDS_CLARIFICATION` | 0 |
| Automation Candidate Count | 16 |
| Stateful Test Count | 11 |
| Read-Only Test Count | 5 |

Minimum gates: Test Case Count `16 >= 12` — `PASS`; Automation Candidate Count `16 >= 12` — `PASS`.
