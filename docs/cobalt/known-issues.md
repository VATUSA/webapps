# Known Issues

This page tracks high-impact behavior mismatches observed in current implementation that can affect integrators.

## 1. Event Page Path vs Query Parameter Mismatch
Registered route:

- `GET /event/page/:page`

Actual handler behavior:

- Ignores route path `:page`
- Reads query parameter `page` with default `1`

Impact:

- Calling `/event/page/5` may still return page 1 unless `?page=5` is included.

## 2. Event Update ID Handling Bug
Endpoint:

- `POST /event/:id`

Current update call does not pass the path ID into SQL update params.

Impact:

- Update may fail or not target expected row depending on generated defaults.
- Integrators can observe `500` or unexpected no-op behavior.

## 3. Bruno Collection and Route Inconsistencies
Several Bruno requests diverge from registered routes or methods:

- `Bruno/News/Get News Posts (20).bru` uses `/news/20`; route is `/news/latest/:count`
- `Bruno/Events/Get Event By ID.bru` uses `POST`; route is `GET /event/:id`
- `Bruno/roster/Get Facility Pending Transfer Requests.bru` uses `/roster/:facility/transfers`; route is `/roster/:facility/transfer`
- `Bruno/News/Update News Post.bru` sends no body while handler expects JSON body

Impact:

- Copying examples directly may cause 404/method mismatch or validation errors.

## 4. Mixed Error Response Formats
The API uses multiple error formats:

- generic envelope `{success,id,errors}`
- Echo HTTP error `{message}`
- plain text (`token error`)
- redirect flows

Impact:

- Clients must not assume a single error schema for all non-2xx responses.

## 5. Session Facility Permission Serialization Caveat
Endpoint:

- `GET /my/session`

Current facility permission mapping serializes:

- `facility_permissions[].facility` as object value instead of facility scope value.

Impact:

- Session consumers should not trust `facility` field in current facility permission items.

## 6. News Update Ownership Check Logic Caveat
Endpoint:

- `POST /news/post/:id`

Current code path has an inverted/incorrect conditional around `manage_unowned`.

Impact:

- Non-author updates with elevated permission can return unexpected behavior.

## 7. Upcoming Events Sort Direction
Endpoint:

- `GET /event/upcoming/:count`

SQL orders by `start_time DESC` while also filtering `start_time > now`.

Impact:

- Consumers expecting nearest upcoming first should sort client-side if needed.

## Integration Guidance
- Validate behavior in your environment before production dependencies.
- Use endpoint docs plus this page when implementing client logic.
- Handle non-uniform status and error payloads defensively.
