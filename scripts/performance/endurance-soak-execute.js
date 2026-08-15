"use strict";

const crypto = require("crypto");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { once } = require("events");
const { spawn, spawnSync } = require("child_process");
const { FIXTURES, SOURCE_DB, applyOrderFixtures } = require("./load-order-detail-setup");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_BACKEND = path.join(REPO_ROOT, "backend");
const RUN_ID = "run-001";
const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const RUN_ROOT = path.join(REPO_ROOT, "results", "supporting-endurance", "23127107_Endurance_20260816", RUN_ID);
const RAW_DIR = path.join(RUN_ROOT, "raw");
const HTML_DIR = path.join(RUN_ROOT, "html");
const EVIDENCE_DIR = path.join(RUN_ROOT, "evidence");
const RAW_JTL = path.join(RAW_DIR, "23127107_Endurance_20260816_run-001.jtl");
const JMX = path.join(REPO_ROOT, "test-plans", "supporting", "23127107_Endurance_20260816.jmx");
const CSV = path.join(REPO_ROOT, "test-data", "read-heavy-orders.csv");
const DESIGN = path.join(REPO_ROOT, "docs", "performance-design", "endurance-soak-design.md");
const PLAN_REVIEW = path.join(REPO_ROOT, "docs", "performance-reviews", "endurance-soak-jmeter-ai-review.md");
const JMETER = "D:\\Tools\\apache-jmeter-5.6.3\\bin\\jmeter.bat";
const CASUTG_JAR = "D:\\Tools\\apache-jmeter-5.6.3\\lib\\ext\\jmeter-plugins-casutg-3.1.1.jar";
const JMETER_LAUNCHER = path.join(__dirname, "run-approved-load-jmeter.ps1");
const MONITOR_SCRIPT = path.join(__dirname, "monitor-load-resources.ps1");
const sqlite3 = require(path.join(SOURCE_BACKEND, "node_modules", "sqlite3"));

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
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseCsvRecords(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((value) => value.length > 0)) rows.push(row);
  if (quoted) throw new Error("CSV có quoted field không đóng.");
  return rows;
}

function csvObjects(filename) {
  const rows = parseCsvRecords(fs.readFileSync(filename, "utf8").replace(/^\uFEFF/, ""));
  if (rows.length < 2) throw new Error(`${relative(filename)} không có data row.`);
  const headers = rows[0];
  return rows.slice(1).map((values) => {
    if (values.length !== headers.length) throw new Error(`${relative(filename)} có row không khớp schema.`);
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
}

function percentile(values, percentileValue) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.max(0, Math.ceil((percentileValue / 100) * sorted.length) - 1)];
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function isoFromMilliseconds(milliseconds) {
  return new Date(milliseconds).toISOString();
}

function fingerprints() {
  return {
    supporting_jmx: sha256(JMX),
    reused_csv: sha256(CSV),
    design: sha256(DESIGN),
    plan_review: sha256(PLAN_REVIEW),
    source_database: sha256(SOURCE_DB),
    final_load_jmx: sha256(path.join(REPO_ROOT, "test-plans", "23127107_Load_20260812.jmx")),
    final_spike_jmx: sha256(path.join(REPO_ROOT, "test-plans", "23127107_Spike_20260816.jmx")),
    final_stress_jmx: sha256(path.join(REPO_ROOT, "test-plans", "23127107_Stress_20260816.jmx")),
    source_server: sha256(path.join(SOURCE_BACKEND, "server.js")),
    source_database_config: sha256(path.join(SOURCE_BACKEND, "database.js")),
  };
}

function compareFingerprints(before, after, keys) {
  return keys.every((key) => before[key] === after[key]);
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
    env: { ...process.env, NODE_PATH: process.env.NODE_PATH ? `${nodePath}${path.delimiter}${process.env.NODE_PATH}` : nodePath },
    stdio: ["ignore", stdout, stderr],
    windowsHide: true,
  });
  child.once("exit", () => {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
  });
  return child;
}

function openDatabase(filename, mode) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filename, mode, (error) => (error ? reject(error) : resolve(db)));
  });
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (error, row) => (error ? reject(error) : resolve(row))));
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => db.all(sql, params, (error, rows) => (error ? reject(error) : resolve(rows))));
}

