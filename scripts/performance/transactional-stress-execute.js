"use strict";

const crypto = require("crypto");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const { once } = require("events");
const { spawn, spawnSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_BACKEND = path.join(REPO_ROOT, "backend");
const SOURCE_DB = path.join(SOURCE_BACKEND, "database.sqlite");
const RUN_ID = "run-001";
const RUN_ROOT = path.join(REPO_ROOT, "results", "23127107_Stress_20260816", RUN_ID);
const RAW_DIR = path.join(RUN_ROOT, "raw");
const HTML_DIR = path.join(RUN_ROOT, "html");
const EVIDENCE_DIR = path.join(RUN_ROOT, "evidence");
const RAW_JTL = path.join(RAW_DIR, `23127107_Stress_20260816_${RUN_ID}.jtl`);
const JMX = path.join(REPO_ROOT, "test-plans", "23127107_Stress_20260816.jmx");
const CSV = path.join(REPO_ROOT, "test-data", "transactional-admin-coupons.csv");
const DESIGN = path.join(REPO_ROOT, "docs", "performance-design", "stress-admin-coupons-design.md");
const PLAN_REVIEW = path.join(REPO_ROOT, "docs", "performance-reviews", "stress-admin-coupons-jmeter-ai-review.md");
const JMETER = "D:\\Tools\\apache-jmeter-5.6.3\\bin\\jmeter.bat";
const JMETER_ROOT = "D:\\Tools\\apache-jmeter-5.6.3";
const LAUNCHER = path.join(__dirname, "run-approved-load-jmeter.ps1");
const MONITOR_SCRIPT = path.join(__dirname, "monitor-load-resources.ps1");
const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const sqlite3 = require(path.join(SOURCE_BACKEND, "node_modules", "sqlite3"));
const APPROVED_HASHES = Object.freeze({
  jmx: "4F6F14C557792B6E45694B6DD370366D7560BB3A672B348DA472801357B4B322",
  csv: "0F6BA43A82A60493EA1B7BBAFC5990E4170064CDE20FA22A2A61777BC3B4E655",
  design: "A4D101A39F9A3EE2436AE44FC9CB4B87862A2423D77128AAA890EBFA5F28A235",
  plan_review: "3A98FFA23571138F0FAA4FEBEA884BC7BF6CA075C70DB901723A4BC66903CE95",
});

function sha256(filename) {
  return crypto.createHash("sha256").update(fs.readFileSync(filename)).digest("hex").toUpperCase();
}

function relative(filename) {
  return path.relative(REPO_ROOT, filename).replaceAll("\\", "/");
}

function writeJson(filename, value) {
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
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

function assertApprovedArtifacts(actual) {
  for (const [name, expected] of Object.entries(APPROVED_HASHES)) {
    if (actual[name] !== expected) throw new Error(`APPROVED_ARTIFACT_INTEGRITY_FAILURE: ${name}`);
  }
  const expectedCsv = [
    "coupon_code_prefix,type,discount_value,min_order_amount,expired_at,max_uses_per_user,coupon_case,iteration_key",
    "HW05S,percent,10,300000,2099-12-31,1,success_path,stress-admin-coupon-001",
  ];
  const lines = fs.readFileSync(CSV, "utf8").trim().split(/\r?\n/);
  if (lines.length !== expectedCsv.length || !lines.every((line, index) => line === expectedCsv[index])) {
    throw new Error("APPROVED_CSV_INTEGRITY_FAILURE");
  }
  const jmx = fs.readFileSync(JMX, "utf8");
  const checks = [
    "POST /api/admin/coupons",
    "test-data/transactional-admin-coupons.csv",
    "hw05.auth_token",
    "hw05.run_tag",
    "Aggregate Report",
    "<stringProp name=\"baseline-hold-load\">145</stringProp>",
    "<stringProp name=\"increment-five-initial-delay\">20</stringProp>",
    "<stringProp name=\"increment-ten-a-initial-delay\">50</stringProp>",
    "<stringProp name=\"increment-ten-b-initial-delay\">80</stringProp>",
    "<stringProp name=\"ConstantTimer.delay\">1000</stringProp>",
    "<stringProp name=\"RandomTimer.range\">500</stringProp>",
  ];
  if (!checks.every((item) => jmx.includes(item))) throw new Error("APPROVED_JMX_INTEGRITY_FAILURE");
  return actual;
}

function verifyJmeterVersion() {
  const versionLog = path.join(EVIDENCE_DIR, "jmeter-version-engine.log");
  const result = spawnSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", LAUNCHER,
    "-JMeterPath", JMETER, "-VersionOnly", "-VersionLogPath", versionLog], {
    cwd: EVIDENCE_DIR, encoding: "utf8", windowsHide: true,
  });
  fs.writeFileSync(path.join(EVIDENCE_DIR, "jmeter-version-check.log"), `${result.stdout || ""}\n${result.stderr || ""}`, "utf8");
  if (result.error || result.status !== 0 || !/\b5\.6\.3\b/.test(`${result.stdout}\n${result.stderr}`)) {
    throw new Error("ENVIRONMENT_FAILURE: JMeter 5.6.3 version guard failed");
  }
  return "5.6.3";
}

