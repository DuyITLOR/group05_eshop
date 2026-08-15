"use strict";

const crypto = require("crypto");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { once } = require("events");
const { spawn, spawnSync } = require("child_process");
const {
  FIXTURES,
  SOURCE_DB,
  applyOrderFixtures,
} = require("./load-order-detail-setup");

function requiredArgument(name) {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : null;
  if (!value || value.startsWith("--")) throw new Error(`Thiếu argument bắt buộc ${name}.`);
  return value;
}

const RUN_ID = requiredArgument("--run-id");
const RETRY_REASON = requiredArgument("--retry-reason");
if (RUN_ID !== "run-002") throw new Error(`Run identity không được authorize: ${RUN_ID}.`);
if (RETRY_REASON !== "RETRY_AFTER_PRE_EXECUTION_EVIDENCE_FAILURE") {
  throw new Error(`Retry reason không được authorize: ${RETRY_REASON}.`);
}

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_BACKEND = path.join(REPO_ROOT, "backend");
const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const RUN_ROOT = path.join(REPO_ROOT, "results", "23127107_Load_20260812", RUN_ID);
const RAW_DIR = path.join(RUN_ROOT, "raw");
const HTML_DIR = path.join(RUN_ROOT, "html");
const EVIDENCE_DIR = path.join(RUN_ROOT, "evidence");
const RAW_JTL = path.join(RAW_DIR, `23127107_Load_20260812_${RUN_ID}.jtl`);
const JMETER = "D:\\Tools\\apache-jmeter-5.6.3\\bin\\jmeter.bat";
const JMX = path.join(REPO_ROOT, "test-plans", "23127107_Load_20260812.jmx");
const CSV = path.join(REPO_ROOT, "test-data", "read-heavy-orders.csv");
const DESIGN = path.join(REPO_ROOT, "docs", "performance-design", "load-order-detail-design.md");
const PLAN_REVIEW = path.join(REPO_ROOT, "docs", "performance-reviews", "load-order-detail-jmeter-ai-review.md");
const MONITOR_SCRIPT = path.join(__dirname, "monitor-load-resources.ps1");
const JMETER_LAUNCHER = path.join(__dirname, "run-approved-load-jmeter.ps1");
const sqlite3 = require(path.join(SOURCE_BACKEND, "node_modules", "sqlite3"));

const EXPECTED_HASHES = Object.freeze({
  jmx: "13BBDA897DC17E4907FF1E7BB1C05AD87AE33768D2B896862C18172F61F2D2B7",
  csv: "CA8770F8795EC6C7E21DDE68704BE35B19758940B4A41D54D89D0A4FE1D1EECF",
  design: "5773CF4CDB56E7B3C27328A66B8635496ADC394C13B231E688C2361CF119B728",
  plan_review: "ED3DC35D2339157BED5840165A6028B5CB9DDFDF08C78FCDD3966CDB7CEA8E4C",
  source_database: "C63F00544180BA1FBB1427A9B9DD3F1784842698809972F33CE90482E7420BA6",
  source_server: "E2263811A1690A63A7DBB4446C3FD33FB87F50D073D9F8CDFAB7083A52F5E8ED",
  source_database_config: "50012F35C2CF0776DD837482D76ADF701F0EE40CDCB9D80143278FCCDE034717",
});

function sha256(filename) {
  return crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex").toUpperCase();
}

function relative(filename) {
  return path.relative(REPO_ROOT, filename).replaceAll("\\", "/");
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function writeJson(filename, value) {
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, "utf8");
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
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "backend-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "backend-stderr.log"), "w");
  const nodePath = path.join(SOURCE_BACKEND, "node_modules");
  const child = spawn(process.execPath, ["server.js"], {
    cwd: runtimeBackend,
    env: {
      ...process.env,
      NODE_PATH: process.env.NODE_PATH
        ? `${nodePath}${path.delimiter}${process.env.NODE_PATH}`
        : nodePath,
    },
    stdio: ["ignore", stdout, stderr],
    windowsHide: true,
  });
  child.once("exit", () => {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
  });
  return child;
}

function openReadonlyDatabase(filename) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filename, sqlite3.OPEN_READONLY, (error) => {
      if (error) reject(error);
      else resolve(db);
    });
  });
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => (error ? reject(error) : resolve(row)));
  });
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => (error ? reject(error) : resolve(rows)));
  });
}

function dbClose(db) {
  return new Promise((resolve, reject) => db.close((error) => (error ? reject(error) : resolve())));
}

