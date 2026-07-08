# VATUSA Legacy → Migration Analysis

## 1. Table interconnection map

The legacy DB has **~60 tables but almost no enforced foreign keys** — relationships are by convention (`cid`, `facility`/`facility_id`, `rating`). The whole schema hangs off **three hub tables**:

| Hub               | Key          | Who references it                                                                                                                                                                                               |
| ----------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`controllers`** | `cid`        | The master "person" record. Referenced by ~everything via `cid`, `student_id`, `instructor_id`, `grantor`, `examiner`, `modified_by`, `from`/`to`. **This is the dangerous one** — moving it breaks every page. |
| **`facilities`**  | `id` (char3) | Referenced via `facility` / `facility_id` everywhere (rosters, roles, training, email, stats).                                                                                                                  |
| **`ratings`**     | `id`         | Pure lookup (OBS/S1/C1…). Read-only, trivially duplicated.                                                                                                                                                      |

Around those hubs sit **largely self-contained feature clusters** (the only real enforced-FK groups are OTS evals, policies, and training chapters):

| Cluster               | Tables                                                                                                                                                                                                           | Internal links                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **TMU**               | `tmu_facilities`, `tmu_colors`, `tmu_maps`, `tmu_notices`                                                                                                                                                        | notices/colors/maps → `tmu_facilities.id`     |
| **Policies**          | `policies`, `policy_categories`                                                                                                                                                                                  | FK `policies.category → policy_categories.id` |
| **Knowledgebase**     | `knowledgebase_categories`, `knowledgebase_questions`                                                                                                                                                            | questions → category_id                       |
| **Tickets/Helpdesk**  | `tickets`, `tickets_replies`, `tickets_notes`, `tickets_history`                                                                                                                                                 | children → `ticket_id`                        |
| **Checklists**        | `checklists`, `checklist_data`                                                                                                                                                                                   | data → `checklist_id`                         |
| **OTS Evals**         | `ots_evals`, `ots_evals_forms`, `ots_evals_perf_cats`, `ots_evals_perf_indicators`, `ots_evals_indicator_results`                                                                                                | full enforced-FK tree off `forms`             |
| **Training**          | `training_records`, `training_blocks`, `training_chapters`, `training_progress`, `controller_training`                                                                                                           | chapters→blocks, progress→chapters            |
| **Transfers/career**  | `transfers`, `promotions`, `solo_certs`, `action_log`, `visits`, `memberships`                                                                                                                                   | all link to `controllers.cid` only            |
| **Email**             | `email_accounts`, `email_config`, `email_outbound`, `email_templates`, `return_paths`                                                                                                                            | loose, facility-keyed                         |
| **Exam engine** ⚠️    | `exams`, `exam_questions`, `exam_assignments`, `exam_reassignments`, `exam_results`, `exam_results_data`, `exam_generated`                                                                                       | **not used by `current/`** (lives in `api`)   |
| **Academy/Moodle** ⚠️ | `academy_course`, `academy_course_enrollment`, `academy_competency`, `academy_exam_assignments`, `academy_basic_exam_emails`, `controller_eligibility_cache`                                                     | **not used by `current/`**                    |
| **Surveys** ⚠️        | `surveys`, `survey_questions`, `survey_submissions`, `survey_assignments`                                                                                                                                        | **not used by `current/`**                    |
| **Infra/auth**        | `sessions`, `login_tokens`, `uls_tokens`, `oauth_clients`, `oauth_logins`, `users`, `password_resets`, `jobs`, `failed_jobs`, `migrations`, `api_log`, `push_log`, `stats_archive`, `facility_trends`, `flights` | mostly standalone                             |

**Key finding:** The exam, academy, and survey clusters have no routes/controllers in `current/` — they're owned by `api.vatusa.net`. And **News, the home events feed, auth sessions, and role-sync already go through the Cobalt API** (`app/Cobalt/CobaltAPIHelper.php`), not direct DB. So the surface you actually have to migrate page-by-page is smaller than the table count suggests.

## 2. Features by page → tables used

Derived from `routes.php` + controller→model→table wiring:

