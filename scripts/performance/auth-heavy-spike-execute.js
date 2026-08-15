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
const runIdArgumentIndex = process.argv.indexOf("--run-id");
const RUN_ID = runIdArgumentIndex >= 0 ? process.argv[runIdArgumentIndex + 1] : "run-001";
const RUN_ROOT = path.join(REPO_ROOT, "results", "23127107_Spike_20260816", RUN_ID);
const RAW_DIR = path.join(RUN_ROOT, "raw");
const HTML_DIR = path.join(RUN_ROOT, "html");
const EVIDENCE_DIR = path.join(RUN_ROOT, "evidence");
const RAW_JTL = path.join(RAW_DIR, `23127107_Spike_20260816_${RUN_ID}.jtl`);
const JMX = path.join(REPO_ROOT, "test-plans", "23127107_Spike_20260816.jmx");
const CSV = path.join(REPO_ROOT, "test-data", "auth-heavy-users-me.csv");
const DESIGN = path.join(REPO_ROOT, "docs", "performance-design", "spike-users-me-design.md");
const PLAN_REVIEW = path.join(REPO_ROOT, "docs", "performance-reviews", "spike-users-me-jmeter-ai-review.md");
const JMETER = "D:\\Tools\\apache-jmeter-5.6.3\\bin\\jmeter.bat";
const JMETER_ROOT = "D:\\Tools\\apache-jmeter-5.6.3";
const MONITOR_SCRIPT = path.join(__dirname, "monitor-load-resources.ps1");
const JMETER_LAUNCHER = path.join(__dirname, "run-approved-load-jmeter.ps1");
const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const sqlite3 = require(path.join(SOURCE_BACKEND, "node_modules", "sqlite3"));

