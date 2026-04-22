# API Overview

## Purpose
Cobalt exposes HTTP endpoints for authentication/session handling, news posts, events, roster lookup, user details, and legacy administrative flows.

## Base URLs
Common deployments and examples in this repository use:

- Local dev/webapps stack: `http://localhost:8000/cobalt`
- Staging: `https://vatusa.dev/cobalt`
- Production: `https://cobalt.vatusa.net`

## Route Prefix Behavior
Routes are registered at root paths such as `/news/...` and `/event/...`.

A path prefix like `/cobalt` is typically introduced by deployment/proxy routing, not by route registration itself.

The server code currently creates an unused `/api` group, but handlers are not mounted under `/api`.

## API Style
Cobalt returns mixed response styles:

- JSON resource payloads for most data endpoints
- JSON error envelope for many handler-level errors: `{ "success": false, "errors": [...] }`
- Echo HTTP error payloads for some auth/login failures
- Plain text response for some endpoints (for example, `GET /login/whoami`)
- HTTP redirects (`302 Found`) for login workflow endpoints

## Endpoint Index
- `GET /token/:cid` -> [Legacy and Admin Endpoints](./endpoints/legacy-admin.md)
- `GET /news/latest/:count` -> [News Endpoints](./endpoints/news.md)
- `GET /news/page/:page` -> [News Endpoints](./endpoints/news.md)
- `POST /news/new` -> [News Endpoints](./endpoints/news.md)
- `GET /news/post/:id` -> [News Endpoints](./endpoints/news.md)
- `POST /news/post/:id` -> [News Endpoints](./endpoints/news.md)
- `DELETE /news/post/:id` -> [News Endpoints](./endpoints/news.md)
- `POST /roles/legacy_sync` -> [Legacy and Admin Endpoints](./endpoints/legacy-admin.md)
- `POST /roles/legacy_sync/bulk` -> [Legacy and Admin Endpoints](./endpoints/legacy-admin.md)
- `GET /event/upcoming/:count` -> [Event Endpoints](./endpoints/events.md)
- `GET /event/page/:page` -> [Event Endpoints](./endpoints/events.md)
- `GET /event/:id` -> [Event Endpoints](./endpoints/events.md)
- `POST /event/create` -> [Event Endpoints](./endpoints/events.md)
- `POST /event/:id` -> [Event Endpoints](./endpoints/events.md)
- `DELETE /event/:id` -> [Event Endpoints](./endpoints/events.md)
- `GET /user/:cid` -> [User Endpoints](./endpoints/users.md)
- `GET /user/:cid/blockers` -> [User Endpoints](./endpoints/users.md)
- `GET /login` -> [Login and Session Endpoints](./endpoints/login-and-session.md)
- `GET /login/connect` -> [Login and Session Endpoints](./endpoints/login-and-session.md)
- `GET /login/as/:cid` -> [Login and Session Endpoints](./endpoints/login-and-session.md)
- `GET /login/whoami` -> [Login and Session Endpoints](./endpoints/login-and-session.md)
- `GET /login/logout` -> [Login and Session Endpoints](./endpoints/login-and-session.md)
- `GET /login/staging` -> [Login and Session Endpoints](./endpoints/login-and-session.md)
- `GET /login/useToken/:token` -> [Login and Session Endpoints](./endpoints/login-and-session.md)
- `GET /my/session` -> [Login and Session Endpoints](./endpoints/login-and-session.md)
- `GET /roster/:facility` -> [Roster Endpoints](./endpoints/roster.md)
- `GET /roster/:facility/transfer` -> [Roster Endpoints](./endpoints/roster.md)

## Related Docs
- [Auth and Security](./auth-and-security.md)
- [Permissions](./permissions.md)
- [Errors](./errors.md)
- [Schemas](./schemas.md)
- [Known Issues](./known-issues.md)