function closeDatabase(db) {
  return new Promise((resolve, reject) => db.close((error) => (error ? reject(error) : resolve())));
}

async function waitForRuntimeSeed(backend, runtimeDb) {
  const deadline = Date.now() + 30000;
  let lastError = "runtime backend chưa seed xong";
  while (Date.now() < deadline) {
    if (backend.exitCode !== null) throw new Error(`Disposable backend dừng sớm với exit code ${backend.exitCode}.`);
    try {
      const db = await openDatabase(runtimeDb, sqlite3.OPEN_READONLY);
      const user = await dbGet(db, "SELECT id, email, role FROM users WHERE id = ?", [2]);
      await closeDatabase(db);
      if (user && user.id === 2 && user.email === "test@eshop.com" && user.role === "user") return;
      lastError = "seeded user ID 2 không khớp.";
    } catch (error) {
      lastError = error.message;
    }
    await sleep(250);
  }
  throw new Error(`Timeout chờ disposable runtime: ${lastError}`);
}

async function inspectRuntimeOrders(runtimeDb) {
  const db = await openDatabase(runtimeDb, sqlite3.OPEN_READONLY);
  try {
    return await dbAll(db, "SELECT id, user_id, total_amount, status, shipping_address, created_at FROM orders ORDER BY id");
  } finally {
    await closeDatabase(db);
  }
}

function verifyFixtureRows(rows, csvRows) {
  if (rows.length !== csvRows.length || rows.length !== FIXTURES.length) throw new Error("Runtime fixture count không khớp approved CSV.");
  rows.forEach((row, index) => {
    const csv = csvRows[index];
    const expected = FIXTURES[index];
    if (String(row.id) !== csv.order_id || row.id !== expected.id || String(row.user_id) !== csv.expected_user_id || String(row.total_amount) !== csv.expected_total_amount || row.status !== csv.expected_status || row.shipping_address !== expected.shipping_address || typeof row.created_at !== "string" || !row.created_at.trim()) {
      throw new Error(`Fixture ${csv.order_id} không khớp current source-backed expectation.`);
    }
  });
}

async function requestJson(route) {
  const response = await fetch(`${BASE_URL}${route}`, { signal: AbortSignal.timeout(5000) });
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
    if (result.body[field] !== expected[field]) throw new Error(`Smoke GET fixture ${expected.id} sai ${field}.`);
  }
  if (typeof result.body.created_at !== "string" || !result.body.created_at.trim() || Object.hasOwn(result.body, "error")) {
    throw new Error(`Smoke GET fixture ${expected.id} không đạt response contract.`);
  }
}

function verifyPlanAndCsv(jmxText, csvRows) {
  const checks = {
    supporting_classification: jmxText.includes("SUPPORTING_EXECUTION_ARTIFACT") && jmxText.includes("EXCLUDED_FROM_FINAL_3_JMX_SET"),
    ultimate_thread_group: jmxText.includes("kg.apc.jmeter.threads.UltimateThreadGroup"),
    start_threads: jmxText.includes('name="endurance-start-threads">10</stringProp>'),
    initial_delay: jmxText.includes('name="endurance-initial-delay">0</stringProp>'),
    ramp_up: jmxText.includes('name="endurance-startup-time">60</stringProp>'),
    steady_hold: jmxText.includes('name="endurance-hold-load">600</stringProp>'),
    ramp_down: jmxText.includes('name="endurance-shutdown-time">60</stringProp>'),
    csv_path: jmxText.includes("test-data/read-heavy-orders.csv"),
    csv_variable: jmxText.includes("${order_id}"),
    get_route: jmxText.includes("${baseUrl}/api/orders/${order_id}") && jmxText.includes('name="HTTPSampler.method">GET</stringProp>'),
    think_time: jmxText.includes('name="ConstantTimer.delay">500</stringProp>') && jmxText.includes('name="RandomTimer.range">500</stringProp>'),
    assertions: jmxText.includes("Assert HTTP 200 - Endurance") && jmxText.includes("Assert Order JSON Contract - Endurance"),
    no_embedded_threshold_formula: !jmxText.includes("late_p95") && !jmxText.includes("late_median_RSS"),
    csv_rows: csvRows.length === 2 && csvRows.every((row) => ["2312710701", "2312710702"].includes(row.order_id)),
  };
  return { result: Object.values(checks).every(Boolean) ? "PASS" : "FAIL", checks };
}