const EXPECTED_HASHES = Object.freeze({
  jmx: "64E17D39739D7656296840EA84A429BDD3F60FCC5C0F95CFAC907F30F5E144B6",
  csv: "B511539176DA16D396DFA2B3FC1DF02DFFA4236B2DF4C48A0FB33721A5877A3C",
  design: "A4E26C5DE9EC71B7293961D9E943B05C4F35F1ADD6D18E5C81C02AF5CBC11921",
  plan_review: "68A2651FB66B46C2545C27DCB6542DCEDDBF3B431D5C4FB89AEAEDC31D5EEB10",
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
  for (const [key, expected] of Object.entries(EXPECTED_HASHES)) {
    if (actual[key] !== expected) throw new Error(`APPROVED_ARTIFACT_INTEGRITY_FAILURE: ${key}`);
  }
  const expectedCsv = [
    "expected_user_id,expected_email,expected_name,auth_case,iteration_key",
    "2,test@eshop.com,Test User,authenticated_success,auth-users-me-success-001",
  ];
  const csvLines = fs.readFileSync(CSV, "utf8").trim().split(/\r?\n/);
  if (csvLines.length !== expectedCsv.length || !csvLines.every((line, index) => line === expectedCsv[index])) {
    throw new Error("APPROVED_CSV_INTEGRITY_FAILURE");
  }
}

function verifyApprovedWorkload() {
  const jmx = fs.readFileSync(JMX, "utf8");
  const checks = {
    baseline_5: jmx.includes('<stringProp name="baseline-start-threads">5</stringProp>'),
    baseline_window_68: jmx.includes('<stringProp name="baseline-initial-delay">0</stringProp>')
      && jmx.includes('<stringProp name="baseline-startup-time">1</stringProp>')
      && jmx.includes('<stringProp name="baseline-hold-load">66</stringProp>')
      && jmx.includes('<stringProp name="baseline-shutdown-time">1</stringProp>'),
    spike_20_additional: jmx.includes('<stringProp name="spike-start-threads">20</stringProp>'),
    spike_timing: jmx.includes('<stringProp name="spike-initial-delay">20</stringProp>')
      && jmx.includes('<stringProp name="spike-startup-time">3</stringProp>')
      && jmx.includes('<stringProp name="spike-hold-load">20</stringProp>')
      && jmx.includes('<stringProp name="spike-shutdown-time">5</stringProp>'),
    uniform_timer_250_plus_250: jmx.includes('<stringProp name="ConstantTimer.delay">250</stringProp>')
      && jmx.includes('<stringProp name="RandomTimer.range">250</stringProp>'),
    external_token: jmx.includes("Bearer ${__P(hw05.auth_token,)}"),
    response_times_listener: jmx.includes("ResponseTimesOverTimeGui"),
    csv_binding: jmx.includes("test-data/auth-heavy-users-me.csv"),
  };
  if (!Object.values(checks).every(Boolean)) throw new Error("APPROVED_WORKLOAD_TRACEABILITY_FAILURE");
  return {
    result: "PASS",
    approved_profile: "5 VUs / 20s -> 25 VUs in 3s -> 25 VUs / 20s -> 5 VUs in 5s -> 5 VUs / 20s",
    planned_window_seconds: 68,
    think_time: "Uniform Random Timer 250-500 ms",
    listener: "jp@gc - Response Times Over Time",
    checks,
  };
}

function verifyJmeterVersion(logDirectory) {
  const outputLog = path.join(logDirectory, "jmeter-version-check.log");
  const engineLog = path.join(logDirectory, "jmeter-version-engine.log");
  const result = spawnSync("powershell.exe", [
    "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", JMETER_LAUNCHER,
    "-JMeterPath", JMETER,
    "-VersionOnly",
    "-VersionLogPath", engineLog,
  ], {
    cwd: logDirectory,
    encoding: "utf8",
    windowsHide: true,
  });
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  fs.writeFileSync(outputLog, output, "utf8");
  if (result.error || result.status !== 0 || !/\b5\.6\.3\b/.test(output)) {
    const detail = result.error?.code || result.signal || `exit ${result.status}`;
    throw new Error(`ENVIRONMENT_FAILURE: JMeter CLI 5.6.3 verification failed (${detail})`);
  }
  return "5.6.3";
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
    env: {
      ...process.env,
      NODE_PATH: path.join(SOURCE_BACKEND, "node_modules"),
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

async function waitForSeededUser(child, runtimeDb) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`BACKEND_STARTUP_FAILURE: exit ${child.exitCode}`);
    try {
      const db = await new Promise((resolve, reject) => {
        const connection = new sqlite3.Database(runtimeDb, sqlite3.OPEN_READONLY, (error) => (error ? reject(error) : resolve(connection)));
      });
      const user = await new Promise((resolve, reject) => db.get(
        "SELECT id, name, email, role FROM users WHERE id = 2",
        (error, row) => (error ? reject(error) : resolve(row)),
      ));
      await new Promise((resolve, reject) => db.close((error) => (error ? reject(error) : resolve())));
      if (user && user.id === 2 && user.name === "Test User" && user.email === "test@eshop.com" && user.role === "user") return user;
    } catch {
      // Retry while database initialization is in progress.
    }
    await sleep(250);
  }
  throw new Error("SEEDED_IDENTITY_FAILURE");
}

