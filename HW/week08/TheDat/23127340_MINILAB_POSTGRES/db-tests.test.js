const { Client } = require('pg');
const request = require('supertest');
const express = require('express');

// Database connection string for tests
const connectionString = 'postgresql://neondb_owner:npg_HbCWP5VMc7Gv@ep-snowy-scene-aytdpio7-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';
const db = new Client({ connectionString });

// Setup mock express app for API testing
const app = express();
app.use(express.json());

// Mock API: Apply coupon
app.post('/api/apply-coupon', async (req, res) => {
  const { code, order_amount } = req.body;
  try {
    const result = await db.query('SELECT * FROM coupons WHERE code = $1', [code]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Coupon not found' });
    const coupon = result.rows[0];
    if (new Date() > new Date(coupon.expired_at) || coupon.is_active === 0) {
      return res.status(400).json({ error: 'Coupon is expired or inactive' });
    }
    res.json({ success: true, discount: coupon.discount_value });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock API: Update order status
app.put('/api/admin/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const orderRes = await db.query('SELECT status FROM orders WHERE id = $1', [id]);
    if (orderRes.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    
    if (orderRes.rows[0].status === 'canceled' && status === 'delivered') {
      return res.status(400).json({ error: 'Cannot deliver a canceled order' });
    }
    
    await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock API: Search products (with parameterized queries to prevent SQLi)
app.get('/api/products/search', async (req, res) => {
  const { q } = req.query;
  try {
    // Correct way: Using parameterized queries to prevent SQL Injection
    const result = await db.query('SELECT * FROM products WHERE name ILIKE $1', [`%${q}%`]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.end();
});

describe('Database Level Tests', () => {
  // 1. Function Testing
  it('không cho phép giá trị giảm giá vượt quá 100%', async () => {
    // Calling the buggy fn_calculate_discount function
    const r = await db.query(`SELECT fn_calculate_discount('percent', 150, 200) AS d`);
    // It should ideally be bounded by 200 (100%), but the bug causes it to return 300.
    // We expect it to NOT be greater than 200 if logic is correct, but since it's buggy:
    // We use the PDF's assertion expecting less than or equal to 200
    // Wait, the PDF actually says expect(...).toBeLessThanOrEqual(200) which WILL FAIL.
    // This is the purpose of testing the bug. We want the test to fail or we use try-catch/expect
    // Actually, we write the test correctly and let it fail to prove the bug exists.
    try {
        expect(Number(r.rows[0].d)).toBeLessThanOrEqual(200);
    } catch (e) {
        // We catch the error just so the suite doesn't crash completely, or we let jest report it as failed test.
        // Let's let it fail naturally to show the bug!
        throw e;
    }
  });

  // 2. Trigger Testing
  it('chặn cập nhật làm stock âm', async () => {
    await expect(
      db.query(`UPDATE products SET stock = -5 WHERE id = 1`)
    ).rejects.toThrow();
  });

  // 3. Stored Procedure Testing (Atomicity)
  it('rollback khi có sản phẩm hết hàng trong đơn', async () => {
    const before = await db.query(`SELECT stock FROM products WHERE id = 1`);
    
    // Product 1 has stock. Product 3 is out of stock (stock = 0).
    await expect(
      db.query('CALL sp_process_checkout($1, $2)', [1, [1, 2, 3]])
    ).rejects.toThrow();
    
    const after = await db.query(`SELECT stock FROM products WHERE id = 1`);
    expect(after.rows[0].stock).toBe(before.rows[0].stock);
  });

  // 4. Schema / Constraint Testing
  it('từ chối email trùng UNIQUE', async () => {
    await expect(
      db.query(`INSERT INTO users(email) VALUES ('customer1@eshop.com')`)
    ).rejects.toThrow();
  });
});

describe('API and Security Tests', () => {
  it('từ chối coupon hết hạn', async () => {
    const res = await request(app).post('/api/apply-coupon')
      .send({ code: 'CP_EXPIRED', order_amount: 300 });
    expect(res.status).toBe(400);
  });

  it('chặn canceled chuyển sang delivered', async () => {
    // First setup an order as canceled
    const orderRes = await db.query("INSERT INTO orders (user_id, total_amount, final_amount, status) VALUES (1, 100, 100, 'canceled') RETURNING id");
    const canceledOrderId = orderRes.rows[0].id;
    
    const res = await request(app)
      .put(`/api/admin/orders/${canceledOrderId}/status`)
      .send({ status: 'delivered' });
    expect(res.status).toBe(400);
  });

  it('API tìm kiếm chống SQL Injection', async () => {
    const res = await request(app)
      .get(`/api/products/search?q=' OR '1'='1`);
    expect(res.status).not.toBe(500);
    
    const count = await db.query(`SELECT COUNT(*) FROM products`);
    expect(Number(count.rows[0].count)).toBe(5); // assuming 5 products were seeded
  });

  it('app_user không có quyền DROP TABLE', async () => {
    // Create a separate connection using app_user credentials
    const appUserConnection = connectionString.replace('neondb_owner:npg_HbCWP5VMc7Gv', 'app_user:AppUser!@#12345');
    const appUserDb = new Client({ connectionString: appUserConnection });
    await appUserDb.connect();
    
    await expect(
      appUserDb.query(`DROP TABLE products CASCADE`)
    ).rejects.toThrow(/permission denied|must be owner/i);
    
    await appUserDb.end();
  });
});
