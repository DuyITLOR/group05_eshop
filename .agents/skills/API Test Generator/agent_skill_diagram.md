# SƠ ĐỒ THIẾT KẾ KIẾN TRÚC AGENT SKILL (AI-DRIVEN API TEST GENERATOR)

**Sinh viên thực hiện:** Ngô Thế Đạt - MSSV: 23127340  
**Môn học:** Software Testing (HW06 – API Testing)  
**Hệ thống (SUT):** EShop Backend API  

---

## 1. Sơ đồ Kiến trúc & Quy trình 2 Giai đoạn (2-Phase Interactive Flowchart)

```mermaid
flowchart TD
    %% ==========================================
    %% GIAI ĐOẠN 1: THIẾT KẾ & XUẤT MARKDOWN
    %% ==========================================
    subgraph Phase1 ["GIAI ĐOẠN 1: THIẾT KẾ & XUẤT TÀI LIỆU MARKDOWN (AI AGENT)"]
        direction TB
        
        subgraph Input_Layer ["1. Input & Context"]
            A1["Tài liệu Đặc tả API<br>(api_specification.md)"]
            A2["Tài liệu Nghiệp vụ<br>(README.md / FR-01..19)"]
            A3["Yêu cầu Endpoint Mục tiêu<br>(VD: POST /api/register)"]
        end

        subgraph Parsing_Layer ["2. Spec Parser & Extractor"]
            B1["Trích xuất Params, Types, Headers"]
            B2["Trích xuất Response Status & Schemas"]
            B3["Trích xuất Business Rules & Constraints"]
        end

        subgraph Gate_Layer ["3. Anti-Hallucination & Applicability Gate"]
            C1{"Có tham số thích hợp<br>để chia phân vùng?"}
            C2{"Có miền định lượng<br>có thứ tự (Min/Max)?"}
            C3{"Có máy trạng thái /<br>bộ đếm nội tại?"}
            C4["Lựa chọn Security Targets (SEC-01..07)"]
            C5["Xác định Schema & Header Rules"]
        end

        subgraph Engine_Layer ["4. Test Design Engine"]
            D1["Nhóm A: Domain Testing (EP)"]
            D2["Nhóm B: 3-Point BVA"]
            D3["Nhóm C: State Transition"]
            D4["Nhóm D: Security Testing"]
            D5["Nhóm E: Schema Validation"]
        end

        subgraph Markdown_Output ["5. Xuất Tài liệu Markdown (>= 35 TCs)"]
            E1["Bảng Test Cases Chi Tiết"]
            E2["Khung Bảng Audit (VALID/INVALID/INCOMPLETE)"]
            E3["Khung Bảng Extend (>= 5 TCs + Root Cause)"]
        end

        Input_Layer --> Parsing_Layer --> Gate_Layer
        
        C1 -- Có --> D1
        C1 -- Không --> D1_Skip["Ghi rõ: Không áp dụng EP"]
        C2 -- Có --> D2
        C2 -- Không --> D2_Skip["Ghi rõ: Không áp dụng BVA"]
        C3 -- Có --> D3
        C3 -- Không --> D3_Skip["Ghi rõ: Không áp dụng State"]
        C4 --> D4
        C5 --> D5

        D1 & D2 & D3 & D4 & D5 & D1_Skip & D2_Skip & D3_Skip --> Markdown_Output
    end

    %% ==========================================
    %% CHỐT CHẶN: CON NGƯỜI THẨM ĐỊNH
    %% ==========================================
    subgraph Human_Checkpoint ["⏸️ CHỐT CHẶN: CON NGƯỜI THẨM ĐỊNH (HUMAN REVIEW GATE)"]
        F1["Sinh viên duyệt kỹ từng Test Case"]
        F2["Sinh viên điền Bảng Audit"]
        F3["Sinh viên bổ sung >= 5 TCs Extend"]
        F4["Sinh viên chốt file MD và yêu cầu tạo JSON"]
    end

    Phase1 -->|Xuất duy nhất file .md & DỪNG LẠI| Human_Checkpoint

    %% ==========================================
    %% GIAI ĐOẠN 2: SINH JSON & CHẠY NEWMAN
    %% ==========================================
    subgraph Phase2 ["GIAI ĐOẠN 2: SINH POSTMAN COLLECTION & CHẠY THỰC THI (AI AGENT)"]
        direction TB
        G1["Đọc file Markdown đã qua Human Review"]
        G2["Sinh Postman Collection v2.1.0 JSON"]
        G3["Nhúng Pre-request Header: X-Student-Id"]
        G4["Tự động sinh Test Script Assertions (pm.test)"]
        G5["Sinh Postman Environment JSON"]
        G6["Thực thi Newman CLI & Xuất HTML Report"]
        G7["Tổng hợp Báo cáo Kết quả & Báo lỗi (Bugs)"]

        G1 --> G2 --> G3 --> G4 --> G5 --> G6 --> G7
    end

    Human_Checkpoint -->|Yêu cầu tạo JSON| Phase2
```

---

## 2. Giải thích Các Quyết định Thiết kế Kiến trúc (Design Decisions)

1. **Phân tách 2 Giai đoạn độc lập:**
   * **Giai đoạn 1:** AI hỗ trợ phân tích và thiết kế test case, xuất ra tài liệu Markdown.
   * **Chốt chặn Human Gate:** Dừng lại bắt buộc để sinh viên làm chủ chất lượng kiểm thử, thực hiện Audit và Extend.
   * **Giai đoạn 2:** Chỉ khi có lệnh từ sinh viên, AI mới chuyển đổi bộ test case đã duyệt thành file Postman JSON và thực thi với Newman.
2. **Khối Anti-Hallucination Gate:**
   * Đảm bảo tính trung thực khoa học, chỉ áp dụng kỹ thuật khi có cơ sở trong tài liệu đặc tả, không tự bịa đặt dữ liệu.
3. **Tuân thủ quy định Anti-Cheat:**
   * Tự động nhúng mã định danh sinh viên `X-Student-Id: Ngô Thế Đạt - 23127340` vào mọi request Postman.
