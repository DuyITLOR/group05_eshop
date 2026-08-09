# FR-05 — Test Conditions and Test Cases

## Test Condition Table

| Test Condition ID | Requirement ID | Description | Test Technique | Priority | Source Reference |
| --- | --- | --- | --- | --- | --- |
| FR05-TCND-01 | FR05-R01 | Complete known catalog is visible with the expected product count. | `USE_CASE_TESTING` | `HIGH` | `README.md` FR-05; API 3.1 |
| FR05-TCND-02 | FR05-R03A | Each controlled product name is visible. | `USE_CASE_TESTING` | `HIGH` | `README.md` FR-05 |
| FR05-TCND-03 | FR05-R02A | Each controlled product has an image element. | `USE_CASE_TESTING` | `HIGH` | `README.md` FR-05 |
| FR05-TCND-04 | FR05-R02C | Each product image has a present, non-empty alt. | `USE_CASE_TESTING` | `HIGH` | `README.md` FR-05, FR-24 |
| FR05-TCND-05 | FR05-R03B | Each price uses `₫`. | `USE_CASE_TESTING` | `HIGH` | `README.md` FR-05, FR-21 |
| FR05-TCND-06 | FR05-R03C | Existing multi-digit prices use thousand grouping. | `EQUIVALENCE_PARTITIONING` | `HIGH` | `README.md` FR-05, FR-21 |
| FR05-TCND-07 | FR05-R04 | Exact known product name returns the expected product. | `EQUIVALENCE_PARTITIONING` | `HIGH` | `README.md` FR-05; API 3.1 |
| FR05-TCND-08 | FR05-R04 | Description-only keyword does not match a product name. | `DECISION_TABLE` | `HIGH` | `README.md` FR-05; API 3.1 |
| FR05-TCND-09 | FR05-R07A | No-result search presents an empty state. | `EQUIVALENCE_PARTITIONING` | `HIGH` | `README.md` FR-05 |
| FR05-TCND-10 | FR05-R05 | Plain keyword is displayed as text. | `EQUIVALENCE_PARTITIONING` | `HIGH` | `README.md` FR-05, SEC-04 |
| FR05-TCND-11 | FR05-R05 | Formatting markup input does not create markup. | `ERROR_GUESSING` | `HIGH` | `README.md` FR-05, SEC-04 |
| FR05-TCND-12 | FR05-R05 | Event-handler markup input does not execute. | `ERROR_GUESSING` | `HIGH` | `README.md` FR-05, SEC-04 |
| FR05-TCND-13 | FR05-R06 | Loading state is observable while data is pending. | `STATE_TRANSITION` | `HIGH` | `README.md` FR-05 |
| FR05-TCND-14 | FR05-R08 | Home page has exactly one semantic h1. | `USE_CASE_TESTING` | `HIGH` | `README.md` FR-05, FR-21 |
| FR05-TCND-15 | FR05-R07B | Empty state includes icon/illustration. | `USE_CASE_TESTING` | `MEDIUM` | `README.md` FR-24 |
| FR05-TCND-16 | FR05-R07C | Empty state includes a friendly message. | `USE_CASE_TESTING` | `MEDIUM` | `README.md` FR-24 |
| FR05-TCND-17 | FR05-R02B | Standard image ratio. | `BOUNDARY_VALUE_ANALYSIS` | `MEDIUM` | `README.md` FR-05; `NEEDS_CLARIFICATION` |
| FR05-TCND-18 | FR05-R01 | Product listing is presented using grid layout. | `USE_CASE_TESTING` | `HIGH` | `README.md` FR-05 |

## Test Cases

