AUTH_HEAVY SPIKE — DESIGN

Endpoint:
GET /api/users/me

Group:
AUTH_HEAVY

Scenario:
SPIKE

Listener:
Response Time Graph

Source Verification:
PASS

Authentication Verified:
PASS

AUTH_HEAVY Classification:
SUPPORTED

Proposed SPIKE Profile:
`5 VUs / 20s -> 25 VUs in 3s -> 25 VUs / 20s -> 5 VUs in 5s -> 5 VUs / 20s`  
Total planned window: `68s`.

Proposed Think Time:
`250-500ms` via `Uniform Random Timer` with offset `250ms` and random maximum `250ms`.

Token Strategy:
Temporary external property `hw05.auth_token`; setup-only authentication outside measured samples; fail closed when missing; no token in CSV/JMX/audit.

Runtime Isolation:
`DISPOSABLE_BACKEND_RUNTIME_COPY`

CSV Proposal:
`test-data/auth-heavy-users-me.csv`

CSV Schema:
`expected_user_id, expected_email, expected_name, auth_case, iteration_key`

Primary Dataset:
SUCCESS_PATH_ONLY

Assertions:
Exact `200`; JSON object; source-backed identity fields; `401`/`403` excluded from primary SPIKE workload.

Implementation-Spec Conflicts:
2

Resource Evidence Strategy:
DEFINED

Design:
[spike-users-me-design.md](/D:/Workspace/HCMUS/Software%20Testing/Homework/group05_eshop/docs/performance-design/spike-users-me-design.md)

JMX:
NOT_CREATED

Execution:
NOT_RUN

Human Review:
PENDING

Workflow State:
HUMAN_DESIGN_REVIEW_REQUIRED

Next Allowed Action:
Student Human Review of AUTH_HEAVY / SPIKE design, proposed profile and test-data strategy.

NO JMX.
NO JMETER.
NO JTL.
NO TASK 2.
NO AUDIT UPDATE.
NO COMMIT.
NO PUSH.

<oai-mem-citation>
<citation_entries>
MEMORY.md:83-95|note=[HW05 production mapping and controlled-evidence separation context]
</citation_entries>
<rollout_ids>
019ff18e-7c64-7d42-85bc-896431439201
</rollout_ids>
</oai-mem-citation>