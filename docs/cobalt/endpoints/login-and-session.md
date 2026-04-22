# Login and Session Endpoints

## `GET /login`
1. Method and path: `GET /login`
2. Purpose: Entry point into authentication flow.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters: None.
6. Success response(s): `302 Found` redirect.
```text
Location: https://auth.vatsim.net/oauth/authorize?... 
```
7. Error response(s): None typically emitted by this handler.
8. Notes/caveats: In staging app environment mode, redirects to production cobalt staging-helper URL instead of direct VATSIM URL.
9. Example cURL:
```bash
curl -i "$BASE_URL/login"
```
10. Bruno example: no dedicated `/login` request in collection.

## `GET /login/connect`
1. Method and path: `GET /login/connect`
2. Purpose: OAuth callback exchange and session cookie issuance.
3. Auth requirements: None before callback; valid `code` query expected.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Query `code` from VATSIM Connect authorize flow.
6. Success response(s): `302 Found` redirect to post-login URL and sets cookie.
```text
Set-Cookie: vatusa-cobalt-token=<jwt>; Path=/; Domain=... 
Location: <POST_LOGIN_URL>
```
7. Error response(s):
   - `500 Internal Server Error` Echo message payload for connect/token/user fetch failures.
```json
{
  "message": "error fetching connect access token"
}
```
   - `403 Forbidden` generic envelope if account rating is inactive/suspended.
```json
{
  "success": false,
  "id": 0,
  "errors": ["account is inactive or suspended"]
}
```
8. Notes/caveats: Handler triggers VATSIM sync background job in production/staging best-effort.
9. Example cURL:
```bash
curl -i "$BASE_URL/login/connect?code=OAUTH_CODE"
```
10. Bruno example: no dedicated `/login/connect` request in collection.

## `GET /login/as/:cid`
1. Method and path: `GET /login/as/:cid`
2. Purpose: Development-only helper to log in as a CID.
3. Auth requirements: None beyond environment gate.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Path `cid` integer required.
6. Success response(s): `200 OK` JSON string.
```json
"success"
```
7. Error response(s):
   - `404 Not found` outside development.
```json
{
  "message": "Not found"
}
```
   - `400 Bad Request` invalid cid.
```json
{
  "message": "Bad Request"
}
```
8. Notes/caveats: Sets `vatusa-cobalt-token` cookie on success.
9. Example cURL:
```bash
curl -i "$BASE_URL/login/as/10000010"
```
10. Bruno example: `Login As` in [Bruno Collection Guide](../examples/bruno.md).

## `GET /login/whoami`
1. Method and path: `GET /login/whoami`
2. Purpose: Return current authenticated CID from context.
3. Auth requirements: Optional.
4. ACL requirements: None.
5. Path/query/body parameters: None.
6. Success response(s): `200 OK` plain text CID.
```text
1505109
```
7. Error response(s): none explicit in handler.
8. Notes/caveats: If unauthenticated, current context CID defaults to `-1` and endpoint returns `-1` as text.
9. Example cURL:
```bash
curl -sS "$BASE_URL/login/whoami"
```
10. Bruno example: `Who Am I` in [Bruno Collection Guide](../examples/bruno.md).

## `GET /login/logout`
1. Method and path: `GET /login/logout`
2. Purpose: Clear session cookie and redirect.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters: None.
6. Success response(s): `302 Found`, cookie invalidated.
```text
Set-Cookie: vatusa-cobalt-token=; Max-Age=-1; Path=/; Domain=... 
Location: <POST_LOGIN_URL>
```
7. Error response(s): none explicit in handler.
8. Notes/caveats: Works whether or not caller was logged in.
9. Example cURL:
```bash
curl -i "$BASE_URL/login/logout"
```
10. Bruno example: no dedicated logout request in collection.

## `GET /login/staging`
1. Method and path: `GET /login/staging`
2. Purpose: Production helper that generates staging login token and redirects to staging use-token path.
3. Auth requirements:
   - Must be logged in (or will redirect to VATSIM connect flow).
4. ACL requirements: None explicit.
5. Path/query/body parameters: None.
6. Success response(s): `302 Found` to staging `/login/useToken/:token` URL.
```text
Location: <STAGING_INTERNAL_URL>/login/useToken/<token>
```
7. Error response(s):
   - `404 Not found` when not in production env.
```json
{
  "message": "Not found"
}
```
   - `500 Internal Server Error` if staging token generation call fails.
```json
{
  "message": "failed to generate staging token"
}
```
8. Notes/caveats: Sends internal request with `X-Auth-Token` header configured by `STAGING_ACTOR_TOKEN`.
9. Example cURL:
```bash
curl -i "$BASE_URL/login/staging"
```
10. Bruno example: no dedicated staging helper request in collection.

## `GET /login/useToken/:token`
1. Method and path: `GET /login/useToken/:token`
2. Purpose: Staging-only endpoint to set cookie from provided token and redirect.
3. Auth requirements: None beyond environment gate.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Path `token` JWT string.
6. Success response(s): `302 Found` redirect to post-login URL and cookie set.
```text
Set-Cookie: vatusa-cobalt-token=<token>; Path=/
Location: <POST_LOGIN_URL>
```
7. Error response(s): `404 Not found` outside staging.
```json
{
  "message": "Not found"
}
```
8. Notes/caveats: Intended for staging handoff, not public login path.
9. Example cURL:
```bash
curl -i "$BASE_URL/login/useToken/$JWT"
```
10. Bruno example: `Login Use Token` in [Bruno Collection Guide](../examples/bruno.md).

## `GET /my/session`
1. Method and path: `GET /my/session`
2. Purpose: Return current session user and resolved permissions.
3. Auth requirements:
   - Optional, but response differs by auth state.
4. ACL requirements: None explicit to call endpoint.
5. Path/query/body parameters: None.
6. Success response(s):
   - `200 OK` session object when authenticated.
```json
{
  "user": {
    "cid": 10000010,
    "network_user": {
      "first_name": "Alex",
      "last_name": "Controller",
      "email": "alex@example.com",
      "rating": 4,
      "region": "AMAS",
      "division": "USA",
      "subdivision": null,
      "pilot_rating": 0,
      "military_rating": 0
    },
    "division_user": {
      "display_name": "Alex C",
      "controller_rating": 5,
      "instructor_rating": 0,
      "facility": "ZDC",
      "visiting_facilities": [],
      "discord_id": null,
      "last_promotion_timestamp": null,
      "last_transfer_timestamp": null
    }
  },
  "global_permissions": [
    { "action": "write", "object": "news_post" }
  ],
  "facility_permissions": [
    { "action": "write", "object": "event", "facility": "event" }
  ]
}
```
   - `401 Unauthorized` anonymous session shape when not logged in.
```json
{
  "user": null,
  "global_permissions": [],
  "facility_permissions": []
}
```
7. Error response(s):
   - `404 Not Found` when CID from auth cannot be found in DB.
```json
{}
```
   - `500 Internal Server Error` generic envelope on DB failure.
```json
{
  "success": false,
  "id": 0,
  "errors": ["database error"]
}
```
8. Notes/caveats: Facility permission serialization bug affects `facility_permissions[].facility`. See [Known Issues](../known-issues.md).
9. Example cURL:
```bash
curl -sS "$BASE_URL/my/session" --cookie "vatusa-cobalt-token=$JWT"
```
10. Bruno example: `GET session` in [Bruno Collection Guide](../examples/bruno.md).

## Related Docs
- [Auth and Security](../auth-and-security.md)
- [Errors](../errors.md)
- [Known Issues](../known-issues.md)
