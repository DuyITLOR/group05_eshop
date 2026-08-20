# BÁO CÁO PHẢN BIỆN VÀ NHẬT KÝ SỬ DỤNG AI (AI CRITIQUE & AI AUDIT REPORT)

**Học phần:** Kiểm thử phần mềm (Software Testing)  
**Bài tập:** HW06 – API Testing (AI-Assisted Testing & CI/CD Integration)  
**Sinh viên thực hiện:** Ngô Thế Đạt – **MSSV:** 23127340  
**Repository GitHub:** [https://github.com/DuyITLOR/group05_eshop](https://github.com/DuyITLOR/group05_eshop)  
**Branch:** `feature/23127340`

---

## PHẦN 1: BÀN LUẬN & PHẢN BIỆN VỀ AI (AI CRITIQUE — 200–300 TỪ)

Trong quá trình đồng hành cùng AI (Gemini / Antigravity IDE) để thiết kế và kiểm thử 3 API của hệ thống EShop, em nhận thấy AI thể hiện năng lực vượt trội trong việc tự động sinh cấu trúc dữ liệu JSON, phân loại các giá trị biên (Boundary Values) và soạn thảo cú pháp kiểm thử Chai Assertion nhanh chóng. Tuy nhiên, AI bộc lộ những điểm mù nghiêm trọng khi xử lý logic nghiệp vụ phụ thuộc trạng thái (State-dependent logic) và bảo mật thực tế:

Thứ nhất, AI thường mắc lỗi thiên kiến mặc định mã nguồn backend đã được triển khai đúng theo đặc tả (Golden Standard Bias). Cụ thể, AI không tự phát hiện được lỗi công thức tính coupon bị ngược dấu làm tăng giá đơn hàng, hay lỗi vi phạm tính toàn vẹn trạng thái cho phép chuyển từ `canceled` sang `delivered`, nếu em không chủ động ép AI lập ma trận chuyển trạng thái đầy đủ 4x4. Thứ hai, AI có xu hướng bỏ qua các bước tiền xử lý dữ liệu động (Pre-request dynamic chaining), thường gán ID đơn hàng cố định dẫn đến test case bị fail do phụ thuộc dữ liệu cũ.

Bài học cốt lõi em rút ra được là: AI đóng vai trò như một trợ lý tăng tốc độ soạn thảo (Execution Accelerator), nhưng tư duy phản biện (Critical Thinking), chiến lược kiểm thử biên và việc rà soát từng bước (Step-by-step Human Review) của em vẫn là yếu tố quyết định để phát hiện các lỗi nghiệp vụ và lỗ hổng bảo mật sâu trong hệ thống.

---

## PHẦN 2: NHẬT KÝ KIỂM TOÁN SỬ DỤNG AI (AI AUDIT REPORT)

### 1. Tuyên bố sử dụng AI (Mandatory Declaration)
* **Tuyên bố:** *"Em có sử dụng công cụ AI (Gemini 2.5 / Antigravity IDE) làm trợ lý hỗ trợ trong quá trình thực hiện bài tập này."*
* **Mục đích:** Hỗ trợ phân tích đặc tả API, sinh các bộ dữ liệu kiểm thử biên, sinh mã kịch bản Postman script và hỗ trợ thiết lập cấu hình pipeline CI/CD.

### 2. Bảng nhật ký tương tác chi tiết (Interaction Log)

| Thời gian | Tác vụ (Task) | Prompt của em | Kết quả do AI sinh ra | Hành động rà soát & hiệu chỉnh của em (Human Audit) |
| :---: | :--- | :--- | :--- | :--- |
| **19/08/2026** | Phân tích API 1 (`POST /api/login`) | "Phân tích đặc tả POST /api/login, sinh danh sách test case EP và BVA bao phủ toàn bộ tham số và lỗi nghiệp vụ" | Danh sách 39 test cases bao gồm kiểm tra email, password và lockout | Em phát hiện AI nhầm lẫn thời gian khóa tài khoản là 60s (đặc tả là 30s) và đã hiệu chỉnh lại assertion; bổ sung thêm 5 test case mở rộng về SQL Injection và Case-insensitivity. |
| **19/08/2026** | Phân tích API 2 (`POST /api/apply-coupon`) | "Thiết kế test cases kiểm tra giá trị tối thiểu 300k, mã Fixed/Percent và các trường hợp bảo mật IDOR" | Danh sách 38 test cases kiểm tra mã giảm giá | Em audit lại cấu trúc JSON schema trả về, phát hiện backend bị ngược công thức giảm giá phần trăm và bổ sung 5 test case mở rộng về số thực và Replay Attack. |
| **20/08/2026** | Ma trận API 3 (`PUT /api/admin/orders/:id/status`) | "Lập ma trận chuyển trạng thái 4x4 cho các trạng thái đơn hàng và sinh test script kèm Pre-request" | Danh sách 43 test cases kiểm tra trạng thái và phân quyền Admin | Em audit lại toàn bộ 16 nhánh chuyển trạng thái bất hợp lệ, tự viết script Pre-request tự động checkout đơn hàng mới ngầm để tránh lỗi phụ thuộc dữ liệu cũ. |
| **20/08/2026** | Tích hợp CI/CD (GitHub Actions) | "Viết GitHub Actions workflow chạy Newman CLI trên Ubuntu Runner và lưu HTML Extra report" | File cấu hình workflow YAML `.github/workflows/newman-hw06-23127340.yml` | Em cấu hình thêm bước kiểm tra server health check (`curl`), thiết lập 2 bộ collection mẫu (All Pass và One Fail) để lấy minh chứng nộp bài. |
| **20/08/2026** | Thiết kế Agent Skill (G9.5) | "Thiết kế kiến trúc bộ sinh kiểm thử API tự động theo tiêu chuẩn Bloom-AI Create" | Sơ đồ khối kiến trúc và mã giả Python xử lý đa luồng | Em rà soát và chuẩn hóa thuật toán xử lý phân tích đặc tả, sinh ma trận trạng thái và đóng gói thành Postman Collection JSON v2.1.0. |