async function requestJson(route, options = {}) {
  const response = await fetch(`${BASE_URL}${route}`, { ...options, signal: AbortSignal.timeout(5000) });
  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

function createClasspath() {
  return `${JMETER_ROOT}\\lib\\*;${JMETER_ROOT}\\lib\\ext\\*`;
}

function verifyPlugins(runtimeRoot) {
  const expectedJars = [
    path.join(JMETER_ROOT, "lib", "ext", "jmeter-plugins-graphs-basic-2.0.jar"),
    path.join(JMETER_ROOT, "lib", "ext", "jmeter-plugins-casutg-3.1.1.jar"),
    path.join(JMETER_ROOT, "lib", "ext", "jmeter-plugins-manager-1.12.jar"),
    path.join(JMETER_ROOT, "lib", "jmeter-plugins-cmn-jmeter-0.7.jar"),
  ];
  if (!expectedJars.every((jar) => fs.existsSync(jar))) throw new Error("ENVIRONMENT_FAILURE: required JMeter plugin JAR missing");
  const verifier = path.join(runtimeRoot, "VerifyJMeterPlugin.java");
  fs.writeFileSync(verifier, `public class VerifyJMeterPlugin {\n  public static void main(String[] args) throws Exception {\n    System.out.println(Class.forName(\"kg.apc.jmeter.vizualizers.ResponseTimesOverTimeGui\").getName());\n    System.out.println(Class.forName(\"kg.apc.jmeter.vizualizers.CorrectedResultCollector\").getName());\n    System.out.println(Class.forName(\"kg.apc.jmeter.threads.UltimateThreadGroup\").getName());\n  }\n}\n`, "utf8");
  const result = spawnSync("java", ["--class-path", createClasspath(), verifier], { encoding: "utf8", windowsHide: true });
  fs.rmSync(verifier, { force: true });
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  if (result.status !== 0
    || !output.includes("ResponseTimesOverTimeGui")
    || !output.includes("CorrectedResultCollector")
    || !output.includes("UltimateThreadGroup")) {
    throw new Error("ENVIRONMENT_FAILURE: required JMeter component class not loadable");
  }
  return {
    result: "PASS",
    jmeter_version: "5.6.3",
    graphs_basic: "jpgc-graphs-basic=2.0",
    custom_thread_groups: "jpgc-casutg=3.1.1",
    plugins_manager: "jpgc-plugins-manager=1.12",
    listener: "jp@gc - Response Times Over Time",
    listener_gui_class: "kg.apc.jmeter.vizualizers.ResponseTimesOverTimeGui",
  };
}

function startMonitor(backendPid, stopFile) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "resource-monitor-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "resource-monitor-stderr.log"), "w");
  const evidenceScript = path.join(EVIDENCE_DIR, "monitor-spike-resources.ps1");
  fs.copyFileSync(MONITOR_SCRIPT, evidenceScript);
  const child = spawn("powershell.exe", [
    "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", evidenceScript,
    "-OutputDirectory", EVIDENCE_DIR,
    "-BackendProcessId", String(backendPid),
    "-StopFile", stopFile,
  ], { stdio: ["ignore", stdout, stderr], windowsHide: true });
  child.once("exit", () => {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
  });
  return child;
}

async function waitForMonitor(monitor) {
  const csv = path.join(EVIDENCE_DIR, "resource-monitor.csv");
  const hardware = path.join(EVIDENCE_DIR, "hardware-context.json");
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (monitor.exitCode !== null) throw new Error("EVIDENCE_FAILURE: resource monitor stopped before initial sample");
    if (fs.existsSync(csv) && fs.existsSync(hardware) && fs.readFileSync(csv, "utf8").trim().split(/\r?\n/).length >= 2) {
      const stderr = path.join(EVIDENCE_DIR, "resource-monitor-stderr.log");
      if (fs.statSync(stderr).size !== 0) throw new Error("EVIDENCE_FAILURE: resource monitor stderr is not empty");
      return;
    }
    await sleep(250);
  }
  throw new Error("EVIDENCE_FAILURE: resource monitor initial sample timeout");
}

function startJmeter(secretFile) {
  const stdout = fs.openSync(path.join(EVIDENCE_DIR, "jmeter-stdout.log"), "w");
  const stderr = fs.openSync(path.join(EVIDENCE_DIR, "jmeter-stderr.log"), "w");
  const launcher = path.join(EVIDENCE_DIR, "run-approved-spike-jmeter.ps1");
  fs.copyFileSync(JMETER_LAUNCHER, launcher);
  const child = spawn("powershell.exe", [
    "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", launcher,
    "-JMeterPath", JMETER,
    "-JmxPath", JMX,
    "-SecretPropertiesPath", secretFile,
    "-BaseUrl", BASE_URL,
    "-RawJtlPath", RAW_JTL,
    "-HtmlDirectory", HTML_DIR,
    "-JMeterLogPath", path.join(EVIDENCE_DIR, "jmeter-run.log"),
  ], { cwd: REPO_ROOT, stdio: ["ignore", stdout, stderr], windowsHide: true });
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
  if (child.exitCode === null) child.kill("SIGKILL");
}

const RESOURCE_CSV_HEADERS = Object.freeze([
  "timestamp",
  "system_cpu_percent",
  "system_memory_used_bytes",
  "system_memory_free_bytes",
  "backend_pid",
  "backend_alive",
  "backend_cpu_seconds",
  "backend_working_set_bytes",
  "backend_private_memory_bytes",
  "backend_thread_count",
]);