### FR05-TC-001 — Hiển thị đầy đủ controlled catalog

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-001` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R01 |
| Objective | Xác nhận toàn bộ seed catalog đã biết hiển thị với expected product count. |
| Actor | Public user |
| Preconditions | Có public home page; controlled catalog phản ánh năm seed products đã xác minh; không có search keyword. |
| Test Data | Năm seed product names và expected count `5`. |
| Steps | 1. Mở home page với controlled catalog. 2. Chờ product loading hoàn tất. 3. Quan sát product listing. |
| Expected Result | Cả năm controlled products xuất hiện đúng một lần và listing count là `5`. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Cần stable product-card locator và isolated complete-catalog oracle. |
| Dependencies | Verified seed manifest hoặc isolated response copy. |
| Notes | Không khẳng định tính đầy đủ của uncontrolled production catalog. |

### FR05-TC-002 — Product name hiển thị trong listing

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-002` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R03A |
| Objective | Xác nhận controlled product hiển thị product name. |
| Actor | Public user |
| Preconditions | Home page tải verified seed product `iPhone 15 Pro Max`. |
| Test Data | Product name `iPhone 15 Pro Max`. |
| Steps | 1. Mở home page. 2. Xác định controlled product theo heading/name. |
| Expected Result | Product name `iPhone 15 Pro Max` hiển thị trong listing. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_SUITABLE` |
| Assertion Candidates | `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Cùng text có thể xuất hiện ngoài card nếu UI thay đổi. |
| Dependencies | Stable seed product response. |
| Notes | Product-detail behavior ngoài scope. |

### FR05-TC-003 — Product image element tồn tại

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-003` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R02A |
| Objective | Xác nhận mỗi controlled product card có image element. |
| Actor | Public user |
| Preconditions | Home page tải năm verified seed products, mỗi product có `imageUrl`. |
| Test Data | Năm seed product names và image URLs. |
| Steps | 1. Mở home page. 2. Xác định từng controlled product card. 3. Kiểm tra image element. |
| Expected Result | Mỗi controlled product card có một image element gắn với product tương ứng. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `ATTRIBUTE_OR_CLASS` |
| Automation Risks | Card hiện thiếu stable semantic/test-id locator; external image hosting có thể lỗi độc lập. |
| Dependencies | Controlled seed response và card locator. |
| Notes | Không assert ratio hoặc alt; đó là các objective riêng. |

### FR05-TC-004 — Product image alt tồn tại và không rỗng

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-004` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R02C |
| Objective | Xác nhận mỗi product image có attribute `alt` với value không rỗng. |
| Actor | Public user |
| Preconditions | Home page tải controlled seed products có image. |
| Test Data | Năm seed products; structural expectation `PRESENT_AND_NON_EMPTY`. |
| Steps | 1. Mở home page. 2. Xác định từng controlled product image. 3. Kiểm tra `alt`. |
| Expected Result | Mỗi controlled product image có attribute `alt`; trimmed value không rỗng. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `ATTRIBUTE_OR_CLASS`, `COUNT` |
| Automation Risks | Cần card/image locator; non-empty không đủ kết luận semantic descriptiveness. |
| Dependencies | Controlled seed response và image locator. |
| Notes | Semantic descriptive quality vẫn cần human judgement hoặc approved convention. |

### FR05-TC-005 — Price sử dụng ký hiệu đồng

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-005` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R03B |
| Objective | Xác nhận mỗi controlled product price sử dụng ký hiệu `₫`. |
| Actor | Public user |
| Preconditions | Home page tải verified seed catalog. |
| Test Data | Năm seed product names và prices. |
| Steps | 1. Mở home page. 2. Xác định price của từng controlled product. 3. Kiểm tra unit. |
| Expected Result | Mỗi controlled product price hiển thị ký hiệu `₫`. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `TEXT_OR_VALUE`, `COUNT` |
| Automation Risks | Chưa có stable card-scoped price locator. |
| Dependencies | Controlled seed response và price locator. |
| Notes | Grouping được kiểm tra riêng. |

### FR05-TC-006 — Seed prices sử dụng thousand grouping

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-006` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R03C |
| Objective | Xác nhận mỗi existing seed price được hiển thị với thousand grouping. |
| Actor | Public user |
| Preconditions | Home page tải prices `30000000`, `28000000`, `45000000`, `6000000`, và `4000000`. |
| Test Data | Chỉ verified seed prices. |
| Steps | 1. Mở home page. 2. Xác định từng seed product price. 3. Kiểm tra digit grouping. |
| Expected Result | Mỗi price được group theo hàng nghìn, không hiển thị thành một raw digit sequence liên tục. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `TEXT_OR_VALUE` |
| Automation Risks | Exact separator/locale chưa được quy định; price scoping cần stable card locator. |
| Dependencies | Verified seed prices và price locator. |
| Notes | Không tạo arbitrary numeric boundary. |

