import { test, expect } from '@playwright/test';
import testData from '../test_data/FR03_test_data.json' with { type: 'json' };

// Run tests in serial mode to avoid SQLite token overwrites across parallel workers
test.describe.configure({ mode: 'serial' });

test.describe('FR03 - Quên mật khẩu & Đặt lại mật khẩu (Data-Driven Tests)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/forgot-password');
  });

  for (const tc of testData) {
    test(`${tc.id}: ${tc.title}`, async ({ page }) => {
      // Pattern 1 Assertion: Verify page header is visible
      const heading = page.getByRole('heading', { name: 'Quên Mật Khẩu' });
      await expect(heading).toBeVisible();

      let dialogMessage = '';
      page.on('dialog', (dialog) => {
        dialogMessage = dialog.message();
        dialog.accept().catch(() => {});
      });

      if (tc.step === 1) {
        // Step 1: Lấy mã OTP
        const emailInput = page.locator('input[type="text"]');
        const submitBtn = page.getByRole('button', { name: 'Lấy mã OTP' });

        if (tc.email !== '') {
          await emailInput.fill(tc.email);
          // Pattern 2 Assertion: Check input value
          await expect(emailInput).toHaveValue(tc.email);
        }

        await submitBtn.click();

        if (tc.expected === 'otp_generated') {
          // Successful OTP generation transitions to Step 2
          const otpMessageDiv = page.locator('.bg-green-100');
          // Pattern 3 Assertion: DOM text content assertion
          await expect(otpMessageDiv).toContainText('Mã OTP của bạn là:');
        } else if (tc.expected === 'alert_error') {
          await page.waitForTimeout(500);
          // Pattern 4 Assertion: Alert dialog message assertion
          expect(dialogMessage).toContain(tc.expectedMessage);
        } else if (tc.expected === 'invalid_email' || tc.expected === 'required_field') {
          // Check HTML5 validation / form handling (page stays in Step 1)
          await expect(submitBtn).toBeVisible();
        }
      } else if (tc.step === 2) {
        // Step 2: Đặt lại mật khẩu
        // First complete Step 1 to generate OTP and transition to Step 2
        const emailInput = page.locator('input[type="text"]');
        await emailInput.fill(tc.email);
        await page.getByRole('button', { name: 'Lấy mã OTP' }).click();

        const otpMessageDiv = page.locator('.bg-green-100');
        await expect(otpMessageDiv).toBeVisible();
        const messageText = await otpMessageDiv.textContent();

        let actualOtp = tc.otp;
        if (tc.otp === 'auto') {
          const match = messageText?.match(/\d+/);
          actualOtp = match ? match[0] : '';
        }

        const otpInput = page.locator('input[type="text"]');
        const newPasswordInput = page.locator('input[type="password"]');

        if (actualOtp !== '') {
          await otpInput.fill(actualOtp);
          // Pattern 2 Assertion: Form value assertion
          await expect(otpInput).toHaveValue(actualOtp);
        }

        if (tc.newPassword !== '') {
          await newPasswordInput.fill(tc.newPassword);
        }

        const resetBtn = page.getByRole('button', { name: 'Đặt lại mật khẩu' });
        await resetBtn.click();

        if (tc.expected === 'reset_success') {
          await page.waitForTimeout(500);
          // Pattern 4 Assertion: Alert message verification
          expect(dialogMessage).toContain('Đổi mật khẩu thành công!');
          // Pattern 5 Assertion: Navigation URL assertion
          await expect(page).toHaveURL(/.*login/);
        } else if (tc.expected === 'alert_error') {
          await page.waitForTimeout(500);
          expect(dialogMessage).toContain(tc.expectedMessage);
        } else if (tc.expected === 'mismatch_password' || tc.expected === 'required_field') {
          await expect(resetBtn).toBeVisible();
        }
      }
    });
  }
});