function parseResourceCsv(resourceCsv = path.join(EVIDENCE_DIR, "resource-monitor.csv")) {
  const content = fs.readFileSync(resourceCsv, "utf8").replace(/^\uFEFF/, "");
  const rows = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (rows.length < 2) throw new Error("EVIDENCE_FAILURE: resource monitor CSV has no samples");

  const headers = parseCsvLine(rows.shift());
  if (headers.length !== RESOURCE_CSV_HEADERS.length
    || !headers.every((header, index) => header === RESOURCE_CSV_HEADERS[index])) {
    throw new Error("EVIDENCE_FAILURE: resource monitor CSV schema mismatch");
  }

  return rows.map((line, rowIndex) => {
    const fields = parseCsvLine(line);
    if (fields.length !== headers.length) {
      throw new Error(`EVIDENCE_FAILURE: resource monitor CSV row ${rowIndex + 2} has ${fields.length} columns`);
    }
    const item = Object.fromEntries(fields.map((value, index) => [headers[index], value]));
    const numericFields = [
      "system_cpu_percent",
      "system_memory_used_bytes",
      "system_memory_free_bytes",
      "backend_pid",
    ];
    if (!item.timestamp || !Number.isFinite(Date.parse(item.timestamp))
      || numericFields.some((field) => !Number.isFinite(Number(item[field])))
      || !["true", "false"].includes(item.backend_alive.toLowerCase())) {
      throw new Error(`EVIDENCE_FAILURE: resource monitor CSV row ${rowIndex + 2} is invalid`);
    }
    if (item.backend_alive.toLowerCase() === "true"
      && ["backend_cpu_seconds", "backend_working_set_bytes", "backend_private_memory_bytes", "backend_thread_count"]
        .some((field) => !Number.isFinite(Number(item[field])))) {
      throw new Error(`EVIDENCE_FAILURE: live backend metrics missing in resource monitor CSV row ${rowIndex + 2}`);
    }
    return item;
  });
}

function summarizeResources(resourceCsv) {
  const items = parseResourceCsv(resourceCsv);
  const values = (field) => items.map((item) => Number(item[field])).filter(Number.isFinite);
  const aggregate = (field) => {
    const sample = values(field);
    return {
      minimum: Math.min(...sample),
      average: Number((sample.reduce((total, value) => total + value, 0) / sample.length).toFixed(2)),
      maximum: Math.max(...sample),
    };
  };
  return {
    evidence_type: "FACTUAL_RESOURCE_CAPTURE_SUMMARY",
    interpretation_performed: false,
    sample_count: items.length,
    first_timestamp: items[0]?.timestamp || null,
    last_timestamp: items.at(-1)?.timestamp || null,
    backend_pid: Number(items[0]?.backend_pid),
    backend_not_alive_samples: items.filter((item) => item.backend_alive.toLowerCase() !== "true").length,
    system_cpu_percent: aggregate("system_cpu_percent"),
    system_memory_used_bytes: aggregate("system_memory_used_bytes"),
    system_memory_free_bytes: aggregate("system_memory_free_bytes"),
    backend_working_set_bytes: aggregate("backend_working_set_bytes"),
    backend_private_memory_bytes: aggregate("backend_private_memory_bytes"),
  };
}

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted;
    } else if (character === "," && !quoted) { values.push(value); value = ""; } else value += character;
  }
  if (quoted) throw new Error("EVIDENCE_FAILURE: CSV has an unterminated quoted field");
  values.push(value);
  return values;
}

function inspectJtl() {
  const lines = fs.readFileSync(RAW_JTL, "utf8").trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("JMETER_FAILURE: raw JTL has no samples");
  const headers = parseCsvLine(lines.shift());
  const successIndex = headers.indexOf("success");
  if (successIndex < 0) throw new Error("JMETER_FAILURE: raw JTL lacks success column");
  const samples = lines.map(parseCsvLine);
  const successful = samples.filter((row) => row[successIndex].toLowerCase() === "true").length;
  return { total_samples: samples.length, successful_samples: successful, failed_samples: samples.length - successful };
}