function verifyPlugin() {
  const jar = path.join(JMETER_ROOT, "lib", "ext", "jmeter-plugins-casutg-3.1.1.jar");
  if (!fs.existsSync(jar)) throw new Error("ENVIRONMENT_FAILURE: jpgc-casutg=3.1.1 missing");
  const result = spawnSync("jar", ["tf", jar], { encoding: "utf8", windowsHide: true });
  if (result.status !== 0 || !result.stdout.includes("kg/apc/jmeter/threads/UltimateThreadGroup.class")) {
    throw new Error("ENVIRONMENT_FAILURE: UltimateThreadGroup is not loadable from jpgc-casutg=3.1.1");
  }
  return { result: "PASS", custom_thread_groups: "jpgc-casutg=3.1.1", component: "UltimateThreadGroup", aggregate_report: "CORE_JMETER_COMPONENT" };
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

function copyBackend(runtimeBackend) {
  fs.mkdirSync(runtimeBackend, { recursive: true });
  for (const filename of ["server.js", "database.js", "package.json"]) {
    fs.copyFileSync(path.join(SOURCE_BACKEND, filename), path.join(runtimeBackend, filename));
  }
}

function startBackend(runtimeBackend) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "backend-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "backend-stderr.log"), "w");
  const child = spawn(process.execPath, ["server.js"], {
    cwd: runtimeBackend,
    env: { ...process.env, NODE_PATH: path.join(SOURCE_BACKEND, "node_modules") },
    stdio: ["ignore", stdout, stderr], windowsHide: true,
  });
  child.once("exit", () => { fs.closeSync(stdout); fs.closeSync(stderr); });
  return child;
}

function queryOne(dbFile, sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY, (error) => {
      if (error) return reject(error);
      db.get(sql, params, (queryError, row) => db.close((closeError) => queryError ? reject(queryError) : closeError ? reject(closeError) : resolve(row)));
    });
  });
}

async function waitForSeededAdmin(child, runtimeDb) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`BACKEND_STARTUP_FAILURE: exit ${child.exitCode}`);
    try {
      const admin = await queryOne(runtimeDb, "SELECT id, name, email, password, role FROM users WHERE role = 'admin' ORDER BY id LIMIT 1");
      if (admin && admin.id && admin.email && admin.password && admin.role === "admin") return admin;
    } catch { /* Wait for disposable DB initialization. */ }
    await sleep(250);
  }
  throw new Error("DATA_STATE_FAILURE: seeded admin identity unavailable in disposable runtime");
}

async function requestJson(route, options = {}) {
  const response = await fetch(`${BASE_URL}${route}`, { ...options, signal: AbortSignal.timeout(5000) });
  return { status: response.status, body: await response.json().catch(() => null) };
}

function parseCsvLine(line) {
  const fields = []; let value = ""; let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') { if (quoted && line[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted; }
    else if (character === "," && !quoted) { fields.push(value); value = ""; } else value += character;
  }
  if (quoted) throw new Error("EVIDENCE_FAILURE: unterminated quoted resource CSV field");
  fields.push(value); return fields;
}

const RESOURCE_HEADERS = ["timestamp", "system_cpu_percent", "system_memory_used_bytes", "system_memory_free_bytes", "backend_pid", "backend_alive", "backend_cpu_seconds", "backend_working_set_bytes", "backend_private_memory_bytes", "backend_thread_count"];

