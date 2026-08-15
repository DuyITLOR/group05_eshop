"use strict";

const crypto = require("crypto");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { once } = require("events");
const {
  FIXTURES,
  SOURCE_DB,
  applyOrderFixtures,
} = require("./load-order-detail-setup");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_BACKEND = path.join(REPO_ROOT, "backend");
const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DEFAULT_EVIDENCE_PATH = path.join(
  REPO_ROOT,
  "docs",
  "test-data-reviews",
  "evidence",
  "load-order-detail-runtime-verification.json",
);
const sqlite3 = require(path.join(SOURCE_BACKEND, "node_modules", "sqlite3"));

function sha256(filename) {
  return crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex").toUpperCase();
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function assertPortAvailable() {
  const server = net.createServer();
  server.unref();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen({ host: "127.0.0.1", port: PORT, exclusive: true }, resolve);
  });
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

function copyBackendApplication(runtimeBackend) {
  fs.mkdirSync(runtimeBackend, { recursive: true });
  for (const filename of ["server.js", "database.js", "package.json"]) {
    fs.copyFileSync(path.join(SOURCE_BACKEND, filename), path.join(runtimeBackend, filename));
  }
}

function startRuntimeBackend(runtimeBackend) {
  const nodePath = path.join(SOURCE_BACKEND, "node_modules");
  const child = spawn(process.execPath, ["server.js"], {
    cwd: runtimeBackend,
    env: {
      ...process.env,
      NODE_PATH: process.env.NODE_PATH
        ? `${nodePath}${path.delimiter}${process.env.NODE_PATH}`
        : nodePath,
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  let startupOutput = "";
  const capture = (chunk) => {
    startupOutput = `${startupOutput}${chunk.toString("utf8")}`.slice(-32768);
  };
  child.stdout.on("data", capture);
  child.stderr.on("data", capture);
  child.startupOutput = () => startupOutput;
  return child;
}

async function requestJson(route, options = {}) {
  const response = await fetch(`${BASE_URL}${route}`, {
    ...options,
    signal: AbortSignal.timeout(5000),
  });
  let body = null;
  try {
    body = await response.json();
  } catch {
    throw new Error(`${route} không trả JSON hợp lệ (HTTP ${response.status}).`);
  }
  return { status: response.status, body };
}

function inspectSeededUser(runtimeDb) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(runtimeDb, sqlite3.OPEN_READONLY, (openError) => {
      if (openError) {
        reject(openError);
        return;
      }
      db.get(
        "SELECT id, email, role FROM users WHERE id = 2",
        [],
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

async function waitForBackendSeed(child, runtimeDb) {
  const deadline = Date.now() + 30000;
  let lastError = "backend chưa sẵn sàng";

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Disposable backend dừng sớm: ${child.startupOutput().trim()}`);
    }
    try {
      const user = await inspectSeededUser(runtimeDb);
      if (user && user.id === 2 && user.email === "test@eshop.com" && user.role === "user") {
        return;
      }
      lastError = "seeded Test User ID 2 chưa sẵn sàng";
    } catch (error) {
      lastError = error.message;
    }
    await sleep(250);
  }

  throw new Error(`Timeout chờ disposable backend seed hoàn tất: ${lastError}`);
}

function verifyOrderResponse(result, expected) {
  if (result.status !== 200) {
    throw new Error(`Smoke GET fixture ${expected.id} trả HTTP ${result.status}.`);
  }
  for (const field of ["id", "user_id", "total_amount", "status", "shipping_address"]) {
    if (result.body[field] !== expected[field]) {
      throw new Error(`Smoke GET fixture ${expected.id} sai field ${field}.`);
    }
  }
  if (typeof result.body.created_at !== "string" || result.body.created_at.trim() === "") {
    throw new Error(`Smoke GET fixture ${expected.id} thiếu created_at.`);
  }
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
  const resolvedTemp = fs.realpathSync.native(os.tmpdir());
  const resolvedRoot = fs.realpathSync.native(runtimeRoot);
  const relative = path.relative(resolvedTemp, resolvedRoot);
  if (
    relative === "" ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative) ||
    !path.basename(resolvedRoot).startsWith("hw05-load-order-detail-")
  ) {
    throw new Error("Từ chối cleanup vì runtime root không thuộc HW05 OS temp namespace.");
  }
  fs.rmSync(resolvedRoot, { recursive: true, force: true });
}

function writeEvidence(filename, evidence) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
}

async function main() {
  const evidenceIndex = process.argv.indexOf("--evidence");
  const evidencePath = evidenceIndex >= 0
    ? path.resolve(process.argv[evidenceIndex + 1])
    : DEFAULT_EVIDENCE_PATH;
  const sourceBefore = {
    database: sha256(SOURCE_DB),
    server: sha256(path.join(SOURCE_BACKEND, "server.js")),
    database_config: sha256(path.join(SOURCE_BACKEND, "database.js")),
  };
  let runtimeRoot;
  let runtimeBackend;
  let runtimeDb;
  let secretFile;
  let child;
  let fixtureEvidence = [];
  let tokenPresent = false;
  let verifiedUserId = null;
  let smokeChecks = [];
  let failure;

  try {
    await assertPortAvailable();
    runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hw05-load-order-detail-"));
    runtimeBackend = path.join(runtimeRoot, "backend");
    runtimeDb = path.join(runtimeBackend, "database.sqlite");
    secretFile = path.join(runtimeRoot, "hw05-load-secrets.properties");
    copyBackendApplication(runtimeBackend);

    if (path.resolve(runtimeDb).toLowerCase() === path.resolve(SOURCE_DB).toLowerCase()) {
      throw new Error("Runtime DB path trùng source DB path.");
    }

    child = startRuntimeBackend(runtimeBackend);
    await waitForBackendSeed(child, runtimeDb);
    fixtureEvidence = await applyOrderFixtures(runtimeDb);

    const login = await requestJson("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@eshop.com", password: "Test1234!" }),
    });
    if (login.status !== 200 || typeof login.body.token !== "string" || login.body.token.length === 0) {
      throw new Error(`Login setup-only không cấp JWT hợp lệ (HTTP ${login.status}).`);
    }
    const token = login.body.token;
    tokenPresent = typeof token === "string" && token.length > 0;
    fs.writeFileSync(secretFile, `hw05.auth_token=${token}\n`, { encoding: "utf8", mode: 0o600 });

    const me = await requestJson("/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (me.status !== 200 || me.body.id !== 2) {
      throw new Error(`Token preflight không xác minh được dedicated user ID 2 (HTTP ${me.status}).`);
    }
    verifiedUserId = me.body.id;

    for (const fixture of FIXTURES) {
      const result = await requestJson(`/api/orders/${fixture.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      verifyOrderResponse(result, fixture);
      smokeChecks.push({
        order_id: fixture.id,
        http_status: result.status,
        exact_fields_match: true,
        created_at_present: true,
      });
    }

    const sourceAfterSetup = sha256(SOURCE_DB);
    if (sourceAfterSetup !== sourceBefore.database) {
      throw new Error("Source database SHA-256 thay đổi sau fixture setup/preflight.");
    }
  } catch (error) {
    failure = error;
  } finally {
    try {
      await stopChild(child);
      if (secretFile && fs.existsSync(secretFile)) fs.rmSync(secretFile, { force: true });
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
  if (!sourceUnchanged && !failure) {
    failure = new Error("Source backend fingerprint thay đổi trong runtime verification.");
  }

  const evidence = {
    evidence_type: "HW05_LOAD_TEST_DATA_SETUP_VERIFICATION",
    endpoint: "GET /api/orders/:id",
    group: "READ_HEAVY",
    scenario: "LOAD",
    verification_status: failure ? "FAIL" : "PASS",
    runtime_isolation: "DISPOSABLE_BACKEND_RUNTIME_COPY",
    runtime_location: "OS_TEMP_OUTSIDE_REPOSITORY",
    runtime_database_belongs_to_copied_backend:
      Boolean(runtimeDb && runtimeBackend) && path.dirname(runtimeDb) === runtimeBackend,
    runtime_deleted_after_verification: Boolean(runtimeRoot) && !fs.existsSync(runtimeRoot),
    source_database_opened_for_write: false,
    source_fingerprints_before: sourceBefore,
    source_fingerprints_after: sourceAfter,
    source_fingerprints_unchanged: sourceUnchanged,
    historical_runtime_orders_cleared: !failure,
    fixture_transaction: failure ? "FAILED_OR_ROLLED_BACK" : "COMMITTED_IN_DISPOSABLE_RUNTIME",
    fixture_count: fixtureEvidence.length,
    fixtures: fixtureEvidence,
    token_preflight: {
      setup_login_measured: false,
      setup_login_requests: tokenPresent ? 1 : 0,
      token_present: tokenPresent,
      token_value_recorded: false,
      token_hash_recorded: false,
      authorization_header_recorded: false,
      external_properties_file_deleted: Boolean(secretFile) && !fs.existsSync(secretFile),
      verified_user_id: verifiedUserId,
    },
    smoke_checks: smokeChecks,
    authentication_coverage_claimed: false,
    performance_execution_performed: false,
    final_csv_created: false,
    jmx_created: false,
    failure_reason: failure ? failure.message : null,
  };
  writeEvidence(evidencePath, evidence);

  if (failure) {
    process.stderr.write(`RUNTIME_VERIFICATION_FAILED: ${failure.message}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`${JSON.stringify({
    status: "PASS",
    fixture_count: fixtureEvidence.length,
    token_present: tokenPresent,
    verified_user_id: verifiedUserId,
    source_unchanged: sourceUnchanged,
    runtime_deleted: evidence.runtime_deleted_after_verification,
    evidence: path.relative(REPO_ROOT, evidencePath).replaceAll("\\", "/"),
  })}\n`);
}

main().catch((error) => {
  process.stderr.write(`RUNTIME_VERIFICATION_FAILED: ${error.message}\n`);
  process.exitCode = 1;
});
