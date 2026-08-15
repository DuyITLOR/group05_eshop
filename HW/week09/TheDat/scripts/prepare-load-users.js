const path = require("path");

const sqlite3Path = path.resolve(
  __dirname,
  "../../../../backend/node_modules/sqlite3",
);
const databasePath = path.resolve(
  __dirname,
  "../../../../backend/database.sqlite",
);
const sqlite3 = require(sqlite3Path).verbose();
const db = new sqlite3.Database(databasePath);

const USER_COUNT = 30;
const PASSWORD = "Load1234!";

db.serialize(() => {
  const update = db.prepare(
    `UPDATE users
     SET password = ?, login_attempts = 0, locked_until = NULL
     WHERE email = ?`,
  );
  const insert = db.prepare(
    `INSERT INTO users (name, email, password, role)
     SELECT ?, ?, ?, 'user'
     WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = ?)`,
  );

  for (let index = 1; index <= USER_COUNT; index += 1) {
    const suffix = String(index).padStart(3, "0");
    const email = `load${suffix}@eshop.test`;
    update.run(PASSWORD, email);
    insert.run(`Load User ${suffix}`, email, PASSWORD, email);
  }

  update.finalize();
  insert.finalize(() => {
    db.get(
      "SELECT COUNT(DISTINCT email) AS count FROM users WHERE email LIKE 'load%@eshop.test'",
      (error, row) => {
        if (error) {
          console.error(error.message);
          process.exitCode = 1;
        } else {
          console.log(`Prepared ${row.count} load-test users in ${databasePath}`);
        }
        db.close();
      },
    );
  });
});
