# Event Endpoints

## `GET /event/upcoming/:count`
1. Method and path: `GET /event/upcoming/:count`
2. Purpose: Return upcoming events filtered by `start_time > now`.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Path `count` integer.
   - Invalid parse defaults to `20`.
   - Clamped to `[1, 100]`.
6. Success response(s): `200 OK` with `Event[]`.
```json
[
  {
    "id": 1,
    "title": "The Dulles Night Shift",
    "body": "...",
    "banner_image_url": "https://...",
    "facility": "ZDC",
    "start_timestamp": "2026-04-12T22:00:00Z",
    "end_timestamp": "2026-04-13T02:00:00Z"
  }
]
```
7. Error response(s): `500 Internal Server Error` generic envelope.
```json
{
  "success": false,
  "id": 0,
  "errors": ["database error"]
}
```
8. Notes/caveats: SQL currently orders by `start_time DESC`.
9. Example cURL:
```bash
curl -sS "$BASE_URL/event/upcoming/10"
```
10. Bruno example: `Get Upcoming Events` in [Bruno Collection Guide](../examples/bruno.md).

## `GET /event/page/:page`
1. Method and path: `GET /event/page/:page`
2. Purpose: Return paged upcoming events.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Registered path parameter `:page`.
   - Handler currently reads query parameter `page` instead.
   - Query `page` defaults to `1`.
   - Page size is fixed at `25`.
6. Success response(s): `200 OK` with `Event[]`.
```json
[
  {
    "id": 1,
    "title": "The Dulles Night Shift",
    "body": "...",
    "banner_image_url": "https://...",
    "facility": "ZDC",
    "start_timestamp": "2026-04-12T22:00:00Z",
    "end_timestamp": "2026-04-13T02:00:00Z"
  }
]
```
7. Error response(s): `400 Bad Request` invalid query page parse.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid page"]
}
```
8. Notes/caveats: Path/query mismatch is tracked in [Known Issues](../known-issues.md).
9. Example cURL:
```bash
curl -sS "$BASE_URL/event/page/1?page=1"
```
10. Bruno example: `Get Events Page` in [Bruno Collection Guide](../examples/bruno.md) (requires query caveat).

## `GET /event/:id`
1. Method and path: `GET /event/:id`
2. Purpose: Fetch one event by ID.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Path `id` integer required.
6. Success response(s): `200 OK` with `Event`.
```json
{
  "id": 1,
  "title": "The Dulles Night Shift",
  "body": "...",
  "banner_image_url": "https://...",
  "facility": "ZDC",
  "start_timestamp": "2026-04-12T22:00:00Z",
  "end_timestamp": "2026-04-13T02:00:00Z"
}
```
7. Error response(s):
   - `400 Bad Request` invalid ID.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid event id"]
}
```
   - `500 Internal Server Error` on DB fetch failure.
```json
{
  "success": false,
  "id": 0,
  "errors": ["sql: no rows in result set"]
}
```
8. Notes/caveats: Missing event currently surfaces as `500` rather than `404`.
9. Example cURL:
```bash
curl -sS "$BASE_URL/event/1"
```
10. Bruno example: `Get Event By ID` in [Bruno Collection Guide](../examples/bruno.md) (method mismatch caveat in [Known Issues](../known-issues.md)).

## `POST /event/create`
1. Method and path: `POST /event/create`
2. Purpose: Create an event.
3. Auth requirements:
   - Requires authenticated actor or logged-in user context with ACL.
4. ACL requirements:
   - Facility-scoped `event:write` for request `facility`.
5. Path/query/body parameters:
   - Body `EventRequest`.
   - `start_timestamp` and `end_timestamp` must be RFC3339.
```json
{
  "title": "The Dulles Night Shift",
  "body": "Work the night shift...",
  "banner_image_url": "https://utfs.io/f/...",
  "facility": "ZDC",
  "start_timestamp": "2026-04-12T16:00:00-06:00",
  "end_timestamp": "2026-04-12T20:00:00-06:00"
}
```
6. Success response(s): `200 OK` generic success with inserted ID.
```json
{
  "success": true,
  "id": 15,
  "errors": null
}
```
7. Error response(s):
   - `400 Bad Request` invalid timestamp.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid start time"]
}
```
   - `403 Forbidden` missing facility ACL.
```json
{
  "success": false,
  "id": 0,
  "errors": ["missing acl ZDC event:write"]
}
```
8. Notes/caveats: `created_by` and `updated_by` are sourced from auth context.
9. Example cURL:
```bash
curl -sS -X POST "$BASE_URL/event/create" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"title":"Event","body":"Body","banner_image_url":"https://img","facility":"ZDC","start_timestamp":"2026-04-12T16:00:00-06:00","end_timestamp":"2026-04-12T20:00:00-06:00"}'
```
10. Bruno example: `Create Event` in [Bruno Collection Guide](../examples/bruno.md).

## `POST /event/:id`
1. Method and path: `POST /event/:id`
2. Purpose: Update an event.
3. Auth requirements:
   - Requires authenticated actor or logged-in user context with ACL.
4. ACL requirements:
   - Facility-scoped `event:write` on existing event facility.
   - Facility-scoped `event:write` on request body facility.
5. Path/query/body parameters:
   - Path `id` integer required.
   - Body `EventRequest`.
6. Success response(s): Intended `200 OK` generic success.
```json
{
  "success": true,
  "id": 1,
  "errors": null
}
```
7. Error response(s):
   - `400 Bad Request` invalid event ID or invalid timestamp.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid event id"]
}
```
   - `403 Forbidden` missing ACL.
```json
{
  "success": false,
  "id": 0,
  "errors": ["missing acl ZDC event:write"]
}
```
   - `500 Internal Server Error` update failure.
```json
{
  "success": false,
  "id": 0,
  "errors": ["sql: ..."]
}
```
8. Notes/caveats: Current implementation has ID-handling caveat in update path. See [Known Issues](../known-issues.md).
9. Example cURL:
```bash
curl -sS -X POST "$BASE_URL/event/1" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"title":"Updated Event","body":"Updated body","banner_image_url":"https://img","facility":"ZDC","start_timestamp":"2026-04-12T18:00:00-06:00","end_timestamp":"2026-04-12T22:00:00-06:00"}'
```
10. Bruno example: no dedicated Bruno update request present.

## `DELETE /event/:id`
1. Method and path: `DELETE /event/:id`
2. Purpose: Delete an event.
3. Auth requirements:
   - Requires authenticated actor or logged-in user context with ACL.
4. ACL requirements:
   - Facility-scoped `event:write` against existing event facility.
5. Path/query/body parameters:
   - Path `id` integer required.
6. Success response(s): `200 OK` generic success.
```json
{
  "success": true,
  "id": 1,
  "errors": null
}
```
7. Error response(s):
   - `400 Bad Request` invalid ID.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid event id"]
}
```
   - `500 Internal Server Error` lookup/delete failures.
```json
{
  "success": false,
  "id": 0,
  "errors": ["sql: ..."]
}
```
8. Notes/caveats: Missing event surfaces as `500` from lookup path.
9. Example cURL:
```bash
curl -sS -X DELETE "$BASE_URL/event/1" \
  -H "X-Auth-Token: $ACTOR_TOKEN"
```
10. Bruno example: no dedicated Bruno delete request present.

## Related Docs
- [Schemas](../schemas.md)
- [Permissions](../permissions.md)
- [Known Issues](../known-issues.md)
