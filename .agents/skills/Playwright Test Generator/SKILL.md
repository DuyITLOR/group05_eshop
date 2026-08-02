---
name: Playwright Test Generator
description: Tự động sinh Playwright automation test script (.spec.js) và file test data (.json) chuẩn data-driven cho web frontend. Hỗ trợ 2 chế độ (từ test cases có sẵn hoặc tự thiết kế 12+ test cases). Đảm bảo dùng 3+ assertion patterns khác nhau và nhúng thông tin Student ID vào Playwright Report.
---

# Playwright Test Generator Skill

Skill này hướng dẫn Agent tự động sinh ra các file test script Playwright (`.spec.js`) và file dữ liệu test (`.json`) cho dự án web frontend, tuân thủ 100% các tiêu chuẩn kiểm thử tự động của bài HW04.

---

## 1. Yêu cầu tuân thủ (Core Requirements Checklist)

Mọi test script được sinh ra bởi skill này BẮT BUỘC phải thỏa mãn các điều kiện sau:

1. **Cấu trúc lưu trữ file:**
   - Script test: `playwright/tests/<Feature_ID>.spec.js` (Ví dụ: `playwright/tests/FR03.spec.js`)
   - Test data: `playwright/test_data/<Feature_ID>.json` (Ví dụ: `playwright/test_data/FR03.json`)
2. **Data-Driven Testing (DDT):**
   - Không được hardcode dữ liệu đầu vào trong file `.spec.js`.
   - File `.spec.js` phải import dữ liệu từ file `.json` và lặp qua các test case bằng `for...of` hoặc `testData.forEach(...)`.
3. **Đa dạng Assertion (Tối thiểu 3 Assertion Patterns):**
   - Ít nhất 3 dạng assertion khác nhau của Playwright trong bộ test suite, ví dụ:
     - `await expect(page).toHaveURL(/.../);` (Check URL/Navigation)
     - `await expect(locator).toBeVisible();` (Check sự xuất hiện phần tử)
     - `await expect(locator).toContainText('...');` / `toHaveText('...')` (Check nội dung văn bản)
     - `await expect(locator).toBeDisabled();` / `toBeEnabled();` (Check trạng thái phần tử)
4. **Nhúng Thông tin Sinh viên (Student ID Audit):**
   - Mặc định Student ID: `23127340`.
   - Thêm annotation vào từng test case:
     ```javascript
     test.info().annotations.push({ type: 'Run by', description: '23127340' });
     ```
   - Thêm tiền tố `[Run by: 23127340]` vào mô tả `test.describe` hoặc `test(...)` để hiển thị trực quan trong Playwright HTML Report.
5. **Số lượng Test Cases (Tối thiểu 12 Test Cases):**
   - Bộ test phải bao phủ đủ cả **Positive cases**, **Negative cases**, và **Edge cases** (tổng số test cases >= 12).
6. **Hỗ trợ 3 Trình duyệt:**
   - Viết locator chuẩn (dùng `getByRole`, `getByLabel`, `getByTestId`, `getByPlaceholder`) đảm bảo chạy mượt mà trên Chromium, Firefox và WebKit.

---

## 2. Quy trình thực hiện (Execution Workflow)

Agent sẽ xác định chế độ làm việc dựa trên yêu cầu của người dùng:

### 🔵 CHẾ ĐỘ 1: Input ĐÃ CÓ SẴN Test Cases
*(Người dùng cung cấp danh sách test cases dạng văn bản, bảng, hoặc đường dẫn file test case)*

1. **Phân tích Input:** Đọc danh sách test cases do người dùng cung cấp.
2. **Tạo File Data (`.json`):** Chuyển đổi toàn bộ dữ liệu kiểm thử (inputs, expected result, type, description) vào `playwright/test_data/<Feature_ID>.json`.
3. **Tạo Script Test (`.spec.js`):** Sinh file `playwright/tests/<Feature_ID>.spec.js` sử dụng data-driven từ file `.json`.

---

