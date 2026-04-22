# cURL Examples

## Setup
```bash
export BASE_URL="http://localhost:8000/cobalt"
export ACTOR_TOKEN="replace-with-actor-token"
export JWT="replace-with-session-jwt"
```

## Auth Mode: Actor Token

### Generate User Token (`GET /token/:cid`)
```bash
curl -sS "$BASE_URL/token/1505109" \
  -H "X-Auth-Token: $ACTOR_TOKEN"
```

### Legacy Sync Roles (`POST /roles/legacy_sync`)
```bash
curl -sS -X POST "$BASE_URL/roles/legacy_sync" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"cid":1505109,"roles":[{"facility":"ZHQ","role":"US0"}]}'
```

### News Create (`POST /news/new`)
```bash
curl -sS -X POST "$BASE_URL/news/new" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"title":"Position Posting","body":"Opening details"}'
```

### News Update (`POST /news/post/:id`)
```bash
curl -sS -X POST "$BASE_URL/news/post/11" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"title":"Updated Title","body":"Updated body"}'
```

### News Delete (`DELETE /news/post/:id`)
```bash
curl -sS -X DELETE "$BASE_URL/news/post/11" \
  -H "X-Auth-Token: $ACTOR_TOKEN"
```

### Event Create (`POST /event/create`)
```bash
curl -sS -X POST "$BASE_URL/event/create" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"title":"The Dulles Night Shift","body":"Event details","banner_image_url":"https://example.com/banner.png","facility":"ZDC","start_timestamp":"2026-04-12T16:00:00-06:00","end_timestamp":"2026-04-12T20:00:00-06:00"}'
```

### Event Update (`POST /event/:id`)
```bash
curl -sS -X POST "$BASE_URL/event/1" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"title":"Updated Event","body":"Updated details","banner_image_url":"https://example.com/banner.png","facility":"ZDC","start_timestamp":"2026-04-12T17:00:00-06:00","end_timestamp":"2026-04-12T21:00:00-06:00"}'
```

### Event Delete (`DELETE /event/:id`)
```bash
curl -sS -X DELETE "$BASE_URL/event/1" \
  -H "X-Auth-Token: $ACTOR_TOKEN"
```

## Auth Mode: Session Cookie

### Session Fetch (`GET /my/session`)
```bash
curl -sS "$BASE_URL/my/session" \
  --cookie "vatusa-cobalt-token=$JWT"
```

### WhoAmI (`GET /login/whoami`)
```bash
curl -sS "$BASE_URL/login/whoami" \
  --cookie "vatusa-cobalt-token=$JWT"
```

## Auth Mode: Anonymous Read

### News Latest
```bash
curl -sS "$BASE_URL/news/latest/20"
```

### Event By ID
```bash
curl -sS "$BASE_URL/event/1"
```

### User by CID
```bash
curl -sS "$BASE_URL/user/10000010"
```

## Notes
- For deployment environments, set `BASE_URL` to staging or production host.
- Some endpoints return redirects; use `-i` to inspect headers.
- For login flow testing, include `-L` only when you want to follow redirects.
- Event page endpoint has known path/query mismatch. See [Known Issues](../known-issues.md).