| Feature (routes)                                            | Controller                        | Tables touched (hubs in *italics*)                                                                                  |
| ----------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Home dashboard** `/`                                      | HomeController                    | `tmu_facilities`, `tmu_notices` (+ events/news via Cobalt API)                                                      |
| **News** `/news/*`, `mgt/news`                              | NewsController                    | **none** — served by Cobalt API (only *controllers* for author)                                                     |
| **TMU** `/tmu/*`, `mgt/tmu`                                 | TMUController                     | `tmu_facilities`, `tmu_colors`, `tmu_maps`, `tmu_notices`                                                           |
| **Policies** `/info/policies`, `mgt/policies`               | PolicyController                  | `policies`, `policy_categories`                                                                                     |
| **Knowledgebase** `/help/kb`, `/help/kbe`                   | HelpdeskController                | `knowledgebase_categories`, `knowledgebase_questions` (+ *controllers*, *roles* for edit perms)                     |
| **Helpdesk/Tickets** `/help/ticket/*`                       | HelpdeskController                | `tickets`, `tickets_replies`, `tickets_notes`, `tickets_history`, *controllers*, *facilities*, *roles*              |
| **Checklists** `mgt/checklists`                             | MgtController                     | `checklists`, `checklist_data`                                                                                      |
| **Solo endorsements** `mgt/solo`                            | MgtController                     | `solo_certs`, *controllers*                                                                                         |
| **Public info** `/info/{ace,dice,join,members,solo}`        | InfoController                    | *facilities*, *controllers*, `knowledgebase_questions` (+ roster via API)                                           |
| **Roles** `mgt/roles`, role assign/revoke                   | RoleController                    | `roles`, `role_titles`, *controllers*, *facilities*                                                                 |
| **Facility mgmt** `mgt/facility/*`                          | FacMgtController                  | *facilities*, `roles`, *controllers*, `transfers`, `action_log`                                                     |
| **My profile** `/my/*`                                      | MyController                      | *controllers*, `transfers`, `action_log`, *facilities*, `roles` (+ memberships/visits via API)                      |
| **Email mgmt** `mgt/mail/*`                                 | EmailMgtController                | *facilities*, `roles`, *controllers*, `email_templates`/`email_config`/`email_outbound`/`return_paths`              |
| **Controller mgmt** `mgt/controller/*`                      | MgtController                     | *controllers*, `roles`, *facilities*, `transfers`, `action_log`, `solo_certs`, `promotions`                         |
| **Training records & OTS evals** `mgt/.../training`, `eval` | TrainingController, MgtController | `training_records`, `ots_evals`(+forms/cats/indicators/results), `promotions`, *controllers*, *facilities*, `roles` |
| **Stats** `mgt/stats/*`                                     | StatsController                   | *facilities*, *controllers*, `transfers`, `promotions`, `facility_trends`, `roles`                                  |

## 3. Migration plan — ordered by least entanglement

The right metric isn't raw table count — it's **how many tables, how interconnected they are with the `controllers` hub, and whether the data is write-shared with legacy pages.** Tiers below go easy → hard.

### 🟢 Tier 1 — Self-contained leaf clusters (migrate first, near-zero blast radius)
These touch only their own cluster (the `controllers`/`facilities` references are read-only lookups you can satisfy via the Cobalt API instead of owning the table):

1. **Policies** (`policies`, `policy_categories`) — 2 tables, 1 clean FK, read-mostly, public + a simple editor. *The ideal first migration.*
2. **Knowledgebase** (`knowledgebase_categories`, `knowledgebase_questions`) — 2 tables, read-mostly, simple CRUD.
3. **TMU** (`tmu_facilities`, `tmu_colors`, `tmu_maps`, `tmu_notices`) — 4 tables, fully self-contained, only links to its own facility list. Map rendering is isolated.
4. **Checklists** (`checklists`, `checklist_data`) — 2 tables, isolated except a string `facility`.

These have **no other legacy page depending on writing to them**, so you can cut them over outright with no dual-write.

### 🟡 Tier 2 — Self-contained but write-shared / larger
5. **Tickets/Helpdesk** (`tickets` + 3 children) — clean 4-table cluster, but reads `controllers`/`facilities`/`roles` for assignment & permissions. Migrate the 4 ticket tables; resolve people/facility via Cobalt API.
6. **OTS Evals** (`ots_evals` + 4) — the one cluster with a *proper enforced FK tree*, so it moves cleanly as a unit. Caveat: `ots_evals.id` is referenced by `promotions.eval_id` and `training_records.ots_eval_id`, so coordinate with Tier 3.
7. **Email mgmt** (`email_*`, `return_paths`) — loosely coupled, facility-keyed, low read-traffic.

### 🔴 Tier 3 — Hub-coupled career/training data (migrate last, behind a facade)
8. **Transfers / promotions / solo_certs / action_log / visits / memberships** and **training_records** — all hang directly off `controllers.cid` and are written by *many* legacy pages (My profile, Controller mgmt, Facility mgmt, Stats, Training). Moving any one of these tables breaks several pages at once.

### ⚫ The hub itself — `controllers` (+ `facilities`, `roles`, `ratings`)
Do **not** physically move this until the strangler facade is in place. This is exactly the [[vatusa-migration-strategy]] case: keep `controllers`/`facilities`/`roles` as the system-of-record fronted by mithril/Cobalt, and have migrated features read identity via API rather than owning the table. `ratings` is a static lookup you can just copy now.

### Recommended sequence
> **Policies → Knowledgebase → TMU → Checklists** (Tier 1, prove the dual-stack pattern) → **Tickets → OTS Evals → Email** (Tier 2) → stand up the `controllers`/`facilities` API facade → then the Tier 3 career/training cluster last.

**Two things worth confirming before you start**, because they change scope materially:
- The **exam, academy, and survey** clusters appear unused by `current/` (owned by `api.vatusa.net`) — verify there's no shared write path before you treat them as out-of-scope.
- **News/roster/auth** are already Cobalt-fronted, so those "pages" are mostly a frontend port with no table migration at all — arguably the *true* easiest starting point if you want a quick visible win.
