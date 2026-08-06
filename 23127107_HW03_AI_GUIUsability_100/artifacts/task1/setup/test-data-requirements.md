# Test Data Requirements — 60-item Reviewed Checklist

## Feasibility vocabulary

- `Real data`: create or verify records through the real SUT API after backup and service approval.
- `Response mock`: create the condition through Playwright network routing in Gate D; do not mutate the real database for that condition.
- `Human evaluation`: a person must judge or operate the visual, keyboard, zoom, or screen-reader behavior; automation may collect supporting evidence only.
- `Not Applicable`: excluded or conditional behavior that is not a requirement of the reviewed checklist.

## Requirements map

| Requirement ID | Related Checklist IDs | Required Data | Creation Method | Reset Requirement | Feasibility | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| TD-01 | GUI-001–GUI-005, GUI-010–GUI-013, GUI-027–GUI-036, GUI-039, GUI-053, GUI-057 | Valid admin session and a populated, known order dataset | Use the seeded admin only after runtime verification; create orders through checkout/status APIs | Restore baseline or recreate the seven-order fixture | Real data + Human evaluation | Do not record the account credential or token in Markdown/evidence |
| TD-02 | GUI-014–GUI-019, GUI-044, GUI-056 | Logged-out state; valid-format input; blank input; invalid-login case | Clear only `adminToken`; for invalid login use a non-existent example email to avoid changing a real account's failed-attempt counter | Remove test browser storage; no DB reset when using a non-existent email | Real interaction + Human evaluation | Wrong password on an existing user mutates `login_attempts`; avoid it unless separately approved |
| TD-03 | GUI-045 | Valid non-admin account | Verify the seeded non-admin account after reset; supply credentials privately | No record change expected; clear browser storage | Real data | Frontend role rejection is client-side; Network/storage evidence is needed |
| TD-04 | GUI-037, GUI-043, GUI-056 | Invalid token and expired-token response | Invalid token can be placed in `localStorage`; mock 403 for an expired-token case | Clear `adminToken` after each case | Response mock recommended | Tokens issued by this server have no configured expiry, so a naturally expired issued token is unavailable |
| TD-05 | GUI-020, GUI-021, GUI-025, GUI-035, GUI-046, GUI-047, GUI-054, GUI-060 | Two distinct `pending` orders with known IDs | Create two orders through `POST /api/checkout` | Recreate after the two transitions or restore baseline | Real data | Two records are required because confirm and cancel consume different pending states |
| TD-06 | GUI-022, GUI-023, GUI-025, GUI-048, GUI-049, GUI-054, GUI-060 | Two distinct `confirmed` orders with known IDs | Create as pending, then call Admin status API with `confirmed` | Recreate after shipping/cancel transitions or restore baseline | Real data | Also supplies repeated same-label actions for accessible-name checks |
| TD-07 | GUI-024, GUI-025, GUI-050, GUI-052, GUI-060 | One `shipping` order with known amount and ID | Create pending → confirmed → shipping through real APIs | Recreate after delivered transition or restore baseline | Real data | Its amount is the expected revenue delta in GUI-052 |
| TD-08 | GUI-010, GUI-051 | One stable `delivered` and one stable `canceled` order | Create through allowed transitions from pending | Preserve as final-state controls; restore baseline after suite | Real data | Do not use the implementation-only canceled → delivered path to prepare expected data |
| TD-09 | GUI-004, GUI-006, GUI-011, GUI-058 | Orders owned by multiple users; one user name of at least 100 characters | Reuse seeded non-admin plus register one dedicated long-name user, then checkout under both users | Restore baseline; registration adds a user row | Real data | `users.name` is nullable/unbounded TEXT in schema, and registration accepts it without length validation |
| TD-10 | GUI-008, GUI-009, GUI-011, GUI-058 | Normal address, at least 200-character address, empty address, and harmless HTML-like text | Supply each variant in separate checkout request | Restore baseline | Real data at implementation/schema layer | Schema has nullable TEXT and no validation. Empty is technically accepted but product/business validity is not explicitly confirmed. Use `<b>Địa chỉ thử</b>` only; no active payload |
| TD-11 | GUI-007, GUI-012, GUI-052, GUI-058 | `total_amount` values 0, small positive, large positive, plus known delivered baseline | Supply values in checkout requests and record them before execution | Restore baseline | Real data at implementation/schema layer | No DB CHECK or checkout validation exists. The requirements do not state an order minimum, but this does not prove business acceptance of zero |
| TD-12 | GUI-013, GUI-052 | Exact total order count and exact delivered-revenue sum | Read back `GET /api/admin/orders` after fixture creation and compute expected values independently | Recompute after every reset | Real data | Do not copy the frontend's revenue formula; expected revenue is sum of delivered amounts only |
| TD-13 | GUI-017, GUI-026, GUI-040, GUI-055 | Delayed login, fetch, and update responses | Delay selected network responses in Gate D | Remove route handlers after each test | Response mock | Avoid slowing or changing the real backend |
| TD-14 | GUI-041 | Empty `GET /api/admin/orders` response | Fulfill with `[]` through a scoped network mock | Remove route handler | Response mock preferred | A real empty DB would conflict with the transition dataset and requires a destructive reset |
| TD-15 | GUI-042, GUI-055 | Deterministic non-auth fetch error | Mock one controlled 500/network failure for the orders request | Remove route handler | Response mock | The real list route has no explicit DB-error response contract |
| TD-16 | GUI-055, GUI-059 | Deterministic non-auth status-update server error | Mock a 500 response for one known order update | Remove route handler; real record remains unchanged | Response mock | Verifies row-specific error without corrupting the database |
| TD-17 | GUI-038, GUI-046–GUI-050, GUI-052, GUI-056, GUI-060 | Known transition order, comparison row, expected old/new state, and stable ID | Use the real transition APIs; capture precondition and response | Restore/recreate consumed statuses | Real data + Human evaluation | Network evidence supports payload/result; human checks focus/context where required |
| TD-18 | GUI-001–GUI-004, GUI-006, GUI-008–GUI-011, GUI-014–GUI-015, GUI-018, GUI-025, GUI-028–GUI-035, GUI-038–GUI-039, GUI-053–GUI-058 | The real fixture plus keyboard, Accessibility Tree/screen reader, 200% zoom, and specified viewports | No extra DB creation beyond TD-01 and TD-05–TD-11 | Restore browser zoom/viewport/storage; DB reset only for consumed transitions | Human evaluation | Do not turn automation observations into fabricated human findings |
| TD-19 | Review boundary only; no GUI ID added | RTL, dark mode, cancel confirmation, search/filter/sort/pagination/modal | None | None | Not Applicable | Reviewed checklist explicitly excludes or keeps these conditional; do not mark them Failed |

