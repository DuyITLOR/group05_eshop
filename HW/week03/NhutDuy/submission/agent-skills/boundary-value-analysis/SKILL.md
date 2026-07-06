---
name: boundary-value-analysis
description: Apply Boundary Value Analysis (BVA) to a feature's ordered input variables, step by step. Use after or alongside domain-testing when variables have ranges (numbers, dates, string lengths, quantities). Produces a boundary table and a BVA test-case table in Markdown.
---

# Boundary Value Analysis Skill

Guide the AI through BVA **as taught in class**, one disciplined step at a time. BVA
targets the values at the edges of each ordered partition, where defects cluster.

## When to use
- A feature has variables with an **ordered, bounded** domain: numeric ranges, lengths,
  counts, dates, money amounts (e.g. password length 8–32, quantity 1–99, price ≥ 0,
  coupon expiry date, discount 0–100%).
- Run it after `domain-testing` (reuse its partitions/boundaries) or standalone.

## Inputs required
- Feature ID + name and its spec.
- The list of ordered variables with their min/max (from the spec or `domain-testing`).

## Procedure (one step per message)

### Step 1 — Select variables eligible for BVA
Keep only variables with an ordered, bounded domain. Drop unordered/enumerated ones
(those stay with domain testing). Justify each inclusion/exclusion.

### Step 2 — Identify the boundaries of each variable
The **boundary = Valid Min / Max** of each variable's valid range. For each variable list
its lower and upper bounds (Valid Min / Valid Max) and whether each bound is **inclusive
or exclusive** (this changes the on/off points). Note units.

| Variable | Lower bound | Upper bound | Inclusive? | Unit |
|----------|-------------|-------------|------------|------|

### Step 3 — Generate boundary values (3-point BVA: B−1, B, B+1)
For each boundary B (= Valid Min / Max) produce the **3-point boundary values: B−1, B,
B+1** — i.e. the standard six points across the two boundaries (use **2-point boundary
values: B, invalid B±1** — only `boundary` and the invalid `boundary±1` — only if
explicitly required):

| Variable | min-1 | min | min+1 | max-1 | max | max+1 |
|----------|-------|-----|-------|-------|-----|-------|

Adapt the step size to the type (1 for integers, smallest representable unit for
decimals, 1 day for dates, 1 char for lengths).

### Step 4 — Design the BVA test cases
One test case per boundary value, other variables held at a valid value. State the
expected result and whether the point should pass or be rejected.

| TC ID | Title | Variable | Boundary point | Input | Expected result | Pass/Reject |
|-------|-------|----------|----------------|-------|-----------------|-------------|

Use IDs like `BVA-<FR>-001`.

### Step 5 — Step-by-step explanation
Explain in prose how BVA was applied to THIS feature, why each boundary matters, and any
assumption about inclusive/exclusive bounds (the rubric grades this).

### Step 6 — Human review checkpoint
Ask the student: Are inclusive/exclusive bounds correct? Any boundary missed (e.g. a
hidden DB limit, max int, empty value)? Apply corrections.

## Output
- Write to `test-cases/feature-<X>/boundary-value-analysis.md`.
- Keep BOTH the boundary table and the test-case table.
- Record any boundary the AI/spec overlooked for the **AI gap analysis** section.

## Quality rules
- Always state inclusive vs exclusive — it is the most common BVA mistake.
- Cover both lower and upper boundaries; do not stop at the lower one.
- Cross-check against `domain-testing` so on/off points are consistent.