### 🟢 CHẾ ĐỘ 2: Input CHƯA CÓ Test Cases
*(Người dùng chỉ cung cấp đặc tả chức năng, tên Feature, hoặc mã nguồn giao diện)*

1. **Thiết kế Test Cases (Tối thiểu 12 cases):**
   - Phân tích yêu cầu chức năng (FR).
   - Thiết kế tối thiểu 12 test cases với tỉ lệ hợp lý:
     - **Positive (4-5 cases):** Luồng thành công chính, luồng phụ thành công.
     - **Negative (4-5 cases):** Để trống trường bắt buộc, nhập sai định dạng, dữ liệu không tồn tại.
     - **Edge Cases (3-4 cases):** Ký tự đặc biệt, độ dài tối đa/tối thiểu, khoảng trắng đầu/cuối, nhấp đúp submit.
   - Hiển thị danh sách 12 test cases dưới dạng bảng Markdown cho người dùng xem trước.
2. **Tạo File Data (`.json`):** Lưu trữ dữ liệu của 12+ test cases vào `playwright/test_data/<Feature_ID>.json`.
3. **Tạo Script Test (`.spec.js`):** Sinh file `playwright/tests/<Feature_ID>.spec.js` đọc dữ liệu từ file `.json`.

---

## 3. Mẫu Cấu Trúc Code Chuẩn (Code Templates)

### Mẫu File Test Data (`playwright/test_data/FR03.json`)
```json
[
  {
    "id": "TC_FR03_01",
    "type": "positive",
    "description": "Gửi yêu cầu đặt lại mật khẩu với email hợp lệ",
    "email": "user@example.com",
    "expectedSuccess": true,
    "expectedMessage": "Mã xác thực đã được gửi"
  },
  {
    "id": "TC_FR03_02",
    "type": "negative",
    "description": "Gửi yêu cầu với email không đúng định dạng",
    "email": "invalid-email",
    "expectedSuccess": false,
    "expectedMessage": "Email không hợp lệ"
  }
]
```

### Mẫu File Script Test (`playwright/tests/FR03.spec.js`)
```javascript
import { test, expect } from '@playwright/test';
import testData from '../test_data/FR03.json';

test.describe('[Run by: 23127340] FR-03: Forgot Password & Password Reset', () => {
  for (const data of testData) {
    test(`[${data.id}] ${data.description}`, async ({ page }) => {
      // Nhúng metadata Student ID cho HTML Report
      test.info().annotations.push({ type: 'Run by', description: '23127340' });
      test.info().annotations.push({ type: 'Test Type', description: data.type });

      // 1. Điều hướng đến trang
      await page.goto('/forgot-password');

      // 2. Điền dữ liệu test (Data-driven)
      if (data.email !== undefined) {
        await page.getByPlaceholder('Nhập email của bạn').fill(data.email);
      }

      // 3. Thực hiện hành động
      await page.getByRole('button', { name: 'Gửi yêu cầu' }).click();

      // 4. Assertions (Đa dạng 3+ assertion patterns)
      if (data.expectedSuccess) {
        // Pattern 1: Check URL navigation
        await expect(page).toHaveURL(/\/reset-password/);
        // Pattern 2: Check Success message text
        await expect(page.locator('.toast-success')).toContainText(data.expectedMessage);
      } else {
        // Pattern 3: Check Element visibility & Error message text
        const errorAlert = page.locator('.error-message');
        await expect(errorAlert).toBeVisible();
        await expect(errorAlert).toHaveText(data.expectedMessage);
      }
    });
  }
});
```

---

## 4. Ghi chú khi thực thi (Execution Rules)
- Sử dụng các locators bền vững (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId`). Tránh bám chặt vào CSS class thay đổi liên tục.
- Không dùng `page.waitForTimeout()` trừ khi cực kỳ bắt buộc. Hãy tận dụng cơ chế Auto-waiting và `expect(...)` của Playwright.
- Nếu người dùng yêu cầu chèn comment "Review lỗi AI" để chuẩn bị cho Task 2 (quay video), hãy chèn dạng comment `// [AI Review Note]: ...` giải thích lỗi ban đầu và đoạn code đã sửa.
