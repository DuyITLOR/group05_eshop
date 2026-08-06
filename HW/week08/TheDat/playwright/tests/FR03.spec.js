import { test, expect } from '@playwright/test';
import testData from '../test_data/FR03.json' with { type: 'json' };

// ==============================================================================================
// [AI REVIEW FIX - HUMAN REVIEW & AUDIT LOG]:
//
// 1. CẤU HÌNH MODE SERIAL (MODE CHẠY TEST CASE):
//    - AI LÀM SAI: Tự động thêm `test.describe.configure({ mode: 'serial' });`. Khi 1 test case bị FAILED, Playwright lập tức ngắt (skip) toàn bộ các test case phía sau.
//    - HUMAN FIX: Loại bỏ cấu hình mode 'serial', cho phép Playwright thực thi độc lập toàn bộ các test case trên mọi trình duyệt để thu thập báo cáo HTML Report đầy đủ.
//
// 2. ASSERTION ĐỐI SOÁT MÃ OTP (SRS REQUIREMENT FR-03):
//    - AI LÀM SAI: Hạ tiêu chuẩn kiểm tra OTP xuống `/^\d{4,6}$/` cho tất cả kịch bản để tránh bị lỗi do SUT Backend sinh OTP 4 chữ số, đồng thời đánh đồng kiểm tra OTP cho cả EP và BVA.
//    - HUMAN FIX: Phân loại rõ ràng theo `tc.type`: đối với EP (`tc.type === 'EP'`) kiểm tra nghiêm ngặt `/^\d{6}$/` theo đúng SRS để bắt Bug SUT; đối với BVA (`tc.type === 'BVA'`) trích xuất OTP `/^\d+$/` để không làm gián đoạn luồng kiểm thử giá trị biên của Mật khẩu/Email.
//
// 3. ASSERTION GỢI MỞ KẾT QUẢ KIỂM THỬ (EXPECTED MATCHING FALLBACK):
//    - AI LÀM SAI: Dùng biểu thức Regex OR nới lỏng `/Đổi mật khẩu thành công!|Mật khẩu quá yếu/` cho `reset_success` và `${tc.expectedMessage}|...` cho `alert_error` để hợp lệ hóa kết quả sai của SUT.
//    - HUMAN FIX: Loại bỏ hoàn toàn chuỗi nới lỏng OR; bắt buộc `reset_success` phải chứa đúng `'Đổi mật khẩu thành công!'` + `toHaveURL(/.*login/)`, và `alert_error` phải chứa đúng `tc.expectedMessage`. Nếu SUT phản hồi sai, test case sẽ FAILED để ghi nhận Bug.
//
// 4. CHUẨN HÓA DỮ LIỆU MẬT KHẨU HỢP LỆ VÀ PHÁT HIỆN BUG SUT REGEX:
//    - AI LÀM SAI: Tạo dữ liệu mật khẩu mẫu chứa khoảng trắng hoặc thiếu ký tự đặc biệt thực sự.
//    - HUMAN FIX: Điều chỉnh dữ liệu test trong FR03.json về chuẩn mật khẩu hợp lệ (bắt buộc chứa ký tự đặc biệt thực sự như `NewPass!1` và KHÔNG chứa khoảng trắng). Ghi nhận Bug SUT cài đặt Regex lỗi `/(?=.*\s)[A-Za-z\d\s]{8,}$/`.
//
// ==============================================================================================
// [TIÊU CHUẨN XÁC ĐỊNH GIÁ TRỊ BIÊN CHO EMAIL VÀ MẬT KHẨU (BVA STANDARDS)]:
//
// A. TIÊU CHUẨN ĐỘ DÀI EMAIL (RFC 5321 & RFC 3696 STANDARD):
//    1. Biên dưới (Min length):
//       - Chuẩn RFC 5321/3696 quy định cấu trúc Email ngắn nhất hợp lệ là 5 ký tự (Ví dụ: `a@b.c` -> 1 ký tự local, `@`, 1 ký tự domain, `.`, 1 ký tự TLD).
//       - Các kịch bản BVA Email biên dưới: `a@.c` (Lỗi định dạng - 5 ký tự), `a@b.c` (Min hợp lệ - 5 ký tự), `ab@b.c` (Min + 1 hợp lệ - 6 ký tự).
//    2. Biên trên (Max length):
//       - Chuẩn RFC 5321 (Section 4.5.3.1) & RFC 3696 (Section 3) quy định độ dài tối đa của địa chỉ Email là 254 ký tự.
//       - Các kịch bản BVA Email biên trên: 253 ký tự (Max - 1 hợp lệ), 254 ký tự (Max hợp lệ chuẩn RFC), 255 ký tự (Max + 1 -> Không hợp lệ).
//
// B. TIÊU CHUẨN ĐỘ DÀI MẬT KHẨU (SRS REQUIREMENT & OWASP / DB VARCHAR(255) STANDARD):
//    1. Biên dưới (Min length):
//       - Đặc tả SRS (FR-01/FR-03 trong README.md) quy định: "Mật khẩu tối thiểu 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 ký tự đặc biệt".
//       - Các kịch bản BVA Mật khẩu biên dưới: 7 ký tự (Min - 1 -> Không hợp lệ / "Mật khẩu quá yếu"), 8 ký tự (Min hợp lệ), 9 ký tự (Min + 1 hợp lệ).
//    2. Biên trên (Max length):
//       - Theo tiêu chuẩn thiết kế CSDL Web App (Kiểu dữ liệu VARCHAR(255) chuẩn) và OWASP Password Guidelines (giới hạn độ dài an toàn từ 64-256 ký tự).
//       - Các kịch bản BVA Mật khẩu biên trên: 254 ký tự (Max - 1 hợp lệ), 255 ký tự (Max hợp lệ biên trên DB), 256 ký tự (Max + 1 -> Không hợp lệ / "Mật khẩu quá yếu").
//
// ==============================================================================================
// [MAPPING TRƯỜNG `EXPECTED` (FR03.json) -> ASSERTION PATTERNS TRONG FR03.spec.js]:
//  - "otp_generated"    : Kích hoạt Pattern 1 (toBeVisible) & Pattern 4 (toContainText & toMatch Regex OTP)
//  - "alert_error"      : Kích hoạt Pattern 5 (Dialog Message Polling - toContain / toMatch)
//  - "reset_success"    : Kích hoạt Pattern 5 (Dialog Message Polling) & Pattern 6 (toHaveURL /.*login/)
//  - "invalid_email"    : Kích hoạt Pattern 1 (toBeVisible - Giữ người dùng ở Bước 1)
//  - "required_field"   : Kích hoạt Pattern 1 (toBeVisible - Giữ người dùng ở Bước 1 / Bước 2)
//  - "mismatch_password": Kích hoạt Pattern 1 (toBeVisible - Giữ người dùng ở Bước 2)
// ==============================================================================================

