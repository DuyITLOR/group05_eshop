"use strict";

const crypto = require("crypto");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { once } = require("events");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_BACKEND = path.join(REPO_ROOT, "backend");
const SOURCE_DB = path.join(SOURCE_BACKEND, "database.sqlite");
const EVIDENCE_PATH = path.join(
  REPO_ROOT,
  "docs",
  "test-data-reviews",
  "evidence",
  "spike-users-me-runtime-verification.json",
);
const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const sqlite3 = require(path.join(SOURCE_BACKEND, "node_modules", "sqlite3"));

function sha256(filename) {
  return crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex").toUpperCase();
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function assertPortAvailable() {
  const probe = net.createServer();
  probe.unref();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen({ host: "127.0.0.1", port: PORT, exclusive: true }, resolve);
  });
  await new Promise((resolve, reject) => probe.close((error) => (error ? reject(error) : resolve())));
}

function copyBackend(runtimeBackend) {
  fs.mkdirSync(runtimeBackend, { recursive: true });
  for (const filename of ["server.js", "database.js", "package.json"]) {
    fs.copyFileSync(path.join(SOURCE_BACKEND, filename), path.join(runtimeBackend, filename));
  }
}

function startBackend(runtimeBackend) {
  const nodeModules = path.join(SOURCE_BACKEND, "node_modules");
  return spawn(process.execPath, ["server.js"], {
    cwd: runtimeBackend,
    env: {
      ...process.env,
      NODE_PATH: process.env.NODE_PATH
        ? `${nodeModules}${path.delimiter}${process.env.NODE_PATH}`
        : nodeModules,
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
}

function readSeededUser(runtimeDb) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(runtimeDb, sqlite3.OPEN_READONLY, (openError) => {
      if (openError) {
        reject(openError);
        return;
      }
      db.get(
        "SELECT id, name, email, password, role FROM users WHERE role = ? ORDER BY id LIMIT 1",
        ["user"],
        (queryError, row) => {
          db.close(() => {
            if (queryError) reject(queryError);
            else resolve(row);
          });
        },
      );
    });
  });
}

async function waitForSeededUser(child, runtimeDb) {
  const deadline = Date.now() + 30000;
  let latestError = "seeded user chua san sang";
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error("Disposable backend dung truoc khi seed hoan tat.");
    try {
      const user = await readSeededUser(runtimeDb);
      if (user && Number.isInteger(user.id) && typeof user.name === "string"
        && typeof user.email === "string" && typeof user.password === "string") {
        return user;
      }
      latestError = "Khong tim thay seeded user role user day du field can thiet.";
    } catch (error) {
      latestError = error.message;
    }
    await sleep(250);
  }
  throw new Error(`Timeout cho seeded user: ${latestError}`);
}

async function requestJson(route, options = {}) {
  const response = await fetch(`${BASE_URL}${route}`, {
    ...options,
    signal: AbortSignal.timeout(5000),
  });
  const body = await response.json();
  return { status: response.status, body };
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await Promise.race([once(child, "exit"), sleep(5000)]);
  if (child.exitCode === null) {
    child.kill("SIGKILL");
    await Promise.race([once(child, "exit"), sleep(5000)]);
  }
}

function removeRuntime(runtimeRoot) {
  if (!runtimeRoot || !fs.existsSync(runtimeRoot)) return;
  const tempRoot = fs.realpathSync.native(os.tmpdir());
  const resolvedRuntime = fs.realpathSync.native(runtimeRoot);
  const relative = path.relative(tempRoot, resolvedRuntime);
  if (relative === "" || relative === ".." || relative.startsWith(`..${path.sep}`)
    || path.isAbsolute(relative) || !path.basename(resolvedRuntime).startsWith("hw05-spike-users-me-")) {
    throw new Error("Tu choi cleanup vi runtime root nam ngoai HW05 OS temp namespace.");
  }
  fs.rmSync(resolvedRuntime, { recursive: true, force: true });
}