function parseResourceCsv() {
  const filename = path.join(EVIDENCE_DIR, "resource-monitor.csv");
  const rows = fs.readFileSync(filename, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  const headers = parseCsvLine(rows.shift() || "");
  if (headers.length !== RESOURCE_HEADERS.length || !headers.every((item, index) => item === RESOURCE_HEADERS[index]) || rows.length < 1) throw new Error("EVIDENCE_FAILURE: resource CSV schema/sample missing");
  const items = rows.map((row) => Object.fromEntries(parseCsvLine(row).map((value, index) => [headers[index], value])));
  if (items.some((item) => item.backend_alive.toLowerCase() !== "true" || !Number.isFinite(Number(item.system_cpu_percent)) || !Number.isFinite(Number(item.backend_working_set_bytes)))) throw new Error("EVIDENCE_FAILURE: resource CSV metrics not parseable");
  return items;
}

function startMonitor(backendPid, stopFile) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "resource-monitor-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "resource-monitor-stderr.log"), "w");
  const evidenceScript = path.join(EVIDENCE_DIR, "monitor-transactional-stress-resources.ps1");
  fs.copyFileSync(MONITOR_SCRIPT, evidenceScript);
  const child = spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", evidenceScript,
    "-OutputDirectory", EVIDENCE_DIR, "-BackendProcessId", String(backendPid), "-StopFile", stopFile], {
    stdio: ["ignore", stdout, stderr], windowsHide: true,
  });
  child.once("exit", () => { fs.closeSync(stdout); fs.closeSync(stderr); });
  return child;
}

async function waitForMonitor(monitor) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (monitor.exitCode !== null) throw new Error("EVIDENCE_FAILURE: resource monitor ended before initial sample");
    const csv = path.join(EVIDENCE_DIR, "resource-monitor.csv");
    if (fs.existsSync(csv) && fs.readFileSync(csv, "utf8").split(/\r?\n/).filter(Boolean).length >= 2) {
      if (fs.statSync(path.join(EVIDENCE_DIR, "resource-monitor-stderr.log")).size !== 0) throw new Error("EVIDENCE_FAILURE: resource monitor stderr not empty");
      return parseResourceCsv();
    }
    await sleep(250);
  }
  throw new Error("EVIDENCE_FAILURE: resource monitor initial sample timeout");
}

function startJmeter(secretFile) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "jmeter-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "jmeter-stderr.log"), "w");
  const child = spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", LAUNCHER,
    "-JMeterPath", JMETER, "-JmxPath", JMX, "-SecretPropertiesPath", secretFile, "-BaseUrl", BASE_URL,
    "-RawJtlPath", RAW_JTL, "-HtmlDirectory", HTML_DIR, "-JMeterLogPath", path.join(EVIDENCE_DIR, "jmeter-run.log")], {
    cwd: REPO_ROOT, stdio: ["ignore", stdout, stderr], windowsHide: true,
  });
  child.once("exit", () => { fs.closeSync(stdout); fs.closeSync(stderr); });
  return child;
}

