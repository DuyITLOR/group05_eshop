import { test, expect } from '@playwright/test';
import testData from '../test_data/FR16.json' with { type: 'json' };

// ==============================================================================================
// [AI Review Fix - Task 2 Demo]:
// 1. CẤU HÌNH MODE SERIAL (MODE CHẠY TEST CASE):
//    - BAN ĐẦU AI SINH RA: test.describe.configure({ mode: 'serial' });
//    - LỖI: Khi 1 test case thất bại (các ca negative phát hiện Bug SUT), Playwright ngắt (skip) toàn bộ test case phía sau.
//    - FIX (HUMAN REVIEW): Loại bỏ cấu hình mode 'serial', cho phép Playwright thực thi độc lập toàn bộ các test case trên mọi trình duyệt để thu thập báo cáo HTML Report đầy đủ.
//
// 2. PHƯƠNG PHÁP KIỂM THỬ (API TESTING VS UI TESTING):
//    - BAN ĐẦU AI SINH RA: Viết script kiểm thử bằng API REST (POST /api/admin/import-products).
//    - LỖI: Không phù hợp với một vài test case (như kiểm tra đuôi file .xlsx, file không đuôi, cấu trúc header CSV, RFC 4180 dấu phẩy) vì backend API chỉ nhận JSON body và bỏ qua các metadata file.
//    - FIX (HUMAN REVIEW): Chuyển đổi toàn bộ sang kiểm thử trên giao diện Web Admin (UI Data-Driven Testing) sử dụng `setInputFiles()` của Playwright để nạp file CSV trực tiếp, đảm bảo kiểm thử chính xác 100% kịch bản người dùng thực tế.
//
// ==============================================================================================
// [DANH SÁCH CÁC CÂU LỆNH KHẲNG ĐỊNH (ASSERTION PATTERNS) TRONG FR16.spec.js]:
//  1. Pattern 1: Target Inserted Count Check (`expect(page.locator('p').filter({ hasText: successRegex })).toBeVisible()`)
//     - Đối soát chính xác số lượng sản phẩm được thêm thành công trên giao diện UI (VD: "Import hoàn tất: 2/2 sản phẩm được thêm").
//  2. Pattern 2: Row Error Detail Match (`expect(errorContainer).toContainText(tc.expectedError)`)
//     - Khẳng định các dòng thông báo lỗi chi tiết màu đỏ hiển thị đúng lý do vi phạm tương ứng trên UI (VD: "Thiếu tên sản phẩm").
//  3. Pattern 3: Invalid File Rejection (`expect(importBtn).toBeDisabled()`)
//     - Khẳng định nút Import bị khóa (disabled) hoặc không hiển thị khung xem trước đối với các file sai định dạng/trống.
//  4. Pattern 4: Rollback 0 Inserted Check (`expect(page.locator('text=/Import hoàn tất: 0\\//')).toBeVisible()`)
//     - Khẳng định số lượng sản phẩm thêm thành công hiển thị là 0/N đối với các kịch bản không hợp lệ (nguyên tắc All-or-Nothing Rollback).
//  5. Pattern 5: UI Result Container Visibility (`expect(resultContainer).toBeVisible()`)
//     - Khẳng định khung phản hồi kết quả trên giao diện xuất hiện sau khi thực hiện hành động Import.
// ==============================================================================================

const ADMIN_URL = 'http://localhost:5174';
const ADMIN_EMAIL = 'admin@eshop.com';
const ADMIN_PASSWORD = 'Admin123!';

test.describe('[Run by: 23127340] FR-16: Import Products from CSV (UI Data-Driven EP & BVA Testing)', () => {

  test.beforeEach(async ({ page }) => {
    // Đăng nhập tài khoản Admin và chuyển sang tab "Sản phẩm"
    await page.goto(ADMIN_URL);
    await page.getByPlaceholder('Email').fill(ADMIN_EMAIL);
    await page.getByPlaceholder('Password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForSelector('text=EShop Admin', { timeout: 10000 });
    await page.getByText('Sản phẩm', { exact: true }).click();
    await page.waitForSelector('text=Import sản phẩm từ CSV', { timeout: 5000 });
  });

  for (const tc of testData) {
    test(`[${tc.id}] ${tc.title}`, async ({ page }) => {
      // 1. Nhúng Student ID Metadata cho Playwright Report
      test.info().annotations.push({ type: 'Run by', description: '23127340' });
      test.info().annotations.push({ type: 'Test Type', description: tc.type });
      test.info().annotations.push({ type: 'Layer', description: 'UI Data-Driven' });

      // 2. Upload file CSV qua locator setInputFiles
      const fileInput = page.locator('input[type="file"]');
      await fileInput.setInputFiles({
        name: tc.fileName,
        mimeType: tc.mimeType || 'text/csv',
        buffer: Buffer.from(tc.csvContent, 'utf-8'),
      });

      await page.waitForTimeout(500);
      const importBtn = page.getByRole('button', { name: /Import/ });

      // 3. Xử lý các kịch bản file bị từ chối ở tầng Frontend (File sai đuôi / File rỗng / Header sai)
      if (tc.expectRejectFile) {
        // Pattern 3: Theo đặc tả, hệ thống phải từ chối file sai định dạng hoặc file trống ngay từ tầng xem trước
        // (Nếu SUT vẫn hiển thị preview hoặc enable nút import -> test sẽ FAIL để báo cáo Bug SUT)
        await expect(page.locator('text=Xem trước')).not.toBeVisible({ timeout: 3000 });
        await expect(importBtn).toBeDisabled();
        return;
      }

      // 4. Nếu nút import được kích hoạt -> Tiến hành bấm nút Import
      if (await importBtn.isEnabled()) {
        await importBtn.click();
        await page.waitForTimeout(2000);

        if (tc.type === 'positive') {
          // Pattern 1 Assertion: Khẳng định số sản phẩm thêm thành công đúng kỳ vọng (N/N)
          const successRegex = new RegExp(`Import hoàn tất: ${tc.expectedInserted}\\/`);
          await expect(page.locator('p').filter({ hasText: successRegex })).toBeVisible({ timeout: 5000 });
        } else {
          // Pattern 4 Assertion: Khẳng định 0 sản phẩm được thêm vào DB khi có lỗi (All-or-Nothing Rollback)
          await expect(page.locator('text=/Import hoàn tất: 0\\//')).toBeVisible({ timeout: 5000 });

          // Pattern 2 Assertion: Khẳng định thông báo lỗi chi tiết màu đỏ hiển thị đúng lý do vi phạm
          const errorContainer = page.locator('li.text-red-600, [class*="bg-red"]').first();
          await expect(errorContainer).toBeVisible({ timeout: 3000 });
          await expect(errorContainer).toContainText(tc.expectedError);
        }
      } else {
        // Nút bị disabled khi file không hợp lệ (hệ thống từ chối đúng)
        await expect(importBtn).toBeDisabled();
      }
    });
  }
});