function writeEvidence(evidence) {
  fs.mkdirSync(path.dirname(EVIDENCE_PATH), { recursive: true });
  fs.writeFileSync(EVIDENCE_PATH, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
}

async function main() {
  const sourceBefore = {
    database: sha256(SOURCE_DB),
    server: sha256(path.join(SOURCE_BACKEND, "server.js")),
    database_config: sha256(path.join(SOURCE_BACKEND, "database.js")),
  };
  let runtimeRoot;
  let runtimeDb;
  let backend;
  let seededIdentity = null;
  let responseFields = [];
  let responseVerified = false;
  let tokenPresent = false;
  let failure = null;

  try {
    await assertPortAvailable();
    runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hw05-spike-users-me-"));
    const runtimeBackend = path.join(runtimeRoot, "backend");
    runtimeDb = path.join(runtimeBackend, "database.sqlite");
    copyBackend(runtimeBackend);

    if (path.resolve(runtimeDb).toLowerCase() === path.resolve(SOURCE_DB).toLowerCase()) {
      throw new Error("Runtime database path trung backend/database.sqlite.");
    }

    backend = startBackend(runtimeBackend);
    const seededUser = await waitForSeededUser(backend, runtimeDb);
    seededIdentity = {
      id: seededUser.id,
      name: seededUser.name,
      email: seededUser.email,
      role: seededUser.role,
    };

    const login = await requestJson("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: seededUser.email, password: seededUser.password }),
    });
    if (login.status !== 200 || typeof login.body.token !== "string" || login.body.token.length === 0) {
      throw new Error(`Setup-only authentication khong cap token hop le (HTTP ${login.status}).`);
    }
    const token = login.body.token;
    tokenPresent = true;

    const me = await requestJson("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (me.status !== 200 || !me.body || Array.isArray(me.body)) {
      throw new Error(`GET /api/users/me khong tra JSON object thanh cong (HTTP ${me.status}).`);
    }
    responseFields = Object.keys(me.body).sort();
    for (const field of ["id", "email", "name"]) {
      if (!Object.hasOwn(me.body, field)) throw new Error(`Response thieu field ${field}.`);
    }
    if (me.body.id !== seededIdentity.id || me.body.email !== seededIdentity.email
      || me.body.name !== seededIdentity.name) {
      throw new Error("Response identity khong khop seeded user runtime.");
    }
    responseVerified = true;
  } catch (error) {
    failure = error;
  } finally {
    try {
      await stopChild(backend);
      removeRuntime(runtimeRoot);
    } catch (cleanupError) {
      failure = failure || cleanupError;
    }
  }

  const sourceAfter = {
    database: sha256(SOURCE_DB),
    server: sha256(path.join(SOURCE_BACKEND, "server.js")),
    database_config: sha256(path.join(SOURCE_BACKEND, "database.js")),
  };
  const sourceUnchanged = Object.keys(sourceBefore).every((key) => sourceBefore[key] === sourceAfter[key]);
  if (!sourceUnchanged && !failure) failure = new Error("Source fingerprint thay doi trong runtime verification.");

  const evidence = {
    evidence_type: "HW05_AUTH_HEAVY_SPIKE_TEST_DATA_VERIFICATION",
    endpoint: "GET /api/users/me",
    group: "AUTH_HEAVY",
    scenario: "SPIKE",
    verification_status: failure ? "FAIL" : "PASS",
    runtime_isolation: "DISPOSABLE_BACKEND_RUNTIME_COPY",
    runtime_location: "OS_TEMP_OUTSIDE_REPOSITORY",
    runtime_database_belongs_to_copied_backend: Boolean(runtimeDb)
      && path.dirname(runtimeDb).endsWith(`${path.sep}backend`),
    runtime_deleted_after_verification: Boolean(runtimeRoot) && !fs.existsSync(runtimeRoot),
    source_database_opened_for_write: false,
    source_fingerprints_before: sourceBefore,
    source_fingerprints_after: sourceAfter,
    source_fingerprints_unchanged: sourceUnchanged,
    seeded_identity: seededIdentity,
    setup_authentication: {
      measured: false,
      token_present: tokenPresent,
      token_storage: "IN_MEMORY_ONLY",
      token_value_recorded: false,
      token_hash_recorded: false,
      authorization_header_recorded: false,
    },
    response_contract: {
      http_status: responseVerified ? 200 : null,
      json_object: responseVerified,
      verified_identity_fields: responseVerified ? ["id", "email", "name"] : [],
      returned_field_names: responseFields,
      sensitive_field_values_recorded: false,
    },
    final_csv_created: false,
    jmx_created: false,
    jmeter_executed: false,
    performance_interpretation: "NOT_PERFORMED",
    failure_reason: failure ? failure.message : null,
  };
  writeEvidence(evidence);

  if (failure) {
    process.stderr.write(`AUTH_HEAVY_DATA_VERIFICATION_FAILED: ${failure.message}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`${JSON.stringify({
    status: "PASS",
    seeded_user_id: seededIdentity.id,
    response_contract: "PASS",
    source_unchanged: sourceUnchanged,
    runtime_deleted: evidence.runtime_deleted_after_verification,
    evidence: path.relative(REPO_ROOT, EVIDENCE_PATH).replaceAll("\\", "/"),
  })}\n`);
}

main().catch((error) => {
  process.stderr.write(`AUTH_HEAVY_DATA_VERIFICATION_FAILED: ${error.message}\n`);
  process.exitCode = 1;
});
