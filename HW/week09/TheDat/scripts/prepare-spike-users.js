const fs = require("fs");
const path = require("path");

const sqlite3Path = path.resolve(
  __dirname,
  "../../../../backend/node_modules/sqlite3",
);
const databasePath = path.resolve(
  __dirname,
  "../../../../backend/database.sqlite",
);
const csvPath = path.resolve(
  __dirname,
  "../test-data/accounts_spike.csv",
);
const sqlite3 = require(sqlite3Path).verbose();
const db = new sqlite3.Database(databasePath);

const USER_COUNT = 120;
const PASSWORD = "Spike1234!";
const products = [
  { id: 1, name: "iPhone 15 Pro Max", price: 30000000 },
  { id: 2, name: "Samsung Galaxy S24 Ultra", price: 28000000 },
  { id: 3, name: "MacBook Pro M3", price: 45000000 },
  { id: 4, name: "Tai nghe AirPods Pro 2", price: 6000000 },
  { id: 5, name: "Bàn phím cơ Keychron Q1", price: 4000000 },
];

const csvRows = [
  "email,password,productId,productName,price,quantity,shippingAddress",
];

for (let index = 1; index <= USER_COUNT; index += 1) {
  const suffix = String(index).padStart(3, "0");
  const product = products[(index - 1) % products.length];
  csvRows.push(
    [
      `spike${suffix}@eshop.test`,
      PASSWORD,
      product.id,
      product.name,
      product.price,
      1,
      `Spike Test Address ${suffix} HCMC`,
    ].join(","),
  );
}

fs.writeFileSync(csvPath, `${csvRows.join("\n")}\n`, "utf8");

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
    const email = `spike${suffix}@eshop.test`;
    update.run(PASSWORD, email);
    insert.run(`Spike User ${suffix}`, email, PASSWORD, email);
  }

  update.finalize();
  insert.finalize(() => {
    db.get(
      "SELECT COUNT(DISTINCT email) AS count FROM users WHERE email LIKE 'spike%@eshop.test'",
      (error, row) => {
        if (error) {
          console.error(error.message);
          process.exitCode = 1;
        } else {
          console.log(`Da chuan bi ${row.count} tai khoan Spike trong ${databasePath}`);
          console.log(`Da ghi ${USER_COUNT} tai khoan CSV vao ${csvPath}`);
        }
        db.close();
      },
    );
  });
});
