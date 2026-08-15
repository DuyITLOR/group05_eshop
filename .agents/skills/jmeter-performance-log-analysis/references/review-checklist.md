# Performance test review checklist

## Plan and API

- [ ] Endpoint order matches the business workflow.
- [ ] Methods, URLs, headers, and JSON bodies match the API specification.
- [ ] Authentication and correlation variables are extracted and asserted.
- [ ] Assertions verify business data, not only status codes or ambiguous substrings.
- [ ] Timeouts and sampler error action are intentional.

## Workload

- [ ] VU count, ramp-up, hold, ramp-down, and loop behavior match the scenario.
- [ ] Think time is justified and does not create accidental synchronization.
- [ ] Load, Stress, Spike, and Endurance have distinct purposes and phase windows.
- [ ] Listener/report choices meet the rubric without exhausting load-generator memory.

## State and environment

- [ ] Backend health check passes before load.
- [ ] Accounts exist after database initialization.
- [ ] Each VU has safe, deterministic data where state is mutable.
- [ ] Cart/order state and three-fail login lockout are reset or documented.
- [ ] Tool, plugin, runtime, hardware, and configuration versions are recorded.

## Execution evidence

- [ ] Smoke test proves the complete workflow before the real run.
- [ ] Debug listeners and temporary smoke stop actions are disabled.
- [ ] Non-GUI command uses fresh JTL and HTML paths.
- [ ] Active-phase screenshot shows JMeter and backend process resources.
- [ ] PID-to-port evidence identifies the backend among multiple processes.
- [ ] Completion evidence shows the run ended normally.

## Log quality and analysis

- [ ] JTL timestamp range matches the intended run.
- [ ] Labels, sample counts, threads, success values, and response codes are plausible.
- [ ] Appended/stale segments are excluded explicitly.
- [ ] Parent E2E transactions and child requests are reported separately.
- [ ] HTML statistics reconcile with raw-log calculations or differences are explained.
- [ ] Percentiles name the algorithm/source and phase window.
- [ ] Stress breaking point, spike recovery, and endurance threshold use empirical data.

## Human review

- [ ] Every material AI claim points to raw evidence.
- [ ] Corrections include the original issue, fix, reason, and rerun result.
- [ ] Unsupported optimization claims are not presented as facts.
- [ ] No metric, threshold, screenshot, or manual verification is fabricated.

