---
name: jmeter-performance-log-analysis
description: Design, human-review, execute, and analyze Apache JMeter performance tests for API endpoint groups. Use when creating or correcting .jmx plans for Load, Stress, Spike, or Endurance scenarios; validating authentication, correlation, assertions, timers, thread schedules, and test data; running JMeter non-GUI with .jtl and HTML artifacts; analyzing raw JTL logs, percentiles, throughput, errors, phase windows, and resource evidence; or auditing AI-generated performance claims against reproducible log evidence.
---

# JMeter Performance and Log Analysis

## Objective

Produce reusable JMeter plans and evidence-backed analysis without inventing metrics. Treat AI output as a draft until raw `.jtl`, HTML reports, API behavior, and observed resource usage support it.

## Inputs

Locate or request only what the task needs:

- API specification, endpoint workflow, authentication rules, and expected responses.
- Backend/frontend setup instructions and deterministic test accounts.
- Hardware and runtime constraints.
- Scenario requirements: VU schedule, duration, think time, report type, and acceptance criteria.
- Existing `.jmx`, `.jtl`, HTML report, backend logs, and screenshots when reviewing a run.

Never treat example values as the target system's thresholds. Read [references/load-example.md](references/load-example.md) only when a concrete JMeter example is useful. Read [references/review-checklist.md](references/review-checklist.md) before finalizing a plan or analysis.

## Workflow

### 1. Model the endpoint group

Define one business workflow in dependency order. Record for every request:

- Method, URL, headers, body, and expected status.
- Required input variables and produced variables.
- Business assertion proving success, not only HTTP `200`.
- Failure impact on later requests.

Use extractors for tokens and IDs. Assert every correlation value before it is consumed. Use unique or isolated accounts when cart, order, or lockout state can interfere across virtual users.

### 2. Design scenarios

Create separate plans when the rubric requires independent Load, Stress, and Spike artifacts. Add Endurance when a sustained hardware threshold is required.

- **Load:** ramp to expected concurrency, hold long enough to observe steady state, then ramp down.
- **Stress:** increase load in controlled steps until stability criteria fail; record the first failing step.
- **Spike:** change load abruptly, then measure degradation and recovery.
- **Endurance:** sustain a verified load for the required period and check latency, errors, throughput, CPU, and memory trend.

Use realistic think time. Prefer randomized timers for user behavior; use constant timers only when fixed pacing is intentional. Keep listeners lightweight for non-GUI runs.

### 3. Human-review the plan

Compare the `.jmx` with the API specification and actual smoke responses. Check:

- Thread schedule, loop behavior, timers, timeouts, and error action.
- CSV paths in both GUI and CLI working directories.
- Authentication, headers, request bodies, extractors, and assertions.
- Cascading-failure behavior for dependent workflows.
- Data reset, login lockout, database growth, and account isolation.
- Parent Transaction Controller versus child sampler reporting.

Do not alter a working configuration merely to claim an AI correction. Record verified items as retained, and record actual corrections with before/after evidence.

### 4. Smoke-test before load

Run one VU and one workflow iteration in the GUI with `View Results Tree` temporarily enabled. Verify request, response, variables, and assertions step by step. Remove or disable debug listeners and any temporary stop action before the real run.

### 5. Execute reproducibly

Start the backend, reset/seed test data, health-check it, and then run JMeter non-GUI. Always use new output paths:

```powershell
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$jtl = "results/run_$stamp.jtl"
$report = "results/run_${stamp}_html"
jmeter -n -t "test-plans/scenario.jmx" -l $jtl -e -o $report
```

Capture during the relevant phase, not only after completion:

- JMeter terminal or tool view.
- Backend process PID, CPU, and memory.
- Proof that the PID owns the backend port when multiple runtime processes exist.
- A completion view showing `end of run`.

Preserve the raw `.jtl`, entire HTML folder, plan, environment metadata, and screenshots. Do not append multiple runs to one JTL unless explicitly required and documented.

### 6. Validate and analyze logs

First inspect data quality:

- Confirm timestamp range, labels, sample counts, thread names, success values, and response codes.
- Detect stale/appended runs and select the intended phase or run window.
- Distinguish E2E transaction labels from request labels; never add parent and child counts as if they were the same unit.
- Compare JTL counts with HTML `statistics.json` and explain any listener/summariser difference.

Run the bundled analyzer for an independent cross-check:

```powershell
python scripts/analyze_jtl.py path/to/results.jtl --json-output analysis.json
```

Use `--latest-segment` only after confirming the reported gap actually separates runs. Use `--start-ms` and `--end-ms` for a known steady-state phase. The script uses a documented nearest-rank percentile; use JMeter HTML values as the official JMeter report when algorithms differ.

Analyze sample count, error rate, latency percentiles, throughput, error groups, breaking point, recovery, and endurance stability only for the correct labels and phase windows.

### 7. Audit AI claims

For every important claim, store:

- Claim and source artifact.
- Reproducible calculation or report field.
- Scenario, label, sample type, timestamp window, unit, and sample count.
- Status: `VERIFIED-BY-STUDENT`, `CORRECTED-BY-STUDENT`, or `REJECTED-BY-STUDENT`.

Classify optimization suggestions as feasible, conditional, unsupported, or hallucinated only after checking logs and relevant source/database behavior. Never claim an improvement percentage without comparable before/after runs.

## Completion criteria

Finish only when:

- Smoke validation passes and real scenarios use reproducible data.
- Every run has a unique JTL and HTML report.
- Evidence covers the active load phase and completion.
- Metrics identify scenario, label, unit, time window, and sample count.
- Thresholds come from observed Stress/Endurance results, not the example or AI guess.
- Human review explicitly accepts, corrects, or rejects material AI claims.