function getJmeterVersion() {
  const versionLog = path.join(EVIDENCE_DIR, "jmeter-version-check.log");
  const result = spawnSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", JMETER_LAUNCHER, "-JMeterPath", JMETER, "-VersionOnly", "-VersionLogPath", versionLog], { cwd: EVIDENCE_DIR, encoding: "utf8", windowsHide: true });
  const combined = `${result.stdout || ""}\n${result.stderr || ""}`;
  if (result.status !== 0 || !/\b5\.6\.3\b/.test(combined)) throw new Error("JMETER_VERSION_GUARD_FAIL");
  return "5.6.3";
}

function verifyPlugin() {
  if (!fs.existsSync(CASUTG_JAR)) throw new Error("PLUGIN_VERIFICATION_FAIL: jpgc-casutg=3.1.1 missing.");
  const result = spawnSync("jar", ["tf", CASUTG_JAR], { encoding: "utf8", windowsHide: true });
  if (result.status !== 0 || !result.stdout.includes("kg/apc/jmeter/threads/UltimateThreadGroup.class")) {
    throw new Error("PLUGIN_VERIFICATION_FAIL: UltimateThreadGroup class unavailable.");
  }
  return "3.1.1";
}

function startResourceMonitor(backendPid, stopFile) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "resource-monitor-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "resource-monitor-stderr.log"), "w");
  const evidenceScript = path.join(EVIDENCE_DIR, "monitor-load-resources.ps1");
  fs.copyFileSync(MONITOR_SCRIPT, evidenceScript);
  const child = spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", evidenceScript, "-OutputDirectory", EVIDENCE_DIR, "-BackendProcessId", String(backendPid), "-StopFile", stopFile], { stdio: ["ignore", stdout, stderr], windowsHide: true });
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
    if (child.exitCode !== null) throw new Error(`Resource monitor dừng sớm với exit code ${child.exitCode}.`);
    await sleep(250);
  }
  throw new Error("Timeout chờ resource monitor evidence.");
}

function startJmeter(emptyPropertiesPath) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "jmeter-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "jmeter-stderr.log"), "w");
  const evidenceLauncher = path.join(EVIDENCE_DIR, "run-approved-load-jmeter.ps1");
  fs.copyFileSync(JMETER_LAUNCHER, evidenceLauncher);
  const child = spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", evidenceLauncher, "-JMeterPath", JMETER, "-JmxPath", JMX, "-SecretPropertiesPath", emptyPropertiesPath, "-BaseUrl", BASE_URL, "-RawJtlPath", RAW_JTL, "-HtmlDirectory", HTML_DIR, "-JMeterLogPath", path.join(EVIDENCE_DIR, "jmeter-run.log")], { cwd: REPO_ROOT, stdio: ["ignore", stdout, stderr], windowsHide: true });
  child.once("exit", () => {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
  });
  return child;
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await Promise.race([once(child, "exit"), sleep(10000)]);
  if (child.exitCode === null) {
    child.kill("SIGKILL");
    await Promise.race([once(child, "exit"), sleep(5000)]);
  }
}

function removeRuntime(runtimeRoot) {
  if (!runtimeRoot || !fs.existsSync(runtimeRoot)) return;
  const temp = fs.realpathSync.native(os.tmpdir());
  const root = fs.realpathSync.native(runtimeRoot);
  const rel = path.relative(temp, root);
  if (rel === "" || rel === ".." || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel) || !path.basename(root).startsWith("hw05-supporting-endurance-run-")) {
    throw new Error("Refusing disposable runtime cleanup outside expected temp namespace.");
  }
  fs.rmSync(root, { recursive: true, force: true });
}

function parseJtl() {
  const rows = parseCsvRecords(fs.readFileSync(RAW_JTL, "utf8").replace(/^\uFEFF/, ""));
  if (rows.length < 2) throw new Error("Raw JTL không có sample data.");
  const headers = rows[0];
  const required = ["timeStamp", "elapsed", "success", "responseCode", "label"];
  const indexes = Object.fromEntries(required.map((header) => [header, headers.indexOf(header)]));
  if (Object.values(indexes).some((index) => index < 0)) throw new Error("Raw JTL thiếu required header timestamp/elapsed/success/responseCode/label.");
  return rows.slice(1).map((values) => {
    if (values.length !== headers.length) throw new Error("Raw JTL có row không khớp schema.");
    const timestamp = Number(values[indexes.timeStamp]);
    const elapsed = Number(values[indexes.elapsed]);
    if (!Number.isFinite(timestamp) || !Number.isFinite(elapsed)) throw new Error("Raw JTL có timestamp/elapsed không hợp lệ.");
    return { timestamp, elapsed, success: values[indexes.success].toLowerCase() === "true", responseCode: values[indexes.responseCode], label: values[indexes.label] };
  });
}

