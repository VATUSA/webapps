# News Endpoints

## `GET /news/latest/:count`
1. Method and path: `GET /news/latest/:count`
2. Purpose: Return newest news posts, descending by ID.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Path `count` integer.
   - Invalid parse defaults to `20`.
   - Clamped to range `[1, 100]`.
6. Success response(s): `200 OK` with `NewsPost[]`.
```json
[
  {
    "id": 11,
    "title": "Position Posting",
    "body": "...",
    "author_cid": 1505109,
    "post_timestamp": 1776028800,
    "post_date": "2026-04-12"
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
8. Notes/caveats: Count clamping behavior is runtime-enforced.
9. Example cURL:
```bash
curl -sS "$BASE_URL/news/latest/20"
```
10. Bruno example: `Get News Posts (20)` in [Bruno Collection Guide](../examples/bruno.md) (path mismatch caveat in [Known Issues](../known-issues.md)).

## `GET /news/page/:page`
1. Method and path: `GET /news/page/:page`
2. Purpose: Return paged news posts.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Path `page` integer required.
   - Page size fixed at `25`.
   - Offset is `(page - 1) * 25`.
6. Success response(s): `200 OK` with `NewsPost[]`.
```json
[
  {
    "id": 11,
    "title": "Position Posting",
    "body": "...",
    "author_cid": 1505109,
    "post_timestamp": 1776028800,
    "post_date": "2026-04-12"
  }
]
```
7. Error response(s): `400 Bad Request` invalid page.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid page"]
}
```
8. Notes/caveats: No lower-bound guard for page values.
9. Example cURL:
```bash
curl -sS "$BASE_URL/news/page/1"
```
10. Bruno example: `Get News Page` in [Bruno Collection Guide](../examples/bruno.md).

## `POST /news/new`
1. Method and path: `POST /news/new`
2. Purpose: Create a new news post.
3. Auth requirements:
   - Requires authenticated actor or logged-in user context with matching ACL permission.
4. ACL requirements:
   - Global `news_post:write`.
5. Path/query/body parameters:
   - Body `NewsPostRequest`.
```json
{
  "title": "Position Posting: Albuquerque ARTCC Events Coordinator",
  "body": "The Albuquerque ARTCC is looking for..."
}
```
6. Success response(s): `200 OK` generic success with inserted ID.
```json
{
  "success": true,
  "id": 42,
  "errors": null
}
```
7. Error response(s): `403 Forbidden` missing ACL permission.
```json
{
  "success": false,
  "id": 0,
  "errors": ["missing acl global news_post:write"]
}
```
8. Notes/caveats: `author_cid` is derived from authenticated user CID, not request body.
9. Example cURL:
```bash
curl -sS -X POST "$BASE_URL/news/new" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"title":"Position Posting","body":"Body text"}'
```
10. Bruno example: `Create News Post` in [Bruno Collection Guide](../examples/bruno.md).

## `GET /news/post/:id`
1. Method and path: `GET /news/post/:id`
2. Purpose: Fetch one news post by ID.
3. Auth requirements: None.
4. ACL requirements: None.
5. Path/query/body parameters:
   - Path `id` integer required.
6. Success response(s): `200 OK` with `NewsPost`.
```json
{
  "id": 11,
  "title": "Position Posting",
  "body": "...",
  "author_cid": 1505109,
  "post_timestamp": 1776028800,
  "post_date": "2026-04-12"
}
```
7. Error response(s):
   - `400 Bad Request` invalid ID.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid post id"]
}
```
   - `404 Not Found` missing post.
```json
{
  "success": false,
  "id": 0,
  "errors": ["post not found"]
}
```
8. Notes/caveats: None.
9. Example cURL:
```bash
curl -sS "$BASE_URL/news/post/11"
```
10. Bruno example: `Get News Post (by ID)` in [Bruno Collection Guide](../examples/bruno.md).

## `POST /news/post/:id`
1. Method and path: `POST /news/post/:id`
2. Purpose: Update an existing news post.
3. Auth requirements:
   - Requires authenticated actor or logged-in user context with ACL.
4. ACL requirements:
   - Global `news_post:write`.
   - Non-author behavior intended to involve `news_post:manage_unowned`.
5. Path/query/body parameters:
   - Path `id` integer required.
   - Body `NewsPostRequest`.
6. Success response(s): `200 OK` generic success.
```json
{
  "success": true,
  "id": 11,
  "errors": null
}
```
7. Error response(s):
   - `400 Bad Request` invalid ID or invalid JSON bind.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid post id"]
}
```
   - `404 Not Found` if post does not exist.
```json
{
  "success": false,
  "id": 0,
  "errors": ["post not found"]
}
```
8. Notes/caveats: Ownership enforcement logic has a current implementation caveat. See [Known Issues](../known-issues.md).
9. Example cURL:
```bash
curl -sS -X POST "$BASE_URL/news/post/11" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $ACTOR_TOKEN" \
  -d '{"title":"Updated title","body":"Updated body"}'
```
10. Bruno example: `Update News Post` in [Bruno Collection Guide](../examples/bruno.md) (body caveat in [Known Issues](../known-issues.md)).

## `DELETE /news/post/:id`
1. Method and path: `DELETE /news/post/:id`
2. Purpose: Delete a news post.
3. Auth requirements:
   - Requires authenticated actor or logged-in user context with ACL.
4. ACL requirements:
   - Global `news_post:write`.
   - For non-authors, also global `news_post:manage_unowned`.
5. Path/query/body parameters:
   - Path `id` integer required.
6. Success response(s): `200 OK` generic success.
```json
{
  "success": true,
  "id": 11,
  "errors": null
}
```
7. Error response(s):
   - `400 Bad Request` invalid ID.
```json
{
  "success": false,
  "id": 0,
  "errors": ["invalid post id"]
}
```
   - `404 Not Found` missing post.
```json
{
  "success": false,
  "id": 0,
  "errors": ["post not found"]
}
```
   - `403 Forbidden` missing ACL.
```json
{
  "success": false,
  "id": 0,
  "errors": ["missing acl global news_post:write"]
}
```
8. Notes/caveats: On failed non-owner permission check, handler exits without explicit error envelope in one path.
9. Example cURL:
```bash
curl -sS -X DELETE "$BASE_URL/news/post/11" \
  -H "X-Auth-Token: $ACTOR_TOKEN"
```
10. Bruno example: `Delete News Post` in [Bruno Collection Guide](../examples/bruno.md).

## Related Docs
- [Schemas](../schemas.md)
- [Permissions](../permissions.md)
- [Pagination and Filtering](../pagination-and-filtering.md)
