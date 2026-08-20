# MÃ GIẢ THUẬT TOÁN AGENT SKILL (AI-DRIVEN API TEST GENERATOR)

**Sinh viên thực hiện:** Ngô Thế Đạt - MSSV: 23127340  
**Môn học:** Software Testing (HW06 – API Testing)  

---

## Cấu trúc Giải thuật: Quy trình 2 Giai đoạn (2-Phase Pipeline)

```text
// =============================================================================
// GIAI ĐOẠN 1: THIẾT KẾ & XUẤT TÀI LIỆU MARKDOWN (PHASE 1)
// =============================================================================
ALGORITHM Phase_1_Generate_Markdown_Test_Design(api_spec_file, sys_req_file, target_endpoint, output_md_path):
    INPUT:
        - api_spec_file: Đường dẫn file đặc tả API (api_specification.md)
        - sys_req_file: Đường dẫn file yêu cầu nghiệp vụ (README.md)
        - target_endpoint: Chuỗi định danh API cần kiểm thử (VD: "POST /api/register")
        - output_md_path: Đường dẫn file Markdown kết quả
    OUTPUT:
        - File Markdown chứa đầy đủ phân tích EP, BVA, State, Security, Schema, Audit & Extend template

    BEGIN
        // 1. Phân tích đặc tả kỹ thuật
        api_info = ParseSpecification(api_spec_file, sys_req_file, target_endpoint)
        test_suite = []

        // 2. Chốt chặn Anti-Hallucination: Đánh giá tính khả thi kỹ thuật
        // 2.1. Domain Testing (EP)
        IF HasValidInputParameters(api_info.parameters) THEN:
            FOR EACH param IN api_info.parameters:
                test_suite.AppendRange(GenerateDomainPartitions(param, api_info.business_rules))
            END FOR
        ELSE:
            LogApplicability("EP", "Không áp dụng EP do API không nhận tham số.")
        END IF

        // 2.2. Boundary Value Analysis (3-Point BVA)
        ordered_params = FilterOrderedDomains(api_info.parameters)
        IF ordered_params IS NOT EMPTY THEN:
            FOR EACH param IN ordered_params:
                // Áp dụng 3-Point BVA: {Min - 1, Min, Min + 1}
                min_val = param.min_value
                test_suite.Append(CreateBVATestCase(param, "Min - 1", min_val - 1, expected=400))
                test_suite.Append(CreateBVATestCase(param, "Min", min_val, expected=200))
                test_suite.Append(CreateBVATestCase(param, "Min + 1", min_val + 1, expected=200))
            END FOR
        ELSE:
            LogApplicability("BVA", "Không áp dụng BVA do không có miền thứ tự trong Spec. Không tự bịa biên.")
        END IF

        // 2.3. State Transition Testing
        IF HasInternalStateMachine(api_info) THEN:
            matrix = BuildStateActionMatrix(api_info.states, api_info.actions)
            FOR EACH cell IN matrix:
                test_suite.Append(CreateStateTransitionTestCase(cell))
            END FOR
        ELSE:
            LogApplicability("State Transition", "Không áp dụng do API Stateless / CRUD thuần túy.")
        END IF

        // 2.4. Security Testing (SEC-01 -> SEC-07)
        test_suite.AppendRange(GenerateSecurityTests(api_info, ["SQLi", "XSS", "DataLeak", "MassAssignment", "RateLimit"]))

        // 2.5. Schema Validation
        test_suite.AppendRange(GenerateSchemaTests(api_info.response_schemas))

        // 3. Render file Markdown theo template chuẩn
        markdown_content = RenderMarkdownTemplate(
            api_info=api_info,
            test_cases=test_suite,
            audit_template=GenerateAuditTemplate(test_suite),
            extend_template=GenerateExtendTemplate(count=5)
        )
        WriteToFile(target=output_md_path, content=markdown_content)

        // 4. DỪNG LẠI và thông báo cho người dùng
        PRINT "[Phase 1 Complete] Đã xuất file Markdown tại: " + output_md_path
        PRINT "[Waiting] Vui lòng Human Review và yêu cầu khi muốn tạo Postman Collection JSON."
        STOP
    END


// =============================================================================
// GIAI ĐOẠN 2: CHUYỂN ĐỔI SANG POSTMAN COLLECTION & CHẠY NEWMAN (PHASE 2)
// (Chỉ chạy khi có yêu cầu rõ ràng từ người dùng sau khi đã review file Markdown)
// =============================================================================
ALGORITHM Phase_2_Generate_Postman_And_Execute(reviewed_md_path, student_id, output_collection_path, output_env_path):
    INPUT:
        - reviewed_md_path: Đường dẫn file Markdown đã qua Human Review
        - student_id: Mã số sinh viên (VD: "23127340")
        - output_collection_path: Đường dẫn file Postman Collection JSON
        - output_env_path: Đường dẫn file Environment JSON
    OUTPUT:
        - File Postman Collection v2.1.0 JSON & HTML Newman Report

    BEGIN
        // 1. Đọc bộ test cases đã được duyệt từ file Markdown
        approved_test_cases = ParseReviewedMarkdown(reviewed_md_path)

        // 2. Khởi tạo Postman Collection v2.1.0
        collection = CreatePostmanCollection(name="HW06_" + approved_test_cases.endpoint_name)
        
        // 3. Nhúng Pre-request Script cấp Collection (Anti-Cheat Header)
        collection.AddCollectionPreRequestScript(
            "pm.request.headers.upsert({ key: 'X-Student-Id', value: pm.environment.get('studentId') || '" + student_id + "' });"
        )

        // 4. Chuyển đổi từng test case thành Request với Script Assertions đầy đủ
        FOR EACH tc IN approved_test_cases.list:
            req = collection.AddRequest(
                folder=tc.folder_name,
                name=tc.id + " - " + tc.title,
                method=tc.method,
                url="{{baseUrl}}" + tc.path,
                headers={"Content-Type": "application/json"},
                body=tc.body
            )
            req.AddTestScript(GeneratePostmanAssertions(tc))
        END FOR

        // 5. Khởi tạo Environment JSON
        environment = CreateEnvironment(baseUrl="http://localhost:3000", studentId=student_id)

        // 6. Ghi file JSON
        WriteToFile(target=output_collection_path, content=collection.ToJson())
        WriteToFile(target=output_env_path, content=environment.ToJson())

        // 7. Cung cấp lệnh thực thi Newman CLI
        PRINT "[Phase 2 Complete] Đã sinh Collection JSON: " + output_collection_path
        PRINT "[Command] npx newman run " + output_collection_path + " -e " + output_env_path + " --reporters cli,htmlextra --reporter-htmlextra-export report.html"
        
        RETURN "SUCCESS"
    END
```
