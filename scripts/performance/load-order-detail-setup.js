"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_DB = path.join(REPO_ROOT, "backend", "database.sqlite");
const sqlite3 = require(path.join(
  REPO_ROOT,
  "backend",
  "node_modules",
  "sqlite3",
));

const FIXTURES = Object.freeze([
  Object.freeze({
    id: 2312710701,
    user_id: 2,
    total_amount: 30000000,
    status: "pending",
    shipping_address: "HW05_LOAD_FIXTURE_A",
    order_case: "deterministic_success_a",
    iteration_key: "load-order-a",
  }),
  Object.freeze({
    id: 2312710702,
    user_id: 2,
    total_amount: 28000000,
    status: "pending",
    shipping_address: "HW05_LOAD_FIXTURE_B",
    order_case: "deterministic_success_b",
    iteration_key: "load-order-b",
  }),
]);

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

function assertDisposableDatabase(runtimeDbPath) {
  if (!runtimeDbPath) {
    throw new Error("Thiếu đường dẫn runtime database rõ ràng.");
  }

  const resolvedDb = fs.realpathSync.native(runtimeDbPath);
  const resolvedSource = fs.realpathSync.native(SOURCE_DB);
  const resolvedTemp = fs.realpathSync.native(os.tmpdir());

  if (resolvedDb.toLowerCase() === resolvedSource.toLowerCase()) {
    throw new Error("Từ chối thao tác: runtime database trùng source backend/database.sqlite.");
  }
  if (!isInside(resolvedTemp, resolvedDb)) {
    throw new Error("Từ chối thao tác: runtime database không nằm trong OS temporary directory.");
  }

  return resolvedDb;
}

function openDatabase(filename) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READWRITE, (error) => {
      if (error) reject(error);
      else resolve(db);
    });
  });
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve({ changes: this.changes, lastID: this.lastID });
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) reject(error);
      else resolve(row);
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) reject(error);
      else resolve(rows);
    });
  });
}

function close(db) {
  return new Promise((resolve, reject) => {
    db.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function verifyFixtureRow(row, expected) {
  const exactFields = ["id", "user_id", "total_amount", "status", "shipping_address"];
  for (const field of exactFields) {
    if (row[field] !== expected[field]) {
      throw new Error(`Fixture ${expected.id} sai field ${field}.`);
    }
  }
  if (typeof row.created_at !== "string" || row.created_at.trim() === "") {
    throw new Error(`Fixture ${expected.id} thiếu created_at do SQLite tạo.`);
  }
}

async function applyOrderFixtures(runtimeDbPath) {
  const resolvedDb = assertDisposableDatabase(runtimeDbPath);
  const db = await openDatabase(resolvedDb);
  let transactionOpen = false;

  try {
    await run(db, "BEGIN IMMEDIATE");
    transactionOpen = true;

    const schema = await all(db, "PRAGMA table_info(orders)");
    const requiredColumns = [
      "id",
      "user_id",
      "total_amount",
      "status",
      "shipping_address",
      "created_at",
    ];
    const actualColumns = new Set(schema.map((column) => column.name));
    for (const column of requiredColumns) {
      if (!actualColumns.has(column)) {
        throw new Error(`Schema orders thiếu column ${column}.`);
      }
    }

    const user = await get(
      db,
      "SELECT id, email, role FROM users WHERE id = ?",
      [2],
    );
    if (!user || user.id !== 2 || user.email !== "test@eshop.com" || user.role !== "user") {
      throw new Error("Seeded Test User ID 2 không khớp source contract.");
    }

    await run(db, "DELETE FROM orders");
    const afterClear = await get(db, "SELECT COUNT(*) AS count FROM orders");
    if (afterClear.count !== 0) {
      throw new Error("Không thể cô lập orders trong runtime database.");
    }

    for (const fixture of FIXTURES) {
      const collision = await get(db, "SELECT id FROM orders WHERE id = ?", [fixture.id]);
      if (collision) {
        throw new Error(`Fixture ID ${fixture.id} đã tồn tại sau runtime cleanup.`);
      }
      await run(
        db,
        `INSERT INTO orders (id, user_id, total_amount, status, shipping_address)
         VALUES (?, ?, ?, ?, ?)`,
        [
          fixture.id,
          fixture.user_id,
          fixture.total_amount,
          fixture.status,
          fixture.shipping_address,
        ],
      );
    }

    const rows = await all(
      db,
      `SELECT id, user_id, total_amount, status, shipping_address, created_at
       FROM orders ORDER BY id`,
    );
    if (rows.length !== FIXTURES.length) {
      throw new Error(`Runtime database có ${rows.length} orders thay vì đúng 2.`);
    }
    rows.forEach((row, index) => verifyFixtureRow(row, FIXTURES[index]));

    await run(db, "COMMIT");
    transactionOpen = false;

    return rows.map((row, index) => ({
      ...FIXTURES[index],
      created_at_present: typeof row.created_at === "string" && row.created_at.trim() !== "",
    }));
  } catch (error) {
    if (transactionOpen) {
      try {
        await run(db, "ROLLBACK");
      } catch {
        // Preserve the original setup failure.
      }
    }
    throw error;
  } finally {
    await close(db);
  }
}

function parseDbArgument(argv) {
  const index = argv.indexOf("--db");
  return index >= 0 ? argv[index + 1] : undefined;
}

if (require.main === module) {
  applyOrderFixtures(parseDbArgument(process.argv.slice(2)))
    .then((fixtures) => {
      process.stdout.write(`${JSON.stringify({ status: "PASS", fixture_count: fixtures.length })}\n`);
    })
    .catch((error) => {
      process.stderr.write(`SETUP_FAILED: ${error.message}\n`);
      process.exitCode = 1;
    });
}

module.exports = {
  FIXTURES,
  SOURCE_DB,
  applyOrderFixtures,
};
