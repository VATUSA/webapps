# Legacy and Admin Endpoints

## `GET /token/:cid`
1. Method and path: `GET /token/:cid`
2. Purpose: Generate JWT token for a specific user CID.
3. Auth requirements:
   - Requires actor token or user context with sufficient ACL.
4. ACL requirements:
   - Global `legacy_login_token:write`.
5. Path/query/body parameters:
   - Path `cid` integer required.
6. Success response(s): `200 OK` token payload.
```json
{
  "token": "<jwt>"
}
```
7. Error response(s):
   - `400 Bad Request` invalid CID (Echo error payload).
```json
{
  "message": "invalid cid"
}
```
   - `403 Forbidden` missing ACL.
```json
{
  "success": false,
  "id": 0,
  "errors": ["missing acl global legacy_login_token:write"]
}
```
8. Notes/caveats: Commonly used by staging bridge flow and internal automation.
9. Example cURL:
```bash
curl -sS "$BASE_URL/token/1505109" \
  -H "X-Auth-Token: $ACTOR_TOKEN"
```
10. Bruno example: `Generate User Token` in [Bruno Collection Guide](../examples/bruno.md).

## `POST /roles/legacy_sync`
1. Method and path: `POST /roles/legacy_sync`
2. Purpose: Sync one user's legacy roles into modern ACL roles.
3. Auth requirements:
   - Requires actor token or user context with sufficient ACL.
4. ACL requirements:
   - Global `legacy_role_sync:write`.
5. Path/query/body parameters:
   - Body `SyncRolesRequest`.
```json
{
  "cid": 1505109,
  "roles": [
    {
      "facility": "ZHQ",
      "role": "US0"
    }
  ]
}
```
6. Success response(s): `200 OK` JSON string.
```json
"sync roles successful"
```
7. Error response(s):
   - `403 Forbidden` missing ACL.
```json
{
  "success": false,
  "id": 0,
  "errors": ["missing acl global legacy_role_sync:write"]
}
```
   - `500 Internal Server Error` migration failure.
```json
{
  "success": false,
  "id": 0,
  "errors": ["sql: ..."]
}
```
8. Notes/caveats: Request bind failures currently return direct bind error style.
9. Example cURL:
```bash
curl -sS -X POST "$BASE_URL/roles/legacy_sync" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"cid":1505109,"roles":[{"facility":"ZHQ","role":"US0"}]}'
```
10. Bruno example: `Legacy Sync Roles` in [Bruno Collection Guide](../examples/bruno.md).

## `POST /roles/legacy_sync/bulk`
1. Method and path: `POST /roles/legacy_sync/bulk`
2. Purpose: Sync legacy roles for multiple users in one request.
3. Auth requirements:
   - Requires actor token or user context with sufficient ACL.
4. ACL requirements:
   - Global `legacy_role_sync:write`.
5. Path/query/body parameters:
   - Body `BulkSyncRolesRequest`.
```json
{
  "requests": [
    {
      "cid": 1505109,
      "roles": [{ "facility": "ZHQ", "role": "US0" }]
    },
    {
      "cid": 1505110,
      "roles": [{ "facility": "ZDC", "role": "ATM" }]
    }
  ]
}
```
6. Success response(s): `200 OK` JSON string.
```json
"sync roles successful"
```
7. Error response(s):
   - `403 Forbidden` missing ACL.
```json
{
  "success": false,
  "id": 0,
  "errors": ["missing acl global legacy_role_sync:write"]
}
```
   - `500 Internal Server Error` if any individual sync fails.
```json
{
  "success": false,
  "id": 0,
  "errors": ["sql: ..."]
}
```
8. Notes/caveats: Bulk operation stops on first failure.
9. Example cURL:
```bash
curl -sS -X POST "$BASE_URL/roles/legacy_sync/bulk" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"requests":[{"cid":1505109,"roles":[{"facility":"ZHQ","role":"US0"}]},{"cid":1505110,"roles":[{"facility":"ZDC","role":"ATM"}]}]}'
```
10. Bruno example: no dedicated Bruno bulk request present.

## Related Docs
- [Permissions](../permissions.md)
- [Schemas](../schemas.md)
- [Auth and Security](../auth-and-security.md)