test.describe('[Run by: 23127340] FR-03: Quên mật khẩu & Đặt lại mật khẩu (Data-Driven Tests)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  for (const tc of testData) {
    test(`[${tc.id}] ${tc.title}`, async ({ page }) => {
      // Nhúng metadata Student ID và Test Metadata vào HTML Report
      test.info().annotations.push({ type: 'Run by', description: '23127340' });
      test.info().annotations.push({ type: 'Test Case ID', description: tc.id });
      test.info().annotations.push({ type: 'Type', description: tc.type || 'EP' });
      test.info().annotations.push({ type: 'Step', description: `Bước ${tc.step}` });

      // Pattern 1 Assertion: Kiểm tra sự xuất hiện của tiêu đề trang (Element Visibility)
      const heading = page.getByRole('heading', { name: 'Quên Mật Khẩu' });
      await expect(heading).toBeVisible();

      let dialogMessage = '';
      page.on('dialog', (dialog) => {
        dialogMessage = dialog.message();
        dialog.accept().catch(() => { });
      });

      if (tc.step === 1) {
        // Step 1: Lấy mã OTP
        const emailInput = page.locator('input[type="text"]');
        const submitBtn = page.getByRole('button', { name: 'Lấy mã OTP' });

        // Pattern 2 Assertion: Kiểm tra trạng thái nút bấm (Element State - Enabled/Visible)
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toBeEnabled();

        if (tc.email !== '') {
          await emailInput.fill(tc.email);
          // Pattern 3 Assertion: Kiểm tra giá trị ô nhập liệu (Input Value check)
          await expect(emailInput).toHaveValue(tc.email);
        }

        await submitBtn.click();

        // --------------------------------------------------------------------------------------
        // HIGHLIGHT: [EXPECTED BRANCHES - BƯỚC 1]
        // --------------------------------------------------------------------------------------
        if (tc.expected === 'otp_generated') {
          // [EXPECTED: 'otp_generated'] -> Kích hoạt PATTERN 1 (toBeVisible) & PATTERN 4 (toContainText & toMatch Regex)
          const otpMessageDiv = page.locator('.bg-green-100');
          await expect(otpMessageDiv).toBeVisible(); // Pattern 1 Assertion: Visibility check
          await expect(otpMessageDiv).toContainText('Mã OTP của bạn là:'); // Pattern 4 Assertion: Text content check

          // Kiểm tra mã OTP sinh ra
          const messageText = await otpMessageDiv.textContent();
          const match = messageText?.match(/\d+/);
          const generatedOtp = match ? match[0] : '';
          if (tc.type === 'EP') {
            expect(generatedOtp).toMatch(/^\d{6}$/); // Pattern 4 Assertion: Đối soát nghiêm ngặt 6 chữ số theo SRS cho EP
          } else {
            expect(generatedOtp).toMatch(/^\d+$/); // Với BVA: Chỉ trích xuất mã OTP chữ số để phục vụ kịch bản kiểm thử biên
          }
        } else if (tc.expected === 'alert_error') {
          // [EXPECTED: 'alert_error'] -> Kích hoạt PATTERN 5 (Dialog Message Polling Assertion)
          await expect.poll(() => dialogMessage, { timeout: 3000 }).toContain(tc.expectedMessage);
        } else if (tc.expected === 'invalid_email' || tc.expected === 'required_field') {
          // [EXPECTED: 'invalid_email' / 'required_field'] -> Kích hoạt PATTERN 1 (toBeVisible - Form validation giữ người dùng ở Bước 1)
          await expect(submitBtn).toBeVisible();
        }
      } else if (tc.step === 2) {
        // Step 2: Đặt lại mật khẩu
        // Đầu tiên hoàn thành Bước 1 để lấy OTP
        const emailInput = page.locator('input[type="text"]');
        await emailInput.fill(tc.email);

        const submitBtn = page.getByRole('button', { name: 'Lấy mã OTP' });
        await submitBtn.click();

        const otpMessageDiv = page.locator('.bg-green-100');
        await expect(otpMessageDiv).toBeVisible();
        const messageText = await otpMessageDiv.textContent();

        let actualOtp = tc.otp;
        if (tc.otp === 'auto') {
          const match = messageText?.match(/\d+/);
          actualOtp = match ? match[0] : '';
          if (tc.type === 'EP') {
            expect(actualOtp).toMatch(/^\d{6}$/); // Pattern 4 Assertion: Kiểm tra độ dài OTP 6 chữ số chuẩn SRS cho EP
          } else {
            expect(actualOtp).toMatch(/^\d+$/); // Với test case BVA (tập trung biên Mật khẩu/Email): Không chặn luồng do bug OTP của SUT
          }
        }

        const otpInput = page.locator('input[type="text"]');
        const newPasswordInput = page.locator('input[type="password"]');

        if (actualOtp !== '') {
          await otpInput.fill(actualOtp);
          // Pattern 3 Assertion: Kiểm tra giá trị OTP đã điền (Input Value check)
          await expect(otpInput).toHaveValue(actualOtp);
        }

        if (tc.newPassword !== '') {
          await newPasswordInput.fill(tc.newPassword);
        }

        const resetBtn = page.getByRole('button', { name: 'Đặt lại mật khẩu' });
        await expect(resetBtn).toBeVisible();
        await resetBtn.click();

        // --------------------------------------------------------------------------------------
        // HIGHLIGHT: [EXPECTED BRANCHES - BƯỚC 2]
        // --------------------------------------------------------------------------------------
        if (tc.expected === 'reset_success') {
          // [EXPECTED: 'reset_success'] -> Kích hoạt PATTERN 5 (Dialog Message Polling) & PATTERN 6 (toHaveURL Navigation Check)
          await expect.poll(() => dialogMessage, { timeout: 3000 }).toContain('Đổi mật khẩu thành công!');
          await expect(page).toHaveURL(/.*login/); // Pattern 6 Assertion: Page Navigation check
        } else if (tc.expected === 'alert_error') {
          // [EXPECTED: 'alert_error'] -> Kích hoạt PATTERN 5 (Dialog Message Polling Assertion)
          await expect.poll(() => dialogMessage, { timeout: 3000 }).toContain(tc.expectedMessage);
        } else if (tc.expected === 'mismatch_password' || tc.expected === 'required_field') {
          // [EXPECTED: 'mismatch_password' / 'required_field'] -> Kích hoạt PATTERN 1 (toBeVisible - Giữ người dùng ở Bước 2)
          await expect(resetBtn).toBeVisible();
        }
      }
    });
  }
});

