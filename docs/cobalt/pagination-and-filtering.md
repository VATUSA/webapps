# Pagination and Filtering

## Overview
Cobalt currently exposes simple count/page controls on news and event endpoints.

There are no generic filter/sort query standards shared across all routes.

## News Count Endpoint
Endpoint:

- `GET /news/latest/:count`

Behavior:

- `:count` parsed as integer.
- Invalid parse defaults to `20`.
- Lower bound clamped to `1`.
- Upper bound clamped to `100`.

Examples:

- `/news/latest/5` -> 5 posts
- `/news/latest/0` -> 1 post
- `/news/latest/1000` -> 100 posts
- `/news/latest/not-a-number` -> 20 posts

## News Page Endpoint
Endpoint:

- `GET /news/page/:page`

Behavior:

- `:page` must parse as integer or returns `400 invalid page`.
- page size is fixed at `25`.
- offset formula: `(page - 1) * 25`.

Caveat:

- No explicit lower-bound guard on page number.
- `page=0` or negative values can produce negative offset behavior at DB layer.

## Events Count Endpoint
Endpoint:

- `GET /event/upcoming/:count`

Behavior:

- `:count` parse and clamping matches news count endpoint.
- Default `20`, clamp `[1, 100]`.
- Uses `start_time > now` filter.

## Events Page Endpoint
Registered route:

- `GET /event/page/:page`

Current handler behavior:

- Ignores path parameter `:page`.
- Reads query param `page` with default `1`.
- page size fixed at `25`.
- offset formula uses query param value.

Examples with current behavior:

- `/event/page/9` -> still page 1 unless query `?page=` set
- `/event/page/9?page=2` -> returns page 2

This mismatch is tracked in [Known Issues](./known-issues.md).

## Event Ordering Note
`GetUpcomingEvents` SQL currently sorts by `start_time DESC`, which can be surprising for an "upcoming" list depending on consumer expectations.

## Filtering
No additional filters (facility/search/date-range/etc.) are exposed in current route set.

## Related Docs
- [Event Endpoints](./endpoints/events.md)
- [News Endpoints](./endpoints/news.md)
- [Known Issues](./known-issues.md)
