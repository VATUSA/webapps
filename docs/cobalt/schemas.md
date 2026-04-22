# Schemas

## Notes
- Timestamps are mixed across endpoints.
- Event and request payload timestamps are RFC3339 strings.
- News timestamps are unix seconds plus derived date string.
- Some fields are permission-gated or nullable.

## GenericResponse
Used by many write endpoints and some errors.

```json
{
  "success": true,
  "id": 123,
  "errors": []
}
```

Fields:

- `success` boolean
- `id` integer, often resource identifier
- `errors` array of strings

## NewsPostRequest
Request body for create/update news post.

```json
{
  "title": "Position Posting: ...",
  "body": "Post body text"
}
```

## NewsPost
Response item for news reads.

```json
{
  "id": 11,
  "title": "Position Posting: ...",
  "body": "Post body text",
  "author_cid": 1505109,
  "post_timestamp": 1776028800,
  "post_date": "2026-04-12"
}
```

## EventRequest
Request body for create/update event.

```json
{
  "title": "The Dulles Night Shift",
  "body": "Event description",
  "banner_image_url": "https://...",
  "facility": "ZDC",
  "start_timestamp": "2026-04-12T16:00:00-06:00",
  "end_timestamp": "2026-04-12T20:00:00-06:00"
}
```

Field notes:

- `start_timestamp` and `end_timestamp` must parse as RFC3339.

## Event
Response item for event reads.

```json
{
  "id": 1,
  "title": "The Dulles Night Shift",
  "body": "Event description",
  "banner_image_url": "https://...",
  "facility": "ZDC",
  "start_timestamp": "2026-04-12T22:00:00Z",
  "end_timestamp": "2026-04-13T02:00:00Z"
}
```

## User
Top-level user response.

```json
{
  "cid": 10000010,
  "network_user": {
    "first_name": "Alex",
    "last_name": "Controller",
    "email": "alex@example.com",
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
    "visiting_facilities": ["ZTL", "ZJX"],
    "discord_id": "123456789",
    "last_promotion_timestamp": 1760000000,
    "last_transfer_timestamp": 1761000000
  }
}
```

### NetworkUser
Fields:

- `first_name` nullable string, sensitive
- `last_name` nullable string, sensitive
- `email` nullable string, sensitive
- `rating` integer
- `region` string
- `division` string
- `subdivision` nullable string
- `pilot_rating` integer
- `military_rating` integer

### DivisionUser
Fields:

- `display_name` string
- `controller_rating` integer
- `instructor_rating` integer
- `facility` string
- `visiting_facilities` array of strings
- `discord_id` nullable string
- `last_promotion_timestamp` nullable unix seconds
- `last_transfer_timestamp` nullable unix seconds

Sensitive field note:

- `first_name`, `last_name`, and `email` are only populated when requester has global `user_sensitive_details:read`.

## Session
Response for `GET /my/session`.

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

Caveat:

- `facility_permissions[].facility` is currently serialized incorrectly as object value. See [Known Issues](./known-issues.md).

## Roster
Response for `GET /roster/:facility`.

```json
{
  "home": ["<User>", "..."],
  "visitors": ["<User>", "..."]
}
```

Each list item is a `User` object.

## UserBlockers
Response for `GET /user/:cid/blockers`.

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

## TransferRequest
Nested in roster transfer responses.

```json
{
  "id": 10,
  "cid": 10000010,
  "from_facility": "ZDC",
  "to_facility": "ZTL",
  "reason": "Relocating",
  "created_at": "2026-04-12T18:22:00Z",
  "status": "pending"
}
```

## TransferRequestCombined
Response item for `GET /roster/:facility/transfer`.

```json
{
  "transfer_request": {
    "id": 10,
    "cid": 10000010,
    "from_facility": "ZDC",
    "to_facility": "ZTL",
    "reason": "Relocating",
    "created_at": "2026-04-12T18:22:00Z",
    "status": "pending"
  },
  "user": {
    "cid": 10000010,
    "network_user": { "first_name": null, "last_name": null, "email": null, "rating": 4, "region": "AMAS", "division": "USA", "subdivision": null, "pilot_rating": 0, "military_rating": 0 },
    "division_user": { "display_name": "Alex C", "controller_rating": 5, "instructor_rating": 0, "facility": "ZDC", "visiting_facilities": [], "discord_id": null, "last_promotion_timestamp": null, "last_transfer_timestamp": null }
  }
}
```

## SyncRolesRequest
Body for `POST /roles/legacy_sync`.

```json
{
  "cid": 1505109,
  "roles": [
    {
      "role": "US0",
      "facility": "ZHQ"
    }
  ]
}
```

## BulkSyncRolesRequest
Body for `POST /roles/legacy_sync/bulk`.

```json
{
  "requests": [
    {
      "cid": 1505109,
      "roles": [
        { "role": "US0", "facility": "ZHQ" }
      ]
    },
    {
      "cid": 1505110,
      "roles": [
        { "role": "ATM", "facility": "ZDC" }
      ]
    }
  ]
}
```

## Token Response
Response for `GET /token/:cid`.

```json
{
  "token": "<jwt>"
}
```

## WhoAmI Response
Response for `GET /login/whoami` is plain text containing CID, for example:

```text
1505109
```

## Non-Canonical Error Schema
Some endpoints use Echo HTTP errors, typically:

```json
{
  "message": "error message"
}
```

## Related Docs
- [Errors](./errors.md)
- [Endpoint Docs](./api-overview.md)
