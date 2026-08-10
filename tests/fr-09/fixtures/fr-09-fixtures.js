const fs = require('node:fs');
const path = require('node:path');
const { test: base, expect } = require('@playwright/test');

const WORKSPACE_DB_PATH = path.resolve(
  __dirname,
  '..',
  '..',
  '..',
  'backend',
  'database.sqlite',
);

function requireEnvironment(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required for FR-09 automation.`);
  }
  return value;
}

function loadSqlite3() {
  const backendPath = path.resolve(__dirname, '..', '..', '..', 'backend');
  const modulePath = require.resolve('sqlite3', { paths: [backendPath] });
  return require(modulePath).verbose();
}

function resolveIsolatedDbPath() {
  if (process.env.FR09_ISOLATED_DB !== 'true') {
    throw new Error(
      'FR09_ISOLATED_DB=true is required before any FR-09 DB fixture may mutate state.',
    );
  }

  const dbPath = path.resolve(requireEnvironment('FR09_TEST_DB_PATH'));
  if (dbPath.toLowerCase() === WORKSPACE_DB_PATH.toLowerCase()) {
    throw new Error(
      'FR09_TEST_DB_PATH must not target backend/database.sqlite in the workspace.',
    );
  }
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Isolated FR-09 database does not exist: ${dbPath}`);
  }

  return dbPath;
}

async function withDatabase(dbPath, operation) {
  const sqlite3 = loadSqlite3();
  const db = await new Promise((resolve, reject) => {
    const connection = new sqlite3.Database(
      dbPath,
      sqlite3.OPEN_READWRITE,
      (error) => (error ? reject(error) : resolve(connection)),
    );
  });

  const run = (sql, parameters = []) =>
    new Promise((resolve, reject) => {
      db.run(sql, parameters, function onRun(error) {
        if (error) reject(error);
        else resolve({ changes: this.changes, lastID: this.lastID });
      });
    });
  const get = (sql, parameters = []) =>
    new Promise((resolve, reject) => {
      db.get(sql, parameters, (error, row) =>
        error ? reject(error) : resolve(row),
      );
    });
  const all = (sql, parameters = []) =>
    new Promise((resolve, reject) => {
      db.all(sql, parameters, (error, rows) =>
        error ? reject(error) : resolve(rows),
      );
    });

  try {
    return await operation({ run, get, all });
  } finally {
    await new Promise((resolve, reject) => {
      db.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function installInactiveCoupon(dbPath, setupDataset) {
  const fixture = setupDataset.coupon;
  const inserted = await withDatabase(dbPath, async ({ get, run }) => {
    const existing = await get('SELECT id FROM coupons WHERE code = ?', [
      fixture.code,
    ]);
    if (existing) {
      throw new Error(
        `Controlled inactive coupon code already exists: ${fixture.code}`,
      );
    }

    return run(
      `INSERT INTO coupons
       (code, type, discount_value, min_order_amount, expired_at, is_active, max_uses_per_user)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        fixture.code,
        fixture.type,
        fixture.discountValue,
        fixture.minOrderAmount,
        fixture.expiredAt,
        fixture.isActive,
        fixture.maxUsesPerUser,
      ],
    );
  });

  return async () => {
    await withDatabase(dbPath, async ({ run }) => {
      const result = await run(
        'DELETE FROM coupons WHERE id = ? AND code = ?',
        [inserted.lastID, fixture.code],
      );
      if (result.changes !== 1) {
        throw new Error(
          `Inactive coupon cleanup did not remove exactly one owned row: ${fixture.code}`,
        );
      }
    });
  };
}

async function setExactUsageCount(dbPath, setupDataset, userId) {
  const originalRows = await withDatabase(
    dbPath,
    async ({ all, get, run }) => {
      const coupon = await get(
        'SELECT id, max_uses_per_user FROM coupons WHERE code = ?',
        [setupDataset.couponCode],
      );
      if (!coupon) {
        throw new Error(`Coupon not found: ${setupDataset.couponCode}`);
      }
      if (coupon.max_uses_per_user !== setupDataset.maxUsesPerUser) {
        throw new Error(
          `Coupon max-use mismatch for ${setupDataset.couponCode}: expected ${setupDataset.maxUsesPerUser}, found ${coupon.max_uses_per_user}`,
        );
      }

      const rows = await all(
        'SELECT used_at FROM coupon_usage WHERE coupon_id = ? AND user_id = ? ORDER BY id',
        [coupon.id, userId],
      );
      await run(
        'DELETE FROM coupon_usage WHERE coupon_id = ? AND user_id = ?',
        [coupon.id, userId],
      );
      for (let index = 0; index < setupDataset.usageCount; index += 1) {
        await run(
          'INSERT INTO coupon_usage (coupon_id, user_id) VALUES (?, ?)',
          [coupon.id, userId],
        );
      }
      return { couponId: coupon.id, rows };
    },
  );

  return async () => {
    await withDatabase(dbPath, async ({ run }) => {
      await run(
        'DELETE FROM coupon_usage WHERE coupon_id = ? AND user_id = ?',
        [originalRows.couponId, userId],
      );
      for (const row of originalRows.rows) {
        await run(
          'INSERT INTO coupon_usage (coupon_id, user_id, used_at) VALUES (?, ?, ?)',
          [originalRows.couponId, userId, row.used_at],
        );
      }
    });
  };
}

const test = base.extend({
  authenticatedSession: async ({ page, request }, use) => {
    const backendBaseUrl = requireEnvironment('SUT_API_BASE_URL');
    const email = requireEnvironment('FR09_TEST_USER_EMAIL');
    const password = requireEnvironment('FR09_TEST_USER_PASSWORD');
    const response = await request.post(`${backendBaseUrl}/api/login`, {
      data: { email, password },
    });

    if (!response.ok()) {
      throw new Error(
        `FR-09 test-user login failed with HTTP ${response.status()}.`,
      );
    }

    const body = await response.json();
    if (!body.token || !body.user?.id) {
      throw new Error('FR-09 login response did not include token and user.id.');
    }

    await page.addInitScript((token) => {
      window.localStorage.setItem('token', token);
    }, body.token);

    await use({ page, user: body.user });
  },

  isolatedDb: async ({}, use) => {
    let resolvedPath;
    const api = {
      installInactiveCoupon: async (setupDataset) => {
        resolvedPath ||= resolveIsolatedDbPath();
        return installInactiveCoupon(resolvedPath, setupDataset);
      },
      setExactUsageCount: async (setupDataset, userId) => {
        resolvedPath ||= resolveIsolatedDbPath();
        return setExactUsageCount(resolvedPath, setupDataset, userId);
      },
    };
    await use(api);
  },
});

module.exports = { expect, test };
