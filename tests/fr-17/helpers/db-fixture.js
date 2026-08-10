const path = require('node:path');
const { resolveIsolatedDbPath } = require('./runtime-guard');

function loadSqlite3() {
  const backendPath = path.resolve(__dirname, '..', '..', '..', 'backend');
  const modulePath = require.resolve('sqlite3', { paths: [backendPath] });
  return require(modulePath).verbose();
}

async function withDatabase(dbPath, operation) {
  const sqlite3 = loadSqlite3();
  const db = await new Promise((resolve, reject) => {
    const connection = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (error) => error ? reject(error) : resolve(connection));
  });
  const run = (sql, parameters = []) => new Promise((resolve, reject) => {
    db.run(sql, parameters, function onRun(error) { if (error) reject(error); else resolve({ changes: this.changes, lastID: this.lastID }); });
  });
  const all = (sql, parameters = []) => new Promise((resolve, reject) => {
    db.all(sql, parameters, (error, rows) => error ? reject(error) : resolve(rows));
  });
  try { return await operation({ run, all }); }
  finally { await new Promise((resolve, reject) => db.close((error) => error ? reject(error) : resolve())); }
}

async function verifyBaselineSeeds(dbPath, seedDataset) {
  const rows = await withDatabase(dbPath, ({ all }) => all('SELECT code FROM coupons ORDER BY code'));
  const actual = rows.map((row) => row.code).sort();
  const expected = [...seedDataset.expectedCodes].sort();
  if (rows.length !== seedDataset.expectedCount || JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`AUTOMATION_SETUP_OR_CLEANUP_RISK: isolated coupon baseline must contain exactly ${seedDataset.expectedCount} records (${expected.join(', ')}); found ${rows.length} (${actual.join(', ')}).`);
  }
}

async function insertOwnedCoupon(dbPath, coupon) {
  return withDatabase(dbPath, async ({ all, run }) => {
    const existing = await all('SELECT id FROM coupons WHERE code = ?', [coupon.code]);
    if (existing.length) throw new Error(`AUTOMATION_SETUP_OR_CLEANUP_RISK: owned coupon code already exists: ${coupon.code}`);
    return run('INSERT INTO coupons (code, type, discount_value, min_order_amount, expired_at, max_uses_per_user) VALUES (?, ?, ?, ?, ?, ?)', [coupon.code, coupon.type, coupon.discountValue, coupon.minOrderAmount, coupon.expiredAt, coupon.maxUsesPerUser]);
  });
}

async function removeOwnedCoupon(dbPath, code) {
  const result = await withDatabase(dbPath, ({ run }) => run('DELETE FROM coupons WHERE code = ?', [code]));
  if (result.changes > 1) throw new Error(`AUTOMATION_SETUP_OR_CLEANUP_RISK: cleanup removed multiple records for ${code}.`);
}

function createIsolatedDbFixture() {
  let dbPath;
  const resolve = () => (dbPath ||= resolveIsolatedDbPath());
  return {
    assertReady: async (seedDataset) => verifyBaselineSeeds(resolve(), seedDataset),
    insertOwnedCoupon: async (coupon) => insertOwnedCoupon(resolve(), coupon),
    removeOwnedCoupon: async (code) => removeOwnedCoupon(resolve(), code),
  };
}

module.exports = { createIsolatedDbFixture };
