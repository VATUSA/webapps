# Auth and Security

## Auth Modes
Cobalt supports two auth mechanisms:

- Session cookie auth using `vatusa-cobalt-token`
- Actor token auth using header `X-Auth-Token`

## Session Cookie Auth
Cookie name:

- `vatusa-cobalt-token`

How it is applied:

- Middleware reads cookie and attempts JWT parse.
- On valid token, request context gets user CID.
- On token parse failure, request returns `401` with plain text `token error`.

Cookie write points:

- `GET /login/connect` sets JWT cookie after OAuth callback.
- `GET /login/as/:cid` sets JWT cookie in development only.
- `GET /login/useToken/:token` sets cookie in staging only.

Cookie clear:

- `GET /login/logout` sets cookie empty with `MaxAge: -1` and redirects.

Cookie domain behavior:

- Development: `localhost`
- Non-development: `vatusa.net`

## Actor Token Auth
Header name:

- `X-Auth-Token`

How it is applied:

- Middleware checks header token against active actor token cache.
- On match, request context gets actor ID and ACL resolution is performed using actor roles.

Typical use:

- server-to-server/admin automation, especially for `/token/:cid` and `/roles/legacy_sync*`.

## Auth Precedence
ACL permission resolution prioritizes actor auth over user-cookie auth:

1. If a valid actor ID is present, actor role permissions are used.
2. Otherwise if user cookie is logged in, user role permissions are used.
3. Otherwise request is treated as anonymous with no ACL permissions.

This matters for requests that carry both an actor token and user cookie; actor scope wins.

## Login Flow Endpoints
- `GET /login`
  - Production/staging: redirect to VATSIM Connect authorize URL.
  - Staging environment mode: redirects to `https://cobalt.vatusa.net/login/staging`.

- `GET /login/connect`
  - OAuth callback endpoint.
  - Exchanges `code` for access token, fetches VATSIM user data, writes/updates user records, sets session cookie, then redirects to configured post-login URL.

- `GET /login/logout`
  - Clears session cookie and redirects to configured post-login URL.

- `GET /login/staging`
  - Available only when app env is production.
  - Generates staging login redirect via staging internal token call.

- `GET /login/useToken/:token`
  - Available only when app env is staging.
  - Sets session cookie from path token and redirects to post-login URL.

## Environment-Gated Endpoints
- `GET /login/as/:cid`
  - Development only (`APP_ENV=dev`).
  - Returns `404 Not found` outside development.

- `GET /login/staging`
  - Production only.
  - Returns `404 Not found` outside production.

- `GET /login/useToken/:token`
  - Staging only.
  - Returns `404 Not found` outside staging.

## Browser Security Notes
- CORS allows credentials and permits configured origins only.
- Local allowed origin: `http://127.0.0.1:8000`.
- Non-dev allowed origin: `https://vatusa.net`.
- Cookie is written with `SameSite=Lax` in OAuth connect flow.

## Server-to-Server Security Notes
- Prefer actor token auth for automation; do not rely on session cookies.
- Keep actor tokens secret and rotate via actor token management process.
- Scope actor roles minimally to required ACL objects/actions.
- Avoid sending actor tokens from browsers.

## Related Docs
- [Permissions](./permissions.md)
- [Errors](./errors.md)
- [Login and Session Endpoints](./endpoints/login-and-session.md)