function parseResourceRows() {
  const filename = path.join(EVIDENCE_DIR, "resource-monitor.csv");
  const rows = parseCsvRecords(fs.readFileSync(filename, "utf8").replace(/^\uFEFF/, ""));
  if (rows.length < 2) throw new Error("Resource CSV không có sample data.");
  const headers = rows[0];
  const needed = ["timestamp", "backend_alive", "backend_pid", "backend_working_set_bytes", "system_cpu_percent"];
  const indexes = Object.fromEntries(needed.map((header) => [header, headers.indexOf(header)]));
  if (Object.values(indexes).some((index) => index < 0)) throw new Error("Resource CSV thiếu required fields.");
  return rows.slice(1).map((values) => {
    if (values.length !== headers.length) throw new Error("Resource CSV có row không khớp schema.");
    const timestamp = Date.parse(values[indexes.timestamp]);
    const rss = Number(values[indexes.backend_working_set_bytes]);
    const cpu = Number(values[indexes.system_cpu_percent]);
    if (!Number.isFinite(timestamp) || !Number.isFinite(rss) || !Number.isFinite(cpu)) throw new Error("Resource CSV có timestamp/RSS/CPU không parse được.");
    return { timestamp, backendAlive: values[indexes.backend_alive].toLowerCase() === "true", backendPid: Number(values[indexes.backend_pid]), rss, cpu };
  });
}

function verifyHtml() {
  const index = path.join(HTML_DIR, "index.html");
  if (!fs.existsSync(index) || fs.statSync(index).size === 0) throw new Error("HTML report index không tồn tại.");
  const content = fs.readFileSync(index, "utf8");
  if (!/Apache JMeter Dashboard|dashboard/i.test(content)) throw new Error("HTML report không có dashboard structure.");
  return { path: relative(index), file_count: fs.readdirSync(HTML_DIR, { recursive: true }).length };
}

