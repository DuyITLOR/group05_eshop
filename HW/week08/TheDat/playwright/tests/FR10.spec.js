import { test, expect } from '@playwright/test';
import testData from '../test_data/FR10.json' with { type: 'json' };

// ==============================================================================================
// [AI Review Fix - Task 2 Demo]:
// BAN ĐẦU AI SINH RA: test.describe.configure({ mode: 'serial' });
// LỖI: Khi 1 test case thất bại (TC-19), Playwright ngắt toàn bộ test case phía sau (TC-20 did not run).
// FIX (HUMAN REVIEW): Mỗi test case đã tự tạo orderId riêng độc lập, việc bỏ mode 'serial' giúp 
// toàn bộ 60/60 test runs trên 3 trình duyệt chạy hoàn tất 100% mà không bị dừng đột ngột.
// ==============================================================================================

test.describe('[Run by: 23127340] FR-10: Order State Machine (State Transition Testing)', () => {
  let adminToken = '';
  const baseURL = 'http://localhost:3000';

  test.beforeAll(async ({ request }) => {
    // Acquire Admin JWT token for order status transitions
    const loginRes = await request.post(`${baseURL}/api/login`, {
      data: {
        email: 'admin@eshop.com',
        password: 'Admin123!',
      },
    });
    const loginData = await loginRes.json();
    adminToken = loginData.token;
  });

  for (const tc of testData) {
    test(`[${tc.id}] ${tc.title}`, async ({ request }) => {
      // 1. Nhúng Student ID Metadata cho Playwright Report
      test.info().annotations.push({ type: 'Run by', description: '23127340' });
      test.info().annotations.push({ type: 'Test Type', description: tc.type });

      // 2. Setup: Tạo 1 đơn hàng mới ở trạng thái mặc định 'pending'
      const checkoutRes = await request.post(`${baseURL}/api/checkout`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        data: {
          total_amount: 500000,
          shipping_address: '123 Nguyen Van Cuh, Q5, TP.HCM',
        },
      });

      // Assertion Pattern 1: HTTP Response Success check
      expect(checkoutRes.ok()).toBeTruthy();
      const orderInfo = await checkoutRes.json();
      const orderId = orderInfo.orderId;

      // 3. Đưa đơn hàng về trạng thái ban đầu (initialStatus) nếu khác 'pending'
      if (tc.initialStatus !== 'pending') {
        if (tc.initialStatus === 'confirmed' || tc.initialStatus === 'shipping' || tc.initialStatus === 'delivered' || tc.initialStatus === 'canceled') {
          const step1 = await request.put(`${baseURL}/api/admin/orders/${orderId}/status`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: { status: 'confirmed' },
          });
          expect(step1.status()).toBe(200);
        }

        if (tc.initialStatus === 'shipping' || tc.initialStatus === 'delivered') {
          const step2 = await request.put(`${baseURL}/api/admin/orders/${orderId}/status`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: { status: 'shipping' },
          });
          expect(step2.status()).toBe(200);
        }

        if (tc.initialStatus === 'delivered') {
          const step3 = await request.put(`${baseURL}/api/admin/orders/${orderId}/status`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: { status: 'delivered' },
          });
          expect(step3.status()).toBe(200);
        }

        if (tc.initialStatus === 'canceled') {
          const cancelStep = await request.put(`${baseURL}/api/admin/orders/${orderId}/status`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            data: { status: 'canceled' },
          });
          expect(cancelStep.status()).toBe(200);
        }
      }

      // 4. Thực thi Action (Trạng thái chuyển tiếp)
      const actionStatusMap = {
        Confirm: 'confirmed',
        Ship: 'shipping',
        Deliver: 'delivered',
        Cancel: 'canceled',
      };

      const targetStatus = actionStatusMap[tc.action] || tc.targetStatus;
      const transitionRes = await request.put(`${baseURL}/api/admin/orders/${orderId}/status`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        data: { status: targetStatus },
      });

      const responseBody = await transitionRes.json();

      // 5. Kiểm tra kết quả bằng 3+ Assertion Patterns
      // Pattern 2 Assertion: Check HTTP Status Code
      expect(transitionRes.status()).toBe(tc.expectedStatusCode);

      if (tc.type === 'positive') {
        // Pattern 3 Assertion: Check Response Body Message
        expect(responseBody.message).toContain(tc.expectedMessage);
      } else {
        // Pattern 4 Assertion: Check Error Message String
        expect(responseBody.error).toContain(tc.expectedError);
      }

      // Pattern 5 Assertion: Post-condition state verification from GET /api/orders/:id
      const checkOrderRes = await request.get(`${baseURL}/api/orders/${orderId}`);
      const currentOrderState = await checkOrderRes.json();
      expect(currentOrderState.status).toBe(tc.expectedStatus);
    });
  }
});