### FR05-TC-007 — Search bằng exact known product name

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-007` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R04 |
| Objective | Xác nhận search bằng một exact known product name trả về product tương ứng. |
| Actor | Public user |
| Preconditions | Controlled catalog có một product tên `iPhone 15 Pro Max`. |
| Test Data | Search keyword `iPhone 15 Pro Max`. |
| Steps | 1. Mở home page. 2. Nhập exact known name. 3. Submit bằng observed UI trigger. 4. Kiểm tra results. |
| Expected Result | Search results có product tên `iPhone 15 Pro Max`. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE`, `COUNT` |
| Automation Risks | Cần xác nhận UI trigger/locator; không assert matching semantics rộng hơn. |
| Dependencies | Controlled exact-name response và search controls. |
| Notes | Không test partial, case-insensitive, trim, prefix, debounce hoặc URL behavior. |

### FR05-TC-008 — Description-only keyword không match name search

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-008` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R04 |
| Objective | Xác nhận product không được trả về chỉ vì keyword xuất hiện trong description. |
| Actor | Public user |
| Preconditions | `xuất sắc` có trong descriptions của Samsung/AirPods và không có trong verified seed product name. |
| Test Data | Search keyword `xuất sắc`; excluded products `Samsung Galaxy S24 Ultra`, `Tai nghe AirPods Pro 2`. |
| Steps | 1. Mở home page với controlled catalog. 2. Search `xuất sắc`. 3. Kiểm tra returned product names. |
| Expected Result | Không product nào được trả về do description-only occurrence; hai products có keyword trong description không xuất hiện trong results. |
| Test Type | `NEGATIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `TEXT_OR_VALUE` |
| Automation Risks | Cần controlled catalog/result oracle; không assert empty-state presentation. |
| Dependencies | Verified seed descriptions/names và isolated response. |
| Notes | Empty-state UI là case riêng. |

### FR05-TC-009 — No-result search hiển thị empty state

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-009` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R07A |
| Objective | Xác nhận completed no-result search hiển thị observable empty state. |
| Actor | Public user |
| Preconditions | Controlled catalog xác nhận không product name nào bằng reserved no-result keyword. |
| Test Data | External input-only keyword `FR05-No-Result-7F3C`. |
| Steps | 1. Mở home page. 2. Search reserved keyword. 3. Chờ search hoàn tất. 4. Kiểm tra result region. |
| Expected Result | Observable empty state biểu thị không có search results; không result product card nào hiển thị. |
| Test Type | `NEGATIVE` |
| Priority | `HIGH` |
| Automation Suitability | `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION` |
| Assertion Candidates | `VISIBILITY_OR_HIDDEN_STATE`, `COUNT` |
| Automation Risks | Current implementation chưa có approved empty-state region, copy hoặc stable locator. |
| Dependencies | No-result input và observable empty-state contract. |
| Notes | Không assert exact message. |

### FR05-TC-010 — Plain keyword được hiển thị như text

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-010` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R05 |
| Objective | Xác nhận plain search keyword được phản chiếu như text trong search UI. |
| Actor | Public user |
| Preconditions | Search UI hiển thị submitted keyword. |
| Test Data | External input-only keyword `FR05 Plain Keyword`. |
| Steps | 1. Mở home page. 2. Submit keyword. 3. Kiểm tra keyword-display region. |
| Expected Result | `FR05 Plain Keyword` hiển thị như text trong keyword-display region. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Keyword region thiếu stable semantic/test-id locator. |
| Dependencies | Search controls và scoped keyword-display region. |
| Notes | Không thêm product-result expectation. |