async function stopChild(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
  await Promise.race([once(child, "exit"), sleep(10000)]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

function summarizeJtl() {
  const rows = fs.readFileSync(RAW_JTL, "utf8").trim().split(/\r?\n/);
  const headers = parseCsvLine(rows.shift() || ""); const successIndex = headers.indexOf("success");
  if (successIndex < 0 || rows.length === 0) throw new Error("JMETER_FAILURE: raw JTL missing samples/success field");
  const successes = rows.map(parseCsvLine).filter((row) => row[successIndex]?.toLowerCase() === "true").length;
  return { total_samples: rows.length, successful_samples: successes, failed_samples: rows.length - successes };
}

function scanSensitiveArtifacts(secretFile) {
  const patterns = { jwt: /eyJ[a-zA-Z0-9_-]{10,}/, password: /"password"\s*:\s*"[^"\r\n]+"/i, reset_token: /"reset_token"\s*:\s*"[^"\r\n]+"/i };
  const found = { jwt: [], password: [], reset_token: [] };
  for (const entry of fs.readdirSync(RUN_ROOT, { recursive: true })) {
    const file = path.join(RUN_ROOT, entry);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile() || file === secretFile) continue;
    const content = fs.readFileSync(file); if (content.includes(0)) continue;
    for (const [type, pattern] of Object.entries(patterns)) if (pattern.test(content.toString("utf8"))) found[type].push(relative(file));
  }
  return found;
}

function deleteRuntime(runtimeRoot) {
  if (!runtimeRoot || !fs.existsSync(runtimeRoot)) return;
  const temp = fs.realpathSync.native(os.tmpdir()); const runtime = fs.realpathSync.native(runtimeRoot); const relation = path.relative(temp, runtime);
  if (!path.basename(runtime).startsWith("hw05-transactional-stress-") || relation.startsWith("..") || path.isAbsolute(relation)) throw new Error("Refusing cleanup outside temporary transactional runtime");
  fs.rmSync(runtime, { recursive: true, force: true });
}

async function main() {
  if (fs.existsSync(RUN_ROOT)) throw new Error(`RUN_ID_COLLISION: ${relative(RUN_ROOT)}`);
  fs.mkdirSync(RAW_DIR, { recursive: true }); fs.mkdirSync(HTML_DIR, { recursive: true }); fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  let runtimeRoot; let secretFile; let backend; let monitor; let monitorStop; let jmeter; let sourceBefore; let sourcePreJmeter; let sourceAfter;
  let jmeterExit = null; let jmeterStarted; let jmeterEnded; let invocationCount = 0; let failure = null; let preflight = { result: "FAIL" }; let resourceItems = [];
  const startedAt = new Date();
  try {
    sourceBefore = fingerprints(); assertApprovedArtifacts(sourceBefore);
    if (!fs.existsSync(JMETER) || !fs.existsSync(LAUNCHER) || !fs.existsSync(MONITOR_SCRIPT)) throw new Error("ENVIRONMENT_FAILURE: required execution tooling missing");
    const jmeterVersion = verifyJmeterVersion(); const plugin = verifyPlugin(); await assertPortAvailable();
    runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hw05-transactional-stress-")); const runtimeBackend = path.join(runtimeRoot, "backend"); const runtimeDb = path.join(runtimeBackend, "database.sqlite");
    if (path.resolve(runtimeDb).toLowerCase() === path.resolve(SOURCE_DB).toLowerCase()) throw new Error("DATA_STATE_FAILURE: runtime database equals source database");
    copyBackend(runtimeBackend); backend = startBackend(runtimeBackend); fs.writeFileSync(path.join(EVIDENCE_DIR, "backend.pid"), `${backend.pid}\n`, "utf8");
    const admin = await waitForSeededAdmin(backend, runtimeDb);
    const login = await requestJson("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: admin.email, password: admin.password }) });
    if (login.status !== 200 || typeof login.body?.token !== "string" || !login.body.token) throw new Error("TOKEN_PROVISION_FAILURE: authenticated seeded identity unavailable");
    secretFile = path.join(runtimeRoot, "hw05-transactional-secrets.properties"); fs.writeFileSync(secretFile, `hw05.auth_token=${login.body.token}\nhw05.run_tag=${RUN_ID}\n`, { encoding: "utf8", mode: 0o600 });
    const preflightCode = `HW05PREFLIGHT-${RUN_ID}-coupon-0001`;
    const body = { code: preflightCode, type: "percent", discount_value: 10, min_order_amount: 300000, expired_at: "2099-12-31", max_uses_per_user: 1 };
    const success = await requestJson("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.body.token}` }, body: JSON.stringify(body) });
    if (success.status !== 200 || success.body?.message !== "Coupon created" || !Number.isInteger(success.body?.id) || success.body.id <= 0) throw new Error("DATA_STATE_FAILURE: coupon success preflight failed");
    const missingToken = await requestJson("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, code: "HW05PREFLIGHT-no-token-0001" }) });
    if (missingToken.status !== 401) throw new Error(`SUT_FAILURE: token fail-closed expected HTTP 401, got ${missingToken.status}`);
    const generated = new Set(); for (let thread = 1; thread <= 30; thread += 1) for (let iteration = 1; iteration <= 3; iteration += 1) generated.add(`HW05S-${RUN_ID}-t${thread}-i${iteration}`);
    if (generated.size !== 90 || [...generated].some((code) => code.startsWith("HW05PREFLIGHT"))) throw new Error("DATA_STATE_FAILURE: deterministic uniqueness validation failed");
    sourcePreJmeter = fingerprints(); assertApprovedArtifacts(sourcePreJmeter);
    if (sourcePreJmeter.source_database !== sourceBefore.source_database) throw new Error("DATA_STATE_FAILURE: source DB changed before JMeter");
    monitorStop = path.join(EVIDENCE_DIR, "resource-monitor.stop"); monitor = startMonitor(backend.pid, monitorStop); fs.writeFileSync(path.join(EVIDENCE_DIR, "resource-monitor.pid"), `${monitor.pid}\n`, "utf8"); resourceItems = await waitForMonitor(monitor);
    preflight = { evidence_type: "HW05_PRODUCTION_TRANSACTIONAL_STRESS_PREFLIGHT", result: "PASS", captured_at: new Date().toISOString(), run_id: RUN_ID, endpoint: "POST /api/admin/coupons", group: "TRANSACTIONAL", scenario: "STRESS", source_database_sha256_before: sourceBefore.source_database, source_database_sha256_pre_jmeter: sourcePreJmeter.source_database, approved_artifact_fingerprints: sourcePreJmeter, runtime_isolation: "DISPOSABLE_BACKEND_RUNTIME_COPY", runtime_database_is_source_database: false, authenticated_identity: { id: admin.id, email: admin.email, role: admin.role }, server_side_admin_role_check: "NOT_IMPLEMENTED", implementation_spec_conflict: "PRESERVED", token_value_recorded: false, run_tag: RUN_ID, namespace_separation: "PASS", success_preflight: { result: "PASS", http_status: success.status, positive_id: true, measured_traffic: false }, token_fail_closed: { result: "PASS", http_status: missingToken.status, measured_traffic: false }, unique_code_model: { result: "PASS", generated_diagnostic_codes: generated.size, cross_thread: "PASS", cross_iteration: "PASS", cross_run: "PASS" }, jmeter_version: jmeterVersion, plugin_verification: plugin, resource_monitor: { result: "PASS", backend_pid: backend.pid, monitor_pid: monitor.pid, initial_sample_count: resourceItems.length }, jmeter_invocation_count_before_execution: 0 };
    writeJson(path.join(EVIDENCE_DIR, "preflight.json"), preflight); writeJson(path.join(EVIDENCE_DIR, "monitor-preflight.json"), preflight.resource_monitor);
    jmeterStarted = new Date(); writeJson(path.join(EVIDENCE_DIR, "execution-start.json"), { run_id: RUN_ID, started_at: jmeterStarted.toISOString(), endpoint: "POST /api/admin/coupons", group: "TRANSACTIONAL", scenario: "STRESS", jmx_path: relative(JMX), csv_path: relative(CSV), backend_pid: backend.pid, monitor_pid: monitor.pid, jmeter_version: jmeterVersion, plugin: "jpgc-casutg=3.1.1", planned_duration_seconds: 145, think_time: "1000-1500 ms", listener: "Aggregate Report", run_tag: RUN_ID, preflight: "PASS", token_recorded: false, jmeter_invocation_number: 1 });
    invocationCount = 1; jmeter = startJmeter(secretFile); fs.writeFileSync(path.join(EVIDENCE_DIR, "jmeter.pid"), `${jmeter.pid}\n`, "utf8"); [jmeterExit] = await once(jmeter, "exit"); jmeterEnded = new Date();
    if (jmeterExit !== 0) throw new Error(`JMETER_FAILURE: exit ${jmeterExit}`);
  } catch (error) { failure = error; }
  finally {
    try { if (monitor && monitor.exitCode === null) { fs.writeFileSync(monitorStop, `${new Date().toISOString()}\n`, "utf8"); await Promise.race([once(monitor, "exit"), sleep(10000)]); await stopChild(monitor); } await stopChild(backend); if (secretFile && fs.existsSync(secretFile)) fs.rmSync(secretFile, { force: true }); deleteRuntime(runtimeRoot); } catch (error) { failure ||= error; }
  }
  try { sourceAfter = fingerprints(); if (sourceBefore && sourceAfter.source_database !== sourceBefore.source_database) failure ||= new Error("DATA_STATE_FAILURE: source DB changed after cleanup"); } catch (error) { failure ||= error; }
  let jtlFacts = null; let rawHash = null; let htmlIndex = null; let sensitive = { jwt: [], password: [], reset_token: [] }; let resourceSummary = null;
  if (!failure) {
    try { jtlFacts = summarizeJtl(); rawHash = sha256(RAW_JTL); htmlIndex = path.join(HTML_DIR, "index.html"); if (!fs.existsSync(htmlIndex) || fs.statSync(htmlIndex).size === 0) throw new Error("JMETER_FAILURE: HTML report missing"); resourceItems = parseResourceCsv(); resourceSummary = { evidence_type: "FACTUAL_RESOURCE_CAPTURE_SUMMARY", interpretation_performed: false, sample_count: resourceItems.length, backend_not_alive_samples: resourceItems.filter((item) => item.backend_alive.toLowerCase() !== "true").length, first_timestamp: resourceItems[0].timestamp, last_timestamp: resourceItems.at(-1).timestamp }; writeJson(path.join(EVIDENCE_DIR, "resource-summary.json"), resourceSummary); sensitive = scanSensitiveArtifacts(secretFile); if (Object.values(sensitive).some((items) => items.length)) throw new Error("SENSITIVE_EVIDENCE_RISK"); } catch (error) { failure = error; }
  }
  const cleanup = { backend_stopped: !backend || backend.exitCode !== null, temporary_secret_deleted: !secretFile || !fs.existsSync(secretFile), disposable_runtime_deleted: !runtimeRoot || !fs.existsSync(runtimeRoot), source_database_sha256_after: sourceAfter?.source_database || null, source_database_integrity_after: sourceBefore?.source_database === sourceAfter?.source_database ? "PASS" : "FAIL" };
  writeJson(path.join(EVIDENCE_DIR, "postflight.json"), { result: failure ? "FAIL" : "PASS", ...cleanup, failure_reason: failure?.message || null }); writeJson(path.join(EVIDENCE_DIR, "cleanup-verification.json"), cleanup);
  const metadata = { evidence_type: "HW05_PRODUCTION_TRANSACTIONAL_STRESS_EXECUTION_METADATA", student_id: "23127107", run_id: RUN_ID, endpoint: "POST /api/admin/coupons", group: "TRANSACTIONAL", scenario: "STRESS", execution_status: failure ? "FAILED" : "COMPLETE", started_at: startedAt.toISOString(), jmeter_started_at: jmeterStarted?.toISOString() || null, jmeter_ended_at: jmeterEnded?.toISOString() || null, actual_duration_seconds: jmeterStarted && jmeterEnded ? Number(((jmeterEnded - jmeterStarted) / 1000).toFixed(3)) : null, jmeter_exit_code: jmeterExit, jmeter_invocation_count: invocationCount, rerun_count: 0, no_silent_rerun: invocationCount <= 1, preflight_passed: preflight.result === "PASS", raw_jtl: fs.existsSync(RAW_JTL) ? relative(RAW_JTL) : "NOT_CREATED", raw_jtl_sha256: rawHash, html_report: htmlIndex && fs.existsSync(htmlIndex) ? relative(htmlIndex) : "NOT_CREATED", resource_monitor: fs.existsSync(path.join(EVIDENCE_DIR, "resource-monitor.csv")) ? relative(path.join(EVIDENCE_DIR, "resource-monitor.csv")) : "NOT_CREATED", resource_summary: resourceSummary ? relative(path.join(EVIDENCE_DIR, "resource-summary.json")) : "NOT_CREATED", jtl_facts: jtlFacts, source_database_sha256_before: sourceBefore?.source_database || null, source_database_sha256_pre_jmeter: sourcePreJmeter?.source_database || null, source_database_sha256_after_cleanup: sourceAfter?.source_database || null, source_database_integrity_after: cleanup.source_database_integrity_after, sensitive_value_exposure: { jwt: sensitive.jwt.length ? "YES" : "NO", password: sensitive.password.length ? "YES" : "NO", reset_token: sensitive.reset_token.length ? "YES" : "NO", paths: Object.values(sensitive).flat() }, performance_interpretation: "NOT_PERFORMED", task2_analysis: "NOT_STARTED", failure_reason: failure?.message || null };
  writeJson(path.join(EVIDENCE_DIR, "execution-metadata.json"), metadata);
  process.stdout.write(`${JSON.stringify({ status: failure ? "FAIL" : "PASS", run_id: RUN_ID, jmeter_exit_code: jmeterExit, jmeter_invocation_count: invocationCount, raw_jtl: metadata.raw_jtl, raw_jtl_sha256: rawHash, html_report: metadata.html_report, resource_samples: resourceSummary?.sample_count || 0, total_samples: jtlFacts?.total_samples ?? null, successful_samples: jtlFacts?.successful_samples ?? null, failed_samples: jtlFacts?.failed_samples ?? null, source_database_integrity_after: cleanup.source_database_integrity_after, failure_reason: failure?.message || null })}\n`);
  if (failure) process.exitCode = 1;
}

main().catch((error) => { process.stderr.write(`TRANSACTIONAL_STRESS_EXECUTION_ABORTED: ${error.message}\n`); process.exitCode = 1; });
