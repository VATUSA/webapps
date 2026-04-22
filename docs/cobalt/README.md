# Cobalt API Documentation

This documentation set is written for API consumers and integrators who need accurate runtime behavior for the current Cobalt service.

The docs are endpoint-first and prioritize request/response contracts, auth requirements, ACL behavior, and real caveats over internal project structure.

## Start Here
- [API Overview](./api-overview.md)
- [Auth and Security](./auth-and-security.md)
- [Permissions](./permissions.md)
- [Errors](./errors.md)
- [Pagination and Filtering](./pagination-and-filtering.md)
- [Schemas](./schemas.md)
- [Known Issues](./known-issues.md)

## Endpoint Groups
- [News Endpoints](./endpoints/news.md)
- [Event Endpoints](./endpoints/events.md)
- [User Endpoints](./endpoints/users.md)
- [Roster Endpoints](./endpoints/roster.md)
- [Login and Session Endpoints](./endpoints/login-and-session.md)
- [Legacy and Admin Endpoints](./endpoints/legacy-admin.md)

## Examples
- [cURL Examples](./examples/curl.md)
- [Bruno Collection Guide](./examples/bruno.md)

## Coverage
The endpoint docs cover all routes currently registered in `src/routes/routes.go`:

- `GET /token/:cid`
- `GET /news/latest/:count`
- `GET /news/page/:page`
- `POST /news/new`
- `GET /news/post/:id`
- `POST /news/post/:id`
- `DELETE /news/post/:id`
- `POST /roles/legacy_sync`
- `POST /roles/legacy_sync/bulk`
- `GET /event/upcoming/:count`
- `GET /event/page/:page`
- `GET /event/:id`
- `POST /event/create`
- `POST /event/:id`
- `DELETE /event/:id`
- `GET /user/:cid`
- `GET /user/:cid/blockers`
- `GET /login`
- `GET /login/connect`
- `GET /login/as/:cid`
- `GET /login/whoami`
- `GET /login/logout`
- `GET /login/staging`
- `GET /login/useToken/:token`
- `GET /my/session`
- `GET /roster/:facility`
- `GET /roster/:facility/transfer`

## Source of Truth
These docs are derived from runtime code paths and data models, primarily:

- route registration in `src/routes/routes.go`
- handler logic in `src/endpoints/*.go`
- response models in `src/models/*.go`
- SQL query behavior in `sql/queries/*.sql` and generated `src/db/*.sql.go`
- available request examples in `Bruno/**/*.bru`

When implementation behavior and naming/intention diverge, these docs describe actual observed behavior first and call out caveats in [Known Issues](./known-issues.md).