function calculateEndurance(jtlRows, resourceRows, timeline) {
  const measuredStart = timeline.steady_state_start_ms;
  const measuredEnd = timeline.steady_state_end_ms;
  const earlyStart = measuredStart + 60000;
  const earlyEnd = measuredStart + 180000;
  const lateStart = measuredStart + 420000;
  const lateEnd = measuredStart + 600000;
  const measuredSamples = jtlRows.filter((row) => row.label === "GET Order Detail - Endurance" && row.timestamp >= measuredStart && row.timestamp < measuredEnd);
  const earlySuccessful = measuredSamples.filter((row) => row.success && row.timestamp >= earlyStart && row.timestamp < earlyEnd);
  const lateSuccessful = measuredSamples.filter((row) => row.success && row.timestamp >= lateStart && row.timestamp < lateEnd);
  const earlyP95 = percentile(earlySuccessful.map((row) => row.elapsed), 95);
  const lateP95 = percentile(lateSuccessful.map((row) => row.elapsed), 95);
  const responseRatio = earlyP95 !== null && earlyP95 > 0 && lateP95 !== null ? Number((lateP95 / earlyP95).toFixed(6)) : null;
  const responseStability = responseRatio === null ? "NOT_COMPUTABLE" : responseRatio <= 1.25 ? "STABLE_WITHIN_PROPOSED_THRESHOLD" : "THRESHOLD_EXCEEDED";
  const earlyResources = resourceRows.filter((row) => row.timestamp >= earlyStart && row.timestamp < earlyEnd);
  const lateResources = resourceRows.filter((row) => row.timestamp >= lateStart && row.timestamp < lateEnd);
  const earlyMedianRss = median(earlyResources.map((row) => row.rss));
  const lateMedianRss = median(lateResources.map((row) => row.rss));
  const resourceRatio = earlyMedianRss !== null && earlyMedianRss > 0 && lateMedianRss !== null ? Number((lateMedianRss / earlyMedianRss).toFixed(6)) : null;
  const restartCount = resourceRows.some((row) => row.backendPid !== timeline.backend_pid || !row.backendAlive) ? 1 : 0;
  const resourceStability = resourceRatio === null ? "NOT_COMPUTABLE" : resourceRatio <= 1.15 && restartCount === 0 ? "STABLE_WITHIN_PROPOSED_THRESHOLD" : "THRESHOLD_EXCEEDED";
  const measuredFailures = measuredSamples.filter((row) => !row.success).length;
  const errorStability = measuredSamples.length ? measuredFailures === 0 ? "PASS" : "FAIL" : "NOT_COMPUTABLE";
  const allCriteria = [responseStability, resourceStability, errorStability];
  const overall = allCriteria.includes("NOT_COMPUTABLE") ? "NOT_COMPUTABLE" : allCriteria.includes("THRESHOLD_EXCEEDED") || allCriteria.includes("FAIL") ? "THRESHOLD_EXCEEDED" : "STABLE_WITHIN_PROPOSED_THRESHOLD";
  const gaps = resourceRows.slice(1).map((row, index) => row.timestamp - resourceRows[index].timestamp);
  const continuity = resourceRows.some((row) => row.timestamp >= earlyStart && row.timestamp < earlyEnd) && resourceRows.some((row) => row.timestamp >= lateStart && row.timestamp < lateEnd) && gaps.every((gap) => gap <= 5000) ? "PASS" : "FAIL";
  return {
    windows: { measured_start: isoFromMilliseconds(measuredStart), measured_end: isoFromMilliseconds(measuredEnd), early_start: isoFromMilliseconds(earlyStart), early_end: isoFromMilliseconds(earlyEnd), late_start: isoFromMilliseconds(lateStart), late_end: isoFromMilliseconds(lateEnd) },
    full_run: { total_samples: jtlRows.length, successful_samples: jtlRows.filter((row) => row.success).length, failed_samples: jtlRows.filter((row) => !row.success).length, sample_timestamp_start: isoFromMilliseconds(Math.min(...jtlRows.map((row) => row.timestamp))), sample_timestamp_end: isoFromMilliseconds(Math.max(...jtlRows.map((row) => row.timestamp))) },
    measured_soak: { total_samples: measuredSamples.length, successful_samples: measuredSamples.filter((row) => row.success).length, failed_samples: measuredFailures, error_stability: errorStability },
    response: { early_p95_ms: earlyP95, late_p95_ms: lateP95, ratio: responseRatio, result: responseStability, early_success_samples: earlySuccessful.length, late_success_samples: lateSuccessful.length },
    resource: { metric: "backend_working_set_bytes", early_median_rss_bytes: earlyMedianRss, late_median_rss_bytes: lateMedianRss, ratio: resourceRatio, backend_restart_count: restartCount, result: resourceStability, early_samples: earlyResources.length, late_samples: lateResources.length, continuity },
    overall_result: overall,
  };
}

function scanEvidenceForSecrets() {
  const result = { jwt_exposed: "NO", password_value_exposed: "NO", reset_token_value_exposed: "NO", secret_property_exposed: "NO", token_used: false };
  const queue = [EVIDENCE_DIR];
  while (queue.length) {
    const current = queue.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) queue.push(target);
      else if (entry.isFile() && fs.statSync(target).size < 5 * 1024 * 1024) {
        const text = fs.readFileSync(target, "utf8");
        if (/Bearer\s+[A-Za-z0-9\-_]{20,}/.test(text) || /eyJ[A-Za-z0-9\-_]{20,}/.test(text)) result.jwt_exposed = "YES";
        if (/password\s*[=:]\s*[^\s<]+/i.test(text)) result.password_value_exposed = "YES";
        if (/reset_token\s*[=:]\s*[^\s<]+/i.test(text)) result.reset_token_value_exposed = "YES";
        if (/hw05\.auth_token\s*=\s*\S+/i.test(text)) result.secret_property_exposed = "YES";
      }
    }
  }
  return result;
}