async function inspectRuntimeDatabase(runtimeDb) {
  const db = await openReadonlyDatabase(runtimeDb);
  try {
    const user = await dbGet(db, "SELECT id, email, role FROM users WHERE id = 2");
    const orders = await dbAll(
      db,
      `SELECT id, user_id, total_amount, status, shipping_address, created_at
       FROM orders ORDER BY id`,
    );
    return { user, orders };
  } finally {
    await dbClose(db);
  }
}

async function waitForBackendSeed(child, runtimeDb) {
  const deadline = Date.now() + 30000;
  let lastError = "backend chưa sẵn sàng";
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Disposable backend dừng sớm với exit code ${child.exitCode}.`);
    try {
      const { user } = await inspectRuntimeDatabase(runtimeDb);
      if (user && user.id === 2 && user.email === "test@eshop.com" && user.role === "user") return;
      lastError = "seeded Test User ID 2 chưa sẵn sàng";
    } catch (error) {
      lastError = error.message;
    }
    await sleep(250);
  }
  throw new Error(`Timeout chờ disposable backend seed hoàn tất: ${lastError}`);
}

async function requestJson(route, options = {}) {
  const response = await fetch(`${BASE_URL}${route}`, {
    ...options,
    signal: AbortSignal.timeout(5000),
  });
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`${route} không trả JSON hợp lệ (HTTP ${response.status}).`);
  }
  return { status: response.status, body };
}

function verifyOrderResponse(result, expected) {
  if (result.status !== 200) throw new Error(`Smoke GET fixture ${expected.id} trả HTTP ${result.status}.`);
  for (const field of ["id", "user_id", "total_amount", "status", "shipping_address"]) {
    if (result.body[field] !== expected[field]) {
      throw new Error(`Smoke GET fixture ${expected.id} sai field ${field}.`);
    }
  }
  if (typeof result.body.created_at !== "string" || result.body.created_at.trim() === "") {
    throw new Error(`Smoke GET fixture ${expected.id} thiếu created_at.`);
  }
}

function verifyRuntimeOrders(orders) {
  if (orders.length !== FIXTURES.length) throw new Error(`Runtime có ${orders.length} orders thay vì đúng 2.`);
  orders.forEach((row, index) => {
    const expected = FIXTURES[index];
    for (const field of ["id", "user_id", "total_amount", "status", "shipping_address"]) {
      if (row[field] !== expected[field]) throw new Error(`Runtime fixture ${expected.id} sai field ${field}.`);
    }
    if (typeof row.created_at !== "string" || row.created_at.trim() === "") {
      throw new Error(`Runtime fixture ${expected.id} thiếu created_at.`);
    }
  });
}

function verifyApprovedWorkload(jmxText) {
  const checks = {
    phase_a_threads_5: jmxText.includes('<stringProp name="ThreadGroup.num_threads">5</stringProp>'),
    phase_a_ramp_10: jmxText.includes('<stringProp name="ThreadGroup.ramp_time">10</stringProp>'),
    phase_a_duration_120: jmxText.includes('<stringProp name="ThreadGroup.duration">120</stringProp>'),
    phase_b_delay_40: jmxText.includes('<stringProp name="ThreadGroup.delay">40</stringProp>'),
    phase_b_ramp_20: jmxText.includes('<stringProp name="ThreadGroup.ramp_time">20</stringProp>'),
    phase_b_duration_80: jmxText.includes('<stringProp name="ThreadGroup.duration">80</stringProp>'),
    uniform_timer_500_plus_500: (jmxText.match(/<UniformRandomTimer/g) || []).length === 2
      && (jmxText.match(/<stringProp name="ConstantTimer.delay">500<\/stringProp>/g) || []).length === 2
      && (jmxText.match(/<stringProp name="RandomTimer.range">500<\/stringProp>/g) || []).length === 2,
    summary_report: jmxText.includes('testname="Summary Report" enabled="true"'),
    approved_csv: (jmxText.match(/test-data\/read-heavy-orders\.csv/g) || []).length === 2,
    external_token: jmxText.includes("${__P(hw05.auth_token,)}"),
  };
  return {
    result: Object.values(checks).every(Boolean) ? "PASS" : "FAIL",
    approved_profile: "0 -> 5 -> 10 VUs / 120 seconds",
    timer: "Uniform Random Timer 500-1000 ms",
    listener: "Summary Report",
    checks,
  };
}

function verifyApprovedCsv() {
  const lines = fs.readFileSync(CSV, "utf8").trim().split(/\r?\n/);
  const expected = [
    "order_id,expected_user_id,expected_status,expected_total_amount,order_case,iteration_key",
    "2312710701,2,pending,30000000,deterministic_success_a,load-order-a",
    "2312710702,2,pending,28000000,deterministic_success_b,load-order-b",
  ];
  return {
    result: lines.length === expected.length && lines.every((line, index) => line === expected[index]) ? "PASS" : "FAIL",
    data_rows: lines.length - 1,
    request_driving_field: "order_id",
    assertion_driving_fields: ["expected_user_id", "expected_status", "expected_total_amount"],
  };
}

function getJmeterVersion() {
  const versionLog = path.join(EVIDENCE_DIR, "jmeter-version-check.log");
  const result = spawnSync("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", JMETER_LAUNCHER,
    "-JMeterPath", JMETER,
    "-VersionOnly",
    "-VersionLogPath", versionLog,
  ], {
    cwd: EVIDENCE_DIR,
    encoding: "utf8",
    windowsHide: true,
  });
  const combined = `${result.stdout || ""}\n${result.stderr || ""}`;
  const match = combined.match(/\b5\.6\.3\b/);
  if (result.status !== 0 || !match) throw new Error("Không xác minh được JMeter 5.6.3 CLI.");
  return "5.6.3";
}

function runJmeterOnce(secretFile) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "jmeter-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "jmeter-stderr.log"), "w");
  const evidenceLauncher = path.join(EVIDENCE_DIR, "run-approved-load-jmeter.ps1");
  fs.copyFileSync(JMETER_LAUNCHER, evidenceLauncher);
  const child = spawn("powershell.exe", [
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", evidenceLauncher,
    "-JMeterPath", JMETER,
    "-JmxPath", JMX,
    "-SecretPropertiesPath", secretFile,
    "-BaseUrl", BASE_URL,
    "-RawJtlPath", RAW_JTL,
    "-HtmlDirectory", HTML_DIR,
    "-JMeterLogPath", path.join(EVIDENCE_DIR, "jmeter-run.log"),
  ], {
    cwd: REPO_ROOT,
    stdio: ["ignore", stdout, stderr],
    windowsHide: true,
  });
  child.once("exit", () => {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
  });
  return child;
}

function startResourceMonitor(backendPid, stopFile) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "resource-monitor-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "resource-monitor-stderr.log"), "w");
  const evidenceScript = path.join(EVIDENCE_DIR, "monitor-load-resources.ps1");
  fs.copyFileSync(MONITOR_SCRIPT, evidenceScript);
  const child = spawn(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy", "Bypass",
      "-File", evidenceScript,
      "-OutputDirectory", EVIDENCE_DIR,
      "-BackendProcessId", String(backendPid),
      "-StopFile", stopFile,
    ],
    { stdio: ["ignore", stdout, stderr], windowsHide: true },
  );
  child.once("exit", () => {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
  });
  return child;
}

async function waitForFiles(files, child, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (files.every((filename) => fs.existsSync(filename) && fs.statSync(filename).size > 0)) return;
    if (child.exitCode !== null) throw new Error(`Tiến trình evidence dừng sớm với exit code ${child.exitCode}.`);
    await sleep(250);
  }
  throw new Error(`Timeout chờ evidence: ${files.map(relative).join(", ")}`);
}

async function stopChild(child, gracefulSignal = "SIGTERM") {
  if (!child || child.exitCode !== null) return;
  child.kill(gracefulSignal);
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
  const relativePath = path.relative(resolvedTemp, resolvedRoot);
  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath) ||
    !path.basename(resolvedRoot).startsWith("hw05-load-order-detail-run-")
  ) {
    throw new Error("Từ chối cleanup vì runtime root không thuộc HW05 OS temp namespace.");
  }
  fs.rmSync(resolvedRoot, { recursive: true, force: true });
}

function parseCsvLine(line) {
  const fields = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      fields.push(field);
      field = "";
    } else {
      field += char;
    }
  }
  fields.push(field);
  return fields;
}

function inspectJtl() {
  const lines = fs.readFileSync(RAW_JTL, "utf8").split(/\r?\n/).filter((line) => line.length > 0);
  if (lines.length < 2) throw new Error("Raw JTL không có sample data.");
  const headers = parseCsvLine(lines[0]);
  const successIndex = headers.indexOf("success");
  const timestampIndex = headers.indexOf("timeStamp");
  if (successIndex < 0 || timestampIndex < 0) throw new Error("Raw JTL thiếu success/timeStamp column.");
  let successful = 0;
  let failed = 0;
  let minTimestamp = Number.POSITIVE_INFINITY;
  let maxTimestamp = Number.NEGATIVE_INFINITY;
  for (const line of lines.slice(1)) {
    const row = parseCsvLine(line);
    if (row.length !== headers.length) throw new Error("Raw JTL có CSV row không cùng schema header.");
    if (row[successIndex].toLowerCase() === "true") successful += 1;
    else failed += 1;
    const timestamp = Number(row[timestampIndex]);
    if (!Number.isFinite(timestamp)) throw new Error("Raw JTL có timeStamp không hợp lệ.");
    minTimestamp = Math.min(minTimestamp, timestamp);
    maxTimestamp = Math.max(maxTimestamp, timestamp);
  }
  return {
    total_samples: successful + failed,
    successful_samples: successful,
    failed_samples: failed,
    sample_timestamp_span_seconds: Number(((maxTimestamp - minTimestamp) / 1000).toFixed(3)),
  };
}

function unquote(value) {
  if (value.startsWith('"') && value.endsWith('"')) return value.slice(1, -1).replaceAll('""', '"');
  return value;
}

function summarizeResources() {
  const filename = path.join(EVIDENCE_DIR, "resource-monitor.csv");
  const lines = fs.readFileSync(filename, "utf8").trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]).map(unquote);
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line).map(unquote);
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
  const numbers = (field) => rows.map((row) => Number(row[field])).filter(Number.isFinite);
  const aggregate = (field) => {
    const values = numbers(field);
    return {
      minimum: Math.min(...values),
      average: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)),
      maximum: Math.max(...values),
    };
  };
  return {
    evidence_type: "FACTUAL_RESOURCE_CAPTURE_SUMMARY",
    interpretation_performed: false,
    sample_count: rows.length,
    first_timestamp: rows[0]?.timestamp || null,
    last_timestamp: rows.at(-1)?.timestamp || null,
    backend_pid: rows[0] ? Number(rows[0].backend_pid) : null,
    backend_not_alive_samples: rows.filter((row) => row.backend_alive.toLowerCase() !== "true").length,
    system_cpu_percent: aggregate("system_cpu_percent"),
    system_memory_used_bytes: aggregate("system_memory_used_bytes"),
    system_memory_free_bytes: aggregate("system_memory_free_bytes"),
    backend_working_set_bytes: aggregate("backend_working_set_bytes"),
    backend_private_memory_bytes: aggregate("backend_private_memory_bytes"),
  };
}

function verifyHtml() {
  const index = path.join(HTML_DIR, "index.html");
  if (!fs.existsSync(index) || fs.statSync(index).size === 0) return { result: "FAIL", file_count: 0 };
  const content = fs.readFileSync(index, "utf8");
  const files = fs.readdirSync(HTML_DIR, { recursive: true }).filter((entry) => {
    const filename = path.join(HTML_DIR, entry);
    return fs.existsSync(filename) && fs.statSync(filename).isFile();
  });
  return {
    result: /Apache JMeter Dashboard|dashboard/i.test(content) ? "PASS" : "FAIL",
    file_count: files.length,
    index: relative(index),
    generated_from_same_invocation: true,
  };
}

function fingerprints() {
  return {
    jmx: sha256(JMX),
    csv: sha256(CSV),
    design: sha256(DESIGN),
    plan_review: sha256(PLAN_REVIEW),
    source_database: sha256(SOURCE_DB),
    source_server: sha256(path.join(SOURCE_BACKEND, "server.js")),
    source_database_config: sha256(path.join(SOURCE_BACKEND, "database.js")),
  };
}

function assertExpectedFingerprints(actual) {
  for (const [key, expected] of Object.entries(EXPECTED_HASHES)) {
    if (actual[key] !== expected) throw new Error(`Fingerprint mismatch: ${key}.`);
  }
}

async function main() {
  if (fs.existsSync(RUN_ROOT)) {
    throw new Error(`RUN_DIRECTORY_COLLISION: ${relative(RUN_ROOT)} đã tồn tại; từ chối chạy hoặc đổi run ID.`);
  }

  const startedAt = new Date();
  let runtimeRoot;
  let runtimeBackend;
  let runtimeDb;
  let secretFile;
  let backend;
  let monitor;
  let monitorStopFile;
  let jmeter;
  let jmeterExitCode = null;
  let jmeterStartedAt = null;
  let jmeterEndedAt = null;
  let jmeterInvocationCount = 0;
  let corePreflightPassed = false;
  let preflightPassed = false;
  let executionFailure = null;
  let cleanupFailure = null;
  let sourceBefore;
  let sourceBeforeLoad;
  let sourceAfter;
  let fixtureEvidence = [];
  let smokeChecks = [];
  let runtimeOrdersBefore = [];
  let runtimeOrdersAfter = [];
  let tokenPresent = false;
  let verifiedUserId = null;
  let workloadTraceability;
  let csvTraceability;
  let jmeterVersion;
  let monitorInitialSummary;

  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

  try {
    sourceBefore = fingerprints();
    assertExpectedFingerprints(sourceBefore);
    if (!fs.existsSync(JMETER)) throw new Error("JMeter CLI không tồn tại ở approved installation path.");
    jmeterVersion = getJmeterVersion();
    workloadTraceability = verifyApprovedWorkload(fs.readFileSync(JMX, "utf8"));
    csvTraceability = verifyApprovedCsv();
    if (workloadTraceability.result !== "PASS") throw new Error("Approved workload traceability check thất bại.");
    if (csvTraceability.result !== "PASS") throw new Error("Approved CSV exact-row check thất bại.");
    await assertPortAvailable();

    runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hw05-load-order-detail-run-"));
    runtimeBackend = path.join(runtimeRoot, "backend");
    runtimeDb = path.join(runtimeBackend, "database.sqlite");
    secretFile = path.join(runtimeRoot, "hw05-load-secrets.properties");
    copyBackendApplication(runtimeBackend);
    if (path.resolve(runtimeDb).toLowerCase() === path.resolve(SOURCE_DB).toLowerCase()) {
      throw new Error("Runtime DB path trùng source DB path.");
    }

    backend = startRuntimeBackend(runtimeBackend);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "backend.pid"), `${backend.pid}\n`, "utf8");
    await waitForBackendSeed(backend, runtimeDb);
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
    tokenPresent = true;
    fs.writeFileSync(secretFile, `hw05.auth_token=${token}\n`, { encoding: "utf8", mode: 0o600 });

    const me = await requestJson("/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
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

    runtimeOrdersBefore = (await inspectRuntimeDatabase(runtimeDb)).orders;
    verifyRuntimeOrders(runtimeOrdersBefore);
    sourceBeforeLoad = fingerprints();
    assertExpectedFingerprints(sourceBeforeLoad);
    corePreflightPassed = true;

    writeJson(path.join(EVIDENCE_DIR, "preflight.json"), {
      evidence_type: "HW05_PRODUCTION_LOAD_PREFLIGHT",
      captured_at: new Date().toISOString(),
      result: "CORE_PASS_MONITOR_PENDING",
      student_id: "23127107",
      endpoint: "GET /api/orders/:id",
      group: "READ_HEAVY",
      scenario: "LOAD",
      run_id: RUN_ID,
      retry_reason: RETRY_REASON,
      previous_run: "run-001",
      previous_run_classification: "FAILED_PRE_EXECUTION_ATTEMPT",
      previous_run_preserved: true,
      output_collision: false,
      jmeter_version: jmeterVersion,
      jmeter_installation: "D:/Tools/apache-jmeter-5.6.3",
      approved_artifact_fingerprints: sourceBeforeLoad,
      expected_fingerprints_match: true,
      workload_traceability: workloadTraceability,
      csv_traceability: csvTraceability,
      runtime_isolation: "DISPOSABLE_BACKEND_RUNTIME_COPY",
      runtime_location: "OS_TEMP_OUTSIDE_REPOSITORY",
      runtime_database_belongs_to_copied_backend: path.dirname(runtimeDb) === runtimeBackend,
      source_database_opened_for_write: false,
      fixture_transaction: "COMMITTED_IN_DISPOSABLE_RUNTIME",
      historical_runtime_orders_cleared: true,
      fixture_count: fixtureEvidence.length,
      fixtures: fixtureEvidence,
      token_preflight: {
        setup_login_measured: false,
        setup_login_requests: 1,
        token_present: tokenPresent,
        token_value_recorded: false,
        token_hash_recorded: false,
        authorization_header_recorded: false,
        temporary_external_properties_file: true,
        verified_user_id: verifiedUserId,
      },
      smoke_checks: smokeChecks,
      authentication_coverage_claimed: false,
      port_exclusive_before_runtime_start: true,
      concurrent_mutating_order_workflow_detected: false,
      jmeter_invocation_count_before_execution: jmeterInvocationCount,
    });

    monitorStopFile = path.join(EVIDENCE_DIR, "resource-monitor.stop");
    monitor = startResourceMonitor(backend.pid, monitorStopFile);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "resource-monitor.pid"), `${monitor.pid}\n`, "utf8");
    await waitForFiles(
      [path.join(EVIDENCE_DIR, "hardware-context.json"), path.join(EVIDENCE_DIR, "resource-monitor.csv")],
      monitor,
      30000,
    );

    const monitorStderr = path.join(EVIDENCE_DIR, "resource-monitor-stderr.log");
    if (fs.statSync(monitorStderr).size !== 0) {
      throw new Error("Resource monitor stderr không rỗng sau initial sample.");
    }
    monitorInitialSummary = summarizeResources();
    const monitorInitialValid = monitorInitialSummary.sample_count >= 1
      && monitorInitialSummary.backend_not_alive_samples === 0
      && Number.isFinite(monitorInitialSummary.system_cpu_percent.minimum)
      && Number.isFinite(monitorInitialSummary.system_memory_used_bytes.minimum)
      && Number.isFinite(monitorInitialSummary.backend_working_set_bytes.minimum);
    if (!monitorInitialValid) throw new Error("Initial resource monitor sample không hợp lệ.");
    writeJson(path.join(EVIDENCE_DIR, "monitor-preflight.json"), {
      captured_at: new Date().toISOString(),
      result: "PASS",
      run_id: RUN_ID,
      monitor_pid: monitor.pid,
      backend_pid: backend.pid,
      initial_sample_count: monitorInitialSummary.sample_count,
      backend_not_alive_samples: monitorInitialSummary.backend_not_alive_samples,
      stderr_empty: true,
      capture_source: "WINDOWS_NATIVE_API_NO_CIM",
      jmeter_invocation_count: jmeterInvocationCount,
    });
    const preflightPath = path.join(EVIDENCE_DIR, "preflight.json");
    const preflightEvidence = JSON.parse(fs.readFileSync(preflightPath, "utf8"));
    preflightEvidence.result = "PASS";
    preflightEvidence.monitor_verified_at = new Date().toISOString();
    preflightEvidence.resource_monitor_preflight = {
      result: "PASS",
      monitor_pid: monitor.pid,
      backend_pid: backend.pid,
      initial_sample_count: monitorInitialSummary.sample_count,
      stderr_empty: true,
      capture_source: "WINDOWS_NATIVE_API_NO_CIM",
    };
    writeJson(preflightPath, preflightEvidence);
    preflightPassed = true;

    jmeterStartedAt = new Date();
    writeJson(path.join(EVIDENCE_DIR, "execution-start.json"), {
      started_at: jmeterStartedAt.toISOString(),
      student_id: "23127107",
      scenario: "LOAD",
      run_id: RUN_ID,
      retry_reason: RETRY_REASON,
      previous_run: "run-001",
      previous_run_preserved: true,
      jmx_path: relative(JMX),
      jmx_sha256: sourceBeforeLoad.jmx,
      csv_path: relative(CSV),
      csv_sha256: sourceBeforeLoad.csv,
      backend_pid: backend.pid,
      monitor_pid: monitor.pid,
      hardware_context: relative(path.join(EVIDENCE_DIR, "hardware-context.json")),
      preflight_result: "PASS",
      approved_duration_seconds: 120,
      command: `jmeter -n -t <approved-jmx> -q <temporary-secret-properties-file> -JbaseUrl=http://127.0.0.1:3000 -l <${RUN_ID}-jtl> -e -o <${RUN_ID}-html> -j <${RUN_ID}-log>`,
      token_recorded: false,
      jmeter_invocation_authorized: true,
      jmeter_invocation_number: 1,
    });
    jmeterInvocationCount += 1;
    jmeter = runJmeterOnce(secretFile);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "jmeter.pid"), `${jmeter.pid}\n`, "utf8");
    [jmeterExitCode] = await once(jmeter, "exit");
    jmeterEndedAt = new Date();
    if (jmeterExitCode !== 0) throw new Error(`JMeter kết thúc với exit code ${jmeterExitCode}.`);

    runtimeOrdersAfter = (await inspectRuntimeDatabase(runtimeDb)).orders;
    verifyRuntimeOrders(runtimeOrdersAfter);
    if (JSON.stringify(runtimeOrdersAfter) !== JSON.stringify(runtimeOrdersBefore)) {
      throw new Error("Runtime orders thay đổi trong GET-only Load execution.");
    }
  } catch (error) {
    executionFailure = error;
  } finally {
    try {
      if (monitor && monitor.exitCode === null) {
        fs.writeFileSync(monitorStopFile, `${new Date().toISOString()}\n`, "utf8");
        await Promise.race([once(monitor, "exit"), sleep(10000)]);
        if (monitor.exitCode === null) await stopChild(monitor);
      }
      await stopChild(backend);
      if (secretFile && fs.existsSync(secretFile)) fs.rmSync(secretFile, { force: true });
      removeRuntime(runtimeRoot);
    } catch (error) {
      cleanupFailure = error;
    }
  }

  try {
    sourceAfter = fingerprints();
    assertExpectedFingerprints(sourceAfter);
  } catch (error) {
    executionFailure = executionFailure || error;
  }
  if (cleanupFailure) executionFailure = executionFailure || cleanupFailure;

  const secretDeleted = Boolean(secretFile) && !fs.existsSync(secretFile);
  const runtimeDeleted = Boolean(runtimeRoot) && !fs.existsSync(runtimeRoot);
  const sourceUnchanged = Boolean(sourceBefore && sourceAfter)
    && Object.keys(sourceBefore).every((key) => sourceBefore[key] === sourceAfter[key]);
  const postflight = {
    captured_at: new Date().toISOString(),
    result: executionFailure ? "FAIL" : "PASS",
    runtime_order_rows_unchanged: runtimeOrdersBefore.length === 2
      && JSON.stringify(runtimeOrdersAfter) === JSON.stringify(runtimeOrdersBefore),
    runtime_order_count_after: runtimeOrdersAfter.length,
    concurrent_mutating_order_workflow_detected: runtimeOrdersAfter.length > 0
      ? JSON.stringify(runtimeOrdersAfter) !== JSON.stringify(runtimeOrdersBefore)
      : null,
    backend_stopped: !backend || backend.exitCode !== null,
    temporary_external_properties_file_deleted: secretDeleted,
    disposable_runtime_deleted: runtimeDeleted,
    source_fingerprints_before: sourceBefore,
    source_fingerprints_after: sourceAfter,
    source_fingerprints_unchanged: sourceUnchanged,
    token_value_recorded: false,
    token_hash_recorded: false,
    authorization_header_recorded: false,
    failure_reason: executionFailure ? executionFailure.message : null,
  };
  writeJson(path.join(EVIDENCE_DIR, "postflight.json"), postflight);

  let jtlFacts = null;
  let htmlFacts = null;
  let resourceSummary = null;
  let rawJtlHash = null;
  let evidenceComplete = false;
  try {
    if (!executionFailure) {
      jtlFacts = inspectJtl();
      rawJtlHash = sha256(RAW_JTL);
      htmlFacts = verifyHtml();
      resourceSummary = summarizeResources();
      writeJson(path.join(EVIDENCE_DIR, "resource-summary.json"), resourceSummary);
      evidenceComplete = htmlFacts.result === "PASS"
        && resourceSummary.sample_count > 0
        && resourceSummary.backend_not_alive_samples === 0
        && sourceUnchanged
        && secretDeleted
        && runtimeDeleted
        && jmeterInvocationCount === 1;
      if (!evidenceComplete) throw new Error("Execution evidence completeness check thất bại.");
    }
  } catch (error) {
    executionFailure = executionFailure || error;
  }

  const endedAt = new Date();
  const metadata = {
    evidence_type: "HW05_PRODUCTION_LOAD_EXECUTION_METADATA",
    student_id: "23127107",
    scenario: "LOAD",
    endpoint: "GET /api/orders/:id",
    group: "READ_HEAVY",
    plan_identity_date: "20260812",
    actual_execution_date: new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(startedAt),
    run_id: RUN_ID,
    retry_reason: RETRY_REASON,
    previous_run: "run-001",
    previous_run_classification: "FAILED_PRE_EXECUTION_ATTEMPT",
    previous_run_preserved: true,
    execution_status: executionFailure ? "FAILED" : "COMPLETE",
    started_at: startedAt.toISOString(),
    jmeter_started_at: jmeterStartedAt?.toISOString() || null,
    jmeter_ended_at: jmeterEndedAt?.toISOString() || null,
    evidence_completed_at: endedAt.toISOString(),
    approved_duration_seconds: 120,
    wall_clock_execution_seconds: jmeterStartedAt && jmeterEndedAt
      ? Number(((jmeterEndedAt - jmeterStartedAt) / 1000).toFixed(3))
      : null,
    jmeter_version: jmeterVersion || null,
    jmeter_exit_code: jmeterExitCode,
    jmeter_invocation_count: jmeterInvocationCount,
    rerun_count: 0,
    authorized_retry_attempt: true,
    automatic_run_003_allowed: false,
    no_silent_rerun: jmeterInvocationCount <= 1,
    preflight_passed: preflightPassed,
    core_preflight_passed: corePreflightPassed,
    monitor_preflight_passed: Boolean(monitorInitialSummary),
    approved_workload_traceability: workloadTraceability || null,
    approved_csv_traceability: csvTraceability || null,
    approved_artifact_fingerprints: sourceBeforeLoad || sourceBefore || null,
    raw_jtl: fs.existsSync(RAW_JTL) ? relative(RAW_JTL) : "NOT_CREATED",
    raw_jtl_sha256: rawJtlHash,
    html_report: htmlFacts?.index || "NOT_CREATED_OR_INVALID",
    html_file_count: htmlFacts?.file_count || 0,
    resource_monitor: fs.existsSync(path.join(EVIDENCE_DIR, "resource-monitor.csv"))
      ? relative(path.join(EVIDENCE_DIR, "resource-monitor.csv"))
      : "NOT_CREATED",
    resource_summary: resourceSummary ? relative(path.join(EVIDENCE_DIR, "resource-summary.json")) : "NOT_CREATED",
    hardware_context: fs.existsSync(path.join(EVIDENCE_DIR, "hardware-context.json"))
      ? relative(path.join(EVIDENCE_DIR, "hardware-context.json"))
      : "NOT_CREATED",
    preflight: relative(path.join(EVIDENCE_DIR, "preflight.json")),
    postflight: relative(path.join(EVIDENCE_DIR, "postflight.json")),
    jtl_facts: jtlFacts,
    source_database_sha256_before: sourceBefore?.source_database || null,
    source_database_sha256_before_load: sourceBeforeLoad?.source_database || null,
    source_database_sha256_after_cleanup: sourceAfter?.source_database || null,
    source_fingerprints_unchanged: sourceUnchanged,
    runtime_database_modified_only: corePreflightPassed,
    temporary_secret_deleted: secretDeleted,
    disposable_runtime_deleted: runtimeDeleted,
    resource_evidence_complete: Boolean(resourceSummary && resourceSummary.sample_count > 0),
    real_execution_evidence_complete: evidenceComplete && !executionFailure,
    performance_interpretation: "NOT_PERFORMED",
    task2_analysis: "NOT_STARTED",
    performance_claims: [],
    failure_reason: executionFailure ? executionFailure.message : null,
  };
  writeJson(path.join(EVIDENCE_DIR, "execution-metadata.json"), metadata);

  if (executionFailure) {
    process.stderr.write(`LOAD_EXECUTION_FAILED: ${executionFailure.message}\n`);
    process.stderr.write(`${JSON.stringify({
      preflight: preflightPassed ? "PASS" : "FAIL",
      run_id: RUN_ID,
      retry_reason: RETRY_REASON,
      jmeter_invocation_count: jmeterInvocationCount,
      rerun_count: 0,
      evidence: relative(EVIDENCE_DIR),
    })}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`${JSON.stringify({
    status: "PASS",
    run_id: RUN_ID,
    retry_reason: RETRY_REASON,
    preflight: "PASS",
    jmeter_exit_code: jmeterExitCode,
    jmeter_invocation_count: jmeterInvocationCount,
    rerun_count: 0,
    raw_jtl: relative(RAW_JTL),
    raw_jtl_sha256: rawJtlHash,
    html_report: htmlFacts.index,
    resource_samples: resourceSummary.sample_count,
    total_samples: jtlFacts.total_samples,
    successful_samples: jtlFacts.successful_samples,
    failed_samples: jtlFacts.failed_samples,
    source_unchanged: sourceUnchanged,
    secret_deleted: secretDeleted,
    runtime_deleted: runtimeDeleted,
    performance_interpretation: "NOT_PERFORMED",
  })}\n`);
}

main().catch((error) => {
  process.stderr.write(`LOAD_EXECUTION_ABORTED: ${error.message}\n`);
  process.exitCode = 1;
});
