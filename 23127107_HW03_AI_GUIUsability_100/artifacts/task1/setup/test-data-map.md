# Test Data Map — Runtime Template

Do not replace a `[MISSING: ...]` value until the real database has been backed up, the service has started under approval, and the fixture has been read back from the real API.

## Transition orders

| Logical ID | Runtime Order ID | Owner | Current Status | Amount | Address Variant | Intended Test Transition | Related Checklist IDs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `PENDING_A` | `1` | `SEEDED_NON_ADMIN` | `pending` | `0` | normal | pending → confirmed | GUI-020, GUI-046, GUI-054, GUI-060 |
| `PENDING_B` | `2` | `LONG_NAME_USER` | `pending` | `100` | harmless HTML-like | pending → canceled | GUI-021, GUI-047, GUI-054, GUI-060 |
| `CONFIRMED_A` | `3` | `SEEDED_NON_ADMIN` | `confirmed` | `125000` | normal | confirmed → shipping | GUI-022, GUI-048, GUI-060 |
| `CONFIRMED_B` | `4` | `LONG_NAME_USER` | `confirmed` | `250000` | empty | confirmed → canceled | GUI-023, GUI-049, GUI-060 |
| `SHIPPING_A` | `5` | `SEEDED_NON_ADMIN` | `shipping` | `900000000` | 238 characters | shipping → delivered | GUI-024, GUI-050, GUI-052, GUI-060 |

## Final-state controls

| Logical ID | Runtime Order ID | Current Status | Amount | Expected Actions | Related Checklist IDs |
| --- | --- | --- | --- | --- | --- |
| `DELIVERED_CONTROL` | `6` | `delivered` | `500000` | none | GUI-010, GUI-012, GUI-051 |
| `CANCELED_CONTROL` | `7` | `canceled` | `10000` | none per specification | GUI-010, GUI-051 |

## Display variants

| Variant | Logical Order | Expected Source Value | Runtime Verification |
| --- | --- | --- | --- |
| User name at least 100 characters | `PENDING_B` | harmless generated name, 110 characters | API returned `user_name` length 110 |
| Multiple users | all seven | `SEEDED_NON_ADMIN` and `LONG_NAME_USER` | API returned 2 distinct owner IDs |
| Normal address | `PENDING_A` or `CONFIRMED_A` | harmless normal address | API read-back length 26 |
| Long address at least 200 characters | `SHIPPING_A` | harmless generated address, 238 characters | API returned length 238 |
| Empty address | `CONFIRMED_B` | empty string | API returned empty string |
| HTML-like address | `PENDING_B` | `<b>Địa chỉ thử</b>` | API returned a string matching `^<b>.*</b>$`; no browser rendering conclusion made |
| Zero amount | `PENDING_A` | `0` | API returned numeric 0 |
| Small amount | `PENDING_B` and `CANCELED_CONTROL` | `100` and `10000` | API read-back matched |
| Large amount | `SHIPPING_A` | `900000000` | API read-back matched |

## Expected Dashboard baseline

| Measure | Value | Calculation Evidence |
| --- | --- | --- |
| Expected order count | `7` | `GET /api/admin/orders` raw JSON parsed as 7 objects |
| Expected delivered revenue | `500000` | Independent sum of `total_amount` where `status = delivered` |
| `SHIPPING_A` expected revenue delta | `900000000` | Order ID 5 API read-back |

## Account readiness

| Account role | Runtime identifier | Readiness | Notes |
| --- | --- | --- | --- |
| Admin | local-only seed identity | Ready: login API returned admin role and a non-empty token | No credential/token committed |
| Seeded non-admin | local-only seed identity | Ready: login API returned non-admin role and a non-empty token | Owns normal fixture orders |
| Long-name non-admin | ephemeral local-only identity | Ready: registered and logged in during B2 | Credentials were not printed or persisted; owns long-name fixture orders |
| Invalid login identity | `hw03-absent-20260801@example.test` | Ready: login returned HTTP 401 and no record was created | Avoids mutating a real account's failed-attempt counter |

## Reset and backup

| Field | Value |
| --- | --- |
| Chosen reset method | Backup -> startup reset -> API fixture -> restore. B1, Gate C, and B2 complete; Gate D and restore pending. |
| Backup identifier | `database-20260801-152104.sqlite.backup` |
| Backup SHA-256 | `315A36C1DBD2CD4D3F773D8DEA5AE89A213A543FEB2936B9CC359A1D35C74EAF` |
| Original database file metadata | 36,864 bytes; last write `2026-08-01T14:46:37+07:00`; SHA-256 matches backup |
| Fixture creation timestamp | SQLite `created_at`: `2026-08-01 08:29:20` (CURRENT_TIMESTAMP/UTC) |
| Fixture response record | This map was populated from an authenticated `GET /api/admin/orders` read-back; no token or credential retained |
| Restore verification | `[MISSING: restored hash equals backup hash]` |