## Minimum real dataset before execution

Create exactly seven order roles after backend startup/reset:

| Logical role | Initial target status | Required variants |
| --- | --- | --- |
| `PENDING_A` | `pending` | amount 0; normal address; seeded non-admin |
| `PENDING_B` | `pending` | small amount; harmless HTML-like address; long-name user |
| `CONFIRMED_A` | `confirmed` | normal data; retained for confirmed → shipping |
| `CONFIRMED_B` | `confirmed` | empty address; retained for confirmed → canceled |
| `SHIPPING_A` | `shipping` | large amount; address at least 200 characters; revenue-delta source |
| `DELIVERED_CONTROL` | `delivered` | known positive amount; stable baseline control |
| `CANCELED_CONTROL` | `canceled` | known small amount; stable final-state control |

Account set:

- one seeded admin, runtime readiness still unverified;
- one seeded non-admin, runtime readiness still unverified;
- one dedicated non-admin with a name of at least 100 characters, to be created in Gate B2;
- one non-existent example email for invalid login, with no account creation.

## Static feasibility evidence

- `users` fields and defaults: `backend/database.js:48-61`.
- `orders` fields: `backend/database.js:73-81`. There are no declared foreign keys, `NOT NULL` clauses, or status/amount `CHECK` constraints.
- Seed creates admin and non-admin users but no orders: `backend/database.js:83-113`.
- Registration inserts name/email/password; database default role is `user`: `backend/server.js:20-29`; `backend/database.js:50-56`.
- Checkout inserts token user ID, client-supplied amount/address, and status `pending`: `backend/server.js:297-307`.
- Transition implementation: `backend/server.js:525-568`.

| Table | Fields relevant to this scope | Required/constraint finding |
| --- | --- | --- |
| `users` | `id`, `name`, `email`, `password`, `role`, `login_attempts`, `locked_until`, `reset_token`, `shipping_address`, `phone` | Only `id` is a primary key. No other field is declared `NOT NULL`; `role` defaults to `user`; `login_attempts` defaults to 0. |
| `orders` | `id`, `user_id`, `total_amount`, `status`, `shipping_address`, `created_at` | Only `id` is a primary key. `status` defaults to `pending`; `created_at` defaults to current time. There is no declared FK from `user_id`, no status `CHECK`, and no amount/address requirement in the schema. |

Admin-account creation is not exposed as an API. The existing seed inserts an admin account (`backend/database.js:90-94`), while `POST /api/register` omits `role` and therefore receives the database default `user` (`backend/server.js:20-29`; `backend/database.js:50-56`). The safe plan is to verify and use the seeded admin after the approved reset. Creating a separate admin would require a direct database write and a revised, explicitly approved Gate B plan.

A valid order can be created through authenticated `POST /api/checkout`; the token supplies `user_id`, the body supplies `total_amount` and `shipping_address`, and the route inserts `pending` (`backend/server.js:297-307`). Target states must then be derived with the Admin status endpoint rather than inserted as unexplained final rows.

All 60 official items are represented above. This mapping is preparation only; no Actual Result, Passed, or Failed value is implied.