async function main() {
  if (fs.existsSync(RUN_ROOT)) throw new Error(`RUN_ID_COLLISION: ${relative(RUN_ROOT)}`);
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const startedAt = new Date();
  let before;
  let preJmeter;
  let after;
  let runtimeRoot;
  let runtimeBackend;
  let runtimeDb;
  let emptyProperties;
  let backend;
  let monitor;
  let monitorStopFile;
  let jmeter;
  let jmeterStartedAt;
  let jmeterEndedAt;
  let jmeterExitCode = null;
  let jmeterInvocationCount = 0;
  let executionFailure = null;
  let cleanupFailure = null;
  let jmeterVersion = null;
  let pluginVersion = null;
  let fixtureRows = [];
  let smoke = null;
  let resourcePreflight = null;
  let threshold = null;
  let rawHash = null;
  let html = null;
  let preflightPassed = false;

  try {
    before = fingerprints();
    if (!fs.existsSync(JMETER)) throw new Error("ENVIRONMENT_FAILURE: JMeter executable missing.");
    jmeterVersion = getJmeterVersion();
    pluginVersion = verifyPlugin();
    const csvRows = csvObjects(CSV);
    const planTraceability = verifyPlanAndCsv(fs.readFileSync(JMX, "utf8"), csvRows);
    if (planTraceability.result !== "PASS") throw new Error("DATA_STATE_FAILURE: approved supporting plan/CSV traceability failed.");
    await assertPortAvailable();

    runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hw05-supporting-endurance-run-"));
    runtimeBackend = path.join(runtimeRoot, "backend");
    runtimeDb = path.join(runtimeBackend, "database.sqlite");
    emptyProperties = path.join(runtimeRoot, "endurance-no-secret.properties");
    fs.writeFileSync(emptyProperties, "# No authentication property is used by current GET /api/orders/:id source handler.\n", "utf8");
    copyBackendApplication(runtimeBackend);
    if (path.resolve(runtimeDb).toLowerCase() === path.resolve(SOURCE_DB).toLowerCase()) throw new Error("DATA_STATE_FAILURE: runtime DB matches source DB.");
    backend = startRuntimeBackend(runtimeBackend);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "backend.pid"), `${backend.pid}\n`, "utf8");
    await waitForRuntimeSeed(backend, runtimeDb);
    await applyOrderFixtures(runtimeDb);
    fixtureRows = await inspectRuntimeOrders(runtimeDb);
    verifyFixtureRows(fixtureRows, csvRows);
    const firstFixture = FIXTURES[0];
    const smokeResult = await requestJson(`/api/orders/${firstFixture.id}`);
    verifyOrderResponse(smokeResult, firstFixture);
    smoke = { setup_only: true, order_id: firstFixture.id, http_status: smokeResult.status, exact_fields_match: true, authentication_used: false };
    preJmeter = fingerprints();
    if (!compareFingerprints(before, preJmeter, Object.keys(before))) throw new Error("DATA_STATE_FAILURE: approved artifacts/source changed during preflight.");

    monitorStopFile = path.join(EVIDENCE_DIR, "resource-monitor.stop");
    monitor = startResourceMonitor(backend.pid, monitorStopFile);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "resource-monitor.pid"), `${monitor.pid}\n`, "utf8");
    await waitForFiles([path.join(EVIDENCE_DIR, "resource-monitor.csv"), path.join(EVIDENCE_DIR, "hardware-context.json")], monitor, 30000);
    const resourceRows = parseResourceRows();
    if (!resourceRows.length || resourceRows.some((row) => !row.backendAlive || row.backendPid !== backend.pid)) throw new Error("EVIDENCE_FAILURE: resource monitor initial sample invalid.");
    resourcePreflight = { result: "PASS", sample_count: resourceRows.length, backend_pid: backend.pid, monitor_pid: monitor.pid, parser: "quoted-CSV parser with UTF-8 BOM/CRLF support" };
    preflightPassed = true;
    writeJson(path.join(EVIDENCE_DIR, "preflight.json"), {
      evidence_type: "HW05_SUPPORTING_ENDURANCE_PREFLIGHT",
      result: "PASS",
      run_id: RUN_ID,
      artifact_classification: "SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT",
      submission_set_membership: "EXCLUDED_FROM_FINAL_3_JMX_JTL_HTML_SET",
      endpoint: "GET /api/orders/:id",
      jmeter_version: jmeterVersion,
      plugin_version: pluginVersion,
      source_database_sha256_before: before.source_database,
      source_database_sha256_pre_jmeter: preJmeter.source_database,
      approved_artifact_fingerprints: preJmeter,
      runtime_isolation: "DISPOSABLE_BACKEND_RUNTIME_COPY",
      runtime_database_source_path: "OS_TEMP_OUTSIDE_REPOSITORY",
      backend_pid: backend.pid,
      monitor_pid: monitor.pid,
      fixtures: fixtureRows.map((row) => ({ id: row.id, user_id: row.user_id, total_amount: row.total_amount, status: row.status, created_at_present: Boolean(row.created_at) })),
      endpoint_success_smoke: smoke,
      resource_monitor: resourcePreflight,
      no_authentication_used_for_current_source_handler: true,
    });

    jmeterStartedAt = new Date();
    const timeline = {
      jmeter_process_invocation_at: jmeterStartedAt.toISOString(),
      ramp_up_start_ms: jmeterStartedAt.getTime(),
      steady_state_start_ms: jmeterStartedAt.getTime() + 60000,
      steady_state_end_ms: jmeterStartedAt.getTime() + 660000,
      ramp_down_end_ms: jmeterStartedAt.getTime() + 720000,
      backend_pid: backend.pid,
    };
    writeJson(path.join(EVIDENCE_DIR, "execution-start.json"), {
      run_id: RUN_ID,
      artifact_classification: "SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT",
      endpoint: "GET /api/orders/:id",
      jmx_path: relative(JMX),
      csv_path: relative(CSV),
      jmeter_version: jmeterVersion,
      plugin_version: pluginVersion,
      backend_pid: backend.pid,
      monitor_pid: monitor.pid,
      planned_ramp_up_seconds: 60,
      planned_measured_soak_seconds: 600,
      planned_ramp_down_seconds: 60,
      planned_total_seconds: 720,
      steady_concurrency_vus: 10,
      think_time_ms: "500-1000",
      timeline,
      command_redacted: "jmeter -n -t <supporting-jmx> -q <empty-non-secret-properties> -JbaseUrl=<disposable-runtime-url> -l <run-001-jtl> -e -o <run-001-html> -j <run-001-log>",
      authorized_jmeter_invocation_number: 1,
    });
    jmeterInvocationCount += 1;
    jmeter = startJmeter(emptyProperties);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "jmeter.pid"), `${jmeter.pid}\n`, "utf8");
    [jmeterExitCode] = await once(jmeter, "exit");
    jmeterEndedAt = new Date();
    if (jmeterExitCode !== 0) throw new Error(`JMETER_FAILURE: JMeter exit code ${jmeterExitCode}.`);

    const jtlRows = parseJtl();
    const resourceAfterRun = parseResourceRows();
    threshold = calculateEndurance(jtlRows, resourceAfterRun, timeline);
    rawHash = sha256(RAW_JTL);
    html = verifyHtml();
    writeJson(path.join(EVIDENCE_DIR, "resource-summary.json"), {
      evidence_type: "FACTUAL_RESOURCE_CAPTURE_SUMMARY",
      interpretation_performed: false,
      sample_count: resourceAfterRun.length,
      first_timestamp: isoFromMilliseconds(resourceAfterRun[0].timestamp),
      last_timestamp: isoFromMilliseconds(resourceAfterRun.at(-1).timestamp),
      backend_pid: backend.pid,
      backend_not_alive_samples: resourceAfterRun.filter((row) => !row.backendAlive).length,
      resource_monitor_continuity: threshold.resource.continuity,
    });
    writeJson(path.join(EVIDENCE_DIR, "endurance-threshold-calculation.json"), {
      threshold_source: "AI_PROPOSED_AND_STUDENT_APPROVED",
      scope: "TASK1_ENDURANCE_ONLY_NOT_TASK2",
      ...threshold,
    });
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
      if (emptyProperties && fs.existsSync(emptyProperties)) fs.rmSync(emptyProperties, { force: true });
      removeRuntime(runtimeRoot);
    } catch (error) {
      cleanupFailure = error;
    }
  }

  try {
    after = fingerprints();
  } catch (error) {
    executionFailure = executionFailure || error;
  }
  if (cleanupFailure) executionFailure = executionFailure || cleanupFailure;
  const sourceIntegrity = Boolean(before && after) && before.source_database === after.source_database;
  const finalJmxUnchanged = Boolean(before && after) && compareFingerprints(before, after, ["final_load_jmx", "final_spike_jmx", "final_stress_jmx"]);
  const supportingArtifactsUnchanged = Boolean(before && after) && compareFingerprints(before, after, ["supporting_jmx", "reused_csv", "design", "plan_review"]);
  const cleanup = { backend_stopped: !backend || backend.exitCode !== null, monitor_stopped: !monitor || monitor.exitCode !== null, disposable_runtime_deleted: !runtimeRoot || !fs.existsSync(runtimeRoot), empty_non_secret_properties_deleted: !emptyProperties || !fs.existsSync(emptyProperties) };
  const secrets = scanEvidenceForSecrets();
  const metadata = {
    evidence_type: "HW05_SUPPORTING_ENDURANCE_EXECUTION_METADATA",
    run_id: RUN_ID,
    artifact_classification: "SUPPORTING_ENDURANCE_EXECUTION_ARTIFACT",
    submission_set_membership: "EXCLUDED_FROM_FINAL_3_JMX_JTL_HTML_SET",
    endpoint: "GET /api/orders/:id",
    execution_status: executionFailure ? "FAILED" : "COMPLETE",
    started_at: startedAt.toISOString(),
    jmeter_started_at: jmeterStartedAt?.toISOString() || null,
    jmeter_ended_at: jmeterEndedAt?.toISOString() || null,
    actual_jmeter_test_duration_seconds: jmeterStartedAt && jmeterEndedAt ? Number(((jmeterEndedAt - jmeterStartedAt) / 1000).toFixed(3)) : null,
    jmeter_version: jmeterVersion,
    plugin_version: pluginVersion,
    jmeter_exit_code: jmeterExitCode,
    jmeter_invocation_count: jmeterInvocationCount,
    rerun_count: 0,
    no_silent_rerun: jmeterInvocationCount <= 1,
    preflight_passed: preflightPassed,
    source_database_sha256_before: before?.source_database || null,
    source_database_sha256_pre_jmeter: preJmeter?.source_database || null,
    source_database_sha256_after_cleanup: after?.source_database || null,
    source_database_integrity_after: sourceIntegrity,
    final_3_production_jmx_unchanged: finalJmxUnchanged,
    supporting_artifacts_unchanged: supportingArtifactsUnchanged,
    raw_jtl: fs.existsSync(RAW_JTL) ? relative(RAW_JTL) : "NONE",
    raw_jtl_sha256: rawHash,
    html_report: html?.path || "NONE",
    resource_monitor: fs.existsSync(path.join(EVIDENCE_DIR, "resource-monitor.csv")) ? relative(path.join(EVIDENCE_DIR, "resource-monitor.csv")) : "NONE",
    threshold_calculation: threshold ? relative(path.join(EVIDENCE_DIR, "endurance-threshold-calculation.json")) : "NOT_COMPUTABLE",
    cleanup,
    secrets,
    performance_interpretation: "NOT_PERFORMED",
    task2_analysis: "NOT_STARTED",
    failure_reason: executionFailure?.message || null,
  };
  writeJson(path.join(EVIDENCE_DIR, "execution-metadata.json"), metadata);
  writeJson(path.join(EVIDENCE_DIR, "postflight.json"), {
    result: executionFailure ? "FAIL" : "PASS",
    source_database_integrity_after: sourceIntegrity,
    final_3_production_jmx_unchanged: finalJmxUnchanged,
    supporting_artifacts_unchanged: supportingArtifactsUnchanged,
    cleanup,
    no_silent_rerun: jmeterInvocationCount <= 1,
    failure_reason: executionFailure?.message || null,
  });
  const output = { status: executionFailure ? "FAIL" : "PASS", run_id: RUN_ID, jmeter_exit_code: jmeterExitCode, jmeter_invocation_count: jmeterInvocationCount, raw_jtl: metadata.raw_jtl, raw_jtl_sha256: rawHash, html_report: metadata.html_report, threshold: threshold?.overall_result || "NOT_COMPUTABLE", source_db_integrity_after: sourceIntegrity, failure_reason: metadata.failure_reason };
  process[executionFailure ? "stderr" : "stdout"].write(`${JSON.stringify(output)}\n`);
  if (executionFailure) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`ENDURANCE_EXECUTION_ABORTED: ${error.message}\n`);
  process.exitCode = 1;
});