function scanSensitiveArtifacts(secretFile) {
  const evidenceFiles = fs.readdirSync(RUN_ROOT, { recursive: true })
    .map((entry) => path.join(RUN_ROOT, entry))
    .filter((filename) => fs.existsSync(filename) && fs.statSync(filename).isFile() && filename !== secretFile);
  const patterns = {
    jwt: /eyJ[a-zA-Z0-9_-]{10,}/,
    password: /Test1234!|"password"\s*:\s*"[^"\r\n]+"/i,
    reset_token: /"reset_token"\s*:\s*"[^"\r\n]+"/i,
  };
  const found = { jwt: [], password: [], reset_token: [] };
  for (const filename of evidenceFiles) {
    const content = fs.readFileSync(filename);
    if (content.includes(0)) continue;
    const text = content.toString("utf8");
    for (const [name, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) found[name].push(relative(filename));
    }
  }
  return found;
}

function deleteRuntime(runtimeRoot) {
  if (!runtimeRoot || !fs.existsSync(runtimeRoot)) return;
  const temp = fs.realpathSync.native(os.tmpdir());
  const runtime = fs.realpathSync.native(runtimeRoot);
  const relation = path.relative(temp, runtime);
  if (!path.basename(runtime).startsWith("hw05-auth-heavy-spike-") || relation.startsWith("..") || path.isAbsolute(relation)) {
    throw new Error("Refusing disposable-runtime cleanup outside approved OS temp namespace");
  }
  fs.rmSync(runtime, { recursive: true, force: true });
}

