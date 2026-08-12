const Module = require("module");
const path = require("path");

const repositoryRoot = path.resolve(process.argv[2]);
const backendDirectory = path.join(repositoryRoot, "backend");
const sqlite3 = require(path.join(backendDirectory, "node_modules", "sqlite3")).verbose();
const databasePath = path.join(backendDirectory, "database.sqlite");
const databaseModulePath = path.join(backendDirectory, "database.js");

const database = new sqlite3.Database(databasePath, (error) => {
  if (error) {
    console.error("Could not connect to existing database", error);
    process.exitCode = 1;
    return;
  }
  console.log(`Connected to existing database without reseeding: ${databasePath}`);
});

const preservedDatabaseModule = new Module(databaseModulePath);
preservedDatabaseModule.filename = databaseModulePath;
preservedDatabaseModule.loaded = true;
preservedDatabaseModule.exports = database;
require.cache[databaseModulePath] = preservedDatabaseModule;

require(path.join(backendDirectory, "server.js"));
