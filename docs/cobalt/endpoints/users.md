# User Endpoints

## `GET /user/:cid`
1. Method and path: `GET /user/:cid`
2. Purpose: Return combined network and division user profile by CID.
3. Auth requirements: None required for base access.
4. ACL requirements:
   - No explicit ACL gate to access endpoint.
   - Sensitive fields are conditionally included only with global `user_sensitive_details:read`.
5. Path/query/body parameters:
   - Path `cid` integer required.
6. Success response(s): `200 OK` with `User`.
```json
{
  "cid": 10000010,
  "network_user": {
    "first_name": null,
    "last_name": null,
    "email": null,
    "rating": 4,
    "region": "AMAS",
    "division": "USA",
    "subdivision": "USA-W",
    "pilot_rating": 0,
    "military_rating": 0
  },
  "division_user": {
    "display_name": "Alex C",
    "controller_rating": 5,
    "instructor_rating": 0,
    "facility": "ZDC",
    "visiting_facilities": ["ZTL"],
    "discord_id": null,
    "last_promotion_timestamp": null,
    "last_transfer_timestamp": null
  }
}
```
7. Error response(s):
   - `400 Bad Request` invalid CID.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid cid"]
}
```
   - `404 Not Found` user not found.
```json
{
  "success": false,
  "id": 0,
  "errors": ["user not found"]
}
```
8. Notes/caveats: Sensitive identity fields may be null depending on caller ACL.
9. Example cURL:
```bash
curl -sS "$BASE_URL/user/10000010"
```
10. Bruno example: `Get User by CID` in [Bruno Collection Guide](../examples/bruno.md).

## `GET /user/:cid/blockers`
1. Method and path: `GET /user/:cid/blockers`
2. Purpose: Return transfer/visit/promotion blocker summary for a user.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Path `cid` integer required.
6. Success response(s): `200 OK` with `UserBlockers`.
```json
{
  "is_transfer_blocked": true,
  "transfer_blocked_reasons": ["Has transferred in the last 90 days"],
  "is_visit_blocked": false,
  "visit_blocked_reasons": [],
  "is_promotion_blocked": false,
  "promotion_blocked_reasons": []
}
```
7. Error response(s):
   - `400 Bad Request` invalid CID.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid cid"]
}
```
   - `404 Not Found` user not found.
```json
{
  "success": false,
  "id": 0,
  "errors": ["user not found"]
}
```
8. Notes/caveats: Some blocker checks are placeholders/TODOs and may always evaluate false.
9. Example cURL:
```bash
curl -sS "$BASE_URL/user/10000010/blockers"
```
10. Bruno example: `Get User Blockers` in [Bruno Collection Guide](../examples/bruno.md).

## Related Docs
- [Schemas](../schemas.md)
- [Permissions](../permissions.md)