async function main() {
  if (!/^run-\d{3}$/.test(RUN_ID)) throw new Error("INVALID_RUN_ID");
  if (fs.existsSync(RUN_ROOT)) throw new Error(`RUN_ID_COLLISION: ${relative(RUN_ROOT)}`);
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

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
  let jmeterInvocations = 0;
  let sourceBefore;
  let sourceBeforeJmeter;
  let sourceAfter;
  let pluginVerification;
  let workloadTraceability;
  let preflight = { result: "FAIL" };
  let failure = null;

  try {
    sourceBefore = fingerprints();
    assertApprovedArtifacts(sourceBefore);
    if (!fs.existsSync(JMETER)) throw new Error("ENVIRONMENT_FAILURE: JMeter 5.6.3 CLI missing");
    if (!fs.existsSync(MONITOR_SCRIPT) || !fs.existsSync(JMETER_LAUNCHER)) throw new Error("EVIDENCE_FAILURE: approved execution tooling missing");
    verifyJmeterVersion(EVIDENCE_DIR);
    workloadTraceability = verifyApprovedWorkload();
    await assertPortAvailable();

    runtimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hw05-auth-heavy-spike-"));
    runtimeBackend = path.join(runtimeRoot, "backend");
    runtimeDb = path.join(runtimeBackend, "database.sqlite");
    secretFile = path.join(runtimeRoot, "hw05-spike-secrets.properties");
    copyBackend(runtimeBackend);
    if (path.resolve(runtimeDb).toLowerCase() === path.resolve(SOURCE_DB).toLowerCase()) {
      throw new Error("DATA_STATE_FAILURE: runtime DB equals source DB");
    }
    pluginVerification = verifyPlugins(runtimeRoot);
    backend = startBackend(runtimeBackend);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "backend.pid"), `${backend.pid}\n`, "utf8");
    const seededUser = await waitForSeededUser(backend, runtimeDb);

    const login = await requestJson("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@eshop.com", password: "Test1234!" }),
    });
    if (login.status !== 200 || typeof login.body?.token !== "string" || login.body.token.length === 0) {
      throw new Error("TOKEN_PROVISION_FAILURE: setup-only login did not return a token");
    }
    fs.writeFileSync(secretFile, `hw05.auth_token=${login.body.token}\n`, { encoding: "utf8", mode: 0o600 });

    const identity = await requestJson("/api/users/me", { headers: { Authorization: `Bearer ${login.body.token}` } });
    if (identity.status !== 200 || identity.body?.id !== 2 || identity.body?.email !== "test@eshop.com" || identity.body?.name !== "Test User") {
      throw new Error("SEEDED_IDENTITY_FAILURE: authenticated identity mismatch");
    }
    const missingToken = await requestJson("/api/users/me");
    if (missingToken.status !== 401) throw new Error(`FAIL_CLOSED_TOKEN_FAILURE: expected 401, got ${missingToken.status}`);

    sourceBeforeJmeter = fingerprints();
    assertApprovedArtifacts(sourceBeforeJmeter);
    const stopFile = path.join(EVIDENCE_DIR, "resource-monitor.stop");
    monitorStopFile = stopFile;
    monitor = startMonitor(backend.pid, stopFile);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "resource-monitor.pid"), `${monitor.pid}\n`, "utf8");
    await waitForMonitor(monitor);
    const initialResources = summarizeResources();
    if (initialResources.sample_count < 1 || initialResources.backend_not_alive_samples !== 0) {
      throw new Error("EVIDENCE_FAILURE: initial resource monitor sample invalid");
    }

    preflight = {
      evidence_type: "HW05_PRODUCTION_AUTH_HEAVY_SPIKE_PREFLIGHT",
      captured_at: new Date().toISOString(),
      result: "PASS",
      student_id: "23127107",
      run_id: RUN_ID,
      endpoint: "GET /api/users/me",
      group: "AUTH_HEAVY",
      scenario: "SPIKE",
      source_database_sha256_before: sourceBefore.source_database,
      source_database_sha256_before_jmeter: sourceBeforeJmeter.source_database,
      source_database_unchanged_before_jmeter: sourceBefore.source_database === sourceBeforeJmeter.source_database,
      approved_artifact_fingerprints: sourceBeforeJmeter,
      approved_artifact_integrity: "PASS",
      runtime_isolation: "DISPOSABLE_BACKEND_RUNTIME_COPY",
      runtime_location: "OS_TEMP_OUTSIDE_REPOSITORY",
      runtime_database_path_is_source_database: false,
      seeded_identity: { id: seededUser.id, name: seededUser.name, email: seededUser.email, role: seededUser.role },
      setup_login: { measured_traffic: false, result: "PASS", token_value_recorded: false },
      authenticated_identity: { result: "PASS", http_status: identity.status, id: identity.body.id, email: identity.body.email, name: identity.body.name },
      fail_closed_token_check: { result: "PASS", measured_traffic: false, missing_token_http_status: missingToken.status },
      plugin_verification: pluginVerification,
      workload_traceability: workloadTraceability,
      resource_monitor: { result: "PASS", backend_pid: backend.pid, monitor_pid: monitor.pid, initial_samples: initialResources.sample_count, stderr_empty: true },
      token_value_recorded: false,
      full_response_body_recorded: false,
      jmeter_invocation_count_before_execution: 0,
    };
    writeJson(path.join(EVIDENCE_DIR, "preflight.json"), preflight);
    writeJson(path.join(EVIDENCE_DIR, "monitor-preflight.json"), preflight.resource_monitor);

    jmeterStartedAt = new Date();
    writeJson(path.join(EVIDENCE_DIR, "execution-start.json"), {
      started_at: jmeterStartedAt.toISOString(),
      student_id: "23127107",
      run_id: RUN_ID,
      scenario: "SPIKE",
      group: "AUTH_HEAVY",
      endpoint: "GET /api/users/me",
      jmx_path: relative(JMX),
      csv_path: relative(CSV),
      backend_pid: backend.pid,
      monitor_pid: monitor.pid,
      jmeter_version: "5.6.3",
      plugin_versions: { graphs_basic: "2.0", casutg: "3.1.1" },
      approved_profile: workloadTraceability.approved_profile,
      planned_window_seconds: 68,
      think_time: "250-500 ms",
      listener: "jp@gc - Response Times Over Time",
      preflight_result: "PASS",
      command: "jmeter -n -t <approved-jmx> -q <temporary-secret-properties-file> -JbaseUrl=http://127.0.0.1:3000 -l <raw-jtl> -e -o <html> -j <jmeter-log>",
      token_recorded: false,
      jmeter_invocation_number: 1,
    });
    jmeterInvocations = 1;
    jmeter = startJmeter(secretFile);
    fs.writeFileSync(path.join(EVIDENCE_DIR, "jmeter.pid"), `${jmeter.pid}\n`, "utf8");
    [jmeterExitCode] = await once(jmeter, "exit");
    jmeterEndedAt = new Date();
    if (jmeterExitCode !== 0) throw new Error(`JMETER_FAILURE: exit ${jmeterExitCode}`);
  } catch (error) {
    failure = error;
  } finally {
    try {
      if (monitor && monitor.exitCode === null) {
        fs.writeFileSync(monitorStopFile, `${new Date().toISOString()}\n`, "utf8");
        await Promise.race([once(monitor, "exit"), sleep(10000)]);
        if (monitor.exitCode === null) await stopChild(monitor);
      }
      await stopChild(backend);
      if (secretFile && fs.existsSync(secretFile)) fs.rmSync(secretFile, { force: true });
      deleteRuntime(runtimeRoot);
    } catch (cleanupError) {
      failure = failure || cleanupError;
    }
  }

  try { sourceAfter = fingerprints(); } catch (error) { failure = failure || error; }
  const sourceUnchanged = Boolean(sourceBefore && sourceAfter) && sourceBefore.source_database === sourceAfter.source_database;
  if (!sourceUnchanged) failure = failure || new Error("DATA_STATE_FAILURE: source database fingerprint changed");

  let jtlFacts = null;
  let rawJtlHash = null;
  let htmlIndex = null;
  let resourceSummary = null;
  let sensitive = { jwt: [], password: [], reset_token: [] };
  if (!failure) {
    try {
      jtlFacts = inspectJtl();
      rawJtlHash = sha256(RAW_JTL);
      htmlIndex = path.join(HTML_DIR, "index.html");
      if (!fs.existsSync(htmlIndex) || fs.statSync(htmlIndex).size === 0) throw new Error("JMETER_FAILURE: HTML dashboard missing");
      resourceSummary = summarizeResources();
      writeJson(path.join(EVIDENCE_DIR, "resource-summary.json"), resourceSummary);
      sensitive = scanSensitiveArtifacts(secretFile);
      if (Object.values(sensitive).some((matches) => matches.length > 0)) throw new Error("SENSITIVE_EVIDENCE_RISK");
    } catch (error) {
      failure = error;
    }
  }

  const cleanup = {
    captured_at: new Date().toISOString(),
    backend_stopped: !backend || backend.exitCode !== null,
    temporary_external_properties_file_deleted: Boolean(secretFile) && !fs.existsSync(secretFile),
    disposable_runtime_deleted: Boolean(runtimeRoot) && !fs.existsSync(runtimeRoot),
    source_database_sha256_after: sourceAfter?.source_database || null,
    source_database_unchanged: sourceUnchanged,
  };
  writeJson(path.join(EVIDENCE_DIR, "postflight.json"), {
    result: failure ? "FAIL" : "PASS",
    ...cleanup,
    failure_reason: failure ? failure.message : null,
  });
  writeJson(path.join(EVIDENCE_DIR, "cleanup-verification.json"), cleanup);

  const metadata = {
    evidence_type: "HW05_PRODUCTION_AUTH_HEAVY_SPIKE_EXECUTION_METADATA",
    student_id: "23127107",
    run_id: RUN_ID,
    scenario: "SPIKE",
    group: "AUTH_HEAVY",
    endpoint: "GET /api/users/me",
    execution_status: failure ? "FAILED" : "COMPLETE",
    started_at: startedAt.toISOString(),
    jmeter_started_at: jmeterStartedAt?.toISOString() || null,
    jmeter_ended_at: jmeterEndedAt?.toISOString() || null,
    wall_clock_execution_seconds: jmeterStartedAt && jmeterEndedAt ? Number(((jmeterEndedAt - jmeterStartedAt) / 1000).toFixed(3)) : null,
    jmeter_version: "5.6.3",
    jmeter_exit_code: jmeterExitCode,
    jmeter_invocation_count: jmeterInvocations,
    rerun_count: 0,
    no_silent_rerun: jmeterInvocations <= 1,
    preflight_passed: preflight.result === "PASS",
    approved_artifact_fingerprints: sourceBeforeJmeter || sourceBefore || null,
    approved_workload_traceability: workloadTraceability || null,
    raw_jtl: fs.existsSync(RAW_JTL) ? relative(RAW_JTL) : "NOT_CREATED",
    raw_jtl_sha256: rawJtlHash,
    html_report: htmlIndex && fs.existsSync(htmlIndex) ? relative(htmlIndex) : "NOT_CREATED",
    resource_monitor: fs.existsSync(path.join(EVIDENCE_DIR, "resource-monitor.csv")) ? relative(path.join(EVIDENCE_DIR, "resource-monitor.csv")) : "NOT_CREATED",
    resource_summary: resourceSummary ? relative(path.join(EVIDENCE_DIR, "resource-summary.json")) : "NOT_CREATED",
    jtl_facts: jtlFacts,
    source_database_sha256_before: sourceBefore?.source_database || null,
    source_database_sha256_before_jmeter: sourceBeforeJmeter?.source_database || null,
    source_database_sha256_after_cleanup: sourceAfter?.source_database || null,
    source_database_integrity_after: sourceUnchanged ? "PASS" : "FAIL",
    temporary_secret_deleted: cleanup.temporary_external_properties_file_deleted,
    disposable_runtime_deleted: cleanup.disposable_runtime_deleted,
    sensitive_value_exposure: {
      jwt: sensitive.jwt.length === 0 ? "NO" : "YES",
      password: sensitive.password.length === 0 ? "NO" : "YES",
      reset_token: sensitive.reset_token.length === 0 ? "NO" : "YES",
      paths_recorded_without_secret_values: Object.values(sensitive).flat(),
    },
    performance_interpretation: "NOT_PERFORMED",
    task2_analysis: "NOT_STARTED",
    failure_reason: failure ? failure.message : null,
  };
  writeJson(path.join(EVIDENCE_DIR, "execution-metadata.json"), metadata);

  if (failure) {
    process.stderr.write(`AUTH_HEAVY_SPIKE_EXECUTION_FAILED: ${failure.message}\n`);
    process.stdout.write(`${JSON.stringify({ status: "FAIL", run_id: RUN_ID, jmeter_invocation_count: jmeterInvocations, rerun_count: 0, evidence: relative(EVIDENCE_DIR) })}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`${JSON.stringify({
    status: "PASS", run_id: RUN_ID, preflight: "PASS", jmeter_exit_code: jmeterExitCode,
    jmeter_invocation_count: jmeterInvocations, rerun_count: 0, raw_jtl: relative(RAW_JTL), raw_jtl_sha256: rawJtlHash,
    html_report: relative(htmlIndex), resource_samples: resourceSummary.sample_count,
    total_samples: jtlFacts.total_samples, successful_samples: jtlFacts.successful_samples, failed_samples: jtlFacts.failed_samples,
    source_database_integrity_after: "PASS", performance_interpretation: "NOT_PERFORMED",
  })}\n`);
}

async function diagnosticVersionOnly() {
  const diagnosticRoot = fs.mkdtempSync(path.join(os.tmpdir(), "hw05-auth-heavy-spike-diagnostic-"));
  try {
    if (!fs.existsSync(JMETER)) throw new Error("ENVIRONMENT_FAILURE: JMeter 5.6.3 CLI missing");
    if (!fs.existsSync(JMETER_LAUNCHER)) throw new Error("EVIDENCE_FAILURE: approved JMeter launcher missing");
    const version = verifyJmeterVersion(diagnosticRoot);
    const plugins = verifyPlugins(diagnosticRoot);
    process.stdout.write(`${JSON.stringify({
      classification: "DIAGNOSTIC_ONLY",
      result: "PASS",
      jmeter_version: version,
      plugin_verification: plugins,
      workload_executed: false,
    })}\n`);
  } finally {
    deleteRuntime(diagnosticRoot);
  }
}

function diagnosticResourceCsv(resourceCsv) {
  const summary = summarizeResources(resourceCsv);
  process.stdout.write(`${JSON.stringify({
    classification: "DIAGNOSTIC_ONLY",
    result: "PASS",
    resource_csv: relative(resourceCsv),
    resource_csv_headers: RESOURCE_CSV_HEADERS,
    resource_samples: summary.sample_count,
    first_timestamp: summary.first_timestamp,
    backend_not_alive_samples: summary.backend_not_alive_samples,
    workload_executed: false,
  })}\n`);
}

const resourceCsvDiagnosticIndex = process.argv.indexOf("--diagnostic-resource-csv");
const action = process.argv.includes("--diagnostic-version-only")
  ? diagnosticVersionOnly()
  : resourceCsvDiagnosticIndex >= 0
    ? Promise.resolve().then(() => diagnosticResourceCsv(path.resolve(process.argv[resourceCsvDiagnosticIndex + 1] || "")))
    : main();
Promise.resolve(action).catch((error) => {
  process.stderr.write(`AUTH_HEAVY_SPIKE_EXECUTION_ABORTED: ${error.message}\n`);
  process.exitCode = 1;
});
