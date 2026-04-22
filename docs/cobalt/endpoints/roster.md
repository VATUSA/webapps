# Roster Endpoints

## `GET /roster/:facility`
1. Method and path: `GET /roster/:facility`
2. Purpose: Return home roster and visitors for a facility.
3. Auth requirements: None.
4. ACL requirements:
   - No explicit ACL gate in handler.
   - Sensitive user fields are conditionally visible with `user_sensitive_details:read`.
5. Path/query/body parameters:
   - Path `facility` string code.
6. Success response(s): `200 OK` with `Roster`.
```json
{
  "home": [
    {
      "cid": 10000010,
      "network_user": {
        "first_name": null,
        "last_name": null,
        "email": null,
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
    }
  ],
  "visitors": []
}
```
7. Error response(s): `500 Internal Server Error` generic envelope.
```json
{
  "success": false,
  "id": 0,
  "errors": ["database error"]
}
```
8. Notes/caveats: Facility code is not normalized by handler.
9. Example cURL:
```bash
curl -sS "$BASE_URL/roster/ZDC"
```
10. Bruno example: `Get Facility Roster` in [Bruno Collection Guide](../examples/bruno.md).

## `GET /roster/:facility/transfer`
1. Method and path: `GET /roster/:facility/transfer`
2. Purpose: Return pending transfer requests targeting a facility with user context.
3. Auth requirements: None.
4. ACL requirements:
   - No explicit ACL gate in handler.
   - Sensitive user fields are conditionally visible with `user_sensitive_details:read`.
5. Path/query/body parameters:
   - Path `facility` string code.
6. Success response(s): `200 OK` with `TransferRequestCombined[]`.
```json
[
  {
    "transfer_request": {
      "id": 10,
      "cid": 10000010,
      "from_facility": "ZHU",
      "to_facility": "ZDC",
      "reason": "Relocating",
      "created_at": "2026-04-12T18:22:00Z",
      "status": "pending"
    },
    "user": {
      "cid": 10000010,
      "network_user": {
        "first_name": null,
        "last_name": null,
        "email": null,
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
        "facility": "ZHU",
        "visiting_facilities": [],
        "discord_id": null,
        "last_promotion_timestamp": null,
        "last_transfer_timestamp": null
      }
    }
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
8. Notes/caveats: Bruno request currently uses `/transfers` plural; runtime route uses `/transfer` singular.
9. Example cURL:
```bash
curl -sS "$BASE_URL/roster/ZDC/transfer"
```
10. Bruno example: `Get Facility Pending Transfer Requests` in [Bruno Collection Guide](../examples/bruno.md) (route caveat in [Known Issues](../known-issues.md)).

## Related Docs
- [Schemas](../schemas.md)
- [Known Issues](../known-issues.md)
