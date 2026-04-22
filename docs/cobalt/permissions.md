# Permissions

## ACL Model
Cobalt ACL checks are expressed as:

- `object`: resource type
- `action`: operation on that object
- scope: global or facility-scoped

## Actions
- `read`
- `write`
- `manage_unowned`
- `usage`

## Key Objects Used by API Endpoints
- `news_post`
- `event`
- `user_sensitive_details`
- `legacy_role_sync`
- `legacy_login_token`
- `roster` (defined in ACL but not explicitly enforced in current roster handlers)

## Global vs Facility Scope
- Global permissions apply everywhere.
- Facility permissions apply only for a specific facility code.
- For event writes, handlers enforce `event:write` at facility scope against event facility values.

## Write/Admin Endpoint Permission Matrix
| Endpoint | Permission Check | Scope | Notes |
| --- | --- | --- | --- |
| `GET /token/:cid` | `legacy_login_token:write` | Global | Typically actor token-driven internal/admin use |
| `POST /roles/legacy_sync` | `legacy_role_sync:write` | Global | Legacy role migration operation |
| `POST /roles/legacy_sync/bulk` | `legacy_role_sync:write` | Global | Batch variant |
| `POST /news/new` | `news_post:write` | Global | Author set from logged-in CID |
| `POST /news/post/:id` | `news_post:write` + conditional ownership logic | Global | See caveat in [Known Issues](./known-issues.md) |
| `DELETE /news/post/:id` | `news_post:write` + `news_post:manage_unowned` for non-author | Global | Non-owners require manage_unowned |
| `POST /event/create` | `event:write` | Facility | Checked against request body `facility` |
| `POST /event/:id` | `event:write` | Facility | Checked against existing event facility and requested facility |
| `DELETE /event/:id` | `event:write` | Facility | Checked against existing event facility |

## Sensitive User Fields
Endpoints that return user structures selectively include sensitive identity fields:

- fields gated: `network_user.first_name`, `network_user.last_name`, `network_user.email`
- gate permission: global `user_sensitive_details:read`

Impacted endpoints:

- `GET /user/:cid`
- `GET /roster/:facility`
- `GET /roster/:facility/transfer`
- `GET /my/session` (user block is always rendered with sensitive fields enabled)

## Publicly Reachable Read Endpoints (No Explicit ACL Check)
These handlers do not perform `AssertGlobal` or `AssertFacility` checks:

- `GET /news/latest/:count`
- `GET /news/page/:page`
- `GET /news/post/:id`
- `GET /event/upcoming/:count`
- `GET /event/page/:page`
- `GET /event/:id`
- `GET /user/:cid`
- `GET /user/:cid/blockers`
- `GET /roster/:facility`
- `GET /roster/:facility/transfer`
- `GET /login`
- `GET /login/connect`
- `GET /login/as/:cid` (environment-gated)
- `GET /login/whoami`
- `GET /login/logout`
- `GET /login/staging` (environment-gated)
- `GET /login/useToken/:token` (environment-gated)
- `GET /my/session`

## Role and Permission Exposure in Session
`GET /my/session` returns permission lists derived from ACL handler caches, but masked objects are filtered out from returned permission sets.

## Related Docs
- [Auth and Security](./auth-and-security.md)
- [Known Issues](./known-issues.md)
- [Login and Session Endpoints](./endpoints/login-and-session.md)