### FR05-TC-011 — HTML formatting keyword vẫn là text

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-011` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R05, SEC-04 |
| Objective | Xác nhận formatting markup trong user input không tạo DOM markup. |
| Actor | Public user |
| Preconditions | Có isolated search environment và scoped keyword-display region. |
| Test Data | External input-only keyword `<b>FR05 HTML Keyword</b>`. |
| Steps | 1. Submit keyword nguyên văn. 2. Kiểm tra displayed text và descendant elements trong keyword region. |
| Expected Result | Input được biểu diễn như safe text; không tạo input-derived `<b>` element và không làm keyword bold do submitted HTML. |
| Test Type | `EDGE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `TEXT_OR_VALUE`, `COUNT`, `ATTRIBUTE_OR_CLASS` |
| Automation Risks | DOM scope phải loại legitimate unrelated `<b>` elements. |
| Dependencies | Scoped keyword region và controlled product response. |
| Notes | Giữ nguyên requirement dù current implementation không an toàn. |

### FR05-TC-012 — Event-handler markup không thực thi

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-012` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R05, SEC-04 |
| Objective | Xác nhận event-handler markup trong user input không thực thi và không tạo executable DOM. |
| Actor | Public user |
| Preconditions | Có isolated search environment; future automation có thể observe dialog/page events. |
| Test Data | External input-only keyword `<img src=x onerror=alert('FR05-XSS')>`. |
| Steps | 1. Attach event observation. 2. Submit keyword nguyên văn. 3. Kiểm tra events và keyword-region DOM. |
| Expected Result | Không có dialog hoặc input-triggered execution; không tạo input-derived `img[onerror]`; reflected input, nếu hiển thị, là safe text. |
| Test Type | `EDGE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `ATTRIBUTE_OR_CLASS` |
| Automation Risks | Cần reliable event observation và narrow DOM scope. |
| Dependencies | Dialog/page listener và controlled response. |
| Notes | Không claim execution result trong design phase. |

### FR05-TC-013 — Loading state hiển thị khi product data đang pending

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-013` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R06 |
| Objective | Xác nhận loading state observable trước khi product-list response hoàn tất và kết thúc sau completion. |
| Actor | Public user |
| Preconditions | Có thể hold/release product-list response mà không thay thế frontend. |
| Test Data | Controlled delayed `GET /api/products` response; không dùng fixed delay duration. |
| Steps | 1. Hold product response. 2. Mở home page. 3. Kiểm tra UI khi pending. 4. Release response. 5. Kiểm tra UI sau completion. |
| Expected Result | Khi data pending, observable loading state hiển thị; sau completion, UI rời loading state và hiển thị listing hoặc empty state theo response data. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION` |
| Assertion Candidates | `STATE_TRANSITION`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Current SUT không có loading UI/locator; exact copy chưa được quy định. |
| Dependencies | Narrow response hold/release và approved loading-state contract. |
| Notes | Requirement đã confirmed; implementation missing/nonconforming. |

### FR05-TC-014 — Home page có đúng một semantic h1

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-014` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R08 |
| Objective | Xác nhận home document có đúng một `<h1>`. |
| Actor | Public user |
| Preconditions | Public home page mở ở normal non-empty catalog state. |
| Test Data | None; seed catalog là environment setup, không phải business test data. |
| Steps | 1. Mở home page. 2. Chờ initial loading hoàn tất. 3. Đếm toàn bộ semantic `<h1>` elements. |
| Expected Result | Home document có đúng một `<h1>` element. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_SUITABLE` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Hidden/portal DOM phải được tính nhất quán. |
| Dependencies | Public home route. |
| Notes | Current implementation có thể lộ discrepancy; không được làm yếu assertion. |

