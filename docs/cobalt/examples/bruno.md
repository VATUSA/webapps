# Bruno Collection Guide

## Collection Location
Bruno requests live under `Bruno/`.

Key files:

- collection root: `Bruno/collection.bru`
- environments: `Bruno/environments/*.bru`
- grouped requests under `Bruno/News`, `Bruno/Events`, `Bruno/user`, `Bruno/roster`, `Bruno/login`, `Bruno/api`, `Bruno/my`

## Environment Setup
Available environments:

- `Local Dev`: `http://localhost:8000/cobalt`
- `Local Webapps Stack`: `http://localhost:8000/cobalt`
- `Prod`: `https://cobalt.vatusa.net`
- `vatusa.dev`: `https://vatusa.dev/cobalt`

`api` folder requests use API key auth mode in Bruno and expect:

- header `X-Auth-Token`
- env var `token`

## Route Caveats Before Running Requests
Known mismatches between Bruno requests and registered routes:

- `News/Get News Posts (20)` uses `/news/20`; use `/news/latest/20`.
- `Events/Get Event By ID` uses `POST`; runtime route is `GET /event/:id`.
- `roster/Get Facility Pending Transfer Requests` uses `/roster/:facility/transfers`; runtime route is `/roster/:facility/transfer`.
- `News/Update News Post` currently has no JSON body in request config; runtime handler expects `NewsPostRequest` body.

## Bruno Request-to-Docs Mapping
| Bruno Request | Runtime Route | Endpoint Docs |
| --- | --- | --- |
| `News/Get News Posts (20)` | `GET /news/latest/:count` | [News Endpoints](../endpoints/news.md) |
| `News/Get News Page` | `GET /news/page/:page` | [News Endpoints](../endpoints/news.md) |
| `News/Get News Post (by ID)` | `GET /news/post/:id` | [News Endpoints](../endpoints/news.md) |
| `News/Create News Post` | `POST /news/new` | [News Endpoints](../endpoints/news.md) |
| `News/Update News Post` | `POST /news/post/:id` | [News Endpoints](../endpoints/news.md) |
| `News/Delete News Post` | `DELETE /news/post/:id` | [News Endpoints](../endpoints/news.md) |
| `Events/Get Upcoming Events` | `GET /event/upcoming/:count` | [Event Endpoints](../endpoints/events.md) |
| `Events/Get Events Page` | `GET /event/page/:page` | [Event Endpoints](../endpoints/events.md) |
| `Events/Get Event By ID` | `GET /event/:id` | [Event Endpoints](../endpoints/events.md) |
| `Events/Create Event` | `POST /event/create` | [Event Endpoints](../endpoints/events.md) |
| `user/Get User by CID` | `GET /user/:cid` | [User Endpoints](../endpoints/users.md) |
| `user/Get User Blockers` | `GET /user/:cid/blockers` | [User Endpoints](../endpoints/users.md) |
| `roster/Get Facility Roster` | `GET /roster/:facility` | [Roster Endpoints](../endpoints/roster.md) |
| `roster/Get Facility Pending Transfer Requests` | `GET /roster/:facility/transfer` | [Roster Endpoints](../endpoints/roster.md) |
| `login/Login As` | `GET /login/as/:cid` | [Login and Session Endpoints](../endpoints/login-and-session.md) |
| `login/Login Use Token` | `GET /login/useToken/:token` | [Login and Session Endpoints](../endpoints/login-and-session.md) |
| `login/Who Am I` | `GET /login/whoami` | [Login and Session Endpoints](../endpoints/login-and-session.md) |
| `my/GET session` | `GET /my/session` | [Login and Session Endpoints](../endpoints/login-and-session.md) |
| `api/Generate User Token` | `GET /token/:cid` | [Legacy and Admin Endpoints](../endpoints/legacy-admin.md) |
| `api/Legacy Sync Roles` | `POST /roles/legacy_sync` | [Legacy and Admin Endpoints](../endpoints/legacy-admin.md) |

## Suggested Bruno Cleanup Tasks
- Align method/path mismatches listed above.
- Add missing requests for:
  - `POST /roles/legacy_sync/bulk`
  - `POST /event/:id`
  - `DELETE /event/:id`
  - `GET /login`
  - `GET /login/connect`
  - `GET /login/logout`
  - `GET /login/staging`
