---
name: domain-testing
description: Apply the Domain Testing technique to a Software-Under-Test feature, step by step. Use when designing equivalence-partition / domain test cases for a feature with input variables (forms, filters, business rules). Produces a partition table and a domain test-case table in Markdown.
---

# Domain Testing Skill

Guide the AI through the Domain Testing technique **exactly as taught in class** —
never a single generic "generate test cases" prompt. Work one disciplined step at a
time, pausing for the student to review and correct each step.

## When to use
- A feature has one or more input variables with definable domains (e.g. registration
  fields, product price, cart quantity, coupon value, search filters).
- You need equivalence-partition-based test cases plus a clear, step-by-step rationale.

## Inputs required
- Feature ID + name (e.g. `FR-09 Discount coupons`).
- The feature specification / business rules (read the repo, the SUT UI, or ask the user).

## Procedure (do these in order, one message per step)

### Step 1 — Identify the input variables AND the outputs
List every input variable the feature accepts. For each: name, data type, and source
(form field, query param, API body, DB constraint). Output a table:

| # | Variable | Type | Source | Notes |
|---|----------|------|--------|-------|

Then, in the same step, list every **output** the feature produces — do not stop at the
inputs. An output is any observable result of the feature (e.g. success vs. each kind of
error/reject, status code, returned message, persisted state change). Output a table:

| # | Output | Type | Description |
|---|--------|------|-------------|

### Step 2 — Determine the domain of each input AND the output domain
For each input variable, define its **valid domain** and all **constraints** (range,
length, format, allowed set, nullability, dependencies on other variables).

| Variable | Valid domain | Constraints / rules |
|----------|--------------|---------------------|

Then determine the **output domain** as well: partition the possible results into the
distinct outcomes the feature can produce — typically **success** vs. each separate
**error / reject** category (e.g. "duplicate email", "weak password", "missing field").
Each output partition is what an expected result will later map to.

| Output partition | Meaning | Triggering condition |
|------------------|---------|----------------------|

### Step 3 — Partition into equivalence classes
Split each variable's domain into **valid** and **invalid** partitions. Make partitions
disjoint and complete (every possible input falls in exactly one).

| Variable | Valid partitions | Invalid partitions |
|----------|------------------|--------------------|

### Step 4 — Pick representative points
For each partition choose representative values. Where a partition is bounded, classify
points as **in / on / off / out** (this links to BVA — flag boundaries for the
`boundary-value-analysis` skill). One representative per partition is the minimum.

### Step 5 — Design the domain test cases
Apply the **one-variable-at-a-time** rule: vary the variable under test across its
partitions while holding all other variables at a valid (in-domain) value. Each test case
must cover at least one partition and state an expected result derived from the spec.

| TC ID | Title | Variable under test | Input (all vars) | Partition covered | Expected result |
|-------|-------|---------------------|------------------|-------------------|-----------------|

Use IDs like `DT-<FR>-001`. Add extra cases for variable interactions / combination rules
where the spec defines them.

**Reduce duplicate test cases (B5).** After designing the cases, review the table and
remove duplicates: two test cases are duplicates if **both their Input AND their Expected
Output are identical** — keep only one of them. The tester must scan the full set and
eliminate any such redundant case so the final suite has no two rows with the same Input
and the same Expected Output.

### Step 6 — Write the step-by-step explanation
Document, in prose, how each step was applied to THIS feature (the rubric grades the
explanation, not just the table). State any assumption made about ambiguous spec.

### Step 7 — Human review checkpoint
Explicitly ask the student to review: Are partitions complete? Any missing variable or
rule? Any wrong expected result? Apply corrections before finalizing.

## Output
- Write the result to `test-cases/feature-<X>/domain-testing.md` using the tables above.
- Keep the partition table AND the test-case table — both are required deliverables.
- Note any test cases you suspect the AI/spec missed for the **AI gap analysis** section.

## Quality rules
- Never skip Step 3–4; partitions without representative points are not test cases.
- Expected results must come from the spec, not guessed.
- Always cover BOTH inputs and outputs (Step 1–2): partition the output into success vs.
  each error/reject, and after design apply B5 to drop any case whose Input AND Expected
  Output duplicate another.
- Prefer thoroughness: the homework rewards quantity AND quality of cases.