### FR05-TC-015 — Empty state có icon hoặc illustration

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-015` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R07B |
| Objective | Xác nhận no-result empty state có icon hoặc illustration. |
| Actor | Public user |
| Preconditions | No-result search hoàn tất và empty-state region observable. |
| Test Data | External input-only keyword `FR05-No-Result-7F3C`. |
| Steps | 1. Tạo completed no-result search. 2. Xác định empty-state region. 3. Kiểm tra visual content. |
| Expected Result | Empty-state region có ít nhất một icon hoặc illustration biểu thị empty condition. |
| Test Type | `NEGATIVE` |
| Priority | `MEDIUM` |
| Automation Suitability | `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION` |
| Assertion Candidates | `COUNT`, `VISIBILITY_OR_HIDDEN_STATE`, `ATTRIBUTE_OR_CLASS` |
| Automation Risks | Current implementation không có empty-state region/icon contract. |
| Dependencies | Observable empty-state container và icon/illustration locator. |
| Notes | Exact icon artwork chưa được quy định. |

### FR05-TC-016 — Empty state có friendly message

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-016` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R07C |
| Objective | Xác nhận no-result empty state có non-empty human-facing message. |
| Actor | Public user |
| Preconditions | No-result search hoàn tất và empty-state region observable. |
| Test Data | External input-only keyword `FR05-No-Result-7F3C`. |
| Steps | 1. Tạo completed no-result search. 2. Xác định empty-state region. 3. Kiểm tra message content. |
| Expected Result | Empty-state region hiển thị visible, non-empty message truyền đạt empty condition cho public user. |
| Test Type | `NEGATIVE` |
| Priority | `MEDIUM` |
| Automation Suitability | `NOT_AUTOMATABLE_WITH_CURRENT_INFORMATION` |
| Assertion Candidates | `TEXT_OR_VALUE`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | “Friendly” semantic quality và exact copy chưa có approved oracle; current UI không có empty state. |
| Dependencies | Observable empty-state region/message locator. |
| Notes | Automation có thể verify visible non-empty text; tone vẫn có thể cần human judgement. |

### FR05-TC-017 — Product listing sử dụng grid layout

| Field | Value |
| --- | --- |
| Test Case ID | `FR05-TC-017` |
| Feature ID | `FR-05` |
| Requirement ID | FR05-R01 |
| Objective | Xác nhận product listing được trình bày bằng grid layout. |
| Actor | Public user |
| Preconditions | Public home page tải verified non-empty seed catalog; product-listing container có thể được xác định ổn định. |
| Test Data | Năm verified seed products dùng làm environment để listing có nhiều product cards. |
| Steps | 1. Mở home page với verified seed catalog. 2. Chờ listing hoàn tất tải. 3. Xác định product-listing container. 4. Kiểm tra computed layout mode của container. |
| Expected Result | Product-listing container có computed CSS `display` bằng `grid`; assertion không yêu cầu viewport, số cột hoặc class name cụ thể. |
| Test Type | `POSITIVE` |
| Priority | `HIGH` |
| Automation Suitability | `AUTOMATION_POSSIBLE_WITH_SETUP` |
| Assertion Candidates | `ATTRIBUTE_OR_CLASS`, `COUNT`, `VISIBILITY_OR_HIDDEN_STATE` |
| Automation Risks | Cần approved stable locator cho product-listing container; không được phụ thuộc Tailwind class hoặc generated hierarchy. |
| Dependencies | Verified non-empty seed catalog và stable listing-container locator. |
| Notes | Atomic layout objective; không lặp lại catalog completeness/count của FR05-TC-001 và không assert responsive column count. |
