import { test, expect } from '@playwright/test';
import testData from '../test_data/FR10.json' with { type: 'json' };

// ==============================================================================================
// [AI Review Fix - Task 2 Demo]:
// BAN ĐẦU AI SINH RA: test.describe.configure({ mode: 'serial' });
// LỖI: Khi 1 test case thất bại (TC-19), Playwright ngắt toàn bộ test case phía sau (TC-20 did not run).
// FIX (HUMAN REVIEW): Mỗi test case đã tự tạo orderId riêng độc lập, việc bỏ mode 'serial' giúp 
// toàn bộ 60/60 test runs trên 3 trình duyệt chạy hoàn tất 100% mà không bị dừng đột ngột.
//
// ==============================================================================================
// [DANH SÁCH CÁC CÂU LỆNH KHẲNG ĐỊNH (ASSERTION PATTERNS) TRONG FR10.spec.js]:
//  1. Pattern 1: HTTP Response Success Boolean Check (`expect(checkoutRes.ok()).toBeTruthy()`)
//     - Khẳng định API tạo đơn hàng khởi tạo (POST /api/checkout) phản hồi trạng thái HTTP thành công (Status 2xx).
//  2. Pattern 2: HTTP Status Code Check (`expect(transitionRes.status()).toBe(tc.expectedStatusCode)`)
//     - Đối soát chính xác mã HTTP Status Code trả về từ API chuyển trạng thái đơn hàng (200 OK vs 400 Bad Request).
//  3. Pattern 3: Response Body Success Message Check (`expect(responseBody.message).toContain(tc.expectedMessage)`)
//     - Đối với kịch bản hợp lệ ('positive'), khẳng định chuỗi phản hồi chứa đúng thông báo thành công kỳ vọng.
//  4. Pattern 4: Response Body Error Message Check (`expect(responseBody.error).toContain(tc.expectedError)`)
//     - Đối với kịch bản không hợp lệ ('negative'), khẳng định chuỗi phản hồi chứa đúng thông báo lỗi kỳ vọng.
//  5. Pattern 5: Post-Condition Database State Verification (`expect(currentOrderState.status).toBe(tc.expectedStatus)`)
//     - Gọi API GET /api/orders/:id đối soát trạng thái lưu trữ thực tế cuối cùng của đơn hàng trong CSDL khớp với expectedStatus.
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

      // Pattern 1 Assertion: Kiểm tra phản hồi HTTP khởi tạo thành công (Boolean check)
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

      // 5. Kiểm tra kết quả chuyển trạng thái (Đối soát 5 Assertion Patterns)
      
      // Pattern 2 Assertion: Đối soát mã HTTP Status Code (200 vs 400)
      expect(transitionRes.status()).toBe(tc.expectedStatusCode);

      if (tc.type === 'positive') {
        // Pattern 3 Assertion: Kiểm tra thông điệp phản hồi thành công trong Response Body
        expect(responseBody.message).toContain(tc.expectedMessage);
      } else {
        // Pattern 4 Assertion: Kiểm tra thông điệp báo lỗi trong Response Body
        expect(responseBody.error).toContain(tc.expectedError);
      }

      // Pattern 5 Assertion: Kiểm tra trạng thái lưu trữ thực tế của đơn hàng trong CSDL (Post-condition state check)
      const checkOrderRes = await request.get(`${baseURL}/api/orders/${orderId}`);
      const currentOrderState = await checkOrderRes.json();
      expect(currentOrderState.status).toBe(tc.expectedStatus);
    });
  }
});

